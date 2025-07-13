<script lang="ts">
	import { getContext } from "svelte";
	import Function from "./function.svelte";
	import type { WorksheetManager } from "../store.svelte";
	import { Button } from "@/components/ui/button";
  
  const worksheetManager = getContext<WorksheetManager>("worksheetManager");
</script>

<div>
  <div class="flex justify-between items-center p-2 border-b h-[60px]">
    <p class="text-xl">Functions</p>
    <Button
      onclick={() =>worksheetManager.addNewFunction()}
    >
      <!-- class="px-3 py-1 text-sm bg-secondary text-black rounded"  -->
      Add
    </Button>
  </div>

  {#each worksheetManager.getAllFunctions() as fn (fn.functionId)}
    <Function fn={fn} worksheetManager={worksheetManager} />
  {/each}
</div>