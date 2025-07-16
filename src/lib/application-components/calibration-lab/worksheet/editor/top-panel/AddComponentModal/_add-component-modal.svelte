<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { Component } from 'src/Types';
	import ComponentSelection from './component-selection.svelte';
	import ComponentTypeSelection from './component-type-selection.svelte';
	let { open = $bindable() }: { open: boolean } = $props();
    let component = $state<Component>()
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Add New Component</Dialog.Title>
		</Dialog.Header>
        <div>
            <ComponentSelection />
            <!-- <ComponentTypeSelection component={component} /> -->
        </div>
	</Dialog.Content>
</Dialog.Root>
