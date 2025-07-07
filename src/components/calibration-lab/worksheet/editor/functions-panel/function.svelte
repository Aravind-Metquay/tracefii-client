<script lang="ts">
  import { Repeat , Trash , GripVertical} from '@lucide/svelte';

	import type { Function } from '@/Types';
	import { currentActiveStore, setCurrentActiveColumn, setCurrentActiveComponent, setCurrentActiveFunction } from '../store/currentActiveElements-store.svelte';
	import { removeFunction, updateFunctionName } from '../store/function-store.svelte';

  // Destructure props
  let { fn } : {fn : Function} = $props();

  // Local reactive state
  let isEditing = $state(false);

  // Derive activeFunction from store
  let activeFunction = $derived(currentActiveStore.function);
</script>

<div
  class="border-b p-2 flex justify-between items-center hover:cursor-pointer"
  class:bg-primary-100={activeFunction?.functionId === fn.functionId}
  onclick={() => {
    setCurrentActiveFunction(fn);
    setCurrentActiveComponent(null);
    setCurrentActiveColumn(null);
  }}
>
  <GripVertical size="16" class="hover:cursor-move" />

  {#if isEditing}
    <input
      bind:value={fn.functionName}
      oninput={(e) => updateFunctionName(e.target.value, fn.functionId)}
      onkeydown={({ key }) => key === 'Enter' && (isEditing = false)}
      onblur={() => (isEditing = false)}
      class="text-sm flex-1 mx-4 outline-none"
      autofocus
    />
  {:else}
    <span
      ondblclick={() => (isEditing = true)}
      class="text-sm flex-1 mx-4"
    >
      {fn.functionName}
    </span>
  {/if}

  {#if fn.isRepeat}
    <Repeat size="12" class="mr-2" />
  {/if}

  <a
    onclick={() => removeFunction(fn.functionId)}
  >
    <Trash
      size="16"
      class="text-gray-400 hover:text-red-400 hover:cursor-pointer"
    />
  </a>
</div>
