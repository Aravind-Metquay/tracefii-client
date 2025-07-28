<script lang="ts">
	//@ts-ignore
	import { Grid } from 'wx-svelte-grid';

	const data = [
		{
			id: 1,
			name: 'OzMetrology Pty Ltd',
			email: 'calibrations@ozmetrology.com.au',
			contactPerson: 'Emma Wilson',
			contactNumber: '+61 2 9876 5432',
			year: 2017,
			website: 'https://www.ozmetrology.com.au'
		},
		{
			id: 2,
			name: 'NordLab A/S',
			email: 'info@nordlab.dk',
			contactPerson: 'Lars Pedersen',
			contactNumber: '+45 8832 5677',
			year: 2019,
			website: 'https://www.nordlab.dk'
		},
		{
			id: 3,
			name: 'AeroCalibration GmbH',
			email: 'service@aerocalibration.de',
			contactPerson: 'Thomas Weber',
			contactNumber: '+49 89 7867 5544',
			year: 2020,
			website: 'https://www.aerocalibration.de'
		},
		{
			id: 4,
			name: 'MediTech Calibration Services Ltd',
			email: 'support@meditechcal.co.uk',
			contactPerson: 'James Thompson',
			contactNumber: '+44 20 7946 0351',
			year: 2018,
			website: 'https://www.meditechcal.co.uk'
		},
		{
			id: 5,
			name: 'CalTech Industries Inc',
			email: 'quality@caltech-ind.com',
			contactPerson: 'Miguel Rodriguez',
			contactNumber: '+1 713 555 9012',
			year: 2021,
			website: 'https://www.caltech-industries.com'
		},
		{
			id: 6,
			name: 'BioLab Precision SA',
			email: 'contact@biolab-precision.ch',
			contactPerson: 'Marie Dubois',
			contactNumber: '+41 21 693 7654',
			year: 2016,
			website: 'https://www.biolab-precision.ch'
		},
		{
			id: 7,
			name: 'SingTech Laboratories Pte Ltd',
			email: 'calibration@singtech.com.sg',
			contactPerson: 'Min–Jun Tan',
			contactNumber: '+65 6822 3344',
			year: 2015,
			website: 'https://www.singtechlabs.com.sg'
		},
		{
			id: 8,
			name: 'PrecisionMetrics Inc',
			email: 'operations@precisionmetrics.com',
			contactPerson: 'David Chen',
			contactNumber: '+1 415 555 6789',
			year: 2022,
			website: 'https://www.precisionmetrics.com'
		},
		{
			id: 9,
			name: 'TechCal Solutions Ltd',
			email: 'contact@techcal.com',
			contactPerson: 'Sarah Johnson',
			contactNumber: '+44 20 7946 0351',
			year: 2023,
			website: 'https://www.techcalsolutions.com'
		}
	];

	const columns = [
		{ id: 'name', header: 'Customer Name', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'email', header: 'Email ID', flexgrow: 1, sort: true, editor: 'text' },
		{ id: 'contactPerson', header: 'Contact Person Name', flexgrow: 1, sort: true, editor: 'text' },
		{
			id: 'contactNumber',
			header: 'Contact Person Number',
			width: 160,
			sort: true,
			editor: 'text'
		},
		{ id: 'year', header: 'Year', width: 80, sort: true, editor: 'text' },
		{ id: 'website', header: 'Website', flexgrow: 1, sort: true, editor: 'text' }
	];
</script>

	<div style="width: 100%; max-width: 85vw;" class='wx-material-theme text-sm overflow-x-scroll'>
		<Grid {data} {columns} />
	</div>

<style>
	:global(.wx-material-theme) {
		--wx-table-select-background: rgba(0, 0, 0, 0.06);
		--wx-table-select-focus-background: rgba(213, 230, 255, 0.6);
		--wx-table-select-color: var(--wx-color-font);
		--wx-table-border: 1px solid #dfdfdf;
		--wx-table-select-border: none;
		--wx-table-header-border: var(--wx-table-border);
		--wx-table-header-cell-border: var(--wx-table-border);
		--wx-table-footer-cell-border: var(--wx-table-border);
		--wx-table-cell-border: var(--wx-table-border);
		--wx-header-font-weight: 500;
		--wx-table-header-background: #ffffff;
		--wx-table-fixed-column-right-border: 3px solid #dfdfdf;
		--wx-table-editor-dropdown-border: none;
		--wx-table-editor-dropdown-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
	}
	:global(.wx-material-theme .menu) {
		box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.3);
		outline: none;
	}
</style>
