
	<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			procedureName: 'Standard Pipette Calibration',
			procedureNo: 'CAL-PIP-001-V2',
			active: true,
			preparedBy: 'Anjali Sharma',
			worksheetName: '10-1000µL Pipette Worksheet',
			worksheetId: 'WS-PIP-1000',
			actions: null // 'Actions' column is often for UI controls like buttons
		},
		{
			procedureName: 'Thermometer Verification',
			procedureNo: 'CAL-THERM-003-V1',
			active: true,
			preparedBy: 'Vikram Singh',
			worksheetName: 'Digital Thermometer Check',
			worksheetId: 'WS-THERM-DIGI',
			actions: null
		},
		{
			procedureName: 'Pressure Gauge Analysis (Legacy)',
			procedureNo: 'CAL-PRES-002-V4',
			active: false,
			preparedBy: 'Priya Desai',
			worksheetName: 'Analog Gauge Inspection',
			worksheetId: 'WS-PRES-ANLG',
			actions: null
		},
		{
			procedureName: 'Analytical Balance Calibration',
			procedureNo: 'CAL-BAL-001-V3',
			active: true,
			preparedBy: 'Anjali Sharma',
			worksheetName: 'Mettler Toledo Balance Sheet',
			worksheetId: 'WS-BAL-ANLY',
			actions: null
		},
		{
			procedureName: 'Multimeter Electrical Safety Test',
			procedureNo: 'CAL-ELEC-005-V1',
			active: true,
			preparedBy: 'Rahul Menon',
			worksheetName: 'Fluke Multimeter Verification',
			worksheetId: 'WS-ELEC-FLUKE',
			actions: null
		}
	];

	const columns = [
		{ id: 'procedureName', header: 'Procedure Name', flexgrow: 1, sort: true },
		{ id: 'procedureNo', header: 'Procedure No', width: 150, sort: true },
		{ id: 'active', header: 'Active', width: 100, sort: true },
		{ id: 'preparedBy', header: 'Prepared By', width: 180, sort: true },
		{ id: 'worksheetName', header: 'Worksheet Name', flexgrow: 1, sort: true },
		{ id: 'worksheetId', header: 'Worksheet ID', width: 150, sort: true },
		{ id: 'actions', header: 'Actions', width: 100, sort: false }
	];
    
</script>


<GridTable data={data} columns={columns} />
