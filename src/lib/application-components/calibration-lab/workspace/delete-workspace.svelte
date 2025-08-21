<script lang="ts">
	import { useDeleteWorkspace } from '@/api/queries/workspace-query';
	import { Button } from '@/components/ui/button';

	let { id } = $props();

	let authToken: string = 'your-actual-jwt-token-here';
	let isOpen = $state(false);
	let isLoading = $state(false);

	const deleteWorkspace = useDeleteWorkspace();

	async function handleDelete() {
		isLoading = true;
		try {
			await $deleteWorkspace.mutateAsync({ id, token: authToken });
			window.alert('Workspace deleted successfully');
			isOpen = false;
		} catch (error) {
			window.alert('Unable to delete workspace(s)');
			console.error(`Unable to delete workspace ${id}`, error);
		} finally {
			isLoading = false;
		}
	}
</script>

<!-- Trigger button -->
<Button class="border-1 border-black" size="sm" variant="default" onclick={() => (isOpen = true)}>
	{'Delete'}
</Button>

<!-- Confirmation modal -->
{#if isOpen}
	<div
		class="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
		onclick={() => (isOpen = false)}
	>
		<div class="w-[400px] max-w-[90%] rounded-xl bg-white p-6 shadow-lg">
			<!-- Header -->
			<div class="mb-4 text-lg font-semibold">Confirm Delete</div>

			<!-- Body -->
			<div class="mb-6 text-sm text-gray-600">
				Are you sure you want to {'delete this workspace'}
			</div>

			<!-- Footer -->
			<div class="flex justify-end gap-2">
				<Button color="default" variant="default" onclick={() => (isOpen = false)} size="sm">
					Cancel
				</Button>
				<Button color="danger" onclick={handleDelete} size="sm" disabled={isLoading}>
					{isLoading ? 'Deleting...' : 'Delete'}
				</Button>
			</div>
		</div>
	</div>
{/if}
