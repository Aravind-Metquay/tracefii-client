<script lang="ts">
	import GridTable from '@/application-components/common/grid-table/grid-table.svelte';
	import Buttoncell from './buttoncell.svelte';
	import { useGetAllUsersOfAnOrg } from '@/api/queries/user-query';
	import Button from '@/components/ui/button/button.svelte';

	// 1. Updated User interface to match the API response fields EXACTLY.
	interface User {
		_id: string;
		id: string;
		firstName: string;
		emailId: string;
		lastname?: string;
	}

	let authToken = '';
	let orgId = '68a461e8d46298c3bd193fb4';
	let filters = {};

	const getAllUsersOfAnOrg = useGetAllUsersOfAnOrg(orgId, authToken, filters);

	const columns = [
		{ id: 'firstName', header: 'First Name', flexgrow: 1, sort: true },
		{ id: 'lastName', header: 'Last Name', flexgrow: 1, sort: true },

		{ id: 'emailId', header: 'Email ID', flexgrow: 1, sort: true },

		{
			id: 'actions',
			header: 'Actions',
			flexgrow: 1,
			sort: false,
			cell: Buttoncell
		}
	];

	function handleEdit(id: string) {
		// The ID is likely a string
		console.log('Edit user with ID:', id);
	}

	function handleDelete(id: string) {
		// The ID is likely a string
		console.log('Delete user with ID:', id);
	}
</script>

{#if $getAllUsersOfAnOrg.isLoading}
	<p>Loading users...</p>
{:else if $getAllUsersOfAnOrg.error}
	<p style="color: red;">Error: {$getAllUsersOfAnOrg.error.message}</p>
{:else if $getAllUsersOfAnOrg.data}
	<GridTable data={$getAllUsersOfAnOrg?.data.users || []} {columns} />
{/if}
