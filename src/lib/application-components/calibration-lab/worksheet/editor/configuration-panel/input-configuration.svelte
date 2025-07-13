<script lang="ts">
    import { Code } from '@lucide/svelte';
	import { updateComponentProperties, updateInputComponent } from '../store/component-store.svelte';

	let {component , onExpressionModal} = $props();

    function handleComponentUpdate(updates: Partial<typeof component>) {
        updateComponentProperties(component.componentId, updates);
    }

    function handleInputUpdate(updates: any) {
        updateInputComponent(component.componentId, updates);
    }
</script>

{#if component?.inputComponent}
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

    <!-- Input Type -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Input Type</label>
      <select
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.inputComponent.type}
        on:change={(e) => handleInputUpdate({ type: e.target.value })}
      >
        <option value="Text">Text</option>
        <option value="Number">Number</option>
      </select>
    </div>

    {#if component.inputComponent.type === 'Number'}
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Rounding Digits</label>
        <input
          type="number"
          class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={component.inputComponent.roundingDigits}
          on:input={(e) => handleInputUpdate({ roundingDigits: parseInt(e.target.value) })}
        />
      </div>
    {/if}

    <!-- Checkboxes Grid -->
    <div class="flex justify-between">
      <div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={component.isRequired}
            on:change={(e) => handleComponentUpdate({ isRequired: e.target.checked })}
          />
          <label class="text-sm text-gray-700">Required</label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={component.isReadOnly}
            on:change={(e) => handleComponentUpdate({ isReadOnly: e.target.checked })}
          />
          <label class="text-sm text-gray-700">Read Only</label>
        </div>
      </div>
      <div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={component.isDisabled}
            on:change={(e) => handleComponentUpdate({ isDisabled: e.target.checked })}
          />
          <label class="text-sm text-gray-700">Disabled</label>
        </div>
        <div class="flex items-center space-x-2">
          <input
            type="checkbox"
            class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            checked={component.showInCertificate}
            on:change={(e) => handleComponentUpdate({ showInCertificate: e.target.checked })}
          />
          <label class="text-sm text-gray-700">Show in Certificate</label>
        </div>
      </div>
    </div>

    <!-- Order -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Order</label>
      <input
        type="number"
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.order}
        on:input={(e) => handleComponentUpdate({ order: parseInt(e.target.value) })}
      />
    </div>

    <!-- Expression Fields -->
    <div class="space-y-4">
      {#each [
        {
          key: 'isComponentDisabledOnExpression',
          label: 'Disable on Expression',
          expression: 'disableExpression'
        },
        {
          key: 'isValidationEnabled',
          label: 'Apply Validation',
          expression: 'validationExpression'
        },
        {
          key: 'isExpressionEnabled',
          label: 'Apply Expression on Value',
          expression: 'valueExpression'
        },
        {
          key: 'certificateVisibilityBasedonExpression',
          label: 'Certificate Visibility Expression',
          expression: 'certificateVisibleExpression'
        }
      ] as item}
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={component[item.key]}
                on:change={(e) =>
                  handleComponentUpdate({
                    [item.key]: e.target.checked,
                    ...(item.key === 'isComponentDisabledOnExpression' &&
                      e.target.checked && {
                        disableExpression: component.disableExpression ?? ''
                      })
                  })
                }
              />
              <label class="text-sm text-gray-700">{item.label}</label>
            </div>
            <button
              class="p-1 rounded-md bg-blue-500 text-white disabled:opacity-50"
              disabled={!component[item.key]}
              on:click={() => onExpressionModal(item.expression)}
            >
              <Code size={16} />
            </button>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
