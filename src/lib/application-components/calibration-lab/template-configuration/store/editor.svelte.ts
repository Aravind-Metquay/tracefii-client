import {
	Canvas,
	FabricObject,
	FabricImage,
	Textbox,
	Rect,
	Circle,
	Triangle,
	Polygon,
	Point,
	Shadow,
	ActiveSelection
} from 'fabric';
import { createHistory } from './history.svelte';
import { createCanvasEvents } from './canvas-events.svelte';
import { AddElementCommand } from '../commands/commands.svelte';
import JsBarcode from 'jsbarcode';
import * as QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import moment from 'moment';
import { createClipboard } from './clipboard.svelte';
import { createHotkeys } from './hotkeys.svelte';
import { createAutoResize } from './auto-resize.svelte';

// Constants
const FILL_COLOR = '#000000';
const STROKE_COLOR = '#000000';
const STROKE_WIDTH = 1;
const STROKE_DASH_ARRAY: number[] = [];
const FONT_FAMILY = 'Times New Roman';
const FONT_SIZE = 24;
const FONT_WEIGHT = 400;
const JSON_KEYS = ['version', 'objects', 'background', 'backgroundImage', 'width', 'height'];

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

const RECTANGLE_OPTIONS = {
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

const TRIANGLE_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
};

const DIAMOND_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
};

// Extend fabric objects for custom properties
declare module 'fabric' {
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
	interface FabricImage {
		data?: any;
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

function isTextType(type: string | undefined): boolean {
	return type === 'text' || type === 'textbox';
}

function createFilter(value: string): any | null {
	// Note: Filter implementation depends on fabric.js version
	// This is a placeholder that should be updated based on your fabric.js version
	switch (value) {
		case 'grayscale':
		case 'invert':
		case 'sepia':
		case 'blur':
			return { type: value };
		default:
			return null;
	}
}

async function transformText(objects: any[]): Promise<void> {
	for (const obj of objects) {
		if (obj.type === 'textbox' && obj.customType === 'date') {
			const dateValue = obj.customDateValue;
			const format = obj.customDateFormat || 'MM/DD/YYYY';
			const isDynamic = /{{[^{}]+}}/.test(dateValue);
			if (!isDynamic && moment(dateValue).isValid()) {
				obj.text = moment(dateValue).format(format);
			}
		}
	}
}

interface EditorOptions {
	defaultState?: string;
	defaultWidth?: number;
	defaultHeight?: number;
	saveCallback?: () => void;
	clearSelectionCallback?: () => void;
	fontFamily?: string;
	fillColor?: string;
	strokeColor?: string;
	strokeWidth?: number;
	strokeDashArray?: number[];
}

export function createEditor(options: EditorOptions = {}) {
	let canvas = $state<Canvas | null>(null);
	let container = $state<HTMLElement | null>(null);
	let selectedTool = $state('select');
	let selectedObjects = $state<FabricObject[]>([]);
	let zoom = $state(1);
	let viewport = $state({ x: 0, y: 0 });
	let fontFamily = $state(options.fontFamily || FONT_FAMILY);
	let fillColor = $state(options.fillColor || FILL_COLOR);
	let strokeColor = $state(options.strokeColor || STROKE_COLOR);
	let strokeWidth = $state(options.strokeWidth || STROKE_WIDTH);
	let strokeDashArray = $state(options.strokeDashArray || STROKE_DASH_ARRAY);

	const history = createHistory({ canvas, saveCallback: options.saveCallback });
	const canvasEvents = createCanvasEvents({
		canvas,
		setSelectedObjects: (objects) => (selectedObjects = objects),
		clearSelectionCallback: options.clearSelectionCallback,
		save: history.save
	});
	const clipboard = createClipboard({ canvas });
	const hotkeys = createHotkeys({
		undo: history.undo,
		redo: history.redo,
		copy: clipboard.copy,
		paste: clipboard.paste,
		save: history.save,
		canvas
	});
	const autoResize = createAutoResize({ canvas, container });

	// Derived state
	let hasSelection = $derived(selectedObjects.length > 0);
	let canvasSize = $derived(
		canvas
			? { width: canvas.width, height: canvas.height }
			: { width: options.defaultWidth || 800, height: options.defaultHeight || 600 }
	);

	function initializeVariableValues() {
		if (typeof window !== 'undefined' && !window.variableValues) {
			window.variableValues = {};
		}
	}

	function initializeCanvas(canvasElement: HTMLCanvasElement, containerElement: HTMLElement) {
		initializeVariableValues();
		canvas = new Canvas(canvasElement, {
			width: containerElement.offsetWidth,
			height: containerElement.offsetHeight,
			renderOnAddRemove: false,
			preserveObjectStacking: true
		});
		container = containerElement;

		FabricObject.prototype.set({
			cornerColor: '#FFF',
			cornerStyle: 'circle',
			borderColor: '#3b82f6',
			borderScaleFactor: 1.5,
			transparentCorners: false,
			borderOpacityWhenMoving: 1,
			cornerStrokeColor: '#3b82f6'
		});

		const workspace = new Rect({
			width: options.defaultWidth || 800,
			height: options.defaultHeight || 600,
			name: 'clip',
			fill: 'white',
			selectable: false,
			hasControls: false,
			shadow: new Shadow({
				color: 'rgba(0,0,0,0.8)',
				blur: 5
			})
		});

		canvas.add(workspace);
		canvas.centerObject(workspace);
		canvas.clipPath = workspace;

		canvasEvents.attachEvents(canvasElement);
		hotkeys.attachEvents();
		autoResize.attachEvents();

		history.save();

		return canvas;
	}

	function syncCanvasState() {
		if (!canvas) return;
		canvas.renderAll();
	}

	function getWorkspace() {
		if (!canvas) return undefined;
		return canvas.getObjects().find((object) => (object as any).name === 'clip') as
			| Rect
			| undefined;
	}

	function center(object: FabricObject) {
		if (!canvas) return;
		canvas.centerObject(object);
	}

	function addToCanvas(object: FabricObject) {
		if (!canvas) return;
		canvas.add(object);
		center(object);
		canvas.setActiveObject(object);
		canvas.renderAll();
	}

	// Export operations
	function generateSaveOptions() {
		const workspace = getWorkspace();
		if (!workspace) {
			return {
				multiplier: 1,
				format: 'png' as const,
				quality: 1,
				width: options.defaultWidth || 800,
				height: options.defaultHeight || 600,
				left: 0,
				top: 0
			};
		}

		const { width, height, left, top } = workspace;
		return {
			multiplier: 1,
			format: 'png' as const,
			quality: 1,
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
		const dataUrl = canvas.toDataURL(options);
		downloadFile(dataUrl, 'png');
		autoResize.autoZoom();
	}

	function saveJpg() {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'jpeg' });
		downloadFile(dataUrl, 'jpg');
		autoResize.autoZoom();
	}

	function saveSvg() {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);
		downloadFile(dataUrl, 'svg');
		autoResize.autoZoom();
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
		autoResize.autoZoom();
	}

	async function saveJson() {
		if (!canvas) return;
		const data = canvas.toJSON();
		await transformText(data.objects);
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, '\t'))}`;
		downloadFile(fileString, 'json');
	}

	function loadJson(json: string) {
		if (!canvas) return;
		const data = JSON.parse(json);
		canvas.loadFromJSON(data, () => {
			autoResize.autoZoom();
		});
	}

	// Drawing mode
	function enableDrawingMode() {
		if (!canvas) return;
		canvas.discardActiveObject();
		canvas.renderAll();
		canvas.isDrawingMode = true;
		if (canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.width = strokeWidth;
			canvas.freeDrawingBrush.color = strokeColor;
		}
	}

	function disableDrawingMode() {
		if (!canvas) return;
		canvas.isDrawingMode = false;
	}

	// Text and Date operations
	function addText(text = 'Text', textOptions = {}) {
		if (!canvas) return;
		const textObj = new Textbox(text, {
			...TEXT_OPTIONS,
			fill: fillColor,
			fontFamily: fontFamily,
			variableValues: window.variableValues || {},
			...textOptions
		});
		const command = new AddElementCommand(canvas, textObj);
		history.execute(command);
		addToCanvas(textObj);
	}

	function addDate() {
		if (!canvas) return;
		const now = new Date();
		const format = 'MM/DD/YYYY';
		const dateText = new Textbox(moment(now).format(format), {
			...TEXT_OPTIONS,
			fill: fillColor,
			fontFamily: fontFamily,
			customType: 'date',
			customDateValue: now.toISOString(),
			customDateFormat: format,
			variableValues: window.variableValues || {}
		});
		const command = new AddElementCommand(canvas, dateText);
		history.execute(command);
		addToCanvas(dateText);
	}

	function changeDateFormat(format: string) {
		if (!canvas) return;
		const active = canvas.getActiveObject();
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
			const dateValue = (active as any).customDateValue;
			const isDynamic = /{{[^{}]+}}/.test(dateValue);
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
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
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
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
			return (active as any).customDateValue || null;
		}
		return null;
	}

	function getActiveDateFormat() {
		if (!canvas) return null;
		const active = canvas.getActiveObject();
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
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
			return (activeObject as Textbox).text || '';
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
			(activeObject as Textbox).set({ text });
			canvas.requestRenderAll();
		}
	}

	// Shape operations
	function addCircle() {
		if (!canvas) return;
		const object = new Circle({
			...CIRCLE_OPTIONS,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			strokeDashArray: strokeDashArray
		});
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addRectangle() {
		if (!canvas) return;
		const object = new Rect({
			...RECTANGLE_OPTIONS,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			strokeDashArray: strokeDashArray
		});
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addSoftRectangle() {
		if (!canvas) return;
		const object = new Rect({
			...RECTANGLE_OPTIONS,
			rx: 50,
			ry: 50,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			strokeDashArray: strokeDashArray
		});
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addTriangle() {
		if (!canvas) return;
		const object = new Triangle({
			...TRIANGLE_OPTIONS,
			fill: fillColor,
			stroke: strokeColor,
			strokeWidth: strokeWidth,
			strokeDashArray: strokeDashArray
		});
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addInverseTriangle() {
		if (!canvas) return;
		const HEIGHT = TRIANGLE_OPTIONS.height;
		const WIDTH = TRIANGLE_OPTIONS.width;
		const object = new Polygon(
			[
				{ x: 0, y: 0 },
				{ x: WIDTH, y: 0 },
				{ x: WIDTH / 2, y: HEIGHT }
			],
			{
				...TRIANGLE_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray
			}
		);
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addDiamond() {
		if (!canvas) return;
		const HEIGHT = DIAMOND_OPTIONS.height;
		const WIDTH = DIAMOND_OPTIONS.width;
		const object = new Polygon(
			[
				{ x: WIDTH / 2, y: 0 },
				{ x: WIDTH, y: HEIGHT / 2 },
				{ x: WIDTH / 2, y: HEIGHT },
				{ x: 0, y: HEIGHT / 2 }
			],
			{
				...DIAMOND_OPTIONS,
				fill: fillColor,
				stroke: strokeColor,
				strokeWidth: strokeWidth,
				strokeDashArray: strokeDashArray
			}
		);
		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	// QR Code and Barcode operations
	async function addQRCode(value: string | null = null) {
		if (!canvas) return;
		const template = '{{default_qrcode}}';
		const dynamicValue = value || `https://metquay.com/generated/${Date.now()}`;
		const finalValue = template.replace('{{default_qrcode}}', dynamicValue);

		const dataUrl = await QRCode.toDataURL(finalValue, {
			errorCorrectionLevel: 'high',
			width: 100
		});

		const img = await FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });
		img.set({
			left: 100,
			top: 100,
			data: {
				type: 'QR Code',
				template,
				errorCorrectionLevel: 'high'
			}
		});

		const command = new AddElementCommand(canvas, img);
		history.execute(command);
		addToCanvas(img);
	}

	async function addBarcode(value: string | null = null) {
		if (!canvas) return;
		const template = 'BAR{{date_code}}';
		const today = new Date();
		const dynamicValue =
			value ||
			`BAR${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
		const finalValue = template.replace('{{date_code}}', dynamicValue);

		const canvasElement = document.createElement('canvas');
		JsBarcode(canvasElement, finalValue, {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: false
		});
		const dataUrl = canvasElement.toDataURL();

		const img = await FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });
		img.set({
			left: 100,
			top: 100,
			data: {
				type: 'Barcode',
				template,
				format: 'CODE128'
			}
		});

		const command = new AddElementCommand(canvas, img);
		history.execute(command);
		addToCanvas(img);
	}

	// Image operations
	async function addImage(fileOrUrl: File | string) {
		if (!canvas) return;
		const handleImage = async (url: string) => {
			const image = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });
			const workspace = getWorkspace();
			image.scaleToWidth((workspace?.width ?? 400) * 0.8);
			const aspectRatio = (image.height ?? 1) / (image.width ?? 1);
			image.set({ height: (image.width ?? 1) * aspectRatio });
			if (!canvas) return;
			const command = new AddElementCommand(canvas, image);
			history.execute(command);
			addToCanvas(image);
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
			reader.readAsDataURL(fileOrUrl);
		}
	}

	// Selection and deletion
	function deleteSelected() {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (canvas) canvas.remove(object);
		});
		canvas.discardActiveObject();
		canvas.renderAll();
		history.save();
	}

	// Zoom operations
	function setZoom(newZoom: number) {
		if (!canvas) return;
		zoom = Math.max(0.2, Math.min(1, newZoom));
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoom);
	}

	function zoomIn() {
		if (!canvas) return;
		let zoomRatio = canvas.getZoom();
		zoomRatio += 0.05;
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoomRatio > 1 ? 1 : zoomRatio);
		zoom = canvas.getZoom();
	}

	function zoomOut() {
		if (!canvas) return;
		let zoomRatio = canvas.getZoom();
		zoomRatio -= 0.05;
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoomRatio < 0.2 ? 0.2 : zoomRatio);
		zoom = canvas.getZoom();
	}

	// Canvas size and background
	function changeSize(value: { width: number; height: number }) {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set(value);
			workspace.clone().then((cloned: Rect) => {
				if (canvas) {
					canvas.clipPath = cloned;
					canvas.renderAll();
				}
			});
			autoResize.autoZoom();
			history.save();
		}
	}

	function changeBackground(value: string) {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set({ fill: value });
			canvas.renderAll();
			history.save();
		}
	}

	// Font and style operations
	function changeFontFamily(value: string) {
		if (!canvas) return;
		fontFamily = value;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontFamily: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontSize(value: number) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontSize: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontWeight(value: number) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontWeight: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontStyle(value: 'normal' | 'italic' | 'oblique') {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontStyle: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontUnderline(value: boolean) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ underline: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontLinethrough(value: boolean) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ linethrough: value });
			}
		});
		canvas.renderAll();
	}

	function changeTextAlign(value: string) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ textAlign: value });
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

	function changeFillColor(value: string) {
		if (!canvas) return;
		fillColor = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ fill: value });
		});
		canvas.renderAll();
	}

	function changeStrokeColor(value: string) {
		if (!canvas) return;
		strokeColor = value;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				object.set({ fill: value });
			} else {
				object.set({ stroke: value });
			}
		});
		if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.color = value;
		}
		canvas.renderAll();
	}

	function changeStrokeWidth(value: number) {
		if (!canvas) return;
		strokeWidth = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ strokeWidth: value });
		});
		if (canvas.isDrawingMode && canvas.freeDrawingBrush) {
			canvas.freeDrawingBrush.width = value;
		}
		canvas.renderAll();
	}

	function changeStrokeDashArray(value: number[]) {
		if (!canvas) return;
		strokeDashArray = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ strokeDashArray: value });
		});
		canvas.renderAll();
	}

	function changeImageFilter(value: string) {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (object.type === 'image') {
				const imageObject = object as FabricImage;
				const effect = createFilter(value);
				// Note: Filter implementation may vary based on fabric.js version
				if (effect && (imageObject as any).filters) {
					(imageObject as any).filters = [effect];
					if ((imageObject as any).applyFilters) {
						(imageObject as any).applyFilters();
					}
				}
				if (canvas) canvas.renderAll();
			}
		});
	}

	// Layer operations
	function bringForward() {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (canvas) canvas.bringObjectForward(object);
		});
		if (canvas) canvas.renderAll();
		const workspace = getWorkspace();
		if (workspace && canvas) {
			canvas.sendObjectToBack(workspace);
		}
	}

	function sendBackwards() {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (canvas) canvas.sendObjectBackwards(object);
		});
		if (canvas) canvas.renderAll();
		const workspace = getWorkspace();
		if (workspace && canvas) {
			canvas.sendObjectToBack(workspace);
		}
	}

	// Getter functions
	function getActiveOpacity() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return 1;
		return selectedObject.get('opacity') || 1;
	}

	function getActiveFontSize() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_SIZE;
		return (selectedObject as Textbox).fontSize || FONT_SIZE;
	}

	function getActiveTextAlign() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'left';
		return (selectedObject as Textbox).textAlign || 'left';
	}

	function getActiveFontUnderline() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as Textbox).underline || false;
	}

	function getActiveFontLinethrough() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as Textbox).linethrough || false;
	}

	function getActiveFontStyle() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'normal';
		return (selectedObject as Textbox).fontStyle || 'normal';
	}

	function getActiveFontWeight() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_WEIGHT;
		return (selectedObject as Textbox).fontWeight || FONT_WEIGHT;
	}

	function getActiveFontFamily() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return fontFamily;
		return (selectedObject as Textbox).fontFamily || fontFamily;
	}

	function getActiveFillColor() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return fillColor;
		return selectedObject.get('fill') || fillColor;
	}

	function getActiveStrokeColor() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return strokeColor;
		return selectedObject.get('stroke') || strokeColor;
	}

	function getActiveStrokeWidth() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return strokeWidth;
		return selectedObject.get('strokeWidth') || strokeWidth;
	}

	function getActiveStrokeDashArray() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return strokeDashArray;
		return selectedObject.get('strokeDashArray') || strokeDashArray;
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

	return {
		canvas,
		container,
		selectedTool,
		selectedObjects,
		zoom,
		viewport,
		fontFamily,
		fillColor,
		strokeColor,
		strokeWidth,
		strokeDashArray,
		hasSelection,
		canvasSize,
		initializeCanvas,
		syncCanvasState,
		getWorkspace,
		center,
		addToCanvas,
		autoZoom: autoResize.autoZoom,
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
		addInverseTriangle,
		addDiamond,
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
		changeFillColor,
		changeStrokeColor,
		changeStrokeWidth,
		changeStrokeDashArray,
		changeImageFilter,
		bringForward,
		sendBackwards,
		savePng,
		saveJpg,
		saveSvg,
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
		getActiveStrokeColor,
		getActiveStrokeWidth,
		getActiveStrokeDashArray,
		getActiveScaleX,
		getActiveScaleY,
		enableDrawingMode,
		disableDrawingMode,
		onUndo: history.undo,
		onRedo: history.redo,
		onCopy: clipboard.copy,
		onPaste: clipboard.paste,
		canUndo: history.canUndo,
		canRedo: history.canRedo,
		history,
		canvasEvents
	};
}
