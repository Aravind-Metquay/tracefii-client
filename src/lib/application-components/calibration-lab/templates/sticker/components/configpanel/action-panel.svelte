<script lang="ts">
	import { Layers, Layers2, CopyPlus, Trash2 }  from '@lucide/svelte';

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

<div class="space-y-4 p-1">
	<div>
		<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
			Layer Actions
		</h3>
		<div class="flex gap-2">
			<button
				class="flex items-center justify-center rounded-md border bg-white p-2 text-gray-600 transition hover:bg-gray-100"
				onclick={bringForward}
				title="Bring Forward"
			>
				<Layers class="h-5 w-5" />
			</button>
			<button
				class="flex items-center justify-center rounded-md border bg-white p-2 text-gray-600 transition hover:bg-gray-100"
				onclick={sendBackwards}
				title="Send Backward"
			>
				<Layers2 class="h-5 w-5" />
			</button>
		</div>
	</div>

	<div>
		<h3 class="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
			Edit Actions
		</h3>
		<div class="flex gap-2">
			<button
				class="flex items-center justify-center rounded-md border bg-white p-2 text-gray-600 transition hover:bg-gray-100"
				onclick={duplicateSelected}
				title="Duplicate"
			>
				<CopyPlus class="h-5 w-5" />
			</button>
			<button
				class="flex items-center justify-center rounded-md border border-red-200 bg-white p-2 text-red-600 transition hover:bg-red-50"
				onclick={deleteSelected}
				title="Delete"
			>
				<Trash2 class="h-5 w-5" />
			</button>
		</div>
	</div>
</div>