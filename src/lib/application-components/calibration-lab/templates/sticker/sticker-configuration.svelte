<script lang="ts">
	import { createFabricCanvasManager } from '../shared/canvas-manager.svelte';
	import type * as fabric from 'fabric';
	import ContainerPanel from './components/container-panel.svelte';
	import ComponentToolbar from './components/component-toolbar.svelte';
	import ConfigPanel from './components/config-panel.svelte';

	let canvasEl = $state<HTMLCanvasElement | null>(null);

	// --- STATE VARIABLES ---
	let pixelWidth = $state(600);
	let pixelHeight = $state(400);
	let backgroundColor = $state('#ffffff');
	
	// Contextual state for the selected object
	let selectedObjectType = $state<string | null>(null);
	let selectedObject = $state<fabric.Object | null>(null);
	let fontFamily = $state('Arial');
	let fontSize = $state(20);
	let fontWeight = $state(400);
	let fontStyle = $state<'normal' | 'italic' | 'oblique'>('normal');
	let textAlign = $state('left');
	let textUnderline = $state(false);
	let opacity = $state(1);
	let fillColor = $state('#000000');
	let zoom = $state(1);

	const canvasManager = createFabricCanvasManager();

	// --- REACTIVE EFFECTS ---
	$effect(() => {
		if (!canvasEl) return;
		
		canvasManager.initializeCanvas(canvasEl, {
			width: Math.round(pixelWidth),
			height: Math.round(pixelHeight),
			backgroundColor: backgroundColor
		} as fabric.CanvasOptions);

		const updateControls = (target: fabric.Object | null) => {
			selectedObject = target;
			if (!target) {
				selectedObjectType = null;
				return;
			}
			selectedObjectType = target.type || null;
			opacity = target.opacity ?? 1;
			if (typeof target.fill === 'string') {
				fillColor = target.fill;
			}
			if (target.type?.includes('text')) {
				const textObject = target as fabric.IText;
				fontFamily = textObject.fontFamily || 'Arial';
				fontSize = textObject.fontSize || 20;
				fontWeight = (Number(textObject.fontWeight) as 400 | 700) || 400;
				fontStyle = (textObject.fontStyle as 'normal' | 'italic' | 'oblique') || 'normal';
				textAlign = textObject.textAlign || 'left';
				textUnderline = textObject.underline || false;
			}
		};

		const instance = canvasManager.getCanvas();
		if (instance) {
			instance.on('selection:created', (e) => updateControls(e.selected[0]));
			instance.on('selection:updated', (e) => updateControls(e.selected[0]));
			instance.on('selection:cleared', () => updateControls(null));

			
		}

		return () => {
			canvasManager.disposeCanvas();
		};
	});

	$effect(() => {
		if (canvasManager.canvas) {
			canvasManager.setDimensions(Math.round(pixelWidth), Math.round(pixelHeight));
		}
	});

	// --- FUNCTIONS ---
	function onDimensionsChange(newPixelWidth: number, newPixelHeight: number) {
		pixelWidth = newPixelWidth;
		pixelHeight = newPixelHeight;
	}
	function updateBackground() {
		canvasManager.changeBackground(backgroundColor);
	}
	function addText() { canvasManager.addText('Sample Text'); }
	function addQRCode() { canvasManager.addQRcode('https://example.com'); }
	function addBarcode() { canvasManager.addBarcode('123456789'); }
	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) { canvasManager.addImage(file); }
	}
	function updateFontFamily() { canvasManager.changeFontFamily(fontFamily); }
	function updateFontSize() { canvasManager.changeFontSize(fontSize); }
	function updateFontWeight() { canvasManager.changeFontWeight(fontWeight); }
	function updateFontStyle() { canvasManager.changeFontStyle(fontStyle); }
	function updateTextAlign() { canvasManager.changeTextAlign(textAlign); }
	//function toggleUnderline() { canvasManager.changeFontUnderline(!textUnderline); }
	function updateOpacity() { canvasManager.changeOpacity(opacity); }
	function updateFillColor() { canvasManager.changeFillColor(fillColor); }

	function toggleBold() {
		// If current weight is bold (700) or more, switch to normal (400), otherwise switch to bold.
		const newWeight = fontWeight >= 700 ? 400 : 700;
		canvasManager.changeFontWeight(newWeight);
		fontWeight = newWeight; // Update local state to keep UI in sync
	}

	function toggleItalic() {
		const newStyle = fontStyle === 'italic' ? 'normal' : 'italic';
		canvasManager.changeFontStyle(newStyle);
		fontStyle = newStyle; // Update local state
	}

	function setTextAlign(align: 'left' | 'center' | 'right') {
		canvasManager.changeTextAlign(align);
		textAlign = align; // Update local state
	}

	function toggleUnderline() {
        // This function might already exist, but ensure it updates local state
		const newUnderline = !textUnderline;
		canvasManager.changeFontUnderline(newUnderline);
		textUnderline = newUnderline;
	}
	function bringForward() { canvasManager.bringForward(); }
	function sendBackwards() { canvasManager.sendBackwards(); }
	function deleteSelected() { canvasManager.deleteSelected(); }
	async function duplicateSelected() { await canvasManager.duplicateSelected(); }

	async function updateQRCode(options:any) {
		await canvasManager.updateQRCode(options);
	}

	async function updateBarcode(options:any) {
		await canvasManager.updateBarcode(options);
		
	}

function updateImageDimensions(newDimensions: { widthCm?: number; heightCm?: number }) {
    canvasManager.updateImageDimensions(newDimensions);
}
</script>

<div class="editor-layout flex h-screen w-full overflow-hidden bg-gray-50">
	<div class="w-80 shrink-0 border-r bg-white shadow-lg">
		<ContainerPanel
			{pixelWidth}
			{pixelHeight}
			bind:backgroundColor
			{onDimensionsChange}
			onBackgroundChange={updateBackground}
		/>
	</div>

	<div class="flex min-w-0 flex-1 flex-col overflow-hidden">
		<div class="shrink-0 border-b bg-white p-2">
			<ComponentToolbar {addText} {addBarcode} {addQRCode} {handleImageUpload} />
		</div>

		<div class="flex-1 overflow-auto p-5 flex items-center justify-center">
			<canvas bind:this={canvasEl} class="border shadow-lg"></canvas>
		</div>
	</div>

	<div class="w-80 shrink-0 border-l bg-white shadow-lg">
		<ConfigPanel
			{selectedObjectType}
			{selectedObject}
			bind:fontFamily
			bind:fontSize
			bind:fontWeight
			bind:fontStyle
			bind:textAlign
			bind:textUnderline
			bind:opacity
			bind:fillColor
			{updateFontFamily}
			{updateFontSize}
			{updateFontWeight}
			{updateFontStyle}
			{updateTextAlign}
			{toggleUnderline}
			{updateOpacity}
			{updateFillColor}
			{bringForward}
			{sendBackwards}
			{duplicateSelected}
			{deleteSelected}
			{updateQRCode}
			{updateBarcode}
			{updateImageDimensions}
			{toggleBold}
			{toggleItalic}
			 {setTextAlign} 

		/>
	</div>
</div>