<script lang="ts">
  import type { Component as ComponentType, WorksheetManager } from "@/Types";
  import { getContext } from "svelte";
  import type { Component } from "svelte";

  // Import all possible components
  import InputComponent from "../components/input-component.svelte";
  import TableComponent from "../components/table-component.svelte";
  import TextComponent from "../components/text-component.svelte";
  import SelectComponent from "../components/select-component.svelte";
  import GraphComponent from "../components/graph-component.svelte";

  const worksheetManager = getContext<WorksheetManager>("worksheetManager");

  interface DynamicComponentProps {
    component: ComponentType;
  }

  const componentMap: Record<string, Component<DynamicComponentProps>> = {
    Input: InputComponent,
    Table: TableComponent,
    Text: TextComponent,
    Select: SelectComponent,
    Graph: GraphComponent,
  };
</script>

<div class="grid grid-cols-3 gap-6 p-4">
  {#each worksheetManager.getComponentsOfCurrentFunction() as component (component.componentId)}
    {@const Renderer = componentMap[component.componentType]}

    {#if Renderer}
      <Renderer {component} />
    {/if}
  {/each}
</div>