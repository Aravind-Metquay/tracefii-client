<script lang="ts">
	import type { FabricObject } from 'fabric';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	function handleBarcodeDataChange(value: string) {
		if (editor?.changeBarcodeData && selectedObject) {
			editor.changeBarcodeData(value);
		}
	}

	function handleBarcodeTypeChange(value: string) {
		if (editor?.changeBarcodeType && selectedObject) {
			editor.changeBarcodeType(value);
		}
	}

	function handleBarcodeWidthChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeBarcodeWidth && selectedObject) {
			editor.changeBarcodeWidth(value);
		}
	}

	function handleBarcodeHeightChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeBarcodeHeight && selectedObject) {
			editor.changeBarcodeHeight(value);
		}
	}

	function handleBarcodeShowTextChange(checked: boolean) {
		if (editor?.changeBarcodeShowText && selectedObject) {
			editor.changeBarcodeShowText(checked);
		}
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Barcode Properties</h4>

	<div>
		<label for="barcode-data" class="text-xs text-gray-600">Barcode Data</label>
		<input
			id="barcode-data"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.data?.template ?? ''}
			placeholder="Enter barcode data"
			oninput={(e) => handleBarcodeDataChange((e.target as HTMLInputElement).value)}
			disabled={!selectedObject || !editor?.changeBarcodeData}
		/>
	</div>

	<div>
		<label for="barcode-type" class="text-xs text-gray-600">Barcode Type</label>
		<select
			id="barcode-type"
			value={selectedObject?.data?.format ?? 'CODE128'}
			onchange={(e) => handleBarcodeTypeChange((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
			disabled={!selectedObject || !editor?.changeBarcodeType}
		>
			<option value="CODE128">CODE128</option>
			<option value="CODE39">CODE39</option>
			<option value="EAN13">EAN13</option>
			<option value="UPC">UPC</option>
			<option value="ITF">ITF</option>
		</select>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="barcode-width" class="text-xs text-gray-600">Width</label>
			<input
				id="barcode-width"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.width ?? 200}
				oninput={(e) => handleBarcodeWidthChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeBarcodeWidth}
			/>
		</div>

		<div>
			<label for="barcode-height" class="text-xs text-gray-600">Height</label>
			<input
				id="barcode-height"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.height ?? 50}
				oninput={(e) => handleBarcodeHeightChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeBarcodeHeight}
			/>
		</div>
	</div>

	<div>
		<label class="flex items-center gap-2 text-xs text-gray-600">
			<input
				type="checkbox"
				checked={selectedObject?.data?.displayValue ?? true}
				onchange={(e) => handleBarcodeShowTextChange((e.target as HTMLInputElement).checked)}
				disabled={!selectedObject || !editor?.changeBarcodeShowText}
			/>
			Show Text
		</label>
	</div>
</div>
