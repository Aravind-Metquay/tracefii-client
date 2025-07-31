<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import { dndzone } from 'svelte-dnd-action';
	import CustomFieldEditor from '../Certificate/certificate-components/custom-field/CustomFieldEditor.svelte';

	const flipDurationMs = 300;

	let showCustomFieldEditor = $state(false);
	let editingFieldId = $state<string | null>(null);
	let isNewField = $state(false);

	// These handlers update the state when the user drags and drops a section.
	function handleDndConsider(e: CustomEvent) {
		certificate.sections = e.detail.items;
	}

	function handleDndFinalize(e: CustomEvent) {
		certificate.sections = e.detail.items;
	}

	function createCustomField() {
		isNewField = true;
		editingFieldId = null;
		showCustomFieldEditor = true;
	}

	function editCustomField(section: any) {
		if (section.isCustom && section.customData?.fieldId) {
			isNewField = false;
			editingFieldId = section.customData.fieldId;
			showCustomFieldEditor = true;
		}
	}

	function deleteCustomField(section: any) {
		if (section.isCustom && section.customData?.fieldId) {
			if (confirm(`Are you sure you want to delete "${section.name}"?`)) {
				// Remove from custom fields
				delete certificate.customFields[section.customData.fieldId];

				// Remove from sections
				certificate.sections = certificate.sections.filter((s) => s.id !== section.id);
			}
		}
	}

	function closeEditor() {
		showCustomFieldEditor = false;
		editingFieldId = null;
		isNewField = false;
	}
</script>

<div class="flex h-full flex-col p-6">
	<h2 class="mb-2 text-xl font-bold text-gray-900">Sections</h2>
	<p class="mb-6 text-sm text-gray-600">Drag to reorder the certificate sections.</p>

	<div class="mb-6">
		<button
			class="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800"
			onclick={createCustomField}
		>
			+ Add Custom Field
		</button>
	</div>

	<ul
		class="flex-1 space-y-3 overflow-y-auto"
		use:dndzone={{ items: certificate.sections, flipDurationMs }}
		onconsider={handleDndConsider}
		onfinalize={handleDndFinalize}
	>
		{#each certificate.sections as section (section.id)}
			<li
				class="group flex cursor-grab items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:bg-gray-50"
			>
				<!-- Drag handle icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
					class="flex-shrink-0 text-gray-400 group-hover:text-gray-600"
				>
					<circle cx="12" cy="5" r="1"></circle>
					<circle cx="12" cy="12" r="1"></circle>
					<circle cx="12" cy="19" r="1"></circle>
				</svg>

				<span class="flex-1 font-medium text-gray-900">{section.name}</span>

				{#if section.isCustom}
					<div class="flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
						<button
							class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-sm transition-colors hover:bg-gray-200"
							onclick={(e) => {
								e.stopPropagation();
								editCustomField(section);
							}}
							title="Edit custom field"
						>
							✏️
						</button>
						<button
							class="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-sm transition-colors hover:bg-red-100 hover:text-red-600"
							onclick={(e) => {
								e.stopPropagation();
								deleteCustomField(section);
							}}
							title="Delete custom field"
						>
							🗑️
						</button>
					</div>
				{:else}
					<span class="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600"
						>Built-in</span
					>
				{/if}
			</li>
		{/each}
	</ul>

	<CustomFieldEditor
		bind:isOpen={showCustomFieldEditor}
		bind:fieldId={editingFieldId}
		bind:isNewField
		onClose={closeEditor}
	/>
</div>
