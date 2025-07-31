<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { editor } = $props<{ editor: Editor }>();

	// --- State ---
	const selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	const fontSize = $derived<number>(Number(selectedObject?.fontSize) || 32);
	const fontFamily = $derived<string>(selectedObject?.fontFamily ?? 'Arial');
	let textAlign = $derived<string>(selectedObject?.textAlign ?? 'left');
	let color = $state<Colord>(colord('#000000'));
	let hexColor = $derived(color.toHex())
	// --- Effects ---
	// Update color when the selected object changes
	$effect(() => {
		const currentObject = editor?.selectedObjects?.[0] as ExtendedFabricObject;
		let fillColor = '#000000'; // Default color

		if (currentObject?.fill && typeof currentObject.fill === 'string') {
			fillColor = currentObject.fill;
		}

		console.log('Selected object color:', fillColor);
		const newColor = colord(fillColor);
		if (newColor.toHex() !== color.toHex()) {
			color = newColor;
		}
	});

	// --- Derived State for UI ---
	const fontWeight = $derived<number>(Number(selectedObject?.fontWeight) || 400);
	const fontStyle = $derived.by(() => {
		const style = selectedObject?.fontStyle;
		return style === 'italic' || style === 'oblique' ? style : 'normal';
	});
	const underline = $derived<boolean>(selectedObject?.underline ?? false);

	const isBold = $derived<boolean>(fontWeight >= 700);
	const isItalic = $derived<boolean>(fontStyle === 'italic');
	const isUnderline = $derived<boolean>(underline);

	// --- Event Handlers ---
	function handleFontSizeChange(size: number) {
		if (isNaN(size) || size <= 0) return;
		editor?.changeFontSize?.(size);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontFamilyChange(family: string) {
		editor?.changeFontFamily?.(family);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleColorChange({ hex }: { hex: string | null }) {
		if (hex) {
			color = colord(hex);
			editor?.changeFillColor?.(hex);
			setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
		}
	}

	function toggleTextStyle(style: 'bold' | 'italic' | 'underline') {
		if (style === 'bold') {
			const newWeight = isBold ? 400 : 700;
			editor?.changeFontWeight?.(newWeight);
		} else if (style === 'italic') {
			const newStyle = isItalic ? 'normal' : 'italic';
			editor?.changeFontStyle?.(newStyle);
		} else if (style === 'underline') {
			const newUnderline = !underline;
			editor?.changeFontUnderline?.(newUnderline);
		}
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function changeTextAlign(alignment: string) {
		textAlign = alignment;
		editor?.changeTextAlign?.(alignment);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}
</script>

<div class="space-y-4">
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

	<!-- <div class="flex flex-col gap-1">
		<label class="text-sm text-gray-700">Text Color</label>
		{#key color.toHex()}
			<ColorPicker color={color.toHex()} onInput={handleColorChange} />
		{/key}
	</div> -->

	<div class="flex flex-col gap-1">
	<label class="text-sm text-gray-700">Text Color</label>
	<!-- <p>Value being sent to picker: <strong>{color.toHex()}</strong></p> -->
	{#key color.toHex()}
		<ColorPicker bind:hex={hexColor} onInput={handleColorChange} />
	{/key}
</div>

	<div class="flex items-center gap-2">
		<Button size="icon" variant={isBold ? 'primary' : 'secondary'} onclick={() => toggleTextStyle('bold')}>
			<Bold class="h-4 w-4" />
		</Button>
		<Button size="icon" variant={isItalic ? 'primary' : 'secondary'} onclick={() => toggleTextStyle('italic')}>
			<Italic class="h-4 w-4" />
		</Button>
		<Button size="icon" variant={isUnderline ? 'primary' : 'secondary'} onclick={() => toggleTextStyle('underline')}>
			<Underline class="h-4 w-4" />
		</Button>

		<div class="ml-auto flex items-center gap-2">
			<Button size="icon" variant={textAlign === 'left' ? 'primary' : 'secondary'} onclick={() => changeTextAlign('left')}>
				<AlignLeft class="h-4 w-4" />
			</Button>
			<Button size="icon" variant={textAlign === 'center' ? 'primary' : 'secondary'} onclick={() => changeTextAlign('center')}>
				<AlignCenter class="h-4 w-4" />
			</Button>
			<Button size="icon" variant={textAlign === 'right' ? 'primary' : 'secondary'} onclick={() => changeTextAlign('right')}>
				<AlignRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>