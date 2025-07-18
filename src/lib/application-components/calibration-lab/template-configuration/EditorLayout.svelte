<script lang="ts">
	import { setContext } from 'svelte';
	import ContainerPanel from './components/ContainerPanel.svelte';
	import ComponentToolbar from './components/ComponentToolbar.svelte';
	import CanvasEditor from './components/CanvasEditor.svelte';
	import ConfigPanel from './components/configPanel/defaultPanel.svelte';
	import type { AppState } from './store/app-state.svelte';
	import type { ComponentType } from './lib/types';

	let { appState } = $props<{ appState: AppState }>();

	setContext('appState', appState);

	function handleComponentSelect(componentType: ComponentType) {
		appState.setSelectedComponentType(componentType);
	}
</script>

<div class="editor-layout flex h-screen w-full overflow-hidden">
	<!-- Left Panel -->
	<div class="w-64 shrink-0 border-r border-gray-200 bg-gray-50">
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
	<div class="flex min-w-0 flex-1 flex-col">
		<!-- Component Toolbar -->
		{#if appState.canAddComponents}
			<div class="border-b border-gray-200 bg-white p-4">
				<ComponentToolbar
					availableComponents={appState.availableComponents}
					onSelectComponent={handleComponentSelect}
					editor={appState.editor}
				/>
			</div>
		{/if}

		<!-- Canvas Area -->
		<div class="flex-1 overflow-auto p-4">
			<div class="h-full w-full rounded-lg bg-white shadow-sm">
				<CanvasEditor editor={appState.editor} />
			</div>
		</div>
	</div>

	<!-- Right Panel -->
	<div class="w-64 shrink-0 border-l border-gray-200 bg-gray-50">
		<ConfigPanel
			editor={appState.editor}
			selectedComponentType={appState.uiState.selectedComponentType}
		/>
	</div>
</div>
