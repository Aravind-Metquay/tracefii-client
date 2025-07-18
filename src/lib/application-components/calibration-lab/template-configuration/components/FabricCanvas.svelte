<script lang="ts">
	import { onMount } from 'svelte';
	import type { Editor } from '../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let canvasElement = $state<HTMLCanvasElement>();
	let containerElement = $state<HTMLDivElement>();

	onMount(() => {
		if (canvasElement && containerElement && editor) {
			editor.initializeCanvas(canvasElement, containerElement);
		}

		return () => {
			if (editor?.canvas) {
				editor.canvas.dispose();
			}
		};
	});
</script>

<div bind:this={containerElement} class="relative h-full w-full overflow-hidden">
	<canvas bind:this={canvasElement} class="block"></canvas>
</div>
