<script lang="ts">
	import { setContext } from "svelte";
	import Editor from "./editor/editor.svelte";


    let {worksheetManager} = $props()
    setContext("worksheetManager" , worksheetManager)
</script>


<Editor />