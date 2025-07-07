<script lang="ts">
	import { addNewFunction, functionStore } from "../store/function-store.svelte";
	import Function from "./function.svelte";


</script>

<div>
  <div class="flex justify-between items-center p-2 border-b h-[60px]">
    <p class="text-xl">Functions</p>
    <button
      onclick={addNewFunction}
      class="px-3 py-1 text-sm bg-secondary text-black rounded"
    >
      Add
    </button>
  </div>

  {#each functionStore as fn (fn.functionId)}
    <Function fn={fn} />
  {/each}
</div>