<script lang="ts">
	import type { Component } from '@/Types';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '@/Types';

	const { component } = $props<{ component: Component }>();
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	const currentActiveFunctionId = $derived(worksheetManager.getCurrentActiveFunction()?.functionId);

	let currentValue = $derived(
		worksheetManager.getComponentValue(component.functionId, component.componentId)
	);

	const isNumberType = $derived(component.inputComponent?.type === 'Number');
	const isDisabled = $derived(component.isDisabled || component.isReadOnly);
	const validationError = $derived(component.isValidationEnabled && component.validationExpression);

	function handleNumberChange(e: Event) {
		const value = (e.target as HTMLInputElement).value.trim();

		if (!value || value === '-') {
			currentActiveFunctionId &&
				worksheetManager.setComponentValue(component.functionId, component.componentId, 0);
			return;
		}

		let numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			const roundingDigits = component.inputComponent?.roundingDigits;

			if (typeof roundingDigits === 'number' && roundingDigits >= 0) {
				numValue = parseFloat(numValue.toFixed(roundingDigits));
			}


			if (component.functionId) {
				worksheetManager.setComponentValue(component.functionId, component.componentId, numValue);
			}
		}
	}

	function handleTextChange(e: Event) {
		const newValue = (e.target as HTMLInputElement).value;
		if (component.functionId) {
			worksheetManager.setComponentValue(component.functionId, component.componentId, newValue);
		}
	}
</script>

{#if currentActiveFunctionId && component.componentType === 'Input' && component.inputComponent}
	<div
		class="flex w-56 cursor-pointer flex-col"
		onclick={() => worksheetManager.setCurrentActiveComponent(component)}
	>
		<label class="mx-1 text-xs" for={component.componentId}>
			{component.label || 'Input'}
			{#if component.isRequired}
				<span class="ml-1 text-red-500">*</span>
			{/if}
			{#if component.isReadOnly}
				<span class="ml-1 text-xs text-gray-500">(Read-only)</span>
			{/if}
		</label>

		{#if isNumberType}
			<input
				class="mx-1 rounded-md border border-black p-1 text-sm outline-none {isDisabled
					? 'cursor-not-allowed bg-gray-100'
					: ''} {validationError ? 'border-red-500' : ''}"
				aria-label={component.label || 'Input field'}
				id={component.componentId}
				name={component.componentId}
				type="number"
				value={currentValue}
				disabled={isDisabled}
				readonly={component.isReadOnly}
				aria-invalid={validationError ? 'true' : undefined}
				aria-errormessage={validationError ? `${component.componentId}-error` : undefined}
				required={component.isRequired}
				oninput={handleNumberChange}
			/>
		{:else}
			<input
				class="mx-1 rounded-md border border-black p-1 text-sm outline-none {isDisabled
					? 'cursor-not-allowed bg-gray-100'
					: ''} {validationError ? 'border-red-500' : ''}"
				aria-label={component.label || 'Input field'}
				id={component.componentId}
				name={component.componentId}
				type="text"
				value={currentValue}
				disabled={isDisabled}
				readonly={component.isReadOnly}
				aria-invalid={validationError ? 'true' : undefined}
				aria-errormessage={validationError ? `${component.componentId}-error` : undefined}
				required={component.isRequired}
				oninput={handleTextChange}
			/>
		{/if}

		{#if validationError && component.validationMessage}
			<span id="{component.componentId}-error" class="mx-1 mt-1 text-xs text-red-500">
				{component.validationMessage}
			</span>
		{/if}
	</div>
{/if}
