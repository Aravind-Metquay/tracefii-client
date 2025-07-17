<script lang="ts">
	import { setContext } from 'svelte';
	import ContainerPanel from './components/ContainerPanel.svelte';
	import ComponentToolbar from './components/ComponentToolbar.svelte';
	import CanvasEditor from './components/CanvasEditor.svelte';
	import ConfigPanel from './components/configPanel/defaultPanel.svelte';

	let { appState } = $props();

	setContext('appState', appState);

	function handleComponentSelect(componentType: String) {
		appState.setSelectedComponentType(componentType);
	}
</script>

<div class="editor-layout flex h-screen">
	<!-- Left Panel -->
	<ContainerPanel
		bind:selectedType={appState.uiState.selectedType}
		onTypeChange={appState.setSelectedType}
		bind:dimensions={appState.uiState.dimensions}
		bind:unit={appState.uiState.unit}
		bind:backgroundColor={appState.uiState.backgroundColor}
		editor={appState.editor}
	/>

	<!-- Main Content -->
	<div class="flex flex-1 flex-col">
		<!-- Canvas Area -->
		<div class="flex-1 p-4">
			<div class="flex h-full flex-col rounded-lg">
				<!-- Component Toolbar -->
				{#if appState.canAddComponents}
					<div class="p-4">
						<ComponentToolbar
							availableComponents={appState.availableComponents}
							onSelectComponent={handleComponentSelect}
							editor={appState.editor}
						/>
					</div>
				{/if}

				<!-- Canvas -->
				<div class="flex-1">
					<CanvasEditor editor={appState.editor} />
				</div>
			</div>
		</div>
	</div>

	<!-- Right Panel -->
	<ConfigPanel editor={appState.editor} />
</div>
