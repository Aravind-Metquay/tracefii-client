<script lang="ts">
	import TextConfig from './textPanel.svelte';
	import ImageConfig from './imagePanel.svelte';
	import BarcodeConfig from './barcodePanel.svelte';
	import DateConfig from './datePanel.svelte';
	import QRCodeConfig from './qrcodePanel.svelte';
	import Toolbar from './toolbar.svelte';



	let { editor, selectedComponentType }: Props = $props();

	let opacity = $state(Math.round((editor.getActiveOpacity() ?? 1) * 100));

	$effect(() => {
		if (selectedComponentType) {
			const current = editor.getActiveOpacity() ?? 1;
			opacity = Math.round(current * 100);
		}
	});

	function handleOpacityChange(value: number) {
		if (value >= 0 && value <= 100) {
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

<div class="h-full w-[20vw] min-w-[240px]">
	{#if selectedComponentType}
		<div class="bg-white rounded-xl p-6 space-y-6">
			<div class="text-lg font-semibold text-gray-900">Config Panel</div>
			
			{#if selectedComponentType === 'Text'}
				<TextConfig {editor} />
			{:else if selectedComponentType === 'Image'}
				<ImageConfig {editor} />
			{:else if selectedComponentType === 'Barcode'}
				<BarcodeConfig {editor} />
			{:else if selectedComponentType === 'Date'}
				<DateConfig {editor} />
			{:else if selectedComponentType === 'QR Code'}
				<QRCodeConfig {editor} />
			{/if}

			<!-- Opacity Control -->
			<div class="flex flex-col gap-3">
				<label class="text-sm font-medium text-gray-900">Opacity</label>
				<div class="flex items-center gap-4">
					<input
						type="range"
						min="0"
						max="100"
						step="1"
						value={opacity}
						oninput={handleOpacityInput}
						class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
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
		<div class="flex flex-col items-center justify-center h-full rounded-xl p-6 text-center text-gray-600">
			<span class="text-2xl mb-2">🧩</span>
			<p class="font-medium">No Component Selected</p>
		</div>
	{/if}
</div>
