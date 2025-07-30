<script lang="ts">
	import * as fabric from 'fabric';
	let canvasEl = $state<HTMLCanvasElement | null>(null);
	let fabricCanvas: fabric.Canvas | null = null;

	let width = $state(800);
	let height = $state(800);

	$effect(() => {
		if (canvasEl && !fabricCanvas) {

			fabricCanvas = new fabric.Canvas(canvasEl, {
				width: width,
				height: height,
				backgroundColor: '#ffffff'
			});

            const text = new fabric.Textbox('Fabric.JS');
            const text2 = new fabric.Textbox('Fabric.JS');

            fabricCanvas.add(text, text2);
            fabricCanvas.centerObject(text);
            fabricCanvas.setActiveObject(text);

            fabricCanvas.on('object:moving' , ()=>console.log("Hello World"))
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
</script>

<div class="h-screen">
	<label for="Width">Width</label>
	<input bind:value={width} type="number" />

	<label for="Height">Height</label>
	<input bind:value={height} type="number" />

	<div class="flex h-full items-center justify-center">
		<canvas bind:this={canvasEl}></canvas>
	</div>
</div>
