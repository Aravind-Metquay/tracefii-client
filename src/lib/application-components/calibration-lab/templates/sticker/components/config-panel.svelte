<script lang="ts">
	import type * as fabric from 'fabric';
	import ActionPanel from './configpanel/action-panel.svelte';
	import QRCodePanel from './configpanel/qrcode-panel.svelte';
	import BarcodePanel from './configpanel/barcode-panel.svelte';
	import ImagePanel from './configpanel/image-panel.svelte';
	import TextPanel from './configpanel/text-panel.svelte';

	// Receive all state and update functions from the parent
	let {
		selectedObjectType,
		selectedObject,
		fontFamily = $bindable(),
		fontSize = $bindable(),
		fontWeight = $bindable(),
		fontStyle = $bindable(),
		textAlign = $bindable(),
		textUnderline = $bindable(),
		opacity = $bindable(),
		fillColor = $bindable(),
		updateFontFamily,
		updateFontSize,
		updateFontWeight,
		updateFontStyle,
		updateTextAlign,
		toggleUnderline,
		updateOpacity,
		updateFillColor,
		bringForward,
		sendBackwards,
		duplicateSelected,
		deleteSelected,
		updateQRCode,
		updateBarcode,
		updateImageDimensions,
		toggleBold,
		toggleItalic,
		setTextAlign
	} = $props();
</script>

<div class="h-full w-full">
	{#if selectedObjectType && selectedObject}
		<div class="flex h-full flex-col bg-white">
			<div class="shrink-0 border-b p-4">
				<div class="text-lg font-semibold">Config Panel</div>
			</div>

			<div class="scrollbar-hide flex-1 overflow-y-auto p-4">
				<div class="space-y-6">
					{#if selectedObjectType.includes('text')}
						<TextPanel
							bind:fontFamily
							bind:fontSize
							bind:fontWeight
							bind:fontStyle
							bind:textAlign
							bind:textUnderline
							bind:fillColor
							bind:opacity
							{updateFontFamily}
							{updateFontSize}
							{updateFillColor}
							{updateOpacity}
							{toggleBold}
							{toggleItalic}
							{toggleUnderline}
							{setTextAlign}
						/>
					{/if}

					{#if selectedObject?.type === 'image' && selectedObject.data?.type !== 'QR Code' && selectedObject.data?.type !== 'Barcode'}
						<ImagePanel {selectedObject} {updateImageDimensions} />
					{/if}

					{#if selectedObject?.data?.type === 'QR Code'}
						<QRCodePanel {selectedObject} {updateQRCode} />
					{/if}

					{#if selectedObject?.data?.type === 'Barcode'}
						<BarcodePanel {selectedObject} {updateBarcode} />
					{/if}

					{#if !selectedObjectType.includes('text')}
						<div>
							<h3 class="mb-3 text-sm font-semibold uppercase text-gray-600">Object Properties</h3>
							<div class="space-y-3">
								{#if selectedObject?.type !== 'image'}
									<div class="flex items-center gap-2">
										<label for="fill-color" class="w-20 text-xs text-gray-600">Fill Color</label>
										<input
											id="fill-color"
											type="color"
											bind:value={fillColor}
											oninput={updateFillColor}
											class="h-8 flex-1 rounded border border-gray-300"
										/>
									</div>
								{/if}
								<div class="flex items-center gap-2">
									<label for="opacity" class="w-20 text-xs text-gray-600">Opacity</label>
									<input
										id="opacity"
										type="range"
										bind:value={opacity}
										oninput={updateOpacity}
										min="0"
										max="1"
										step="0.01"
										class="flex-1"
									/>
									<span class="w-10 text-right text-xs text-gray-600"
										>{Math.round(opacity * 100)}%</span
									>
								</div>
							</div>
						</div>
					{/if}

					<ActionPanel {bringForward} {sendBackwards} {duplicateSelected} {deleteSelected} />
				</div>
			</div>
		</div>
	{:else}
		<div class="flex h-full flex-col items-center justify-center p-4 text-center">
			<p class="font-medium text-gray-700">No Object Selected</p>
			<p class="text-sm text-gray-500">Click an object on the canvas to see its properties.</p>
		</div>
	{/if}
</div>

<style>
	.scrollbar-hide {
		scrollbar-width: none;
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
</style>