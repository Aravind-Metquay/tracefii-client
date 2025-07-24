<script lang="ts">
	import type { Component } from "@/Types";
	import { currentActiveStore, setCurrentActiveComponent } from "../store/currentActiveElements-store.svelte";
	import { dataStore, setComponentValue } from "../store/data-store.svelte";
	import { getContext } from "svelte";
	import type { WorksheetManager } from "../store.svelte";


  export let component: Component;
  const worksheetManager = getContext<WorksheetManager>("worksheetManager");

  // Svelte reactivity for active function and value
  const currentActiveFunctionId = worksheetManager.getCurrentActiveFunction()?.functionId;
  var dataSnapshot = dataStore;
  var currentValue = currentActiveFunctionId
    ? (dataSnapshot[currentActiveFunctionId]?.[component.componentId] ?? "")
    : "";

  // Helper for disabled state
  var isDisabled = component.isDisabled || component.isReadOnly;

  function handleChange(e: Event) {
    const value = (e.target as HTMLInputElement | HTMLTextAreaElement).value;
    if (!component.isReadOnly && !component.isDisabled && currentActiveFunctionId) {
      setComponentValue(currentActiveFunctionId, component.componentId, value);
    }
  }
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
</script>

{#if currentActiveFunctionId && component.componentType === "Text" && component.textComponent}
  {#if component.textComponent.type === "Heading"}
    <div 
      class="col-span-3"
      on:click={() => setCurrentActiveComponent(component)}
    >
      <input
        id={component.componentId}
        type="text"
        value={currentValue}
        on:input={handleChange}
        disabled={component.isDisabled}
        readonly={component.isReadOnly}
        class="text-2xl font-semibold mb-4 outline-none w-full bg-transparent border-none focus:border-b border-gray-300 {isDisabled ? 'cursor-not-allowed bg-gray-50' : ''}"
        aria-label="Heading"
        placeholder={component.textComponent.heading || 'Enter heading'}
      />
    </div>
  {:else}
    <div
      class="col-span-3 flex flex-col"
      on:click={() => setCurrentActiveComponent(component)}
    >
      {#if component.label}
        <label
          class="text-xs mx-1"
          for={component.componentId}
        >
          {component.label}
          {#if component.isRequired}
            <span class="text-red-500 ml-1">*</span>
          {/if}
          {#if component.isReadOnly}
            <span class="text-gray-500 text-xs ml-1">(Read-only)</span>
          {/if}
        </label>
      {/if}
      <textarea
        id={component.componentId}
        value={currentValue}
        on:input={handleChange}
        disabled={component.isDisabled}
        readonly={component.isReadOnly}
        class="w-full border border-black rounded-md mx-1 outline-none min-h-20 p-2 resize-none overflow-y-hidden {isDisabled ? 'bg-gray-50 cursor-not-allowed' : ''} {component.isRequired ? 'border-red-500' : ''}"
        placeholder={component.defaultValue || 'Enter text'}
        use:autoResize
      />
    </div>
  {/if}
{/if}
