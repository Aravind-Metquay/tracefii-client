<script lang="ts">
	import { useGetAllCustomers } from '@/api/queries/customer-query';

	import Button from '@/components/button/button.svelte';
	import Tooltip from '@/components/tooltip/tooltip.svelte';
	import { Building2, EllipsisVertical, Info } from '@lucide/svelte';
	import Customertable from '@/application-components/calibration-lab/customers/customer-table.svelte';
	import Sort from '@/components/sort/sort.svelte';
	import Filter from '@/components/Filter/filter.svelte';

    interface QueryCustomer {
		 sort: string;
		 search: string;
		 page: number;
		 limit: number;
		 [key: string]: { value: string; operator: string } | string | number | boolean;
    }
	let selectedAttributesString = $state<string>('');
	let filterObject = $state({});
	let searchValue = $state('');

	let queryCustomer = $derived({
		sort: selectedAttributesString,
		search: searchValue,
		page: 1,
		limit: 10,
	    ...filterObject
	}) as QueryCustomer;
	const token = '1123';


    let customersQuery = $derived.by(()=>{
        return useGetAllCustomers(token , queryCustomer)
    })

	const attributes = [
		{ id: 'customerName', header: 'Customer Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'customerEmail', header: 'Email ID', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'createdAt', header: 'Created At', width: 80, sort: true, editor: 'text' },
		{ id: 'workspaceId', header: 'Workspace ID', flexgrow: 1, sort: true, editor: 'text' }
	];

	let columns = [
		{ key: 'customerName', label: 'Name', type: 'string' },
		{ key: 'customerEmail', label: 'Email', type: 'string' },
		{ key: 'createdAt', label: 'Created At', type: 'number' },
		{ key: 'workspaceId', label: 'Workspace ID', type: 'string' }
	];

	let stringOperators = [
		{ value: 'contains', label: 'contains' },
		{ value: 'notContains', label: 'does not contain' },
		{ value: 'startsWith', label: 'starts with' },
		{ value: 'endsWith', label: 'ends with' },
		{ value: 'is', label: 'is' },
		{ value: 'isNot', label: 'is not' },
		{ value: 'empty', label: 'is empty' },
		{ value: 'notEmpty', label: 'is not empty' }
	];

	let numberOperators = [
		{ value: 'is', label: 'is' },
		{ value: 'isNot', label: 'is not' },
		{ value: 'lessThan', label: 'less than' },
		{ value: 'greaterThan', label: 'greater than' },
		{ value: 'empty', label: 'is empty' },
		{ value: 'notEmpty', label: 'is not empty' }
	];
</script>

<svelte:head>
	<title>Customers | All customers</title>
	<meta name="description" content="A Svelte page" />
</svelte:head>

<main class="h-full w-full">
	<div class="flex items-center justify-between border-b p-2">
		<div class="flex items-center gap-2 p-2">
			<Building2 size="16" />
			<p class="font-semibold">Customers</p>
			<Tooltip position="right" text="View all your customers here">
				<Info size="12" />
			</Tooltip>
		</div>
		<div>
			<Button variant="secondary" size="tiny">
				<EllipsisVertical size="16" />
			</Button>
		</div>
	</div>
	<div class="flex h-8 items-center">
		<input
			bind:value={searchValue}
			type="search"
			class="m-1 h-6 min-w-[240px] items-center rounded-sm bg-[#fafafa] pl-2 text-xs"
		/>
		<div class="m-1 h-4 w-[1px] bg-gray-300"></div>
		<Sort {attributes} bind:selectedAttributesString />
		<div class="m-1 h-4 w-[1px] bg-gray-300"></div>
		<Filter {columns} bind:filterObject {stringOperators} {numberOperators} />
	</div>
    {$customersQuery.data}
	<div>
		<Customertable  />
	</div>
</main>