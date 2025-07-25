<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';
	import FloatingFieldEditor from './FloatingFieldEditor.svelte';
	import { Button } from '$lib/components/ui/button';

	let { editor } = $props<{ editor: Editor }>();

	// --- Derived State ---
	// Get the currently selected object from the editor
	const selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	// Enhanced logging with comprehensive textbox selection tracking
	$effect(() => {
		if (selectedObject && selectedObject.type === 'textbox') {
			console.group('🎯 TEXTBOX SELECTED');
			console.log('📝 Text Content:', selectedObject.text);
			console.log('🏷️ Object Type:', selectedObject.type);
			console.log('🔖 Custom Type:', (selectedObject as any).customType);
			console.log('📏 Font Size:', selectedObject.fontSize);
			console.log('🔤 Font Family:', selectedObject.fontFamily);
			console.log('⚖️ Font Weight:', selectedObject.fontWeight);
			console.log('🎨 Font Style:', selectedObject.fontStyle);
			console.log('📐 Text Align:', selectedObject.textAlign);
			console.log('🎨 Fill Color:', selectedObject.fill);
			console.log('📍 Position:', {
				left: selectedObject.left,
				top: selectedObject.top,
				width: selectedObject.width,
				height: selectedObject.height
			});
			console.log('🔄 Transform:', {
				scaleX: selectedObject.scaleX,
				scaleY: selectedObject.scaleY,
				angle: selectedObject.angle
			});
			console.log('👁️ Visibility:', {
				visible: selectedObject.visible,
				opacity: selectedObject.opacity
			});
			console.log('🎯 Selection State:', {
				selectable: selectedObject.selectable,
				evented: selectedObject.evented,
				hasBorders: selectedObject.hasBorders,
				hasControls: selectedObject.hasControls
			});
			console.log('⏰ Timestamp:', new Date().toISOString());
			console.groupEnd();

			// Trigger canvas rendering to ensure UI updates
			editor?.canvas?.requestRenderAll();
		} else if (selectedObject) {
			console.log('🔍 NON-TEXTBOX SELECTED:', {
				type: selectedObject.type,
				customType: (selectedObject as any).customType,
				timestamp: new Date().toISOString()
			});
		} else {
			console.log('❌ NO OBJECT SELECTED:', new Date().toISOString());
		}
	});

	// Derive all properties from the selected object with enhanced default handling
	const textContent = $derived<string>(selectedObject?.text ?? '');
	const fontSize = $derived<number>(Number(selectedObject?.fontSize) || 32);
	const fontFamily = $derived<string>(selectedObject?.fontFamily ?? 'Arial');
	const textAlign = $derived<string>(selectedObject?.textAlign ?? 'left');
	let color = $derived<Colord>(
		colord(typeof selectedObject?.fill === 'string' ? selectedObject.fill : '#000000')
	);

	// Derived state for button variants with proper typing
	const fontWeight = $derived<number>(Number(selectedObject?.fontWeight) || 400);
	const fontStyle = $derived.by(() => {
		const style = selectedObject?.fontStyle;
		if (style === 'italic' || style === 'oblique') return style as 'normal' | 'italic' | 'oblique';
		return 'normal' as const;
	});
	const underline = $derived<boolean>(selectedObject?.underline ?? false);

	const isBold = $derived<boolean>(fontWeight >= 700);
	const isItalic = $derived<boolean>(fontStyle === 'italic');
	const isUnderline = $derived<boolean>(underline);

	// Log property changes for debugging
	$effect(() => {
		if (selectedObject?.type === 'textbox') {
			console.log('🔄 PROPERTY UPDATE:', {
				fontSize,
				fontFamily,
				fontWeight,
				fontStyle,
				underline,
				textAlign,
				color: color.toHex(),
				timestamp: new Date().toISOString()
			});
		}
	});

	// --- Event Handlers ---
	// All handlers call methods on the main 'editor' object to apply changes.

	function handleTextChange(value: string) {
		console.log('📝 TEXT CHANGE:', { from: textContent, to: value });
		editor?.changeText?.(value);
		// Force canvas re-render after text change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontSizeChange(size: number) {
		// Prevent invalid values
		if (isNaN(size) || size <= 0) {
			console.warn('⚠️ INVALID FONT SIZE:', size);
			return;
		}
		console.log('📏 FONT SIZE CHANGE:', { from: fontSize, to: size });
		editor?.changeFontSize?.(size);
		// Force canvas re-render after font size change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontFamilyChange(family: string) {
		console.log('🔤 FONT FAMILY CHANGE:', { from: fontFamily, to: family });
		editor?.changeFontFamily?.(family);
		// Force canvas re-render after font family change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontWeightChange() {
		const newWeight = fontWeight >= 700 ? 400 : 700;
		console.log('⚖️ FONT WEIGHT CHANGE:', { from: fontWeight, to: newWeight });
		editor?.changeFontWeight?.(newWeight);
		// Force canvas re-render after font weight change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontStyleChange() {
		const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
		console.log('🎨 FONT STYLE CHANGE:', { from: fontStyle, to: newStyle });
		editor?.changeFontStyle?.(newStyle);
		// Force canvas re-render after font style change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleFontUnderlineChange() {
		const newUnderline = !underline;
		console.log('📏 UNDERLINE CHANGE:', { from: underline, to: newUnderline });
		editor?.changeFontUnderline?.(newUnderline);
		// Force canvas re-render after underline change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleTextAlignChange(alignment: string) {
		console.log('📐 TEXT ALIGN CHANGE:', { from: textAlign, to: alignment });
		editor?.changeTextAlign?.(alignment);
		// Force canvas re-render after text align change
		setTimeout(() => editor?.canvas?.requestRenderAll(), 0);
	}

	function handleColorChange({ hex }: { hex: string | null }) {
		if (hex) {
			console.log('🎨 COLOR CHANGE:', { from: color.toHex(), to: hex });
			editor?.changeFillColor?.(hex);
			// Force canvas re-render after color change
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

	// Log when component mounts/unmounts
	$effect(() => {
		console.log('🚀 TEXT EDITOR COMPONENT MOUNTED');
		return () => {
			console.log('🔚 TEXT EDITOR COMPONENT UNMOUNTED');
		};
	});
</script>

<FloatingFieldEditor {editor} />

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
		<ColorPicker bind:color onInput={handleColorChange} />
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
