import type { Canvas, FabricObject, ActiveSelection } from 'fabric';

interface ClipboardOptions {
	canvas: Canvas | null;
}

export function createClipboard({ canvas }: ClipboardOptions) {
	let clipboard: FabricObject | null = null;

	function copy() {
		if (!canvas) return;
		const activeObjects = canvas.getActiveObjects();
		if (activeObjects.length > 0) {
			const activeObject = canvas.getActiveObject();
			if (activeObject) {
				activeObject.clone().then((cloned: FabricObject) => {
					clipboard = cloned;
				});
			}
		}
	}

	function paste() {
		if (!canvas || !clipboard) return;
		clipboard.clone().then((cloned: FabricObject) => {
			if (!canvas) return;
			canvas.discardActiveObject();
			cloned.set({
				left: (cloned.left || 0) + 10,
				top: (cloned.top || 0) + 10,
				evented: true
			});
			if (cloned.type === 'activeSelection') {
				(cloned as ActiveSelection).canvas = canvas;
				(cloned as ActiveSelection).forEachObject((obj: FabricObject) => {
					console.log("DEBUG: An object is being added from clipboard.svelte.ts inside store from function paste if condition if (cloned.type === 'activeSelection') ");
					canvas.add(obj);
				});
				(cloned as ActiveSelection).setCoords();
			} else {
				console.log("DEBUG: An object is being added from clipboard.svelte.ts inside store from function paste else condition");
				canvas.add(cloned);
			}
			canvas.setActiveObject(cloned);
			canvas.requestRenderAll();
		});
	}

	return { copy, paste };
}
