<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
</script>

<div class="reference-instrument-section">
	<h3>Reference Instrument</h3>
	<div class="reference-table">
		<table>
			<thead>
				<tr>
					<th>Equipment Name</th>
					<th>Serial No.</th>
					<th>Traceability</th>
					<th>Certificate No.</th>
					<th>Calibration Due on</th>
				</tr>
			</thead>
			<tbody>
				{#each certificate.data.referenceInstruments as instrument}
					<tr>
						<td>{instrument.equipment}</td>
						<td>{instrument.serial}</td>
						<td>{instrument.traceability}</td>
						<td>{instrument.certificate}</td>
						<td>{instrument.due}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	.reference-instrument-section {
		margin-bottom: 1.5rem;
	}

	.reference-instrument-section h3 {
		font-size: 1.1rem;
		font-weight: bold;
		margin-bottom: 1rem;
		text-decoration: underline;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th,
	td {
		border: 1px solid #333;
		padding: 0.5rem;
		text-align: left;
	}

	th {
		background-color: #f5f5f5;
		font-weight: bold;
		text-align: center;
	}

	td {
		vertical-align: top;
	}
</style>
