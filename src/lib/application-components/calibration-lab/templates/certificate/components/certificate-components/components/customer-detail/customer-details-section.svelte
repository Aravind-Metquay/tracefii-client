<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
</script>

<div class="customer-details-section">
	<div class="details-grid">
		<!-- Left Column -->
		<div class="left-column">
			<div class="field-group">
				<label for="customer-name">Customer Name & Address</label>
				<div class="field-value">{certificate.data.customer.name}</div>
				<div class="field-value">{certificate.data.customer.address}</div>
			</div>

			<div class="field-group">
				<label for="instrument-desc">Instrument Description</label>
				<div class="field-row">
					<span class="field-label">Type:</span>
					<span class="field-value">{certificate.data.instrument.type}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Manufacturer:</span>
					<span class="field-value">{certificate.data.instrument.manufacturer}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Model/Part No.:</span>
					<span class="field-value">{certificate.data.instrument.model}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Serial No.:</span>
					<span class="field-value">{certificate.data.instrument.serial}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Tag No.:</span>
					<span class="field-value">{certificate.data.instrument.tag}</span>
				</div>
			</div>
		</div>

		<!-- Right Column -->
		<div class="right-column">
			<div class="field-group">
				<div class="field-row">
					<span class="field-label">Date of Issue:</span>
					<span class="field-value">{certificate.data.dates.issue}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Received Date:</span>
					<span class="field-value">{certificate.data.dates.received}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Calibrated Date:</span>
					<span class="field-value">{certificate.data.dates.calibrated}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Calibration Due on:</span>
					<span class="field-value">{certificate.data.dates.due}</span>
				</div>
				<div class="field-note">(As requested by the customer)</div>
			</div>

			<div class="field-group">
				<div class="field-row">
					<span class="field-label">Location:</span>
					<span class="field-value">{certificate.data.conditions.location}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Data Type:</span>
					<span class="field-value">{certificate.data.conditions.dataType}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Humidity:</span>
					<span class="field-value">{certificate.data.conditions.humidity}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Temperature:</span>
					<span class="field-value">{certificate.data.conditions.temperature}</span>
				</div>
				<div class="field-row">
					<span class="field-label">Work Procedure:</span>
					<span class="field-value">{certificate.data.conditions.workProcedure}</span>
				</div>
			</div>

			<div class="field-group">
				<div class="field-row">
					<span class="field-label">As Found Condition:</span>
					<span class="field-value">{certificate.data.conditions.asFound}</span>
				</div>
				<div class="field-row">
					<span class="field-label">As Left Condition:</span>
					<span class="field-value">{certificate.data.conditions.asLeft}</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.customer-details-section {
		margin-bottom: 1.5rem;
		border: 1px solid #ccc;
		padding: 1rem;
	}

	.details-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.field-group {
		margin-bottom: 1rem;
	}

	.field-group label {
		display: block;
		font-weight: bold;
		margin-bottom: 0.5rem;
		text-decoration: underline;
	}

	.field-row {
		display: flex;
		margin-bottom: 0.3rem;
		align-items: baseline;
	}

	.field-label {
		font-weight: 500;
		min-width: 120px;
		margin-right: 0.5rem;
	}

	.field-value {
		flex: 1;
		border-bottom: 1px dotted #999;
		min-height: 1.2em;
		padding-bottom: 1px;
	}

	.field-note {
		font-style: italic;
		font-size: 0.9rem;
		color: #666;
		margin-top: 0.5rem;
	}
</style>
