<script lang="ts">
	import Modal from './components/AddroleModal.svelte';
	import {
		Search,
		ChevronDown,
		Plus,
		ChevronsRight,
		Home,
       User,
		ChevronLeft,
		ChevronRight
	} from '@lucide/svelte';
	//@ts-ignore
	import { Grid, type Column } from 'wx-svelte-grid';
	import GridActions from './components/GridActions.svelte';
	import {
		useCreateNewRole,
		useGetAllRoles,
		useGetAllRolesOfOrg,
		useEditRole,
		useDeleteRole
	} from '@/api/queries/role-query';
	import { useGetAllWorkspacesOfOrg } from '@/api/queries/workspace-query';
	import type { RoleType, WorkspaceType } from '@/Types';

	// Helper function to close dropdown when clicking outside
	function clickOutside(node: HTMLElement) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node) && !event.defaultPrevented) {
				isColumnsDropdownOpen = false;
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	const token = 'dummy';
	const orgId = '6894f63694a3d111ddf6e999';

	let showModal = $state(false);
	let editingRole = $state<RoleType | null>(null);
	let searchTerm = $state('');
	let filter = $state<Partial<RoleType>>({});

	// API queries and mutations
	const createRoleMutation = useCreateNewRole();
	const editRoleMutation = useEditRole();
	const deleteRoleMutation = useDeleteRole();

	// Fetch roles from API
	const rolesQuery = $derived(useGetAllRoles(token, filter, searchTerm));

	
	const workspacesQuery = $derived(useGetAllWorkspacesOfOrg(orgId, token));

	
	let roles = $derived(() => {
		if (!$rolesQuery.data) return [];
		const apiRoles = Array.isArray($rolesQuery.data) ? $rolesQuery.data : [];
		return apiRoles.map((role: RoleType) => ({
			id: role._id || role.id,
			name: role.roleName || '',
			description: role.roleDescription || '',
			createdBy: role.createdBy || '',
			createdAt: role.createdAt || '',
			modifiedBy: role.modifiedBy || '',
			modifiedAt: role.modifiedAt || '',
			permissions: role.permissions || [],
			availableWorkspaces: role.availableWorkspaces || [],
			orgId: role.orgId
		}));
	});

	let allWorkspaces = $derived(() => {
		if (!$workspacesQuery.data) return [];
		if (typeof $workspacesQuery.data === 'object' && 'Workspaces' in $workspacesQuery.data) {
			const apiResponse = $workspacesQuery.data as { Workspaces: WorkspaceType[] };
			return apiResponse.Workspaces.map((ws: WorkspaceType) => ({
				id: ws.id || ws._id || '',
				name: ws.workspaceName || 'Unnamed Workspace'
			})).filter((workspace) => workspace.id !== '');
		} else if (Array.isArray($workspacesQuery.data)) {
			return $workspacesQuery.data
				.map((ws: WorkspaceType) => ({
					id: ws.id || ws._id || '',
					name: ws.workspaceName || 'Unnamed Workspace'
				}))
				.filter((workspace) => workspace.id !== '');
		}
		return [];
	});

	
	let isColumnsDropdownOpen = $state(false);

	function onEditRole(roleId: string) {
		const role = roles().find((r) => r.id === roleId);
		if (role) {
			const apiRoles = Array.isArray($rolesQuery.data) ? $rolesQuery.data : [];
			editingRole = apiRoles.find((r: RoleType) => (r._id || r.id) === roleId) || null;
			showModal = true;
		} else {
			console.error('Role not found with ID:', roleId);
			alert('Role not found');
		}
	}

	function onDeleteRole(roleId: string) {
		if (confirm('Are you sure you want to delete this role?')) {
			$deleteRoleMutation.mutate(
				{ id: roleId, token },
				{
					onSuccess: () => {
						$rolesQuery.refetch(); // Refresh the list
					},
					onError: (error) => {
						console.error('Error deleting role:', error);
						alert('Failed to delete role. Please try again.');
					}
				}
			);
		}
	}

	$effect(() => {
		if (typeof window !== 'undefined') {
			(window as any).onEditRole = onEditRole;
			(window as any).onDeleteRole = onDeleteRole;
		}
	});

	
	let allColumns = $state([
		{ id: 'name', title: 'Role Name', prop: 'name', visible: true, flexgrow: 1 },
		{ id: 'description', title: 'Description', prop: 'description', visible: true, flexgrow: 1 },
		{ id: 'createdBy', title: 'Created By', prop: 'createdBy', visible: true, flexgrow: 1 },
		{ id: 'createdAt', title: 'Created At', prop: 'createdAt', visible: false, type: 'date', flexgrow: 1 },
		{ id: 'modifiedBy', title: 'Modified By', prop: 'modifiedBy', visible: false, flexgrow: 1 },
		{ id: 'modifiedAt', title: 'Modified At', prop: 'modifiedAt', visible: false, type: 'date', flexgrow: 1 },
		{
			id: 'actions',
			title: 'Actions',
			prop: 'id',
			visible: true,
			sortable: false,
			resizable: false,
			cell: GridActions,
			flexgrow: 1
		}
	]);

	
	let visibleColumns = $derived(
		allColumns
			.filter((c) => c.visible)
			.map(({ visible, ...col }) => ({
				...col,
				header: col.title || col.id
			}))
	);

	// Grid sizes configuration
	let sizes = $state({
		rowHeight: 48,
		headerHeight: 44
	});

	function toggleDropdown() {
		isColumnsDropdownOpen = !isColumnsDropdownOpen;
	}

	function openModal() {
		editingRole = null;
		showModal = true;
	}

	function closeModal() {
		showModal = false;
		editingRole = null;
	}

	function handleAddRole(newRoleData: any) {
		const roleData: Omit<RoleType, '_id' | 'id' | 'createdAt' | 'modifiedAt'> = {
			orgId: orgId,
			roleName: newRoleData.name,
			roleDescription: newRoleData.description,
			availableWorkspaces: newRoleData.availableWorkspaces || [],
			permissions: newRoleData.permissions || [],
			createdBy: 'frontend-user'
		};
		$createRoleMutation.mutate(
			{ roleData: roleData as any, token },
			{
				onSuccess: () => {
					closeModal();
					$rolesQuery.refetch();
				},
				onError: (error) => {
					console.error('Error creating role:', error);
					alert('Failed to create role. Please try again.');
				}
			}
		);
	}

	function handleEditRole(roleData: any) {
		if (!editingRole) return;
		const updateData: Partial<RoleType> = {
			_id: editingRole._id || editingRole.id,
			roleName: roleData.name,
			roleDescription: roleData.description,
			availableWorkspaces: roleData.availableWorkspaces || editingRole.availableWorkspaces,
			permissions: roleData.permissions || editingRole.permissions,
			modifiedBy: 'frontend-user'
		};
		$editRoleMutation.mutate(
			{ role: updateData as RoleType, token },
			{
				onSuccess: () => {
					closeModal();
					$rolesQuery.refetch();
				},
				onError: (error) => {
					console.error('Error updating role:', error);
					alert('Failed to update role. Please try again.');
				}
			}
		);
	}

	function handleSaveRole(roleData: any) {
		if (editingRole) {
			handleEditRole(roleData);
		} else {
			handleAddRole(roleData);
		}
	}

	function handleSearch(event: Event) {
		const target = event.target as HTMLInputElement;
		searchTerm = target.value;
	}
</script>

<style>
	.grid-container {
		width: 100% !important;
		height: 100% !important;
		--wx-table-header-background: #f9fafb;
		--wx-table-cell-border: 1px solid #e5e7eb;
		--wx-table-border: 1px solid #e5e7eb;
		--wx-table-header-border: 1px solid #e5e7eb;
		--wx-table-header-cell-border: 1px solid #e5e7eb;
		--wx-header-font-weight: 600;
	}

	.grid-container :global(.wx-grid) {
		overflow: hidden !important;
		height: 100% !important;
		width: 100% !important;
	}

	.grid-container :global(.wx-scroll) {
		overflow: auto !important;
		width: 100% !important;
		height: 100% !important;
	}

	.grid-container :global(.wx-table-box) {
		overflow: hidden !important;
		scrollbar-width: none;
		-ms-overflow-style: none;
		width: 100% !important;
		height: 100% !important;
	}

	.grid-container :global(.wx-table-box::-webkit-scrollbar) {
		display: none;
	}
</style>

<div class="flex h-screen flex-col bg-gray-50 p-4 font-sans sm:p-6 lg:p-8">
	
		<div class="mb-6 flex-shrink-0">
			<div class="mb-4 flex items-center gap-2 text-sm text-gray-500">
				<Home class="size-4 text-purple-500" />
				<ChevronsRight class="size-4 text-gray-400" />
				<span>Roles</span>
			</div>

         <div class="flex flex-row justify-between">
              <div>
            	<h1 class="flex items-center gap-3 text-xl font-bold text-gray-800">
					Roles
					<span
						class="flex size-6 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600"
						>{roles().length}</span
					>
         </div>


         	<div class="flex items-center gap-2">
					<div class="relative">
						<Search class="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
						<input
							type="text"
							placeholder="Search roles..."
							value={searchTerm}
							oninput={handleSearch}
							class="w-48 rounded-md border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-purple-500 focus:ring-purple-500"
						/>
					</div>

					<div class="relative">
						<button
							onclick={toggleDropdown}
							class="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						>
							Columns
							<ChevronDown class="size-4" />
						</button>

						{#if isColumnsDropdownOpen}
							<div
								use:clickOutside
								class="absolute right-0 top-full z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
							>
								<div class="p-2">
									<div class="px-2 py-1 text-xs font-semibold text-gray-400">
										Visible Columns
									</div>
									{#each allColumns.filter((c) => c.title) as col, i (col.id)}
										<label
											class="flex w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
										>
											<input
												type="checkbox"
												class="size-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
												bind:checked={col.visible}
											/>
											{col.title}
										</label>
									{/each}
								</div>
							</div>
						{/if}
					</div>

					<button
						onclick={openModal}
						class="flex items-center gap-2 rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-700"
						disabled={$createRoleMutation.isPending}
					>
						<Plus class="size-5" />
						{$createRoleMutation.isPending ? 'Adding...' : 'Add New'}
					</button>
				</div>

         </div>
          


			
			</div>

         
		
            

		<div class="flex flex-grow flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm min-h-0">
			{#if $rolesQuery.isFetching}
				<div class="flex flex-grow items-center justify-center text-gray-500">
					Loading roles...
				</div>
			{:else if $rolesQuery.error}
				<div class="flex flex-grow items-center justify-center text-red-500">
					Error loading roles: {$rolesQuery.error.message || 'Unknown error'}
				</div>
			{:else}
				<div class="grid-container flex-grow w-full text-sm font-normal">
               {#key $rolesQuery.data ? $rolesQuery.data.length : 0}
                  <Grid
                     columns={visibleColumns}
                     data={roles()}
                     theme="willow"
                     rowHover={true}
                     fixedHeader={true}
                     sizes={sizes}
                     onEditRole={onEditRole}
                     onDeleteRole={onDeleteRole}
                  />
               {/key}
					{#key visibleColumns.length + roles().length}
						<Grid
							columns={visibleColumns}
							data={roles()}
							theme="willow"
							rowHover={true}
							fixedHeader={true}
							sizes={sizes}
						/>
					{/key}
				</div>

				{#if roles().length === 0}
					<div class="flex flex-grow items-center justify-center text-gray-500">
						No roles found
					</div>
				{/if}
			{/if}
		</div>
	

	<div class="flex items-center justify-between pt-4 flex-shrink-0">
		<div class="flex items-center gap-2">
			<button class="rounded p-1.5 hover:bg-gray-200 disabled:opacity-50" disabled>
				<ChevronLeft class="size-5 text-gray-600" />
			</button>
			<button class="rounded p-1.5 hover:bg-gray-200">
				<ChevronRight class="size-5 text-gray-600" />
			</button>
		</div>
		<div class="text-sm text-gray-600">
			Rows per page:
			<select
				class="ml-1 rounded-md border-gray-300 text-sm focus:border-purple-500 focus:ring-purple-500"
			>
				<option>10</option>
				<option>20</option>
				<option>50</option>
			</select>
		</div>
	</div>
</div>

<Modal
	{showModal}
	onSave={handleSaveRole}
	onCancel={closeModal}
	editingRole={editingRole}
	isLoading={$createRoleMutation.isPending || $editRoleMutation.isPending}
	availableWorkspacesList={allWorkspaces()}
/>