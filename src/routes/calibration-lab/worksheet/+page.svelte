<script>
	import { initializeWorksheet } from "@/components/calibration-lab/worksheet/editor/store.svelte";
	import Worksheet from "@/components/calibration-lab/worksheet/worksheet.svelte";
	
</script>


<Worksheet worksheet={initializeWorksheet()} />