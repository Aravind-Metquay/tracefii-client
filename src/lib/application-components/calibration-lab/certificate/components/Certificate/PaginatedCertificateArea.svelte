<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import { onMount, tick } from 'svelte';

	// Import all possible section components
	import HeaderSection from './certificate-components/header/HeaderSection.svelte';
	import CustomerDetailsSection from './certificate-components/customer-detail/CustomerDetailsSection.svelte';
	import CalibrationDataSection from './certificate-components/calibration-data/CalibrationDataSection.svelte';
	import ReferenceInstrumentSection from './certificate-components/reference-instrument/ReferenceInstrumentSection.svelte';
	import FooterSection from './certificate-components/footer/FooterSection.svelte';
	import CustomFieldSection from './certificate-components/custom-field/CustomFieldSection.svelte';

	const componentMap: Record<string, any> = {
		HeaderSection,
		CustomerDetailsSection,
		CalibrationDataSection,
		ReferenceInstrumentSection,
		FooterSection,
		CustomFieldSection
	};

	let sectionElements = $state<HTMLElement[]>([]);
	let containerElement = $state<HTMLElement>();

	// Convert mm to pixels (assuming 96 DPI)
	const mmToPx = (mm: number) => (mm * 96) / 25.4;

	const pageHeight = $derived(mmToPx(certificate.page.height));
	const pageWidth = $derived(mmToPx(certificate.page.width));
	const marginTop = $derived(mmToPx(certificate.page.margin.top));
	const marginBottom = $derived(mmToPx(certificate.page.margin.bottom));
	const marginLeft = $derived(mmToPx(certificate.page.margin.left));
	const marginRight = $derived(mmToPx(certificate.page.margin.right));
	const contentHeight = $derived(pageHeight - marginTop - marginBottom);

	// Derived value for page styles
	const pageStyles = $derived(`
		width: ${pageWidth}px;
		height: ${pageHeight}px;
		padding: ${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px;
	`);

	let paginatedSections = $state<
		Array<{ pageIndex: number; sections: typeof certificate.sections }>
	>([]);

	function calculatePagination() {
		if (!containerElement || sectionElements.length === 0) return;

		paginatedSections = [];
		let currentPage = 0;
		let currentPageHeight = 0;
		let currentPageSections: typeof certificate.sections = [];

		sectionElements.forEach((element, index) => {
			if (!element) return;

			const section = certificate.sections[index];
			const sectionHeight = element.offsetHeight;

			// Check if this section would overflow the current page
			if (currentPageHeight + sectionHeight > contentHeight && currentPageSections.length > 0) {
				// Save current page and start a new one
				paginatedSections.push({
					pageIndex: currentPage,
					sections: [...currentPageSections]
				});

				currentPage++;
				currentPageHeight = 0;
				currentPageSections = [];
			}

			// Add section to current page
			currentPageSections.push(section);
			currentPageHeight += sectionHeight;
		});

		// Add the last page if it has sections
		if (currentPageSections.length > 0) {
			paginatedSections.push({
				pageIndex: currentPage,
				sections: [...currentPageSections]
			});
		}

		// Update store with pagination info
		certificate.pagination.totalPages = paginatedSections.length;
		certificate.pagination.pageBreaks = paginatedSections
			.slice(1)
			.map((page) => page.sections[0]?.id)
			.filter(Boolean);
	}

	// Recalculate pagination when sections or page dimensions change
	$effect(() => {
		if (certificate.pagination.enabled && certificate.sections) {
			tick().then(() => {
				setTimeout(calculatePagination, 100);
			});
		}
	});

	onMount(() => {
		if (certificate.pagination.enabled) {
			setTimeout(calculatePagination, 100);
		}
	});
</script>

<div class="flex flex-col items-center gap-8" bind:this={containerElement}>
	{#if certificate.pagination.enabled && paginatedSections.length > 0}
		<!-- Paginated view -->
		{#each paginatedSections as page, pageIndex}
			<div class="certificate-page" style={pageStyles} data-page={pageIndex + 1}>
				<div class="relative h-full overflow-hidden">
					{#each page.sections as section (section.id)}
						<div bind:this={sectionElements[section.id - 1]}>
							{#if section.isCustom && section.customData?.fieldId}
								{@const Component = componentMap[section.component]}
								<Component fieldId={section.customData.fieldId} />
							{:else}
								{@const Component = componentMap[section.component]}
								<Component />
							{/if}
						</div>
					{/each}
				</div>

				<!-- Page number footer -->
				<div class="page-number">
					Page {pageIndex + 1} of {paginatedSections.length}
				</div>
			</div>
		{/each}
	{:else}
		<!-- Single page view for measurement -->
		<div class="certificate-page measurement-page" style={pageStyles}>
			<div class="relative h-full overflow-hidden">
				{#each certificate.sections as section, index (section.id)}
					<div bind:this={sectionElements[index]}>
						{#if section.isCustom && section.customData?.fieldId}
							{@const Component = componentMap[section.component]}
							<Component fieldId={section.customData.fieldId} />
						{:else}
							{@const Component = componentMap[section.component]}
							<Component />
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>

<style>
	.certificate-page {
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e7eb;
		position: relative;
		margin-bottom: 2rem;
	}

	.measurement-page {
		opacity: 0;
		position: absolute;
		top: -9999px;
		left: -9999px;
		pointer-events: none;
	}

	.page-number {
		position: absolute;
		bottom: 8px;
		right: 12px;
		font-size: 0.75rem;
		color: #6b7280;
		background: rgba(255, 255, 255, 0.9);
		padding: 4px 8px;
		border-radius: 4px;
		border: 1px solid #e5e7eb;
	}

	@media print {
		.certificate-page {
			box-shadow: none;
			border: none;
			margin-bottom: 0;
			page-break-after: always;
		}

		.certificate-page:last-child {
			page-break-after: auto;
		}

		.page-number {
			display: none;
		}
	}
</style>
