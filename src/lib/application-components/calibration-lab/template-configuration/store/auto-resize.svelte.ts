import type { Canvas, Rect } from 'fabric';

interface AutoResizeOptions {
	canvas: Canvas | null;
	container: HTMLElement | null;
}

export function createAutoResize({ canvas, container }: AutoResizeOptions) {
	let cleanup: (() => void) | null = null;

	function autoZoom() {
		if (!canvas || !container) return;

		const workspace = canvas.getObjects().find((obj: any) => obj.name === 'clip') as Rect;
		if (!workspace) return;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		const scaleX = width / workspace.width;
		const scaleY = height / workspace.height;
		const scale = Math.min(scaleX, scaleY) * 0.8;

		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, scale);
		canvas.renderAll();
	}

	function handleResize() {
		if (!canvas || !container) return;
		canvas.setDimensions({
			width: container.offsetWidth,
			height: container.offsetHeight
		});
		autoZoom();
	}

	function attachEvents() {
		if (typeof window !== 'undefined') {
			window.addEventListener('resize', handleResize);

			cleanup = () => {
				window.removeEventListener('resize', handleResize);
			};
		}

		// Initial resize
		handleResize();
	}

	function detachEvents() {
		if (cleanup) {
			cleanup();
			cleanup = null;
		}
	}

	return { autoZoom, attachEvents, detachEvents };
}
