<script lang="ts">
	import type { Component as ComponentType, WorksheetManager } from '@/Types';
	import { getContext } from 'svelte';
	import type { Component } from 'svelte';

	import InputComponent from '../components/input-component.svelte';
	import TableComponent from '../components/table-component.svelte';
	import TextComponent from '../components/text-component.svelte';
	import SelectComponent from '../components/select-component.svelte';
	import GraphComponent from '../components/graph-component.svelte';

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	interface DynamicComponentProps {
		component: ComponentType;
	}

	const componentMap: Record<string, Component<DynamicComponentProps>> = {
		Input: InputComponent,
		Table: TableComponent,
		Text: TextComponent,
		Select: SelectComponent,
		Graph: GraphComponent
	};

	const components = $derived(worksheetManager.getComponentsOfCurrentFunction());
</script>

<div class="grid grid-cols-3 gap-6 overflow-y-auto p-4">
	{#each components as component (component.componentId)}
		{@const Renderer = componentMap[component.componentType]}

		{#if Renderer}
			<Renderer {component} />
		{/if}
	{/each}
</div>
