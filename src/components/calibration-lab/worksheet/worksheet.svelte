<script lang="ts">
	import { setContext } from "svelte";
	import Editor from "./editor/editor.svelte";


    let {worksheet} = $props()
    setContext("worksheet" , worksheet)
</script>


<Editor />