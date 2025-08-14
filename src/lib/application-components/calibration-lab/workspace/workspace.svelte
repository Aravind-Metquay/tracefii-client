<script lang="ts">
	import {
		useCreateNewWorkspace,
		useGetAllWorkspaces,
		useEditWorkspace,
		useDeleteWorkspace,
		useDeleteWorkspacesofOrg
	} from '@/api/queries/workspace-query';
	import type { WorkspaceType } from '@/Types';

	let authToken: string = 'your-actual-jwt-token-here';

	let orgId = $state('6858fc200f95cc2a2101ac11');
	let workSpaceName = $state('Workspace Testing');
	let workSpaceCode = $state('WTEC');
	let name = $state('testUser');

	const createNewWorkspace = useCreateNewWorkspace();
	const handleCreatingWorkspace = async () => {
		const newWorkspaceData: Omit<WorkspaceType, '_id'> = {
			orgId: orgId,
			workspaceName: workSpaceName,
			workspaceCode: workSpaceCode,
			createdAt: new Date(),
			createdBy: name
		};

		try {
			const result = await $createNewWorkspace.mutateAsync({
				workspaceData: newWorkspaceData,
				token: authToken
			});
			console.log('Workspace created successfully:', result);
			$getAllWorkspace.refetch();
		} catch (error) {
			console.error('Unable to create a workspace', error);
		}
	};

	const getAllWorkspace = useGetAllWorkspaces(authToken);
	const handleGetWorkspace = async () => {
		try {
			await $getAllWorkspace.refetch();
			const workspaces = $getAllWorkspace.data;
			console.log('All workspaces:', workspaces);
		} catch (error) {
			console.error('Error fetching workspaces:', error);
		}
	};

	let selectedWorkspaceId = $state('');
	const handleIDChange = (e: Event) => {
		selectedWorkspaceId = (e.target as HTMLInputElement).value;
	};

	const handleOrgChange = (e: Event) => {
		orgId = (e.target as HTMLInputElement).value;
	};

	const handleWorkSpaceName = (e: Event) => {
		workSpaceName = (e.target as HTMLInputElement).value;
	};

	const handleWorkspaceCode = (e: Event) => {
		workSpaceCode = (e.target as HTMLInputElement).value;
	};

	const handleNameChange = (e: Event) => {
		name = (e.target as HTMLInputElement).value;
	};

	const editWorkspace = useEditWorkspace();
	const handleEditWorkspace = async () => {
		if (!selectedWorkspaceId) {
			console.error('No workspace selected for editing');
			return;
		}

		const updatedData: WorkspaceType = {
			_id: selectedWorkspaceId,
			orgId: orgId,
			workspaceName: workSpaceName,
			workspaceCode: workSpaceCode,
			createdAt: new Date(),
			createdBy: name
		};

		try {
			await $editWorkspace.mutateAsync({
				workspace: updatedData,
				token: authToken
			});
			console.log('Workspace updated successfully');
			$getAllWorkspace.refetch();
		} catch (error) {
			console.log(`Unable to edit the workspace of ${selectedWorkspaceId}`, error);
		}
	};
	const deleteWorkspace = useDeleteWorkspace();
	const handleDeleteWorkspace = async () => {
		if (!selectedWorkspaceId) {
			console.error('No workspace selected for deletion');
			return;
		}

		try {
			await $deleteWorkspace.mutateAsync({
				id: selectedWorkspaceId,
				token: authToken
			});
			console.log('Workspace deleted successfully');
			$getAllWorkspace.refetch();
		} catch (error) {
			console.log(`Unable to delete the workspace of ${selectedWorkspaceId}`, error);
		}
	};

	const deleteWorkspacesOfOrg = useDeleteWorkspacesofOrg();
	const handleDeleteWorkspaceOfOrg = async () => {
		if (!orgId) {
			console.error('No organization ID provided');
			return;
		}

		// Show confirmation before deleting all workspaces of an organization
		const confirmed = confirm(
			`Are you sure you want to delete ALL workspaces for organization ${orgId}? This action cannot be undone.`
		);
		if (!confirmed) {
			return;
		}

		try {
			console.log(`Deleting all workspaces for organization: ${orgId}`);
			await $deleteWorkspacesOfOrg.mutateAsync({
				orgId: orgId,
				token: authToken
			});
			console.log('All workspaces of organization deleted successfully');
			$getAllWorkspace.refetch();
		} catch (error) {
			console.error('Unable to delete the workspaces of an ORG', error);
		}
	};
</script>

<div class="grid-cols grid">
	<hr />
	<br />
	<button
		class="rounded-lg border bg-amber-300 p-2"
		onclick={handleCreatingWorkspace}
		disabled={$createNewWorkspace.isPending}
	>
		{$createNewWorkspace.isPending ? 'Creating...' : 'Create new Workspace'}
	</button>
	<hr />
	<br />

	<button class="rounded-lg border bg-gray-300 p-2" onclick={handleGetWorkspace}>
		Get All Workspaces
	</button>
	<hr />
	<br />

	<input
		class="rounded-3xl border-2 border-amber-950 p-5"
		placeholder="Enter the workspace ID"
		value={selectedWorkspaceId}
		onchange={handleIDChange}
	/>

	<input
		class="rounded-3xl border-2 border-amber-950 p-5"
		placeholder="Enter the organization ID"
		value={orgId}
		onchange={handleOrgChange}
	/>

	<input
		class="rounded-3xl border-2 border-amber-950 p-5"
		placeholder="Enter the workspace name"
		value={workSpaceName}
		onchange={handleWorkSpaceName}
	/>

	<input
		class="rounded-3xl border-2 border-amber-950 p-5"
		placeholder="Enter the workspace code"
		value={workSpaceCode}
		onchange={handleWorkspaceCode}
	/>

	<input
		class="rounded-3xl border-2 border-amber-950 p-5"
		placeholder="Enter the creator name"
		value={name}
		onchange={handleNameChange}
	/>

	<button class="rounded-lg border bg-red-300 p-2" onclick={handleEditWorkspace}>
		Edit the Workspaces
	</button>

	<hr />
	<br />
	<button class="rounded-lg border bg-green-300 p-2" onclick={handleDeleteWorkspace}>
		Delete All Workspaces
	</button>

	<hr />
	<br />
	<button
		class="rounded-lg border bg-blue-300 p-2"
		onclick={handleDeleteWorkspaceOfOrg}
		disabled={$deleteWorkspacesOfOrg.isPending}
	>
		{$deleteWorkspacesOfOrg.isPending ? 'Deleting...' : 'Delete All Workspaces of ORG'}
	</button>

	<!-- Display fetched workspaces -->
	{#if $getAllWorkspace.isLoading}
		<div class="rounded-lg border bg-yellow-100 p-4">Loading workspaces...</div>
	{/if}

	{#if $getAllWorkspace.isError}
		<div class="rounded-lg border bg-red-100 p-4 text-red-700">
			Error loading workspaces: {$getAllWorkspace.error?.message || 'Unknown error'}
		</div>
	{/if}

	{#if $getAllWorkspace.data}
		<div class="mt-4 rounded-lg border bg-green-100 p-4">
			<h3 class="mb-2 font-bold">Workspaces:</h3>
			{#if Array.isArray($getAllWorkspace.data)}
				{#each $getAllWorkspace.data as workspace}
					<div class="mb-2 rounded border bg-white p-2">
						<p><strong>ID:</strong> {workspace._id}</p>
						<p><strong>Name:</strong> {workspace.workspaceName}</p>
						<p><strong>Code:</strong> {workspace.workspaceCode}</p>
						<p><strong>Org ID:</strong> {workspace.orgId}</p>
					</div>
				{/each}
			{:else if $getAllWorkspace.data.workspaces}
				{#each $getAllWorkspace.data.workspaces as workspace}
					<div class="mb-2 rounded border bg-white p-2">
						<p><strong>ID:</strong> {workspace._id}</p>
						<p><strong>Name:</strong> {workspace.workspaceName}</p>
						<p><strong>Code:</strong> {workspace.workspaceCode}</p>
						<p><strong>Org ID:</strong> {workspace.orgId}</p>
					</div>
				{/each}
			{:else}
				<p>No workspaces found or unexpected data structure</p>
			{/if}
		</div>
	{/if}

	<!-- Status messages -->
	{#if $createNewWorkspace.isSuccess}
		<div class="mt-2 rounded-lg border bg-green-100 p-4 text-green-700">
			Workspace created successfully!
		</div>
	{/if}

	{#if $editWorkspace.isSuccess}
		<div class="mt-2 rounded-lg border bg-blue-100 p-4 text-blue-700">
			Workspace updated successfully!
		</div>
	{/if}

	{#if $deleteWorkspace.isSuccess}
		<div class="mt-2 rounded-lg border bg-orange-100 p-4 text-orange-700">
			Workspace deleted successfully!
		</div>
	{/if}

	{#if $deleteWorkspacesOfOrg.isSuccess}
		<div class="mt-2 rounded-lg border bg-red-100 p-4 text-red-700">
			All workspaces for organization deleted successfully!
		</div>
	{/if}

	{#if $deleteWorkspacesOfOrg.isError}
		<div class="mt-2 rounded-lg border bg-red-200 p-4 text-red-800">
			Error deleting organization workspaces: {$deleteWorkspacesOfOrg.error?.message ||
				'Unknown error'}
		</div>
	{/if}
</div>
