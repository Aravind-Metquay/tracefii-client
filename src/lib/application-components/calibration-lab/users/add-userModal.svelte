<script lang="ts">
	import { UserPlus, X, Plus } from '@lucide/svelte';
	import { Button } from '../../../components/ui/button';
	import { useCreateNewUser } from '@/api/queries/user-query';
	import type { SystemRole, UserType } from '@/Types';
    import { useQueryClient } from '@tanstack/svelte-query';
	let authToken = $state(' '); 

	// Props from parent
	let { workspaceRoles = $bindable(), userModal = $bindable() } = $props<{
		workspaceRoles: { workspace: string; role: string }[];
		userModal: boolean;
	}>();
    const queryClient = useQueryClient();
	// Form state
	let orgId = $state('68a461e8d46298c3bd193fb4');
	let firstName = $state('');
	let lastName = $state('');
	let contactNumber = $state('');
	let systemrole: SystemRole = 'Admin';
	let emailId = $state('');
    let filter = $state({}); // Assuming an empty filter object for now
	// Note: Your backend should ideally handle audit fields like createdBy/At.
	// Including them here based on your previous code.
	let createdBy = $state('Adithya');
	let createdAt = $state(new Date('2025-08-21T10:25:00.000Z'));
	let modifiedAt = $state(new Date('2025-08-21T10:25:00.000Z'));
	let modifiedBy = $state('Adithya');

	const createNewUser = useCreateNewUser();

	async function handleCreateNewUser() {
		// Construct the payload right before sending to capture the latest state.
		// Note: You may need to adjust the type based on what your API mutation expects.
		const newUserPayload = {
			orgId: orgId,
			firstName: firstName,
			lastName: lastName,
			contactNumber: contactNumber,
			system_role: systemrole,
			emailId: emailId,
			createdBy: createdBy,
			createdAt: createdAt,
			modifiedAt: modifiedAt,
			modifiedBy: modifiedBy,

		};

		try {
			await $createNewUser.mutateAsync({
				userData: newUserPayload,
				token: authToken
			});
            queryClient.invalidateQueries({ queryKey: [orgId, filter] });
			alert('User created successfully!');
			userModal = false; 
		} catch (error) {
			console.error('Failed to create user:', error);
			alert('Failed to create user. Please check the console.');
		}
	}

	// --- Workspace/Role Functions ---
	function addWorkspaceRole() {
		workspaceRoles.push({ workspace: '', role: '' });
	}

	function removeWorkspaceRole(index: number) {
		if (workspaceRoles.length > 1) {
			workspaceRoles.splice(index, 1);
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
	<div class="flex max-h-[90vh] flex-col rounded-lg bg-white shadow-2xl" style="width: 700px">
		<!-- Header -->
		<div class="flex items-center justify-between border-b border-gray-200 p-3">
			<div class="flex items-center gap-2">
				<UserPlus color="#7653E5" />
				<h2 class="text-xl font-semibold text-gray-800">Add New User</h2>
			</div>
			<button class="rounded-full p-1 hover:bg-gray-100" onclick={() => (userModal = false)}>
				<X />
			</button>
		</div>

		<!-- Body with input bindings -->
		<div class="flex-1 overflow-y-auto p-3">
			<div class="flex justify-between">
				<div class="w-full rounded-xl bg-gray-50 p-2">
					<h2 class="px-2 text-sm text-gray-500">Name <span class="text-red-500">*</span></h2>
					<input
						type="text"
						bind:value={firstName}
						placeholder="Enter first name"
						class="h-[30px] w-full rounded-lg bg-transparent p-2 text-sm focus:outline-none"
					/>
				</div>
				<div class="ml-3 w-full rounded-xl bg-gray-50 p-2">
					<h2 class="px-2 text-sm text-gray-500">Last Name <span class="text-red-500">*</span></h2>
					<input
						type="text"
						bind:value={lastName}
						placeholder="Enter last name"
						class="h-[30px] w-full rounded-lg bg-transparent p-2 text-sm focus:outline-none"
					/>
				</div>
			</div>
			<div class="mt-3 flex justify-between">
				<div class="w-full rounded-xl bg-gray-50 p-2">
					<h2 class="px-2 text-sm text-gray-500">Phone Number <span class="text-red-500">*</span></h2>
					<input
						type="text"
						bind:value={contactNumber}
						placeholder="Enter phone number"
						class="h-[30px] w-full rounded-lg bg-transparent p-2 text-sm focus:outline-none"
					/>
				</div>
				<div class="ml-3 w-full rounded-xl bg-gray-50 p-2">
					<h2 class="px-2 text-sm text-gray-500">Email <span class="text-red-500">*</span></h2>
					<input
						type="text"
						bind:value={emailId}
						placeholder="Enter email address"
						class="h-[30px] w-full rounded-lg bg-transparent p-2 text-sm focus:outline-none"
					/>
				</div>
			</div>

			<!-- Dynamic Workspace/Roles Section -->
			<div class="mt-3">
				<h2 class="mx-1 my-2 text-sm font-semibold">Workspace and Roles</h2>
				{#each workspaceRoles as item, index}
					<div class="mb-2 flex items-center justify-between">
						<div class="w-full">
							<select
								bind:value={item.workspace}
								class="h-[40px] w-full rounded-lg bg-gray-50 p-2 text-sm focus:outline-none {item.workspace ===
								''
									? 'text-gray-400'
									: 'text-gray-800'}"
							>
								<option value="" disabled hidden>Select a Workspace</option>
								<option value="Workspace 1">Workspace 1</option>
								<option value="Workspace 2">Workspace 2</option>
							</select>
						</div>

						<div class="ml-3 flex w-full items-center">
							<select
								bind:value={item.role}
								class="h-[40px] w-full rounded-lg bg-gray-50 p-2 text-sm focus:outline-none {item.role ===
								''
									? 'text-gray-400'
									: 'text-gray-800'}"
							>
								<option value="" disabled hidden>Roles Empty</option>
								<option value="Role 1">Role 1</option>
								<option value="Role 2">Role 2</option>
							</select>

							{#if index === workspaceRoles.length - 1}
								<button
									class="ml-2 cursor-pointer rounded-md bg-[#7653E5] p-2 text-white"
									onclick={addWorkspaceRole}
								>
									<Plus size={20} />
								</button>
							{/if}
							{#if workspaceRoles.length > 1}
								<button
									class="ml-2 cursor-pointer rounded-md p-2 text-gray-400 hover:bg-gray-100"
									onclick={() => removeWorkspaceRole(index)}
								>
									<X size={20} />
								</button>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="flex justify-end gap-3 border-t border-gray-200 p-3">
			<Button variant="secondary" onclick={() => (userModal = false)}>Cancel</Button>
			<Button
				style="background-color: #7653E5; color: white;"
				onclick={handleCreateNewUser}
				disabled={$createNewUser.isPending}
			>
				{#if $createNewUser.isPending}
					Adding...
				{:else}
					Add User
				{/if}
			</Button>
		</div>
	</div>
</div>