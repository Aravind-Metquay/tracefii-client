<script>
	import SectionPanel from './components/SectionPanel/SectionPanel.svelte';
	import PaginatedCertificateArea from './components/Certificate/PaginatedCertificateArea.svelte';
	import SettingsPanel from './components/SettingsPanel/SettingsPanel.svelte';
	import TopPanel from './components/TopPanel/TopPanel.svelte';
	import SectionRenderer from './components/Modal/SectionRenderer/SectionRenderer.svelte';
	import SectionSettingsPanel from './components/SectionSettings/SectionSettingsPanel.svelte';
	import { getSelectedSection } from './lib/sectionStore.svelte';

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
		<div
			class="flex items-start justify-center overflow-auto rounded-lg border border-gray-200 bg-gray-50"
		>
			{#if selectedSection}
				<SectionRenderer />
			{:else}
				<div class="flex h-full w-full items-start justify-center rounded-md p-2">
					<!-- A4 Container: 210mm × 297mm at 96 DPI ≈ 794px × 1123px [ Adjusted a bit to fit the screen] -->
					<div class="min-h-[1123px] w-[774px]">
						<PaginatedCertificateArea />
					</div>
				</div>
			{/if}
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
