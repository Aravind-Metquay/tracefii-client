<script lang="ts">
	import {
		useCreateNewRole,
		useGetAllRoles,
		useGetAllRolesOfOrg,
		useGetAllRolesOfAWorkspace,
		useFindRoleById,
		useEditRole,
		useDeleteRole,
		useDeleteRolesOfAnOrg
	} from '@/api/queries/role-query';

	import type { RoleType } from '@/Types';

	const token = 'dummy';

	let orgId = $state('6894f63694a3d111ddf6e999');
	let workspaceId = $state('workspace1');
	let roleId = $state('68a2aa0d106d6d78a3801807');
	
	let filter = $state<Partial<RoleType>>({}); 
	let search = $state(''); 

	let newRoleData: Omit<RoleType, '_id' | 'id' | 'createdAt' | 'modifiedAt'> = {
		get orgId() {
			return orgId;
		},
		roleName: 'New Test Role for geethika',
		roleDescription: 'A role created from the testing purpose.',
		availableWorkspaces: ['workspace1', 'workspace3'],
		permissions: ['read:data', 'write:data'],
		createdBy: 'frontend-tester'
	};

	let updateRoleData: Partial<RoleType> = {
		roleDescription: 'This description was updated at ' + new Date().toLocaleTimeString(),
		modifiedBy: 'frontend-updater geethi'
	};

	const createRoleMutation = useCreateNewRole();
	const editRoleMutation = useEditRole();
	const deleteRoleMutation = useDeleteRole();
	const deleteOrgRolesMutation = useDeleteRolesOfAnOrg();

	const allRolesQuery = $derived(useGetAllRoles(token, filter, search));
	const orgRolesQuery = $derived(useGetAllRolesOfOrg(orgId, token, filter, search));
	const workspaceRolesQuery = $derived(useGetAllRolesOfAWorkspace(orgId, workspaceId, token, filter, search));
	const findRoleByIdQuery = $derived(useFindRoleById(roleId, token));

	const handleCreateRole = (e: any) => {
		e.preventDefault();
		$createRoleMutation.mutate({ roleData: newRoleData as any, token });
	};

	const handleEditRole = (e: any) => {
		e.preventDefault();

		const roleToUpdate = { _id: roleId, ...updateRoleData } as RoleType;
		$editRoleMutation.mutate({ role: roleToUpdate, token });
	};

	const handleDeleteRole = () => {
		if (confirm(`Are you sure you want to delete role ID: ${roleId}?`)) {
			$deleteRoleMutation.mutate({ id: roleId, token });
		}
	};

	const handleDeleteOrgRoles = () => {
		if (confirm(`Are you sure you want to delete ALL roles for org ID: ${orgId}?`)) {
			$deleteOrgRolesMutation.mutate({ orgId, token });
		}
	};

	// Helper function to get roles array from response
	const getRolesArray = (data: any) => {
		return Array.isArray(data) ? data : [];
	};
</script>

<main class="container">
	<h1>Role Test</h1>
	<p>SIMPLY TO TEST WORKING...</p>
	<hr />

	<section>
		<h2>1. Create a New Role</h2>
		<p><code>POST /role</code></p>
		<form onsubmit={handleCreateRole}>
			<label>Role Name: <input type="text" bind:value={newRoleData.roleName} /></label>
			<label>Description: <input type="text" bind:value={newRoleData.roleDescription} /></label>
			<button type="submit" disabled={$createRoleMutation.isPending}>
				{#if $createRoleMutation.isPending}Creating...{:else}Create Role{/if}
			</button>
		</form>
		<div class="result-box">
			<p><b>Status:</b> {$createRoleMutation.status}</p>
			{#if $createRoleMutation.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($createRoleMutation.data, null, 2)}</pre>
			{/if}
			{#if $createRoleMutation.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($createRoleMutation.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>2. Get All Roles</h2>
		<p><code>GET /role</code></p>
		<label>Filter (Role Name): <input type="text" bind:value={filter.roleName} placeholder="Filter by role name" /></label>
		<label>Search: <input type="text" bind:value={search} placeholder="Search in all fields" /></label>
		<button onclick={() => $allRolesQuery.refetch()} disabled={$allRolesQuery.isFetching}>
			{#if $allRolesQuery.isFetching}Fetching...{:else}Fetch All Roles{/if}
		</button>
		<div class="result-box">
			<p><b>Status:</b> {$allRolesQuery.status}</p>
			{#if $allRolesQuery.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($allRolesQuery.data, null, 2)}</pre>
			{/if}
			{#if $allRolesQuery.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($allRolesQuery.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>3. Get All Roles of an Organization</h2>
		<p><code>GET /role/organization/{orgId}</code></p>
		<label>Organization ID: <input type="text" bind:value={orgId} /></label>
		<label>Filter (Role Name): <input type="text" bind:value={filter.roleName} placeholder="Filter by role name" /></label>
		<label>Search: <input type="text" bind:value={search} placeholder="Search in all fields" /></label>
		<button onclick={() => $orgRolesQuery.refetch()} disabled={$orgRolesQuery.isFetching}>
			{#if $orgRolesQuery.isFetching}Fetching...{:else}Fetch Org Roles{/if}
		</button>
		<div class="result-box">
			<p><b>Status:</b> {$orgRolesQuery.status}</p>
			{#if $orgRolesQuery.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($orgRolesQuery.data, null, 2)}</pre>
			{/if}
			{#if $orgRolesQuery.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($orgRolesQuery.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>4. Get All Roles of a Workspace</h2>
		<p><code>GET /role/organization/{orgId}/workspace/{workspaceId}</code></p>
		<label>Org ID: <input type="text" bind:value={orgId} /></label>
		<label>Workspace ID: <input type="text" bind:value={workspaceId} /></label>
		<label>Filter (Role Name): <input type="text" bind:value={filter.roleName} placeholder="Filter by role name" /></label>
		<label>Search: <input type="text" bind:value={search} placeholder="Search in all fields" /></label>
		<button onclick={() => $workspaceRolesQuery.refetch()} disabled={$workspaceRolesQuery.isFetching}>
			{#if $workspaceRolesQuery.isFetching}Fetching...{:else}Fetch Workspace Roles{/if}
		</button>
		<div class="result-box">
			<p><b>Status:</b> {$workspaceRolesQuery.status}</p>
			{#if $workspaceRolesQuery.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($workspaceRolesQuery.data, null, 2)}</pre>
			{/if}
			{#if $workspaceRolesQuery.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($workspaceRolesQuery.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>5. Find Role by ID</h2>
		<p><code>GET /role/{roleId}</code></p>
		<label>Role ID: <input type="text" bind:value={roleId} /></label>
		<button onclick={() => $findRoleByIdQuery.refetch()} disabled={$findRoleByIdQuery.isFetching}>
			{#if $findRoleByIdQuery.isFetching}Fetching...{:else}Find Role{/if}
		</button>

		<div class="result-box">
			<p><b>Status:</b> {$findRoleByIdQuery.status}</p>

			{#if $findRoleByIdQuery.isFetching}
				<p>Fetching...</p>
			{/if}

			{#if $findRoleByIdQuery.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($findRoleByIdQuery.data, null, 2)}</pre>
			{/if}

			{#if $findRoleByIdQuery.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($findRoleByIdQuery.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>6. Edit a Role</h2>
		<p><code>PATCH /role/{roleId}</code></p>
		<form onsubmit={handleEditRole}>
			<label>Role ID to Update: <input type="text" bind:value={roleId} /></label>
			<label>
				New Description: <input type="text" bind:value={updateRoleData.roleDescription} />
			</label>
			<button type="submit" disabled={$editRoleMutation.isPending}>
				{#if $editRoleMutation.isPending}Updating...{:else}Update Role{/if}
			</button>
		</form>
		<div class="result-box">
			<p><b>Status:</b> {$editRoleMutation.status}</p>
			{#if $editRoleMutation.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($editRoleMutation.data, null, 2)}</pre>
			{/if}
			{#if $editRoleMutation.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($editRoleMutation.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>7. Delete a Role</h2>
		<p><code>DELETE /role/{roleId}</code></p>
		<label>Role ID to Delete: <input type="text" bind:value={roleId} /></label>
		<button class="danger" onclick={handleDeleteRole} disabled={$deleteRoleMutation.isPending}>
			{#if $deleteRoleMutation.isPending}Deleting...{:else}Delete Role{/if}
		</button>
		<div class="result-box">
			<p><b>Status:</b> {$deleteRoleMutation.status}</p>
			{#if $deleteRoleMutation.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($deleteRoleMutation.data, null, 2)}</pre>
			{/if}
			{#if $deleteRoleMutation.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($deleteRoleMutation.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
	<hr />

	<section>
		<h2>8. Delete All Roles of an Organization</h2>
		<p><code>DELETE /role/organization/{orgId}</code></p>
		<label>Org ID to Clear: <input type="text" bind:value={orgId} /></label>
		<button
			class="danger"
			onclick={handleDeleteOrgRoles}
			disabled={$deleteOrgRolesMutation.isPending}
		>
			{#if $deleteOrgRolesMutation.isPending}Deleting...{:else}Delete All Org Roles{/if}
		</button>
		<div class="result-box">
			<p><b>Status:</b> {$deleteOrgRolesMutation.status}</p>
			{#if $deleteOrgRolesMutation.data}
				<p><b>Data:</b></p>
				<pre>{JSON.stringify($deleteOrgRolesMutation.data, null, 2)}</pre>
			{/if}
			{#if $deleteOrgRolesMutation.error}
				<p class="error"><b>Error:</b></p>
				<pre class="error">{JSON.stringify($deleteOrgRolesMutation.error, null, 2)}</pre>
			{/if}
		</div>
	</section>
</main>

<style>

.container {
    font-family: sans-serif;
    max-width: 800px;
    margin: 2rem auto;
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
}
section {
    margin-bottom: 2rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 4px;
}
hr {
    border: 0;
    height: 1px;
    background-color: #eee;
    margin: 2rem 0;
}
label {
    display: block;
    margin-bottom: 0.5rem;
}
input {
    width: 100%;
    padding: 8px;
    box-sizing: border-box;
    margin-bottom: 1rem;
}
button {
    padding: 10px 15px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 0.5rem;
}
button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}
button.danger {
    background-color: #dc3545;
}


.result-box {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 4px;
    border: 1px solid #e9e9e9;
}
pre {
    background-color: #333;
    color: #fff;
    padding: 1rem;
    border-radius: 4px;
    white-space: pre-wrap;
    word-wrap: break-word;
}
.error {
    color: #dc3545;
}
pre.error {
    background-color: #ffcccc;
    color: #333;
}
</style>