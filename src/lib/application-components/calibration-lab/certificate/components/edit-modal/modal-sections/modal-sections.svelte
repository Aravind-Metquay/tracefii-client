<script lang="ts">
	import { getSelectedSection } from '@/certificate/lib/section-store.svelte';

	import HeaderProperties from '../properties/header/header-properties.svelte';
	import CustomerDetailsSection from '../../certificate-components/components/customer-detail/customer-details-section.svelte';
	import ReferenceInstrumentSection from '../../certificate-components/components/reference-instrument/reference-instuments.svelte';
	import FooterSection from '../../certificate-components/components/footer/footer-section.svelte';
	import CustomFieldSection from '../../certificate-components/components/custom-field/custom-field-section.svelte';

	let selectedSection = $derived(getSelectedSection());

	const componentMap: Record<string, any> = {
		HeaderSection: HeaderProperties,
		CustomerDetailsSection,
		ReferenceInstrumentSection,
		FooterSection,
		CustomFieldSection
	};
</script>

<div class="h-full w-full overflow-y-auto">
	{#if selectedSection}
		<!-- Selected Section View -->
		<div class="h-full">
			{#if selectedSection.component && componentMap[selectedSection.component]}
				{@const Component = componentMap[selectedSection.component] as any}
				{#if selectedSection.component === 'HeaderSection'}
					<!-- Full-screen header edit modal -->
					<Component />
				{:else}
					<!-- Regular section editing with header and padding -->
					<div class="flex h-full flex-col">
						<!-- Section Header -->
						<div class="flex-shrink-0 border-b border-gray-200 bg-gray-50 px-6 py-4">
							<div class="flex items-center justify-between">
								<div>
									<h2 class="text-xl font-semibold text-gray-900">{selectedSection.name}</h2>
									<p class="text-sm text-gray-600">Section ID: {selectedSection.id}</p>
								</div>
								<div class="flex items-center space-x-2">
									{#if selectedSection.isCustom}
										<span
											class="inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-800"
										>
											Custom Field
										</span>
									{/if}
								</div>
							</div>
						</div>

						Section Content
						<div class="flex-1 overflow-y-auto p-6">
							<div class="mx-auto max-w-4xl">
								{#if selectedSection.isCustom && selectedSection.customData?.fieldId}
									<Component fieldId={selectedSection.customData.fieldId} />
								{:else}
									<Component />
								{/if}
							</div>
						</div>
					</div>
				{/if}
			{:else}
				<div class="flex h-full items-center justify-center">
					<div class="rounded-md bg-gray-100 p-8 text-center">
						<p class="text-lg text-gray-600">
							Component "{selectedSection.component}" not found
						</p>
					</div>
				</div>
			{/if}
		</div>
	{:else}
		No Section Selected
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No section selected</h3>
				<p class="mt-1 text-sm text-gray-500">
					Select a component from the left panel to view and edit it.
				</p>
			</div>
		</div>
	{/if}
</div>
