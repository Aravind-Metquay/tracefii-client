<script lang="ts">
	import type { Editor } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived(editor?.selectedObjects?.[0]);

	// Conversion constants (assuming 96 DPI - web standard)
	const PIXELS_PER_CM = 96 / 2.54; // ~37.8 pixels per cm

	// Utility functions for conversion
	function pixelsToCm(pixels: number): number {
		return Math.round((pixels / PIXELS_PER_CM) * 100) / 100; // Round to 2 decimal places
	}

	function cmToPixels(cm: number): number {
		return Math.round(cm * PIXELS_PER_CM);
	}

	// Get scale values with better fallbacks
	let scaleX = $derived(editor?.getActiveScaleX?.() ?? 1.0);
	let scaleY = $derived(editor?.getActiveScaleY?.() ?? 1.0);

	// Get original dimensions when image is first selected
	let originalWidth = $derived(selectedObject?.width || 0);
	let originalHeight = $derived(selectedObject?.height || 0);

	// Compute display sizes in pixels first, then convert to cm
	let displayWidthPx = $derived(
		selectedObject?.width && scaleX
			? Math.round(selectedObject.width * scaleX)
			: originalWidth || 100
	);

	let displayHeightPx = $derived(
		selectedObject?.height && scaleY
			? Math.round(selectedObject.height * scaleY)
			: originalHeight || 100
	);

	// Convert to cm for display
	let displayWidthCm = $derived(pixelsToCm(displayWidthPx));
	let displayHeightCm = $derived(pixelsToCm(displayHeightPx));

	// Input values (separate from derived values to allow user typing)
	let widthInputValue = $state(0);
	let heightInputValue = $state(0);

	// Update input values when selection changes
	$effect(() => {
		widthInputValue = displayWidthCm;
		heightInputValue = displayHeightCm;
	});

	function handleSizeChange(dimension: 'width' | 'height', cmValue: number) {
		if (!editor?.updateObjectSize) {
			console.error('updateObjectSize method not available');
			return;
		}

		// Convert cm to pixels for the editor
		const pixelValue = cmToPixels(cmValue);

		const success = editor.updateObjectSize(dimension, pixelValue);
		if (!success) {
			console.warn('Failed to update object size');
		}
	}

	// Handle input events (real-time updates while typing)
	function handleInput(dimension: 'width' | 'height', value: string) {
		const numValue = parseFloat(value);
		if (isNaN(numValue) || numValue <= 0) return;

		// Update the input value immediately
		if (dimension === 'width') {
			widthInputValue = numValue;
		} else {
			heightInputValue = numValue;
		}

		// Apply the change
		handleSizeChange(dimension, numValue);
	}

	// Handle change events (when user finishes editing)
	function handleChange(dimension: 'width' | 'height', value: string) {
		const numValue = parseFloat(value);
		if (isNaN(numValue) || numValue <= 0) {
			// Reset to current display value if invalid
			if (dimension === 'width') {
				widthInputValue = displayWidthCm;
			} else {
				heightInputValue = displayHeightCm;
			}
			return;
		}

		handleSizeChange(dimension, numValue);
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Image Properties</h4>

	<!-- Display original dimensions -->
	{#if selectedObject}
		<div class="mb-2 text-xs text-gray-500">
			Original: {pixelsToCm(originalWidth)} × {pixelsToCm(originalHeight)} cm
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="image-width" class="text-xs text-gray-600">Width (cm)</label>
			<input
				id="image-width"
				type="number"
				min="0.1"
				max="200"
				step="0.1"
				class="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
				bind:value={widthInputValue}
				oninput={(e) => handleInput('width', (e.target as HTMLInputElement).value)}
				onchange={(e) => handleChange('width', (e.target as HTMLInputElement).value)}
			/>
		</div>

		<div>
			<label for="image-height" class="text-xs text-gray-600">Height (cm)</label>
			<input
				id="image-height"
				type="number"
				min="0.1"
				max="200"
				step="0.1"
				class="w-full rounded border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
				bind:value={heightInputValue}
				oninput={(e) => handleInput('height', (e.target as HTMLInputElement).value)}
				onchange={(e) => handleChange('height', (e.target as HTMLInputElement).value)}
			/>
		</div>
	</div>

	<!-- Show pixel equivalents for reference -->
	{#if selectedObject}
		<div class="mt-2 text-xs text-gray-400">
			Current: {displayWidthPx} × {displayHeightPx} pixels
		</div>
	{/if}
</div>
