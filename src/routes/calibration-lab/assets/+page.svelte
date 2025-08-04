<script>
	import Button from "@/components/button/button.svelte";
	import Tooltip from "@/components/tooltip/tooltip.svelte";
	import { Building2, EllipsisVertical, Info } from "@lucide/svelte";
    import AssetsTable from "@/application-components/calibration-lab/assets/assets-table.svelte";
</script>


<svelte:head>
    <title>Assets | All assets</title>
    <meta name="description" content="A Svelte page">
</svelte:head>

<main class="w-full h-full">
    <div class="p-2 flex items-center justify-between border-b">
        <div class="flex items-center p-2 gap-2">
            <Building2  size="16"/>
            <p class="font-semibold">Assets</p>
            <Tooltip position="right" text="View all your assets here">
                <Info size="12"/>
            </Tooltip>
        </div>
        <div>
            <Button variant="secondary" size="tiny">
                <EllipsisVertical size="16" />
            </Button>
        </div>
    </div>
    <!-- <div class="h-8 border-b">

    </div>
    <div class="h-12 flex items-center gap-2 p-2">
        <Button size="small" variant="secondary">Sort</Button>
        <Button size="small" variant="secondary">Filter</Button>
    </div> -->
    <div>
        <AssetsTable />
    </div>
</main>