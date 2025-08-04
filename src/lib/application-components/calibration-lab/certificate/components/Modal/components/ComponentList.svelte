<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import { getSelectedSection, setSelectedSection } from '../../../lib/sectionStore.svelte';

	let selectedSection = $derived(getSelectedSection());

	function handleSectionClick(section: any) {
		setSelectedSection(section);
	}

	function isSelected(section: any) {
		return selectedSection?.id === section.id;
	}
</script>

<div class="h-full overflow-y-auto p-4">
	<div class="mb-4">
		<h2 class="text-lg font-semibold text-gray-900">Components</h2>
		<p class="text-sm text-gray-600">Select a component to edit</p>
	</div>

	<div class="space-y-2">
		{#each certificate.sections as section (section.id)}
		{#if section.name!="Calibration Data"}
			<button
				class="w-full rounded-lg border p-3 text-left transition-all duration-200 {isSelected(
					section
				)
					? 'border-blue-500 bg-blue-50 text-blue-900'
					: 'border-gray-200 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'}"
				onclick={() => handleSectionClick(section)}
			>
				<div class="flex items-center justify-between">
					<div>
						<h3 class="font-medium">{section.name}</h3>
						<p class="text-xs text-gray-500">{section.component}</p>
					</div>
					{#if section.isCustom}
						<span
							class="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800"
						>
							Custom
						</span>
					{/if}
				</div>
			</button>
			{/if}
		{/each}
	</div>

	{#if certificate.sections.length === 0}
		<div class="flex h-32 items-center justify-center">
			<div class="text-center">
				<p class="text-sm text-gray-500">No components available</p>
			</div>
		</div>
	{/if}
</div>
