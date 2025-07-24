	import Editor from '@/application-components/calibration-lab/template-configuration/EditorLayout.svelte';
	import { appState as importedAppState } from '@/application-components/calibration-lab/template-configuration/store/app-state.svelte.ts';

	let appState = importedAppState;
</script>

<Editor bind:appState />
