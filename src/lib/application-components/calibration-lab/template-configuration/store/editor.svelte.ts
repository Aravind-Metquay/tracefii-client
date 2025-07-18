import * as fabric from 'fabric';
import { createHistory } from './history.svelte.js';
import { createCanvasEvents } from './canvas-events.svelte.js';
import { AddElementCommand } from '../commands/commands.svelte.ts';
import JsBarcode from 'jsbarcode';
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import moment from 'moment';

// Constants
const FILL_COLOR = '#000000';
const FONT_FAMILY = 'Arial';
const FONT_SIZE = 32;
const FONT_WEIGHT = 400;

// Default options for objects
const TEXT_OPTIONS = {
	type: 'textbox',
	left: 100,
	top: 100,
	fontSize: FONT_SIZE,
	fontWeight: FONT_WEIGHT,
	fontFamily: FONT_FAMILY,
	fill: FILL_COLOR,
	width: 200,
	height: 50,
	minWidth: 200
};

const SHAPE_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
};

const CIRCLE_OPTIONS = {
	radius: 50,
	left: 100,
	top: 100
};

// Extend fabric objects for custom properties
declare module 'fabric' {
	namespace fabric {
		interface FabricObject {
			name?: string;
			customType?: string;
			customDateValue?: string;
			customDateFormat?: string;
			variableValues?: { [key: string]: string };
			text?: string;
		}
		interface Textbox {
			customType?: string;
			customDateValue?: string;
			customDateFormat?: string;
			variableValues?: { [key: string]: string };
		}
		interface ITextboxOptions {
			customType?: string;
			customDateValue?: string;
			customDateFormat?: string;
			variableValues?: { [key: string]: string };
		}
		interface Image {
			data?: any;
		}
		interface Canvas {
			bringObjectForward?: (object: FabricObject) => Canvas;
			sendObjectBackwards?: (object: FabricObject) => Canvas;
		}
	}
}

declare global {
	interface Window {
		variableValues?: { [key: string]: string };
	}
}

// Utility functions
function downloadFile(dataUrl: string, format: string) {
	const link = document.createElement('a');
	link.download = `canvas.${format}`;
	link.href = dataUrl;
	link.click();
}

function isTextType(type: string): boolean {
	return type === 'text' || type === 'textbox';
}

interface EditorOptions {
	fontFamily?: string;
	fillColor?: string;
	strokeColor?: string;
	strokeWidth?: number;
	strokeDashArray?: number[];
	defaultWidth?: number;
	defaultHeight?: number;
}

export function createEditor(options: EditorOptions = {}) {
	let canvas = $state<fabric.Canvas | null>(null);
	let container = $state<HTMLElement | null>(null);
	let selectedTool = $state('select');
	let selectedObjects = $state<fabric.Object[]>([]);
	let zoom = $state(1);
	let viewport = $state({ x: 0, y: 0 });

	// Style states
	let fontFamily = $state(options.fontFamily || FONT_FAMILY);
	let fillColor = $state(options.fillColor || FILL_COLOR);

	const history = createHistory();
	const canvasEvents = createCanvasEvents();

	// Derived state
	let hasSelection = $derived(selectedObjects.length > 0);
	let canvasSize = $derived(
		canvas ? { width: canvas.width, height: canvas.height } : { width: 800, height: 600 }
	);

	// Global variable values for dynamic content
	function initializeVariableValues() {
		if (typeof window !== 'undefined' && !window.variableValues) {
			window.variableValues = {};
		}
	}

	// Canvas operations

	function initializeCanvas(canvasElement: HTMLCanvasElement, containerElement: HTMLElement) {
		initializeVariableValues();
		const canvasWidth = containerElement.offsetWidth;
		const canvasHeight = containerElement.offsetHeight;

		canvas = new fabric.Canvas(canvasElement, {
			width: canvasWidth,
			height: canvasHeight,
			renderOnAddRemove: false,
			preserveObjectStacking: true
		});

		container = containerElement;

		// Set up fabric object defaults
		fabric.FabricObject.prototype.set({
			cornerColor: '#FFF',
			cornerStyle: 'circle',
			borderColor: '#3b82f6',
			borderScaleFactor: 1.5,
			transparentCorners: false,
			borderOpacityWhenMoving: 1,
			cornerStrokeColor: '#3b82f6'
		});

		// Create workspace
		const workspace = new fabric.Rect({
			width: options.defaultWidth || 800,
			height: options.defaultHeight || 600,
			name: 'clip',
			fill: 'white',
			selectable: false,
			hasControls: false,
			shadow: new fabric.Shadow({
				color: 'rgba(0,0,0,0.8)',
				blur: 5
			})
		});

		canvas.add(workspace);
		canvas.centerObject(workspace);
		canvas.clipPath = workspace;

		// Set up canvas events
		canvas.on('selection:created', (e) => {
			selectedObjects = (e.selected as fabric.Object[]) || [];
		});

		canvas.on('selection:cleared', () => {
			selectedObjects = [];
		});

		canvas.on('selection:updated', (e) => {
			selectedObjects = (e.selected as fabric.Object[]) || [];
		});

		canvas.on('object:modified', () => {
			history.save();
			syncCanvasState();
		});

		canvas.on('object:added', () => {
			history.save();
			syncCanvasState();
		});

		canvas.on('object:removed', () => {
			history.save();
			syncCanvasState();
		});

		// Attach additional events
		canvasEvents.attachEvents(canvasElement);

		// Initialize history
		history.save();
		autoZoom();

		return canvas;
	}

	function syncCanvasState() {
		if (!canvas) return;
		canvas.renderAll();
	}

	function getWorkspace() {
		if (!canvas) return undefined;
		return canvas.getObjects().find((object) => (object as any).name === 'clip');
	}

	function center(object: fabric.Object) {
		if (!canvas) return;
		canvas.centerObject(object);
	}

	function addToCanvas(object: fabric.Object) {
		if (!canvas) return;
		canvas.add(object);
		center(object);
		canvas.setActiveObject(object);
		canvas.renderAll();
	}

	function autoZoom() {
		if (!canvas || !container) return;

		const workspace = getWorkspace();
		if (!workspace) return;

		const width = container.offsetWidth;
		const height = container.offsetHeight;

		const scaleX = width / workspace.width;
		const scaleY = height / workspace.height;
		const scale = Math.min(scaleX, scaleY) * 0.8;

		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, scale);
		zoom = scale;
	}

	// Fixed version of your editor methods

	function addText(text: string = 'Text', textOptions: any = {}) {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		try {
			const object = new fabric.Textbox(text, {
				...TEXT_OPTIONS,
				fill: fillColor,
				fontFamily: fontFamily,
				fontSize: FONT_SIZE,
				fontWeight: FONT_WEIGHT,
				left: 100, // Ensure positioning is set
				top: 100,
				width: 200,
				...textOptions
			});

			// Add to canvas first, then execute command
			canvas.add(object);
			canvas.setActiveObject(object);
			canvas.renderAll();

			const command = new AddElementCommand(canvas, object);
			history.execute(command);
			syncCanvasState();

			console.log('Text added successfully');
		} catch (error) {
			console.error('Error adding text:', error);
		}
	}

	function addDate() {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		try {
			const now = new Date();
			const format = 'MM/DD/YYYY';
			const dateText = new fabric.Textbox(moment(now).format(format), {
				...TEXT_OPTIONS,
				fill: fillColor,
				fontFamily: fontFamily,
				fontSize: FONT_SIZE,
				fontWeight: FONT_WEIGHT,
				left: 100,
				top: 100,
				width: 200,
				customType: 'date',
				customDateValue: now.toISOString(),
				customDateFormat: format,
				variableValues: (typeof window !== 'undefined' && window.variableValues) || {}
			});

			// Add to canvas first, then execute command
			canvas.add(dateText);
			canvas.setActiveObject(dateText);
			canvas.renderAll();

			const command = new AddElementCommand(canvas, dateText);
			history.execute(command);
			syncCanvasState();

			console.log('Date added successfully');
		} catch (error) {
			console.error('Error adding date:', error);
		}
	}

	// QR Code operations - Fixed version
	async function addQRCode(value: string | null = null) {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		try {
			const template = '{{default_qrcode}}';
			const dynamicValue = value || `https://metquay.com/generated/${Date.now()}`;
			const finalValue = template.replace('{{default_qrcode}}', dynamicValue);

			const dataUrl = await QRCode.toDataURL(finalValue, {
				errorCorrectionLevel: 'high',
				width: 100
			});

			// Check if fabric.FabricImage exists, fallback to fabric.Image
			const ImageClass = fabric.FabricImage || fabric.Image;
			const img = await ImageClass.fromURL(dataUrl, {
				crossOrigin: 'anonymous'
			});

			img.set({
				left: 100,
				top: 100,
				data: {
					type: 'QR Code',
					template,
					errorCorrectionLevel: 'high'
				}
			});

			// Add to canvas first, then execute command
			canvas.add(img);
			canvas.setActiveObject(img);
			canvas.renderAll();

			const command = new AddElementCommand(canvas, img);
			history.execute(command);
			syncCanvasState();

			console.log('QR Code added successfully');
		} catch (error) {
			console.error('Error adding QR code:', error);
		}
	}

	// Barcode operations - Fixed version
	async function addBarcode(value: string | null = null) {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		try {
			const template = 'BAR{{date_code}}';
			const today = new Date();
			const dynamicValue =
				value ||
				`${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
			const finalValue = template.replace('{{date_code}}', dynamicValue);

			const canvasElement = document.createElement('canvas');

			// Check if JsBarcode is available
			if (typeof JsBarcode === 'undefined') {
				console.error('JsBarcode is not available');
				return;
			}

			JsBarcode(canvasElement, finalValue, {
				format: 'CODE128',
				width: 2,
				height: 50,
				displayValue: false
			});

			const dataUrl = canvasElement.toDataURL();

			// Check if fabric.FabricImage exists, fallback to fabric.Image
			const ImageClass = fabric.FabricImage || fabric.Image;
			const img = await ImageClass.fromURL(dataUrl, {
				crossOrigin: 'anonymous'
			});

			img.set({
				left: 100,
				top: 100,
				data: {
					type: 'Barcode',
					template,
					format: 'CODE128'
				}
			});

			// Add to canvas first, then execute command
			canvas.add(img);
			canvas.setActiveObject(img);
			canvas.renderAll();

			const command = new AddElementCommand(canvas, img);
			history.execute(command);
			syncCanvasState();

			console.log('Barcode added successfully');
		} catch (error) {
			console.error('Error adding barcode:', error);
		}
	}

	// Image operations - Fixed version
	async function addImage(fileOrUrl: File | string) {
		if (!canvas) {
			console.error('Canvas not initialized');
			return;
		}

		const handleImage = async (url: string) => {
			try {
				// Check if fabric.FabricImage exists, fallback to fabric.Image
				const ImageClass = fabric.FabricImage || fabric.Image;
				const image = await ImageClass.fromURL(url, {
					crossOrigin: 'anonymous'
				});

				// Set initial positioning
				image.set({
					left: 100,
					top: 100
				});

				const workspace = getWorkspace();
				if (workspace) {
					// Scale image to fit workspace
					const maxWidth = workspace.width * 0.8;
					const maxHeight = workspace.height * 0.8;

					if (image.width > maxWidth) {
						image.scaleToWidth(maxWidth);
					}
					if (image.height > maxHeight) {
						image.scaleToHeight(maxHeight);
					}
				}

				// Add to canvas first, then execute command
				canvas?.add(image);
				canvas?.setActiveObject(image);
				canvas?.renderAll();

				const command = new AddElementCommand(canvas, image);
				history.execute(command);
				syncCanvasState();

				console.log('Image added successfully');
			} catch (error) {
				console.error('Error adding image:', error);

				// Fallback: try without crossOrigin
				try {
					const ImageClass = fabric.FabricImage || fabric.Image;
					const image = await ImageClass.fromURL(url);

					image.set({
						left: 100,
						top: 100
					});

					canvas?.add(image);
					canvas?.setActiveObject(image);
					canvas?.renderAll();

					const command = new AddElementCommand(canvas, image);
					history.execute(command);
					syncCanvasState();

					console.log('Image added successfully (fallback)');
				} catch (fallbackError) {
					console.error('Fallback image loading also failed:', fallbackError);
				}
			}
		};

		if (typeof fileOrUrl === 'string') {
			await handleImage(fileOrUrl);
		} else {
			const reader = new FileReader();
			reader.onload = async () => {
				if (typeof reader.result === 'string') {
					await handleImage(reader.result);
				}
			};
			reader.onerror = () => {
				console.error('Error reading file');
			};
			reader.readAsDataURL(fileOrUrl);
		}
	}

	// Helper function to check if addToCanvas is needed
	function safeAddToCanvas(object: fabric.Object) {
		if (typeof addToCanvas === 'function') {
			addToCanvas(object);
		} else {
			// If addToCanvas doesn't exist, the object should already be added to canvas
			console.log('addToCanvas function not available, object added directly to canvas');
		}
	}

	function changeDateFormat(format: string) {
		if (!canvas) return;
		const active = canvas.getActiveObject();
		if (active && active.type === 'textbox' && (active as any).customType === 'date') {
			const dateValue = (active as any).customDateValue;
			const isDynamic = dateValue ? /{{[^{}]+}}/.test(dateValue) : false;

			if (!isDynamic && dateValue && moment(dateValue).isValid()) {
				(active as any).text = moment(dateValue).format(format);
				(active as any).customDateFormat = format;
				canvas.requestRenderAll();
			} else if (isDynamic) {
				(active as any).customDateFormat = format;
				(active as any).text = dateValue;
				canvas.requestRenderAll();
			}
		}
	}

	function updateDateValue(newDateStr: string) {
		if (!canvas) return;
		const active = canvas.getActiveObject();
		if (active && active.type === 'textbox' && (active as any).customType === 'date') {
			const format = (active as any).customDateFormat || 'MM/DD/YYYY';
			const isDynamic = /{{[^{}]+}}/.test(newDateStr);

			if (!isDynamic && moment(newDateStr, format, true).isValid()) {
				(active as any).customDateValue = moment(newDateStr, format).toISOString();
				(active as any).text = moment(newDateStr, format).format(format);
			} else {
				(active as any).customDateValue = newDateStr;
				(active as any).text = newDateStr;
			}
			canvas.requestRenderAll();
		}
	}

	function getActiveDateValue() {
		if (!canvas) return null;
		const active = canvas.getActiveObject();
		if (active && active.type === 'textbox' && (active as any).customType === 'date') {
			return (active as any).customDateValue || null;
		}
		return null;
	}

	function getActiveDateFormat() {
		if (!canvas) return null;
		const active = canvas.getActiveObject();
		if (active && active.type === 'textbox' && (active as any).customType === 'date') {
			return (active as any).customDateFormat || 'MM/DD/YYYY';
		}
		return null;
	}

	function getActiveText() {
		if (!canvas) return undefined;
		const activeObject = canvas.getActiveObject();
		if (
			activeObject &&
			isTextType(activeObject.type) &&
			(activeObject as any).customType !== 'date'
		) {
			return (activeObject as any).text || '';
		}
		return undefined;
	}

	function changeText(text: string) {
		if (!canvas) return;
		const activeObject = canvas.getActiveObject();
		if (
			activeObject &&
			isTextType(activeObject.type) &&
			(activeObject as any).customType !== 'date'
		) {
			activeObject.set({ text });
			canvas.requestRenderAll();
		}
	}

	// Shape operations
	function addCircle() {
		if (!canvas) return;

		const object = new fabric.Circle({
			...CIRCLE_OPTIONS,
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
		syncCanvasState();
	}

	function addRectangle() {
		if (!canvas) return;

		const object = new fabric.Rect({
			...SHAPE_OPTIONS,
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
		syncCanvasState();
	}

	function addSoftRectangle() {
		if (!canvas) return;

		const object = new fabric.Rect({
			...SHAPE_OPTIONS,
			rx: 50,
			ry: 50,
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
		syncCanvasState();
	}

	function addTriangle() {
		if (!canvas) return;

		const object = new fabric.Triangle({
			...SHAPE_OPTIONS,
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
		syncCanvasState();
	}

	// Selection and deletion
	function deleteSelected() {
		if (!canvas || selectedObjects.length === 0) return;

		const canvasRef = canvas;
		selectedObjects.forEach((object) => canvasRef.remove(object));
		canvasRef.discardActiveObject();
		canvasRef.renderAll();
		syncCanvasState();
	}

	// Zoom operations
	function setZoom(newZoom: number) {
		if (!canvas) return;

		zoom = Math.max(0.1, Math.min(5, newZoom));
		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, zoom);
	}

	function zoomIn() {
		if (!canvas) return;

		let zoomRatio = canvas.getZoom();
		zoomRatio += 0.05;
		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, zoomRatio > 1 ? 1 : zoomRatio);
		zoom = canvas.getZoom();
	}

	function zoomOut() {
		if (!canvas) return;

		let zoomRatio = canvas.getZoom();
		zoomRatio -= 0.05;
		const center = canvas.getCenterPoint();
		canvas.zoomToPoint(center, zoomRatio < 0.2 ? 0.2 : zoomRatio);
		zoom = canvas.getZoom();
	}

	// Canvas size operations
	async function changeSize(value: { width: number; height: number }) {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set(value);
			try {
				const cloned = await workspace.clone();
				canvas.clipPath = cloned;
				canvas.renderAll();
			} catch (error) {
				console.error('Error cloning workspace:', error);
			}
			autoZoom();
			history.save();
		}
	}

	function changeBackground(value: string) {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set({ fill: value });
			canvas.renderAll();
		}
	}

	// Font operations
	function changeFontFamily(value: string) {
		if (!canvas) return;
		fontFamily = value;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ fontFamily: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontSize(value: number) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ fontSize: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontWeight(value: string | number) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ fontWeight: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontStyle(value: 'normal' | 'italic' | 'oblique') {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ fontStyle: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontUnderline(value: boolean) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ underline: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontLinethrough(value: boolean) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ linethrough: value });
			}
		});
		canvas.renderAll();
	}

	function changeTextAlign(value: string) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ textAlign: value });
			}
		});
		canvas.renderAll();
	}

	function changeOpacity(value: number) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ opacity: value });
		});
		canvas.renderAll();
	}

	function bringForward() {
		if (!canvas) return;
		const canvasRef = canvas;
		canvasRef.getActiveObjects().forEach((object) => {
			if (canvasRef.bringObjectForward) {
				canvasRef.bringObjectForward(object);
			}
		});
		canvasRef.renderAll();
		const workspace = getWorkspace();
		if (workspace && canvasRef.sendObjectToBack) {
			canvasRef.sendObjectToBack(workspace);
		}
	}

	function sendBackwards() {
		if (!canvas) return;
		const canvasRef = canvas;
		canvasRef.getActiveObjects().forEach((object) => {
			if (canvasRef.sendObjectBackwards) {
				canvasRef.sendObjectBackwards(object);
			}
		});
		canvasRef.renderAll();
		const workspace = getWorkspace();
		if (workspace && canvasRef.sendObjectToBack) {
			canvasRef.sendObjectToBack(workspace);
		}
	}

	// Export operations
	function generateSaveOptions() {
		const workspace = getWorkspace();
		if (!workspace) {
			return {
				format: 'png' as const,
				quality: 1,
				multiplier: 1,
				width: 800,
				height: 600,
				left: 0,
				top: 0
			};
		}

		const { width, height, left, top } = workspace;
		return {
			format: 'png' as const,
			quality: 1,
			multiplier: 1,
			width,
			height,
			left,
			top
		};
	}

	function savePng() {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'png' });
		downloadFile(dataUrl, 'png');
		autoZoom();
	}

	function saveJpg() {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'jpeg' });
		downloadFile(dataUrl, 'jpg');
		autoZoom();
	}

	function savePdf() {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'png' });

		const widthInInches = (canvas.getWidth() || 800) / 72;
		const heightInInches = (canvas.getHeight() || 600) / 72;

		const pdf = new jsPDF({
			orientation: widthInInches > heightInInches ? 'landscape' : 'portrait',
			unit: 'in',
			format: [widthInInches, heightInInches]
		});

		pdf.addImage(dataUrl, 'PNG', 0, 0, widthInInches, heightInInches);
		pdf.save('canvas.pdf');
		autoZoom();
	}

	async function saveJson() {
		if (!canvas) return;
		const dataUrl = canvas.toJSON();
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(
			JSON.stringify(dataUrl, null, '\t')
		)}`;
		downloadFile(fileString, 'json');
	}

	function loadJson(json: string) {
		if (!canvas) return;
		const data = JSON.parse(json);
		canvas.loadFromJSON(data, () => {
			autoZoom();
		});
	}

	// Getter functions for active object properties
	function getActiveOpacity() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return 1;
		return selectedObject.get('opacity') || 1;
	}

	function getActiveFontSize() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_SIZE;
		return (selectedObject as fabric.Textbox).fontSize || FONT_SIZE;
	}

	function getActiveTextAlign() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'left';
		return (selectedObject as fabric.Textbox).textAlign || 'left';
	}

	function getActiveFontUnderline() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as fabric.Textbox).underline || false;
	}

	function getActiveFontLinethrough() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as fabric.Textbox).linethrough || false;
	}

	function getActiveFontStyle() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'normal';
		return (selectedObject as fabric.Textbox).fontStyle || 'normal';
	}

	function getActiveFontWeight() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_WEIGHT;
		return (selectedObject as fabric.Textbox).fontWeight || FONT_WEIGHT;
	}

	function getActiveFontFamily() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return fontFamily;
		return (selectedObject as fabric.Textbox).fontFamily || fontFamily;
	}

	function getActiveFillColor() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return fillColor;
		return selectedObject.get('fill') || fillColor;
	}

	function getActiveScaleX() {
		if (!canvas) return 1.0;
		const activeObject = canvas.getActiveObject();
		if (activeObject && 'scaleX' in activeObject) {
			return activeObject.scaleX ?? 1.0;
		}
		return 1.0;
	}

	function getActiveScaleY() {
		if (!canvas) return 1.0;
		const activeObject = canvas.getActiveObject();
		if (activeObject && 'scaleY' in activeObject) {
			return activeObject.scaleY ?? 1.0;
		}
		return 1.0;
	}

	function changeFillColor(value: string) {
		if (!canvas) return;
		fillColor = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ fill: value });
		});
		canvas.renderAll();
	}

	return {
		canvas,
		container,
		selectedTool,
		selectedObjects,
		zoom,
		viewport,
		fontFamily,
		hasSelection,
		canvasSize,
		initializeCanvas,
		syncCanvasState,
		getWorkspace,
		center,
		addToCanvas,
		autoZoom,
		addText,
		addDate,
		changeDateFormat,
		updateDateValue,
		getActiveDateValue,
		getActiveDateFormat,
		getActiveText,
		changeText,
		addQRCode,
		addBarcode,
		addImage,
		addCircle,
		addRectangle,
		addSoftRectangle,
		addTriangle,
		deleteSelected,
		setZoom,
		zoomIn,
		zoomOut,
		changeSize,
		changeBackground,
		changeFontFamily,
		changeFontSize,
		changeFontWeight,
		changeFontStyle,
		changeFontUnderline,
		changeFontLinethrough,
		changeTextAlign,
		changeOpacity,
		bringForward,
		sendBackwards,
		savePng,
		saveJpg,
		savePdf,
		saveJson,
		loadJson,
		getActiveOpacity,
		getActiveFontSize,
		getActiveTextAlign,
		getActiveFontUnderline,
		getActiveFontLinethrough,
		getActiveFontStyle,
		getActiveFontWeight,
		getActiveFontFamily,
		getActiveFillColor,
		fillColor,
		changeFillColor,
		getActiveScaleX,
		getActiveScaleY,
		history,
		canvasEvents
	};
}
