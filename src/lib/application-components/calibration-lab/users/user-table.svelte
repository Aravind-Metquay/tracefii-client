<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
		{
			id: 1,
			user: 'OzMetrology Pty Ltd',
			email: 'calibrations@ozmetrology.com.au',
		},
		{
			id: 2,
			user: 'NordLab A/S',
			email: 'info@nordlab.dk',
		},
		{
			id: 3,
			user: 'AeroCalibration GmbH',
			email: 'service@aerocalibration.de',
		},
		{
			id: 4,
			user: 'MediTech Calibration Services Ltd',
			email: 'support@meditechcal.co.uk',
		},
		{
			id: 5,
			user: 'CalTech Industries Inc',
			email: 'quality@caltech-ind.com',
		},
		{
			id: 6,
			user: 'BioLab Precision SA',
			email: 'contact@biolab-precision.ch',
		},
		{
			id: 7,
			user: 'SingTech Laboratories Pte Ltd',
			email: 'calibration@singtech.com.sg',
		},
		{
			id: 8,
			user: 'PrecisionMetrics Inc',
            email: 'operations@precisionmetrics.com',
		},
		{
			id: 9,
			user: 'TechCal Solutions Ltd',
			email: 'contact@techcal.com',
		}
	];

	const columns = [
		{ id: 'user', header: 'User Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'email', header: 'Email ID', flexgrow: 1, sort: true, editor: 'text' },
        { id: 'actions', header: 'Actions', flexgrow: 1, sort: true, editor: 'text' },

	];
    
</script>


<GridTable data={data} columns={columns} />
