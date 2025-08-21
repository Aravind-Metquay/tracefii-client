<script>
	import { Button } from '../../../components/ui/button';
	import {
		Users,
		Home,
		ChevronRight,
		ChevronDown,
		ChevronLeft,
		SquarePlus,
		UserPlus,
		X,
		Plus
	} from '@lucide/svelte';
	import UsersTable from './users-table.svelte';
	let count = $state(9);
	let pageNo = $state(1);
	let userModal = $state(false);
	let workspace = $state('');
	let role=$state('');
	function handleOpenUserModal() {
		userModal = true;
	}
	function handleCloseUserModal() {
		userModal = false;
	}
</script>

<svelte:head>
	<title>Users | All users</title>
	<meta name="description" content="A Svelte page" />
</svelte:head>

<main class="flex h-full w-full flex-col">
	<div class="flex flex-col gap-2 p-2">
		<div class="ml-1 flex items-center gap-1 text-sm text-gray-600">
			<Home class="h-4 w-4 " />
			<ChevronRight class="h-4 w-4" />
			<p class="font-extralight font-medium text-black">Users</p>
		</div>

		<div class="ml-1 flex items-center justify-between">
			<div class="flex items-center gap-1">
				<Users color="#7653E5" class="h-4 w-4" />
				<p class="font-semibold">Users</p>
				<p style="color:#808080" class="mt-1 text-xs">{count}</p>
			</div>

			<div class="flex items-center">
				<input
					type="search"
					placeholder="Search users..."
					class="h-9 min-w-[175px] rounded-sm bg-[#fafafa] pl-2 text-xs
        focus:ring-1 focus:ring-[#7653E5] focus:outline-none"
				/>
				<div class="mx-2 h-4 w-[1px] bg-gray-300"></div>
				<Button size="tiny" variant="secondary">Filter</Button>
				<div class="mx-2 h-4 w-[1px] bg-gray-300"></div>
				<Button size="tiny" variant="secondary" class="min-h-2 ">
					<span class="m-1 flex">Columns <ChevronDown size="15" class="" /> </span>
				</Button>
				<div class="mx-2 h-4 w-[1px] bg-gray-300"></div>
				<Button
					size="tiny"
					variant="secondary"
					style="background-color: #7653E5; color: white;"
					onclick={handleOpenUserModal}
				>
					<span class="m-1 flex gap-1 p-1">Add New <SquarePlus size="13" /></span>
				</Button>
			</div>
		</div>
	</div>

	<div class="flex flex-1 flex-col">
		<div class="mx-2 flex-1">
			<UsersTable />
		</div>

		<div class="flex items-center justify-center gap-1 p-4">
			<Button size="tiny" variant="secondary" class="min-h-9 min-w-8 rounded-lg bg-gray-200"
				><ChevronLeft /></Button
			>
			<span
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7653E5] text-sm font-medium text-white"
			>
				{pageNo}
			</span>
			<Button size="tiny" variant="secondary" class="min-h-9 min-w-8 rounded-lg bg-gray-200"
				><ChevronRight /></Button
			>
		</div>
	</div>

{#if userModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50">
		<div
			class="flex flex-col rounded-lg bg-white shadow-2xl"
			style="width: 700px; height: 400px;"
		>
			<div class="flex items-center justify-between border-b border-gray-200 p-3">
				<div class="flex items-center gap-2">
					<UserPlus color="#7653E5" />
					<h2 class="text-xl font-semibold text-gray-800">Add New User</h2>
				</div>
				<button class="rounded-full p-1 hover:bg-gray-100" onclick={handleCloseUserModal}>
					<X />
				</button>
			</div>

			<div class="flex justify-between">
				<div class="m-3 w-[330px] rounded-xl bg-gray-50">
					<h2 class="p-1 px-2 text-sm text-gray-500">Name <span class="text-red-500">*</span></h2>
					<input
						type="text"
						placeholder="Enter first name"
						class="h-[30px] min-w-[252px] rounded-lg p-2 text-sm focus:outline-none"
					/>
				</div>
				<div class="m-3 w-[330px] rounded-xl bg-gray-50">
					<h2 class="p-1 px-2 text-sm text-gray-500">
						Last Name <span class="text-red-500">*</span>
					</h2>
					<input
						type="text"
						placeholder="Enter last name"
						class="h-[30px] min-w-[252px] rounded-lg p-2 text-sm focus:outline-none"
					/>
				</div>
			</div>

			<div class="flex justify-between">
				<div class="m-3 w-[330px] rounded-xl bg-gray-50">
					<h2 class="p-1 px-2 text-sm text-gray-500">
						Phone Number <span class="text-red-500">*</span>
					</h2>
					<input
						type="text"
						placeholder="Enter phone number"
						class="h-[30px] min-w-[252px] rounded-lg p-2 text-sm focus:outline-none"
					/>
				</div>
				<div class="m-3 w-[330px] rounded-xl bg-gray-50">
					<h2 class="p-1 px-2 text-sm text-gray-500">Email <span class="text-red-500">*</span></h2>
					<input
						type="text"
						placeholder="Enter email address"
						class="h-[30px] min-w-[252px] rounded-lg p-2 text-sm focus:outline-none"
					/>
				</div>
			</div>

			<div class="flex justify-between">
				<div>
					<h2 class="mx-4 my-2 text-sm font-semibold">Workspace and Roles</h2>
					<select
						bind:value={workspace}
						class="mx-2 h-[40px] w-[280px] rounded-lg bg-gray-50 p-2 text-sm focus:outline-none {workspace ===
						''
							? 'text-gray-500'
							: 'text-gray-800'}"
					>
						<option value="" disabled hidden>Select a Workspace</option>
						<option value="Workspace 1">Workspace 1</option>
						<option value="Workspace 2">Workspace 2</option>
						<option value="Workspace 3">Workspace 3</option>
						<option value="Workspace 4">Workspace 4</option>
					</select>
				</div>

                <div class="flex items-center pt-9">
					<select
						bind:value={role} class="mx-2 h-[40px] w-[280px] rounded-lg bg-gray-50 p-2 text-sm focus:outline-none {role ===
						''
							? 'text-gray-500'
							: 'text-gray-800'}"
					>
						<option value="" disabled hidden>Roles Empty</option>
						<option value="Role 1">Role 1</option>
						<option value="Role 2">Role 2</option>
						<option value="Role 3">Role 3</option>
						<option value="Role 4">Role 4</option>
					</select>
					<button class="rounded-md mr-2 p-2 bg-[#7653E5] text-white cursor-pointer">
						<Plus size={20} />
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
</main>


