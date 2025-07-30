<script lang="ts">
	import { setContext } from 'svelte';
	import Editor from './editor/editor.svelte';
	import ExpressionEditor from './editor/expression-editor/editor.svelte';
	import { Drawer, Modal } from '@/components';

	let expression: string = $state('');
	let { worksheetManager } = $props();
	setContext('worksheetManager', worksheetManager);
	let isOpen: boolean = $state(false);
</script>

<button onclick={() => (isOpen = true)}>OPen</button>
<!-- <Editor /> -->

<Modal.Root bind:isOpen title="Add Expression" size="large">
	<ExpressionEditor />
</Modal.Root>
