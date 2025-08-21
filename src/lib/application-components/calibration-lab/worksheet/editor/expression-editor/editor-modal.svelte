<script lang="ts">
	import { Button, Modal } from '@/components';
	import ExpressionEditor from './editor.svelte';
	import type { Component, ExpressionType, WorksheetManager } from '@/Types';

	let {
		isOpen = $bindable(false),
		worksheetManager,
		expressionType,
		component
	}: {
		isOpen: boolean;
		worksheetManager: WorksheetManager;
		expressionType: ExpressionType;
		component: Component;
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

	let updatedExpresssion = $state('');
	const updateExpression = () => {
		worksheetManager.updateExpression(
			expressionType,
			updatedExpresssion,
			component.functionId,
			component.componentId,
			worksheetManager.getCurrentActiveColumn()?.columnId
		);
		isOpen = false;
	};
	const closeModal = () => {
		updatedExpresssion = '';
		isOpen = false;
	};
</script>

<Modal.Root bind:isOpen title="Add Expression" size="large">
	<div class="flex flex-col">
		<ExpressionEditor
			expression={expression ? expression : ''}
			schema={worksheetManager.getWorkheetExpressionSchema()}
			onChange={(exp) => (updatedExpresssion = exp)}
		/>
		<div class="mt-2 self-end">
			<Button size="small" variant="error" onclick={closeModal}>Cancel</Button>
			<Button size="small" variant="primary" onclick={updateExpression}>Save</Button>
		</div>
	</div>
</Modal.Root>
