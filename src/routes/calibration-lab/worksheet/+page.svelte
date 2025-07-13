<script>
	import { initializeWorksheet } from "src/components/calibration-lab/worksheet/editor/store.svelte";
	import Worksheet from "src/components/calibration-lab/worksheet/worksheet.svelte";
	
</script>


<Worksheet worksheetManager={initializeWorksheet()} />