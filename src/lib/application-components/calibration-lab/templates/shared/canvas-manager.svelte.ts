import * as fabric from 'fabric';
import JsBarcode from 'jsbarcode';
import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';

let canvasInstance: fabric.Canvas | null = null;
let currentElement: HTMLCanvasElement | null = null;

// Object Snapping Interfaces
interface ObjectGuides {
	left: { left: number; top: number };
	right: { left: number; top: number };
	top: { left: number; top: number };
	bottom: { left: number; top: number };
	centerX: { left: number; top: number };
	centerY: { left: number; top: number };
}

interface SnapGuide extends fabric.FabricObject {
	isSnapGuide?: boolean;
}

// Snapping constants
const SNAP_THRESHOLD = 10;
const GUIDE_COLOR = 'rgb(178, 207, 255)';
let snapGuides: SnapGuide[] = [];
let snapTimeout: number | null = null;

interface FabricCanvasManager {
	canvas: fabric.Canvas | null;
	initializeCanvas: (element: HTMLCanvasElement, options?: fabric.CanvasOptions) => fabric.Canvas;
	getCanvas: () => fabric.Canvas | null;
	disposeCanvas: () => void;
	setDimensions: (width: number, height: number) => void;
	addText: (text?: string) => void;
	addToCanvas: (component: fabric.FabricObject) => void;
	addQRcode: (data?: string | null) => Promise<void>;
	updateQRCode: (options: { expression: string; errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H' }) => Promise<void>; 
	addBarcode: (data?: string | null) => Promise<void>;
	addImage: (fileOrUrl: File | string) => Promise<void>;
	savePng: () => void;
	saveJpg: () => void;
	saveSvg: () => void;
	savePdf: () => void;
	saveJson: () => Promise<void>;
	bringForward: () => void;
	sendBackwards: () => void;
	changeFontFamily: (value: string) => void;
	changeFontSize: (value: number) => void;
	changeFontWeight: (value?: number) => void;
	changeFontStyle: (value?: 'normal' | 'italic' | 'oblique') => void;
	changeFontUnderline: (value?: boolean) => void;
	changeTextAlign: (value: string) => void;
	changeOpacity: (value: number) => void;
	changeFillColor: (value: string) => void;
	changeSize: (value: { width: number; height: number }) => void;
	changeBackground: (value: string) => void;
	alignObjects: (alignment: 'left' | 'center' | 'right') => void;
	deleteSelected: () => void;
	duplicateSelected: () =>Promise<void>;
	setZoom: (value: number) => void;
	zoomIn: () => void;
	zoomOut: () => void;
}

export const createFabricCanvasManager = (): FabricCanvasManager => {
	// Event Handlers
	const setupEventHandlers = (canvas: fabric.Canvas): void => {
		const constrainObject = (obj: fabric.Object) => {
			if (!obj.canvas) return;
			// if (obj.height > obj.canvas.height || obj.width > obj.canvas.width) {
			// 	obj.setY(obj.scaleY);
			// 	obj.setX(obj.scaleX);
			// }
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
		if (canvasInstance && currentElement === element) return canvasInstance;
		disposeCanvas();

		canvasInstance = new fabric.Canvas(element, {
			width: 600,
			height: 400,
			backgroundColor: '#ffffff',
			...options
		});

		setupObjectSnapping();
		currentElement = element;
		setupEventHandlers(canvasInstance);
		canvasInstance.renderAll();
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
		console.log(
			`%c[3. CanvasManager] Received setDimensions. Resizing canvas to: ${width} x ${height}`,
			'color: red; font-weight: bold;'
		);
		if (canvasInstance) {
			canvasInstance.setDimensions({ width, height });
		}
	};

	// Object Addition
	const addToCanvas = (component: fabric.FabricObject): void => {
		if (canvasInstance) {
			canvasInstance.add(component);
			canvasInstance.setActiveObject(component);
			canvasInstance.renderAll();
		}
	};

	const addText = (text: string = 'Sample Text'): void => {
		if (canvasInstance) {
			const textElement = new fabric.IText(text, {
				left: 50,
				top: 50,
				fill: '#000000',
				fontFamily: 'Arial',
				fontSize: 24,
				fontWeight: 400,
				width: 200,
				height: 50,
				selectable: true,
				evented: true,
				moveCursor: 'move',
				hoverCursor: 'move'
			});
			addToCanvas(textElement);
		}
	};

	// const addQRcode = async (data?: string | null): Promise<void> => {
	// 	if (!canvasInstance) return;
	// 	const template = '{{default_qrcode}}';
	// 	const finalValue = template.replace(
	// 		'{{default_qrcode}}',
	// 		data || `https://metquay.com/generated/${Date.now()}`
	// 	);
	// 	const dataUrl = await QRCode.toDataURL(finalValue, { errorCorrectionLevel: 'H', width: 100 });
	// 	const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });

	// 	img.set({
	// 		left: 50,
	// 		top: 50,
	// 		scaleX: 1.5,
	// 		scaleY: 1.5,
	// 		selectable: true,
	// 		evented: true,
	// 		moveCursor: 'move',
	// 		hoverCursor: 'move',
	// 		data: { type: 'QR Code', expression: template, errorCorrectionLevel: 'H' }
	// 	});
	// 	addToCanvas(img);
	// };
	const addQRcode = async (data?: string | null): Promise<void> => {
		if (!canvasInstance) return;
		const template = '{{default_qrcode}}';
		const finalValue = template.replace(
			'{{default_qrcode}}',
			data || `https://metquay.com/generated/${Date.now()}`
		);
		const dataUrl = await QRCode.toDataURL(finalValue, { errorCorrectionLevel: 'H', width: 256 });
		const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });

		img.set({
			left: 50,
			top: 50,
			// Add custom data for identifying and editing this object later
			data: {
				type: 'QR Code',
				expression: template,
				errorCorrectionLevel: 'H'
			}
		});
		addToCanvas(img);
	};
	
	const updateQRCode = async (options: {
		expression: string;
		errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
	}): Promise<void> => {
		if (!canvasInstance) return;
		const objectToUpdate = canvasInstance.getActiveObject() as fabric.Image & { data?: any };

		if (!objectToUpdate || objectToUpdate.data?.type !== 'QR Code') {
			return;
		}

		try {
			// Evaluate the expression to get the final value
			const finalValue = options.expression.replace(
				'{{default_qrcode}}',
				`https://metquay.com/generated/${Date.now()}`
			);

			const newUrl = await QRCode.toDataURL(finalValue, {
				errorCorrectionLevel: options.errorCorrectionLevel,
				width: 256
			});

			const originalScaledWidth = objectToUpdate.getScaledWidth();
			const originalScaledHeight = objectToUpdate.getScaledHeight();

			// Update the custom data on the existing object
			objectToUpdate.set('data', {
				...objectToUpdate.data,
				expression: options.expression,
				errorCorrectionLevel: options.errorCorrectionLevel
			});

			// --- THIS IS THE CORRECTED LOGIC, MATCHING YOUR ORIGINAL CODE ---
			
			// 1. Use setSrc() directly with await
			await objectToUpdate.setSrc(newUrl, { crossOrigin: 'anonymous' });

			// 2. Manually calculate and set scaleX and scaleY
			objectToUpdate.scaleX = originalScaledWidth / (objectToUpdate.width ?? 1);
			objectToUpdate.scaleY = originalScaledHeight / (objectToUpdate.height ?? 1);
			
			// -----------------------------------------------------------

			canvasInstance.requestRenderAll();
			canvasInstance.fire('object:modified', { target: objectToUpdate });
		} catch (error) {
			console.error('QR Code update failed:', error);
		}
	};
	
	
	const addBarcode = async (data?: string | null): Promise<void> => {
		if (!canvasInstance) return;
		const template = data || 'BAR##date_code##';
		const date = new Date();
		const dateCode = `${date.getFullYear()}${(date.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
		const finalValue = template.replace(/##date_code##/gi, dateCode);

		const canvasEl = document.createElement('canvas');
		JsBarcode(canvasEl, finalValue, {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: true
		});
		const dataUrl = canvasEl.toDataURL();
		const img = await fabric.FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });

		img.set({
			left: 50,
			top: 150,
			scaleX: 1.2,
			scaleY: 1.2,
			selectable: true,
			evented: true,
			moveCursor: 'move',
			hoverCursor: 'move',
			data: {
				type: 'Barcode',
				expression: template,
				format: 'CODE128',
				barWidth: 2,
				barHeight: 50,
				displayValue: true
			}
		});
		addToCanvas(img);
	};

	const addImage = async (fileOrUrl: File | string): Promise<void> => {
		if (!canvasInstance) return;

		const readFileAsDataURL = (file: File): Promise<string> =>
			new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					if (typeof reader.result === 'string') resolve(reader.result);
					else reject(new Error('Failed to read file as Data URL'));
				};
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(file);
			});

		const handleImage = async (url: string) => {
			try {
				const img = await fabric.FabricImage.fromURL(url, {
					crossOrigin: 'anonymous'
				});

				// Get canvas dimensions
				const canvasWidth = canvasInstance?.width ?? 400;
				const canvasHeight = canvasInstance?.height ?? 400;

				// Calculate scaling to fit within canvas (max 50% of canvas size)
				const maxWidth = canvasWidth * 0.5;
				const maxHeight = canvasHeight * 0.5;

				const scaleX = maxWidth / (img.width || 1);
				const scaleY = maxHeight / (img.height || 1);
				const scale = Math.min(scaleX, scaleY, 1); // Don't scale up

				// Configure the image for interaction
				img.set({
					left: 50,
					top: 50,
					scaleX: scale,
					scaleY: scale,
					// These properties ensure the image is interactive
					selectable: true,
					evented: true,
					moveable: true,
				});

				addToCanvas(img);
				canvasInstance?.setActiveObject(img);
				canvasInstance?.renderAll();
				console.log('Image added successfully:', img);
			} catch (err) {
				console.error('Image load failed:', err);
			}
		};

		if (typeof fileOrUrl === 'string') {
			await handleImage(fileOrUrl);
		} else {
			const dataUrl = await readFileAsDataURL(fileOrUrl);
			await handleImage(dataUrl);
		}
	};

	// Export Functions
	const downloadFile = (dataUrl: string, format: string): void => {
		const link = document.createElement('a');
		link.download = `canvas.${format}`;
		link.href = dataUrl;
		link.click();
	};

	const savePng = (): void => {
		if (canvasInstance) {
			canvasInstance.setViewportTransform([1, 0, 0, 1, 0, 0]);
			const dataUrl = canvasInstance.toDataURL({
				format: 'png',
				multiplier: 2,
				enableRetinaScaling: true
			});
			downloadFile(dataUrl, 'png');
		}
	};

	const saveJpg = (): void => {
		if (canvasInstance) {
			canvasInstance.setViewportTransform([1, 0, 0, 1, 0, 0]);
			const dataUrl = canvasInstance.toDataURL({
				format: 'jpeg',
				multiplier: 2,
				enableRetinaScaling: true
			});
			downloadFile(dataUrl, 'jpg');
		}
	};

	const saveSvg = (): void => {
		if (canvasInstance) {
			canvasInstance.setViewportTransform([1, 0, 0, 1, 0, 0]);
			const svg = canvasInstance.toSVG();
			const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
			downloadFile(dataUrl, 'svg');
		}
	};

	const savePdf = (): void => {
		if (canvasInstance) {
			canvasInstance.setViewportTransform([1, 0, 0, 1, 0, 0]);
			const dataUrl = canvasInstance.toDataURL({
				format: 'png',
				multiplier: 2,
				enableRetinaScaling: true
			});

			const widthInInches = (canvasInstance.width || 600) / 72;
			const heightInInches = (canvasInstance.height || 400) / 72;

			const pdf = new jsPDF({
				orientation: widthInInches > heightInInches ? 'landscape' : 'portrait',
				unit: 'in',
				format: [widthInInches, heightInInches]
			});

			pdf.addImage(dataUrl, 'PNG', 0, 0, widthInInches, heightInInches);
			pdf.save('canvas.pdf');
		}
	};

	const saveJson = async (): Promise<void> => {
		if (!canvasInstance) return;

		const data = canvasInstance.toJSON();
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify(data, null, '\t')
		)}`;
		downloadFile(fileString, 'json');
	};

	// Layer Operations
	const bringForward = (): void => {
		if (canvasInstance) {
			canvasInstance.getActiveObjects().forEach((object) => {
				if (canvasInstance) canvasInstance.bringObjectForward(object);
			});
			if (canvasInstance) canvasInstance.renderAll();
		}
	};

	const sendBackwards = (): void => {
		if (canvasInstance) {
			canvasInstance.getActiveObjects().forEach((object) => {
				if (canvasInstance) canvasInstance.sendObjectBackwards(object);
			});
			if (canvasInstance) canvasInstance.renderAll();
		}
	};

	// Font and Style Operations
	const changeFontFamily = (value: string): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				(object as fabric.IText).set({ fontFamily: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeFontSize = (value: number): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				(object as fabric.IText).set({ fontSize: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeFontWeight = (value?: number): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				const textObj = object as fabric.IText;
				if (value === undefined) {
					const currentWeight = Number(textObj.fontWeight) || 400;
					value = currentWeight >= 700 ? 400 : 700;
				}
				textObj.set({ fontWeight: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeFontStyle = (value?: 'normal' | 'italic' | 'oblique'): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				const textObj = object as fabric.IText;
				if (value === undefined) {
					const currentStyle = textObj.fontStyle || 'normal';
					value = currentStyle === 'italic' ? 'normal' : 'italic';
				}
				textObj.set({ fontStyle: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeFontUnderline = (value?: boolean): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				const textObj = object as fabric.IText;
				if (value === undefined) {
					const currentUnderline = textObj.underline || false;
					value = !currentUnderline;
				}
				textObj.set({ underline: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeTextAlign = (value: string): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			if (object.type === 'i-text' || object.type === 'text' || object.type === 'textbox') {
				(object as fabric.IText).set({ textAlign: value });
			}
		});
		canvasInstance.renderAll();
	};

	const changeOpacity = (value: number): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			object.set({ opacity: value });
		});
		canvasInstance.renderAll();
	};

	const changeFillColor = (value: string): void => {
		if (!canvasInstance) return;
		canvasInstance.getActiveObjects().forEach((object) => {
			object.set({ fill: value });
		});
		canvasInstance.renderAll();
	};

	// Canvas Size and Background
	const changeSize = (value: { width: number; height: number }): void => {
		if (!canvasInstance) return;

		canvasInstance.setDimensions(value);

		if (currentElement) {
			currentElement.width = value.width;
			currentElement.height = value.height;
		}

		canvasInstance.renderAll();
	};

	const changeBackground = (value: string): void => {
		if (canvasInstance) {
			console.log('inside canvas-manager.svelte')
			canvasInstance.backgroundColor = value;
			canvasInstance.renderAll();
		}
	};

	// Object Snapping System
	const createSnapGuide = (type: 'horizontal' | 'vertical', position: number): SnapGuide => {
		if (!canvasInstance) throw new Error('Canvas not initialized');

		const lineProps = {
			stroke: GUIDE_COLOR,
			strokeWidth: 1,
			selectable: false,
			evented: false,
			opacity: 0.8,
			isSnapGuide: true
		};

		if (type === 'horizontal') {
			return new fabric.Line([0, 0, canvasInstance.width!, 0], {
				...lineProps,
				left: 0,
				top: position
			}) as SnapGuide;
		} else {
			return new fabric.Line([0, 0, 0, canvasInstance.height!], {
				...lineProps,
				left: position,
				top: 0
			}) as SnapGuide;
		}
	};

	const clearSnapGuides = (): void => {
		if (!canvasInstance || snapGuides.length === 0) return;

		snapGuides.forEach((guide) => {
			canvasInstance!.remove(guide);
		});
		snapGuides = [];
		canvasInstance.requestRenderAll();
	};

	const showSnapGuide = (type: 'horizontal' | 'vertical', position: number): void => {
		if (!canvasInstance) return;

		const existingGuide = snapGuides.find((guide) => {
			if (type === 'horizontal') {
				return Math.abs((guide.top || 0) - position) < 1;
			} else {
				return Math.abs((guide.left || 0) - position) < 1;
			}
		});

		if (existingGuide) return;

		const guide = createSnapGuide(type, position);
		snapGuides.push(guide);
		canvasInstance.add(guide);
	};

	const handleObjectSnapping = (movingObj: fabric.FabricObject): void => {
		if (!canvasInstance) return;

		clearSnapGuides();

		const movingBounds = movingObj.getBoundingRect();
		const otherObjects = canvasInstance
			.getObjects()
			.filter(
				(obj) =>
					obj !== movingObj && !(obj as SnapGuide).isSnapGuide && (obj as any).name !== 'clip'
			);

		let snapX: number | null = null;
		let snapY: number | null = null;
		let snapGuideX: number | null = null;
		let snapGuideY: number | null = null;

		let minXDistance = SNAP_THRESHOLD + 1;
		let minYDistance = SNAP_THRESHOLD + 1;

		otherObjects.forEach((targetObj) => {
			const targetBounds = targetObj.getBoundingRect();

			const snapPositions = {
				left: targetBounds.left,
				right: targetBounds.left + targetBounds.width,
				centerX: targetBounds.left + targetBounds.width / 2,
				top: targetBounds.top,
				bottom: targetBounds.top + targetBounds.height,
				centerY: targetBounds.top + targetBounds.height / 2,
				leftToRight: targetBounds.left + targetBounds.width,
				rightToLeft: targetBounds.left - movingBounds.width,
				topToBottom: targetBounds.top + targetBounds.height,
				bottomToTop: targetBounds.top - movingBounds.height
			};

			const movingCenterX = movingBounds.left + movingBounds.width / 2;
			const movingRight = movingBounds.left + movingBounds.width;

			[
				{
					pos: snapPositions.left,
					guide: snapPositions.left,
					offset: movingBounds.left - movingObj.left!
				},
				{
					pos: snapPositions.right,
					guide: snapPositions.right,
					offset: movingBounds.left - movingObj.left!
				},
				{
					pos: snapPositions.centerX,
					guide: snapPositions.centerX,
					offset: movingCenterX - movingObj.left! - movingBounds.width / 2
				},
				{
					pos: snapPositions.leftToRight,
					guide: snapPositions.leftToRight,
					offset: movingBounds.left - movingObj.left!
				},
				{
					pos: snapPositions.rightToLeft,
					guide: snapPositions.left,
					offset: movingRight - movingObj.left! - movingBounds.width
				}
			].forEach(({ pos, guide, offset }) => {
				const distance = Math.abs(movingBounds.left - pos);
				if (distance < minXDistance && distance <= SNAP_THRESHOLD) {
					minXDistance = distance;
					snapX = pos - offset;
					snapGuideX = guide;
				}
			});

			const movingCenterY = movingBounds.top + movingBounds.height / 2;
			const movingBottom = movingBounds.top + movingBounds.height;

			[
				{
					pos: snapPositions.top,
					guide: snapPositions.top,
					offset: movingBounds.top - movingObj.top!
				},
				{
					pos: snapPositions.bottom,
					guide: snapPositions.bottom,
					offset: movingBounds.top - movingObj.top!
				},
				{
					pos: snapPositions.centerY,
					guide: snapPositions.centerY,
					offset: movingCenterY - movingObj.top! - movingBounds.height / 2
				},
				{
					pos: snapPositions.topToBottom,
					guide: snapPositions.topToBottom,
					offset: movingBounds.top - movingObj.top!
				},
				{
					pos: snapPositions.bottomToTop,
					guide: snapPositions.top,
					offset: movingBottom - movingObj.top! - movingBounds.height
				}
			].forEach(({ pos, guide, offset }) => {
				const distance = Math.abs(movingBounds.top - pos);
				if (distance < minYDistance && distance <= SNAP_THRESHOLD) {
					minYDistance = distance;
					snapY = pos - offset;
					snapGuideY = guide;
				}
			});
		});

		if (snapX !== null) {
			movingObj.set('left', snapX);
			movingObj.setCoords();
			if (snapGuideX !== null) {
				showSnapGuide('vertical', snapGuideX);
			}
		}

		if (snapY !== null) {
			movingObj.set('top', snapY);
			movingObj.setCoords();
			if (snapGuideY !== null) {
				showSnapGuide('horizontal', snapGuideY);
			}
		}

		if (snapX !== null || snapY !== null) {
			canvasInstance.requestRenderAll();
		}
	};

	const setupObjectSnapping = (): void => {
		if (!canvasInstance) return;

		canvasInstance.on('object:moving', (e) => {
			const obj = e.target;
			if (obj && !(obj as SnapGuide).isSnapGuide) {
				if (snapTimeout) {
					clearTimeout(snapTimeout);
				}
				snapTimeout = window.setTimeout(() => {
					handleObjectSnapping(obj);
					snapTimeout = null;
				}, 16);
			}
		});

		canvasInstance.on('object:modified', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			clearSnapGuides();
		});

		canvasInstance.on('selection:cleared', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			clearSnapGuides();
		});

		canvasInstance.on('mouse:up', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			clearSnapGuides();
		});

		canvasInstance.on('mouse:down', () => {
			clearSnapGuides();
		});
	};

	// Object Alignment
	const alignObjects = (
		alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom'
	): void => {
		if (!canvasInstance) return;

		const activeObjects = canvasInstance.getActiveObjects();
		if (activeObjects.length < 2) return;

		const canvasWidth = canvasInstance.width || 0;
		const canvasHeight = canvasInstance.height || 0;

		// Get bounds of all selected objects
		let minLeft = Infinity,
			maxRight = -Infinity;
		let minTop = Infinity,
			maxBottom = -Infinity;

		activeObjects.forEach((obj) => {
			const bounds = obj.getBoundingRect();
			minLeft = Math.min(minLeft, bounds.left);
			maxRight = Math.max(maxRight, bounds.left + bounds.width);
			minTop = Math.min(minTop, bounds.top);
			maxBottom = Math.max(maxBottom, bounds.top + bounds.height);
		});

		// const groupCenterX = (minLeft + maxRight) / 2;
		// const groupCenterY = (minTop + maxBottom) / 2;

		activeObjects.forEach((obj) => {
			const bounds = obj.getBoundingRect();
			const objCenterX = bounds.left + bounds.width / 2;
			const objCenterY = bounds.top + bounds.height / 2;

			switch (alignment) {
				case 'left':
					obj.set('left', obj.left! + (minLeft - bounds.left));
					break;
				case 'center':
					obj.set('left', obj.left! + (canvasWidth / 2 - objCenterX));
					break;
				case 'right':
					obj.set('left', obj.left! + (maxRight - bounds.left - bounds.width));
					break;
				case 'top':
					obj.set('top', obj.top! + (minTop - bounds.top));
					break;
				case 'middle':
					obj.set('top', obj.top! + (canvasHeight / 2 - objCenterY));
					break;
				case 'bottom':
					obj.set('top', obj.top! + (maxBottom - bounds.top - bounds.height));
					break;
			}
			obj.setCoords();
		});

		canvasInstance.renderAll();
	};

	// Selection Operations
	const deleteSelected = (): void => {
		if (!canvasInstance) return;

		const activeObjects = canvasInstance.getActiveObjects();
		if (activeObjects.length === 0) return;

		activeObjects.forEach((obj) => {
			canvasInstance?.remove(obj);
		});

		canvasInstance.discardActiveObject();
		canvasInstance.renderAll();
	};

	const duplicateSelected = async (): Promise<void> => {
		if (!canvasInstance) return;
		const activeObject = canvasInstance.getActiveObject();

		if (!activeObject) return;

		try {
			// Use await to get the cloned object asynchronously
			const cloned = await activeObject.clone();

			// Offset the clone slightly
			cloned.set({
				left: (cloned.left ?? 0) + 10,
				top: (cloned.top ?? 0) + 10
			});

			canvasInstance.add(cloned);
			canvasInstance.setActiveObject(cloned);
			canvasInstance.requestRenderAll();
		} catch (error) {
			console.error('Error duplicating object:', error);
		}
	};

	// Zoom Controls
	const setZoom = (value: number): void => {
		if (!canvasInstance) return;

		const zoom = Math.max(0.1, Math.min(5, value)); // Limit zoom between 10% and 500%
		canvasInstance.setZoom(zoom);
		canvasInstance.renderAll();
	};

	const zoomIn = (): void => {
		if (!canvasInstance) return;

		const currentZoom = canvasInstance.getZoom();
		const newZoom = Math.min(5, currentZoom * 1.1);
		setZoom(newZoom);
	};

	const zoomOut = (): void => {
		if (!canvasInstance) return;

		const currentZoom = canvasInstance.getZoom();
		const newZoom = Math.max(0.1, currentZoom * 0.9);
		setZoom(newZoom);
	};

	// Public API
	return {
		get canvas() {
			return canvasInstance;
		},
	
		initializeCanvas,
		getCanvas,
		disposeCanvas,
		setDimensions,
		addText,
		addToCanvas,
		addQRcode,
		updateQRCode,
		addBarcode,
		addImage,
		savePng,
		saveJpg,
		saveSvg,
		savePdf,
		saveJson,
		bringForward,
		sendBackwards,
		changeFontFamily,
		changeFontSize,
		changeFontWeight,
		changeFontStyle,
		changeFontUnderline,
		changeTextAlign,
		changeOpacity,
		changeFillColor,
		changeSize,
		changeBackground,
		alignObjects,
		deleteSelected,
		duplicateSelected,
		setZoom,
		zoomIn,
		zoomOut
	};
};
