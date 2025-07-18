import { onMount, onDestroy } from 'svelte';
import { Point } from 'fabric';
import type { Canvas, Rect } from 'fabric';

interface AutoResizeOptions {
	canvas: Canvas | null;
	container: HTMLElement | null;
}

export function createAutoResize({ canvas, container }: AutoResizeOptions) {
	function autoZoom() {
		if (!canvas || !container) return;

		const workspace = canvas.getObjects().find((obj: any) => obj.name === 'clip') as Rect;
		if (!workspace) return;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		const scaleX = width / workspace.width;
		const scaleY = height / workspace.height;
		const scale = Math.min(scaleX, scaleY) * 0.8;

		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), scale);
		canvas.renderAll();
	}

	function handleResize() {
		if (!canvas || !container) return;
		canvas.setWidth(container.offsetWidth);
		canvas.setHeight(container.offsetHeight);
		autoZoom();
	}

	function attachEvents() {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);
		}

		onMount(() => {
			handleResize();
			return () => {
				if (typeof window !== 'undefined') {
					window.removeEventListener('resize', handleResize);
				}
			};
		});
	}

	return { autoZoom, attachEvents };
}
