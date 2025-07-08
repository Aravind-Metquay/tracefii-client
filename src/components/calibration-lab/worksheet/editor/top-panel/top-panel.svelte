<script lang="ts">
  import { Button } from "bits-ui";
  import AddComponentModal from "./add-component-modal.svelte";
  import { currentActiveStore } from "../store/currentActiveElements-store.svelte";
  import type { WorksheetType } from "@/Types";

  interface Props {
    worksheet: WorksheetType;
    isSaving: boolean;
  }

  let { worksheet, isSaving }: Props = $props();

  let isModalOpen = $state(false);
  
  // Reactive derived values
  let currentActiveFunction = $derived(currentActiveStore.function);
  let isAddDisabled = $derived(!currentActiveFunction?.functionId);

  function openModal() {
    isModalOpen = true;
  }

  function closeModal() {
    isModalOpen = false;
  }

  function onModalOpenChange(open: boolean) {
    isModalOpen = open;
  }
</script>

<div class="flex justify-between p-2">
  <div>
    <div class="flex items-center gap-2">
      <h1 class="text-xl">{worksheet.worksheetName}</h1>
      {#if isSaving}
        <span class="text-gray-500 text-xs text-center">Saving...</span>
      {/if}
    </div>
    <p class="text-sm text-gray-400">{worksheet.worksheetId}</p>
  </div>
  
  <Button.Root 
    disabled={isAddDisabled} 
    class="px-4 py-2 bg-purple-600 text-white rounded-md text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
    onclick={openModal}
  >
    Add Component
  </Button.Root>
  
  <AddComponentModal 
    bind:isOpen={isModalOpen} 
    onOpenChange={onModalOpenChange} 
    onClose={closeModal} 
  />
</div>