<script lang="ts">
	import { useGetAllWorkspacesOfOrg } from '@/api/queries/workspace-query';
	import type { WorkspaceQueryParams } from '@/Types';
	import WorkspaceTable from './workspace-table.svelte';
	import { House } from '@lucide/svelte';

	let authToken: string = 'your-actual-jwt-token-here';
	let orgIdForFetch = $state('6858fc200f95cc2a2101ac11'); // Test - 6858fc200f95cc2a2101ac11
	let orgQueryParams = $state<WorkspaceQueryParams>({
		page: 1,
		limit: 10,
		searchQuery: '',
		sortOrder: 'desc',
		sortBy: 'createdAt',
		filter: {}
	});
	let orgFilterJson = $state('{}');
	let showNotification = $state(false);
	let notificationMessage = $state('');
	let notificationType = $state<'success' | 'error' | 'info'>('info');

	const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info') => {
		notificationMessage = message;
		notificationType = type;
		showNotification = true;
		setTimeout(() => {
			showNotification = false;
		}, 3000);
	};

	let getAllWorkspacesOfOrg = $derived(
		useGetAllWorkspacesOfOrg(orgIdForFetch, authToken, orgQueryParams)
	);
	let getOrgData = $derived($getAllWorkspacesOfOrg.data);

	const handleGetWorkspacesOfOrg = async () => {
		try {
			const queryString = new URLSearchParams({
				page: (orgQueryParams.page || 1).toString(),
				limit: (orgQueryParams.limit || 10).toString(),
				searchQuery: orgQueryParams.searchQuery || '',
				sortOrder: orgQueryParams.sortOrder || 'desc',
				sortBy: orgQueryParams.sortBy || 'createdAt',
				filter: JSON.stringify(orgQueryParams.filter || {})
			}).toString();
			const url = `http://localhost:3000/workspace/${orgIdForFetch}?${queryString}`;
			console.log('Fetching org workspaces with URL:', url);
			await $getAllWorkspacesOfOrg.refetch();
			console.log('Fetched org workspaces:', getOrgData);
			showNotificationMessage('Organization workspaces refreshed successfully!', 'success');
		} catch (error) {
			showNotificationMessage('Error fetching organization workspaces', 'error');
			console.error('Error fetching organization workspaces:', error);
		}
	};

	const handleOrgFilterChange = () => {
		try {
			orgQueryParams.filter = JSON.parse(orgFilterJson);
			handleGetWorkspacesOfOrg();
		} catch (error) {
			showNotificationMessage('Invalid filter JSON', 'error');
		}
	};

	function handlePageChange(newPage: number) {
		orgQueryParams.page = newPage;
		handleGetWorkspacesOfOrg();
	}

	function handleLimitChange(newLimit: number) {
		orgQueryParams.limit = newLimit;
		handleGetWorkspacesOfOrg();
	}

	function handleSearchChange(query: string) {
		orgQueryParams.searchQuery = query;
		handleGetWorkspacesOfOrg();
	}

	function handleWorkspaceUpdated() {
		handleGetWorkspacesOfOrg();
	}
</script>

<div class="flex h-full min-h-screen flex-col gap-2 bg-gray-50 p-6">
	<div class="flex-shrink-0">
		<House />
	</div>
	<div class="flex min-h-0 flex-grow flex-col">
		<WorkspaceTable
			workspaces={getOrgData?.workspaces || []}
			totalCount={getOrgData?.workspaces.length || 0}
			page={orgQueryParams.page || 1}
			limit={orgQueryParams.limit || 10}
			onPageChange={handlePageChange}
			onLimitChange={handleLimitChange}
			onSearchChange={handleSearchChange}
			onWorkspaceUpdated={handleWorkspaceUpdated}
		/>
	</div>
	{#if showNotification}
		<div class="fixed right-4 bottom-4 z-50">
			<div
				class="rounded-md p-4 shadow-md {notificationType === 'success'
					? 'bg-green-500'
					: notificationType === 'error'
						? 'bg-red-500'
						: 'bg-blue-500'} text-white"
			>
				{notificationMessage}
			</div>
		</div>
	{/if}
</div>

<style>
	:global(.font-dm_sans) {
		font-family: 'DM Sans', sans-serif;
	}
</style>
