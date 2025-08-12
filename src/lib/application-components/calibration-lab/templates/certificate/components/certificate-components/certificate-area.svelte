<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import { onMount, tick } from 'svelte';

	import HeaderSection from './components/header/header-section.svelte';
	import CustomerDetailsSection from './components/customer-detail/customer-details-section.svelte';
	import CalibrationDataSection from './components/calibration-data/calibration-data.svelte';
	import ReferenceInstrumentSection from './components/reference-instrument/reference-instuments.svelte';
	import FooterSection from './components/footer/footer-section.svelte';
	import CustomFieldSection from './components/custom-field/custom-field-section.svelte';

	const componentMap = {
		HeaderSection,
		CustomerDetailsSection,
		CalibrationDataSection,
		ReferenceInstrumentSection,
		FooterSection,
		CustomFieldSection
	} as const;

	let {
		isPaginated = false,
		onFieldsReady
	}: {
		isPaginated?: boolean;
		onFieldsReady?: () => void;
	} = $props();

	// State for pagination
	let sectionElements = $state<HTMLElement[]>([]);
	let measurementContainer = $state<HTMLElement>();
	let paginatedSections = $state<
		Array<{ pageIndex: number; sections: typeof certificate.sections }>
	>([]);
	let isCalculating = $state(false);

	// Convert mm to pixels
	const mmToPx = (mm: number) => Math.round((mm * 96) / 25.4);

	// Page dimensions - use consistent units
	const pageHeight = $derived(mmToPx(certificate.page.height));
	const pageWidth = $derived(mmToPx(certificate.page.width));
	const marginTop = $derived(mmToPx(certificate.page.margin.top));
	const marginBottom = $derived(mmToPx(certificate.page.margin.bottom));
	const marginLeft = $derived(mmToPx(certificate.page.margin.left));
	const marginRight = $derived(mmToPx(certificate.page.margin.right));

	//  Calculate actual content height available for sections
	const contentHeight = $derived(pageHeight - marginTop - marginBottom - 40); // 40px buffer for page number

	// Page styles for paginated view
	const pageStyles = $derived(`
        width: ${pageWidth}px;
        height: ${pageHeight}px;
        padding: ${marginTop}px ${marginRight}px ${marginBottom}px ${marginLeft}px;
        box-sizing: border-box;
    `);

	// Single page styles (for non-paginated view)
	const singlePageStyles = $derived(`
        width: ${certificate.page.width}${certificate.page.unit};
        min-height: ${certificate.page.height}${certificate.page.unit};
        padding: ${certificate.page.margin.top}${certificate.page.unit} ${certificate.page.margin.right}${certificate.page.unit} ${certificate.page.margin.bottom}${certificate.page.unit} ${certificate.page.margin.left}${certificate.page.unit};
        box-sizing: border-box;
    `);

	// Stable sections reference
	const sections = $derived.by(() => {
		return [...certificate.sections];
	});

	// Custom fields reactivity
	$effect(() => {
		const customFieldIds = Object.keys(certificate.customFields);

		if (customFieldIds.length > 0 && onFieldsReady) {
			tick().then(() => onFieldsReady());
		}
	});

	// pagination calculation
	async function calculatePagination() {
		if (!isPaginated || isCalculating) {
			return;
		}

		// Wait for elements to be available
		let attempts = 0;
		const maxAttempts = 20;

		while (
			(!measurementContainer ||
				sectionElements.length === 0 ||
				sectionElements.some((el) => !el)) &&
			attempts < maxAttempts
		) {
			await new Promise((resolve) => setTimeout(resolve, 100));
			attempts++;
		}

		if (!measurementContainer || sectionElements.length === 0) {
			return;
		}

		isCalculating = true;

		// Wait for DOM to be fully updated
		await tick();
		await new Promise((resolve) => setTimeout(resolve, 100));

		paginatedSections = [];
		let currentPage = 0;
		let currentPageHeight = 0;
		let currentPageSections: typeof certificate.sections = [];

		for (let index = 0; index < sectionElements.length; index++) {
			const element = sectionElements[index];
			const section = sections[index];

			if (!element || !section) {
				continue;
			}

			// Force reflow to get accurate measurements
			element.style.display = 'block';
			element.offsetHeight; // Force reflow

			const sectionHeight = element.getBoundingClientRect().height;

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
		}

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

		isCalculating = false;
	}

	// Better pagination effect with proper timing and debouncing
	let paginationTimeout: any;
	$effect(() => {
		if (isPaginated && sections.length > 0) {
			// Clear any existing timeout
			if (paginationTimeout) {
				clearTimeout(paginationTimeout);
			}

			// Debounce pagination calculation with longer delay for initial load
			paginationTimeout = setTimeout(() => {
				calculatePagination();
			}, 800);
		}
	});

	onMount(() => {
		if (isPaginated) {
			// Initial calculation with longer delay to ensure all components are rendered
			setTimeout(() => {
				calculatePagination();
			}, 1500);
		}
	});

	// Component rendering helper
	function renderSection(section: (typeof certificate.sections)[0]) {
		const Component = componentMap[section.component as keyof typeof componentMap];

		if (!Component) {
			return { type: 'error' as const, message: `Component "${section.component}" not found` };
		}

		if (section.isCustom && section.customData?.fieldId) {
			const fieldExists = certificate.customFields[section.customData.fieldId];
			if (!fieldExists) {
				return {
					type: 'error' as const,
					message: `Custom field "${section.customData.fieldId}" not found`
				};
			}

			return {
				type: 'component' as const,
				component: Component,
				props: { fieldId: section.customData.fieldId } as any
			};
		}

		return {
			type: 'component' as const,
			component: Component,
			props: {} as any
		};
	}
</script>

<div class="certificate-container">
	{#if isPaginated}
		<div
			class="certificate-page measurement-page"
			style={pageStyles}
			bind:this={measurementContainer}
		>
			<div class="page-content">
				{#each sections as section, index (section.id)}
					{@const rendered = renderSection(section)}
					<div
						bind:this={sectionElements[index]}
						class="measurement-section"
						data-section-index={index}
					>
						{#if rendered.type === 'component'}
							{@const Component = rendered.component}
							<Component {...rendered.props}></Component>
						{:else}
							<div class="error-placeholder"></div>
						{/if}
					</div>
				{/each}
			</div>
		</div>

		{#if paginatedSections.length > 0}
			<div class="flex flex-col items-center gap-8">
				{#each paginatedSections as page, pageIndex}
					<div class="certificate-page" style={pageStyles} data-page={pageIndex + 1}>
						<div class="page-content">
							{#each page.sections as section (section.id)}
								{@const rendered = renderSection(section)}
								{#if rendered.type === 'error'}
									<div class="section-error">
										<p>⚠️ {rendered.message}</p>
										<p class="error-details">Section: {section.name}</p>
									</div>
								{:else}
									{@const Component = rendered.component}
									<Component {...rendered.props}></Component>
								{/if}
							{/each}
						</div>

						<div class="page-number">Page {pageIndex + 1} of {paginatedSections.length}</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="certificate-page" style={pageStyles}>
				<div class="page-content">
					<div class="pagination-loading">
						<p>Calculating pagination...</p>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<div class="certificate-paper" style={singlePageStyles}>
			{#each sections as section (section.id)}
				{@const rendered = renderSection(section)}
				<div class="section-wrapper" data-section-id={section.id}>
					{#if rendered.type === 'error'}
						<div class="section-error">
							<p>⚠️ {rendered.message}</p>
							<p class="error-details">Section: {section.name}</p>
						</div>
					{:else}
						{@const Component = rendered.component}
						<Component {...rendered.props} />
					{/if}
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.certificate-container {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	/* Single page styles */
	.certificate-paper {
		background-color: white;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		flex-shrink: 0;
		transition: all 0.3s ease;
		position: relative;
	}

	/* Paginated page styles */
	.certificate-page {
		background: white;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		border: 1px solid #e5e7eb;
		position: relative;
		margin-bottom: 2rem;
		flex-shrink: 0;
	}

	.page-content {
		height: 100%;
		overflow: hidden;
		position: relative;
		display: flex;
		flex-direction: column;
	}

	/* Hidden measurement page */
	.measurement-page {
		opacity: 0;
		position: absolute;
		top: -9999px;
		left: -9999px;
		pointer-events: none;
		z-index: -1;
		visibility: hidden;
	}

	.measurement-section {
		position: relative;
		width: 100%;
	}

	.error-placeholder {
		visibility: hidden;
		height: 20px; /* Minimal height for error sections */
	}

	.section-wrapper {
		transition: opacity 0.2s ease;
	}

	.section-error {
		background: linear-gradient(135deg, #ffe6e6, #ffcccc);
		border: 2px solid #ff9999;
		padding: 1rem;
		margin: 0.5rem 0;
		border-radius: 8px;
		color: #cc0000;
		text-align: center;
		font-weight: 500;
		box-shadow: 0 4px 12px rgba(255, 153, 153, 0.2);
	}

	.section-error::before {
		content: '⚠️';
		display: block;
		font-size: 2rem;
		margin-bottom: 0.5rem;
	}

	.section-error p {
		margin: 0.25rem 0;
	}

	.error-details {
		font-size: 0.8rem;
		opacity: 0.8;
	}

	.pagination-loading {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
		color: #6b7280;
		font-style: italic;
	}

	/* Page number styling */
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
		z-index: 10;
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

		.measurement-page {
			display: none !important;
		}
	}
</style>
