<script lang="ts">
	import { setContext } from "svelte";
	import Editor from "./editor/editor.svelte";
	import ExpressionEditor from "./editor/expression-editor/editor.svelte";
	import { Drawer } from "@/components";
    

    let {worksheetManager} = $props()
    setContext("worksheetManager" , worksheetManager)
    let open : boolean = $state(false)
</script>


<button onclick={()=>open = true}>OPen</button>
<!-- <Editor /> -->
<Drawer bind:open={open} position="bottom">
  <ExpressionEditor />
</Drawer>