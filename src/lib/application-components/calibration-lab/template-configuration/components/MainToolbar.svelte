<script>
	import { Button } from '@/components/ui/button';

	let { editor } = $props();
</script>

<div class="main-toolbar flex items-center gap-2 border-b bg-white p-2">
	<Button onclick={editor.undo} disabled={!editor.canUndo} size="sm" variant="outline">
		↶ Undo
	</Button>

	<Button onclick={editor.redo} disabled={!editor.canRedo} size="sm" variant="outline">
		↷ Redo
	</Button>

	<div class="mx-2 h-6 w-px bg-gray-300"></div>

	<Button
		onclick={editor.deleteSelected}
		disabled={!editor.hasSelection}
		size="sm"
		variant="outline"
	>
		🗑️ Delete
	</Button>
</div>
