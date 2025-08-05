<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	import CustomFieldEditor from '../Certificate/certificate-components/custom-field/CustomFieldEditor.svelte';
	import { draggable, droppable, type DragDropState } from '@thisux/sveltednd';
	import { flip } from 'svelte/animate';
	import { fade, scale, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	

	let showCustomFieldEditor = $state(false);
	let editingFieldId = $state<string | null>(null);
	let isNewField = $state(false);
	let isDragging = $state(false);
	let dragOverIndex = $state<number | null>(null);

	function createCustomField() {
		isNewField = true;
		editingFieldId = null;
		showCustomFieldEditor = true;
	}


	function closeEditor() {
		showCustomFieldEditor = false;
		editingFieldId = null;
		isNewField = false;
	}
</script>

<!-- Full container with horizontal overflow hidden -->
<div class="relative flex h-full flex-1 flex-col overflow-x-hidden overflow-y-auto p-6">
	<h2 class="mb-2 text-xl font-bold text-gray-900">Sections</h2>
	<p class="mb-6 text-sm text-gray-600">Drag to reorder the certificate sections.</p>

	<div class="mb-6">
		<button
			class="w-full rounded-lg bg-black px-4 py-3 font-medium text-white transition-all duration-200 hover:bg-gray-800 hover:shadow-lg active:scale-[0.97]"
			onclick={createCustomField}
		>
			+ Add Custom Field
		</button>
	</div>

	<!-- Section list wrapper with overflow-x-hidden -->
	<div class="relative flex-1 overflow-x-hidden overflow-y-auto">
		{#if isDragging}
			<div class="pointer-events-none absolute inset-0 z-50 overflow-x-hidden">
				{#each certificate.sections as _, index}
					{#if dragOverIndex === index}
						<div
							style="position: absolute; top: {index * 76 - 6}px; left: 16px; right: 16px;"
							in:scale={{ duration: 200, start: 0.8 }}
							out:scale={{ duration: 150, start: 0.8 }}
						></div>
					{/if}
				{/each}
				{#if dragOverIndex === certificate.sections.length}
					<div
						class="mx-4 h-0.5 rounded-full bg-blue-500 shadow-lg"
						style="position: absolute; top: {certificate.sections.length * 76 -
							6}px; left: 16px; right: 16px;"
						in:scale={{ duration: 200, start: 0.8 }}
						out:scale={{ duration: 150, start: 0.8 }}
					></div>
				{/if}
			</div>
		{/if}

		<ul class="relative space-y-3">
			{#each certificate.sections as section, index (section.id)}
				<li
					class="group relative flex cursor-grab items-center gap-3 rounded-lg border border-gray-200 bg-white p-4 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50 hover:shadow-md
					{isDragging && dragOverIndex === index
						? 'scale-[1.02] transform border-blue-400 bg-blue-50 shadow-lg'
						: ''} 
					{isDragging ? 'hover:scale-[1.02]' : ''}"
					use:draggable={{
						container: 'sections',
						dragData: section,
						callbacks: {
							onDragStart: () => {
								isDragging = true;
							},
							onDragEnd: () => {
								isDragging = false;
								dragOverIndex = null;
							}
						}
					}}
					animate:flip={{ duration: 400, easing: cubicOut }}
					in:fade={{ duration: 300, delay: index * 50 }}
					out:slide={{ duration: 200, axis: 'y' }}
					use:droppable={{
						container: `section-${index}`,
						callbacks: {
							onDragEnter: () => {
								if (isDragging) dragOverIndex = index;
							},
							onDragLeave: () => {
								dragOverIndex = null;
							},
							onDrop: (state: DragDropState<any>) => {
								const { draggedItem } = state;
								const fromIndex = certificate.sections.findIndex(
									(s: any) => s.id === draggedItem.id
								);
								if (fromIndex === -1 || fromIndex === index) return;

								const updated = [...certificate.sections];
								const [removed] = updated.splice(fromIndex, 1);
								updated.splice(index, 0, removed);
								certificate.sections = updated;

								setTimeout(() => {
									isDragging = false;
									dragOverIndex = null;
								}, 100);
							}
						}
					}}
				>
					{#if isDragging && dragOverIndex === index}
						<div
							class="bg-opacity-50 pointer-events-none absolute inset-0 rounded-lg border-2 border-dashed border-blue-400 bg-blue-100"
							in:fade={{ duration: 200 }}
							out:fade={{ duration: 150 }}
						></div>
					{/if}

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
						class="relative z-10 flex-shrink-0 transition-all duration-200 group-hover:scale-[1.025] group-hover:text-blue-500"
						class:text-blue-500={isDragging}
						class:scale-110={isDragging}
					>
						<circle cx="9" cy="5" r="1"></circle>
						<circle cx="15" cy="5" r="1"></circle>
						<circle cx="9" cy="12" r="1"></circle>
						<circle cx="15" cy="12" r="1"></circle>
						<circle cx="9" cy="19" r="1"></circle>
						<circle cx="15" cy="19" r="1"></circle>
					</svg>

					<span
						class="relative z-10 flex-1 font-medium text-gray-900 transition-colors duration-200"
					>
						{section.name}

					
					</span>

				
					<div
						class="relative z-10 flex translate-x-2 gap-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100"
					>
					</div>
				</li>
			{/each}
		</ul>
	</div>

	<CustomFieldEditor
		bind:isOpen={showCustomFieldEditor}
		bind:fieldId={editingFieldId}
		bind:isNewField
		onclose={closeEditor}
	/>
</div>
