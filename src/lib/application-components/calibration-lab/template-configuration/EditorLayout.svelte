<script lang="ts">
	import { setContext } from 'svelte';
	import ContainerPanel from './components/ContainerPanel.svelte';
	import ComponentToolbar from './components/ComponentToolbar.svelte';
	import CanvasEditor from './components/CanvasEditor.svelte';
	import ConfigPanel from './components/DefaultConfigPanel.svelte';
	import type { ComponentType } from './lib/types';

	let { appState } = $props();

	setContext('appState', appState);

	function handleComponentSelect(componentType: ComponentType) {
		appState.setSelectedComponentType(componentType);
	}
</script>

<div class="editor-layout flex h-screen w-full overflow-hidden bg-gray-100">
	<!-- Left Panel -->
	<div
		class="w-80 max-w-[320px] min-w-[320px] shrink-0 border-r border-slate-200/60 bg-white/95 shadow-lg backdrop-blur-sm"
	>
		<div class="scrollbar-hide h-full overflow-y-auto">
			<ContainerPanel
				bind:selectedType={appState.uiState.selectedType}
				onTypeChange={appState.setSelectedType}
				bind:dimensions={appState.uiState.dimensions}
				bind:unit={appState.uiState.unit}
				bind:backgroundColor={appState.uiState.backgroundColor}
				editor={appState.editor}
			/>
		</div>
	</div>

	<!-- Main Content -->
	<div class="flex min-w-0 flex-1 flex-col overflow-hidden bg-gray-50">
		<!-- Component Toolbar -->
		{#if appState.canAddComponents}
			<div class="shrink-0 border-b border-gray-200 bg-white p-4 shadow-sm">
				<ComponentToolbar
					availableComponents={appState.availableComponents}
					onSelectComponent={handleComponentSelect}
					editor={appState.editor}
				/>
			</div>
		{/if}

		<!-- Canvas -->
		<div class="flex flex-1 items-center justify-center p-6">
				<CanvasEditor editor={appState.editor} />
		</div>
	</div>

	<!-- Right Panel -->
	<div
		class="w-80 max-w-[320px] min-w-[320px] shrink-0 border-l border-slate-200/60 bg-white/95 shadow-lg backdrop-blur-sm"
	>
		<div class="scrollbar-hide h-full overflow-y-auto">
			<ConfigPanel
				editor={appState.editor}
				selectedComponentType={appState.uiState.selectedComponentType}
			/>
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
