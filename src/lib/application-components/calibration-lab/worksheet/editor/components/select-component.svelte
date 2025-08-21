<script lang="ts">
	import { getContext } from 'svelte';
	import type { Component, WorksheetManager } from '@/Types';

	let { component }: { component: Component } = $props();
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let currentValue = $derived(
		worksheetManager.getComponentValue(component.functionId, component.componentId)
	);

	let options = $derived.by(() => {
		switch (component.selectComponent?.type) {
			case 'Yes or No':
				return [
					{ key: 'yes', value: 'Yes' },
					{ key: 'no', value: 'No' }
				];
			case 'Reference Asset':
				// Your asset-fetching logic would go here
				return [];
			case 'Custom':
			default:
				return component.selectComponent?.values ?? [];
		}
	});

	let shouldShowPlaceholder = $derived(
		!currentValue || (options.length > 0 && !options.find((opt) => opt.value === currentValue))
	);

	let isDisabled = $derived(component.isDisabled || component.isReadOnly);

	function handleChange(e: Event) {
		const value = (e.target as HTMLSelectElement).value;
		if (!component.isReadOnly && !component.isDisabled && component.functionId) {
			worksheetManager.setComponentValue(component.functionId, component.componentId, value);
		}
	}
</script>

{#if component.functionId && component.componentType === 'Select' && component.selectComponent}
	<div
		class="flex w-[13.75rem] flex-col"
		onclick={() => worksheetManager.setCurrentActiveComponent(component)}
	>
		<label class="mx-[0.0625rem] text-xs" for={component.componentId}>
			{component.label || 'Select'}
			{#if component.isRequired}
				<span class="ml-[0.0625rem] text-red-500">*</span>
			{/if}
			{#if component.isReadOnly}
				<span class="ml-[0.0625rem] text-xs text-gray-500">(Read-only)</span>
			{/if}
		</label>
		<select
			id={component.componentId}
			class={`mx-[0.0625rem] rounded-[0.375rem] border border-black bg-transparent p-[0.25rem]
        ${isDisabled ? 'cursor-not-allowed bg-gray-100' : ''}
        ${!currentValue ? 'text-gray-500' : ''}
      `}
			value={currentValue}
			onchange={handleChange}
			required={component.isRequired}
			disabled={isDisabled}
			aria-label={component.label || 'Select input'}
		>
			{#if shouldShowPlaceholder}
				<option value="" disabled>
					{options.length === 0 ? 'No options available' : 'Select an option'}
				</option>
			{/if}
			{#each options as item (item.key)}
				<option value={item.value} class="bg-white hover:bg-gray-100">
					{item.value}
				</option>
			{/each}
		</select>
	</div>
{/if}
