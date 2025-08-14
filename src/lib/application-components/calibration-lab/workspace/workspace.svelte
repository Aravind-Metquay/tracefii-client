<script lang="ts">
	import { useCreateNewWorkspace, useGetAllWorkspaces } from '@/api/queries/workspace-query';
	import type { WorkspaceType } from '@/Types';
	import type { inspect } from 'util';

	// Set a proper auth token - you should get this from your auth system
	let authToken: string = 'your-actual-jwt-token-here';

	const createNewWorkspace = useCreateNewWorkspace();

	const handleCreatingWorkspace = async () => {
		const newWorkspaceData: Omit<WorkspaceType, '_id'> = {
			orgId: '6858fc200f95cc2a2101ac11',
			workspaceName: 'Workspace Testing',
			workspaceCode: 'WTEC',
			createdAt: new Date(),
			createdBy: 'prayag@gmail.com'
		};

		try {
			const result = await $createNewWorkspace.mutateAsync({
				workspaceData: newWorkspaceData,
				token: authToken
			});
			console.log('Workspace created successfully:', result);
			// Refetch workspaces after creating a new one
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
</script>

<h2>Workspace Management</h2>
<div>
	<button onclick={handleCreatingWorkspace} disabled={$createNewWorkspace.isPending}>
		{$createNewWorkspace.isPending ? 'Creating...' : 'Create new Workspace'}
	</button>

	<button onclick={handleGetWorkspace}> Get All Workspaces </button>
</div>
