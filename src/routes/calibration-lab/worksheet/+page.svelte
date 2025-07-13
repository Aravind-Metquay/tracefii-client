<script>
	import { initializeWorksheet } from "@/application-components/calibration-lab/worksheet/editor/store.svelte";
	import Worksheet from "@/application-components/calibration-lab/worksheet/worksheet.svelte";


</script>


<Worksheet worksheetManager={initializeWorksheet()} />