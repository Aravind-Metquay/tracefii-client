<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
</script>

<div class="footer-section">
	<div class="signature-area">
		<div class="signature-grid">
			<div class="signature-block">
				<div class="signature-line"></div>
				<p class="signature-label">Calibrated by</p>
				<p class="signature-name">John Smith</p>
				<p class="signature-title">Calibration Technician</p>
				<p class="signature-date">Date: {certificate.data.dates.calibrated}</p>
			</div>

			<div class="signature-block">
				<div class="signature-line"></div>
				<p class="signature-label">Reviewed by</p>
				<p class="signature-name">Sarah Johnson</p>
				<p class="signature-title">Quality Manager</p>
				<p class="signature-date">Date: {certificate.data.dates.issue}</p>
			</div>
		</div>
	</div>

	<div class="footer-info">
		<div class="footer-grid">
			<div class="footer-left">
				<p><strong>Laboratory Information:</strong></p>
				<p>Metquay Calibration Services</p>
				<p>ISO/IEC 17025:2017 Accredited</p>
				<p>Certificate No.: {certificate.data.certificateNo}</p>
			</div>

			<div class="footer-right">
				<p><strong>Contact Information:</strong></p>
				<p>Email: calibration@metquay.com</p>
				<p>Phone: +17185028848</p>
				<p>Web: www.metquay.com</p>
			</div>
		</div>
	</div>

	<div class="page-footer">
		<p>This certificate contains {certificate.sections.length} pages. End of Certificate.</p>
		<p class="version-info">
			Version: {certificate.metadata.version} | Work Order: {certificate.metadata.work}
		</p>
	</div>
</div>

<style>
	.footer-section {
		margin-top: 2rem;
		border-top: 2px solid #000;
		padding-top: 1rem;
	}

	.signature-area {
		margin-bottom: 1.5rem;
	}

	.signature-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
	}

	.signature-block {
		text-align: center;
	}

	.signature-line {
		width: 200px;
		height: 1px;
		background-color: #000;
		margin: 0 auto 0.5rem auto;
	}

	.signature-label {
		font-weight: bold;
		margin: 0.5rem 0 0.25rem 0;
		font-size: 0.9rem;
	}

	.signature-name {
		font-weight: bold;
		margin: 0.25rem 0;
		font-size: 1rem;
	}

	.signature-title {
		font-style: italic;
		margin: 0.25rem 0;
		font-size: 0.9rem;
		color: #666;
	}

	.signature-date {
		margin: 0.25rem 0;
		font-size: 0.9rem;
	}

	.footer-info {
		margin-bottom: 1.5rem;
		padding: 1rem;
		background-color: #f9f9f9;
		border: 1px solid #ddd;
	}

	.footer-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}

	.footer-left p,
	.footer-right p {
		margin: 0.3rem 0;
		font-size: 0.9rem;
	}

	.page-footer {
		text-align: center;
		font-size: 0.8rem;
		color: #666;
		border-top: 1px solid #ccc;
		padding-top: 0.5rem;
	}

	.page-footer p {
		margin: 0.25rem 0;
	}

	.version-info {
		font-style: italic;
	}
</style>
