<script>
    import SectionPanel from './components/SectionPanel/SectionPanel.svelte';
    import PaginatedCertificateArea from './components/Certificate/PaginatedCertificateArea.svelte';
    import SettingsPanel from './components/SettingsPanel/SettingsPanel.svelte';
    import TopPanel from './components/TopPanel/TopPanel.svelte';
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
    <div class="flex items-start justify-center overflow-auto rounded-lg">
        <div class="flex h-full w-full rounded-md items-start justify-center p-2">
            <!-- A4 Container: 210mm × 297mm at 96 DPI ≈ 794px × 1123px [ Adjusted a bit to fit the screen] -->
            <div class="min-h-[1123px] w-[774px]">
                <PaginatedCertificateArea />
            </div>
        </div>
    </div>
    <!-- Right Panel -->
    <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <SettingsPanel />
    </div>
</main>
</div>
