<script lang="ts">
	import { FileText, Calendar, Image as ImageIcon, QrCode, Barcode } from '@lucide/svelte';

	// The component receives the functions it needs to call from the parent
	let {
		addText,
		addBarcode,
		addQRCode,
		handleImageUpload
	}: {
		addText: () => void;
		addBarcode: () => void;
		addQRCode: () => void;
		handleImageUpload: (event: Event) => void;
	} = $props();

	const components = [
		{ name: 'Text', icon: FileText, action: addText },
		
		{ name: 'Barcode', icon: Barcode, action: addBarcode },
		{ name: 'QR Code', icon: QrCode, action: addQRCode }
	];
</script>

<div class="flex justify-center gap-2 rounded-lg p-2">
	{#each components as component}
		<button
			onclick={component.action}
			class="flex min-w-[90px] flex-col items-center justify-center gap-1 rounded-md bg-white p-2 text-black shadow-sm transition hover:bg-gray-100"
		>
			
 		<!-- <{component.icon} class="h-5 w-5" /> -->
			<span class="text-xs">{component.name}</span>
		</button>
	{/each}
	<label
		class="flex min-w-[90px] cursor-pointer flex-col items-center justify-center gap-1 rounded-md bg-white p-2 text-black shadow-sm transition hover:bg-gray-100"
	>
		<ImageIcon class="h-5 w-5" />
		<span class="text-xs">Image</span>
		<input type="file" accept="image/*" onchange={handleImageUpload} class="hidden" />
	</label>
</div>