<script lang="ts">
	import {
		useCreateNewWorkspace,
		useGetAllWorkspaces,
		useGetAllWorkspacesOfOrg,
		useEditWorkspace,
		useDeleteWorkspace,
		useDeleteWorkspacesofOrg
	} from '@/api/queries/workspace-query';
	import type { WorkspaceType, WorkspaceQueryParams } from '@/Types';

	let authToken: string = 'your-actual-jwt-token-here';

	// State variables
	let orgId = $state('6858fc200f95cc2a2101ac11');
	let workSpaceName = $state('Workspace Testing');
	let workSpaceCode = $state('WTEC');
	let name = $state('testUser');
	let selectedWorkspaceId = $state('');
	let orgIdForFetch = $state('6858fc200f95cc2a2101ac11');

	// Query parameters for pagination, search, etc.
	let queryParams = $state<WorkspaceQueryParams>({
		page: 1,
		limit: 10,
		searchQuery: '',
		sortOrder: 'desc',
		sortBy: 'createdAt',
		filter: { modifiedBy: 'super' }
	});

	let orgQueryParams = $state<WorkspaceQueryParams>({
		page: 1,
		limit: 10,
		searchQuery: '',
		sortOrder: 'desc',
		sortBy: 'createdAt',
		filter: {}
	});

	let filterJson = $state('{}');
	let orgFilterJson = $state('{}');

	// UI state
	let activeTab = $state('view');
	let showNotification = $state(false);
	let notificationMessage = $state('');
	let notificationType = $state<'success' | 'error' | 'info'>('info');

	// Helper function to show notifications
	const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info') => {
		notificationMessage = message;
		notificationType = type;
		showNotification = true;
		setTimeout(() => {
			showNotification = false;
		}, 3000);
	};

	const handleFilterChange = () => {
		try {
			queryParams.filter = JSON.parse(filterJson);
			handleGetWorkspace();
		} catch (error) {
			showNotificationMessage('Invalid filter JSON', 'error');
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
			await $createNewWorkspace.mutateAsync({
				workspaceData: newWorkspaceData,
				token: authToken
			});
			showNotificationMessage('Workspace created successfully!', 'success');
			$getAllWorkspace.refetch();
			activeTab = 'view';
		} catch (error) {
			showNotificationMessage('Unable to create workspace', 'error');
			console.error('Unable to create a workspace', error);
		}
	};

	// Create reactive queries that update when parameters change
	let getAllWorkspace = useGetAllWorkspaces(authToken, queryParams);

	const handleGetWorkspace = async () => {
		try {
			const queryString = new URLSearchParams({
				page: (queryParams.page || 1).toString(),
				limit: (queryParams.limit || 5).toString(),
				searchQuery: queryParams.searchQuery || '',
				sortOrder: queryParams.sortOrder || 'desc',
				sortBy: queryParams.sortBy || 'createdAt',
				filter: JSON.stringify(queryParams.filter || {})
			}).toString();
			const url = `http://localhost:3000/workspace?${queryString}`;
			console.log('Fetching workspaces with URL:', url);
			await $getAllWorkspace.refetch();
			console.log('Fetched workspaces:', $getAllWorkspace.data);
			showNotificationMessage('Workspaces refreshed successfully!', 'success');
		} catch (error) {
			showNotificationMessage('Error fetching workspaces', 'error');
			console.error('Error fetching workspaces:', error);
		}
	};

	// Create reactive query for organization workspaces
	let getAllWorkspacesOfOrg = $derived(
		useGetAllWorkspacesOfOrg(orgIdForFetch, authToken, orgQueryParams)
	);
	let getOrgData = $derived($getAllWorkspacesOfOrg.data);
	const handleGetWorkspacesOfOrg = async () => {
		try {
			const queryString = new URLSearchParams({
				page: (orgQueryParams.page || 1).toString(),
				limit: (orgQueryParams.limit || 5).toString(),
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

	const editWorkspace = useEditWorkspace();
	const handleEditWorkspace = async () => {
		if (!selectedWorkspaceId) {
			showNotificationMessage('Please select a workspace to edit', 'error');
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
			showNotificationMessage('Workspace updated successfully!', 'success');
			$getAllWorkspace.refetch();
			activeTab = 'view';
		} catch (error) {
			showNotificationMessage('Unable to edit workspace', 'error');
			console.log(`Unable to edit the workspace of ${selectedWorkspaceId}`, error);
		}
	};

	const deleteWorkspace = useDeleteWorkspace();
	const handleDeleteWorkspace = async () => {
		if (!selectedWorkspaceId) {
			showNotificationMessage('Please select a workspace to delete', 'error');
			return;
		}

		const confirmed = confirm(
			'Are you sure you want to delete this workspace? This action cannot be undone.'
		);
		if (!confirmed) return;

		try {
			await $deleteWorkspace.mutateAsync({
				id: selectedWorkspaceId,
				token: authToken
			});
			showNotificationMessage('Workspace deleted successfully!', 'success');
			$getAllWorkspace.refetch();
			selectedWorkspaceId = '';
			activeTab = 'view';
		} catch (error) {
			showNotificationMessage('Unable to delete workspace', 'error');
			console.log(`Unable to delete the workspace of ${selectedWorkspaceId}`, error);
		}
	};

	const deleteWorkspacesOfOrg = useDeleteWorkspacesofOrg();
	const handleDeleteWorkspaceOfOrg = async () => {
		if (!orgId) {
			showNotificationMessage('Please provide an organization ID', 'error');
			return;
		}

		const confirmed = confirm(
			`Are you sure you want to delete ALL workspaces for organization ${orgId}? This action cannot be undone.`
		);
		if (!confirmed) return;

		try {
			await $deleteWorkspacesOfOrg.mutateAsync({
				orgId: orgId,
				token: authToken
			});
			showNotificationMessage('All organization workspaces deleted successfully!', 'success');
			$getAllWorkspace.refetch();
			activeTab = 'view';
		} catch (error) {
			showNotificationMessage('Unable to delete organization workspaces', 'error');
			console.error('Unable to delete the workspaces of an ORG', error);
		}
	};

	const selectWorkspaceForEdit = (workspace: any) => {
		selectedWorkspaceId = workspace._id || workspace.id;
		orgId = workspace.orgId;
		workSpaceName = workspace.workspaceName;
		workSpaceCode = workspace.workspaceCode;
		activeTab = 'edit';
		console.log('Selected workspace for edit:', workspace);
		showNotificationMessage('Workspace selected for editing', 'info');
	};

	const fetchWorkspaceDetails = async () => {
		if (!selectedWorkspaceId) {
			showNotificationMessage('Please enter a workspace ID', 'error');
			return;
		}

		try {
			const allWorkspaces = Array.isArray($getAllWorkspace.data)
				? $getAllWorkspace.data
				: $getAllWorkspace.data?.workspaces || [];

			const workspace = allWorkspaces.find(
				(w) => (w._id && w._id === selectedWorkspaceId) || (w.id && w.id === selectedWorkspaceId)
			);

			if (workspace) {
				orgId = workspace.orgId;
				workSpaceName = workspace.workspaceName;
				workSpaceCode = workspace.workspaceCode;
				name = workspace.createdBy;
				showNotificationMessage('Workspace details loaded successfully!', 'success');
			} else {
				await $getAllWorkspace.refetch();
				const refreshedWorkspaces = Array.isArray($getAllWorkspace.data)
					? $getAllWorkspace.data
					: $getAllWorkspace.data?.workspaces || [];

				const refreshedWorkspace = refreshedWorkspaces.find(
					(w) => (w._id && w._id === selectedWorkspaceId) || (w.id && w.id === selectedWorkspaceId)
				);

				if (refreshedWorkspace) {
					orgId = refreshedWorkspace.orgId;
					workSpaceName = refreshedWorkspace.workspaceName;
					workSpaceCode = refreshedWorkspace.workspaceCode;
					name = refreshedWorkspace.createdBy;
					showNotificationMessage('Workspace details loaded successfully!', 'success');
				} else {
					showNotificationMessage('Workspace not found with the provided ID', 'error');
				}
			}
		} catch (error) {
			showNotificationMessage('Error fetching workspace details', 'error');
			console.error('Error fetching workspace details:', error);
		}
	};

	const clearEditForm = () => {
		selectedWorkspaceId = '';
		orgId = '6858fc200f95cc2a2101ac11';
		workSpaceName = '';
		workSpaceCode = '';
		name = 'testUser';
		showNotificationMessage('Edit form cleared', 'info');
	};

	const handleWorkspaceIdInput = (event: Event) => {
		const target = event.target as HTMLInputElement;
		selectedWorkspaceId = target.value;
	};

	const handlePageChange = (newPage: number, isOrgQuery = false) => {
		if (isOrgQuery) {
			orgQueryParams.page = newPage;
			handleGetWorkspacesOfOrg();
		} else {
			queryParams.page = newPage;
			handleGetWorkspace();
		}
	};

	const getTotalPages = (totalCount: number, limit: number) => {
		return Math.ceil(totalCount / limit);
	};
</script>

<div class="min-h-screen bg-gray-50 p-6">
	<div class="mx-auto max-w-6xl">
		<div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Workspace Management</h1>
			<p class="mt-2 text-gray-600">Manage your organization's workspaces</p>
		</div>

		{#if showNotification}
			<div
				class="mb-6 rounded-lg border-l-4 p-4 {notificationType === 'success'
					? 'border-green-400 bg-green-50 text-green-700'
					: notificationType === 'error'
						? 'border-red-400 bg-red-50 text-red-700'
						: 'border-blue-400 bg-blue-50 text-blue-700'}"
			>
				{notificationMessage}
			</div>
		{/if}

		<div class="mb-6">
			<nav class="flex space-x-8" aria-label="Tabs">
				<button
					class="border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap {activeTab === 'view'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => {
						activeTab = 'view';
						handleGetWorkspace();
					}}
				>
					View All Workspaces
				</button>
				<button
					class="border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap {activeTab === 'viewOrg'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => {
						activeTab = 'viewOrg';
						handleGetWorkspacesOfOrg();
					}}
				>
					View Org Workspaces
				</button>
				<button
					class="border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap {activeTab === 'create'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => (activeTab = 'create')}
				>
					Create Workspace
				</button>
				<button
					class="border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap {activeTab === 'edit'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => (activeTab = 'edit')}
				>
					Edit Workspace
				</button>
				<button
					class="border-b-2 px-1 py-2 text-sm font-medium whitespace-nowrap {activeTab === 'delete'
						? 'border-blue-500 text-blue-600'
						: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
					onclick={() => (activeTab = 'delete')}
				>
					Delete Operations
				</button>
			</nav>
		</div>

		<div class="rounded-lg bg-white shadow">
			{#if activeTab === 'view'}
				<div class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">All Workspaces</h2>
						<button
							class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
							onclick={handleGetWorkspace}
						>
							Refresh
						</button>
					</div>

					<div class="mb-6 rounded-lg border border-gray-200 p-4">
						<div class="grid gap-4 md:grid-cols-4">
							<div>
								<label for="searchInput" class="block text-sm font-medium text-gray-700"
									>Search Workspaces</label
								>
								<input
									id="searchInput"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Search by name or code..."
									bind:value={queryParams.searchQuery}
									oninput={() => handleGetWorkspace()}
								/>
							</div>
							<div>
								<label for="limitSelect" class="block text-sm font-medium text-gray-700"
									>Items per page</label
								>
								<select
									id="limitSelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={queryParams.limit}
									onchange={() => handleGetWorkspace()}
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
								</select>
							</div>
							<div>
								<label for="sortSelect" class="block text-sm font-medium text-gray-700"
									>Sort Order</label
								>
								<select
									id="sortSelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={queryParams.sortOrder}
									onchange={() => handleGetWorkspace()}
								>
									<option value="asc">Ascending</option>
									<option value="desc">Descending</option>
								</select>
							</div>
							<div>
								<label for="sortBySelect" class="block text-sm font-medium text-gray-700"
									>Sort By</label
								>
								<select
									id="sortBySelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={queryParams.sortBy}
									onchange={() => handleGetWorkspace()}
								>
									<option value="workspaceName">Workspace Name</option>
									<option value="workspaceCode">Workspace Code</option>
									<option value="createdAt">Created At</option>
									<option value="modifiedAt">Modified At</option>
								</select>
							</div>
						</div>
					</div>

					{#if $getAllWorkspace.isLoading}
						<div class="flex items-center justify-center py-12">
							<div class="text-center">
								<div
									class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
								></div>
								<p class="mt-4 text-gray-600">Loading workspaces...</p>
							</div>
						</div>
					{:else if $getAllWorkspace.isError}
						<div class="rounded-md bg-red-50 p-4">
							<div class="text-sm text-red-700">
								Error loading workspaces: {$getAllWorkspace.error?.message || 'Unknown error'}
							</div>
						</div>
					{:else if $getAllWorkspace.data}
						<div class="mb-4 rounded bg-gray-100 p-4 text-sm">
							<p><strong>Debug - Data structure:</strong></p>
							<pre>{JSON.stringify($getAllWorkspace.data, null, 2)}</pre>
						</div>

						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#if Array.isArray($getAllWorkspace.data) ? $getAllWorkspace.data.length > 0 : $getAllWorkspace.data.workspaces && $getAllWorkspace.data.workspaces.length > 0}
								{@const workspaces = Array.isArray($getAllWorkspace.data)
									? $getAllWorkspace.data
									: $getAllWorkspace.data.workspaces || []}
								{#each workspaces as workspace}
									<div
										class="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
									>
										<div class="mb-3">
											<h3 class="font-semibold text-gray-900">{workspace.workspaceName}</h3>
											<p class="text-sm text-gray-500">Code: {workspace.workspaceCode}</p>
										</div>
										<div class="space-y-1 text-sm text-gray-600">
											<p><span class="font-medium">ID:</span> {workspace._id || workspace.id}</p>
											<p><span class="font-medium">Org ID:</span> {workspace.orgId}</p>
											<p><span class="font-medium">Created by:</span> {workspace.createdBy}</p>
											<p>
												<span class="font-medium">Created:</span>
												{new Date(workspace.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div class="mt-4 flex space-x-2">
											<button
												class="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
												onclick={() => selectWorkspaceForEdit(workspace)}
											>
												Edit
											</button>
											<button
												class="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
												onclick={() => {
													selectedWorkspaceId = workspace._id || workspace.id;
													activeTab = 'delete';
												}}
											>
												Delete
											</button>
										</div>
									</div>
								{/each}
							{:else}
								<div class="col-span-full py-12 text-center">
									<p class="text-gray-500">No workspaces found</p>
									<p class="mt-2 text-xs text-gray-400">
										Data received but no workspaces array found
									</p>
								</div>
							{/if}
						</div>

						{#if $getAllWorkspace.data && $getAllWorkspace.data.count}
							{@const totalPages = getTotalPages(
								$getAllWorkspace.data.count,
								queryParams.limit || 10
							)}
							{#if totalPages > 1}
								<div class="mt-6 flex items-center justify-between">
									<div class="text-sm text-gray-700">
										Showing page {queryParams.page || 1} of {totalPages}
										({$getAllWorkspace.data.count} total workspaces)
									</div>
									<div class="flex space-x-2">
										<button
											class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
											onclick={() => handlePageChange((queryParams.page || 1) - 1)}
											disabled={(queryParams.page || 1) <= 1}
										>
											Previous
										</button>
										<span class="flex items-center px-3 py-2 text-sm text-gray-700">
											Page {queryParams.page || 1}
										</span>
										<button
											class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
											onclick={() => handlePageChange((queryParams.page || 1) + 1)}
											disabled={(queryParams.page || 1) >= totalPages}
										>
											Next
										</button>
									</div>
								</div>
							{/if}
						{/if}
					{/if}
				</div>
			{/if}

			{#if activeTab === 'viewOrg'}
				<div class="p-6">
					<div class="mb-4 flex items-center justify-between">
						<h2 class="text-xl font-semibold text-gray-900">Organization Workspaces</h2>
						<div class="flex items-center space-x-4">
							<div class="flex items-center space-x-2">
								<label for="orgIdInput" class="text-sm font-medium text-gray-700">Org ID:</label>
								<input
									id="orgIdInput"
									type="text"
									class="rounded-md border-gray-300 px-3 py-1 text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter organization ID"
									bind:value={orgIdForFetch}
								/>
							</div>
							<button
								class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
								onclick={handleGetWorkspacesOfOrg}
							>
								Fetch Org Workspaces
							</button>
						</div>
					</div>

					<div class="mb-6 rounded-lg border border-gray-200 p-4">
						<div class="grid gap-4 md:grid-cols-4">
							<div>
								<label for="orgSearchInput" class="block text-sm font-medium text-gray-700"
									>Search Workspaces</label
								>
								<input
									id="orgSearchInput"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Search by name or code..."
									bind:value={orgQueryParams.searchQuery}
									oninput={() => handleGetWorkspacesOfOrg()}
								/>
							</div>
							<div>
								<label for="orgLimitSelect" class="block text-sm font-medium text-gray-700"
									>Items per page</label
								>
								<select
									id="orgLimitSelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={orgQueryParams.limit}
									onchange={() => handleGetWorkspacesOfOrg()}
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
								</select>
							</div>
							<div>
								<label for="orgSortSelect" class="block text-sm font-medium text-gray-700"
									>Sort Order</label
								>
								<select
									id="orgSortSelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={orgQueryParams.sortOrder}
									onchange={() => handleGetWorkspacesOfOrg()}
								>
									<option value="asc">Ascending</option>
									<option value="desc">Descending</option>
								</select>
							</div>
							<div>
								<label for="orgSortBySelect" class="block text-sm font-medium text-gray-700"
									>Sort By</label
								>
								<select
									id="orgSortBySelect"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									bind:value={orgQueryParams.sortBy}
									onchange={() => handleGetWorkspacesOfOrg()}
								>
									<option value="workspaceName">Workspace Name</option>
									<option value="workspaceCode">Workspace Code</option>
									<option value="createdAt">Created At</option>
									<option value="modifiedAt">Modified At</option>
								</select>
							</div>
						</div>
					</div>

					{#if $getAllWorkspacesOfOrg.isLoading}
						<div class="flex items-center justify-center py-12">
							<div class="text-center">
								<div
									class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600"
								></div>
								<p class="mt-4 text-gray-600">Loading organization workspaces...</p>
							</div>
						</div>
					{:else if $getAllWorkspacesOfOrg.isError}
						<div class="rounded-md bg-red-50 p-4">
							<div class="text-sm text-red-700">
								Error loading organization workspaces: {$getAllWorkspacesOfOrg.error?.message ||
									'Unknown error'}
							</div>
						</div>
					{:else if $getAllWorkspacesOfOrg.data}
						<div class="mb-4 rounded bg-gray-100 p-4 text-sm">
							<p><strong>Debug - Org Data structure:</strong></p>
							<pre>{JSON.stringify($getAllWorkspacesOfOrg.data, null, 2)}</pre>
						</div>

						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#if Array.isArray($getAllWorkspacesOfOrg.data) ? $getAllWorkspacesOfOrg.data.length > 0 : $getAllWorkspacesOfOrg.data.workspaces && $getAllWorkspacesOfOrg.data.workspaces.length > 0}
								{@const orgWorkspaces = Array.isArray($getAllWorkspacesOfOrg.data)
									? $getAllWorkspacesOfOrg.data
									: $getAllWorkspacesOfOrg.data.workspaces || []}
								{#each orgWorkspaces as workspace}
									<div
										class="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
									>
										<div class="mb-3">
											<h3 class="font-semibold text-gray-900">{workspace.workspaceName}</h3>
											<p class="text-sm text-gray-500">Code: {workspace.workspaceCode}</p>
										</div>
										<div class="space-y-1 text-sm text-gray-600">
											<p><span class="font-medium">ID:</span> {workspace._id || workspace.id}</p>
											<p><span class="font-medium">Org ID:</span> {workspace.orgId}</p>
											<p><span class="font-medium">Created by:</span> {workspace.createdBy}</p>
											<p>
												<span class="font-medium">Created:</span>
												{new Date(workspace.createdAt).toLocaleDateString()}
											</p>
										</div>
										<div class="mt-4 flex space-x-2">
											<button
												class="rounded bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
												onclick={() => selectWorkspaceForEdit(workspace)}
											>
												Edit
											</button>
											<button
												class="rounded bg-red-100 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
												onclick={() => {
													selectedWorkspaceId = workspace._id || workspace.id;
													activeTab = 'delete';
												}}
											>
												Delete
											</button>
										</div>
									</div>
								{/each}
							{:else}
								<div class="col-span-full py-12 text-center">
									<p class="text-gray-500">No workspaces found for organization: {orgIdForFetch}</p>
									<p class="mt-2 text-xs text-gray-400">
										Try entering a different organization ID or check if the organization has any
										workspaces
									</p>
								</div>
							{/if}
						</div>
					{:else}
						<div class="py-12 text-center">
							<p class="text-gray-500">
								Enter an organization ID and click "Fetch Org Workspaces" to view workspaces
							</p>
						</div>
					{/if}

					{#if $getAllWorkspacesOfOrg.data && $getAllWorkspacesOfOrg.data.count}
						{@const totalOrgPages = getTotalPages(
							$getAllWorkspacesOfOrg.data.count,
							orgQueryParams.limit || 10
						)}
						{#if totalOrgPages > 1}
							<div class="mt-6 flex items-center justify-between">
								<div class="text-sm text-gray-700">
									Showing page {orgQueryParams.page || 1} of {totalOrgPages}
									({$getAllWorkspacesOfOrg.data.count} total workspaces)
								</div>
								<div class="flex space-x-2">
									<button
										class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										onclick={() => handlePageChange((orgQueryParams.page || 1) - 1, true)}
										disabled={(orgQueryParams.page || 1) <= 1}
									>
										Previous
									</button>
									<span class="flex items-center px-3 py-2 text-sm text-gray-700">
										Page {orgQueryParams.page || 1}
									</span>
									<button
										class="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
										onclick={() => handlePageChange((orgQueryParams.page || 1) + 1, true)}
										disabled={(orgQueryParams.page || 1) >= totalOrgPages}
									>
										Next
									</button>
								</div>
							</div>
						{/if}
					{/if}
				</div>
			{/if}

			{#if activeTab === 'create'}
				<div class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Create New Workspace</h2>
					<form class="space-y-6" onsubmit={handleCreatingWorkspace}>
						<div class="grid gap-6 md:grid-cols-2">
							<div>
								<label for="orgId" class="block text-sm font-medium text-gray-700"
									>Organization ID</label
								>
								<input
									id="orgId"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter organization ID"
									bind:value={orgId}
								/>
							</div>
							<div>
								<label for="workspaceName" class="block text-sm font-medium text-gray-700"
									>Workspace Name</label
								>
								<input
									id="workspaceName"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter workspace name"
									bind:value={workSpaceName}
								/>
							</div>
							<div>
								<label for="workspaceCode" class="block text-sm font-medium text-gray-700"
									>Workspace Code</label
								>
								<input
									id="workspaceCode"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter workspace code"
									bind:value={workSpaceCode}
								/>
							</div>
							<div>
								<label for="creatorName" class="block text-sm font-medium text-gray-700"
									>Creator Name</label
								>
								<input
									id="creatorName"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter creator name"
									bind:value={name}
								/>
							</div>
						</div>
						<div class="flex justify-end">
							<button
								type="submit"
								class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
								disabled={$createNewWorkspace.isPending}
							>
								{$createNewWorkspace.isPending ? 'Creating...' : 'Create Workspace'}
							</button>
						</div>
					</form>
				</div>
			{/if}

			{#if activeTab === 'edit'}
				<div class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Edit Workspace</h2>
					<div class="mb-4 rounded bg-blue-50 p-3 text-sm">
						<p><strong>Debug - Edit State:</strong></p>
						<p>Selected ID: {selectedWorkspaceId || 'None'}</p>
						<p>Org ID: {orgId}</p>
						<p>Workspace Name: {workSpaceName}</p>
						<p>Workspace Code: {workSpaceCode}</p>
					</div>

					<div class="mb-6 rounded-lg border border-gray-200 p-4">
						<h3 class="mb-4 text-lg font-medium text-gray-900">Find Workspace to Edit</h3>
						<div class="flex gap-4">
							<div class="flex-1">
								<label for="workspaceIdInput" class="block text-sm font-medium text-gray-700"
									>Enter Workspace ID</label
								>
								<input
									id="workspaceIdInput"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
									placeholder="Enter workspace ID to fetch details"
									bind:value={selectedWorkspaceId}
									oninput={handleWorkspaceIdInput}
								/>
							</div>
							<div class="flex items-end">
								<button
									type="button"
									class="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
									onclick={fetchWorkspaceDetails}
									disabled={!selectedWorkspaceId}
								>
									Fetch Details
								</button>
							</div>
						</div>
					</div>

					{#if selectedWorkspaceId && (workSpaceName || orgId)}
						<form class="space-y-6" onsubmit={handleEditWorkspace}>
							<div class="grid gap-6 md:grid-cols-2">
								<div>
									<label for="editOrgId" class="block text-sm font-medium text-gray-700"
										>Organization ID</label
									>
									<input
										id="editOrgId"
										type="text"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={orgId}
										required
									/>
								</div>
								<div>
									<label for="editWorkspaceName" class="block text-sm font-medium text-gray-700"
										>Workspace Name</label
									>
									<input
										id="editWorkspaceName"
										type="text"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={workSpaceName}
										required
									/>
								</div>
								<div>
									<label for="editWorkspaceCode" class="block text-sm font-medium text-gray-700"
										>Workspace Code</label
									>
									<input
										id="editWorkspaceCode"
										type="text"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={workSpaceCode}
										required
									/>
								</div>
								<div>
									<label for="editCreatorName" class="block text-sm font-medium text-gray-700"
										>Creator Name</label
									>
									<input
										id="editCreatorName"
										type="text"
										class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
										bind:value={name}
										required
									/>
								</div>
							</div>
							<div class="flex justify-end space-x-3">
								<button
									type="button"
									class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
									onclick={clearEditForm}
								>
									Clear
								</button>
								<button
									type="submit"
									class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
									disabled={$editWorkspace.isPending}
								>
									{$editWorkspace.isPending ? 'Updating...' : 'Update Workspace'}
								</button>
							</div>
						</form>
					{:else if selectedWorkspaceId}
						<div class="rounded-md bg-yellow-50 p-4">
							<p class="text-sm text-yellow-700">
								Click "Fetch Details" to load workspace information for editing.
							</p>
						</div>
					{:else}
						<div class="rounded-md bg-gray-50 p-4">
							<p class="text-sm text-gray-600">Enter a workspace ID above to start editing.</p>
						</div>
					{/if}
				</div>
			{/if}

			{#if activeTab === 'delete'}
				<div class="p-6">
					<h2 class="mb-6 text-xl font-semibold text-gray-900">Delete Operations</h2>
					<div class="space-y-8">
						<div class="rounded-lg border border-red-200 p-4">
							<h3 class="mb-4 text-lg font-medium text-red-900">Delete Single Workspace</h3>
							<div class="mb-4">
								<label for="deleteWorkspaceId" class="block text-sm font-medium text-gray-700"
									>Workspace ID</label
								>
								<input
									id="deleteWorkspaceId"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
									placeholder="Enter workspace ID to delete"
									bind:value={selectedWorkspaceId}
								/>
							</div>
							<button
								class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
								onclick={handleDeleteWorkspace}
								disabled={$deleteWorkspace.isPending}
							>
								{$deleteWorkspace.isPending ? 'Deleting...' : 'Delete Workspace'}
							</button>
						</div>

						<div class="rounded-lg border border-red-300 p-4">
							<h3 class="mb-4 text-lg font-medium text-red-900">
								Delete All Organization Workspaces
							</h3>
							<div class="mb-4">
								<label for="deleteOrgId" class="block text-sm font-medium text-gray-700"
									>Organization ID</label
								>
								<input
									id="deleteOrgId"
									type="text"
									class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
									placeholder="Enter organization ID"
									bind:value={orgId}
								/>
							</div>
							<div class="mb-4 rounded-md bg-red-50 p-3">
								<p class="text-sm text-red-700">
									⚠️ Warning: This will delete ALL workspaces for the specified organization. This
									action cannot be undone.
								</p>
							</div>
							<button
								class="rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
								onclick={handleDeleteWorkspaceOfOrg}
								disabled={$deleteWorkspacesOfOrg.isPending}
							>
								{$deleteWorkspacesOfOrg.isPending
									? 'Deleting...'
									: 'Delete All Organization Workspaces'}
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
