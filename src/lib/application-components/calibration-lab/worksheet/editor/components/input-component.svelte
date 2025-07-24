<script lang="ts">
	import type { Component } from '@/Types';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

  const { component } = $props<{ component: Component }>();
  const worksheetManager = getContext<WorksheetManager>("worksheetManager");


  // Access the current function ID directly from the store
  const currentActiveFunctionId = worksheetManager.getCurrentActiveFunction()?.functionId;

  let currentValue = $derived(
		worksheetManager.getComponentValue(component.functionId, component.componentId)
	);
	//What do we need here?
	//1. Get data of a component.
	//2. Write data of a component.
	//3. Changes should be automatically calculated and rendered here.
	//4. Integrate Default value into getComponent Data
	//5. Need to understand if props are already reactive or do they need to be derived to become reactive?


  const isNumberType = $derived(component.inputComponent?.type === "Number");
  const isDisabled = $derived(component.isDisabled || component.isReadOnly);
  const validationError = component.isValidationEnabled && component.validationExpression;

	function handleNumberChange(e: Event) {
		const value = (e.target as HTMLInputElement).value.trim();

		if (!value || value === '-') {
			currentActiveFunctionId &&
				worksheetManager.setComponentValue(component.functionId, component.componentId, 0);
			return;
		}

		const numValue = parseFloat(value);
		if (!isNaN(numValue)) {
			component.functionId &&
				worksheetManager.setComponentValue(component.functionId, component.componentId, numValue);
		}
	}

	function handleTextChange(e: Event) {
		const newValue = (e.target as HTMLInputElement).value;
		component.functionId &&
			worksheetManager.setComponentValue(component.functionId, component.componentId, newValue);
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
