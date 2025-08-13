<script lang="ts">
	import {
		getAllOrganizations,
		useCreateNewOrganization,
		useDeleteOrganization,
		useEditOrganization,
		useFindOrganizationById
	} from '@/api/queries/organization-query';
	import type { OrganizationType } from '@/Types';

	// Reactive state for form inputs
	let orgType = $state<OrganizationType['organizationType']>('Native');
	let searchTerm = $state('');
	let token = $state('');
	let orgId = $state('');

	// Edit form state
	let editOrgName = $state('');
	let editOrgDescription = $state('');
	let editOrgType = $state<OrganizationType['organizationType']>('Native');
	let editEmailId = $state('');

	// Queries and mutations
	const createOrgMutation = useCreateNewOrganization();
	const allOrgsQuery = $derived(getAllOrganizations(token, orgType, searchTerm));
	const orgsData = $derived($allOrgsQuery.data);
	const refetchAllOrgs = $allOrgsQuery.refetch;

	const orgByIdQuery = $derived(useFindOrganizationById(orgId || undefined, token || undefined));
	const orgByIdData = $derived($orgByIdQuery.data);
	const refetchOrgById = $orgByIdQuery.refetch;

	// Debug effect to monitor query state
	$effect(() => {
		console.log('orgByIdQuery debug:', {
			orgId,
			token: token ? 'present' : 'missing',
			isLoading: $orgByIdQuery.isLoading,
			isFetching: $orgByIdQuery.isFetching,
			isError: $orgByIdQuery.isError,
			error: $orgByIdQuery.error,
			data: orgByIdData,
			enabled: !!(orgId && token)
		});
	});

	const deleteOrgMutation = useDeleteOrganization();
	const editOrgMutation = useEditOrganization();

	// Create organization
	const handleOrg = async () => {
		const statOrg: Omit<OrganizationType, '_id'> = {
			organizationName: 'SUDH5s',
			organizationDescription: '',
			organizationType: 'Native',
			emailId: 'sudhi@test.com',
			createdBy: 'sudhi',
			modifiedBy: 'sudhi',
			createdAt: new Date()
		};
		try {
			await $createOrgMutation.mutateAsync(
				{ organizationData: statOrg, token },
				{
					onSuccess: () => {
						refetchAllOrgs();
						console.log('Organization created successfully');
					}
				}
			);
		} catch (error) {
			console.error('Failed to create organization:', error);
		}
	};

	// Get all organizations
	const getOrg = async () => {
		console.log('Refetching organizations');
		await refetchAllOrgs();
	};

	// Get organization by ID
	const handleGetByID = async () => {
		if (!orgId.trim()) {
			alert('Please enter an organization ID');
			return;
		}
		if (!token.trim()) {
			alert('Please enter a token');
			return;
		}
		console.log('Getting organization by ID:', orgId, 'with token:', token);
		console.log('orgByIdQuery state:', $orgByIdQuery);
		await refetchOrgById();
	};

	// Delete organization
	const handleDelete = async () => {
		if (!orgId.trim()) {
			alert('Please enter an organization ID');
			return;
		}
		if (!token.trim()) {
			alert('Please enter a token');
			return;
		}
		try {
			await $deleteOrgMutation.mutateAsync(
				{ id: orgId, token },
				{
					onSuccess: () => {
						orgId = '';
						editOrgName = '';
						editOrgDescription = '';
						editOrgType = 'Native';
						editEmailId = '';
						refetchAllOrgs();
						refetchOrgById();
						console.log('Organization deleted successfully');
					}
				}
			);
		} catch (error) {
			console.error('Failed to delete organization:', error);
			alert('Failed to delete organization');
		}
	};

	// Load organization data into edit form
	const loadOrgForEdit = () => {
		if (orgByIdData?.data) {
			editOrgName = orgByIdData.data.organizationName || '';
			editOrgDescription = orgByIdData.data.organizationDescription || '';
			editOrgType = orgByIdData.data.organizationType || 'Native';
			editEmailId = orgByIdData.data.emailId || '';
			console.log('Loaded organization data for editing:', orgByIdData.data);
		} else {
			alert('No organization data available to load');
		}
	};

	// Edit organization
	const handleEdit = async () => {
		if (!orgId.trim()) {
			alert('Please enter an organization ID');
			return;
		}
		if (!token.trim()) {
			alert('Please enter a token');
			return;
		}
		if (!editOrgName.trim()) {
			alert('Please enter organization name');
			return;
		}
		if (!editEmailId.trim()) {
			alert('Please enter email ID');
			return;
		}

		try {
			const updatedOrg: OrganizationType = {
				_id: orgId,
				organizationName: editOrgName,
				organizationDescription: editOrgDescription,
				organizationType: editOrgType,
				emailId: editEmailId,
				createdBy: orgByIdData?.data?.createdBy || 'unknown',
				modifiedBy: 'current-user',
				createdAt: orgByIdData?.data?.createdAt || new Date(),
				modifiedAt: new Date()
			};

			await $editOrgMutation.mutateAsync(
				{ organization: updatedOrg, token },
				{
					onSuccess: () => {
						refetchAllOrgs();
						refetchOrgById();
						console.log('Organization updated successfully');
					}
				}
			);
		} catch (error) {
			console.error('Failed to update organization:', error);
			alert('Failed to update organization');
		}
	};
</script>

<div class="container mx-auto max-w-4xl p-4">
	<!-- Token Input Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Authentication</h2>
		<div class="flex gap-4">
			<input
				type="text"
				bind:value={token}
				placeholder="Enter Token"
				class="flex-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
		</div>
	</section>

	<!-- Create Organization Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Create Organization</h2>
		<button
			onclick={handleOrg}
			disabled={$createOrgMutation.isPending || !token.trim()}
			class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			{$createOrgMutation.isPending ? 'Creating...' : 'Create Org'}
		</button>
		{#if $createOrgMutation.isError}
			<p class="mt-2 text-red-500">Error: {$createOrgMutation.error?.message}</p>
		{/if}
		{#if $createOrgMutation.isSuccess}
			<p class="mt-2 text-green-500">Organization created successfully!</p>
		{/if}
	</section>

	<!-- Get All Organizations Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Get All Organizations</h2>
		<div class="mb-4 flex gap-4">
			<input
				type="text"
				bind:value={searchTerm}
				placeholder="Search Organizations"
				class="flex-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<select
				bind:value={orgType}
				class="rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="Native">Native</option>
				<option value="Metquay Integrated Service Provider"
					>Metquay Integrated Service Provider</option
				>
				<option value="Metquay Integrated Asset Owner">Metquay Integrated Asset Owner</option>
			</select>
			<button
				onclick={getOrg}
				disabled={$allOrgsQuery.isFetching || !token.trim()}
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			>
				{$allOrgsQuery.isFetching ? 'Fetching...' : 'Get Orgs'}
			</button>
		</div>
		{#if $allOrgsQuery.isLoading}
			<p>Loading organizations...</p>
		{:else if $allOrgsQuery.isError}
			<p class="text-red-500">Error: {$allOrgsQuery.error?.message}</p>
		{:else if orgsData?.organizations?.length}
			<div class="overflow-x-auto">
				<table class="min-w-full border-collapse border border-gray-300">
					<thead>
						<tr class="bg-gray-100">
							<th class="border border-gray-300 p-2 text-left">Name</th>
							<th class="border border-gray-300 p-2 text-left">Email</th>
							<th class="border border-gray-300 p-2 text-left">Type</th>
							<th class="border border-gray-300 p-2 text-left">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each orgsData.organizations as org}
							<tr>
								<td class="border border-gray-300 p-2">{org.organizationName}</td>
								<td class="border border-gray-300 p-2">{org.emailId}</td>
								<td class="border border-gray-300 p-2">{org.organizationType}</td>
								<td class="border border-gray-300 p-2">
									<button onclick={() => (orgId = org._id)} class="text-blue-600 hover:underline">
										Select
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
				<p class="mt-2">Total Organizations: {orgsData.pagination?.totalItems || 0}</p>
			</div>
		{:else}
			<p>No organizations found.</p>
		{/if}
	</section>

	<!-- Get Organization by ID Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Get Organization by ID</h2>
		<div class="mb-4 flex gap-4">
			<input
				type="text"
				bind:value={orgId}
				placeholder="Enter Organization ID"
				class="flex-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<button
				onclick={handleGetByID}
				disabled={$orgByIdQuery.isFetching || !orgId.trim() || !token.trim()}
				class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			>
				{$orgByIdQuery.isFetching ? 'Fetching...' : 'Get By ID'}
			</button>
		</div>
		{#if $orgByIdQuery.isLoading}
			<p>Loading organization...</p>
		{:else if $orgByIdQuery.isError}
			<p class="text-red-500">Error: {$orgByIdQuery.error?.message}</p>
		{:else if orgByIdData?.data}
			<div class="rounded-md border border-gray-300 p-4">
				<h3 class="font-semibold">Organization Details:</h3>
				<p>Name: {orgByIdData.data.organizationName}</p>
				<p>Email: {orgByIdData.data.emailId}</p>
				<p>Type: {orgByIdData.data.organizationType}</p>
				<p>Description: {orgByIdData.data.organizationDescription || 'N/A'}</p>
			</div>
		{:else}
			<p>No organization found for ID.</p>
		{/if}
	</section>

	<!-- Edit Organization Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Edit Organization</h2>
		{#if orgByIdData?.data}
			<div class="mb-4">
				<button
					onclick={loadOrgForEdit}
					class="rounded-md bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
				>
					Load Current Data for Editing
				</button>
			</div>
		{/if}
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
			<input
				type="text"
				bind:value={editOrgName}
				placeholder="Organization Name"
				class="rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<input
				type="email"
				bind:value={editEmailId}
				placeholder="Email ID"
				class="rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			/>
			<textarea
				bind:value={editOrgDescription}
				placeholder="Organization Description"
				class="col-span-1 rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none md:col-span-2"
				rows="3"
			></textarea>
			<select
				bind:value={editOrgType}
				class="rounded-md border p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			>
				<option value="Native">Native</option>
				<option value="Metquay Integrated Service Provider"
					>Metquay Integrated Service Provider</option
				>
				<option value="Metquay Integrated Asset Owner">Metquay Integrated Asset Owner</option>
			</select>
		</div>
		<div class="mt-4">
			<button
				onclick={handleEdit}
				disabled={$editOrgMutation.isPending ||
					!orgId.trim() ||
					!token.trim() ||
					!editOrgName.trim()}
				class="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
			>
				{$editOrgMutation.isPending ? 'Updating...' : 'Update Organization'}
			</button>
		</div>
		{#if $editOrgMutation.isError}
			<p class="mt-2 text-red-500">Error: {$editOrgMutation.error?.message}</p>
		{/if}
		{#if $editOrgMutation.isSuccess}
			<p class="mt-2 text-green-500">Organization updated successfully!</p>
		{/if}
	</section>

	<!-- Delete Organization Section -->
	<section class="mb-6">
		<h2 class="mb-2 text-xl font-semibold text-gray-800">Delete Organization</h2>
		<button
			onclick={handleDelete}
			disabled={$deleteOrgMutation.isPending || !orgId.trim() || !token.trim()}
			class="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
		>
			{$deleteOrgMutation.isPending ? 'Deleting...' : 'Delete Organization'}
		</button>
		{#if $deleteOrgMutation.isError}
			<p class="mt-2 text-red-500">Error: {$deleteOrgMutation.error?.message}</p>
		{/if}
		{#if $deleteOrgMutation.isSuccess}
			<p class="mt-2 text-green-500">Organization deleted successfully!</p>
		{/if}
	</section>
</div>
