<script lang="ts">
	import { FileText, Calendar, Image as ImageIcon, QrCode, Barcode, FileInput } from '@lucide/svelte';
	import { Button } from '@/components/ui/button';
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

	let fileInput: HTMLInputElement;	
	const triggerFileSelect = () => {
		fileInput.click();
	};
</script>

<div class="flex justify-center gap-2 rounded-lg p-2">
	{#each components as component}
		{@const Icon=component.icon}
		<Button
			onclick={component.action}
			class="flex min-w-[90px] flex-col items-center justify-center gap-1 rounded-md bg-white p-2 text-black shadow-sm transition "
		>
			
			<Icon class="h-5 w-5"/>
			<span class="text-xs">{component.name}</span>
		</Button>
	{/each}
	<Button
			onclick={triggerFileSelect}
		class="flex min-w-[90px]  flex-col items-center justify-center gap-1 rounded-md bg-white p-2 text-black shadow-sm transition"
	>
		<ImageIcon class="h-5 w-5" />
		<span class="text-xs">Image</span>

	</Button>
	<input bind:this={fileInput} type="file" accept="image/png, image/jpeg" onchange={handleImageUpload} class="hidden" />
</div>