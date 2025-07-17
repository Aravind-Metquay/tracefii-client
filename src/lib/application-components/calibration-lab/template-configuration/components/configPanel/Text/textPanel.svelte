<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		AlignLeft,
		AlignCenter,
		AlignRight,
		Bold,
		Italic,
		Underline,
		Strikethrough
	} from 'lucide-svelte';

	let editor = $props();

	const stylePresets = [
		{ label: 'Title', size: 36, weight: 800 },
		{ label: 'Heading 1', size: 28, weight: 700 },
		{ label: 'Heading 2', size: 20, weight: 600 },
		{ label: 'Body', size: 16, weight: 400 },
		{ label: 'Caption', size: 12, weight: 400 }
	];

	const fontSizes = [12, 14, 16, 18, 20, 24, 28, 36];

	let properties = $state({
		fontSize: 16,
		fontWeight: 400,
		fontStyle: 'normal',
		fontUnderline: false,
		fontLinethrough: false,
		textAlign: 'left',
		textColor: { r: 0, g: 0, b: 0 }
	});

	let colorPickerOpen = $state(false);

	function hexToRgb(hex: string) {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: { r: 0, g: 0, b: 0 };
	}

	function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
		return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
	}

	function handleChange(key: string, value: any) {
		properties = { ...properties, [key]: value };

		switch (key) {
			case 'fontSize':
				editor.changeFontSize(value);
				break;
			case 'fontWeight':
				editor.changeFontWeight(value);
				break;
			case 'fontStyle':
				editor.changeFontStyle(value);
				break;
			case 'fontUnderline':
				editor.changeFontUnderline(value);
				break;
			case 'fontLinethrough':
				editor.changeFontLinethrough(value);
				break;
			case 'textAlign':
				editor.changeTextAlign(value);
				break;
			case 'textColor':
				editor.changeFillColor(rgbToHex(value));
				break;
		}
	}

	function updateProperties() {
		properties.fontSize = editor.getActiveFontSize() ?? 16;
		properties.fontWeight = editor.getActiveFontWeight() ?? 400;
		properties.fontStyle = editor.getActiveFontStyle() ?? 'normal';
		properties.fontUnderline = editor.getActiveFontUnderline() ?? false;
		properties.fontLinethrough = editor.getActiveFontLinethrough() ?? false;
		properties.textAlign = editor.getActiveTextAlign() ?? 'left';

		const fillColor = editor.getActiveFillColor();
		properties.textColor = fillColor ? hexToRgb(fillColor) : { r: 0, g: 0, b: 0 };
	}

	function handlePresetChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const preset = stylePresets.find((p) => p.label === target.value);
		if (preset) {
			handleChange('fontSize', preset.size);
			handleChange('fontWeight', preset.weight);
		}
	}

	function handleFontSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		handleChange('fontSize', +target.value);
	}

	function toggleColorPicker() {
		colorPickerOpen = !colorPickerOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		const colorPicker = document.getElementById('color-picker');
		const colorButton = document.getElementById('color-button');

		if (
			colorPicker &&
			colorButton &&
			!colorPicker.contains(event.target as Node) &&
			!colorButton.contains(event.target as Node)
		) {
			colorPickerOpen = false;
		}
	}

	onMount(() => {
		const canvas = editor.canvas;
		updateProperties();

		canvas.on('selection:created', updateProperties);
		canvas.on('selection:updated', updateProperties);
		canvas.on('selection:cleared', updateProperties);

		document.addEventListener('click', handleClickOutside);
	});

	onDestroy(() => {
		const canvas = editor.canvas;

		canvas.off('selection:created', updateProperties);
		canvas.off('selection:updated', updateProperties);
		canvas.off('selection:cleared', updateProperties);

		document.removeEventListener('click', handleClickOutside);
	});
</script>

<div class="space-y-4">
	<!-- Style Preset -->
	<div class="flex flex-col gap-1">
		<label for="style-preset" class="text-sm font-normal text-gray-700">Style Preset *</label>
		<select
			id="style-preset"
			class="w-full rounded-md border border-gray-300 p-2"
			value={stylePresets.find(
				(f) => f.size === properties.fontSize && f.weight === properties.fontWeight
			)?.label || ''}
			onchange={handlePresetChange}
		>
			{#each stylePresets as style}
				<option value={style.label}>{style.label}</option>
			{/each}
		</select>
	</div>

	<!-- Font Size -->
	<div class="flex flex-col gap-1">
		<label for="font-size" class="text-sm font-normal text-gray-700">Font Size *</label>
		<select
			id="font-size"
			class="w-full rounded-md border border-gray-300 p-2"
			value={properties.fontSize}
			onchange={handleFontSizeChange}
		>
			{#each fontSizes as size}
				<option value={size}>{size}</option>
			{/each}
		</select>
	</div>

	<!-- Typography Buttons -->
	<div class="flex gap-2">
		<button
			class="rounded-md border border-gray-300 p-2 {properties.fontWeight > 500
				? 'bg-gray-200'
				: ''}"
			onclick={() => handleChange('fontWeight', properties.fontWeight > 500 ? 400 : 700)}
			type="button"
		>
			<Bold size={15} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.fontStyle === 'italic'
				? 'bg-gray-200'
				: ''}"
			onclick={() =>
				handleChange('fontStyle', properties.fontStyle === 'italic' ? 'normal' : 'italic')}
			type="button"
		>
			<Italic size={15} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.fontUnderline ? 'bg-gray-200' : ''}"
			onclick={() => handleChange('fontUnderline', !properties.fontUnderline)}
			type="button"
		>
			<Underline size={15} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.fontLinethrough
				? 'bg-gray-200'
				: ''}"
			onclick={() => handleChange('fontLinethrough', !properties.fontLinethrough)}
			type="button"
		>
			<Strikethrough size={15} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.textAlign === 'left'
				? 'bg-gray-200'
				: ''}"
			onclick={() => handleChange('textAlign', 'left')}
			type="button"
		>
			<AlignLeft size={18} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.textAlign === 'center'
				? 'bg-gray-200'
				: ''}"
			onclick={() => handleChange('textAlign', 'center')}
			type="button"
		>
			<AlignCenter size={18} />
		</button>

		<button
			class="rounded-md border border-gray-300 p-2 {properties.textAlign === 'right'
				? 'bg-gray-200'
				: ''}"
			onclick={() => handleChange('textAlign', 'right')}
			type="button"
		>
			<AlignRight size={18} />
		</button>
	</div>

	<!-- Text Color -->
	<div class="relative flex flex-col gap-1">
		<label for="color-button" class="text-sm font-normal text-gray-700">Text Color</label>
		<div
			id="color-button"
			class="h-6 w-6 cursor-pointer rounded-full border border-gray-300"
			style="background-color: {rgbToHex(properties.textColor)}"
			onclick={toggleColorPicker}
		></div>

		{#if colorPickerOpen}
			<div
				id="color-picker"
				class="absolute z-10 mt-1 rounded-md bg-white p-3 shadow-lg"
				style="top: 100%;"
			>
				<div class="color-picker-container">
					<!-- Simple color picker implementation -->
					<div class="grid grid-cols-5 gap-2">
						{#each ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFFFFF', '#888888', '#FF8800'] as color}
							<div
								class="h-6 w-6 cursor-pointer rounded-full border border-gray-300"
								style="background-color: {color}"
								onclick={() => {
									handleChange('textColor', hexToRgb(color));
									colorPickerOpen = false;
								}}
							></div>
						{/each}
					</div>

					<!-- RGB sliders -->
					<div class="mt-2">
						<label for="red-slider" class="text-xs">Red</label>
						<input
							id="red-slider"
							type="range"
							min="0"
							max="255"
							bind:value={properties.textColor.r}
							oninput={() => handleChange('textColor', properties.textColor)}
							class="w-full"
						/>

						<label for="green-slider" class="text-xs">Green</label>
						<input
							id="green-slider"
							type="range"
							min="0"
							max="255"
							bind:value={properties.textColor.g}
							oninput={() => handleChange('textColor', properties.textColor)}
							class="w-full"
						/>

						<label for="blue-slider" class="text-xs">Blue</label>
						<input
							id="blue-slider"
							type="range"
							min="0"
							max="255"
							bind:value={properties.textColor.b}
							oninput={() => handleChange('textColor', properties.textColor)}
							class="w-full"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	select {
		appearance: auto;
	}

	button {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.color-picker-container {
		width: 200px;
	}
</style>
