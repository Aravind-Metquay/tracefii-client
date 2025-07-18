<script lang="ts">
	let { editor } = $props();

	let selectedObject = $derived(editor?.selectedObjects?.[0]);
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Barcode Properties</h4>

	<div>
		<label for="barcode-data" class="text-xs text-gray-600">Barcode Data</label>
		<input
			id="barcode-data"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.data ?? ''}
			placeholder="Enter barcode data"
			oninput={(e) => editor?.changeBarcodeData?.((e.target as HTMLInputElement).value)}
		/>
	</div>

	<div>
		<label for="barcode-type" class="text-xs text-gray-600">Barcode Type</label>
		<select
			id="barcode-type"
			value={selectedObject?.barcodeType ?? 'CODE128'}
			onchange={(e) => editor?.changeBarcodeType?.((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
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
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.width ?? 200}
				oninput={(e) => editor?.changeBarcodeWidth?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="barcode-height" class="text-xs text-gray-600">Height</label>
			<input
				id="barcode-height"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.height ?? 50}
				oninput={(e) => editor?.changeBarcodeHeight?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>
	</div>

	<div>
		<label class="flex items-center gap-2 text-xs text-gray-600">
			<input
				type="checkbox"
				checked={selectedObject?.showText ?? true}
				onchange={(e) => editor?.changeBarcodeShowText?.((e.target as HTMLInputElement).checked)}
			/>
			Show Text
		</label>
	</div>
</div>