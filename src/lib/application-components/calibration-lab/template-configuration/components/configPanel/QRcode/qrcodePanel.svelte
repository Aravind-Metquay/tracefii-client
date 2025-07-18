<script lang="ts">
	let { editor } = $props();

	let selectedObject = $derived(editor?.selectedObjects?.[0]);
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">QR Code Properties</h4>

	<div>
		<label for="qr-data" class="text-xs text-gray-600">QR Code Data</label>
		<textarea
			id="qr-data"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			rows="3"
			value={selectedObject?.data ?? ''}
			placeholder="Enter QR code data (text, URL, etc.)"
			oninput={(e) => editor?.changeQRData?.((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="qr-size" class="text-xs text-gray-600">Size</label>
			<input
				id="qr-size"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.size ?? 100}
				oninput={(e) => editor?.changeQRSize?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="qr-error-level" class="text-xs text-gray-600">Error Correction</label>
			<select
				id="qr-error-level"
				value={selectedObject?.errorCorrectionLevel ?? 'M'}
				onchange={(e) => editor?.changeQRErrorLevel?.((e.target as HTMLSelectElement).value)}
				class="w-full rounded border border-gray-300 p-2 text-sm"
			>
				<option value="L">Low (7%)</option>
				<option value="M">Medium (15%)</option>
				<option value="Q">Quartile (25%)</option>
				<option value="H">High (30%)</option>
			</select>
		</div>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="qr-fg-color" class="text-xs text-gray-600">Foreground Color</label>
			<input
				id="qr-fg-color"
				type="color"
				class="w-full rounded border border-gray-300 p-1"
				value={selectedObject?.foregroundColor ?? '#000000'}
				onchange={(e) => editor?.changeQRForegroundColor?.((e.target as HTMLInputElement).value)}
			/>
		</div>

		<div>
			<label for="qr-bg-color" class="text-xs text-gray-600">Background Color</label>
			<input
				id="qr-bg-color"
				type="color"
				class="w-full rounded border border-gray-300 p-1"
				value={selectedObject?.backgroundColor ?? '#ffffff'}
				onchange={(e) => editor?.changeQRBackgroundColor?.((e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>

	<div>
		<label class="flex items-center gap-2 text-xs text-gray-600">
			<input
				type="checkbox"
				checked={selectedObject?.includeMargin ?? true}
				onchange={(e) => editor?.changeQRIncludeMargin?.((e.target as HTMLInputElement).checked)}
			/>
			Include Margin
		</label>
	</div>
</div>