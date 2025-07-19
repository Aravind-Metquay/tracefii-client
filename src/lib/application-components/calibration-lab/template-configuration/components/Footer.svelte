<!-- Footer.svelte -->
<script lang="ts">
	import { Button } from '@/components/ui/button';
	import type { Editor } from '../lib/types';

	let { editor } = $props<{ editor: Editor }>();

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

<div class="canvas-footer flex flex-wrap items-center justify-between gap-4 border-t bg-white p-4">
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
