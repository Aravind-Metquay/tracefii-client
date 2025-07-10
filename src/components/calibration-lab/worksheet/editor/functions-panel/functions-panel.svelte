<script lang="ts">
	import { getContext } from "svelte";
	import Function from "./function.svelte";
  
  const worksheet = getContext("worksheet");
</script>

<div>
  <div class="flex justify-between items-center p-2 border-b h-[60px]">
    <p class="text-xl">Functions</p>
    <button
      onclick={() =>worksheet.addNewFunction()}
      class="px-3 py-1 text-sm bg-secondary text-black rounded"
    >
      Add
    </button>
  </div>

  {#each worksheet.getAllFunctions() as fn (fn.functionId)}
    <Function fn={fn} />
  {/each}
</div>