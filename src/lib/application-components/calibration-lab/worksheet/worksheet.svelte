<script lang="ts">
	import { setContext } from 'svelte';
	import Editor from './editor/editor.svelte';
	import type { ExpressionType, WorksheetManager } from '@/Types';
	import ExpressionEditorModal from './editor/expression-editor/editor-modal.svelte';

	let { worksheetManager }: { worksheetManager: WorksheetManager } = $props();
	setContext('worksheetManager', worksheetManager);

	let isOpen: boolean = $state(false);
	let expressionType: ExpressionType = $state('valueExpression');
	setContext('expressionModalVisibility', {
		set(value: boolean, expressionType: ExpressionType) {
			isOpen = value;
			expressionType = expressionType;
		}
	});
	$inspect(worksheetManager.getWorksheet());
</script>

<Editor />
<ExpressionEditorModal bind:isOpen {expressionType} {worksheetManager} />
