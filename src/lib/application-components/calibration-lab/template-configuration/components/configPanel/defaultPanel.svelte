<script lang="ts">
	import TextConfig from './Text/textPanel.svelte';
	// import ImageConfig from './Image/imagePanel.svelte';
	// import BarcodeConfig from './Barcode/barcodePanel.svelte';
	// import DateConfig from './Date/datePanel.svelte';
	// import QRCodeConfig from './QRcode/qrcodePanel.svelte';
	import Toolbar from './toolbarPanel.svelte';

	let { editor, selectedComponentType } = $props();

	let opacity = $state(Math.round((editor?.getActiveOpacity?.() ?? 1) * 100));

	$effect(() => {
		if (selectedComponentType && editor?.getActiveOpacity) {
			const current = editor.getActiveOpacity() ?? 1;
			opacity = Math.round(current * 100);
		}
	});

	function handleOpacityChange(value: number) {
		if (isNaN(value) || value < 0 || value > 100) return;
		if (editor?.changeOpacity) {
			editor.changeOpacity(value / 100);
			opacity = value;
		}
	}

	function handleOpacityInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = parseInt(target.value, 10);
		handleOpacityChange(value);
	}

	function handleOpacityNumberInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = Number(target.value);
		handleOpacityChange(value);
	}
</script>

<div class="h-full w-80 max-w-[320px] min-w-[240px] bg-gray-50">
	{#if selectedComponentType}
		<div class="space-y-6 rounded-xl bg-white p-6 shadow-sm">
			<div class="text-lg font-semibold text-gray-900">Config Panel</div>

			{#if selectedComponentType === 'Text'}
				<TextConfig {editor} />
			<!-- {:else if selectedComponentType === 'Image'}
				<ImageConfig {editor} />
			{:else if selectedComponentType === 'Barcode'}
				<BarcodeConfig {editor} />
			{:else if selectedComponentType === 'Date'}
				<DateConfig {editor} />
			{:else if selectedComponentType === 'QR Code'}
				<QRCodeConfig {editor} /> -->
			{/if}

			<!-- Opacity Control -->
			<div class="flex flex-col gap-3">
				<label for="opacity" class="text-sm font-medium text-gray-900">Opacity</label>
				<div class="flex items-center gap-4">
					<input
						type="range"
						id="opacity"
						min="0"
						max="100"
						step="1"
						value={opacity}
						oninput={handleOpacityInput}
						class="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 accent-blue-500"
					/>
					<input
						type="number"
						min="0"
						max="100"
						step="1"
						value={opacity}
						oninput={handleOpacityNumberInput}
						class="w-20 rounded-lg border border-gray-300 px-2 py-1 text-sm"
					/>
				</div>
			</div>

			<Toolbar {editor} />
		</div>
	{:else}
		<div
			class="flex h-full flex-col items-center justify-center rounded-xl bg-white p-6 text-center text-gray-600 shadow-sm"
		>
			<span class="mb-2 text-2xl">🧩</span>
			<p class="font-medium">No Component Selected</p>
			<p class="text-sm">Select an object to edit its properties</p>
		</div>
	{/if}
</div>

<style>
	/* Custom styles for range input to ensure consistency */
	input[type='range']::-webkit-slider-thumb {
		appearance: none;
		width: 16px;
		height: 16px;
		background: #3b82f6;
		border-radius: 50%;
		cursor: pointer;
	}
	
	input[type='range']::-moz-range-thumb {
		width: 16px;
		height: 16px;
		background: #3b82f6;
		border-radius: 50%;
		cursor: pointer;
		border: none;
	}
</style>