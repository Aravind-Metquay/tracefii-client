<script lang="ts">
    import { Button } from '@/components/ui/button';
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
	let {
		zoom = $bindable(),
		zoomIn,
		zoomOut,
        resetZoom,
		undo,
		redo,
		savePng,
		saveJpg,
		saveSvg,
		savePdf,
		saveJson
	} = $props<{
		zoom: number;
		zoomIn: () => void;
		zoomOut: () => void;
		resetZoom: () => void;
		undo: () => void;
		redo: () => void;
		savePng: () => void;
		saveJpg: () => void;
		saveSvg: () => void;
		savePdf: () => void;
		saveJson: () => void;
	}>();

	let downloadButtonContainer = $state<HTMLDivElement | null>(null);
	let dropdownMenu = $state<HTMLDivElement | null>(null);

	let showDownloadMenu = $state(false);

	const toggleDownloadMenu = () => {
		showDownloadMenu = !showDownloadMenu;
	};

	// Add this entire $effect block
$effect(() => {
	const handleClickOutside = (event: MouseEvent) => {
		// Close menu if click is not on the button or inside the menu
		if (
			showDownloadMenu &&
			!downloadButtonContainer?.contains(event.target as Node) &&
			!dropdownMenu?.contains(event.target as Node)
		) {
			showDownloadMenu = false;
		}
	};

	// Add listener when menu is shown
	document.addEventListener('click', handleClickOutside, true);

	// Cleanup listener when effect re-runs or component is destroyed
	return () => {
		document.removeEventListener('click', handleClickOutside, true);
	};
});
</script>

<div
	class="flex h-14 w-full items-center justify-between border-t bg-white px-4 shadow-sm"
	role="toolbar"
>
	<div class="flex items-center gap-4">
		<div class="flex items-center gap-2 rounded-md border bg-gray-50 p-1">
            <div class="group relative inline-block">
			<ZoomOut
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={zoomOut}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Zoom Out
			</div>
		    </div>

			<span class="w-12 text-center text-sm font-medium text-gray-700">
				{Math.round(zoom * 100)}%
			</span>
			
            <div class="group relative inline-block">
			<ZoomIn
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={zoomIn}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Zoom In
			</div>
		    </div>
        
        </div>

        	<div class="group relative inline-block">
			<RefreshCcw
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={resetZoom}
			/>
			<div
				class="absolute bottom-full left-1/2 z-10 mb-2
						hidden -translate-x-1/2 rounded bg-black px-2
						py-1 text-sm whitespace-nowrap text-white shadow-lg group-hover:block"
			>
				Reset Zoom
			</div>
		</div>
		<div class="flex items-center gap-2 text-gray-500">

			<div class="group relative inline-block">
			<Undo2
				class="h-6 w-6 cursor-pointer text-gray-800 transition-colors hover:text-gray-600"
				onclick={undo}
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
				onclick={redo}
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
	</div>

	<div class="relative" bind:this={downloadButtonContainer}>

        <Button
				class="flex h-9 items-center gap-2 bg-gray-900 px-4 text-white transition-colors hover:bg-gray-800"
				onclick={toggleDownloadMenu}
				
			>
				<Download class="h-4 w-4" />
				Download
				<ChevronDown class="h-4 w-4" />
			</Button>


		{#if showDownloadMenu}
			<div
				class="absolute bottom-full right-0 mb-2 w-48 origin-bottom-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
			>
				<button
					class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					onclick={() => {
						savePng();
						showDownloadMenu = false;
					}}>Download as PNG</button
				>
				<button
					class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					onclick={() => {
						saveJpg();
						showDownloadMenu = false;
					}}>Download as JPG</button
				>
				<button
					class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					onclick={() => {
						saveSvg();
						showDownloadMenu = false;
					}}>Download as SVG</button
				>
				<button
					class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					onclick={() => {
						savePdf();
						showDownloadMenu = false;
					}}>Download as PDF</button
				>
				<div class="my-1 border-t"></div>
				<button
					class="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
					onclick={() => {
						saveJson();
						showDownloadMenu = false;
					}}>Download as JSON</button
				>
			</div>
		{/if}
	</div>
</div>