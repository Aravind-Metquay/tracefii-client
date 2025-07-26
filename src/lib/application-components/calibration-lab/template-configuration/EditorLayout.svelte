<script lang="ts">
	import { setContext } from 'svelte';
	import ContainerPanel from './components/ContainerPanel.svelte';
	import ComponentToolbar from './components/ComponentToolbar.svelte';
	import CanvasEditor from './components/CanvasEditor.svelte';
	import ConfigPanel from './components/DefaultConfigPanel.svelte';
	import type { ComponentType } from './lib/types';

	let { appState = $bindable() } = $props();

	setContext('appState', appState);

	function handleComponentSelect(componentType: ComponentType) {
		appState.setSelectedComponentType(componentType);
	}
</script>

<div class="editor-layout flex h-screen w-full overflow-hidden bg-gray-100">
	<!-- Left Panel (Container Panel) -->
	<div
		class="w-80 max-w-[320px] min-w-[320px] shrink-0 border-r border-slate-200/60 bg-white/95 shadow-lg backdrop-blur-sm"
	>
		<div class="scrollbar-hide h-full overflow-y-auto">
			{#if appState.uiState}
				<ContainerPanel
					bind:selectedType={appState.uiState.selectedType}
					onTypeChange={appState.setSelectedType}
					bind:dimensions={appState.uiState.dimensions}
					bind:unit={appState.uiState.unit}
					bind:backgroundColor={appState.uiState.backgroundColor}
					editor={appState.editor}
				/>
			{:else}
				<div class="p-4 text-center text-gray-500">Loading...</div>
			{/if}
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex min-w-0 flex-1 flex-col overflow-hidden">
		<!-- Component Toolbar -->
		{#if appState.canAddComponents}
			<div class="border-b p-4">
				<ComponentToolbar
					availableComponents={appState.availableComponents}
					onSelectComponent={(componentType) =>
						handleComponentSelect(componentType as ComponentType)}
					editor={appState.editor}
				/>
			</div>
		{/if}

		<!-- Canvas -->
		<div class="flex min-h-0 flex-1 flex-col overflow-hidden">
			<CanvasEditor editor={appState.editor} backgroundColor={appState.uiState.backgroundColor} />
		</div>
	</div>

	<!-- Right Panel (Config Panel) -->
	<div
		class="w-80 max-w-[320px] min-w-[320px] shrink-0 border-l border-slate-200/60 bg-white/95 shadow-lg backdrop-blur-sm"
	>
		<div class="scrollbar-hide h-full overflow-y-auto">
			{#if appState.uiState}
				<ConfigPanel
					editor={appState.editor}
					selectedComponentType={appState.uiState.selectedComponentType}
				/>
			{:else}
				<div class="p-4 text-center text-gray-500">Loading...</div>
			{/if}
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar but keep functionality */
	.scrollbar-hide {
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}
	.scrollbar-hide::-webkit-scrollbar {
		display: none; /* Chrome, Safari, Opera */
	}
</style>
