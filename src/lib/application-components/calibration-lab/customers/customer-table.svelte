<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			id: 1,
			customerName: 'OzMetrology Pty Ltd',
			customerEmail: 'calibrations@ozmetrology.com.au',
			createdAt: '2017-01-01',
			workspaceId: 'W1'
		},
		{
			id: 2,
			customerName: 'NordLab A/S',
			customerEmail: 'info@nordlab.dk',

			createdAt: '2019-01-01',
			workspaceId: 'W2'
		},
		{
			id: 3,
			customerName: 'AeroCalibration GmbH',
			customerEmail: 'service@aerocalibration.de',
			createdAt: '2020-01-01',
			workspaceId: 'W3'
		},
		{
			id: 4,
			customerName: 'MediTech Calibration Services Ltd',
			customerEmail: 'support@meditechcal.co.uk',
			createdAt: '2018-01-01',
			workspaceId: 'W1'
		},
		{
			id: 5,
			customerName: 'CalTech Industries Inc',
			customerEmail: 'quality@caltech-ind.com',
			createdAt: '2021-01-01',
			workspaceId: 'W2'
		},
		{
			id: 6,
			customerName: 'BioLab Precision SA',
			customerEmail: 'contact@biolab-precision.ch',
			createdAt: '2016-01-01',
			workspaceId: 'W3'
		},
		{
			id: 7,
			customerName: 'SingTech Laboratories Pte Ltd',
			customerEmail: 'calibration@singtech.com.sg',
			createdAt: '2015-01-01',
			workspaceId: 'W1'
		},
		{
			id: 8,
			customerName: 'PrecisionMetrics Inc',
			customerEmail: 'operations@precisionmetrics.com',
			createdAt: '2022-01-01',
			workspaceId: 'W2'
		},
		{
			id: 9,
			customerName: 'TechCal Solutions Ltd',
			customerEmail: 'contact@techcal.com',
			createdAt: '2023-01-01',
			workspaceId: 'W3'
		}
	];

	const columns = [
		{ id: 'customerName', header: 'Customer Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'customerEmail', header: 'Email ID', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'createdAt', header: 'Year', width: 80, sort: true, editor: 'text' },
		{ id: 'workspaceId', header: 'Workspace ID', flexgrow: 1, sort: true, editor: 'text' }
	];
    
	// let {data}: {data: any} = $props();
</script>


<GridTable data={data} columns={columns} />
