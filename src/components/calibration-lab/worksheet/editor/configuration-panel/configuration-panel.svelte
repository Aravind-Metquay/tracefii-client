<script lang="ts">
    import { Trash2 } from '@lucide/svelte';
	import FunctionConfiguration from './function-configuration.svelte';
	import ColumnConfiguration from './column-configuration.svelte';
	import TableConfiguration from './table-configuration.svelte';
	import InputConfiguration from './input-configuration.svelte';
	import SelectConfiguration from './select-configuration.svelte';
	import TextConfiguration from './text-configuration.svelte';

  let { currentComponent, currentFunction, currentColumn, currentActiveFunction, currentActiveComponent, currentActiveColumn, components, functions } = $props();

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
    if (currentComponent) {
      return {
        title: currentComponent.componentType === 'Table' ? currentComponent.tableComponent?.tableName : currentComponent.label,
        subtitle: currentComponent.componentId || 'No Component ID'
      };
    }
    if (currentFunction) {
      return {
        title: currentFunction.functionName || 'Function Configuration',
        subtitle: currentFunction.functionId || 'No Function ID'
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
    {#if currentComponent}
      <button
        class="p-2 text-red-500 hover:text-red-700"
        on:click={() => handleRemoveComponent(currentComponent.componentId)}
      >
        <Trash2 size={16} />
      </button>
    {/if}
  </div>

  <!-- <ExpressionModal
    type={type}
    componentId={currentComponent?.componentId}
    isOpen={isOpen}
    onClose={() => (isOpen = false)}
    onOpenChange={(v) => (isOpen = v)}
  />  -->

  <div class="flex-1 overflow-y-auto">
    {#if currentFunction && !currentComponent}
      <FunctionConfiguration function={currentFunction} onExpressionModal={handleExpressionModal} />
    {:else if currentComponent}
      {#if currentComponent.componentType === 'Table' && currentColumn && currentActiveColumn}
        <ColumnConfiguration
          currentColumn={currentColumn}
          currentComponent={currentComponent}
          onExpressionModal={handleExpressionModal}
        />
      {:else if currentComponent.componentType === 'Table'}
        <TableConfiguration component={currentComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentComponent.componentType === 'Input'}
        <InputConfiguration component={currentComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentComponent.componentType === 'Select'}
        <SelectConfiguration component={currentComponent} onExpressionModal={handleExpressionModal} />
      {:else if currentComponent.componentType === 'Text'}
        <TextConfiguration component={currentComponent} />
      {/if}
    {/if}
  </div>
</div>
