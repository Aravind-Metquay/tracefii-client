<script lang="ts">
	import JsBarcode from 'jsbarcode';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';
	import * as fabric from 'fabric';

	let { editor } = $props<{ editor: Editor }>();

	// --- Reactive state for the UI ---
	let expression = $state('BAR##date_code##');
	let evaluatedValue = $state('');
	let format = $state('CODE128');
	let barWidth = $state(2);
	let barHeight = $state(50);
	let displayValue = $state(true);
	let isUpdating = $state(false);
	let errorMessage = $state('');

	// --- Derived state for selection ---
	let selectedObject = $derived(editor?.selectedObjects?.[0] as ExtendedFabricObject | undefined);
	let isBarcodeSelected = $derived(selectedObject?.data?.type === 'Barcode');

	let debounceTimer: NodeJS.Timeout | null = null;

	// --- Effect to sync UI when a new barcode is selected ---
	$effect(() => {
		if (isBarcodeSelected && selectedObject?.data) {
			const data = selectedObject.data;
			expression = data.expression || 'BAR##date_code##';
			format = data.format || 'CODE128';
			barWidth = data.barWidth || 2;
			barHeight = data.barHeight || 50;
			displayValue = data.displayValue ?? true;
		}
	});

	// --- Function to evaluate the expression ---
	function evaluateExpression(expr: string): string {
		const today = new Date();
		const dateCode = `${today.getFullYear()}${(today.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
		// FIX: Matching the safer placeholder format.
		return expr.replace(/##date_code##/gi, dateCode);
	}

	// --- Effect to update the preview whenever the expression changes ---
	$effect(() => {
		evaluatedValue = evaluateExpression(expression);
	});

	/**
	 * Updates the currently selected barcode object on the canvas in-place.
	 */
	const updateSelectedBarcode = async () => {
		if (isUpdating || !isBarcodeSelected || !selectedObject || !editor.canvas) {
			return;
		}
		isUpdating = true;
		errorMessage = '';

		try {
			const objectToUpdate = selectedObject as fabric.Image & ExtendedFabricObject;
			const canvas = editor.canvas;

			const tempCanvas = document.createElement('canvas');
			JsBarcode(tempCanvas, evaluatedValue, {
				format,
				width: barWidth,
				height: barHeight,
				displayValue,
				fontOptions: 'bold'
			});

			const newUrl = tempCanvas.toDataURL();

			objectToUpdate.set('data', {
				...objectToUpdate.data,
				expression,
				format,
				barWidth,
				barHeight,
				displayValue
			});

			await objectToUpdate.setSrc(newUrl, { crossOrigin: 'anonymous' });
			canvas.requestRenderAll();

			canvas.fire('object:modified', { target: objectToUpdate });
		} catch (error: any) {
			console.error('Barcode update failed:', error);
			errorMessage = error.message.replace('JsBarcode', 'Barcode');
		} finally {
			isUpdating = false;
		}
	};

	// --- Debounce and Handler Functions ---
	const debouncedUpdate = () => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			updateSelectedBarcode();
		}, 300);
	};

	const handleInput = (updateFn: () => void) => {
		updateFn();
		debouncedUpdate();
	};

	$effect(() => {
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Barcode Properties</h4>

	<div class="flex flex-col gap-1">
		<label for="barcode-format" class="text-xs text-gray-600">Barcode Format</label>
		<select
			id="barcode-format"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			disabled={!isBarcodeSelected || isUpdating}
			value={format}
			onchange={(e) => handleInput(() => (format = (e.target as HTMLSelectElement).value))}
		>
			<option value="CODE128">CODE128</option>
			<option value="CODE39">CODE39</option>
			<option value="EAN13">EAN13</option>
			<option value="UPC">UPC</option>
			<option value="ITF">ITF</option>
			
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for="barcode-expression" class="text-xs text-gray-600">Barcode Data / Expression</label>
		<input
			id="barcode-expression"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			placeholder="e.g., BAR##date_code##"
			disabled={!isBarcodeSelected || isUpdating}
			value={expression}
			oninput={(e) => handleInput(() => (expression = (e.target as HTMLInputElement).value))}
		/>
		<p class="mt-1 w-full truncate text-xs text-gray-500" title={evaluatedValue}>
			<span class="font-medium">Preview:</span> {evaluatedValue}
		</p>
	</div>

	<div class="grid grid-cols-2 gap-4">
		<div class="flex flex-col gap-1">
			<label for="barcode-width" class="text-xs text-gray-600">Bar Width</label>
			<input
				id="barcode-width"
				type="number"
				min="1"
				max="10"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				disabled={!isBarcodeSelected || isUpdating}
				value={barWidth}
				oninput={(e) => handleInput(() => (barWidth = Number((e.target as HTMLInputElement).value)))}
			/>
		</div>
		<div class="flex flex-col gap-1">
			<label for="barcode-height" class="text-xs text-gray-600">Height</label>
			<input
				id="barcode-height"
				type="number"
				min="10"
				max="500"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				disabled={!isBarcodeSelected || isUpdating}
				value={barHeight}
				oninput={(e) => handleInput(() => (barHeight = Number((e.target as HTMLInputElement).value)))}
			/>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<input
			id="display-value"
			type="checkbox"
			class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
			disabled={!isBarcodeSelected || isUpdating}
			checked={displayValue}
			onchange={(e) => handleInput(() => (displayValue = (e.target as HTMLInputElement).checked))}
		/>
		<label for="display-value" class="text-sm text-gray-700"> Show Text </label>
	</div>

	{#if isUpdating}
		<div class="flex items-center gap-2 text-xs text-blue-600">
			<div class="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
			Generating...
		</div>
	{/if}
	{#if errorMessage}
		<div class="text-xs font-medium text-red-600">Error: {errorMessage}</div>
	{/if}
</div>