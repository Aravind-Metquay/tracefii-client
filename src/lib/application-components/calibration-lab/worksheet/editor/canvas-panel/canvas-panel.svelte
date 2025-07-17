<script lang="ts">
	import type { Component } from "@/Types";
	import InputComponent from "../components/input-component.svelte";
	import TableComponent from "../components/table-component.svelte";
	import TextComponent from "../components/text-component.svelte";
	import SelectComponent from "../components/select-component.svelte";
	import GraphComponent from "../components/graph-component.svelte";
	import type { WorksheetManager } from "../store.svelte";
	import { getContext } from "svelte";

  const worksheetManager = getContext<WorksheetManager>("worksheetManager");

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
  {#each  worksheetManager.getComponentsOfCurrentFunction() as component (component.componentId)}
 
    {#if getRendererComponent(component) !== null}
      <svelte:component
        this={getRendererComponent(component)}
        {component}
      />
    {/if}
  {/each}
</div>
