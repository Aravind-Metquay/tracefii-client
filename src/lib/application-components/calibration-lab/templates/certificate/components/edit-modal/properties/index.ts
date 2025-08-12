// Export all property components for easy importing
export { default as HeaderProperties } from './header-properties.svelte';
export { default as CustomerDetailsProperties } from './customer-details-properties.svelte';
export { default as ReferenceInstrumentProperties } from './reference-instruments-properties.svelte';
export { default as FooterProperties } from './footer-properties.svelte';

// Property component mapping for dynamic loading
export const propertyComponentMap = {
	HeaderSection: 'HeaderProperties',
	CustomerDetailsSection: 'CustomerDetailsProperties',
	ReferenceInstrumentSection: 'ReferenceInstrumentProperties',
	FooterSection: 'FooterProperties',
	CustomFieldSection: 'CustomFieldProperties' // To be created later
};
