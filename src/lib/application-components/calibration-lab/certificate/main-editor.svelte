<script lang="ts">
	import SettingsPanel from './components/settings-panel/settings-panel.svelte';
	import TopPanel from './components/top-panel/top-panel.svelte';
	import { getSelectedSection } from './lib/section-store.svelte';
	import SectionPanel from './components/section-panel/sections-panel.svelte';
	import ModalSection from './components/edit-modal/modal-sections/modal-sections.svelte';
	import CertificateArea from './components/certificate-components/certificate-area.svelte';
	import SectionSettingsPanel from './components/edit-modal/section-settings/section-component-settings.svelte';

	let selectedSection = $derived(getSelectedSection());
</script>

<div class="flex h-screen w-screen flex-col bg-gray-100">
	<!-- Top Panel: Sits at the top of the flex container -->
	<header class="flex-shrink-0">
		<TopPanel />
	</header>
	<main
		class="grid h-screen w-screen grid-cols-[320px_1fr_340px] gap-3 overflow-hidden bg-gray-100 p-3"
	>
		<!-- Left Panel -->
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<SectionPanel />
		</div>

		<!-- Center Canvas Area -->
		<div class="flex flex-col overflow-hidden rounded-lg">
			<!-- Certificate container with proper overflow handling -->
			<div class="flex-1 overflow-auto">
				{#if selectedSection}
					<div class="flex h-full items-center justify-center">
						<ModalSection />
					</div>
				{:else}
					<div class="flex min-h-full items-start justify-center p-4">
						<CertificateArea
							isPaginated={true}
							onFieldsReady={() => console.log('paginated fields ready')}
						/>
					</div>
				{/if}
			</div>
		</div>

		<!-- Right Panel -->
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			{#if selectedSection}
				<SectionSettingsPanel />
			{:else}
				<SettingsPanel />
			{/if}
		</div>
	</main>
</div>

<style>
	/* Ensure smooth scrolling */
	.overflow-auto {
		scroll-behavior: smooth;
	}

	/* Custom scrollbar styling */
	.overflow-auto::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	.overflow-auto::-webkit-scrollbar-track {
		background: #f1f1f1;
		border-radius: 4px;
	}

	.overflow-auto::-webkit-scrollbar-thumb {
		background: #c1c1c1;
		border-radius: 4px;
	}

	.overflow-auto::-webkit-scrollbar-thumb:hover {
		background: #a8a8a8;
	}
</style>
