<script lang="ts">
	import { certificate, certificateActions } from '@/certificate/lib/store.svelte';

	// Import template images
	import HeaderDefault from '../../../edit-modal/properties/header/templates/Header-Default.png';
	import HeaderFirst from '../../../edit-modal/properties/header/templates/Header-First.png';
	import HeaderLast from '../../../edit-modal/properties/header/templates/Header-Last.png';
	import HeaderMid from '../../../edit-modal/properties/header/templates/Header-Mid.png';

	// Template mapping
	const templateImages: Record<string, string> = {
		'Header-Default.png': HeaderDefault,
		'Header-First.png': HeaderFirst,
		'Header-Last.png': HeaderLast,
		'Header-Mid.png': HeaderMid
	};

	// Props
	let { pageNumber }: { pageNumber?: number } = $props();

	// Get the appropriate template for this page
	const selectedTemplate = $derived(
		pageNumber
			? certificateActions.getHeaderForPage(pageNumber)
			: certificate.data.selectedHeaderTemplate || 'Header-Default.png'
	);
	const templateImage = $derived(templateImages[selectedTemplate] || HeaderDefault);
</script>

<div class="header-section">
	<!-- Header Template Image -->
	<div class="header-template">
		<img src={templateImage} alt="Certificate Header" class="header-image" />
	</div>

	<!-- Certificate Number Overlay (positioned over the template) -->
	<div class="certificate-number-overlay">
		<p class="certificate-number">Certificate No.: {certificate.data.certificateNo}</p>
	</div>
</div>

<style>
	.header-section {
		position: relative;
		margin-bottom: 1.5rem;
	}

	.header-template {
		width: 100%;
		border: 1px solid #e5e7eb;
		border-radius: 4px;
		overflow: hidden;
	}

	.header-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.certificate-number-overlay {
		position: absolute;
		bottom: 10px;
		right: 20px;
		background: rgba(255, 255, 255, 0.9);
		padding: 4px 8px;
		border-radius: 4px;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
	}

	.certificate-number {
		font-size: 0.9rem;
		margin: 0;
		font-weight: 500;
		color: #374151;
	}

	/* Print styles */
	@media print {
		.header-section {
			margin-bottom: 1rem;
		}

		.certificate-number-overlay {
			background: white;
			box-shadow: none;
		}
	}
</style>
