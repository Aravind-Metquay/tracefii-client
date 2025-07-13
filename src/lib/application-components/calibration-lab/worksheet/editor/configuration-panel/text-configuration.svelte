<script lang="ts">
	import { updateComponentProperties, updateTextComponent } from "../store/component-store.svelte";


  let { component } = $props();

  function handleComponentUpdate(updates: Partial<typeof component>) {
    updateComponentProperties(component.componentId, updates);
  }

  function handleTextUpdate(updates: any) {
    updateTextComponent(component.componentId, updates);
  }
</script>

{#if component?.textComponent}
  <div class="space-y-4 p-4">
    <!-- Text Type -->
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700">Text Type</label>
      <select
        class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        bind:value={component.textComponent.type}
        on:change={(e) => handleTextUpdate({ type: e.target.value })}
      >
        <option value="Heading">Heading</option>
        <option value="Paragraph">Paragraph</option>
      </select>
    </div>

    <!-- Heading Text -->
    {#if component.textComponent.type === 'Heading'}
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Heading Text</label>
        <input
          type="text"
          class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={component.textComponent.heading}
          on:input={(e) => handleTextUpdate({ heading: e.target.value })}
          placeholder="Enter heading text"
        />
      </div>
    {/if}

    <!-- Label (for Paragraph) -->
    {#if component.textComponent.type === 'Paragraph'}
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Label</label>
        <input
          type="text"
          class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          bind:value={component.label}
          on:input={(e) => handleComponentUpdate({ label: e.target.value })}
          placeholder="Enter paragraph label"
        />
      </div>
    {/if}

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
  </div>
{/if}
