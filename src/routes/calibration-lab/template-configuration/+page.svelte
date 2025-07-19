<script lang="ts">
	import Editor from '@/application-components/calibration-lab/template-configuration/EditorLayout.svelte';
	import { appState } from '@/application-components/calibration-lab/template-configuration/store/app-state.svelte.ts';
</script>

<Editor {appState} />
