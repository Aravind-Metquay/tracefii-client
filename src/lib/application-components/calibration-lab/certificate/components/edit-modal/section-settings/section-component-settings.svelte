<script lang="ts">
	import {
		getSelectedSection,
		setSelectedSection,
		clearSelectedSection
	} from '@/calibration-lab/certificate/lib/section-store.svelte';
	import { certificate } from '@/certificate/lib/store.svelte';

	import HeaderProperties from '../properties/header-properties.svelte';
	import CustomerDetailsProperties from '../properties/customer-details-properties.svelte';
	import ReferenceInstrumentProperties from '../properties/reference-instruments-properties.svelte';
	import FooterProperties from '../properties/footer-properties.svelte';
	

	let selectedSection = $derived(getSelectedSection());

	// Component mapping for properties
	const propertyComponentMap: Record<string, any> = {
		HeaderSection: HeaderProperties,
		CustomerDetailsSection: CustomerDetailsProperties,
		ReferenceInstrumentSection: ReferenceInstrumentProperties,
		FooterSection: FooterProperties
	};

	function updateSectionName(newName: string) {
		if (selectedSection) {
			const sectionIndex = certificate.sections.findIndex((s: any) => s.id === selectedSection.id);
			if (sectionIndex !== -1) {
				certificate.sections[sectionIndex].name = newName;
				// Update the selected section reference
				setSelectedSection({ ...selectedSection, name: newName });
			}
		}
	}
</script>

<div class="h-full overflow-y-auto p-6">
	{#if selectedSection}
		<!-- Render component-specific properties -->
		{#if selectedSection.component && propertyComponentMap[selectedSection.component]}
			{@const PropertyComponent = propertyComponentMap[selectedSection.component] as any}
			<PropertyComponent />
		{:else}
			<!-- Fallback for unknown components -->
			<div class="space-y-6">
				<div>
					<h3 class="text-lg font-medium text-gray-900">General Properties</h3>
					<p class="text-sm text-gray-600">Configure the selected section</p>
				</div>

				<!-- Section Name -->
				<div>
					<label for="section-name" class="mb-2 block text-sm font-medium text-gray-700">
						Section Name
					</label>
					<input
						id="section-name"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={selectedSection.name}
						onblur={(e) => updateSectionName((e.target as HTMLInputElement).value)}
					/>
				</div>

				<!-- Section Type -->
				<div>
					<div class="mb-2 block text-sm font-medium text-gray-700">Section Type</div>
					<div class="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600">
						{selectedSection.component || 'Unknown'}
					</div>
				</div>

				<!-- Visibility Settings -->
				<div>
					<div class="mb-2 block text-sm font-medium text-gray-700">Visibility</div>
					<div class="flex items-center">
						<input
							id="section-visible"
							type="checkbox"
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							checked={(selectedSection as any).visible !== false}
							onchange={(e) => {
								const sectionIndex = certificate.sections.findIndex(
									(s) => s.id === selectedSection.id
								);
								if (sectionIndex !== -1) {
									(certificate.sections[sectionIndex] as any).visible = (
										e.target as HTMLInputElement
									).checked;
								}
							}}
						/>
						<label for="section-visible" class="ml-2 text-sm text-gray-700">
							Show section in certificate
						</label>
					</div>
				</div>
			</div>
		{/if}

		<!-- Common Actions -->
		<div class="mt-6 border-t border-gray-200 pt-6">
			<div class="space-y-3">
				<button
					class="w-full rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
					onclick={() => {
						console.log('Duplicate section:', selectedSection.id);
					}}
				>
					Duplicate Section
				</button>
				<button
					class="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
					onclick={() => {
						if (confirm(`Are you sure you want to delete "${selectedSection.name}"?`)) {
							certificate.sections = certificate.sections.filter(
								(s) => s.id !== selectedSection.id
							);
							clearSelectedSection();
						}
					}}
				>
					Delete Section
				</button>
			</div>
		</div>
	{:else}
		<div class="flex h-full items-center justify-center">
			<div class="text-center">
				<div class="mx-auto h-12 w-12 text-gray-400">
					<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</div>
				<h3 class="mt-2 text-sm font-medium text-gray-900">No section selected</h3>
				<p class="mt-1 text-sm text-gray-500">Select a component to configure its properties.</p>
			</div>
		</div>
	{/if}
</div>
