// Export all property components for easy importing
export { default as HeaderProperties } from './HeaderProperties.svelte';
export { default as CustomerDetailsProperties } from './CustomerDetailsProperties.svelte';
export { default as CalibrationDataProperties } from './CalibrationDataProperties.svelte';
export { default as ReferenceInstrumentProperties } from './ReferenceInstrumentProperties.svelte';
export { default as FooterProperties } from './FooterProperties.svelte';

// Property component mapping for dynamic loading
export const propertyComponentMap = {
	HeaderSection: 'HeaderProperties',
	CustomerDetailsSection: 'CustomerDetailsProperties', 
	CalibrationDataSection: 'CalibrationDataProperties',
	ReferenceInstrumentSection: 'ReferenceInstrumentProperties',
	FooterSection: 'FooterProperties',
	CustomFieldSection: 'CustomFieldProperties' // To be created later
};