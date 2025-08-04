<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			workNo: 'WN-2501',
			orderNo: 'PO-78901',
			customer: 'Quantum Dynamics Ltd.',
			assetName: 'Spectrometer Model X',
			assetType: 'Measurement Equipment',
			status: 'In Progress',
		},
		{
			workNo: 'WN-2502',
			orderNo: 'PO-78902',
			customer: 'BioHealth Corp',
			assetName: 'Centrifuge 5810R',
			assetType: 'Lab Equipment',
			status: 'Completed',
		},
		{
			workNo: 'WN-2503',
			orderNo: 'PO-78856',
			customer: 'AeroSpace Solutions',
			assetName: 'Torque Wrench TW-500',
			assetType: 'Calibrated Tool',
			status: 'Pending Parts',
		},
		{
			workNo: 'WN-2504',
			orderNo: 'PO-78903',
			customer: 'Stark Industries',
			assetName: 'Laser Cutter G-Series',
			assetType: 'Industrial Machinery',
			status: 'On Hold',
		},
		{
			workNo: 'WN-2505',
			orderNo: 'PO-78904',
			customer: 'Quantum Dynamics Ltd.',
			assetName: 'Digital Manometer',
			assetType: 'Measurement Equipment',
			status: 'Awaiting Dispatch',
		},
		{
			workNo: 'WN-2506',
			orderNo: 'PO-78905',
			customer: 'Cyberdyne Systems',
			assetName: 'Robotic Arm K-1',
			assetType: 'Automation',
			status: 'Scheduled',
		}
	];

	const columns = [
		{ id: 'workNo', header: 'Work No', width: 120, sort: true },
		{ id: 'orderNo', header: 'Order No', width: 120, sort: true },
		{ id: 'customer', header: 'Customer', flexgrow: 1, sort: true },
		{ id: 'assetName', header: 'Asset Name', flexgrow: 1, sort: true },
		{ id: 'assetType', header: 'Asset Type', width: 180, sort: true },
		{ id: 'status', header: 'Status', width: 140, sort: true },
	];
    
</script>


<GridTable data={data} columns={columns} />
