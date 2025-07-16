<script>
	import { setContext } from 'svelte';
	import ContainerPanel from './ContainerPanel.svelte';
	import ComponentToolbar from './ComponentToolbar.svelte';
	import MainToolbar from './MainToolbar.svelte';
	import CanvasEditor from './CanvasEditor.svelte';
	import PropertyPanel from './PropertyPanel.svelte';

	let { appState } = $props();

	setContext('appState', appState);

	function handleComponentSelect(componentType) {
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
		<!-- Main Toolbar -->
		<MainToolbar editor={appState.editor} />

		<!-- Canvas Area -->
		<div class="flex-1 bg-gray-50 p-4">
			<div class="flex h-full flex-col rounded-lg border bg-white shadow-md">
				<!-- Component Toolbar -->
				{#if appState.canAddComponents}
					<div class="border-b p-4">
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
	<PropertyPanel editor={appState.editor} />
</div>
