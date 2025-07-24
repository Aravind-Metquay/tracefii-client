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
		return '#' + [rgb.r, rgb.g, rgb.b].map(x => {
			const hex = x.toString(16);
			return hex.length === 1 ? '0' + hex : hex;
		}).join('');
	}

	
	$effect(() => {
		if (!canvasElement || !containerElement) {
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

<div class="canvas-editor flex h-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div
			bind:this={containerElement}
			class="relative flex h-full w-full items-center justify-center overflow-hidden "
		>
			<!-- Canvas takes full container size -->
			<canvas
				bind:this={canvasElement}
				class="block max-h-full max-w-full"
				style="
					width: 100%; 
					height: 100%; 
					display: block;
				"
			></canvas>
		</div>
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
	canvas {
		
		display: block;
	}
</style>