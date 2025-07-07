<script lang="ts">
  import { Code, Plus, X } from '@lucide/svelte';
	import { updateComponentProperties, updateSelectComponent } from '../store/component-store.svelte';

  let { component, onExpressionModal } = $props();

  function handleComponentUpdate(updates: Partial<typeof component>) {
    updateComponentProperties(component.componentId, updates);
  }

  function handleSelectUpdate(updates: any) {
    updateSelectComponent(component.componentId, updates);
  }

  const generateKey = (value: string): string => {
    return value.replace(/[^a-zA-Z]/g, '').toLowerCase();
  };

  const ensureUniqueKey = (baseKey: string, existingItems: any[]) => {
    let key = baseKey;
    let counter = 1;
    while (existingItems.some(item => item.key === key)) {
      key = `${baseKey}${counter}`;
      counter++;
    }
    return key;
  };

  function handleAddItem() {
    if (!component.selectComponent) return;
    const newKey = ensureUniqueKey('item', component.selectComponent.values);
    handleSelectUpdate({
      values: [...component.selectComponent.values, { key: newKey, value: '' }]
    });
  }

  function handleUpdateItem(index: number, newValue: string) {
    if (!component.selectComponent) return;
    const filtered = component.selectComponent.values.filter((_, i) => i !== index);
    const newKey = ensureUniqueKey(generateKey(newValue), filtered);
    const newValues = [...component.selectComponent.values];
    newValues[index] = { key: newKey, value: newValue };
    handleSelectUpdate({ values: newValues });
  }

  function handleRemoveItem(index: number) {
    const newValues = component.selectComponent.values.filter((_, i) => i !== index);
    handleSelectUpdate({ values: newValues });
  }
</script>

{#if component?.selectComponent}
  <div class="space-y-4 p-4">
    <!-- Label -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Label</label>
      <input
        type="text"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.label}
        on:input={(e) => handleComponentUpdate({ label: e.target.value })}
      />
    </div>

    <!-- Default Value -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Default Value</label>
      <input
        type="text"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.defaultValue}
        on:input={(e) => handleComponentUpdate({ defaultValue: e.target.value })}
      />
    </div>

    <!-- Select Type -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Select Type</label>
      <select
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.selectComponent.type}
        on:change={(e) =>
          handleSelectUpdate({
            type: e.target.value,
            values:
              e.target.value === 'Yes or No'
                ? [
                    { key: 'yes', value: 'Yes' },
                    { key: 'no', value: 'No' }
                  ]
                : []
          })
        }
      >
        <option value="Yes or No">Yes or No</option>
        <option value="Reference Asset">Reference Asset</option>
        <option value="Custom">Custom</option>
      </select>
    </div>

    <!-- Reference Worksheet (you can plug your own API here) -->
    {#if component.selectComponent.type === 'Reference Asset'}
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Select Reference Worksheet</label>
        <select
          class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          on:change={(e) => handleSelectUpdate({ referenceWorksheetId: e.target.value })}
        >
          <option disabled selected>Select one (mock)</option>
          <option value="dummy-id">Worksheet A</option>
          <option value="another-id">Worksheet B</option>
        </select>
      </div>
    {/if}

    <!-- Custom Values -->
    {#if component.selectComponent.type === 'Custom'}
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium text-gray-700">Values</label>
          <button
            class="flex items-center gap-1 text-sm bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            on:click={handleAddItem}
          >
            <Plus size={16} /> Add Value
          </button>
        </div>
        <div class="space-y-2 mt-2">
          {#each component.selectComponent.values as item, index}
            <div class="flex items-center space-x-2 p-2 bg-gray-50 rounded-md group">
              <input
                type="text"
                class="flex-1 p-2 border rounded-md text-sm bg-white"
                value={item.value}
                on:input={(e) => handleUpdateItem(index, e.target.value)}
                placeholder="Enter value"
              />
              <button
                on:click={() => handleRemoveItem(index)}
                class="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Checkboxes -->
    <div class="flex justify-between">
      <div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={component.isRequired} on:change={(e) => handleComponentUpdate({ isRequired: e.target.checked })} />
          <label class="text-sm text-gray-700">Required</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={component.isReadOnly} on:change={(e) => handleComponentUpdate({ isReadOnly: e.target.checked })} />
          <label class="text-sm text-gray-700">Read Only</label>
        </div>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={component.isDisabled} on:change={(e) => handleComponentUpdate({ isDisabled: e.target.checked })} />
          <label class="text-sm text-gray-700">Disabled</label>
        </div>
        <div class="flex items-center space-x-2">
          <input type="checkbox" checked={component.showInCertificate} on:change={(e) => handleComponentUpdate({ showInCertificate: e.target.checked })} />
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
        bind:value={component.order}
        on:input={(e) => handleComponentUpdate({ order: parseInt(e.target.value) })}
      />
    </div>

    <!-- Expression Toggles -->
    {#each [
      {
        key: 'isComponentDisabledOnExpression',
        label: 'Disable on Expression',
        expr: 'disableExpression',
        extra: { disableExpression: '' }
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
              checked={component[item.key]}
              on:change={(e) =>
                handleComponentUpdate({
                  [item.key]: e.target.checked,
                  ...(item.key === 'isComponentDisabledOnExpression' && e.target.checked ? { disableExpression: component.disableExpression ?? '' } : {})
                })
              }
            />
            <label class="text-sm text-gray-700">{item.label}</label>
          </div>
          <button
            class="p-1 rounded bg-blue-500 text-white disabled:opacity-50"
            disabled={!component[item.key]}
            on:click={() => onExpressionModal(item.expr)}
          >
            <Code size={16} />
          </button>
        </div>
      </div>
    {/each}
  </div>
{/if}
