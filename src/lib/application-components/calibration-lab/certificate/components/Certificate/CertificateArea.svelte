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

    // Create a stable reference to sections to prevent unnecessary re-renders
    const sections = $derived(certificate.sections);
</script>

<!-- This is the element that html2canvas will capture for the PDF -->
<div class="certificate-paper" style={pageStyles}>
    <!-- Loop through the sections array from the store -->
    {#each sections as section (section.id)}
        <!-- Use dynamic components to render the correct component -->
        {#if section.isCustom && section.customData?.fieldId}
            {@const Component = componentMap[section.component]}
            {#if Component && certificate.customFields[section.customData.fieldId]}
                <Component fieldId={section.customData.fieldId} />
            {:else}
                <div class="section-error">
                    <p>⚠️ Custom field component not found or field deleted</p>
                    <p class="error-details">Section: {section.name}, Field ID: {section.customData.fieldId}</p>
                </div>
            {/if}
        {:else}
            {@const Component = componentMap[section.component]}
            {#if Component}
                <Component />
            {:else}
                <div class="section-error">
                    <p>⚠️ Component "{section.component}" not found</p>
                    <p class="error-details">Section: {section.name}</p>
                </div>
            {/if}
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
        /* Prevent layout shifts during rendering */
        min-height: 100%;
        position: relative;
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
    }

    .section-error p {
        margin: 0.25rem 0;
    }

    .error-details {
        font-size: 0.8rem;
        opacity: 0.8;
    }
</style>