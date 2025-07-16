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
	<div class="canvas-content flex-1">
		<FabricCanvas {editor} />
	</div>

	<div class="canvas-footer flex items-center justify-between border-t bg-white p-4">
		<div class="zoom-controls flex items-center gap-2">
			<Button onclick={handleZoomOut} size="sm">-</Button>
			<span class="text-sm">{Math.round(editor.zoom * 100)}%</span>
			<Button onclick={handleZoomIn} size="sm">+</Button>
			<Button onclick={handleZoomReset} size="sm" variant="outline">Reset</Button>
		</div>

		<div class="export-controls flex items-center gap-2">
			<Button onclick={editor.exportToPNG} size="sm" variant="outline">PNG</Button>
			<Button onclick={editor.exportToJSON} size="sm" variant="outline">JSON</Button>
		</div>
	</div>
</div>
