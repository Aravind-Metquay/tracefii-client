<script lang="ts">
	import { Button } from '@/components/ui/button';
	import type { ComponentType } from '../lib/types';

	let {
		availableComponents = [],
		onSelectComponent,
		editor
	} = $props<{
		availableComponents?: ComponentType[];
		onSelectComponent?: (component: ComponentType) => void;
		editor?: any;
	}>();

	const componentIcons: Record<string, string> = {
		Text: '📝',
		Date: '📅',
		Image: '🖼️',
		Barcode: '📊',
		'QR Code': '📱'
	};

	async function handleComponentClick(componentType: ComponentType) {
		onSelectComponent?.(componentType);

		if (!editor) return;

		switch (componentType) {
			case 'Text':
				if (editor.addText) editor.addText();
				break;
			case 'Date':
				if (editor.addDate) editor.addDate();
				break;
			case 'Image':
				if (editor.addImage)
					editor.addImage(
						'https://images-eu.ssl-images-amazon.com/images/G/31/sthaneka/Alphonsa/desktop/Unrec/low-res_2._CB789029460_.jpg'
					);
				break;
			case 'QR Code':
				if (editor.addQRCode) editor.addQRCode();
				break;
			case 'Barcode':
				if (editor.addBarcode) editor.addBarcode();
				break;
		}
	}
</script>

<div class="component-toolbar flex justify-center gap-2 rounded-lg p-4">
	{#each availableComponents as component}
		<Button
			onclick={() => handleComponentClick(component)}
			class="flex min-w-[80px] items-center justify-center gap-1 border-0 p-3 text-black bg-white shadow-lg"
		>
			<span class="text-2xl">{componentIcons[component] || '📄'}</span>
			<span class="text-xs">{component}</span>
		</Button>
	{/each}
</div>
