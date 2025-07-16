<script lang="ts">
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';
	import AddComponentModal from './AddComponentModal/_add-component-modal.svelte';
	import { Button } from '@/components/ui/button';
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');
	let open = $state(false);
</script>

<div class="flex items-center justify-between border-b border-gray-200 bg-white p-4 shadow-sm">
	<div class="flex items-center gap-4">
		<!-- <button>
      Exit
    </button> -->

		<div>
			<h1 class="text-lg font-semibold text-gray-800">
				{worksheetManager.getWorksheet().metadata.worksheetName || 'Untitled Worksheet'}
			</h1>
			<div class="flex items-center gap-2 text-xs text-gray-500">
				<span>ID: {worksheetManager.getWorksheet().metadata.worksheetId || 'N/A'}</span>
				<span>&bull;</span>
				<span>Version: {worksheetManager.getWorksheet().metadata.worksheetName || '1.0.0'}</span>
			</div>
		</div>
	</div>

	<Button onclick={() => (open = true)}>Add New Component</Button>
	<AddComponentModal bind:open />

	<div class="flex items-center gap-4">
		<div class="flex items-center rounded-lg bg-gray-200 p-1">
			<button>Edit</button>
			<button>View</button>
		</div>
		<button>Save</button>
	</div>
</div>