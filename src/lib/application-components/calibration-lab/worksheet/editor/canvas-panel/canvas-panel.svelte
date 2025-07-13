<script lang="ts">
	import type { Component } from "@/Types";
	import { currentActiveStore } from "../store/currentActiveElements-store.svelte";
	import { componentStore } from "../store/component-store.svelte";
	import InputComponent from "../components/input-component.svelte";
	import TableComponent from "../components/table-component.svelte";
	import TextComponent from "../components/text-component.svelte";
	import SelectComponent from "../components/select-component.svelte";
	import GraphComponent from "../components/graph-component.svelte";



  let components: Component[] = [];

  var currentActiveFunctionId = currentActiveStore.function?.functionId;
  var componentSnapshot = componentStore;
      components = currentActiveFunctionId
    ? componentSnapshot.filter((c) => c.functionId === currentActiveFunctionId)
    : [];

  // Choose component for dynamic rendering
  function getRendererComponent(component: Component) {
    if (component.componentType === "Input") return InputComponent;
    if (component.componentType === "Table") return TableComponent;
    if (component.componentType === "Text") return TextComponent;
    if (component.componentType === "Select") return SelectComponent;
    if (component.componentType === "Graph") return GraphComponent;
    return null;
  }
</script>

<div class="grid grid-cols-3 gap-6 p-4">
  {#each components as component (component.componentId)}
    {#if getRendererComponent(component) !== null}
      <svelte:component
        this={getRendererComponent(component)}
        {component}
      />
    {/if}
  {/each}
</div>
