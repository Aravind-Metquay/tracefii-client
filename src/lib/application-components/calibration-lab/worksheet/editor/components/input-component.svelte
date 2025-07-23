<script lang="ts">
	import type { Component } from '@/Types';
	import { currentActiveStore, setCurrentActiveComponent } from '../store/currentActiveElements-store.svelte';
	import { dataStore, setComponentValue } from '../store/data-store.svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

    const { component } = $props<{ component: Component }>();
    const worksheetManager = getContext<WorksheetManager>("worksheetManager");


  // Access the current function ID directly from the store
  const currentActiveFunctionId = worksheetManager.getCurrentActiveFunction()?.functionId;

  // Access the current value from the data store reactively
  let currentValue = $state('');
  if (currentActiveFunctionId && dataStore[currentActiveFunctionId]) {
    currentValue = dataStore[currentActiveFunctionId][component.componentId] ?? '';
  } else {
    currentValue = '';
  }

  const isNumberType = $derived(component.inputComponent?.type === "Number");
  const isDisabled = $derived(component.isDisabled || component.isReadOnly);
  const validationError = component.isValidationEnabled && component.validationExpression;

  function handleNumberChange(e: Event) {
    const value = (e.target as HTMLInputElement).value.trim();

    if (!value || value === '-') {
      currentActiveFunctionId && setComponentValue(currentActiveFunctionId, component.componentId, 0);
      return;
    }

    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      currentActiveFunctionId && setComponentValue(currentActiveFunctionId, component.componentId, numValue);
    }
  }

  function handleTextChange(e: Event) {
    const newValue = (e.target as HTMLInputElement).value;
    currentActiveFunctionId && setComponentValue(currentActiveFunctionId, component.componentId, newValue);
  }
</script>

{#if currentActiveFunctionId && component.componentType === "Input" && component.inputComponent}
  <div class="flex flex-col w-56 cursor-pointer" on:click={() => setCurrentActiveComponent(component)}>
    <label class="text-xs mx-1" for={component.componentId}>
      {component.label || 'Input'}
      {#if component.isRequired}
        <span class="text-red-500 ml-1">*</span>
      {/if}
      {#if component.isReadOnly}
        <span class="text-gray-500 text-xs ml-1">(Read-only)</span>
      {/if}
    </label>

    {#if isNumberType}
      <input
        class="border border-black p-1 rounded-md outline-none mx-1 text-sm {isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''} {validationError ? 'border-red-500' : ''}"
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
        on:input={handleNumberChange}
      />
    {:else}
      <input
        class="border border-black p-1 rounded-md outline-none mx-1 text-sm {isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''} {validationError ? 'border-red-500' : ''}"
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
        on:input={handleTextChange}
      />
    {/if}

    {#if validationError && component.validationMessage}
      <span id="{component.componentId}-error" class="text-red-500 text-xs mx-1 mt-1">
        {component.validationMessage}
      </span>
    {/if}
  </div>
{/if}
