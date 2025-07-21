<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);
	let color = $derived<Colord>(
		colord(typeof selectedObject?.fill === 'string' ? selectedObject.fill : '#000000')
	);

	function handleDateFormatChange(value: string) {
		if (editor?.changeDateFormat && selectedObject) {
			editor.changeDateFormat(value);
		}
	}

	function handleDateValueChange(value: string) {
		if (editor?.updateDateValue && selectedObject) {
			editor.updateDateValue(value);
		}
	}

	function handleFontSizeChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeFontSize && selectedObject) {
			editor.changeFontSize(value);
		}
	}

	function handleFontFamilyChange(value: string) {
		if (editor?.changeFontFamily && selectedObject) {
			editor.changeFontFamily(value);
		}
	}

	function handleFontWeightChange() {
		if (editor?.changeFontWeight && selectedObject) {
			editor.changeFontWeight(selectedObject.fontWeight === 'bold' ? 'normal' : 'bold');
		}
	}

	function handleFontStyleChange() {
		if (editor?.changeFontStyle && selectedObject) {
			editor.changeFontStyle(selectedObject.fontStyle === 'italic' ? 'normal' : 'italic');
		}
	}

	function handleFontUnderlineChange() {
		if (editor?.changeFontUnderline && selectedObject) {
			editor.changeFontUnderline(!selectedObject.underline);
		}
	}

	function handleColorChange(colorData: { hex: string | null }) {
		if (colorData.hex && editor?.changeFillColor && selectedObject) {
			editor.changeFillColor(colorData.hex);
		}
	}

	function handleTextAlignChange(value: string) {
		if (editor?.changeTextAlign && selectedObject) {
			editor.changeTextAlign(value);
		}
	}

	function handleOpacityChange(value: number) {
		if (editor?.changeOpacity && selectedObject) {
			editor.changeOpacity(value / 100);
		}
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Date Properties</h4>

	<div>
		<label for="date-format" class="text-xs text-gray-600">Date Format</label>
		<select
			id="date-format"
			value={selectedObject?.customDateFormat ?? 'MM/DD/YYYY'}
			onchange={(e) => handleDateFormatChange((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
		>
			<option value="MM/DD/YYYY">MM/DD/YYYY</option>
			<option value="DD/MM/YYYY">DD/MM/YYYY</option>
			<option value="YYYY-MM-DD">YYYY-MM-DD</option>
			<option value="MMM DD, YYYY">MMM DD, YYYY</option>
			<option value="DD MMM YYYY">DD MMM YYYY</option>
			<option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
		</select>
	</div>

	<div>
		<label for="date-value" class="text-xs text-gray-600">Date Value</label>
		<input
			id="date-value"
			type="date"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.customDateValue
				? new Date(selectedObject.customDateValue).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0]}
			onchange={(e) => handleDateValueChange((e.target as HTMLInputElement).value)}
		/>
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
				disabled={!selectedObject || !editor?.changeFontSize}
			/>
		</div>

		<div>
			<label for="date-font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="date-font-family"
				value={selectedObject?.fontFamily ?? 'Arial'}
				onchange={(e) => handleFontFamilyChange((e.target as HTMLSelectElement).value)}
				class="w-full rounded border border-gray-300 p-2 text-sm"
				disabled={!selectedObject || !editor?.changeFontFamily}
			>
				<option>Arial</option>
				<option>Helvetica</option>
				<option>Times New Roman</option>
				<option>Georgia</option>
				<option>Verdana</option>
			</select>
		</div>
	</div>

	<!-- Font Style Controls -->
	<div class="flex items-center gap-4">
		<button
			onclick={handleFontWeightChange}
			class={`rounded-md border border-gray-300 p-2 font-bold ${selectedObject?.fontWeight === 'bold' ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontWeight}
		>
			B
		</button>

		<button
			onclick={handleFontStyleChange}
			class={`rounded-md border border-gray-300 p-2 italic ${selectedObject?.fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontStyle}
		>
			I
		</button>

		<button
			onclick={handleFontUnderlineChange}
			class={`rounded-md border border-gray-300 p-2 underline ${selectedObject?.underline ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontUnderline}
		>
			U
		</button>
	</div>

	<!-- Text Alignment -->
	<div>
		<label for="text-align" class="text-xs text-gray-600">Text Alignment</label>
		<select
			id="text-align"
			value={selectedObject?.textAlign ?? 'left'}
			onchange={(e) => handleTextAlignChange((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
			disabled={!selectedObject || !editor?.changeTextAlign}
		>
			<option value="left">Left</option>
			<option value="center">Center</option>
			<option value="right">Right</option>
			<option value="justify">Justify</option>
		</select>
	</div>

	<!-- Color Picker -->
	<div class="flex flex-col gap-2">
		<label for="fill-color" class="text-xs text-gray-600">Fill Color</label>
		<div class="w-full">
			<ColorPicker bind:color onInput={handleColorChange} />
		</div>
	</div>

	<!-- Opacity Control -->
	<div>
		<label for="opacity" class="text-xs text-gray-600">Opacity</label>
		<input
			id="opacity"
			type="range"
			min="0"
			max="100"
			class="w-full"
			value={selectedObject?.opacity ? selectedObject.opacity * 100 : 100}
			oninput={(e) => handleOpacityChange(Number((e.target as HTMLInputElement).value))}
			disabled={!selectedObject || !editor?.changeOpacity}
		/>
		<div class="text-xs text-gray-500 text-center">
			{selectedObject?.opacity ? Math.round(selectedObject.opacity * 100) : 100}%
		</div>
	</div>
</div>
