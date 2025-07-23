<script lang="ts">
	import type { Editor } from '../lib/types'; // Adjust path if needed
	import Footer from './Footer.svelte';


	let { editor, backgroundColor } = $props<{
		editor: Editor;
		backgroundColor: { r: number; g: number; b: number };
	}>();

	// Use $state for element bindings
	let canvasElement = $state<HTMLCanvasElement | undefined>();
	let containerElement = $state<HTMLDivElement | undefined>();

	// Helper function to convert RGB object to a hex string
	function rgbToHex(rgb: { r: number; g: number; b: number }): string {
		return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
			const hex = x.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('');
	}

	
	$effect(() => {
		// 1. Wait for Svelte to bind the HTML elements to our variables.
		if (!canvasElement || !containerElement) {
			// This effect will automatically re-run once they are available.
			return;
		}

		// 2. Initialize the canvas via the editor if it hasn't been already.
		if (!editor.canvas) {
			console.log(' Initializing Fabric.js canvas...');
			editor.initializeCanvas(canvasElement, containerElement);

			// The autoZoom function from your editor handles initial fitting and centering.
			// This is much cleaner than calculating zoom/pan manually here.
			editor.autoZoom?.();
		}

		// 3. Update the background color. This runs on init and when the prop changes.
		const hexColor = rgbToHex(backgroundColor);
		editor.changeBackground(hexColor);

		// 4. Set up the ResizeObserver to handle responsive resizing.
		const resizeObserver = new ResizeObserver(() => {
			// Let the editor's autoZoom function handle the resizing logic.
			editor.autoZoom?.();
		});

		resizeObserver.observe(containerElement);

		// 5. Return a cleanup function.
		// This runs when the component is destroyed to prevent memory leaks.
		return () => {
			console.log('Cleaning up canvas editor...');
			resizeObserver.disconnect();
			// The editor itself can handle disposing the canvas if needed.
		};
	});
</script>

<div class="canvas-editor">
	<div bind:this={containerElement} class="canvas-wrapper">
		<canvas bind:this={canvasElement}></canvas>
	</div>
	<Footer {editor} />
</div>

<style>
	.canvas-editor {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	.canvas-wrapper {
		/* This container defines the available area for the canvas */
		flex: 1;
		min-height: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		background-color: #f8fafc; /* A fallback color */
	}
	canvas {
		
		display: block;
	}
</style>