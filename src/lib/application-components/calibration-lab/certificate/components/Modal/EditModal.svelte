<script lang="ts">
	import SectionSettingsPanel from '../Modal/SectionSettings/SectionSettingsPanel.svelte';
	import ModalSection from './modalSection/modalSection.svelte';
	import ComponentList from './components/ComponentList.svelte';
	import { certificate } from '@/certificate/lib/store.svelte';
	import { setSelectedSection, clearSelectedSection } from '../../lib/sectionStore.svelte';

	let { isOpen = false, onClose } = $props();

	function closeModal() {
		clearSelectedSection();
		onClose?.();
	}

	function handleSave() {
		closeModal();
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}

	// Auto-select first section when modal opens
	$effect(() => {
		if (isOpen && certificate.sections && certificate.sections.length > 0) {
			setSelectedSection(certificate.sections[0]);
		}
	});
</script>

{#if isOpen}
	<!-- Modal backdrop -->
	<div
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm"
		onclick={handleBackdropClick}
		role="dialog"
		aria-modal="true"
		tabindex="-1"
	>
		<!-- Modal content -->
		<div class="relative flex h-[90vh] w-[90vw] flex-col rounded-lg bg-white shadow-xl">
			<!-- Modal header -->
			<div class="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4">
				<h2 class="text-xl font-semibold text-gray-900">Certificate Editor</h2>
				<button
					type="button"
					class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
					onclick={closeModal}
				>
					<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Modal body - Three panel layout -->
			<div class="flex flex-1 overflow-hidden">
				<!-- Left Panel - Component List -->
				<div class="w-64 border-r border-gray-200 bg-gray-50">
					<div class="h-full">
						<ComponentList />
					</div>
				</div>

				<!-- Center Panel - Selected Component -->
				<div class="flex-1 bg-white">
					<div class="h-full">
						<ModalSection />
					</div>
				</div>

				<!-- Right Panel - Component Properties -->
				<div class="w-80 border-l border-gray-200 bg-gray-50">
					<div class="h-full">
						<SectionSettingsPanel />
					</div>
				</div>
			</div>

			<!-- Modal footer -->
			<div class="flex flex-shrink-0 justify-end border-t border-gray-200 p-4">
				<div class="flex gap-3">
					<button
						type="button"
						class="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
						onclick={closeModal}
					>
						Cancel
					</button>
					<button
						type="button"
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						onclick={handleSave}
					>
						Save
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
