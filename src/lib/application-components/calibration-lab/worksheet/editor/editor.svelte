<script lang="ts">
  import ConfigurationPanel from "./configuration-panel/configuration-panel.svelte";
  import FunctionsPanel from "./functions-panel/functions-panel.svelte";
	import CanvasPanel from "./canvas-panel/canvas-panel.svelte";
	import TopPanel from "./top-panel/top-panel.svelte";
	import { getContext } from "svelte";
	import type { WorksheetManager } from "./store.svelte";
  
</script>


<div class="flex flex-col h-full">
  <header class='bg-white border'>
    <TopPanel />
  </header>

  <div class="flex flex-1 gap-4 p-4 bg-gray-50">
    <aside class="w-72 bg-white border rounded-md overflow-auto">
      <FunctionsPanel />
    </aside>

    <main class="flex-1 bg-white border rounded-md p-4 overflow-auto">
      <CanvasPanel />
    </main>

    <aside class="w-72 bg-white border rounded-md overflow-auto">
      <ConfigurationPanel/>
    </aside>
  </div>
</div>


