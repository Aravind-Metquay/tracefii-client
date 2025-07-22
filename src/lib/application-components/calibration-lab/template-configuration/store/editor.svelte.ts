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
	Shadow
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
import {
	FONT_FAMILY,
	FILL_COLOR,
	STROKE_COLOR,
	STROKE_WIDTH,
	STROKE_DASH_ARRAY,
	TEXT_OPTIONS,
	FONT_SIZE,
	FONT_WEIGHT,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	RECTANGLE_OPTIONS,
	TRIANGLE_OPTIONS
} from '../lib/types';

// ================================
// TYPE EXTENSIONS
// ================================

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

// ================================
// INTERFACES
// ================================

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
	lockWorkspaceBounds?: boolean;
}

// ================================
// UTILITY FUNCTIONS
// ================================

function downloadFile(dataUrl: string, format: string): void {
	const link = document.createElement('a');
	link.download = `canvas.${format}`;
	link.href = dataUrl;
	link.click();
}

function isTextType(type: string | undefined): boolean {
	return type === 'text' || type === 'textbox';
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

// ================================
// MAIN EDITOR FUNCTION
// ================================

export function createEditor(options: EditorOptions = {}) {
	// ================================
	// STATE VARIABLES
	// ================================

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
	let workspaceSize = $state({ width: 500, height: 500 });

	// ================================
	// COMPOSABLES
	// ================================

	const history = createHistory({
		canvas,
		saveCallback: options.saveCallback
	});

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

	// ================================
	// DERIVED STATE
	// ================================

	let hasSelection = $derived(selectedObjects.length > 0);
	let canvasSize = $derived(
		canvas
			? { width: canvas.width, height: canvas.height }
			: {
					width: options.defaultWidth || 800,
					height: options.defaultHeight || 600
				}
	);

	// ================================
	// WORKSPACE MANAGEMENT
	// ================================

	function initializeVariableValues(): void {
		if (typeof window !== 'undefined' && !window.variableValues) {
			window.variableValues = {};
		}
	}

	function getWorkspace(): Rect | undefined {
		if (!canvas) return undefined;
		return canvas.getObjects().find((object) => (object as any).name === 'clip') as
			| Rect
			| undefined;
	}

	function constrainObjectToWorkspace(obj: FabricObject, workspace: Rect): void {
		if (!obj || !workspace || obj.name === 'clip') return;

		const objBounds = obj.getBoundingRect();
		const workspaceBounds = workspace.getBoundingRect();

		let newLeft = obj.left;
		let newTop = obj.top;

		// Constrain horizontal position
		if (objBounds.left < workspaceBounds.left) {
			newLeft = obj.left + (workspaceBounds.left - objBounds.left);
		} else if (objBounds.left + objBounds.width > workspaceBounds.left + workspaceBounds.width) {
			newLeft =
				obj.left -
				(objBounds.left + objBounds.width - (workspaceBounds.left + workspaceBounds.width));
		}

		// Constrain vertical position
		if (objBounds.top < workspaceBounds.top) {
			newTop = obj.top + (workspaceBounds.top - objBounds.top);
		} else if (objBounds.top + objBounds.height > workspaceBounds.top + workspaceBounds.height) {
			newTop =
				obj.top -
				(objBounds.top + objBounds.height - (workspaceBounds.top + workspaceBounds.height));
		}

		// Update position if changed
		if (newLeft !== obj.left || newTop !== obj.top) {
			obj.set({ left: newLeft, top: newTop });
		}
	}

	function setupWorkspaceBoundaryConstraints(): void {
		if (!canvas || !options.lockWorkspaceBounds) return;

		const workspace = getWorkspace();
		if (!workspace) return;

		// Event handlers for workspace constraints
		const constraintHandler = (e: any) => {
			const obj = e.target;
			if (obj) {
				constrainObjectToWorkspace(obj, workspace);
			}
		};

		canvas.on('object:moving', constraintHandler);
		canvas.on('object:scaling', constraintHandler);
		canvas.on('object:rotating', constraintHandler);

		canvas.on('object:modified', (e) => {
			const obj = e.target;
			if (obj && canvas) {
				constrainObjectToWorkspace(obj, workspace);
				canvas.requestRenderAll();
			}
		});

		canvas.on('object:added', (e) => {
			const obj = e.target;
			if (obj && obj.name !== 'clip' && canvas) {
				constrainObjectToWorkspace(obj, workspace);
				canvas.requestRenderAll();
			}
		});
	}

	function constrainViewport(): void {
		if (!canvas) return;

		const workspace = getWorkspace();
		if (!workspace) return;

		const zoom = canvas.getZoom();
		const canvasWidth = canvas.getWidth();
		const canvasHeight = canvas.getHeight();
		const workspaceBounds = workspace.getBoundingRect();

		const maxPanX = Math.max(0, (workspaceBounds.width * zoom - canvasWidth) / 2);
		const maxPanY = Math.max(0, (workspaceBounds.height * zoom - canvasHeight) / 2);

		const vpt = canvas.viewportTransform;
		if (!vpt) return;

		// Constrain pan to keep workspace visible
		if (vpt[4] > maxPanX) vpt[4] = maxPanX;
		if (vpt[4] < -maxPanX) vpt[4] = -maxPanX;
		if (vpt[5] > maxPanY) vpt[5] = maxPanY;
		if (vpt[5] < -maxPanY) vpt[5] = -maxPanY;

		canvas.setViewportTransform(vpt);
	}

	function resizeWorkspace(width: number, height: number): void {
		if (!canvas) return;

		const workspace = getWorkspace();
		if (!workspace) return;

		workspace.set({ width, height });
		workspaceSize = { width, height };

		canvas.centerObject(workspace);

		if (options.lockWorkspaceBounds !== false) {
			canvas.clipPath = workspace;
		}

		canvas.requestRenderAll();
		history.save();
	}

	// ================================
	// CANVAS INITIALIZATION
	// ================================
	

	// Move updateWorkspaceBackground to top-level scope
	function updateWorkspaceBackground(color: string) {
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set('fill', color);
			canvas?.requestRenderAll();
		}
	}
	// Add this new method at the top level
function updateBackgroundColor(color: string) {
	if (!canvas) return;
	
	// Update canvas background
	canvas.backgroundColor = color;
	
	// Update workspace fill
	updateWorkspaceBackground(color);
}

// // Add getWorkspace method at top level
// function getWorkspace() {
// 	if (!canvas) return null;
// 	return canvas.getObjects().find(obj => obj.name === 'clip') as Rect | undefined;
// }

	function initializeCanvas(
		canvasElement: HTMLCanvasElement,
		containerElement: HTMLElement,
		 options: {
			 defaultWidth?: number;
	defaultHeight?: number;
  
	backgroundColor?: string;
	lockWorkspaceBounds?: boolean;
   
  } = {}

	): Canvas {
		try {
			initializeVariableValues();

			workspaceSize = {
				width: options.defaultWidth || 500,
				height: options.defaultHeight || 500
			};

			canvas = new Canvas(canvasElement, {
				width: workspaceSize.width,
				height: workspaceSize.height,
				renderOnAddRemove: true,
				preserveObjectStacking: true,
				selection: true,
				skipTargetFind: false,
				allowTouchScrolling: false,
				backgroundColor: options.backgroundColor || '#f8fafc'
			});

			container = containerElement;

			// Set fabric object defaults
			FabricObject.prototype.set({
				cornerColor: '#FFF',
				cornerStyle: 'circle',
				borderColor: '#3b82f6',
				borderScaleFactor: 1.5,
				transparentCorners: false,
				borderOpacityWhenMoving: 1,
				cornerStrokeColor: '#3b82f6'
			});

			// Create workspace
			const workspace = new Rect({
				width: workspaceSize.width,
				height: workspaceSize.height,
				name: 'clip',
				fill:options.backgroundColor || '#f8fafc',
				//  options.backgroundColor || '#f8fafc',
				stroke: '#e5e7eb',
				strokeWidth: 2,
				selectable: false,
				evented: false,
				hasControls: false,
				hoverCursor: 'default',
				moveCursor: 'default',
				shadow: new Shadow({
					color: 'rgba(0,0,0,0.1)',
					blur: 10,
					offsetX: 0,
					offsetY: 2
				})
			});

			canvas.add(workspace);

			// canvas.sendObjectToBack(workspace);

			
					
			// function updateWorkspaceBackground(color: string) {
			// 	const workspace = getWorkspace();
			// 	if (workspace) {
			// 		workspace.set('fill', color);
			// 		canvas?.requestRenderAll();
			// 	}
			// }

			canvas.centerObject(workspace);

			if (options.lockWorkspaceBounds !== false) {
				canvas.clipPath = workspace;
			}

			canvas.backgroundColor = '#f8fafc';

			// Setup constraints and events
			if (options.lockWorkspaceBounds !== false) {
				setupWorkspaceBoundaryConstraints();
			}

			canvas.on('after:render', () => {
				if (options.lockWorkspaceBounds !== false) {
					constrainViewport();
				}
			});

			// Mouse wheel zoom handler
			canvas.on('mouse:wheel', (opt) => {
				if (!canvas || !opt.e.ctrlKey) return;

				const delta = opt.e.deltaY;
				let zoom = canvas.getZoom();
				zoom *= 0.999 ** delta;

				if (zoom > 3) zoom = 3;
				if (zoom < 0.1) zoom = 0.1;

				const point = new Point(opt.e.offsetX, opt.e.offsetY);
				canvas.zoomToPoint(point, zoom);

				opt.e.preventDefault();
				opt.e.stopPropagation();

				if (options.lockWorkspaceBounds !== false) {
					constrainViewport();
				}
			});

			// Attach event handlers
			canvasEvents.attachEvents(canvasElement);
			hotkeys.attachEvents();
			autoResize.attachEvents();

			canvas.requestRenderAll();
			history.save();

			return canvas;
		} catch (error) {
			console.error('Failed to initialize canvas:', error);
			throw error;
		}
	}

	// ================================
	// CANVAS UTILITIES
	// ================================

	function syncCanvasState(): void {
		if (!canvas) return;
		canvas.requestRenderAll();
	}

	function center(object: FabricObject): void {
		if (!canvas) return;

		const workspace = getWorkspace();
		if (workspace) {
			const workspaceCenter = workspace.getCenterPoint();
			object.set({
				left: workspaceCenter.x,
				top: workspaceCenter.y,
				originX: 'center',
				originY: 'center'
			});
		} else {
			canvas.centerObject(object);
		}

		canvas.requestRenderAll();
	}

	function addToCanvas(object: FabricObject): void {
		if (!canvas) return;
		canvas.add(object);
		center(object);
		canvas.setActiveObject(object);
		canvas.renderAll();
	}

	// ================================
	// EXPORT OPERATIONS
	// ================================

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

	function savePng(): void {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);
		downloadFile(dataUrl, 'png');
		autoResize.autoZoom();
	}

	function saveJpg(): void {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'jpeg' });
		downloadFile(dataUrl, 'jpg');
		autoResize.autoZoom();
	}

	function saveSvg(): void {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL(options);
		downloadFile(dataUrl, 'svg');
		autoResize.autoZoom();
	}

	function savePdf(): void {
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

	async function saveJson(): Promise<void> {
		if (!canvas) return;
		const data = canvas.toJSON();
		await transformText(data.objects);
		const fileString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, '\t'))}`;
		downloadFile(fileString, 'json');
	}

	function loadJson(json: string): void {
		if (!canvas) return;
		const data = JSON.parse(json);
		canvas.loadFromJSON(data, () => {
			autoResize.autoZoom();
		});
	}

	// ================================
	// TEXT AND DATE OPERATIONS
	// ================================

	function addText(text = 'Text', textOptions = {}): void {
		if (!canvas) return;

		const textObj = new Textbox(text, {
			...TEXT_OPTIONS,
			fill: fillColor,
			fontFamily: fontFamily,
			fontSize: FONT_SIZE,
			fontWeight: FONT_WEIGHT,
			width: 200,
			height: 50,
			minWidth: 200,
			variableValues: window.variableValues || {},
			...textOptions
		});

		const command = new AddElementCommand(canvas, textObj);
		history.execute(command);
		addToCanvas(textObj);
	}

	function addDate(): void {
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

	function changeDateFormat(format: string): void {
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

	function updateDateValue(newDateStr: string): void {
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

	function getActiveDateValue(): string | null {
		if (!canvas) return null;

		const active = canvas.getActiveObject();
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
			return (active as any).customDateValue || null;
		}

		return null;
	}

	function getActiveDateFormat(): string | null {
		if (!canvas) return null;

		const active = canvas.getActiveObject();
		if (active && isTextType(active.type) && (active as any).customType === 'date') {
			return (active as any).customDateFormat || 'MM/DD/YYYY';
		}

		return null;
	}

	function getActiveText(): string | undefined {
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

	function changeText(text: string): void {
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

	// ================================
	// SHAPE OPERATIONS
	// ================================

	function addCircle(): void {
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

	function addRectangle(): void {
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

	function addSoftRectangle(): void {
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

	function addTriangle(): void {
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

	function addInverseTriangle(): void {
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

	function addDiamond(): void {
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

	// ================================
	// QR CODE AND BARCODE OPERATIONS
	// ================================

	async function addQRCode(value: string | null = null): Promise<void> {
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

	async function addBarcode(value: string | null = null): Promise<void> {
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

	// ================================
	// IMAGE OPERATIONS
	// ================================

	async function addImage(fileOrUrl: File | string): Promise<void> {
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

	// ================================
	// SELECTION AND DELETION
	// ================================

	function deleteSelected(): void {
		if (!canvas) return;

		canvas.getActiveObjects().forEach((object) => {
			if (canvas) canvas.remove(object);
		});

		canvas.discardActiveObject();
		canvas.renderAll();
		history.save();
	}

	// ================================
	// ZOOM OPERATIONS
	// ================================

	function setZoom(newZoom: number): void {
		if (!canvas) return;

		zoom = Math.max(0.2, Math.min(1, newZoom));
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoom);
	}

	function zoomIn(): void {
		if (!canvas) return;

		let zoomRatio = canvas.getZoom();
		zoomRatio += 0.05;
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoomRatio > 1 ? 1 : zoomRatio);
		zoom = canvas.getZoom();
	}

	function zoomOut(): void {
		if (!canvas) return;

		let zoomRatio = canvas.getZoom();
		zoomRatio -= 0.05;
		const center = canvas.getCenter();
		canvas.zoomToPoint(new Point(center.left, center.top), zoomRatio < 0.2 ? 0.2 : zoomRatio);
		zoom = canvas.getZoom();
	}

	// ================================
	// CANVAS SIZE AND BACKGROUND
	// ================================

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
			object.set({ stroke: value });
		});
		canvas.renderAll();
	}

	function changeStrokeWidth(value: number) {
		if (!canvas) return;
		strokeWidth = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ strokeWidth: value });
		});
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
		updateBackgroundColor,
    	updateWorkspaceBackground,
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
		getActiveScaleX,
		getActiveScaleY,
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
