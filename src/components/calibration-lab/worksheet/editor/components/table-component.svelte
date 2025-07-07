<script lang="ts">
	import type { Component } from "@/Types";
	import { currentActiveStore } from "../store/currentActiveElements-store.svelte";
	import { dataStore } from "../store/data-store.svelte";


    export let component: Component;

    let isOpen = false;
    let tableData = [];

    // Get active function and data
    var currentActiveFunctionId = currentActiveStore.function?.functionId;
    var data = dataStore;

    
    if (data[component.functionId] && data[component.functionId][component.componentId]) {
        tableData = data[component.functionId][component.componentId];
    } else {
        tableData = [];
    }
    

    if (component.componentType !== "Table") {
        // Do not render
    }

    function onOpen() { isOpen = true; }
    function onClose() { isOpen = false; }
    function onOpenChange(val) { isOpen = val; }

    function handleAddRow() {
        if (component.tableComponent?.columns) {
        addTableRow(currentActiveFunctionId, component.componentId, component.tableComponent.columns);
        }
    }

    function isGeneratedRepeatColumn(columnId: string) {
        return columnId.includes('_repeat_');
    }
    function getBaseColumnForRepeat(columnId: string) {
        const baseId = columnId.split('_repeat_')[0];
        return component.tableComponent?.columns.find(col => col.columnId === baseId);
    }
    function getEffectiveColumnProps(column: TableColumn) {
        if (isGeneratedRepeatColumn(column.columnId)) {
        const baseColumn = getBaseColumnForRepeat(column.columnId);
        if (baseColumn) {
            return {
            ...column,
            isRequired: baseColumn.isRequired,
            validationExpression: baseColumn.validationExpression,
            validationMessage: baseColumn.validationMessage,
            isDisabled: baseColumn.isDisabled,
            isReadOnly: baseColumn.isReadOnly,
            certificateVisibilityExpression: baseColumn.certificateVisibilityExpression,
            showInCertificate: baseColumn.showInCertificate,
            };
        }
        }
        return column;
    }

    // Filter columns to show
    var visibleColumns = component.tableComponent.columns.filter(column => {
        if (isGeneratedRepeatColumn(column.columnId)) return true;
        if (column.isRepeatColumn) {
        const hasGeneratedColumns = component.tableComponent?.columns.some(col =>
            col.columnId.startsWith(`${column.columnId}_repeat_`)
        );
        return !hasGeneratedColumns;
        }
        return true;
    });
</script>

{#if component.componentType === "Table" && component.tableComponent}
<div 
  class="col-span-3 flex flex-col border rounded-md p-2"
  on:click={() => {
    setCurrentActiveComponent(component);
    setCurrentActiveColumn(null);
  }}
>
  <div class="flex items-center justify-between mb-4">
    <div class="max-w-xs">
      <input
        type="text"
        value={component.tableComponent.tableName}
        on:input={(e) => updateTableComponent(component.componentId, { tableName: (e.target as HTMLInputElement).value })}
        class="text-sm font-medium px-2 py-1 rounded hover:bg-gray-50 border-transparent focus:border-gray-200 focus:ring-0 border"
      />
    </div>
    <div class="flex gap-2">
      <button
        class="px-2 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition"
        on:click={handleAddRow}
        disabled={component.tableComponent.isTableRowExpressionEnabled}
        type="button"
      >
        Add Row
      </button>
      <button
        class="px-2 py-1 rounded text-white bg-purple-600 hover:bg-purple-700 transition"
        on:click={() => { onOpen(); setCurrentActiveComponent(component); }}
        type="button"
      >
        Add Column
      </button>
    </div>
  </div>
  <div class="overflow-x-auto">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          {#each visibleColumns as column (column.columnId)}
            <th
              class="border border-gray-200 px-4 py-2 bg-gray-50 font-medium text-sm cursor-pointer hover:bg-gray-100"
              on:click|stopPropagation={() => {
                setCurrentActiveColumn(column);
                setCurrentActiveComponent(component);
              }}
            >
              <div class="flex items-center gap-2">
                <span>{getEffectiveColumnProps(column).columnName}</span>
                {#if getEffectiveColumnProps(column).isRequired}
                  <span class="text-red-600">*</span>
                {/if}
                {#if getEffectiveColumnProps(column).isRepeatColumn}
                  <div class="flex items-center gap-1" title="Repeat Column">
                    <Repeat class="w-4 h-4 text-blue-500" />
                    {#if !getEffectiveColumnProps(column).repeatExpression}
                      <AlertCircle class="w-4 h-4 text-amber-500" />
                    {/if}
                  </div>
                {/if}
                {#if isGeneratedRepeatColumn(getEffectiveColumnProps(column).columnId)}
                  <Repeat class="w-4 h-4 text-gray-400" />
                {/if}
              </div>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each tableData as row, rowIndex (row.key ?? rowIndex)}
          <tr>
            {#each visibleColumns as column (column.columnId)}
              <td class="border border-gray-200 px-4 py-2">
                <svelte:component
                  this={getEffectiveColumnProps(column).columnType === "Input" ? TableInputCell : TableSelectCell}
                  column={getEffectiveColumnProps(column)}
                  value={row[column.columnId]}
                  onChange={(val) => updateTableCell(
                    component.functionId,
                    component.componentId,
                    row.key,
                    column.columnId,
                    val
                  )}
                />
              </td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  {#if isOpen}
    <div class="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 min-w-[300px] shadow">
        <div class="text-lg font-medium mb-4">Add Column</div>
        <div>(AddColumnModal content goes here...)</div>
        <div class="flex justify-end mt-4">
          <button class="px-3 py-1 rounded bg-blue-600 text-white" on:click={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>
{/if}
