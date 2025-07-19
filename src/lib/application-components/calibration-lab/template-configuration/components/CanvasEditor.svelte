<!-- CanvasEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from './Footer.svelte';
	import type { Editor } from '../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let canvasElement = $state<HTMLCanvasElement>();
	let containerElement = $state<HTMLDivElement>();

	onMount(() => {
		let resizeObserver: ResizeObserver | null = null;

		if (canvasElement && containerElement && editor) {
			const initializeWhenReady = () => {
				if (!containerElement) return;

				// Get actual computed dimensions instead of offset dimensions
				const containerRect = containerElement.getBoundingClientRect();
				const width = containerRect.width;
				const height = containerRect.height;

				console.log('Container dimensions:', { width, height }); // Debug log

				if (width > 0 && height > 0 && canvasElement) {
					// Set canvas element dimensions first
					canvasElement.width = width;
					canvasElement.height = height;
					canvasElement.style.width = width + 'px';
					canvasElement.style.height = height + 'px';

					// Initialize the editor canvas
					editor.initializeCanvas(canvasElement, containerElement);

					// Force canvas to have proper dimensions and render
					if (editor.canvas) {
						editor.canvas.setDimensions({ width, height });
						// Force an immediate render after setting dimensions
						editor.canvas.requestRenderAll();
						editor.syncCanvasState();
					}

					// Set up resize observer
					resizeObserver = new ResizeObserver((entries) => {
						for (const entry of entries) {
							const { width: newWidth, height: newHeight } = entry.contentRect;
							if (editor.canvas && newWidth > 0 && newHeight > 0 && canvasElement) {
								// Update canvas element dimensions
								canvasElement.width = newWidth;
								canvasElement.height = newHeight;
								canvasElement.style.width = newWidth + 'px';
								canvasElement.style.height = newHeight + 'px';

								editor.canvas.setDimensions({
									width: newWidth,
									height: newHeight
								});
								editor.canvas.requestRenderAll();
								editor.syncCanvasState();
							}
						}
					});
					resizeObserver.observe(containerElement);
				} else {
					// Retry if container still has no dimensions
					setTimeout(initializeWhenReady, 10);
				}
			};

			// Give the DOM more time to settle
			setTimeout(() => {
				initializeWhenReady();
			}, 50);
		}

		return () => {
			resizeObserver?.disconnect();
			if (editor?.canvas) {
				editor.canvas.dispose();
			}
		};
	});
</script>

<div class="canvas-editor flex h-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div bind:this={containerElement} class="relative h-full w-full overflow-hidden">
			<canvas
				bind:this={canvasElement}
				class="block"
				style="width: 100%; height: 100%; display: block;"
			></canvas>
		</div>
	</div>

	<Footer {editor} />
</div>
