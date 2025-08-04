<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			assetName: 'Dell Latitude 7420',
			customer: 'Technopark IT Services',
			assetType: 'Laptop Computer',
			assetStatus: 'In Service',
			serialNo: 'SN-7G8H9J0K',
			actions: null // Placeholder for UI controls like buttons
		},
		{
			assetName: 'HP LaserJet Pro M404dn',
			customer: 'Malabar Coast Exporters',
			assetType: 'Network Printer',
			assetStatus: 'Under Maintenance',
			serialNo: 'SN-1A2B3C4D',
			actions: null
		},
		{
			assetName: 'Fluke 115 Multimeter',
			customer: 'KELTRON (Kerala State Electronics)',
			assetType: 'Test Equipment',
			assetStatus: 'In Service',
			serialNo: 'SN-5E6F7G8H',
			actions: null
		},
		{
			assetName: 'Cisco Catalyst 2960 Switch',
			customer: 'Technopark IT Services',
			assetType: 'Networking Hardware',
			assetStatus: 'In Storage',
			serialNo: 'SN-9J0K1L2M',
			actions: null
		},
		{
			assetName: 'Voltas Vertical Freezer',
			customer: 'Ananthapuri Hospitals',
			assetType: 'Medical Equipment',
			assetStatus: 'Decommissioned',
			serialNo: 'SN-3N4P5Q6R',
			actions: null
		},
		{
			assetName: 'Epson EB-S41 Projector',
			customer: 'Govt. College of Engineering, Trivandrum',
			assetType: 'AV Equipment',
			assetStatus: 'In Service',
			serialNo: 'SN-7S8T9U0V',
			actions: null
		}
	];

	const columns = [
		{ id: 'assetName', header: 'Asset Name', flexgrow: 1, sort: true },
		{ id: 'customer', header: 'Customer', flexgrow: 1, sort: true },
		{ id: 'assetType', header: 'Asset Type', flexgrow: 1, sort: true },
		{ id: 'assetStatus', header: 'Asset Status', width: 150, sort: true },
		{ id: 'serialNo', header: 'Serial No', width: 150, sort: true },
		{ id: 'actions', header: 'Actions', width: 100, sort: false }
	];
    
</script>


<GridTable data={data} columns={columns} />
