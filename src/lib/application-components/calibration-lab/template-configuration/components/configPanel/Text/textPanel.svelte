<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { FabricObject } from 'fabric';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);
	let color = $derived<Colord>(
		colord(typeof selectedObject?.fill === 'string' ? selectedObject.fill : '#000000')
	);

	function handleTextChange(value: string) {
		if (editor?.changeText && selectedObject) {
			editor.changeText(value);
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
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Text Properties</h4>

	<div>
		<label for="content" class="text-xs text-gray-600">Content</label>
		<input
			id="content"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.text ?? ''}
			oninput={(e) => handleTextChange((e.target as HTMLInputElement).value)}
			disabled={!selectedObject || !editor?.changeText}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="font-size"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.fontSize ?? 32}
				oninput={(e) => handleFontSizeChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeFontSize}
			/>
		</div>

		<div>
			<label for="font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="font-family"
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

	<div class="flex items-center gap-4">
		<button
			onclick={handleFontWeightChange}
			class={`rounded-md border border-gray-300 p-2 ${selectedObject?.fontWeight === 'bold' ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontWeight}
		>
			B
		</button>

		<button
			onclick={handleFontStyleChange}
			class={`rounded-md border border-gray-300 p-2 ${selectedObject?.fontStyle === 'italic' ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontStyle}
		>
			I
		</button>

		<button
			onclick={handleFontUnderlineChange}
			class={`rounded-md border border-gray-300 p-2 ${selectedObject?.underline ? 'bg-gray-200' : ''}`}
			disabled={!selectedObject || !editor?.changeFontUnderline}
		>
			U
		</button>
	</div>

	<div class="flex flex-col gap-2">
		<label for="fill-color" class="text-xs text-gray-600">Fill Color</label>
		<div class="w-full">
			<ColorPicker bind:color onInput={handleColorChange} />
		</div>
	</div>
</div>
