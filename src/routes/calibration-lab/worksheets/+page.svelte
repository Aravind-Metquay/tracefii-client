<script>
	import Button from "@/components/button/button.svelte";
	import Tooltip from "@/components/tooltip/tooltip.svelte";
	import { Building2, EllipsisVertical, Info } from "@lucide/svelte";
    import WorksheetsTable from "@/application-components/calibration-lab/worksheets/worksheets-table.svelte";
</script>


<svelte:head>
    <title>Worksheets | All Worksheets</title>
    <meta name="description" content="A Svelte page">
</svelte:head>

<main class="w-full h-full">
    <div class="p-2 flex items-center justify-between border-b">
        <div class="flex items-center p-2 gap-2">
            <Building2  size="16"/>
            <p class="font-semibold">Worksheets</p>
            <Tooltip position="right" text="View all your Worksheets here">
                <Info size="12"/>
            </Tooltip>
        </div>
        <div>
            <Button variant="secondary" size="tiny">
                <EllipsisVertical size="16" />
            </Button>
        </div>
    </div>
    <div>
        <WorksheetsTable />
    </div>
</main>