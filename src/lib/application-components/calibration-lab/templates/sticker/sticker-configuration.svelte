<!-- <script lang="ts">
	import * as fabric from 'fabric';
	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let fabricCanvas: fabric.Canvas | null = null;

	let width = $state(800);
	let height = $state(800);
	let isInitializing = false;

	$effect(() => {
		if (canvasEl && !fabricCanvas) {
			isInitializing = true;

			fabricCanvas = new fabric.Canvas(canvasEl, {
				width: width,
				height: height,
				backgroundColor: '#ffffff'
			});

			const text = new fabric.Textbox('Fabric.JS', {
				left: width / 2 - 50,
				top: height / 2 - 50
			});
			const text2 = new fabric.Textbox('Fabric.JS 2', {
				left: width / 2 - 50,
				top: height / 2 + 50
			});

			fabricCanvas.add(text, text2);
			fabricCanvas.setActiveObject(text);

			isInitializing = false;
		}

		if (fabricCanvas && !isInitializing) {
			fabricCanvas.on('object:scaling', function (e) {
                const obj = e.target;

                if(!obj.canvas) throw new Error("No object found")

				if (obj.height > obj.canvas.height || obj.width > obj.canvas.width) {
					obj.setY(obj.scaleY);
					obj.setX(obj.scaleX);
				}
				obj.setCoords();
				if (
					obj.getBoundingRect().top - obj.cornerSize / 2 < 0 ||
					obj.getBoundingRect().left - obj.cornerSize / 2 < 0
				) {
					obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top + obj.cornerSize / 2);
					obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left + obj.cornerSize / 2);
				}
				if (
					obj.getBoundingRect().top + obj.getBoundingRect().height + obj.cornerSize >
						obj.canvas.height ||
					obj.getBoundingRect().left + obj.getBoundingRect().width + obj.cornerSize >
						obj.canvas.width
				) {
					obj.top = Math.min(
						obj.top,
						obj.canvas.height -
							obj.getBoundingRect().height +
							obj.top -
							obj.getBoundingRect().top -
							obj.cornerSize / 2
					);
					obj.left = Math.min(
						obj.left,
						obj.canvas.width -
							obj.getBoundingRect().width +
							obj.left -
							obj.getBoundingRect().left -
							obj.cornerSize / 2
					);
				}
			});

			fabricCanvas.on('object:moving', function (e) {
				var obj = e.target;
                if(!obj.canvas) throw new Error('Obj not found.')
				if (obj.height > obj.canvas.height || obj.width > obj.canvas.width) {
					obj.setY(obj.scaleY);
					obj.setX(obj.scaleX);
				}
				obj.setCoords();
				if (
					obj.getBoundingRect().top - obj.cornerSize / 2 < 0 ||
					obj.getBoundingRect().left - obj.cornerSize / 2 < 0
				) {
					obj.top = Math.max(obj.top, obj.top - obj.getBoundingRect().top + obj.cornerSize / 2);
					obj.left = Math.max(obj.left, obj.left - obj.getBoundingRect().left + obj.cornerSize / 2);
				}
				if (
					obj.getBoundingRect().top + obj.getBoundingRect().height + obj.cornerSize >
						obj.canvas.height ||
					obj.getBoundingRect().left + obj.getBoundingRect().width + obj.cornerSize >
						obj.canvas.width
				) {
					obj.top = Math.min(
						obj.top,
						obj.canvas.height -
							obj.getBoundingRect().height +
							obj.top -
							obj.getBoundingRect().top -
							obj.cornerSize / 2
					);
					obj.left = Math.min(
						obj.left,
						obj.canvas.width -
							obj.getBoundingRect().width +
							obj.left -
							obj.getBoundingRect().left -
							obj.cornerSize / 2
					);
				}
			});
		}

		return () => {
			if (fabricCanvas) {
				fabricCanvas.dispose();
				fabricCanvas = null;
			}
		};
	});

	$effect(() => {
		if (fabricCanvas) {
			fabricCanvas.setDimensions({
				width: width,
				height: height
			});
			fabricCanvas.renderAll();
		}
	});

</script> -->

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

		// return () => {
		// 	canvasManager.disposeCanvas();
		// };
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
