<script lang="ts">
	import '../app.css';
		
	let { children } = $props();
	import { ModeWatcher } from "mode-watcher";
</script>

<!-- <ModeWatcher defaultMode={"dark"}/> -->
<main class="h-[100vh] bg-[#FAFAFA]">
	{@render children()}
</main>
