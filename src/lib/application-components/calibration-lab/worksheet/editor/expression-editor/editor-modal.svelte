<script lang="ts">
	import { Modal } from '@/components';
	import ExpressionEditor from './editor.svelte';
	import type { ExpressionType, WorksheetManager } from '@/Types';

	let {
		isOpen = $bindable(false),
		worksheetManager,
		expressionType
	}: {
		isOpen: boolean;
		worksheetManager: WorksheetManager;
		expressionType: ExpressionType;
	} = $props();

	const expression = $derived.by(() => {
		let currentActiveComponent = worksheetManager.getCurrentActiveComponent();
		let currentActiveColumn = worksheetManager.getCurrentActiveColumn();

		if (!currentActiveComponent?.componentId || !currentActiveComponent.functionId) {
			console.warn('No component or componentId', JSON.stringify(currentActiveComponent));
			return null;
		}

		try {
			return worksheetManager.getExpression(
				currentActiveComponent.functionId,
				expressionType,
				currentActiveComponent.componentId,
				currentActiveColumn?.columnId
			);
		} catch (err) {
			console.error('Error in getExpression:', err);
			return null;
		}
	});

	//Then we need an onSave functionality to save the expression.
	//Clearing the state and all.
	//No need to bound inside the epxression modal.
	//Would be awesome if onChange has a debounce option also.
</script>

<Modal.Root bind:isOpen title="Add Expression" size="large">
	<ExpressionEditor
		expression={expression ? expression : ''}
		schema={worksheetManager.getWroskheetExpressionData()}
	/>
</Modal.Root>
