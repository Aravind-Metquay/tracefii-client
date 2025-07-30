<script>
	import EditorLayout from "./EditorLayout.svelte";
	import { appState } from "./store/app-state.svelte";

</script>

<svelte:head>
  <title>Template Configuration</title>
</svelte:head>

<EditorLayout {appState} />
