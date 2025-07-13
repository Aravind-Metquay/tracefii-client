<script lang="ts">
  import { Repeat , Trash , GripVertical} from '@lucide/svelte';
  import type { WorksheetManager } from '../store.svelte';
  import type {Function} from 'src/Types'

  let { fn , worksheetManager } : {fn : Function , worksheetManager : WorksheetManager} = $props();

  let isEditing = $state(false);
</script>

<div
  class={`border-b p-2 flex justify-between items-center hover:cursor-pointer 
    ${worksheetManager.getWorksheet().currentActiveElements.function?.functionId === fn.functionId && 'bg-purple-400'} 
  `}
  onclick={() => worksheetManager.setCurrentActiveFunction(fn)}
>
  <GripVertical size="16" class="hover:cursor-move" />

  {#if isEditing}
    <input
      value={fn.functionName}
      oninput={(e) => worksheetManager.updateFunctionName(fn.functionId , String(e.currentTarget.value))}
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
    onclick={() => worksheetManager.removeFunction(fn.functionId)}
  >
    <Trash
      size="16"
      class="text-gray-400 hover:text-red-400 hover:cursor-pointer"
    />
  </a>
</div>
