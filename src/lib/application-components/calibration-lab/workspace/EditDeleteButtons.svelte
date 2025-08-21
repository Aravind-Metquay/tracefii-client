<script lang="ts">
	import EditWorkspace from './edit-workspace.svelte';
	import DeleteWorkspace from './delete-workspace.svelte';
	import type { WorkspaceType } from '@/Types';
	let { row, onWorkspaceUpdated } = $props<{
		row: WorkspaceType;
		onWorkspaceUpdated: () => void;
	}>();
	$inspect(row);
</script>

<div class="flex gap-2">
	<EditWorkspace workspace={row} />
	<DeleteWorkspace id={row.id} />
</div>
