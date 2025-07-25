<script lang="ts">
	import type { Editor } from '../lib/types';
	import Footer from './Footer.svelte';

	let { editor, backgroundColor } = $props<{
		editor: Editor;
		backgroundColor: { r: number; g: number; b: number };
	}>();

	let canvasElement = $state<HTMLCanvasElement | undefined>();
	let containerElement = $state<HTMLDivElement | undefined>();

	function rgbToHex(rgb: { r: number; g: number; b: number }): string {
		return (
			'#' +
			[rgb.r, rgb.g, rgb.b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	}


	$effect(() => {
		if (!canvasElement || !containerElement) {
			return;
		}

		// Initialize the canvas via the editor if it hasn't been already.
		if (!editor.canvas) {
			console.log('Initializing Fabric.js canvas...');
			editor.initializeCanvas(canvasElement, containerElement);

			// The autoZoom function from your editor handles initial fitting and centering.
			editor.autoZoom?.();
		}

		// Update the background color. This runs on init and when the prop changes.
		const hexColor = rgbToHex(backgroundColor);
		editor.changeBackground(hexColor);

		const canvas = editor.canvas;
		if (!canvas) return;

		// Set up the ResizeObserver to handle responsive resizing.
		const resizeObserver = new ResizeObserver(() => {
			// Let the editor's autoZoom function handle the resizing logic.
			editor.autoZoom?.();
		});

		resizeObserver.observe(containerElement);

		// Return a cleanup function.
		// This runs when the component is destroyed to prevent memory leaks.
		return () => {
			console.log('Cleaning up canvas editor...');
			resizeObserver.disconnect();
		};
	});
</script>

<div class="flex h-full w-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div
			bind:this={containerElement}
			class="relative flex h-full w-full items-center justify-center overflow-hidden"
		>
			<!-- Canvas takes full container size -->
			<canvas bind:this={canvasElement} class="block max-h-full max-w-full"></canvas>
		</div>
	</div>
	<Footer {editor} />
</div>
