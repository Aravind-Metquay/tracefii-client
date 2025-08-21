<script lang="ts">
  import { Edit, Trash2 } from '@lucide/svelte';

 // Accept the row prop directly
	let { row } = $props<{ row: { id?: string; _id?: string } }>();

    // 1. Add state to control modal visibility
    let showDeleteModal = $state(false);

    const id = row?.id || row?._id;

    function handleEdit() {
      if (id && (window as any).onEditRole) {
         (window as any).onEditRole(id);
       }
}

    // 2. This function is now called from the modal to confirm the deletion
     function confirmDelete() {
        if (id && (window as any).onDeleteRole) {
          (window as any).onDeleteRole(id);
		 }
        // Close the modal after deletion
        showDeleteModal = false;
     }
</script>

<div class="flex items-center justify-start gap-3">
	 <button onclick={handleEdit} class="text-gray-500 hover:text-purple-600" title="Edit role">
		<Edit class="size-4" />
    </button>
    
     <button onclick={() => showDeleteModal = true} class="text-gray-500 hover:text-red-600" title="Delete role">
          <Trash2 class="size-4" />
		</button>
</div>

{#if showDeleteModal}
    <div class="fixed inset-0 z-50 flex items-center justify-center "
	style="background-color: rgb(0,0,0,0.4);" onclick={() => showDeleteModal = false}>
        
        <div class="w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg border" onclick ={(e) => e.stopPropagation()}>
            
            <div class="p-6">
                <p class="text-lg text-gray-800">Do you want to delete this role?</p>
            </div>

            <hr />

            <div class="flex justify-end gap-3 bg-gray-50 p-4">
                <button 
                    onclick={() => showDeleteModal = false} 
                    class="rounded-lg bg-gray-800 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700"
                >
                    Cancel
                </button>
                <button 
                    onclick={confirmDelete} 
                    class="rounded-lg bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}