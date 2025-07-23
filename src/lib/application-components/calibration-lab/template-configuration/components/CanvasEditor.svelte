<!-- CanvasEditor.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import Footer from './Footer.svelte';
	import type { Editor } from '../lib/types';
	import type { Color } from 'fabric';
	
	


	let {editor,backgroundColor } = $props<{ editor: Editor ,backgroundColor: { r: number; g: number; b: number }}>();
	let canvasElement = $state<HTMLCanvasElement>();
	let containerElement = $state<HTMLDivElement>();

	function rgbToHex(rgb: { r: number; g: number; b: number }): string {
		return '#' + [rgb.r, rgb.g, rgb.b]
			.map(x => {
				const hex = x.toString(16);
				return hex.length === 1 ? '0' + hex : hex;
			})
			.join('');
	}
		
	$effect(() => {
				if (editor?.canvas && backgroundColor) {
					const hexColor = rgbToHex(backgroundColor);
					editor.canvas.backgroundColor = hexColor;
					
					// Also update workspace fill if it exists
					const workspace = editor.getWorkspace?.();
					if (workspace) {
						workspace.set('fill', hexColor);
					}
					
					editor.canvas.requestRenderAll();
				}
	});

	onMount(() => {
		let resizeObserver: ResizeObserver | null = null;

		if (canvasElement && containerElement && editor) {
			const initializeWhenReady = () => {
				if (!containerElement) return;

				// Get actual computed dimensions instead of offset dimensions
				const containerRect = containerElement.getBoundingClientRect();
				const width = containerRect.width;
				const height = containerRect.height;

				console.log('Container dimensions:', { width, height }); // Debug log

				if (width > 0 && height > 0 && canvasElement) {
					// Set canvas element dimensions to container size
					canvasElement.width = width;
					canvasElement.height = height;
					canvasElement.style.width = width + 'px';
					canvasElement.style.height = height + 'px';

					// Initialize the editor canvas
					editor.initializeCanvas(canvasElement, containerElement,{
						
						backgroundColor: rgbToHex(backgroundColor)
						
					});

	

					// Force canvas to have proper dimensions and render
					if (editor.canvas) {
						// Set the canvas viewport size to match container
						editor.canvas.setDimensions({ width, height });

						// Get the workspace and center it in the viewport
						const workspace = editor.getWorkspace();
						if (workspace) {
							// Center the workspace in the larger canvas viewport
							const workspaceCenter = workspace.getCenterPoint();
							const canvasCenter = {
								x: width / 2,
								y: height / 2
							};

							// Calculate offset to center workspace
							const offsetX = canvasCenter.x - workspaceCenter.x;
							const offsetY = canvasCenter.y - workspaceCenter.y;

							// Apply the centering transform
							const vpt = editor.canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
							vpt[4] = offsetX;
							vpt[5] = offsetY;
							editor.canvas.setViewportTransform(vpt);
						}

						// Set initial zoom to fit workspace nicely in viewport
						if (workspace) {
							const workspaceSize = editor.workspaceSize;
							const padding = 50; // 50px padding around workspace
							const scaleX = (width - padding * 2) / workspaceSize.width;
							const scaleY = (height - padding * 2) / workspaceSize.height;
							const optimalZoom = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 1:1

							editor.canvas.setZoom(optimalZoom);

							// Re-center after zoom
							const workspaceCenter = workspace.getCenterPoint();
							const canvasCenter = {
								x: width / 2,
								y: height / 2
							};

							const offsetX = canvasCenter.x - workspaceCenter.x * optimalZoom;
							const offsetY = canvasCenter.y - workspaceCenter.y * optimalZoom;

							const vpt = editor.canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
							vpt[4] = offsetX;
							vpt[5] = offsetY;
							editor.canvas.setViewportTransform(vpt);
						}

						// Force an immediate render after setting dimensions
						editor.canvas.requestRenderAll();
						editor.syncCanvasState();
					}

					// Set up resize observer for responsive behavior
					resizeObserver = new ResizeObserver((entries) => {
						for (const entry of entries) {
							const { width: newWidth, height: newHeight } = entry.contentRect;
							if (editor.canvas && newWidth > 0 && newHeight > 0 && canvasElement) {
								// Update canvas element dimensions
								canvasElement.width = newWidth;
								canvasElement.height = newHeight;
								canvasElement.style.width = newWidth + 'px';
								canvasElement.style.height = newHeight + 'px';

								// Update canvas viewport dimensions
								editor.canvas.setDimensions({
									width: newWidth,
									height: newHeight
								});

								// Re-center workspace in new viewport
								const workspace = editor.getWorkspace();
								if (workspace) {
									const workspaceCenter = workspace.getCenterPoint();
									const canvasCenter = {
										x: newWidth / 2,
										y: newHeight / 2
									};

									const currentZoom = editor.canvas.getZoom();
									const offsetX = canvasCenter.x - workspaceCenter.x * currentZoom;
									const offsetY = canvasCenter.y - workspaceCenter.y * currentZoom;

									const vpt = editor.canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
									vpt[4] = offsetX;
									vpt[5] = offsetY;
									editor.canvas.setViewportTransform(vpt);
								}

								editor.canvas.requestRenderAll();
								editor.syncCanvasState();
							}
						}
					});
					 resizeObserver.observe(containerElement);
				} else {
					// Retry if container still has no dimensions
					setTimeout(initializeWhenReady, 10);
				}
			};

			// Give the DOM more time to settle
			setTimeout(() => {
				initializeWhenReady();
			}, 50);
		}

		return () => {
			resizeObserver?.disconnect();
			if (editor?.canvas) {
				editor.canvas.dispose();
			}
		};
	});
</script>

<div class="canvas-editor flex h-full flex-col">
	<div class="min-h-0 w-full flex-1">
		<div
			bind:this={containerElement}
			class="relative flex h-full w-full items-center justify-center overflow-hidden "
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

			<!-- Optional: Workspace size indicator -->
			{#if editor?.workspaceSize}
				<div
					class="absolute bottom-4 left-4 rounded bg-white/80 px-2 py-1 text-xs text-gray-600 backdrop-blur-sm"
				>
					Workspace: {editor.workspaceSize.width}×{editor.workspaceSize.height}
				</div>
			{/if}
		</div>
	</div>

	<Footer {editor} />
</div>

<style>
	.canvas-editor {
		/* Ensure the editor takes full available space */
		width: 100%;
		height: 100%;
	}

	/* Canvas fills the container while workspace is centered within */
	canvas {
		position: relative;
		max-width: 100%;
		max-height: 100%;
	}
</style>
