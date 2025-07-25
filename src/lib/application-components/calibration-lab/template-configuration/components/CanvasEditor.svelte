
<script lang="ts">
	
	
	import type { Editor } from '../lib/types'; // Adjust path if needed
	import Footer from './Footer.svelte';

	import  fabric, { FabricObject }  from 'fabric';
	import './fabric-smart-object'; 
	
	




	let { editor, backgroundColor } = $props<{
		editor: Editor;
		backgroundColor: { r: number; g: number; b: number };
	}>();

	let canvasElement = $state<HTMLCanvasElement | undefined>();
	let containerElement = $state<HTMLDivElement | undefined>();

	function rgbToHex(rgb: { r: number; g: number; b: number }): string {
		return (
			'#' +
			[rgb.r, rgb.g, rgb.b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	}

	$effect(() => {
		if (!canvasElement || !containerElement) {
			return;
		}

		// Initialize the canvas via the editor if it hasn't been already.
		if (!editor.canvas) {
			console.log('Initializing Fabric.js canvas...');
			editor.initializeCanvas(canvasElement, containerElement);

			// The autoZoom function from your editor handles initial fitting and centering.
			editor.autoZoom?.();
		}


		///----------START: SNAPPING AND GUIDES LOGIC
		const events = {
			object: ['added', 'moving', 'moved', 'scaled', 'selected', 'mouseover'],
			mouse: ['down', 'up', 'moving', 'over', 'out']
		};

		function drawGuide(side: string, pos: number, obj: fabric.Object) {
			let ln:fabric.Line;
			const color = 'rgb(178, 207, 255)';
			const lineProps = {
				left: 0,
				top: 0,
				evented: false,
				stroke: color,
				selectable: false,
				opacity: 0
			};
			switch (side) {
				case 'top':
				case 'bottom':
				case 'centerY':
					ln = new fabric.Line([0, 0, canvas.width ?? 0, 0], { ...lineProps, left: 0, top: pos });
					break;
				case 'left':
				case 'right':
				case 'centerX':
					ln = new fabric.Line([0, 0, 0, canvas.height ?? 0], { ...lineProps, left: pos, top: 0 });
					break;
				default:
					return;
			}

			const guides = (obj as any).guides;
			if (guides && guides[side] ) {
				canvas.remove(guides[side]);
				delete guides[side];
			}
			guides[side] = ln;
			canvas.add(ln).renderAll();
		}

		function drawObjectGuides(obj: fabric.Object) {
			const w = obj.getScaledWidth();
			const h = obj.getScaledHeight();
			if (typeof obj.top !== 'number' || typeof obj.left !== 'number') return;
			drawGuide('top', obj.top, obj);
			drawGuide('left', obj.left, obj);
			drawGuide('centerX', obj.left + w / 2, obj);
			drawGuide('centerY', obj.top + h / 2, obj);
			drawGuide('right', obj.left + w, obj);
			drawGuide('bottom', obj.top + h, obj);
			obj.setCoords();
		}

		function inRange(a: number, b: number): boolean {
			return Math.abs(a - b) <= 10;
		}

		function snapObject(obj: fabric.Object, side: string, pos: number) {
			obj.set(side as any, pos);
			obj.setCoords();
			drawObjectGuides(obj);
		}

		function onObjectMoving(e: any) {
			const obj = e.target;
			if (!obj || !(obj instanceof fabric.Rect) || !(obj as any).guides) return;
			drawObjectGuides(obj);
			const objects = canvas.getObjects().filter((o:FabricObject) => o.type !== 'line' && o !== obj);
			const matches = new Set<string>();

			for (const i of objects) {
				const iGuides = (i as any).guides;
				const objGuides = (obj as any).guides;
				if (!iGuides) continue;
				for (const side in objGuides) {
					const axis: 'left' | 'top' = side.includes('X') ? 'left' : 'top';
					if (objGuides[side] && iGuides[side] && inRange(objGuides[side][axis], iGuides[side][axis])) {
						matches.add(side);
						snapObject(obj, axis, iGuides[side][axis]);
					}
				}
			}
			for (const k of matches) {
				const objGuides = (obj as any).guides;
				if (objGuides[k]) objGuides[k].set('opacity', 1);
			}
			obj.setCoords();
		}

		function onObjectAdded(e:any) {
			const obj = e.target;
			if (!obj || !(obj instanceof fabric.Rect)) return;
			(obj as any).guides = (obj as any).guides || {};
			drawObjectGuides(obj);
		}

		function onObjectMoved(e:any) {
			const obj = e.target;
			if (!obj || !(obj instanceof fabric.Rect)) return;
			drawObjectGuides(obj);
		}

		function bindEvents() {
			canvas.on('object:added', onObjectAdded);
			canvas.on('object:moving', onObjectMoving);
			canvas.on('object:moved', onObjectMoved);
		}
		
		function initSnapping() {
			bindEvents();
			const snappy = new (fabric as any).SnappyRect({ width: 150, height: 150, fill: 'yellow', top: 10, left: 10 });
			(snappy as any).guides = {};
			canvas.add(snappy);
			const standardRect = new fabric.Rect({ left: 300, top: 200, fill: 'green', width: 100, height: 100 });
			(standardRect as any).guides = {};
			canvas.add(standardRect);
			canvas.renderAll();
		}


		// Run the initialization for the snapping logic
		initSnapping();
	
		//----------------END: SNAPPING AND GUIDES LOGIC 


		// 3. Update the background color. This runs on init and when the prop changes.
		const hexColor = rgbToHex(backgroundColor);
		editor.changeBackground(hexColor);

		const canvas = editor.canvas;
		if (!canvas) return;

		// 4. Set up the ResizeObserver to handle responsive resizing.
		const resizeObserver = new ResizeObserver(() => {
			// Let the editor's autoZoom function handle the resizing logic.
			editor.autoZoom?.();
		});

		resizeObserver.observe(containerElement);

		// Return a cleanup function.
		// This runs when the component is destroyed to prevent memory leaks.
		return () => {
			console.log('Cleaning up canvas editor...');
			resizeObserver.disconnect();
			// The editor itself can handle disposing the canvas if needed.
		};
	});
</script>

<div class="canvas-editor flex h-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div
			bind:this={containerElement}
			class="relative flex h-full w-full items-center justify-center overflow-hidden"
		>
			<!-- Canvas takes full container size -->
			<canvas
				bind:this={canvasElement}
				class="block max-h-full max-w-full"
				style="
					width: 100%; 
					height: 100%; 
					display: block;
				"
			></canvas>
		</div>
	</div>
	<Footer {editor} />
</div>

<style>
	.canvas-editor {
		display: flex;
		flex-direction: column;
		height: 100%;
		width: 100%;
	}
	canvas {
		display: block;
	}
</style>
