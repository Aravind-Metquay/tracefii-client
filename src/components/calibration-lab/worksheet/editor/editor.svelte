<script lang="ts">
  import ConfigurationPanel from "./configuration-panel/configuration-panel.svelte";
  import FunctionsPanel from "./functions-panel/functions-panel.svelte";
	import CanvasPanel from "./canvas-panel/canvas-panel.svelte";
</script>

<div class="flex flex-col h-full">
  <!-- HEADER -->
  <header class="flex items-center justify-between h-16 px-4 border-b bg-white">
    <!-- Left: Exit button -->
    <button class="text-sm font-medium text-gray-600 hover:text-gray-800">
      Exit
    </button>

    <!-- Center: Worksheet title + create -->
    <div class="flex items-center space-x-4">
      <h1 class="text-lg font-semibold">Worksheet Name</h1>
      <button class="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700">
        + Procedure
      </button>
    </div>

    <!-- Right: Controls -->
    <div class="flex items-center space-x-2">
      <button class="p-2 rounded hover:bg-gray-100">Undo</button>
      <button class="p-2 rounded hover:bg-gray-100">Redo</button>
      <button class="p-2 rounded hover:bg-gray-100">Preview</button>
      <button class="p-2 rounded hover:bg-gray-100">Print</button>
      <button class="p-2 rounded hover:bg-gray-100">Share</button>
    </div>
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


