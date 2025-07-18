import type { Canvas, FabricObject } from 'fabric';

interface CanvasEventsOptions {
	canvas: Canvas | null;
	setSelectedObjects: (objects: FabricObject[]) => void;
	clearSelectionCallback?: () => void;
	save: () => void;
}

export function createCanvasEvents({
	canvas,
	setSelectedObjects,
	clearSelectionCallback,
	save
}: CanvasEventsOptions) {
	function attachEvents(canvasElement: HTMLCanvasElement) {
		if (!canvas) return;

		// Canvas selection events
		canvas.on('selection:created', (e: any) => {
			setSelectedObjects(e.selected || []);
		});

		canvas.on('selection:updated', (e: any) => {
			setSelectedObjects(e.selected || []);
		});

		canvas.on('selection:cleared', () => {
			setSelectedObjects([]);
			clearSelectionCallback?.();
		});

		// History save events
		canvas.on('object:modified', () => {
			save();
		});

		canvas.on('object:added', () => {
			save();
		});

		canvas.on('object:removed', () => {
			save();
		});

		// Window-level context menu prevention
		const handleContextMenu = (e: MouseEvent) => {
			e.preventDefault();
		};

		if (typeof window !== 'undefined') {
			window.addEventListener('contextmenu', handleContextMenu);
		}

		// Cleanup on destroy
		return () => {
			if (typeof window !== 'undefined') {
				window.removeEventListener('contextmenu', handleContextMenu);
			}
		};
	}

	return { attachEvents };
}
