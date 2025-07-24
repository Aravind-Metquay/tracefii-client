<script lang="ts">
	import * as fabric from 'fabric';
	import QRCode from 'qrcode';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();

	// Reactive state for the UI
	let expression = $state('{{default_qrcode}}');
	let errorLevel = $state('H');
	let evaluatedValue = $state('');
	let isUpdating = $state(false);

	// Derived state to identify the selected object
	let selectedObject = $derived(editor?.selectedObjects?.[0] as ExtendedFabricObject | undefined);
	let isQRCodeSelected = $derived(selectedObject?.data?.type === 'QR Code');

	let debounceTimer: NodeJS.Timeout | null = null;

	// Effect to sync UI with the selected object's properties (READ)
	$effect(() => {
		if (isQRCodeSelected && selectedObject?.data) {
			expression = selectedObject.data.expression || '{{default_qrcode}}';
			errorLevel = selectedObject.data.errorCorrectionLevel || 'H';
		}
	});

	// Effect to update the preview whenever the expression changes
	$effect(() => {
		evaluatedValue = expression.replace('{{default_qrcode}}', `https://metquay.com/generated/${Date.now()}`);
	});

	/**
	 * Updates the currently selected QR code object on the canvas.
	 */
	const updateSelectedQRCode = async () => {
 		if (isUpdating || !isQRCodeSelected || !selectedObject || !editor.canvas) {
 			return;
 		}
 		isUpdating = true;

 		try {
 			// Cast the selected object to a Fabric Image to access its methods
 			const objectToUpdate = selectedObject as fabric.Image & ExtendedFabricObject;
 			const canvas = editor.canvas;

			//Storing the current visual dimensions of the object on the canvas
			 const originalScaledWidth = objectToUpdate.getScaledWidth();
       		 const originalScaledHeight = objectToUpdate.getScaledHeight();

 			// 1. Generate the new QR Code image data URL
 			const newUrl = await QRCode.toDataURL(evaluatedValue, {
 				errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H',
 				width: 256, // Use a consistent width for generation
 				margin: 1
 			});

 			// 2. IMPORTANT: Update the custom data on the *existing* object
 			objectToUpdate.set('data', {
 				...objectToUpdate.data,
 				expression: expression,
 				errorCorrectionLevel: errorLevel
 			});

 			// 3. Use setSrc() to replace the image content in-place.
 			 await objectToUpdate.setSrc(newUrl, { crossOrigin: 'anonymous' });
			 objectToUpdate.scaleX = originalScaledWidth / (objectToUpdate.width ?? 1);
        	objectToUpdate.scaleY = originalScaledHeight / (objectToUpdate.height ?? 1);
			
			 canvas.requestRenderAll();
 		
 
            
            // 4. Notify Fabric that the object was modified (for undo/redo history)
            canvas.fire('object:modified', { target: objectToUpdate });

 		} catch (error) {
 			console.error('QR Code update failed:', error);
 		} finally {
 			isUpdating = false;
 		}
 	};

	const debouncedUpdate = () => {
		if (debounceTimer) clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			updateSelectedQRCode();
		}, 500);
	};

	
	
	/**
	 * Handles user input for the QR code content. (WRITE)
	 */
	const handleExpressionInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		expression = target.value; // 1. Update state immediately for a responsive UI
		debouncedUpdate();         // 2. Then, trigger the canvas update
	};

	/**
	 * Handles changes to the error correction level. (WRITE)
	 */
	const handleErrorLevelChange = (event: Event) => {
		const target = event.target as HTMLSelectElement;
		errorLevel = target.value; // 1. Update state immediately
		debouncedUpdate();         // 2. Then, trigger the canvas update
	};

	// Cleanup effect
	$effect(() => {
		return () => {
			if (debounceTimer) clearTimeout(debounceTimer);
		};
	});
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">QR Code Properties</h4>

	<div class="flex flex-col gap-1">
		<label for="error-level" class="text-xs text-gray-600"> Error Correction Level </label>
		<select
			id="error-level"
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
			disabled={!isQRCodeSelected || isUpdating}
			value={errorLevel}
			onchange={handleErrorLevelChange}
		>
			<option value="L">Low (~7%)</option>
			<option value="M">Medium (~15%)</option>
			<option value="Q">Quartile (~25%)</option>
			<option value="H">High (~30%)</option>
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for="expression" class="text-xs text-gray-600">QR Code Content</label>
		<input
			id="expression"
			type="text"
			class="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
			placeholder="Enter URL or text"
			disabled={!isQRCodeSelected || isUpdating}
			value={expression}
			oninput={handleExpressionInput}
		/>
		<div class="mt-1 text-xs text-gray-500">
			<div class="font-medium">Preview:</div>
			<div class="break-all" title={evaluatedValue}>
				{evaluatedValue.length > 50 ? evaluatedValue.substring(0, 50) + '...' : evaluatedValue}
			</div>
		</div>
	</div>

	{#if isUpdating}
		<div class="flex items-center gap-2 text-xs text-blue-600">
			<div
				class="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"
			></div>
			Generating QR code...
		</div>
	{/if}

	
</div>