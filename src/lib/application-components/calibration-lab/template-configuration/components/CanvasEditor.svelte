<!-- CanvasEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '@/components/ui/button';
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

	function handleZoomIn() {
		if (editor?.zoomIn) {
			editor.zoomIn();
			// Force render after zoom
			editor.canvas?.requestRenderAll();
		}
	}

	function handleZoomOut() {
		if (editor?.zoomOut) {
			editor.zoomOut();
			// Force render after zoom
			editor.canvas?.requestRenderAll();
		}
	}

	function handleZoomReset() {
		if (editor?.setZoom) {
			editor.setZoom(1);
			// Force render after zoom reset
			editor.canvas?.requestRenderAll();
		}
	}

	function handleUndo() {
		if (editor?.history?.undo) {
			editor.history.undo();
			// Force render after undo
			editor.canvas?.requestRenderAll();
		}
	}

	function handleRedo() {
		if (editor?.history?.redo) {
			editor.history.redo();
			// Force render after redo
			editor.canvas?.requestRenderAll();
		}
	}

	function handleExportPNG() {
		if (editor?.savePng) editor.savePng();
	}

	function handleExportJSON() {
		if (editor?.saveJson) editor.saveJson();
	}

	let zoomPercentage = $derived(editor?.zoom ? Math.round(editor.zoom * 100) : 100);
</script>

<div class="canvas-editor flex h-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div bind:this={containerElement} class="relative h-full w-full overflow-hidden bg-gray-100">
			<canvas
				bind:this={canvasElement}
				class="block border border-gray-300"
				style="width: 100%; height: 100%; display: block;"
			></canvas>
		</div>
	</div>

	<div
		class="canvas-footer flex flex-wrap items-center justify-between gap-4 border-t bg-white p-4"
	>
		<div class="zoom-controls flex items-center gap-2">
			<Button onclick={handleZoomOut} size="sm">-</Button>
			<span class="w-12 text-center text-sm">{zoomPercentage}%</span>
			<Button onclick={handleZoomIn} size="sm">+</Button>
			<Button onclick={handleZoomReset} size="sm" variant="outline">Reset</Button>
		</div>

		<div class="main-toolbar flex items-center gap-2">
			<Button onclick={handleUndo} disabled={!editor?.history?.canUndo} size="sm" variant="outline">
				↶ Undo
			</Button>
			<Button onclick={handleRedo} disabled={!editor?.history?.canRedo} size="sm" variant="outline">
				↷ Redo
			</Button>
		</div>

		<div class="export-controls flex items-center gap-2">
			<Button onclick={handleExportPNG} size="sm" variant="outline">PNG</Button>
			<Button onclick={handleExportJSON} size="sm" variant="outline">JSON</Button>
		</div>
	</div>
</div>
