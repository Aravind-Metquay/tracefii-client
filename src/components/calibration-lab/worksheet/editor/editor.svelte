<script lang="ts">
  import ConfigurationPanel from "./configuration-panel/configuration-panel.svelte";
  import FunctionsPanel from "./functions-panel/functions-panel.svelte";
	import CanvasPanel from "./canvas-panel/canvas-panel.svelte";
	import TopPanel from "./top-panel/top-panel.svelte";
</script>

<div class="flex flex-col h-full">
  <!-- HEADER -->
  <header>
    <!-- <TopPanel /> -->
  </header>

  <!-- MAIN PANES -->
  <div class="flex flex-1 gap-4 p-4 bg-gray-50">
    <!-- Functions sidebar -->
    <aside class="w-72 bg-white border rounded-md overflow-auto">
      <FunctionsPanel />
    </aside>

    <!-- Worksheet canvas -->
    <main class="flex-1 bg-white border rounded-md p-4 overflow-auto">
      <CanvasPanel />
    </main>

    <!-- Configuration sidebar -->
    <aside class="w-72 bg-white border rounded-md overflow-auto">
      <ConfigurationPanel />
    </aside>
  </div>
</div>


