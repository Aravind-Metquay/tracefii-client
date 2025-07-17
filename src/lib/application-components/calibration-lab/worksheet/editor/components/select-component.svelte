<script lang="ts">
	import type { Component } from "@/Types";
	import { currentActiveStore, setCurrentActiveComponent } from "../store/currentActiveElements-store.svelte";
	import { dataStore, setComponentValue } from "../store/data-store.svelte";


    export let component: Component;

    // Simulate API data fetching (replace with your own logic)
    // let user = ...; // assign user as per your Svelte store/data system
    let assets : any = []; // assign assets as per your Svelte store/data system

    // Store value logic
    var currentActiveFunctionId = currentActiveStore.function?.functionId;
    var dataSnapshot = dataStore;
    var currentValue = currentActiveFunctionId
        ? (dataSnapshot[currentActiveFunctionId]?.[component.componentId] ?? "")
        : "";

    // Option logic
    var selectItems = component.selectComponent?.values ?? [];
    function getSelectOptions() {
        switch (component.selectComponent?.type) {
        case "Yes or No":
            return [
            { key: "yes", value: "Yes" },
            { key: "no", value: "No" }
            ];
        case "Reference Asset":
            return assets.map((w : any) => ({
            ...w,
            key: w._id,
            value: w.assetName
            })) ?? [];
        case "Custom":
        default:
            return selectItems;
        }
    }
    var options = getSelectOptions();

    var shouldShowPlaceholder =
        !currentValue ||
        (options.length > 0 && !options.find((opt: { value: any; }) => opt.value === currentValue));
    var isDisabled = component.isDisabled || component.isReadOnly;

    function handleChange(e: Event) {
        const value = (e.target as HTMLSelectElement).value;
        if (!component.isReadOnly && !component.isDisabled && currentActiveFunctionId) {
        setComponentValue(currentActiveFunctionId, component.componentId, value);
        }
    }
</script>

{#if currentActiveFunctionId && component.componentType === "Select" && component.selectComponent}
  <div class="flex flex-col w-[13.75rem]" on:click={() => setCurrentActiveComponent(component)}>
    <label
      class="text-xs mx-[0.0625rem]"
      for={component.componentId}
    >
      {component.label || 'Select'}
      {#if component.isRequired}
        <span class="text-red-500 ml-[0.0625rem]">*</span>
      {/if}
      {#if component.isReadOnly}
        <span class="text-gray-500 text-xs ml-[0.0625rem]">(Read-only)</span>
      {/if}
    </label>
    <select
      id={component.componentId}
      class={`bg-transparent border border-black p-[0.25rem] rounded-[0.375rem] mx-[0.0625rem]
        ${isDisabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        ${!currentValue ? 'text-gray-500' : ''}
      `}
      value={currentValue}
      on:change={handleChange}
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
        <option
          value={item.value}
          class="bg-white hover:bg-gray-100"
        >
          {item.value}
        </option>
      {/each}
    </select>
  </div>
{/if}

