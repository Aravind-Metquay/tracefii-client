<script lang="ts">
  import { updateFunction } from '../store/function-store.svelte';

  let { function: functionData } = $props();

	function handleFunctionUpdate(updates: Partial<typeof functionData>) {
		// worksheetManager.updateFunction(functionData.functionId, updates);
	}
</script>

<div class="space-y-4 p-4">
  <!-- Function Name -->
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">Function Name</label>
    <input
      type="text"
      class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      bind:value={functionData.functionName}
      oninput={(e) => handleFunctionUpdate({ functionName: e.currentTarget.value })}
      placeholder="Enter function name"
    />
  </div>

  <!-- Order -->
  <div class="space-y-2">
    <label class="block text-sm font-medium text-gray-700">Order</label>
    <input
      type="number"
      class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      bind:value={functionData.order}
      oninput={(e) => handleFunctionUpdate({ order: parseInt(e.currentTarget.value) })}
      min={0}
    />
  </div>
</div>
