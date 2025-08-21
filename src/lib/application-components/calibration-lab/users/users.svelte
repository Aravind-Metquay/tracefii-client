<script lang="ts">
	import { Button } from '../../../components/ui/button';
	import {
		Users,
		Home,
		ChevronRight,
		ChevronDown,
		ChevronLeft,
		SquarePlus
	} from '@lucide/svelte';
	import UsersTable from './users-table.svelte';

	import AddUserModal from './add-userModal.svelte';
	

	let count = $state(9);
	let pageNo = $state(1);
	let userModal = $state(false);

	
	let workspaceRoles = $state([{ workspace: '', role: '' }]);

	function handleOpenUserModal() {
		userModal = true;
	}

</script>

<svelte:head>
	<title>Users | All users</title>
	<meta name="description" content="A Svelte page" />
</svelte:head>

<main class="flex h-full w-full flex-col">
	<div class="flex flex-col gap-2 p-2">
		<div class="ml-1 flex items-center gap-1 text-sm text-gray-600">
			<Home class="h-4 w-4" />
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
					class="h-9 min-w-[175px]
rounded-sm bg-[#fafafa] pl-2 text-xs focus:ring-1 focus:ring-[#7653E5] focus:outline-none"
				/>
				<div class="mx-2 h-4 w-[1px] bg-gray-300"></div>
				<Button size="tiny" variant="secondary">Filter</Button>
				<div class="mx-2 h-4 w-[1px] bg-gray-300"></div>
				<Button size="tiny" variant="secondary" class="min-h-2">
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
			<Button size="tiny" variant="secondary" class="min-h-9 min-w-8 rounded-lg bg-gray-200">
				<ChevronLeft />
			</Button>
			<span
				class="flex h-9 w-9 items-center justify-center rounded-lg bg-[#7653E5] text-sm font-medium text-white"
			>
				{pageNo}
			</span>
			<Button size="tiny" variant="secondary" class="min-h-9 min-w-8 rounded-lg bg-gray-200">
				<ChevronRight />
			</Button>
		</div>
	</div>

	{#if userModal}
		<AddUserModal bind:workspaceRoles bind:userModal  />
	{/if}
</main>