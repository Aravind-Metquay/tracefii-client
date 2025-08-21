<script>
	import { Button } from '@/components/ui/button';
	import FabricCanvas from './FabricCanvas.svelte';

	let { editor } = $props();

	function handleZoomIn() {
		editor.setZoom(editor.zoom + 0.1);
	}

	function handleZoomOut() {
		editor.setZoom(editor.zoom - 0.1);
	}

	function handleZoomReset() {
		editor.setZoom(1);
	}
</script>

<div class="canvas-editor flex h-full flex-col">
	<!-- Main canvas content -->
	<div class="canvas-content flex-1">
		<FabricCanvas {editor} />
	</div>

	<!-- Footer -->
	<div
		class="canvas-footer flex flex-wrap items-center justify-between gap-4 p-4"
	>
		<!-- Zoom Controls -->
		<div class="zoom-controls flex items-center gap-2">
			<Button onclick={handleZoomOut} size="sm">-</Button>
			<span class="w-12 text-center text-sm">{Math.round(editor.zoom * 100)}%</span>
			<Button onclick={handleZoomIn} size="sm">+</Button>
			<Button onclick={handleZoomReset} size="sm" variant="outline">Reset</Button>
		</div>

		<!-- Undo/Redo Toolbar -->
		<div class="main-toolbar flex items-center gap-2">
			<Button onclick={editor.undo} disabled={!editor.canUndo} size="sm" variant="outline">
				↶ Undo
			</Button>
			<Button onclick={editor.redo} disabled={!editor.canRedo} size="sm" variant="outline">
				↷ Redo
			</Button>
		</div>

		<!-- Export Buttons -->
		<div class="export-controls flex items-center gap-2">
			<Button onclick={editor.exportToPNG} size="sm" variant="outline">PNG</Button>
			<Button onclick={editor.exportToJSON} size="sm" variant="outline">JSON</Button>
		</div>
	</div>
</div>
