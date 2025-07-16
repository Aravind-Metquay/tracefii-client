<script>
	import EditorLayout from "./components/EditorLayout.svelte";
	import { appState } from "./store/app-state.svelte";

</script>

<svelte:head>
  <title>Template Configuration</title>
</svelte:head>

<EditorLayout {appState} />
