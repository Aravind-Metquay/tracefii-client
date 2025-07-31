<script>
	import SectionPanel from './components/SectionPanel/SectionPanel.svelte';
	import PaginatedCertificateArea from './components/Certificate/PaginatedCertificateArea.svelte';
	import SettingsPanel from './components/SettingsPanel/SettingsPanel.svelte';
</script>

<main
	class="grid h-screen w-screen grid-cols-[320px_1fr_360px] gap-4 overflow-hidden bg-gray-100 p-4"
>
	<!-- Left Panel -->
	<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
		<SectionPanel />
	</div>

	<!-- Center Canvas Area -->
	<div
		class="flex items-start justify-center overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-8"
	>
		<PaginatedCertificateArea />
	</div>

	<!-- Right Panel -->
	<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
		<SettingsPanel />
	</div>
</main>
