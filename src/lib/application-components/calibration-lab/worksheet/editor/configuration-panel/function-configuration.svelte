<script lang="ts">
  import { Code } from '@lucide/svelte';
  import { updateFunction } from '../store/function-store.svelte';

  let { function: functionData, onExpressionModal } = $props();

  function handleFunctionUpdate(updates: Partial<typeof functionData>) {
    updateFunction(functionData.functionId, updates);
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
      on:input={(e) => handleFunctionUpdate({ functionName: e.target.value })}
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
      on:input={(e) => handleFunctionUpdate({ order: parseInt(e.target.value) })}
      min={0}
    />
  </div>

  <!-- Repeat Expression -->
  <div class="space-y-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <input
          type="checkbox"
          class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          checked={functionData.isRepeat}
          on:change={(e) => handleFunctionUpdate({ isRepeat: e.target.checked })}
        />
        <label class="text-sm text-gray-700">Is Repeat Function?</label>
      </div>
      <button
        class="p-1 rounded bg-blue-500 text-white disabled:opacity-50"
        disabled={!functionData.isRepeat}
        on:click={() => onExpressionModal('repeatExpression')}
      >
        <Code size={16} />
      </button>
    </div>
  </div>
</div>
