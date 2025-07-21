<script lang="ts">
	import { createRawSnippet } from 'svelte';
	import type { ColumnConfig } from '@/application-components/common/data-table/types';
	import SimpleTable from '@/application-components/common/data-table/simple-table.svelte';
	import { goto } from '$app/navigation';

	const mailtoSnippet = createRawSnippet<[string]>((email) => {
		const emailAddress = email();
		return {
			render: () => `<a href="mailto:${emailAddress}">${emailAddress}</a>`
		};
	});

	type User = {
		name: string;
		email: string;
		age: number;
		phone: string;
	};

	const columns: ColumnConfig<User>[] = [
		{
			id: 'name',
			header: { snippet: headerSnippet, value: 'Name' },
			cellRenderer: strongSnippet
		},
		{
			id: 'email',
			header: 'Email Address',
			cellRenderer: mailtoSnippet
			// cellRenderer: {
			// 	component: CustomCell,
			// 	props: { showIcon: true } // Optional static props
			// }
		},
		{ id: 'age', header: 'Age' },
		{ id: 'phone', header: 'Phone' }
	];

	const users: User[] = [
		{
			name: 'Alice Johnson',
			email: 'alice.johnson@example.com',
			age: 28,
			phone: '555-123-4567'
		},
		{
			name: 'Brian Smith',
			email: 'brian.smith@example.com',
			age: 35,
			phone: '555-234-5678'
		},
		{
			name: 'Catherine Lee',
			email: 'catherine.lee@example.com',
			age: 22,
			phone: '555-345-6789'
		},
		{
			name: 'Daniel Brown',
			email: 'daniel.brown@example.com',
			age: 40,
			phone: '555-456-7890'
		},
		{
			name: 'Emily Davis',
			email: 'emily.davis@example.com',
			age: 31,
			phone: '555-567-8901'
		}
	];
</script>

{#snippet headerSnippet(title: string)}
	<span class="font-bold text-blue-500">{title}</span>
{/snippet}

{#snippet strongSnippet(content: string)}
	<strong>{content}</strong>
{/snippet}

<SimpleTable data={users} {columns} />

<button onclick={()=>goto('/auth/login')}>Go to Login</button>
