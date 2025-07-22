<!-- Footer.svelte -->
<script lang="ts">
	import { Button } from '@/components/ui/button';
	import type { Editor } from '../lib/types';
	import { Undo2,Redo2,  RefreshCcw,  Image,FileJson,
		 ZoomIn, ZoomOut
	} from '@lucide/svelte';

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
		
		<div class="relative group inline-block">
			<ZoomOut
				class="h-7 w-7 cursor-pointer text-gray-800" 
				onclick={handleZoomOut}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				Zoom Out
			</div>
		</div>

		<span class="w-12 text-center text-[16px] ">{zoomPercentage}%</span>

			 <div class="relative group inline-block">
			<ZoomIn
				class="h-7 w-7 cursor-pointer text-gray-800" 
				onclick={handleZoomIn}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				Zoom In
			</div>
		     </div>
		

		 <div class="relative group inline-block">
			<RefreshCcw 
				class="h-7 w-7 cursor-pointer text-gray-800" 
				onclick={handleZoomReset}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				Reset
			</div>
		</div>
		
	</div>

	<div class="main-toolbar flex items-center gap-2">
	
		 <div class="relative group inline-block">
			<Undo2 
				class="h-7 w-7 cursor-pointer text-gray-800" 
				onclick={handleUndo}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				Undo
			</div>
		</div>
			

		
		<div class="relative group inline-block">
			<Redo2 
				class="h-7 w-7 cursor-pointer text-gray-800" 
				onclick={handleRedo}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				Redo
			</div>
		</div>
	</div>

	<div class="export-controls flex items-center gap-2">
		
			<div class="relative group inline-block">
			<Image 
				class="h-7 w-7 cursor-pointer text-black" 
				onclick={handleExportPNG}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				PNG
			</div>
		</div>
		
		<div class="relative group inline-block">
			<FileJson 
				class="h-7 w-7 cursor-pointer text-blacgik" 
				onclick={handleExportJSON}
			/>
			<div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
						hidden group-hover:block bg-black text-white text-sm 
						px-2 py-1 rounded shadow-lg z-10 whitespace-nowrap">
				JSON
		</div>
		</div>
	</div>
</div>
