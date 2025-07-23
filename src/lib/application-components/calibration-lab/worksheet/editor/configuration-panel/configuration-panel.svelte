<script lang="ts">
  import { Trash2 } from '@lucide/svelte';
	import FunctionConfiguration from './function-configuration.svelte';
	import ColumnConfiguration from './column-configuration.svelte';
	import TableConfiguration from './table-configuration.svelte';
	import InputConfiguration from './input-configuration.svelte';
	import SelectConfiguration from './select-configuration.svelte';
	import TextConfiguration from './text-configuration.svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

  const worksheetManager = getContext<WorksheetManager>("worksheetManager");
  const currentActiveColumn = $derived(worksheetManager.getCurrentActiveColumn());
  const currentActiveFunction = $derived(worksheetManager.getCurrentActiveFunction());
  const currentActiveComponent = $derived(worksheetManager.getCurrentActiveComponent());
  const components = worksheetManager.getAllComponents();
  const functions = worksheetManager.getAllFunctions();
  

  let type = $state<'valueExpression' | 'disableExpression' | 'validationExpression' | 'certificateVisibleExpression' | 'tableRowExpression' | 'repeatExpression'>('valueExpression');
  let isOpen = $state(false);

  function handleRemoveComponent(componentId: string) {
    // Placeholder: inject remove logic via props or context
  }

  function handleExpressionModal(modalType: typeof type) {
    type = modalType;
    isOpen = true;
  }

  function getTitleInfo() {
    if (currentActiveColumn) {
      return {
        title: currentActiveColumn.columnName || 'Column Configuration',
        subtitle: currentActiveColumn.columnId || 'No Column ID'
      };
    }
    if (currentActiveComponent) {
      return {
        title: currentActiveComponent.componentType === 'Table' ? currentActiveComponent.tableComponent?.tableName : currentActiveComponent.label,
        subtitle: currentActiveComponent.componentId || 'No Component ID'
      };
    }
    if (worksheetManager.getCurrentActiveFunction()) {
      return {
        title:  worksheetManager.getCurrentActiveFunction()?.functionName || 'Function Configuration',
        subtitle:  worksheetManager.getCurrentActiveFunction()?.functionId || 'No Function ID'
      };
    }
    return {
      title: 'Select a component or function',
      subtitle: 'No Selection'
    };
  }

  const titleInfo = getTitleInfo();
</script>

<div class="h-full flex flex-col bg-white rounded-md">
  <div class="border-b p-4 flex justify-between items-center">
    <div>
      <h2 class="font-medium text-sm">{titleInfo.title}</h2>
      <p class="text-xs text-gray-500">{titleInfo.subtitle}</p>
    </div>
    {#if currentActiveComponent}
      <button
        class="p-2 text-red-500 hover:text-red-700"
        onclick={() => worksheetManager.removeComponent(currentActiveComponent.componentId)}
      >
        <Trash2 size={16} />
      </button>
    {/if}
  </div>

  <!-- <ExpressionModal
    type={type}
    componentId={currentActiveComponent?.componentId}
    isOpen={isOpen}
    onClose={() => (isOpen = false)}
    onOpenChange={(v) => (isOpen = v)}
  />  -->

  <div class="flex-1 overflow-y-auto">
    {#if currentActiveFunction && !currentActiveComponent}
      <FunctionConfiguration function={currentActiveFunction} onExpressionModal={handleExpressionModal} />
    {:else if currentActiveComponent}
      {#if currentActiveComponent.componentType === 'Table' && currentActiveColumn && currentActiveColumn}
        <ColumnConfiguration
          currentColumn={currentActiveColumn}
          currentComponent={currentActiveComponent}
          onExpressionModal={handleExpressionModal}
        />
      {:else if currentActiveComponent.componentType === 'Table'}
        <TableConfiguration component={currentActiveComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentActiveComponent.componentType === 'Input'}
        <InputConfiguration component={currentActiveComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentActiveComponent.componentType === 'Select'}
        <SelectConfiguration component={currentActiveComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentActiveComponent.componentType === 'Text'}
        <TextConfiguration component={currentActiveComponent} />
      {/if}
    {/if}
  </div>
</div>
