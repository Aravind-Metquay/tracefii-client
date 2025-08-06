<script>
	import SectionPanel from './components/SectionPanel/SectionPanel.svelte';
	import UnifiedCertificateArea from './components/Certificate/UnifiedCertificateArea.svelte';
	import SettingsPanel from './components/SettingsPanel/SettingsPanel.svelte';
	import TopPanel from './components/TopPanel/TopPanel.svelte';
	import ModalSection from './components/Modal/modalSection/modalSection.svelte';
	import SectionSettingsPanel from './components/Modal/SectionSettings/SectionSettingsPanel.svelte';
	import { getSelectedSection } from './lib/sectionStore.svelte';

	let selectedSection = $derived(getSelectedSection());
	
	
	let isPaginated = $state(false);
	
	
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
						
						 <UnifiedCertificateArea
							isPaginated={true}
						 onFieldsReady={() => console.log('paginated fields ready')} />
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
	/* ADDED: Styling for the certificate container */
	.certificate-container {
		/* A4 size approximation: 210mm × 297mm at 96 DPI ≈ 794px × 1123px */
		width: 774px;
		min-height: 1123px;
		margin: 0 auto;
	}
	
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