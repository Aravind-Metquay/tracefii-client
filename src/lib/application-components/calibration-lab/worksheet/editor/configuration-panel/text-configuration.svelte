<script lang="ts">
	import { getContext } from 'svelte';
	import type { Component, TextComponent , WorksheetManager} from '@/Types';
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let { component }: { component: Component } = $props();

	function handleComponentUpdate(updates: Partial<Component>) {
		worksheetManager.updateBaseComponentProperties(component.componentId, updates);
	}

	function handleTextUpdate(updates: Partial<TextComponent>) {
		worksheetManager.updateTextComponent(component.componentId, updates);
	}
</script>

{#if component?.textComponent}
	<div class="space-y-4 p-4">
		<!-- Text Type -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Text Type</label>
			<select
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.textComponent.type}
				onchange={(e) =>
					handleTextUpdate({ type: e.currentTarget.value as 'Heading' | 'Paragraph' })}
			>
				<option value="Heading">Heading</option>
				<option value="Paragraph">Paragraph</option>
			</select>
		</div>

		<!-- Heading Text -->
		{#if component.textComponent.type === 'Heading'}
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">Heading Text</label>
				<input
					type="text"
					class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={component.textComponent.heading}
					oninput={(e) => handleTextUpdate({ heading: e.currentTarget.value })}
					placeholder="Enter heading text"
				/>
			</div>
		{/if}

		<!-- Label (for Paragraph) -->
		{#if component.textComponent.type === 'Paragraph'}
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">Label</label>
				<input
					type="text"
					class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={component.label}
					oninput={(e) => handleComponentUpdate({ label: e.currentTarget.value })}
					placeholder="Enter paragraph label"
				/>
			</div>
		{/if}

		<!-- Order -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Order</label>
			<input
				type="number"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.order}
				oninput={(e) => handleComponentUpdate({ order: parseInt(e.currentTarget.value) })}
			/>
		</div>
	</div>
{/if}
