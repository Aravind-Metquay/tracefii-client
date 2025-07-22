<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';

	let { editor } = $props<{ editor: Editor }>();

	const selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	const dateValue = $derived<string>(
		selectedObject?.customDateValue
			? new Date(selectedObject.customDateValue).toISOString().split('T')[0]
			: ''
	);

	const dateFormat = $derived<string>(selectedObject?.customDateFormat ?? 'MM/DD/YYYY');

	const fontSize = $derived<number>(Number(selectedObject?.fontSize) || 16);
	const fontWeight = $derived<number>(Number(selectedObject?.fontWeight) || 400);
	const fontStyle = $derived<string>(selectedObject?.fontStyle ?? 'normal');
	const underline = $derived<boolean>(selectedObject?.underline ?? false);
	const textAlign = $derived<string>(selectedObject?.textAlign ?? 'left');

	let color = $derived<Colord>(
		colord(typeof selectedObject?.fill === 'string' ? selectedObject.fill : '#000000')
	);

	const dateFormats = [
		'MM/DD/YYYY',
		'DD/MM/YYYY',
		'YYYY-MM-DD',
		'MMMM D, YYYY',
		'MMM DD, YYYY',
		'DD MMM YYYY'
	];


	function handleDateFormatChange(format: string) {
		editor?.changeDateFormat?.(format);
	}

	function handleFontSizeChange(size: number) {
		editor?.changeFontSize?.(size);
	}

	function handleFontFamilyChange(family: string) {
		editor?.changeFontFamily?.(family);
	}

	function handleDateValueChange(value: string) {
		try {
			const iso = new Date(value).toISOString();
			editor?.updateDateValue?.(iso);
		} catch {
			editor?.updateDateValue?.(value);
		}
	}

	function getActiveFontUnderline(): boolean {
		if (!selectedObject) return false;
		return selectedObject.underline || false;
	}

	function getActiveFontStyle(): string {
		if (!selectedObject) return 'normal';
		return selectedObject.fontStyle || 'normal';
	}

	function getActiveFontWeight(): number {
		if (!selectedObject) return 400;
		return Number(selectedObject.fontWeight) || 400;
	}

	function handleFontWeightChange() {
		const weight = Number(selectedObject?.fontWeight) || 400;
		editor?.changeFontWeight?.(weight >= 700 ? 400 : 700);
	}

	function handleFontStyleChange() {
		const style = selectedObject?.fontStyle ?? 'normal';
		editor?.changeFontStyle?.(style === 'italic' ? 'normal' : 'italic');
	}

	function handleFontUnderlineChange() {
		const underline = selectedObject?.underline ?? false;
		editor?.changeFontUnderline?.(!underline);
	}

	function handleColorChange({ hex }: { hex: string | null }) {
		if (hex) editor?.changeFillColor?.(hex);
	}

	function handleTextAlignChange(alignment: string) {
		editor?.changeTextAlign?.(alignment);
	}
</script>

<div class="space-y-4">
	<!-- Date Value -->
	<div class="flex flex-col gap-1">
		<label for="date-label" class="text-sm text-gray-700">Date Value</label>
		<input
			type="date"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={dateValue}
			onchange={(e) => handleDateValueChange((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Date Format -->
	<div class="flex flex-col gap-1">
		<label for="date-format" class="text-sm text-gray-700">Date Format</label>
		<select
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={dateFormat}
			onchange={(e) => handleDateFormatChange((e.target as HTMLSelectElement).value)}
		>
			{#each dateFormats as format}
				<option value={format}>{format}</option>
			{/each}
		</select>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="date-font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="date-font-size"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.fontSize ?? 16}
				oninput={(e) => handleFontSizeChange(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="date-font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="date-font-family"
				value={selectedObject?.fontFamily ?? 'Arial'}
				onchange={(e) => handleFontFamilyChange((e.target as HTMLSelectElement).value)}
				class="w-full rounded border border-gray-300 p-2 text-sm"
			>
				<option>Arial</option>
				<option>Helvetica</option>
				<option>Times New Roman</option>
				<option>Georgia</option>
				<option>Verdana</option>
			</select>
		</div>
	</div>

	<!-- Fill Color -->
	<div class="flex flex-col gap-1">
		<label for="text-color" class="text-sm text-gray-700">Text Color</label>
		<ColorPicker bind:color onInput={handleColorChange} />
	</div>

	<!-- Font Styles -->
	<div class="flex items-center gap-2">
		<button
			class={`rounded border p-2 ${getActiveFontWeight() >= 700 ? 'bg-gray-200' : ''}`}
			onclick={handleFontWeightChange}
		>
			<Bold size={16} />
		</button>

		<button
			class={`rounded border p-2 italic ${getActiveFontStyle() === 'italic' ? 'bg-gray-200' : ''}`}
			onclick={handleFontStyleChange}
		>
			<Italic size={16} />
		</button>

		<button
			class={`rounded border p-2 underline ${getActiveFontUnderline() ? 'bg-gray-200' : ''}`}
			onclick={handleFontUnderlineChange}
		>
			<Underline size={16} />
		</button>
		<button
			class={`rounded border p-2 ${textAlign === 'left' ? 'bg-gray-200' : ''}`}
			onclick={() => handleTextAlignChange('left')}
		>
			<AlignLeft size={16} />
		</button>

		<button
			class={`rounded border p-2 ${textAlign === 'center' ? 'bg-gray-200' : ''}`}
			onclick={() => handleTextAlignChange('center')}
		>
			<AlignCenter size={16} />
		</button>

		<button
			class={`rounded border p-2 ${textAlign === 'right' ? 'bg-gray-200' : ''}`}
			onclick={() => handleTextAlignChange('right')}
		>
			<AlignRight size={16} />
		</button>
	</div>
</div>
