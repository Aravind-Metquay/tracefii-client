<script lang="ts">
	import { Button } from '@/components/ui/button';
	import type { Editor } from '../lib/types';
	import {
		Undo2,
		Redo2,
		RefreshCcw,
		Image,
		FileJson,
		ZoomIn,
		ZoomOut,
		Download,
		FileImage,
		FileText,
		ChevronDown
	} from '@lucide/svelte';

	let { editor } = $props<{ editor: Editor }>();
	let isDownloadDropdownOpen = $state(false);

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
		isDownloadDropdownOpen = false;
	}

	function handleExportJSON() {
		if (editor?.saveJson) editor.saveJson();
		isDownloadDropdownOpen = false;
	}

	function handleExportPDF() {
		if (editor?.savePdf) editor.savePdf();
		isDownloadDropdownOpen = false;
	}

	function handleExportSVG() {
		if (editor?.saveSvg) editor.saveSvg();
		isDownloadDropdownOpen = false;
	}

	function handleExportJPEG() {
		if (editor?.saveJpeg) editor.saveJpeg();
		isDownloadDropdownOpen = false;
	}

	function toggleDownloadDropdown() {
		isDownloadDropdownOpen = !isDownloadDropdownOpen;
	}

	function closeDropdown() {
		isDownloadDropdownOpen = false;
	}

	// Close dropdown when clicking outside
	function handleClickOutside(event: Event) {
		const target = event.target as HTMLElement;
		const dropdown = document.querySelector('.download-dropdown');
		if (dropdown && !dropdown.contains(target)) {
			closeDropdown();
		}
	}

	let zoomPercentage = $derived(editor?.zoom ? Math.round(editor.zoom * 100) : 100);
</script>

<svelte:window on:click={handleClickOutside} />

<div class="canvas-footer flex items-center justify-between border-t p-4">
	<div class="zoom-controls flex items-center gap-3">
		<div class="group relative inline-block">
			<ZoomOut
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={handleZoomOut}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Zoom Out
			</div>
		</div>

		<span class="min-w-[3rem] text-center text-sm font-medium text-gray-700">{zoomPercentage}%</span
		>

		<div class="group relative inline-block">
			<ZoomIn
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={handleZoomIn}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Zoom In
			</div>
		</div>

		<div class="mx-1 h-6 w-px bg-gray-300"></div>

		<div class="group relative inline-block">
			<RefreshCcw
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={handleZoomReset}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Reset Zoom
			</div>
		</div>
	</div>

	<div class="main-toolbar flex items-center gap-3">
		<div class="group relative inline-block">
			<Undo2
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={handleUndo}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Undo
			</div>
		</div>

		<div class="group relative inline-block">
			<Redo2
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={handleRedo}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Redo
			</div>
		</div>
	</div>

	<div class="export-controls flex items-center">
		<div class="download-dropdown group relative inline-block">
			<Button
				class="flex h-9 items-center gap-2 bg-gray-900 px-4 text-white transition-colors hover:bg-gray-800"
				onclick={toggleDownloadDropdown}
				onmouseenter={() => (isDownloadDropdownOpen = true)}
			>
				<Download class="h-4 w-4" />
				Download
				<ChevronDown class="h-4 w-4" />
			</Button>

			{#if isDownloadDropdownOpen}
				<div
					class="absolute right-0 bottom-full z-20 mb-2 w-full min-w-[140px]
						   rounded-md border bg-white shadow-lg"
					onmouseleave={closeDropdown}
				>
					<div class="py-1">
						<button
							class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm
								   text-gray-700 transition-colors hover:bg-gray-100"
							onclick={handleExportPNG}
						>
							<FileImage class="h-4 w-4" />
							PNG
						</button>

						<button
							class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm
								   text-gray-700 transition-colors hover:bg-gray-100"
							onclick={handleExportJPEG}
						>
							<FileImage class="h-4 w-4" />
							JPEG
						</button>

						<button
							class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm
								   text-gray-700 transition-colors hover:bg-gray-100"
							onclick={handleExportSVG}
						>
							<Image class="h-4 w-4" />
							SVG
						</button>

						<button
							class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm
								   text-gray-700 transition-colors hover:bg-gray-100"
							onclick={handleExportPDF}
						>
							<FileText class="h-4 w-4" />
							PDF
						</button>

						<button
							class="flex w-full items-center gap-2 px-4 py-2 text-left text-sm
								   text-gray-700 transition-colors hover:bg-gray-100"
							onclick={handleExportJSON}
						>
							<FileJson class="h-4 w-4" />
							JSON
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
