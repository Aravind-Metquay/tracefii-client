<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
</script>

<div class="header-section">
	<div class="header-grid">
		<!-- Column 1: Metquay Logo and Name -->
		<div class="header-col-1">
			<div class="logo-section">
				<img src="" alt="Metquay Logo" class="company-logo" />
				<h2 class="company-name">Metquay</h2>
			</div>
		</div>

		<!-- Column 2: Company Address & Phone -->
		<div class="header-col-2">
			<div class="company-info">
				<p>Building No: 5421, Old Street</p>
				<p>Austin, Texas, USA. 956565</p>
				<p>Ph: +17185028848</p>
			</div>
		</div>

		<!-- Column 3: Accreditation Logo -->
		<div class="header-col-3">
			<img src="" alt="SAC-SINGLAS" class="accreditation-logo" />
		</div>
	</div>

	<!-- Full Width Document Title -->
	<div class="document-title">
		<h1>CERTIFICATE OF CALIBRATION</h1>
		<p class="certificate-number">Certificate No.: {certificate.data.certificateNo}</p>
	</div>
</div>

<style>
	.header-section {
		border-bottom: 2px solid #000;
		padding-bottom: 1rem;
		margin-bottom: 1.5rem;
	}

	.header-grid {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		gap: 1rem;
		align-items: center;
		margin-bottom: 1rem;
	}

	.logo-section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
	}

	.company-logo {
		width: 80px;
		height: auto;
	}

	.company-name {
		font-size: 1.2rem;
		font-weight: bold;
		margin: 0;
	}

	.company-info {
		text-align: center;
		font-size: 0.9rem;
		line-height: 1.4;
	}

	.company-info p {
		margin: 0.2rem 0;
	}

	.header-col-3 {
		display: flex;
		justify-content: center;
	}

	.accreditation-logo {
		width: 60px;
		height: auto;
	}

	.document-title {
		text-align: center;
		margin-top: 1rem;
	}

	.document-title h1 {
		font-size: 1.5rem;
		font-weight: bold;
		margin: 0 0 0.5rem 0;
		letter-spacing: 1px;
	}

	.certificate-number {
		font-size: 1rem;
		margin: 0;
		font-weight: 500;
	}
</style>
