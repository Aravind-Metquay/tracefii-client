<script>
	import { onMount } from 'svelte';

	let { editor } = $props();
	let canvasElement = $state();
	let containerElement = $state();

	onMount(() => {
		if (canvasElement && containerElement && editor) {
			editor.initializeCanvas(canvasElement, containerElement);
		}

		return () => {
			if (editor.canvas) {
				editor.canvas.dispose();
			}
		};
	});
</script>

<div
	bind:this={containerElement}
	class="flex h-full w-full items-center justify-center"
>
	<canvas bind:this={canvasElement} class="border border-gray-300 shadow-lg"></canvas>
</div>

