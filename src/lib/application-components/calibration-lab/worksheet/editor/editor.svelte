<script lang="ts">
  import ConfigurationPanel from "./configuration-panel/configuration-panel.svelte";
  import FunctionsPanel from "./functions-panel/functions-panel.svelte";
	import CanvasPanel from "./canvas-panel/canvas-panel.svelte";
	import TopPanel from "./top-panel/top-panel.svelte";
</script>


<div class="flex flex-col h-screen">
  <header class='bg-white border'>
    <TopPanel />
  </header>

  <div class="flex flex-1 gap-4 p-4 bg-gray-50 overflow-hidden">
    <aside class="w-72 bg-white border rounded-md h-full">
      <FunctionsPanel />
    </aside>

    <main class="flex-1 bg-white border rounded-md p-4 h-full">
      <CanvasPanel />
    </main>

    <aside class="w-72 bg-white border rounded-md h-full">
      <ConfigurationPanel/>
    </aside>
  </div>
</div>