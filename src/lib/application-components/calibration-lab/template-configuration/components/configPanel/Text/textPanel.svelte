<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	// Import icons for a better UI
	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';

	let { editor } = $props<{ editor: Editor }>();

	// --- Derived State ---
	// Get the currently selected object from the editor
	const selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	// Derive all properties from the selected object.
	// This makes the template cleaner and automatically updates the UI when the selection changes.
	const textContent = $derived<string>(selectedObject?.text ?? '');
	const fontSize = $derived<number>(Number(selectedObject?.fontSize) || 32);
	const fontFamily = $derived<string>(selectedObject?.fontFamily ?? 'Arial');
	const fontWeight = $derived<number>(Number(selectedObject?.fontWeight) || 400);
	const fontStyle = $derived<string>(selectedObject?.fontStyle ?? 'normal');
	const underline = $derived<boolean>(selectedObject?.underline ?? false);
	const textAlign = $derived<string>(selectedObject?.textAlign ?? 'left');
	let color = $derived<Colord>(
		colord(typeof selectedObject?.fill === 'string' ? selectedObject.fill : '#000000')
	);

	// --- Event Handlers ---
	// All handlers call methods on the main 'editor' object to apply changes.

	function handleTextChange(value: string) {
		editor?.changeText?.(value);
	}

	function handleFontSizeChange(size: number) {
		// Prevent invalid values
		if (isNaN(size) || size <= 0) return;
		editor?.changeFontSize?.(size);
	}

	function handleFontFamilyChange(family: string) {
		editor?.changeFontFamily?.(family);
	}

	function handleFontWeightChange() {
		// Toggle between normal (400) and bold (700)
		editor?.changeFontWeight?.(fontWeight >= 700 ? 400 : 700);
	}

	function handleFontStyleChange() {
		editor?.changeFontStyle?.(fontStyle === 'italic' ? 'normal' : 'italic');
	}

	function handleFontUnderlineChange() {
		editor?.changeFontUnderline?.(!underline);
	}

	function handleTextAlignChange(alignment: string) {
		editor?.changeTextAlign?.(alignment);
	}

	function handleColorChange({ hex }: { hex: string | null }) {
		if (hex) editor?.changeFillColor?.(hex);
	}
</script>

<div class="space-y-4">
	<div class="flex flex-col gap-1">
		<label for="content" class="text-sm text-gray-700">Content</label>
		<textarea
			id="content"
			rows="3"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={textContent}
			oninput={(e) => handleTextChange((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="font-size"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={fontSize}
				oninput={(e) => handleFontSizeChange(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="font-family"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={fontFamily}
				onchange={(e) => handleFontFamilyChange((e.target as HTMLSelectElement).value)}
			>
				<option>Arial</option>
				<option>Helvetica</option>
				<option>Times New Roman</option>
				<option>Georgia</option>
				<option>Verdana</option>
			</select>
		</div>
	</div>

	<div class="flex flex-col gap-1">
		<label for="text-color" class="text-sm text-gray-700">Text Color</label>
		<ColorPicker bind:color onInput={handleColorChange} />
	</div>

	<div class="flex items-center gap-2">
		<button
			class="rounded border p-2"
			class:bg-gray-200={fontWeight >= 700}
			onclick={handleFontWeightChange}
			title="Bold"
		>
			<Bold size={16} />
		</button>

		<button
			class="rounded border p-2"
			class:bg-gray-200={fontStyle === 'italic'}
			onclick={handleFontStyleChange}
			title="Italic"
		>
			<Italic size={16} />
		</button>

		<button
			class="rounded border p-2"
			class:bg-gray-200={underline}
			onclick={handleFontUnderlineChange}
			title="Underline"
		>
			<Underline size={16} />
		</button>

		<div class="ml-auto flex items-center gap-2">
			<button
				class="rounded border p-2"
				class:bg-gray-200={textAlign === 'left'}
				onclick={() => handleTextAlignChange('left')}
				title="Align Left"
			>
				<AlignLeft size={16} />
			</button>

			<button
				class="rounded border p-2"
				class:bg-gray-200={textAlign === 'center'}
				onclick={() => handleTextAlignChange('center')}
				title="Align Center"
			>
				<AlignCenter size={16} />
			</button>

			<button
				class="rounded border p-2"
				class:bg-gray-200={textAlign === 'right'}
				onclick={() => handleTextAlignChange('right')}
				title="Align Right"
			>
				<AlignRight size={16} />
			</button>
		</div>
	</div>
</div>
