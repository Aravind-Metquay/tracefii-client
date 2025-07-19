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
			// Wait for the container to have proper dimensions
			const initializeWhenReady = () => {
				if (!containerElement) return;
				const width = containerElement.offsetWidth;
				const height = containerElement.offsetHeight;

				if (width > 0 && height > 0) {
					editor.initializeCanvas(canvasElement, containerElement);

					// Force canvas to have proper dimensions
					if (editor.canvas) {
						editor.canvas.setDimensions({ width, height });
						editor.syncCanvasState();
					}

					// Set up resize observer to handle dynamic resizing
					resizeObserver = new ResizeObserver((entries) => {
						for (const entry of entries) {
							const { width: newWidth, height: newHeight } = entry.contentRect;
							if (editor.canvas && newWidth > 0 && newHeight > 0) {
								editor.canvas.setDimensions({
									width: newWidth,
									height: newHeight
								});
								editor.syncCanvasState();
							}
						}
					});
					resizeObserver.observe(containerElement);
				} else {
					// If container still has no dimensions, wait a bit more
					requestAnimationFrame(initializeWhenReady);
				}
			};

			// Use double requestAnimationFrame to ensure layout is complete
			requestAnimationFrame(() => {
				requestAnimationFrame(initializeWhenReady);
			});
		}

		return () => {
			resizeObserver?.disconnect();
			if (editor?.canvas) {
				editor.canvas.dispose();
			}
		};
	});

	function handleZoomIn() {
		if (editor?.zoomIn) editor.zoomIn();
	}

	function handleZoomOut() {
		if (editor?.zoomOut) editor.zoomOut();
	}

	function handleZoomReset() {
		if (editor?.setZoom) editor.setZoom(1);
	}

	function handleUndo() {
		if (editor?.history?.undo) editor.history.undo();
	}

	function handleRedo() {
		if (editor?.history?.redo) editor.history.redo();
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
	<div class="w-full flex-1 min-h-0">
		<div bind:this={containerElement} class="relative h-full w-full overflow-hidden">
			<canvas bind:this={canvasElement} class="block" style="width: 100%; height: 100%;"></canvas>
		</div>
	</div>

	<div class="canvas-footer flex flex-wrap items-center justify-between gap-4 p-4">
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
