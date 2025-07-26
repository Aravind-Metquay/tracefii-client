<script lang="ts">
	import { Layers, CopyPlus, Trash2, Layers2 } from '@lucide/svelte';

	let { editor } = $props();

	function bringToFront() {
		if (editor?.bringForward) editor.bringForward();
	}

	function sendToBack() {
		if (editor?.sendBackwards) editor.sendBackwards();
	}

	function duplicate() {
		if (editor?.onCopy && editor?.onPaste) {
			editor.onCopy();
			editor.onPaste();
		}
	}

	function deleteElement() {
		if (editor?.delete) editor.delete();
	}
</script>

<div class="space-y-4 pt-0">
	<div>
		<h3 class="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Layer Actions</h3>
		<div class="flex gap-2">
			<button
				class="rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
				onclick={bringToFront}
				aria-label="Bring to Front"
				title="Bring to Front"
			>
				<Layers class="text-gray-700" />
			</button>

			<button
				class="rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
				onclick={sendToBack}
				aria-label="Send to Back"
				title="Send to Back"
			>
				<Layers2 class="text-gray-700" />
			</button>
		</div>
	</div>

	<div>
		<h3 class="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase">Edit Actions</h3>
		<div class="flex gap-2">
			<button
				class="rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-blue-100 hover:text-blue-600"
				onclick={duplicate}
				aria-label="Duplicate"
				title="Duplicate"
			>
				<CopyPlus class="text-gray-700" />
			</button>

			<button
				class="rounded-md border border-gray-300 p-2 transition-all duration-200 hover:bg-red-100 hover:text-red-700"
				onclick={deleteElement}
				aria-label="Delete"
				title="Delete"
			>
				<Trash2 class="text-red-600" />
			</button>
		</div>
	</div>
</div>

<style>
	button {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
