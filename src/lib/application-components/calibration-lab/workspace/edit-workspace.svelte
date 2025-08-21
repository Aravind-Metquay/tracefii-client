<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import { useEditWorkspace } from '@/api/queries/workspace-query';
	import type { WorkspaceType } from '@/Types';

	let { workspace, onWorkspaceUpdated } = $props();

	let authToken: string = 'your-actual-jwt-token-here';
	let isOpen = $state(false);
	let workspaceName = $state(workspace.workspaceName);
	let workspaceCode = $state(workspace.workspaceCode);
	let orgId = $state(workspace.orgId);
	let name = $state('testUser');
	let isLoading = $state(false);

	const editWorkspace = useEditWorkspace();

	$effect(() => {
		workspaceName = workspace.workspaceName;
		workspaceCode = workspace.workspaceCode;
		orgId = workspace.orgId;
	});

	async function handleSubmit() {
		isLoading = true;
		const updatedWorkspace: WorkspaceType = {
			_id: workspace._id,
			orgId,
			workspaceName,
			workspaceCode,
			createdAt: workspace.createdAt,
			createdBy: workspace.createdBy,
			modifiedBy: name,
			modifiedAt: new Date()
		};
		try {
			await $editWorkspace.mutateAsync({ workspace: updatedWorkspace, token: authToken });
			onWorkspaceUpdated();
			window.alert('Workspace updated successfully');
			isOpen = false;
		} catch (error) {
			window.alert('Unable to edit workspace');
			console.error(`Unable to edit the workspace of ${workspace._id}`, error);
		} finally {
			isLoading = false;
		}
	}
</script>

<Button size="sm" variant="default" onclick={() => (isOpen = true)}>Edit</Button>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
		<div class="w-[400px] max-w-[90%] rounded-xl bg-white p-6 shadow-lg">
			<h3 class="font-dm_sans mb-4 text-lg font-semibold">Edit Workspace</h3>

			<div class="space-y-4">
				<div>
					<label for="workspaceName" class="mb-1 block text-sm font-medium">Workspace Name</label>
					<input
						type="text"
						class="font-dm_sans w-full rounded-md border border-gray-300 p-2"
						placeholder="Enter workspace"
						bind:value={workspaceName}
						required
					/>
				</div>

				<div>
					<label for="workspaceCode" class="mb-1 block text-sm font-medium">Workspace Code</label>
					<input
						type="text"
						class="font-dm_sans w-full rounded-md border border-gray-300 p-2"
						placeholder="Enter 3-character code"
						bind:value={workspaceCode}
						maxlength="3"
						minlength="3"
						readonly
						oninput={(e) => (workspaceCode = e.currentTarget.value.slice(0, 3))}
					/>
				</div>
			</div>

			<div class="mt-6 flex justify-end gap-2">
				<Button
					color="danger"
					variant="default"
					size="sm"
					class="font-dm_sans"
					onclick={() => (isOpen = false)}
				>
					Cancel
				</Button>
				<Button
					color="primary"
					size="sm"
					class="font-dm_sans"
					disabled={isLoading}
					onclick={handleSubmit}
				>
					{isLoading ? 'Updating...' : 'Update Workspace'}
				</Button>
			</div>
		</div>
	</div>
{/if}

<style>
	:global(.font-dm_sans) {
		font-family: 'DM Sans', sans-serif;
	}
</style>
