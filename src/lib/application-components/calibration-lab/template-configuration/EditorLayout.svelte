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
	<div class="w-80 shrink-0 border-r border-gray-200 bg-white">
		<ContainerPanel
			bind:selectedType={appState.uiState.selectedType}
			onTypeChange={appState.setSelectedType}
			bind:dimensions={appState.uiState.dimensions}
			bind:unit={appState.uiState.unit}
			bind:backgroundColor={appState.uiState.backgroundColor}
			editor={appState.editor}
		/>
	</div>

	<!-- Main Content -->
	<div class="flex min-w-0 flex-1 flex-col bg-gray-50">
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

		<!-- Canvas Area -->
		<!-- Canvas -->
		<div class="flex-1">
			<CanvasEditor editor={appState.editor} />
		</div>
	</div>

	<!-- Right Panel -->
	<div class="w-80 shrink-0 border-l border-gray-200 ">
		<ConfigPanel
			editor={appState.editor}
			selectedComponentType={appState.uiState.selectedComponentType}
		/>
	</div>
</div>
