<script lang="ts">
	import type { Component } from '@/Types';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '@/Types';

	let { component }: { component: Component } = $props();
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	var currentValue = worksheetManager.getComponentValue(
		component.functionId,
		component.componentId
	);

	var isDisabled = component.isDisabled || component.isReadOnly;

  //svelte action function to set the textarea height
	function autoResize(textarea: HTMLTextAreaElement) {
		function updateSize() {
			textarea.style.height = 'auto';
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
		textarea.addEventListener('input', updateSize);
		updateSize();
		return {
			destroy() {
				textarea.removeEventListener('input', updateSize);
			}
		};
	}

	function handleChange(e: Event) {
		const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
		if (!component.isReadOnly && !component.isDisabled && component.componentId) {
			worksheetManager.setComponentValue(component.componentId, component.componentId, value);
		}
	}
</script>

{#if component.componentId && component.componentType === 'Text' && component.textComponent}
	{#if component.textComponent.type === 'Heading'}
		<div class="col-span-3" onclick={() => worksheetManager.setCurrentActiveComponent(component)}>
			<input
				id={component.componentId}
				type="text"
				value={currentValue}
				oninput={handleChange}
				disabled={component.isDisabled}
				readonly={component.isReadOnly}
				class="mb-4 w-full border-none border-gray-300 bg-transparent text-2xl font-semibold outline-none focus:border-b {isDisabled
					? 'cursor-not-allowed bg-gray-50'
					: ''}"
				aria-label="Heading"
				placeholder={component.textComponent.heading || 'Enter heading'}
			/>
		</div>
	{:else}
		<div
			class="col-span-3 flex flex-col"
			onclick={() => worksheetManager.setCurrentActiveComponent(component)}
		>
			{#if component.label}
				<label class="mx-1 text-xs" for={component.componentId}>
					{component.label}
					{#if component.isRequired}
						<span class="ml-1 text-red-500">*</span>
					{/if}
					{#if component.isReadOnly}
						<span class="ml-1 text-xs text-gray-500">(Read-only)</span>
					{/if}
				</label>
			{/if}
			<textarea
				id={component.componentId}
				oninput={handleChange}
				disabled={component.isDisabled}
				readonly={component.isReadOnly}
				class="mx-1 min-h-20 w-full rounded-md border border-black p-2 outline-none resize-none overflow-y-hidden  {isDisabled
					? 'cursor-not-allowed bg-gray-50'
					: ''} {component.isRequired ? 'border-red-500' : ''}"
				placeholder={component.defaultValue || 'Enter text'}
        use:autoResize
			>
				{currentValue}
			</textarea>
		</div>
	{/if}
{/if}
