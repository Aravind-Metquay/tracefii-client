<script lang="ts">
	import type * as fabric from 'fabric';

	
	let { selectedObject, updateImageDimensions } = $props<{
		selectedObject: fabric.Image;
		updateImageDimensions: (dims: { widthCm?: number; heightCm?: number }) => void;
	}>();

	const PIXELS_PER_CM = 37.795;

	// Simple approach - recalculate dimensions when needed
	function getCurrentDimensions() {
		const currentWidthPx = Math.round(selectedObject.getScaledWidth());
		const currentHeightPx = Math.round(selectedObject.getScaledHeight());
		const currentWidthCm = (currentWidthPx / PIXELS_PER_CM).toFixed(2);
		const currentHeightCm = (currentHeightPx / PIXELS_PER_CM).toFixed(2);
		
		return { currentWidthPx, currentHeightPx, currentWidthCm, currentHeightCm };
	}

	function getOriginalDimensions() {
		const originalWidthPx = selectedObject.getElement()?.naturalWidth ?? 0;
		const originalHeightPx = selectedObject.getElement()?.naturalHeight ?? 0;
		const originalWidthCm = (originalWidthPx / PIXELS_PER_CM).toFixed(2);
		const originalHeightCm = (originalHeightPx / PIXELS_PER_CM).toFixed(2);
		
		return { originalWidthPx, originalHeightPx, originalWidthCm, originalHeightCm };
	}

	// Input state - use separate state that we fully control
	let widthInput = $state('0');
	let heightInput = $state('0');
	let isUserInteracting = $state(false);
	let debounceTimer: NodeJS.Timeout;
	let isInitialized = $state(false);

	// Initialize values once
	$effect(() => {
		const { currentWidthCm, currentHeightCm } = getCurrentDimensions();
		if (!isInitialized && currentWidthCm !== '0.00' && currentHeightCm !== '0.00') {
		
			widthInput = currentWidthCm;
			heightInput = currentHeightCm;
			isInitialized = true;
		}
	});

	// Sync periodically, but only when not interacting
	let syncInterval: NodeJS.Timeout;
	$effect(() => {
		syncInterval = setInterval(() => {
			if (!isInitialized || isUserInteracting) return;

			const { currentWidthCm, currentHeightCm } = getCurrentDimensions();
			const shouldUpdateWidth = Math.abs(parseFloat(currentWidthCm) - parseFloat(widthInput)) > 0.1;
			const shouldUpdateHeight = Math.abs(parseFloat(currentHeightCm) - parseFloat(heightInput)) > 0.1;

			if (shouldUpdateWidth || shouldUpdateHeight) {
				
				widthInput = currentWidthCm;
				heightInput = currentHeightCm;
			}
		}, 300); // Check every 300ms

		return () => clearInterval(syncInterval);
	});

	function handleInput(type: 'width' | 'height') {
	

		// Mark as user interacting
		isUserInteracting = true;
		clearTimeout(debounceTimer);
		
		debounceTimer = setTimeout(() => {
			const value = type === 'width' ? parseFloat(widthInput) : parseFloat(heightInput);
			
			
			
			if (!isNaN(value) && value > 0) {
		
				const { originalWidthCm, originalHeightCm } = getOriginalDimensions();

				if (type === 'width') {
					updateImageDimensions({ widthCm: value });
					// Update the other input to maintain aspect ratio
					const aspectRatio = parseFloat(originalWidthCm) / parseFloat(originalHeightCm);
					heightInput = (value / aspectRatio).toFixed(2);
				} else {
					updateImageDimensions({ heightCm: value });
					// Update the other input to maintain aspect ratio
					const aspectRatio = parseFloat(originalWidthCm) / parseFloat(originalHeightCm);
					widthInput = (value * aspectRatio).toFixed(2);
				}

			}
			
			// Reset flag after delay
			setTimeout(() => { 
				isUserInteracting = false;
			}, 100);
		}, 200);
	}

	function handleFocus() {
		
		isUserInteracting = true;
	}

	function handleBlur() {
		
	}

	// Get current dimensions for display using $derived
	const displayDimensions = $derived(() => {
		const { currentWidthPx, currentHeightPx } = getCurrentDimensions();
		const { originalWidthCm, originalHeightCm } = getOriginalDimensions();
		return { currentWidthPx, currentHeightPx, originalWidthCm, originalHeightCm };
	});
</script>

<div>
	<div class="space-y-3 text-xs">

		<div class="flex items-center gap-4">
			<div class="flex-1">
				<label for="img-width" class="block font-medium text-gray-600">Width (cm)</label>
				<input
					id="img-width"
					type="number"
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					bind:value={widthInput}
					oninput={() => handleInput('width')}
					onfocus={handleFocus}
					onblur={handleBlur}
					step="0.1"
					min="0.1"
				/>
			</div>
			<div class="flex-1">
				<label for="img-height" class="block font-medium text-gray-600">Height (cm)</label>
				<input
					id="img-height"
					type="number"
					class="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none  focus:ring-1 focus:ring-blue-500"
					bind:value={heightInput}
					oninput={() => handleInput('height')}
					onfocus={handleFocus}
					onblur={handleBlur}
					step="0.1"
					min="0.1"
				/>
			</div>
		</div>
	</div>
</div>