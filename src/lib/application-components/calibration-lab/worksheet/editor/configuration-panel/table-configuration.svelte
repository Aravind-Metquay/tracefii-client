<script lang="ts">
  import { Code } from '@lucide/svelte';
	import { updateComponentProperties, updateTableComponent } from '../store/component-store.svelte';
	import { setCurrentActiveColumn } from '../store/currentActiveElements-store.svelte';

  let { component, onExpressionModal } = $props();

  function handleComponentUpdate(updates: Partial<typeof component>) {
    updateComponentProperties(component.componentId, updates);
  }

  function handleTableUpdate(updates: any) {
    updateTableComponent(component.componentId, updates);
  }

  function handleColumnSelect(column: any) {
    setCurrentActiveColumn(column);
  }
</script>

{#if component?.tableComponent}
  <div class="space-y-4 p-4">
    <!-- Table Name -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Table Name</label>
      <input
        type="text"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.tableComponent.tableName}
        on:input={(e) => handleTableUpdate({ tableName: e.target.value })}
      />
    </div>

    <!-- Show in Certificate -->
    <div class="flex items-center space-x-2">
      <input
        type="checkbox"
        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        checked={component.showInCertificate}
        on:change={(e) => handleComponentUpdate({ showInCertificate: e.target.checked })}
      />
      <label class="text-sm text-gray-700">Show in Certificate</label>
    </div>

    <!-- Order -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Order</label>
      <input
        type="number"
        class="w-full p-2 border rounded-md text-sm"
        bind:value={component.order}
        on:input={(e) => handleComponentUpdate({ order: parseInt(e.target.value) })}
      />
    </div>

    <!-- Table Row Expression -->
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={component.tableComponent.isTableRowExpressionEnabled}
            on:change={(e) =>
              handleTableUpdate({
                isTableRowExpressionEnabled: e.target.checked,
                tableRowExpression: e.target.checked
                  ? component.tableComponent.tableRowExpression ?? ''
                  : ''
              })
            }
          />
          <label class="text-sm text-gray-700">Apply Table Row Expression</label>
        </div>
        <button
          class="p-1 rounded bg-blue-500 text-white disabled:opacity-50"
          disabled={!component.tableComponent.isTableRowExpressionEnabled}
          on:click={() => onExpressionModal('tableRowExpression')}
        >
          <Code size={16} />
        </button>
      </div>
    </div>

    <!-- Columns List -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Columns</label>
      <div class="space-y-2">
        {#each component.tableComponent.columns as column (column.columnId)}
          <div
            class="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
            on:click={() => handleColumnSelect(column)}
          >
            <span class="text-sm">{column.columnName}</span>
            <span class="text-xs text-gray-500">#{column.order}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
