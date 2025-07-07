<script lang="ts">
	import '../app.css';
	import '../fonts.css';
	let { children } = $props();
</script>

<main class="h-[100vh] bg-[#FAFAFA]">
	{@render children()}
</main>
