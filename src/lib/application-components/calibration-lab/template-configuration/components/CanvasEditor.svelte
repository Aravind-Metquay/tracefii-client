<script lang="ts">
	import { onMount } from 'svelte';
	import { Button } from '@/components/ui/button';
	import type { Editor } from '../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let canvasElement = $state<HTMLCanvasElement>();
	let containerElement = $state<HTMLDivElement>();

	onMount(() => {
		if (canvasElement && containerElement && editor) {
			editor.initializeCanvas(canvasElement, containerElement);
		}

		return () => {
			if (editor?.canvas) {
				editor.canvas.dispose();
			}
		};
	});

	function handleZoomIn() {
		if (editor) editor.zoomIn();
	}

	function handleZoomOut() {
		if (editor) editor.zoomOut();
	}

	function handleZoomReset() {
		if (editor) editor.autoZoom();
	}

	function handleUndo() {
		if (editor?.history) editor.history.undo();
	}

	function handleRedo() {
		if (editor?.history) editor.history.redo();
	}

	function handleExportPNG() {
		if (editor) editor.savePng();
	}

	function handleExportJSON() {
		if (editor) editor.saveJson();
	}

	// Reactive zoom percentage
	let zoomPercentage = $derived(Math.round((editor?.zoom || 1) * 100));
</script>

<div class="flex h-full flex-col">
	<!-- Main canvas content -->
	<div class="w-full flex-1">
		<div bind:this={containerElement} class="relative h-full w-full overflow-hidden">
			<canvas bind:this={canvasElement} class="block"></canvas>
		</div>
	</div>

	<!-- Footer -->
	<div class="canvas-footer flex flex-wrap items-center justify-between gap-4 p-4">
		<!-- Zoom Controls -->
		<div class="zoom-controls flex items-center gap-2">
			<Button onclick={handleZoomOut} size="sm">-</Button>
			<span class="w-12 text-center text-sm">{zoomPercentage}%</span>
			<Button onclick={handleZoomIn} size="sm">+</Button>
			<Button onclick={handleZoomReset} size="sm" variant="outline">Reset</Button>
		</div>

		<!-- Undo/Redo Toolbar -->
		<div class="main-toolbar flex items-center gap-2">
			<Button onclick={handleUndo} disabled={!editor?.history?.canUndo} size="sm" variant="outline">
				↶ Undo
			</Button>
			<Button onclick={handleRedo} disabled={!editor?.history?.canRedo} size="sm" variant="outline">
				↷ Redo
			</Button>
		</div>

		<!-- Export Buttons -->
		<div class="export-controls flex items-center gap-2">
			<Button onclick={handleExportPNG} size="sm" variant="outline">PNG</Button>
			<Button onclick={handleExportJSON} size="sm" variant="outline">JSON</Button>
		</div>
	</div>
</div>
