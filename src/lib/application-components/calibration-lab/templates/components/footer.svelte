<script lang="ts">
	import { Layers, Layers2, CopyPlus, Trash2 }  from '@lucide/svelte';

	// The component now accepts the specific functions it needs as props
	let {
		bringForward,
		sendBackwards,
		duplicateSelected,
		deleteSelected
	}: {
		bringForward: () => void;
		sendBackwards: () => void;
		duplicateSelected: () => Promise<void>;
		deleteSelected: () => void;
	} = $props();
</script>

<div class="rounded-lg border bg-gray-50 p-4">
	<h3 class="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">Actions</h3>
	<div class="grid grid-cols-2 gap-2">
		<button
			class="flex items-center justify-center rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100"
			onclick={bringForward}
			title="Bring Forward"
		>
			<Layers class="h-5 w-5 text-gray-700" />
		</button>

		<button
			class="flex items-center justify-center rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100"
			onclick={sendBackwards}
			title="Send Backward"
		>
			<Layers2 class="h-5 w-5 text-gray-700" />
		</button>

		<button
			class="flex items-center justify-center rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100"
			onclick={duplicateSelected}
			title="Duplicate"
		>
			<CopyPlus class="h-5 w-5 text-gray-700" />
		</button>

		<button
			class="flex items-center justify-center rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-red-100"
			onclick={deleteSelected}
			title="Delete"
		>
			<Trash2 class="h-5 w-5 text-red-600" />
		</button>
	</div>
</div>