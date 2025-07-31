<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';

	import HeaderSection from './certificate-components/header/HeaderSection.svelte';
	import CustomerDetailsSection from './certificate-components/customer-detail/CustomerDetailsSection.svelte';
	import CalibrationDataSection from './certificate-components/calibration-data/CalibrationDataSection.svelte';
	import ReferenceInstrumentSection from './certificate-components/reference-instrument/ReferenceInstrumentSection.svelte';
	import FooterSection from './certificate-components/footer/FooterSection.svelte';
	import CustomFieldSection from './certificate-components/custom-field/CustomFieldSection.svelte';

	// A map to look up the component constructor from the string name in the store.
	const componentMap: Record<string, any> = {
		HeaderSection,
		CustomerDetailsSection,
		CalibrationDataSection,
		ReferenceInstrumentSection,
		FooterSection,
		CustomFieldSection
	};

	// Derived value: this string will automatically update whenever
	// any of its dependencies in the store change.
	const pageStyles = $derived(`
      width: ${certificate.page.width}${certificate.page.unit};
      height: ${certificate.page.height}${certificate.page.unit};
      padding: ${certificate.page.margin.top}px ${certificate.page.margin.right}px ${certificate.page.margin.bottom}px ${certificate.page.margin.left}px;
    `);
</script>

<!-- This is the element that html2canvas will capture for the PDF -->
<div class="certificate-paper" style={pageStyles}>
	<!-- Loop through the sections array from the store -->
	{#each certificate.sections as section (section.id)}
		<!-- Use dynamic components to render the correct component -->
		{#if section.isCustom && section.customData?.fieldId}
			{@const Component = componentMap[section.component]}
			<Component fieldId={section.customData.fieldId} />
		{:else}
			{@const Component = componentMap[section.component]}
			<Component />
		{/if}
	{/each}
</div>

<style>
	.certificate-paper {
		background-color: white;
		box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
		box-sizing: border-box;
		/* This ensures the page doesn't shrink below its specified dimensions */
		flex-shrink: 0;
		transition: all 0.3s ease;
	}
</style>
