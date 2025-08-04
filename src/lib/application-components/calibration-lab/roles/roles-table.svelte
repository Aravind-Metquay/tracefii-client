
<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			name: 'Q3 2025 Financial Report',
			description: 'Quarterly financial summary for all departments, covering revenue, expenses, and profit margins.',
			createdBy: 'Nandita Menon',
			actions: null // 'Actions' column is often for UI controls like buttons
		},
		{
			name: 'New Employee Onboarding Kit',
			description: 'A collection of documents and forms for new hires, including HR policies and IT setup guides.',
			createdBy: 'Arun Pillai',
			actions: null
		},
		{
			name: 'API Documentation v2.1',
			description: 'Technical reference for the public-facing REST API. Includes endpoint details and example requests.',
			createdBy: 'Suresh Kumar',
			actions: null
		},
		{
			name: 'Marketing Campaign Proposal - Onam 2025',
			description: 'Proposal for the upcoming Onam festival marketing campaign, including budget and channel strategy.',
			createdBy: 'Lakshmi Nair',
			actions: null
		},
		{
			name: 'User Acceptance Testing (UAT) Plan',
			description: 'Plan and test cases for the final round of UAT for the new CRM software.',
			createdBy: 'Arun Pillai',
			actions: null
		}
	];

	const columns = [
		{ id: 'name', header: 'Name', flexgrow: 1, sort: true },
		{ id: 'description', header: 'Description', flexgrow: 2, sort: true }, // Given more space
		{ id: 'createdBy', header: 'Created By', flexgrow: 1, sort: true },
		{ id: 'actions', header: 'Actions', width: 100, sort: false }
	];
    
</script>


<GridTable data={data} columns={columns} />
