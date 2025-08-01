import * as fabric from 'fabric';

let canvasInstance: fabric.Canvas | null = null;
let currentElement: HTMLCanvasElement | null = null;

interface FabricCanvasManager {
	canvas: fabric.Canvas | null;
	initializeCanvas: (element: HTMLCanvasElement, options?: fabric.CanvasOptions) => fabric.Canvas;
	getCanvas: () => fabric.Canvas | null;
	disposeCanvas: () => void;
	setDimensions: (width: number, height: number) => void;
	addText: (value: string) => void
}

export function createFabricCanvasManager(): FabricCanvasManager {
	const setupEventHandlers = (canvas: fabric.Canvas): void => {
		const constrainObject = (obj: fabric.Object) => {
			if (!obj.canvas) return;
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
				obj.getBoundingRect().left + obj.getBoundingRect().width + obj.cornerSize > obj.canvas.width
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
		};

		canvas.on('object:scaling', (e) => constrainObject(e.target!));
		canvas.on('object:moving', (e) => constrainObject(e.target!));
	};

	const initializeCanvas = (
		element: HTMLCanvasElement,
		options?: fabric.CanvasOptions
	): fabric.Canvas => {
		if (canvasInstance && currentElement === element) {
			return canvasInstance;
		}
		disposeCanvas();

		canvasInstance = new fabric.Canvas(element, {
			width: 600,
			height: 400,
			backgroundColor: '#ffffff',
			...options
		});

		// const workspace = new fabric.Rect({
		// 	width: 600,
		// 	height: 400,
		// 	name: 'clip',
		// 	fill: 'white',
		// 	selectable: false,
		// 	hasControls: false,
		// 	hoverCursor: 'default',
		// 	moveCursor: 'default',
		// 	shadow: new fabric.Shadow({
		// 		color: 'rgba(0,0,0,0.1)',
		// 		blur: 10,
		// 		offsetX: 0,
		// 		offsetY: 2
		// 	})
		// });

		// canvasInstance.add(workspace);
		// canvasInstance.centerObject(workspace);
		currentElement = element;
		setupEventHandlers(canvasInstance);
		canvasInstance.renderAll.bind(canvasInstance);
		return canvasInstance;
	};

	const getCanvas = (): fabric.Canvas | null => {
		return canvasInstance;
	};

	const disposeCanvas = (): void => {
		if (canvasInstance) {
			canvasInstance.dispose();
			canvasInstance = null;
			currentElement = null;
		}
	};

	const setDimensions = (width: number, height: number): void => {
		if (canvasInstance) {
			canvasInstance.setDimensions({ width, height });
		}
	};

	const addText = (value: string): void => {
		if (canvasInstance) {
			canvasInstance.add()
		}
	};
	return {
		get canvas() {
			return canvasInstance;
		},
		initializeCanvas,
		getCanvas,
		disposeCanvas,
		setDimensions,
		addText
	};
}
