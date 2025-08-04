<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
    {
        id: 1,
        firstname: 'Emma',
        lastname: 'Wilson',
        email: 'calibrations@ozmetrology.com.au'
    },
    {
        id: 2,
        firstname: 'Lars',
        lastname: 'Pedersen',
        email: 'info@nordlab.dk'
    },
    {
        id: 3,
        firstname: 'Thomas',
        lastname: 'Weber',
        email: 'service@aerocalibration.de'
    },
    {
        id: 4,
        firstname: 'James',
        lastname: 'Thompson',
        email: 'support@meditechcal.co.uk'
    },
    {
        id: 5,
        firstname: 'Miguel',
        lastname: 'Rodriguez',
        email: 'quality@caltech-ind.com'
    },
    {
        id: 6,
        firstname: 'Marie',
        lastname: 'Dubois',
        email: 'contact@biolab-precision.ch'
    },
    {
        id: 7,
        firstname: 'Min-Jun',
        lastname: 'Tan',
        email: 'calibration@singtech.com.sg'
    },
    {
        id: 8,
        firstname: 'David',
        lastname: 'Chen',
        email: 'operations@precisionmetrics.com'
    },
    {
        id: 9,
        firstname: 'Sarah',
        lastname: 'Johnson',
        email: 'contact@techcal.com'
    }
];

	const columns = [
		{ id: 'firstname', header: 'First Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'lastname', header: 'Last Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'email', header: 'Email ID', flexgrow: 1, sort: true, editor: 'text' },
	];
    
</script>


<GridTable data={data} columns={columns} />
