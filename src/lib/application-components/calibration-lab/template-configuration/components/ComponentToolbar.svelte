<script lang="ts">
	import { Button } from '@/components/ui/button';

	let { availableComponents = [], onSelectComponent, editor } = $props();

	const componentIcons = {
		Text: '📝',
		Date: '📅',
		Image: '🖼️',
		Barcode: '📊',
		'QR Code': '📱'
	};

	async function handleComponentClick(componentType: String) {
		onSelectComponent?.(componentType);

		switch (componentType) {
			case 'Text':
				editor.addText();
				break;
			case 'Date':
				editor.addDate();
				break;
			case 'Image':
				// In real app, open file picker
				editor.addImage('https://via.placeholder.com/150');
				break;
			case 'QR Code':
				editor.addQRCode();
				break;
			case 'Barcode':
				editor.addBarcode();
				break;
		}
	}
</script>

<div class="component-toolbar flex justify-center gap-2 rounded-lg p-4">
	{#each availableComponents as component}
		<Button
			onclick={() => handleComponentClick(component)}
			variant="outline"
			class="flex min-w-[80px] items-center justify-center gap-1 p-3"
			><span class="text-2xl">{componentIcons[component as keyof typeof componentIcons]}</span>
			<span class="text-xs">{component}</span>
		</Button>
	{/each}
</div>
