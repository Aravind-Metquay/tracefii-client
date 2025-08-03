<script lang="ts">
	import { createFabricCanvasManager } from '../shared/canvas-manager.svelte';

	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let width = $state(800);
	let height = $state(800);

	const canvasManager = createFabricCanvasManager();

	$effect(() => {
		if (canvasEl) {
			canvasManager.initializeCanvas(canvasEl);
		}
	});
</script>

<div class="h-screen p-4">
	<div class="flex h-full">
		<div class="mb-4 space-x-4">
			<label>
				Width: <input
					oninput={(e) => {
						canvasManager.setDimensions(Number(e.currentTarget.value), height);
					}}
					type="number"
					min="100"
					max="2000"
					class="border px-2 py-1"
					bind:value={width}
				/>
			</label>
			<label>
				Height: <input
					oninput={(e) => {
						canvasManager.setDimensions(width, Number(e.currentTarget.value));
					}}
					type="number"
					min="100"
					max="2000"
					class="border px-2 py-1"
					bind:value={height}
				/>
			</label>
		</div>
			<canvas class="border-2 border-gray-300" bind:this={canvasEl}></canvas>
	</div>
</div>
