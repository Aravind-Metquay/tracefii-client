<script lang="ts">
	import { createFabricCanvasManager } from '../shared/canvas-manager.svelte';

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let width = $state(600);
	let height = $state(400);

	// Text properties
	let fontFamily = $state('Arial');
	let fontSize = $state(20);
	let fontWeight = $state(400);
	let fontStyle = $state<'normal' | 'italic' | 'oblique'>('normal');
	let textAlign = $state('left');
	let textUnderline = $state(false);

	// Object properties
	let opacity = $state(100);
	let fillColor = $state('#000000');
	let backgroundColor = $state('#ffffff');

	// Canvas settings
	let zoom = $state(100);
	let snappingEnabled = $state(false);

	const canvasManager = createFabricCanvasManager();

	$effect(() => {
		if (canvasEl) {
			canvasManager.initializeCanvas(canvasEl);
			canvasManager.setDimensions(width, height);
		}
	});

	// Canvas setup functions
	function updateDimensions() {
		canvasManager.setDimensions(width, height);
	}

	// Add objects functions
	function addText() {
		canvasManager.addText('Sample Text');
	}

	function addQRCode() {
		canvasManager.addQRcode('https://example.com');
	}

	function addBarcode() {
		canvasManager.addBarcode('123456789');
	}

	function handleImageUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const result = e.target?.result as string;
				canvasManager.addImage(result);
			};
			reader.readAsDataURL(file);
		}
	}

	// Text property functions
	function updateFontFamily() {
		canvasManager.changeFontFamily(fontFamily);
	}

	function updateFontSize() {
		canvasManager.changeFontSize(fontSize);
	}

	function updateFontWeight() {
		canvasManager.changeFontWeight(fontWeight);
	}

	function updateFontStyle() {
		canvasManager.changeFontStyle(fontStyle);
	}

	function updateTextAlign() {
		canvasManager.changeTextAlign(textAlign);
	}

	function toggleUnderline() {
		canvasManager.changeFontUnderline(textUnderline);
	}

	// Object property functions
	function updateOpacity() {
		canvasManager.changeOpacity(opacity / 100);
	}

	function updateFillColor() {
		canvasManager.changeFillColor(fillColor);
	}

	function updateBackground() {
		canvasManager.changeBackground(backgroundColor);
	}

	// Layer functions
	function bringForward() {
		canvasManager.bringForward();
	}

	function sendBackwards() {
		canvasManager.sendBackwards();
	}

	// Zoom functions
	function updateZoom() {
		canvasManager.setZoom(zoom / 100);
	}

	function zoomIn() {
		canvasManager.zoomIn();
		zoom = Math.min(zoom + 25, 500);
	}

	function zoomOut() {
		canvasManager.zoomOut();
		zoom = Math.max(zoom - 25, 25);
	}
	// Alignment functions
	function alignLeft() {
		canvasManager.alignObjects('left');
	}

	function alignCenter() {
		canvasManager.alignObjects('center');
	}

	function alignRight() {
		canvasManager.alignObjects('right');
	}

	// Action functions
	function deleteSelected() {
		canvasManager.deleteSelected();
	}

	// Save functions
	function savePng() {
		canvasManager.savePng();
	}

	function saveJpg() {
		canvasManager.saveJpg();
	}

	function saveSvg() {
		canvasManager.saveSvg();
	}

	function savePdf() {
		canvasManager.savePdf();
	}

	function saveJson() {
		canvasManager.saveJson();
	}
</script>

<div class=" flex h-screen bg-gray-400">
	<!-- Sidebar Controls -->
	<div class="w-80 space-y-6 overflow-y-auto border-r border-gray-300 bg-white p-4">
		<!-- Canvas Setup -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Canvas Setup</h3>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<label for="width" class="w-16 text-xs text-gray-600">Width:</label>
					<input
						id="width"
						type="number"
						bind:value={width}
						min="100"
						max="2000"
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label for="height" class="w-16 text-xs text-gray-600">Height:</label>
					<input
						id="height"
						type="number"
						bind:value={height}
						min="100"
						max="2000"
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					/>
				</div>
				<button
					onclick={updateDimensions}
					class="w-full rounded bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
				>
					Update Size
				</button>
			</div>
		</div>

		<!-- Add Objects -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Add Objects</h3>
			<div class="mb-3 grid grid-cols-2 gap-2">
				<button
					onclick={addText}
					class="rounded bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
				>
					Add Text
				</button>
				<button
					onclick={addQRCode}
					class="rounded bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
				>
					Add QR Code
				</button>
				<button
					onclick={addBarcode}
					class="rounded bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600"
				>
					Add Barcode
				</button>
			</div>
			<input
				type="file"
				accept="image/*"
				onchange={handleImageUpload}
				class="w-full cursor-pointer rounded bg-green-500 px-3 py-2 text-xs font-medium text-white file:hidden hover:bg-green-600"
			/>
		</div>

		<!-- Text Properties -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
				Text Properties
			</h3>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<label for="font" class="w-16 text-xs text-gray-600">Font:</label>
					<select
						id="font"
						bind:value={fontFamily}
						onchange={updateFontFamily}
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					>
						<option value="Arial">Arial</option>
						<option value="Times New Roman">Times New Roman</option>
						<option value="Courier New">Courier New</option>
						<option value="Helvetica">Helvetica</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<label for="size" class="w-16 text-xs text-gray-600">Size:</label>
					<input
						id="size"
						type="number"
						bind:value={fontSize}
						oninput={updateFontSize}
						min="8"
						max="200"
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label for="weight" class="w-16 text-xs text-gray-600">Weight:</label>
					<select
						id="weight"
						bind:value={fontWeight}
						onchange={updateFontWeight}
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					>
						<option value="normal">Normal</option>
						<option value="bold">Bold</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<label for="style" class="w-16 text-xs text-gray-600">Style:</label>
					<select
						id="style"
						bind:value={fontStyle}
						onchange={updateFontStyle}
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					>
						<option value="normal">Normal</option>
						<option value="italic">Italic</option>
						<option value="oblique">Oblique</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<label for="align" class="w-16 text-xs text-gray-600">Align:</label>
					<select
						id="align"
						bind:value={textAlign}
						onchange={updateTextAlign}
						class="flex-1 rounded border border-gray-300 px-2 py-1 text-xs"
					>
						<option value="left">Left</option>
						<option value="center">Center</option>
						<option value="right">Right</option>
					</select>
				</div>
				<div class="flex items-center gap-2">
					<label for="underline" class="text-xs text-gray-600">
						<input
							id="underline"
							type="checkbox"
							bind:checked={textUnderline}
							onchange={toggleUnderline}
							class="mr-2"
						/>
						Underline
					</label>
				</div>
			</div>
		</div>

		<!-- Object Properties -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
				Object Properties
			</h3>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<label for="opacity" class="w-16 text-xs text-gray-600">Opacity:</label>
					<input
						id="opacity"
						type="range"
						bind:value={opacity}
						oninput={updateOpacity}
						min="0"
						max="100"
						class="flex-1"
					/>
					<span class="w-8 text-xs text-gray-600">{opacity}%</span>
				</div>
				<div class="flex items-center gap-2">
					<label for="fill-color" class="w-16 text-xs text-gray-600">Fill:</label>
					<input
						id="fill-color"
						type="color"
						bind:value={fillColor}
						onchange={updateFillColor}
						class="h-8 flex-1 rounded border border-gray-300"
					/>
				</div>
				<div class="flex items-center gap-2">
					<label for="background-color" class="w-16 text-xs text-gray-600">Background:</label>
					<input
						id="background-color"
						type="color"
						bind:value={backgroundColor}
						onchange={updateBackground}
						class="h-8 flex-1 rounded border border-gray-300"
					/>
				</div>
			</div>
		</div>

		<!-- Layer Controls -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
				Layer Controls
			</h3>
			<div class="flex gap-2">
				<button
					onclick={bringForward}
					class="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
				>
					Forward
				</button>
				<button
					onclick={sendBackwards}
					class="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
				>
					Backward
				</button>
			</div>
		</div>

		<!-- Zoom Controls -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">
				Zoom Controls
			</h3>
			<div class="space-y-3">
				<div class="flex items-center gap-2">
					<label for="zoom" class="w-16 text-xs text-gray-600">Zoom:</label>
					<input
						id="zoom"
						type="range"
						bind:value={zoom}
						oninput={updateZoom}
						min="25"
						max="500"
						step="25"
						class="flex-1"
					/>
					<span class="w-10 text-xs text-gray-600">{zoom}%</span>
				</div>
				<div class="flex gap-2">
					<button
						onclick={zoomOut}
						class="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
					>
						Zoom Out
					</button>
					<button
						onclick={zoomIn}
						class="flex-1 rounded bg-gray-600 px-3 py-2 text-xs font-medium text-white hover:bg-gray-700"
					>
						Zoom In
					</button>
				</div>
			</div>
		</div>

		<!-- Alignment -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Alignment</h3>
			<div class="space-y-2">
				<div class="flex gap-1">
					<button
						onclick={alignLeft}
						class="flex-1 rounded bg-purple-500 px-2 py-1 text-xs font-medium text-white hover:bg-purple-600"
					>
						Left
					</button>
					<button
						onclick={alignCenter}
						class="flex-1 rounded bg-purple-500 px-2 py-1 text-xs font-medium text-white hover:bg-purple-600"
					>
						Center
					</button>
					<button
						onclick={alignRight}
						class="flex-1 rounded bg-purple-500 px-2 py-1 text-xs font-medium text-white hover:bg-purple-600"
					>
						Right
					</button>
				</div>
			</div>
		</div>
		<!-- Actions -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Actions</h3>
			<div class="space-y-2">
				<button
					onclick={deleteSelected}
					class="w-full rounded bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600"
				>
					Delete Selected
				</button>
			</div>
		</div>

		<!-- Export -->
		<div class="rounded-lg border bg-gray-50 p-4">
			<h3 class="mb-3 text-sm font-semibold tracking-wide text-gray-700 uppercase">Export</h3>
			<div class="space-y-2">
				<div class="grid grid-cols-2 gap-2">
					<button
						onclick={savePng}
						class="rounded bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
					>
						PNG
					</button>
					<button
						onclick={saveJpg}
						class="rounded bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
					>
						JPG
					</button>
					<button
						onclick={saveSvg}
						class="rounded bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
					>
						SVG
					</button>
					<button
						onclick={savePdf}
						class="rounded bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
					>
						PDF
					</button>
				</div>
				<button
					onclick={saveJson}
					class="w-full rounded bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600"
				>
					Save JSON
				</button>
			</div>
		</div>
	</div>

	<!-- Canvas Area -->
	<div class="flex flex-1 flex-col items-center justify-center p-5">
		<canvas bind:this={canvasEl} class="border-2 border-black shadow-lg"></canvas>
	</div>
</div>

<style>
	input[type='file'] {
		background: #10b981;
		color: white;
		padding: 8px 12px;
		border-radius: 4px;
		cursor: pointer;
		font-size: 12px;
		font-weight: 500;
	}

	input[type='file']::-webkit-file-upload-button {
		display: none;
	}

	input[type='file']::file-selector-button {
		display: none;
	}
</style>
