<script lang="ts">
  import { Code } from '@lucide/svelte';
	import { updateColumnProperties } from '../store/component-store.svelte';

  let { currentColumn, currentComponent, onExpressionModal } = $props();

  function handleColumnUpdate(updates: Partial<typeof currentColumn>) {
    updateColumnProperties(currentColumn.tableId, currentColumn.columnId, updates);
  }
</script>

{#if currentColumn}
  <div class="space-y-4 p-4">
    <!-- Column Name -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Column Name</label>
      <input
        type="text"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={currentColumn.columnName}
        on:input={(e) => handleColumnUpdate({ columnName: e.target.value })}
      />
    </div>

    <!-- Default Value -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Default Value</label>
      <input
        type="text"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={currentColumn.defaultValue}
        on:input={(e) => handleColumnUpdate({ defaultValue: e.target.value })}
      />
    </div>

    <!-- Checkboxes Grid -->
    <div class="flex justify-between">
      <div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={currentColumn.isRequired} on:change={(e) => handleColumnUpdate({ isRequired: e.target.checked })} />
          <label class="text-sm text-gray-700">Required</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={currentColumn.isReadOnly} on:change={(e) => handleColumnUpdate({ isReadOnly: e.target.checked })} />
          <label class="text-sm text-gray-700">Read Only</label>
        </div>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={currentColumn.isDisabled} on:change={(e) => handleColumnUpdate({ isDisabled: e.target.checked })} />
          <label class="text-sm text-gray-700">Disabled</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={currentColumn.showInCertificate} on:change={(e) => handleColumnUpdate({ showInCertificate: e.target.checked })} />
          <label class="text-sm text-gray-700">Show in Certificate</label>
        </div>
      </div>
    </div>

    <!-- Order -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Order</label>
      <input
        type="number"
        class="w-full p-2 border rounded-md text-sm"
        bind:value={currentColumn.order}
        on:input={(e) => handleColumnUpdate({ order: parseInt(e.target.value) })}
      />
    </div>

    <!-- Expression Fields -->
    {#each [
      {
        key: 'isRepeatColumn',
        label: 'Is Repeat Column?',
        expr: 'repeatExpression'
      },
      {
        key: 'isComponentDisabledOnExpression',
        label: 'Disable on Expression',
        expr: 'disableExpression'
      },
      {
        key: 'isExpressionEnabled',
        label: 'Apply Expression on Value',
        expr: 'valueExpression'
      },
      {
        key: 'isValidationEnabled',
        label: 'Apply Validation',
        expr: 'validationExpression'
      },
      {
        key: 'certificateVisibilityBasedonExpression',
        label: 'Certificate Visibility Expression',
        expr: 'certificateVisibleExpression'
      }
    ] as item}
      <div class="space-y-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={currentColumn[item.key]}
              on:change={(e) =>
                handleColumnUpdate({ [item.key]: e.target.checked })
              }
            />
            <label class="text-sm text-gray-700">{item.label}</label>
          </div>
          <button
            class="p-1 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={!currentColumn[item.key]}
            on:click={() => onExpressionModal(item.expr)}
          >
            <Code size={16} />
          </button>
        </div>
      </div>
    {/each}

    <!-- Input Component Fields -->
    {#if currentColumn.columnType === 'Input' && currentColumn.inputComponent}
      <div class="space-y-4 border-t pt-4">
        <h3 class="font-medium text-sm text-gray-700">Input Settings</h3>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select
            class="w-full p-2 border rounded-md text-sm"
            bind:value={currentColumn.inputComponent.type}
            on:change={(e) =>
              handleColumnUpdate({
                inputComponent: {
                  type: e.target.value,
                  roundingDigits: e.target.value === 'Number' ? 0 : 0
                }
              })
            }
          >
            <option value="Text">Text</option>
            <option value="Number">Number</option>
          </select>
        </div>

        {#if currentColumn.inputComponent.type === 'Number'}
          <div class="space-y-2">
            <label class="block text-sm font-medium text-gray-700">Rounding Digits</label>
            <input
              type="number"
              class="w-full p-2 border rounded-md text-sm"
              bind:value={currentColumn.inputComponent.roundingDigits}
              on:input={(e) =>
                handleColumnUpdate({
                  inputComponent: {
                    type: currentColumn.inputComponent.type,
                    roundingDigits: e.target.value === '' ? 0 : parseInt(e.target.value)
                  }
                })
              }
            />
          </div>
        {/if}
      </div>
    {/if}

    <!-- Select Component Fields -->
    {#if currentColumn.columnType === 'Select' && currentColumn.selectComponent}
      <div class="space-y-4 border-t pt-4">
        <h3 class="font-medium text-sm text-gray-700">Select Settings</h3>
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select
            class="w-full p-2 border rounded-md text-sm"
            bind:value={currentColumn.selectComponent.type}
            on:change={(e) =>
              handleColumnUpdate({
                selectComponent: {
                  ...currentColumn.selectComponent,
                  type: e.target.value,
                  values:
                    e.target.value === 'Yes or No'
                      ? [
                          { key: 'yes', value: 'Yes' },
                          { key: 'no', value: 'No' }
                        ]
                      : []
                }
              })
            }
          >
            <option value="Yes or No">Yes or No</option>
            <option value="Reference Asset">Reference Asset</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
      </div>
    {/if}
  </div>
{/if}
