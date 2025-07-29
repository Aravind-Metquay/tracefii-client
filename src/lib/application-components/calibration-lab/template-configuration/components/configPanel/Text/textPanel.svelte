<script lang="ts">
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';
	import { tick } from 'svelte';

	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	let { editor } = $props<{ editor: Editor }>();

	// --- Derived State ---
	// Get the currently selected object from the editor
	const selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	// Derive all properties from the selected object with enhanced default handling
	const textContent = $derived<string>(selectedObject?.text ?? '');
	const fontSize = $derived<number>(Number(selectedObject?.fontSize) || 32);
	const fontFamily = $derived<string>(selectedObject?.fontFamily ?? 'Arial');
	let textAlign = $derived<string>(selectedObject?.textAlign ?? 'left');
	
	// FIX: Use a reactive state variable instead of derived for color
	let color = $state<Colord>(colord('#000000'));
	
	// Update color when selected object changes - more robust approach
	$effect(() => {
		const currentObject = editor?.selectedObjects?.[0] as ExtendedFabricObject;
		console.log('Effect triggered - Current object:', currentObject);
		console.log('Current object fill:', currentObject?.fill);
		console.log('Current color state:', color.toHex());
		
		if (currentObject) {
			// Get the fill color - handle different possible formats
			let fillColor = '#000000'; // default
			
			if (typeof currentObject.fill === 'string') {
				fillColor = currentObject.fill;
			} else if (currentObject.fill && typeof currentObject.fill === 'object') {
				// Handle gradient or pattern fills - use a default
				fillColor = '#000000';
			}
			
			console.log('Determined fill color:', fillColor);
			
			const newColor = colord(fillColor);
			const newHex = newColor.toHex();
			const currentHex = color.toHex();
			
			console.log('New hex:', newHex, 'Current hex:', currentHex);
			
			// Always update the color and force re-render when selection changes
			if (newHex !== currentHex) {
				console.log('Updating color from', currentHex, 'to', newHex);
				color = newColor;
			}
		}
	});

	// Derived state for button variants with proper typing
	let fontWeight = $derived<number>(Number(selectedObject?.fontWeight) || 400);
	let fontStyle = $derived.by(() => {
		const style = selectedObject?.fontStyle;
		if (style === 'italic' || style === 'oblique') return style as 'normal' | 'italic' | 'oblique';
		return 'normal' as const;
	});
	let underline = $derived<boolean>(selectedObject?.underline ?? false);

	const isBold = $derived<boolean>(fontWeight >= 700);
	const isItalic = $derived<boolean>(fontStyle === 'italic');
	const isUnderline = $derived<boolean>(underline);

	// --- Event Handlers ---
	// All handlers call methods on the main 'editor' object to apply changes.

	function handleTextChange(value: string) {
		editor?.changeText?.(value);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontSizeChange(size: number) {
		// Prevent invalid values
		if (isNaN(size) || size <= 0) {
			console.warn('Invalid font size:', size);
			return;
		}
		editor?.changeFontSize?.(size);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontFamilyChange(family: string) {
		editor?.changeFontFamily?.(family);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontWeightChange() {
		const newWeight = fontWeight >= 700 ? 400 : 700;
		fontWeight = newWeight;
		editor?.changeFontWeight?.(newWeight);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontStyleChange() {
		const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
		fontStyle = newStyle;
		editor?.changeFontStyle?.(newStyle);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontUnderlineChange() {
		const newUnderline = !underline;
		underline = newUnderline;
		editor?.changeFontUnderline?.(newUnderline);
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleTextAlignChange(alignment: string) {
		editor?.changeTextAlign?.(alignment);
		textAlign = alignment;
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleColorChange({ hex }: { hex: string | null }) {
		if (hex) {
			// Update the local color state
			color = colord(hex);
			editor?.changeFillColor?.(hex);
			setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
		}
	}

	// Toggle text style functions
	function toggleTextStyle(style: 'bold' | 'italic' | 'underline') {
		switch (style) {
			case 'bold':
				handleFontWeightChange();
				break;
			case 'italic':
				handleFontStyleChange();
				break;
			case 'underline':
				handleFontUnderlineChange();
				break;
		}
	}

	// Change text alignment function
	function changeTextAlign(alignment: string) {
		handleTextAlignChange(alignment);
	}
</script>

<!-- <FloatingFieldEditor {editor} /> -->

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

	<div class="flex flex-col gap-1">
		<label for="text-color" class="text-sm text-gray-700">Text Color</label>
		<div class="flex items-center gap-2">
			<input
				type="color"
				value={color.toHex()}
				onchange={(e) => handleColorChange({ hex: (e.target as HTMLInputElement).value })}
				class="w-12 h-8 rounded border border-gray-300 cursor-pointer"
			/>
			<span class="text-sm text-gray-600">{color.toHex().toUpperCase()}</span>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<Button
			size="icon"
			variant={isBold ? 'primary' : 'secondary'}
			onclick={() => {
				toggleTextStyle('bold');
				editor?.canvas?.requestRenderAll();
			}}
		>
			<Bold class="h-4 w-4" />
		</Button>

		<Button
			size="icon"
			variant={isItalic ? 'primary' : 'secondary'}
			onclick={() => {
				toggleTextStyle('italic');
				editor?.canvas?.requestRenderAll();
			}}
		>
			<Italic class="h-4 w-4" />
		</Button>

		<Button
			size="icon"
			variant={isUnderline ? 'primary' : 'secondary'}
			onclick={() => {
				toggleTextStyle('underline');
				editor?.canvas?.requestRenderAll();
			}}
		>
			<Underline class="h-4 w-4" />
		</Button>

		<div class="ml-auto flex items-center gap-2">
			<Button
				size="icon"
				variant={textAlign === 'left' ? 'primary' : 'secondary'}
				onclick={() => {
					changeTextAlign('left');
					editor?.canvas?.requestRenderAll();
				}}
			>
				<AlignLeft class="h-4 w-4" />
			</Button>

			<Button
				size="icon"
				variant={textAlign === 'center' ? 'primary' : 'secondary'}
				onclick={() => {
					changeTextAlign('center');
					editor?.canvas?.requestRenderAll();
				}}
			>
				<AlignCenter class="h-4 w-4" />
			</Button>

			<Button
				size="icon"
				variant={textAlign === 'right' ? 'primary' : 'secondary'}
				onclick={() => {
					changeTextAlign('right');
					editor?.canvas?.requestRenderAll();
				}}
			>
				<AlignRight class="h-4 w-4" />
			</Button>
		</div>
	</div>
</div>