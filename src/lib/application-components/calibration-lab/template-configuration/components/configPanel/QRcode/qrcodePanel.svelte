<script lang="ts">
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	function handleQRDataChange(value: string) {
		if (editor?.changeQRData && selectedObject) {
			editor.changeQRData(value);
		}
	}

	function handleQRSizeChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeQRSize && selectedObject) {
			editor.changeQRSize(value);
		}
	}

	function handleQRErrorLevelChange(value: string) {
		if (editor?.changeQRErrorLevel && selectedObject) {
			editor.changeQRErrorLevel(value);
		}
	}

	function handleQRForegroundColorChange(value: string) {
		if (editor?.changeQRForegroundColor && selectedObject) {
			editor.changeQRForegroundColor(value);
		}
	}

	function handleQRBackgroundColorChange(value: string) {
		if (editor?.changeQRBackgroundColor && selectedObject) {
			editor.changeQRBackgroundColor(value);
		}
	}

	function handleQRIncludeMarginChange(checked: boolean) {
		if (editor?.changeQRIncludeMargin && selectedObject) {
			editor.changeQRIncludeMargin(checked);
		}
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">QR Code Properties</h4>

	<div>
		<label for="qr-data" class="text-xs text-gray-600">QR Code Data</label>
		<textarea
			id="qr-data"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			rows="3"
			value={selectedObject?.data?.template ?? ''}
			placeholder="Enter QR code data (text, URL, etc.)"
			oninput={(e) => handleQRDataChange((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="qr-size" class="text-xs text-gray-600">Size</label>
			<input
				id="qr-size"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.width ?? 100}
				oninput={(e) => handleQRSizeChange(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="qr-error-level" class="text-xs text-gray-600">Error Correction</label>
			<select
				id="qr-error-level"
				value={selectedObject?.data?.errorCorrectionLevel ?? 'M'}
				onchange={(e) => handleQRErrorLevelChange((e.target as HTMLSelectElement).value)}
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
				value={selectedObject?.fill ?? '#000000'}
				onchange={(e) => handleQRForegroundColorChange((e.target as HTMLInputElement).value)}
			/>
		</div>

		<div>
			<label for="qr-bg-color" class="text-xs text-gray-600">Background Color</label>
			<input
				id="qr-bg-color"
				type="color"
				class="w-full rounded border border-gray-300 p-1"
				value={selectedObject?.data?.backgroundColor ?? '#ffffff'}
				onchange={(e) => handleQRBackgroundColorChange((e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>

	<div>
		<label class="flex items-center gap-2 text-xs text-gray-600">
			<input
				type="checkbox"
				checked={selectedObject?.data?.includeMargin ?? true}
				onchange={(e) => handleQRIncludeMarginChange((e.target as HTMLInputElement).checked)}
			/>
			Include Margin
		</label>
	</div>
</div>
