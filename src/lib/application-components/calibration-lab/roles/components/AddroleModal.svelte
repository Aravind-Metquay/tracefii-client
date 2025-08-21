<script lang="ts">
	import type { RoleType } from '@/Types';
	import { X, ChevronDown } from '@lucide/svelte';

	
	interface Props {
		showModal: boolean;
		onSave: (roleData: RoleFormData) => void;
		onCancel: () => void;
		editingRole?: RoleType | null;
		isLoading?: boolean;
		availableWorkspacesList?: { id: string; name: string }[];
	}

	interface RoleFormData {
		name: string;
		description: string;
		availableWorkspaces: string[];
		permissions: string[];
	}

	
	interface PermissionState {
		screen: string;
		all: boolean;
		view: boolean;
		add: boolean;
		edit: boolean;
		delete: boolean;
	}

	let {
		showModal,
		onSave,
		onCancel,
		editingRole = null,
		isLoading = false,
		availableWorkspacesList = []
	}: Props = $props();

	// Workspace dropdown state
	let showWorkspaceDropdown = $state(false);
	let selectedWorkspaces = $state<{id: string, name: string}[]>([]);

	

	const screens = [
		{ name: 'Users', permissions: ['View', 'Add', 'Edit', 'Delete'] },
		{ name: 'Workspaces', permissions: ['View', 'Add', 'Edit', 'Delete'] },
		{ name: 'Roles', permissions: ['View', 'Add', 'Edit', 'Delete'] },
		{ name: 'Worksheets', permissions: ['View', 'Add', 'Edit', 'Delete'] },
		{ name: 'Customers', permissions: ['View', 'Add', 'Edit', 'Delete'] }
	];

	let permissionState = $state<PermissionState[]>(
		screens.map((s) => ({
			screen: s.name,
			all: false,
			view: false,
			add: false,
			edit: false,
			delete: false
		}))
	);

	let roleData = $state<RoleFormData>({
		name: '',
		description: '',
		availableWorkspaces: [],
		permissions: []
	});

	let formErrors = $state({
		name: '',
		workspaces: ''
	});

	$effect(() => {
		if (editingRole) {
			roleData.name = editingRole.roleName || '';
			roleData.description = editingRole.roleDescription || '';
			roleData.availableWorkspaces = editingRole.availableWorkspaces || [];
			roleData.permissions = editingRole.permissions || [];

			
			selectedWorkspaces = availableWorkspacesList.filter(ws => 
				roleData.availableWorkspaces.includes(ws.id)
			);

			permissionState.forEach((state) => {
				const permissions = editingRole.permissions || [];
				state.view = permissions.includes(`view:${state.screen.toLowerCase()}`);
				state.add = permissions.includes(`add:${state.screen.toLowerCase()}`);
				state.edit = permissions.includes(`edit:${state.screen.toLowerCase()}`);
				state.delete = permissions.includes(`delete:${state.screen.toLowerCase()}`);
				updateParentCheckbox(state.screen);
			});
		} else {
			resetForm();
		}
	});

	$effect(() => {
		const newPermissions: string[] = [];
		permissionState.forEach((state) => {
			if (state.view) newPermissions.push(`view:${state.screen.toLowerCase()}`);
			if (state.add) newPermissions.push(`add:${state.screen.toLowerCase()}`);
			if (state.edit) newPermissions.push(`edit:${state.screen.toLowerCase()}`);
			if (state.delete) newPermissions.push(`delete:${state.screen.toLowerCase()}`);
		});
		roleData.permissions = newPermissions;
	});

	
	$effect(() => {
		roleData.availableWorkspaces = selectedWorkspaces.map(ws => ws.id);
	});

	function resetForm() {
		roleData.name = '';
		roleData.description = '';
		roleData.availableWorkspaces = [];
		roleData.permissions = [];
		selectedWorkspaces = [];
		formErrors.name = '';
		formErrors.workspaces = '';
		showWorkspaceDropdown = false;
		permissionState.forEach((state) => {
			state.all = false;
			state.view = false;
			state.add = false;
			state.edit = false;
			state.delete = false;
		});
	}

	function validateForm(): boolean {
		let isValid = true;
		if (!roleData.name.trim()) {
			formErrors.name = 'Role name is required';
			isValid = false;
		} else {
			formErrors.name = '';
		}

		if (roleData.availableWorkspaces.length === 0) {
			formErrors.workspaces = 'At least one workspace must be selected';
			isValid = false;
		} else {
			formErrors.workspaces = '';
		}
		return isValid;
	}

	function handleSave(event: Event) {
		event.preventDefault();
		if (validateForm()) {
			onSave({ ...roleData });
		}
	}

	function handleCancel() {
		resetForm();
		onCancel();
	}

	function toggleAllPermissions(screenName: string, isChecked: boolean) {
		const screen = permissionState.find((s) => s.screen === screenName);
		if (screen) {
			screen.all = isChecked;
			screen.view = isChecked;
			screen.add = isChecked;
			screen.edit = isChecked;
			screen.delete = isChecked;
		}
	}

	function updateParentCheckbox(screenName: string) {
		const screen = permissionState.find((s) => s.screen === screenName);
		if (screen) {
			screen.all = screen.view && screen.add && screen.edit && screen.delete;
		}
	}

	function toggleWorkspace(workspace: {id: string, name: string}) {
		const index = selectedWorkspaces.findIndex(ws => ws.id === workspace.id);
		if (index > -1) {
			selectedWorkspaces = selectedWorkspaces.filter(ws => ws.id !== workspace.id);
		} else {
			selectedWorkspaces = [...selectedWorkspaces, workspace];
		}
	}

	function removeWorkspace(workspaceId: string) {
		selectedWorkspaces = selectedWorkspaces.filter(ws => ws.id !== workspaceId);
	}
</script>

{#if showModal}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center p-4"
		style="background-color: rgba(0, 0, 0, 0.5);"
		onclick={handleCancel}
		role="dialog"
		tabindex="0"
		aria-modal="true"
		aria-labelledby="modal-title"
	>
		<div
			class="relative w-full max-w-3xl rounded-xl bg-white shadow-xl max-h-[90vh] flex flex-col"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between p-6 border-b border-gray-200">
				<h3 id="modal-title" class="text-xl font-semibold text-gray-900">
					{editingRole ? 'Edit Role' : 'Add New Role'}
				</h3>
				<button
					onclick={handleCancel}
					class="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
					aria-label="Close modal"
					disabled={isLoading}
				>
					<X class="w-6 h-6" />
				</button>
			</div>

			<div class="flex-grow p-6 overflow-y-auto">
				<form id="role-form" onsubmit={handleSave} novalidate>
					<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label for="roleName" class="block mb-2 text-sm font-medium text-gray-700">
								Role Name <span class="text-red-500">*</span>
							</label>
							<input
								type="text"
								id="roleName"
								bind:value={roleData.name}
								class="w-full px-3 py-2 border rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 border-purple-500"
								class:border-red-500={formErrors.name}
								placeholder="Enter role name"
								required
								disabled={isLoading}
							/>
							{#if formErrors.name}
								<p class="mt-1 text-sm text-red-600">{formErrors.name}</p>
							{/if}
						</div>

						<!-- FOR WORKSPACE DROPDOWN -->
						<div class="relative">
							<label class="block mb-2 text-sm font-medium text-gray-700">
								Workspaces <span class="text-red-500">*</span>
							</label>
							<div class="relative">
								<button
									type="button"
									onclick={() => showWorkspaceDropdown = !showWorkspaceDropdown}
									class="w-full px-3 py-2 border rounded-md shadow-sm focus:border-purple-500 focus:ring-purple-500 text-left flex items-center justify-between"
									class:border-red-500={formErrors.workspaces}
									disabled={isLoading}
								>
									<span class="text-gray-500">
										{selectedWorkspaces.length > 0 
											? `${selectedWorkspaces.length} workspace(s) selected` 
											: 'Select workspaces'}
									</span>
									<ChevronDown class="w-5 h-5 text-gray-400" />
								</button>
								
								{#if showWorkspaceDropdown}
									<div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
										{#each availableWorkspacesList as workspace}
											<label class="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
												<input
													type="checkbox"
													checked={selectedWorkspaces.some(ws => ws.id === workspace.id)}
													onchange={() => toggleWorkspace(workspace)}
													class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
												/>
												<span class="ml-2 text-sm text-gray-900">{workspace.name}</span>
											</label>
										{/each}
									</div>
								{/if}
							</div>
							
							<!-- Selected workspaces tags -->
							{#if selectedWorkspaces.length > 0}
								<div class="flex flex-wrap gap-2 mt-2">
									{#each selectedWorkspaces as workspace}
										<span class="inline-flex items-center px-2 py-1 text-xs font-medium text-purple-700 bg-purple-100 rounded-full">
											{workspace.name}
											<button
												type="button"
												onclick={() => removeWorkspace(workspace.id)}
												class="ml-1 text-purple-500 hover:text-purple-700"
											>
												<X class="w-3 h-3" />
											</button>
										</span>
									{/each}
								</div>
							{/if}
							
							{#if formErrors.workspaces}
								<p class="mt-1 text-sm text-red-600">{formErrors.workspaces}</p>
							{/if}
						</div>

						<div class="md:col-span-2">
							<label for="roleDescription" class="block mb-2 text-sm font-medium text-gray-700">
								Role Description
							</label>
							<textarea
								id="roleDescription"
								bind:value={roleData.description}
								rows="3"
								class="w-full px-3 py-2 border rounded-md shadow-sm resize-non border-purple-500"
								placeholder="Enter a description for the role"
								disabled={isLoading}
							></textarea>
						</div>
					</div>

					<!-- SCREENS AND ITS PERMSIIONS -->
					<div class="mt-8">
						<h4 class="text-base font-semibold text-gray-800">Screens and Permissions</h4>
						<div class="p-5 mt-4 space-y-6 border border-gray-200 rounded-lg bg-gray-50/50">
							{#each permissionState as screen}
								<div class="space-y-3">
									<!-- Screen name with "All" checkbox -->
									<div class="flex items-center">
										<input
											type="checkbox"
											id={`screen-${screen.screen}`}
											bind:checked={screen.all}
											onchange={(e) => toggleAllPermissions(screen.screen, e.currentTarget.checked)}
											class="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
										/>
										<label for={`screen-${screen.screen}`} class="ml-3 font-medium text-gray-700">
											{screen.screen}
										</label>
									</div>
									
									<!-- Permission checkboxes on the next line -->
									<div class="ml-8 flex flex-wrap gap-6">
										<div class="flex items-center">
											<input
												type="checkbox"
												id={`${screen.screen}-view`}
												bind:checked={screen.view}
												onchange={() => updateParentCheckbox(screen.screen)}
												class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<label for={`${screen.screen}-view`} class="ml-2 text-sm text-gray-600">
												View
											</label>
										</div>
										<div class="flex items-center">
											<input
												type="checkbox"
												id={`${screen.screen}-add`}
												bind:checked={screen.add}
												onchange={() => updateParentCheckbox(screen.screen)}
												class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<label for={`${screen.screen}-add`} class="ml-2 text-sm text-gray-600">
												Add
											</label>
										</div>
										<div class="flex items-center">
											<input
												type="checkbox"
												id={`${screen.screen}-edit`}
												bind:checked={screen.edit}
												onchange={() => updateParentCheckbox(screen.screen)}
												class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<label for={`${screen.screen}-edit`} class="ml-2 text-sm text-gray-600">
												Edit
											</label>
										</div>
										<div class="flex items-center">
											<input
												type="checkbox"
												id={`${screen.screen}-delete`}
												bind:checked={screen.delete}
												onchange={() => updateParentCheckbox(screen.screen)}
												class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<label for={`${screen.screen}-delete`} class="ml-2 text-sm text-gray-600">
												Delete
											</label>
										</div>
									</div>
								</div>
							{/each}
						</div>
					</div>
				</form>
			</div>

			<!-- BUTTONS -->
			<div class="flex justify-end p-6 space-x-4 bg-gray-50 border-t border-gray-200">
				<button
					type="button"
					onclick={handleCancel}
					class="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
					disabled={isLoading}
				>
					Cancel
				</button>
				<button
					type="submit"
					form="role-form"
					class="px-5 py-2 text-sm font-semibold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
					disabled={isLoading || !!formErrors.name || !!formErrors.workspaces}
				>
					{isLoading ? 'Saving...' : editingRole ? 'Update Role' : 'Create Role'}
				</button>
			</div>
		</div>
	</div>
{/if}