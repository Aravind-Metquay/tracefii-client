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
	Line
} from 'fabric';
import { createHistory } from './history.svelte';
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
	FONT_SIZE,
	FONT_WEIGHT,
	CIRCLE_OPTIONS,
	DIAMOND_OPTIONS,
	RECTANGLE_OPTIONS,
	TRIANGLE_OPTIONS,
	type TextboxPosition
} from '../lib/types';
// ================================
// Type Extensions
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
// Interfaces
// ================================

interface EditorOptions {
	defaultState?: string;
	defaultWidth?: number;
	defaultHeight?: number;
	saveCallback?: () => void;
	clearSelectionCallback?: () => void;
	fontFamily?: string;
	fillColor?: string;
	lockWorkspaceBounds?: boolean;
}

// ================================
// Utility Functions
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
// Main Editor Function
// ================================

export function createEditor(options: EditorOptions = {}) {
	// Default date format
	const DEFAULT_DATE_FORMAT = 'MM/DD/YYYY';

	// Extended textbox type
	interface CustomDateTextbox extends Textbox {
		customType?: 'date';
		customDateValue?: string;
		customDateFormat?: string;
		variableValues?: Record<string, string>;
	}

	// State variables
	let canvas = $state<Canvas | null>(null);
	let container = $state<HTMLElement | null>(null);
	let selectedTool = $state('select');
	let selectedObjects = $state<FabricObject[]>([]);
	let zoom = $state(1);
	let viewport = $state({ x: 0, y: 0 });
	let fontFamily = $state(options.fontFamily || FONT_FAMILY);
	let fillColor = $state(options.fillColor || FILL_COLOR);
	let workspaceSize = $state({ width: 600, height: 600 });

	// Composables
	const history = createHistory({
		canvas,
		saveCallback: options.saveCallback
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
			: {
					width: options.defaultWidth || 800,
					height: options.defaultHeight || 600
				}
	);

	// ================================
	// Workspace Management
	// ================================

	// function initializeVariableValues(): void {
	// 	if (typeof window !== 'undefined' && !window.variableValues) {
	// 		window.variableValues = {};
	// 	}
	// }

	function getWorkspace(): Rect | undefined {
		if (!canvas) return undefined;
		return canvas.getObjects().find((object) => (object as any).name === 'clip') as
			| Rect
			| undefined;
	}

	function constrainObjectToWorkspace(obj: FabricObject, workspace: Rect): void {
		if (!obj || !workspace || obj === workspace) return;

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

		if (newLeft !== obj.left || newTop !== obj.top) {
			obj.set({ left: newLeft, top: newTop });
		}
	}

	function setupWorkspaceBoundaryConstraints(): void {
		if (!canvas || !options.lockWorkspaceBounds) return;

		const workspace = getWorkspace();
		if (!workspace) return;

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

		if (vpt[4] > maxPanX) vpt[4] = maxPanX;
		if (vpt[4] < -maxPanX) vpt[4] = -maxPanX;
		if (vpt[5] > maxPanY) vpt[5] = maxPanY;
		if (vpt[5] < -maxPanY) vpt[5] = -maxPanY;

		canvas.setViewportTransform(vpt);
	}

	// ================================
	// Canvas Initialization
	// ================================

	function initializeCanvas(
		canvasElement: HTMLCanvasElement,
		containerElement: HTMLElement
	): Canvas {
		try {
			// initializeVariableValues();
			canvas = new Canvas(canvasElement, {
				width: options.defaultWidth || 600,
				height: options.defaultHeight || 800,
				renderOnAddRemove: true,
				preserveObjectStacking: true,
				selection: true
			});

			// The 'canvas' variable now exists, so we can attach listeners.
			// ==================================================================
			canvas.on('selection:created', (e) => {
				if (e.selected) {
					selectedObjects = e.selected;
				}
			});

			canvas.on('selection:updated', (e) => {
				if (e.selected) {
					selectedObjects = e.selected;
				}
			});

			canvas.on('selection:cleared', () => {
				selectedObjects = [];
			});
			// ==================================================================

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
				width: workspaceSize.width,
				height: workspaceSize.height,
				name: 'clip',
				fill: 'white',
				selectable: false,
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
			canvas.centerObject(workspace);

			if (options.lockWorkspaceBounds !== false) {
				canvas.clipPath = workspace;
			}

			canvas.backgroundColor = '#f8fafc';

			if (options.lockWorkspaceBounds !== false) {
				setupWorkspaceBoundaryConstraints();
			}

			canvas.on('after:render', () => {
				if (options.lockWorkspaceBounds !== false) {
					constrainViewport();
				}
			});

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

			hotkeys.attachEvents();
			autoResize.attachEvents();

			// Initialize object snapping
			enableSnapping();

			canvas.requestRenderAll();
			history.save();

			return canvas;
		} catch (error) {
			console.error('Failed to initialize canvas:', error);
			throw error;
		}
	}

	// ================================
	// Canvas Utilities
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
	// Text and Date Operations
	// ================================

	// Helper function to sanitize options for Fabric.js objects
	function sanitizeFabricOptions(options: any): any {
		const {
			type,
			canvas,
			_objects,
			_originalState,
			aCoords,
			oCoords,
			matrixCache,
			ownMatrixCache,
			...cleanOptions
		} = options || {};
		return cleanOptions;
	}

	function addText(text = 'Text', textOptions = {}): void {
		if (!canvas) return;

		try {
			// Sanitize textOptions to remove problematic read-only properties
			const cleanTextOptions = sanitizeFabricOptions(textOptions);

			// Base options for the textbox
			const baseOptions = {
				left: 100,
				top: 100,
				fill: fillColor,
				fontFamily: fontFamily,
				fontSize: FONT_SIZE,
				fontWeight: FONT_WEIGHT,
				width: 200,
				height: 50
			};

			// Create the textbox
			const textObj = new Textbox(text, {
				...baseOptions,
				...cleanTextOptions
			});

			// Set custom properties directly instead of using Object.assign
			textObj.variableValues = (window as any).variableValues || {};

			const command = new AddElementCommand(canvas, textObj);
			history.execute(command);
		} catch (error) {
			console.error('Failed to add text:', error);
		}
	}

	function addDate(): void {
		if (!canvas) return;

		try {
			const now = new Date();

			// Base Fabric-safe options
			const baseOptions = {
				left: 100,
				top: 100,
				fill: fillColor,
				fontFamily: fontFamily,
				fontSize: FONT_SIZE,
				fontWeight: FONT_WEIGHT,
				width: 200,
				height: 50
			};

			// Create the textbox for the date
			const dateText = new Textbox(moment(now).format(DEFAULT_DATE_FORMAT), baseOptions);

			// Set custom properties directly instead of using Object.assign
			dateText.customType = 'date';
			dateText.customDateValue = now.toISOString();
			dateText.customDateFormat = DEFAULT_DATE_FORMAT;
			dateText.variableValues = (window as any).variableValues || {};

			const command = new AddElementCommand(canvas, dateText);
			history.execute(command);
		} catch (error) {
			console.error('Failed to add date:', error);
		}
	}

	function changeDateFormat(format: string): void {
		if (!canvas) return;

		try {
			const active = canvas.getActiveObject() as CustomDateTextbox | null;
			if (active?.type === 'textbox' && active.customType === 'date') {
				const dateValue = active.customDateValue || new Date().toISOString();
				const isDynamic = /{{[^{}]+}}/.test(dateValue);

				if (!isDynamic && moment(dateValue).isValid()) {
					active.set({
						text: moment(dateValue).format(format),
						customDateFormat: format
					});
				} else {
					active.set({
						text: dateValue,
						customDateFormat: format
					});
				}

				canvas.requestRenderAll();
			}
		} catch (error) {
			console.error('Failed to change date format:', error);
		}
	}

	function updateDateValue(newDateStr: string): void {
		if (!canvas) return;

		try {
			const active = canvas.getActiveObject() as CustomDateTextbox | null;
			if (active?.type === 'textbox' && active.customType === 'date') {
				const format = active.customDateFormat || DEFAULT_DATE_FORMAT;
				const isDynamic = /{{[^{}]+}}/.test(newDateStr);

				if (!isDynamic) {
					const parsed = moment(newDateStr, format);
					if (parsed.isValid()) {
						active.set({
							customDateValue: parsed.toISOString(),
							text: parsed.format(format)
						});
					} else {
						active.set({
							customDateValue: newDateStr,
							text: newDateStr
						});
					}
				} else {
					active.set({
						customDateValue: newDateStr,
						text: newDateStr
					});
				}

				canvas.requestRenderAll();
			}
		} catch (error) {
			console.error('Failed to update date value:', error);
		}
	}

	function getActiveDateValue(): string | null {
		if (!canvas) return null;

		const active = canvas.getActiveObject() as CustomDateTextbox | null;
		return active?.type === 'textbox' && active.customType === 'date'
			? active.customDateValue || null
			: null;
	}

	function getActiveDateFormat(): string | null {
		if (!canvas) return null;

		const active = canvas.getActiveObject() as CustomDateTextbox | null;
		return active?.type === 'textbox' && active.customType === 'date'
			? active.customDateFormat || DEFAULT_DATE_FORMAT
			: null;
	}

	function getActiveText(): string | undefined {
		if (!canvas) return undefined;

		const activeObject = canvas.getActiveObject();
		if (
			activeObject &&
			(activeObject.type === 'text' || activeObject.type === 'textbox') &&
			(activeObject as CustomDateTextbox).customType !== 'date'
		) {
			return (activeObject as CustomDateTextbox).text || '';
		}
		return undefined;
	}

	function changeText(text: string): void {
		if (!canvas) return;

		try {
			const active = canvas.getActiveObject() as CustomDateTextbox | null;
			if (active?.type === 'textbox' && active.customType !== 'date') {
				active.set({ text });
				canvas.requestRenderAll();
			}
		} catch (error) {
			console.error('Failed to change text:', error);
		}
	}

	function getExactTextboxLocation(textbox?: FabricObject): TextboxPosition | null {
		if (!canvas) return null;

		// Use provided textbox or get active object
		const targetTextbox = textbox || canvas.getActiveObject();

		if (!targetTextbox || targetTextbox.type !== 'textbox') {
			return null;
		}

		try {
			// Get the most accurate bounding rectangle
			const boundingRect = targetTextbox.getBoundingRect();

			// Get canvas element and its screen position
			const canvasEl = canvas.getElement();
			if (!canvasEl) return null;

			const canvasBounds = canvasEl.getBoundingClientRect();
			const zoom = canvas.getZoom() || 1;

			// Convert canvas coordinates to screen coordinates
			const screenPosition = {
				left: canvasBounds.left + boundingRect.left * zoom + window.scrollX,
				top: canvasBounds.top + boundingRect.top * zoom + window.scrollY,
				width: boundingRect.width * zoom,
				height: boundingRect.height * zoom
			};

			return screenPosition;
		} catch (error) {
			console.error('Failed to get exact textbox location:', error);
			return null;
		}
	}

	// ================================
	// Object Snapping System
	// ================================

	interface ObjectGuides {
		left: { left: number; top: number };
		right: { left: number; top: number };
		top: { left: number; top: number };
		bottom: { left: number; top: number };
		centerX: { left: number; top: number };
		centerY: { left: number; top: number };
	}

	interface SnapGuide extends FabricObject {
		isSnapGuide?: boolean;
	}

	const SNAP_THRESHOLD = 10;
	const GUIDE_COLOR = 'rgb(178, 207, 255)';
	let snapGuides: SnapGuide[] = [];

	function calculateObjectGuides(obj: FabricObject): ObjectGuides {
		const bounds = obj.getBoundingRect();
		const left = bounds.left;
		const top = bounds.top;
		const right = left + bounds.width;
		const bottom = top + bounds.height;
		const centerX = left + bounds.width / 2;
		const centerY = top + bounds.height / 2;

		return {
			left: { left, top },
			right: { left: right, top },
			top: { left, top },
			bottom: { left, top: bottom },
			centerX: { left: centerX, top },
			centerY: { left, top: centerY }
		};
	}

	function createSnapGuide(type: 'horizontal' | 'vertical', position: number): SnapGuide {
		if (!canvas) throw new Error('Canvas not initialized');

		const lineProps = {
			stroke: GUIDE_COLOR,
			strokeWidth: 1,
			selectable: false,
			evented: false,
			opacity: 0.8,
			isSnapGuide: true
		};

		if (type === 'horizontal') {
			return new Line([0, 0, canvas.width!, 0], {
				...lineProps,
				left: 0,
				top: position
			}) as SnapGuide;
		} else {
			return new Line([0, 0, 0, canvas.height!], {
				...lineProps,
				left: position,
				top: 0
			}) as SnapGuide;
		}
	}

	function clearSnapGuides(): void {
		if (!canvas || snapGuides.length === 0) return;

		// Remove guides without triggering render for each one
		snapGuides.forEach((guide) => {
			canvas!.remove(guide);
		});
		snapGuides = [];
		// Single render call after all guides are removed
		canvas.requestRenderAll();
	}

	function showSnapGuide(type: 'horizontal' | 'vertical', position: number): void {
		if (!canvas) return;

		// Check if we already have a guide at this position to avoid duplicates
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
		canvas.add(guide);
	}

	function isInSnapRange(a: number, b: number): boolean {
		return Math.abs(a - b) <= SNAP_THRESHOLD;
	}

	function snapObject(obj: FabricObject, property: 'left' | 'top', value: number): void {
		obj.set(property, value);
		obj.setCoords();
	}

	function handleObjectSnapping(movingObj: FabricObject): void {
		if (!canvas) return;

		clearSnapGuides();

		const movingBounds = movingObj.getBoundingRect();
		const otherObjects = canvas
			.getObjects()
			.filter(
				(obj) =>
					obj !== movingObj && !(obj as SnapGuide).isSnapGuide && (obj as any).name !== 'clip'
			);

		let snapX: number | null = null;
		let snapY: number | null = null;
		let snapGuideX: number | null = null;
		let snapGuideY: number | null = null;

		// Find the closest snap points
		let minXDistance = SNAP_THRESHOLD + 1;
		let minYDistance = SNAP_THRESHOLD + 1;

		otherObjects.forEach((targetObj) => {
			const targetBounds = targetObj.getBoundingRect();

			// Calculate all possible snap positions
			const snapPositions = {
				// Align edges
				left: targetBounds.left,
				right: targetBounds.left + targetBounds.width,
				centerX: targetBounds.left + targetBounds.width / 2,
				top: targetBounds.top,
				bottom: targetBounds.top + targetBounds.height,
				centerY: targetBounds.top + targetBounds.height / 2,
				// Edge-to-edge positions
				leftToRight: targetBounds.left + targetBounds.width,
				rightToLeft: targetBounds.left - movingBounds.width,
				topToBottom: targetBounds.top + targetBounds.height,
				bottomToTop: targetBounds.top - movingBounds.height
			};

			// Check horizontal snapping (X-axis)
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

			// Check vertical snapping (Y-axis)
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

		// Apply snapping
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

		// Only render if we actually snapped
		if (snapX !== null || snapY !== null) {
			canvas.requestRenderAll();
		}
	}

	let snapTimeout: number | null = null;

	function setupObjectSnapping(): void {
		if (!canvas) return;

		canvas.on('object:moving', (e) => {
			const obj = e.target;
			if (obj && !(obj as SnapGuide).isSnapGuide) {
				// Throttle snapping calculations to reduce jitter
				if (snapTimeout) {
					clearTimeout(snapTimeout);
				}
				snapTimeout = window.setTimeout(() => {
					handleObjectSnapping(obj);
					snapTimeout = null;
				}, 16); // ~60fps
			}
		});

		canvas.on('object:modified', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			clearSnapGuides();
		});

		canvas.on('selection:cleared', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			clearSnapGuides();
		});

		canvas.on('mouse:up', () => {
			if (snapTimeout) {
				clearTimeout(snapTimeout);
				snapTimeout = null;
			}
			// Clear guides immediately on mouse up
			clearSnapGuides();
		});

		canvas.on('mouse:down', () => {
			// Clear any existing guides when starting to move
			clearSnapGuides();
		});
	}

	function enableSnapping(): void {
		setupObjectSnapping();
	}

	function disableSnapping(): void {
		if (!canvas) return;

		// Clear any pending snap timeout
		if (snapTimeout) {
			clearTimeout(snapTimeout);
			snapTimeout = null;
		}

		// Remove all snap-related event listeners
		canvas.off('object:moving');
		canvas.off('object:modified');
		canvas.off('selection:cleared');
		canvas.off('mouse:up');
		canvas.off('mouse:down');

		// Clear all snap guides
		clearSnapGuides();
	}

	// ================================
	// Shape Operations
	// ================================

	function addCircle(): void {
		if (!canvas) return;

		const object = new Circle({
			...CIRCLE_OPTIONS,
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addRectangle(): void {
		if (!canvas) return;

		const object = new Rect({
			...RECTANGLE_OPTIONS,
			fill: fillColor
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
			fill: fillColor
		});

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	function addTriangle(): void {
		if (!canvas) return;

		const object = new Triangle({
			...TRIANGLE_OPTIONS,
			fill: fillColor
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
				fill: fillColor
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
				fill: fillColor
			}
		);

		const command = new AddElementCommand(canvas, object);
		history.execute(command);
		addToCanvas(object);
	}

	// ================================
	// QR Code and Barcode Operations
	// ================================

	async function addQRCode(value: string | null = null): Promise<void> {
		if (!canvas) return;

		const template = '{{default_qrcode}}';
		const dynamicValue = value || `https://metquay.com/generated/${Date.now()}`;
		const finalValue = template.replace('{{default_qrcode}}', dynamicValue);

		const dataUrl = await QRCode.toDataURL(finalValue, {
			errorCorrectionLevel: 'H',
			width: 100
		});

		const img = await FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });
		img.set({
			left: 100,
			top: 100,
			data: {
				type: 'QR Code',
				expression: template,
				errorCorrectionLevel: 'H'
			}
		});

		const command = new AddElementCommand(canvas, img);
		history.execute(command);
	}

	async function addBarcode(): Promise<void> {
		if (!canvas) return;

		const initialExpression = 'BAR##date_code##';

		// Evaluate the initial expression for the first creation
		const today = new Date();
		const dateCode = `${today.getFullYear()}${(today.getMonth() + 1)
			.toString()
			.padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}`;
		const initialValue = initialExpression.replace(/##date_code##/gi, dateCode);

		// Define initial options
		const barcodeOptions = {
			format: 'CODE128',
			width: 2,
			height: 50,
			displayValue: true
		};

		// Generate the barcode image
		const canvasElement = document.createElement('canvas');
		JsBarcode(canvasElement, initialValue, barcodeOptions);
		const dataUrl = canvasElement.toDataURL();
		const img = await FabricImage.fromURL(dataUrl, { crossOrigin: 'anonymous' });

		img.set({
			left: 100,
			top: 100,
			// Save all initial settings to the data object for later editing
			data: {
				type: 'Barcode',
				expression: initialExpression, // Store the expression
				format: barcodeOptions.format,
				barWidth: barcodeOptions.width,
				barHeight: barcodeOptions.height,
				displayValue: barcodeOptions.displayValue
			}
		});

		const command = new AddElementCommand(canvas, img);
		history.execute(command);
	}

	// Replacing previouys QRCODE
	function replaceObject(oldObject: FabricObject, newObject: FabricObject): void {
		if (!canvas || !oldObject || !newObject) return;

		// The calling function is responsible for setting the new object's properties.
		// This function just performs the swap on the canvas.
		canvas.remove(oldObject);
		canvas.add(newObject);
		canvas.setActiveObject(newObject);
		canvas.requestRenderAll();
		history.save(); // Save the state after replacement
	}

	// ================================
	// Image Operations
	// ================================

	async function addImage(fileOrUrl: File | string) {
		if (!canvas) return;

		const readFileAsDataURL = (file: File): Promise<string> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.onload = () => {
					if (typeof reader.result === 'string') {
						resolve(reader.result);
					} else {
						reject(new Error('Failed to read file as data URL'));
					}
				};
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(file);
			});
		};

		const handleImage = async (url: string, crossOrigin?: 'anonymous' | 'use-credentials' | '') => {
			try {
				const image = await FabricImage.fromURL(url, { crossOrigin });

				const workspace = getWorkspace();
				image.scaleToWidth((workspace?.width ?? 400) * 0.5);

				const aspectRatio = image.height / image.width;
				image.set({ height: image.width * aspectRatio });

				if (!canvas) return;

				const command = new AddElementCommand(canvas, image);
				history.execute(command);
			} catch (err) {
				console.error('Failed to load image:', err);
			}
		};

		if (typeof fileOrUrl === 'string') {
			await handleImage(fileOrUrl, 'anonymous');
		} else {
			try {
				const dataUrl = await readFileAsDataURL(fileOrUrl);
				await handleImage(dataUrl);
			} catch (err) {
				console.error('Error reading file:', err);
			}
		}
	}
	// ================================
	// Export Operations
	// ================================

	function generateSaveOptions() {
		if (!canvas) {
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
		const svgOptions = {
			...options,
			width: options.width.toString(),
			height: options.height.toString()
		};
		const svg = canvas.toSVG(svgOptions);
		const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
		downloadFile(dataUrl, 'svg');
		autoResize.autoZoom();
	}

	function savePdf(): void {
		if (!canvas) return;
		const options = generateSaveOptions();
		canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
		const dataUrl = canvas.toDataURL({ ...options, format: 'png' });

		const widthInInches = options.width / 72;
		const heightInInches = options.height / 72;

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
	// Selection and Deletion
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
	// Zoom Operations
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
	// Canvas Size and Background
	// ================================

	function changeSize(value: { width: number; height: number }): void {
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

	function changeBackground(value: string): void {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace) {
			workspace.set({ fill: value });
			canvas.renderAll();
			history.save();
		}
	}

	// ================================
	// Font and Style Operations
	// ================================

	function changeFontFamily(value: string): void {
		if (!canvas) return;
		fontFamily = value;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontFamily: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontSize(value: number): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ fontSize: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontWeight(value?: number): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				const textObj = object as Textbox;
				if (value === undefined) {
					const currentWeight = Number(textObj.fontWeight) || 400;
					value = currentWeight >= 700 ? 400 : 700;
				}
				textObj.set({ fontWeight: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontStyle(value?: 'normal' | 'italic' | 'oblique'): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				const textObj = object as Textbox;
				if (value === undefined) {
					const currentStyle = textObj.fontStyle || 'normal';
					value = currentStyle === 'italic' ? 'normal' : 'italic';
				}
				textObj.set({ fontStyle: value });
			}
		});
		canvas.renderAll();
	}

	function changeFontUnderline(value?: boolean): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				const textObj = object as Textbox;
				if (value === undefined) {
					const currentUnderline = textObj.underline || false;
					value = !currentUnderline;
				}
				textObj.set({ underline: value });
			}
		});
		canvas.renderAll();
	}

	function changeTextAlign(value: string): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			if (isTextType(object.type)) {
				(object as Textbox).set({ textAlign: value });
			}
		});
		canvas.renderAll();
	}

	function changeOpacity(value: number): void {
		if (!canvas) return;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ opacity: value });
		});
		canvas.renderAll();
	}

	function changeFillColor(value: string): void {
		if (!canvas) return;
		fillColor = value;
		canvas.getActiveObjects().forEach((object) => {
			object.set({ fill: value });
		});
		canvas.renderAll();
	}

	// ================================
	// Layer Operations
	// ================================

	function bringForward(): void {
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

	function sendBackwards(): void {
		if (!canvas) return;
		const workspace = getWorkspace();
		if (workspace && canvas) {
			canvas.sendObjectToBack(workspace);
		}
		canvas.getActiveObjects().forEach((object) => {
			if (canvas) canvas.sendObjectBackwards(object);
		});
		if (canvas) canvas.renderAll();
		console.log(canvas._objects);
	}

	// ================================
	// Getter Functions
	// ================================

	function getActiveOpacity(): number {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return 1;
		return selectedObject.get('opacity') || 1;
	}

	function getActiveFontSize(): number {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_SIZE;
		return (selectedObject as Textbox).fontSize || FONT_SIZE;
	}

	function getActiveTextAlign(): string {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'left';
		return (selectedObject as Textbox).textAlign || 'left';
	}

	function getActiveFontUnderline(): boolean {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as Textbox).underline || false;
	}

	function getActiveFontLinethrough(): boolean {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return false;
		return (selectedObject as Textbox).linethrough || false;
	}

	function getActiveFontStyle(): string {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return 'normal';
		return (selectedObject as Textbox).fontStyle || 'normal';
	}

	function getActiveFontWeight() {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return FONT_WEIGHT;
		return (selectedObject as Textbox).fontWeight || FONT_WEIGHT;
	}

	function getActiveFontFamily(): string {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || !isTextType(selectedObject.type)) return fontFamily;
		return (selectedObject as Textbox).fontFamily || fontFamily;
	}

	function getActiveFillColor(): string {
		const selectedObject = selectedObjects[0];
		if (!selectedObject) return fillColor;
		return selectedObject.get('fill') || fillColor;
	}

	// Make these reactive by depending on selectedObjects
	let activeScaleX = $derived.by(() => {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || typeof selectedObject.scaleX !== 'number') return 1.0;
		return selectedObject.scaleX;
	});

	let activeScaleY = $derived.by(() => {
		const selectedObject = selectedObjects[0];
		if (!selectedObject || typeof selectedObject.scaleY !== 'number') return 1.0;
		return selectedObject.scaleY;
	});

	function getActiveScaleX(): number {
		return activeScaleX;
	}

	function getActiveScaleY(): number {
		return activeScaleY;
	}

	function updateObjectSize(dimension: 'width' | 'height', pixelValue: number) {
		if (!canvas || pixelValue <= 0) return false;

		const obj = canvas.getActiveObject();
		if (!obj || !('width' in obj) || !('height' in obj)) return false;

		const originalSize = dimension === 'width' ? obj.width : obj.height;
		if (!originalSize) return false;

		const newScale = pixelValue / originalSize;

		// Check if aspect ratio is locked
		if (obj.lockScalingX) {
			obj.set({
				scaleX: newScale,
				scaleY: newScale
			});
		} else {
			if (dimension === 'width') {
				obj.set('scaleX', newScale);
			} else {
				obj.set('scaleY', newScale);
			}
		}

		obj.setCoords(); // Important: Update object coordinates
		canvas.requestRenderAll();

		// Save to history for undo/redo
		if (history?.save) {
			history.save();
		}

		return true;
	}

	// ================================
	// Public API
	// ================================

	return {
		get canvas() {
			return canvas;
		},
		get container() {
			return container;
		},
		get selectedTool() {
			return selectedTool;
		},
		set selectedTool(value) {
			selectedTool = value;
		},
		get selectedObjects() {
			return selectedObjects;
		},
		get zoom() {
			return zoom;
		},
		get viewport() {
			return viewport;
		},
		get fontFamily() {
			return fontFamily;
		},
		set fontFamily(value) {
			fontFamily = value;
		},
		get fillColor() {
			return fillColor;
		},
		set fillColor(value) {
			fillColor = value;
		},
		get hasSelection() {
			return hasSelection;
		},
		get canvasSize() {
			return canvasSize;
		},
		get workspaceSize() {
			return workspaceSize;
		},

		// Functions
		get initializeCanvas() {
			return initializeCanvas;
		},
		get syncCanvasState() {
			return syncCanvasState;
		},
		get getWorkspace() {
			return getWorkspace;
		},
		get center() {
			return center;
		},
		get addToCanvas() {
			return addToCanvas;
		},
		get autoZoom() {
			return autoResize.autoZoom;
		},
		get addText() {
			return addText;
		},
		get addDate() {
			return addDate;
		},
		get changeDateFormat() {
			return changeDateFormat;
		},
		get updateDateValue() {
			return updateDateValue;
		},
		get getActiveDateValue() {
			return getActiveDateValue;
		},
		get getActiveDateFormat() {
			return getActiveDateFormat;
		},
		get getActiveText() {
			return getActiveText;
		},
		get changeText() {
			return changeText;
		},
		get getExactTextboxLocation() {
			return getExactTextboxLocation;
		},
		get enableSnapping() {
			return enableSnapping;
		},
		get disableSnapping() {
			return disableSnapping;
		},
		get clearSnapGuides() {
			return clearSnapGuides;
		},
		get replaceObject() {
			return replaceObject;
		},
		get addQRCode() {
			return addQRCode;
		},
		get addBarcode() {
			return addBarcode;
		},
		get addImage() {
			return addImage;
		},
		get addCircle() {
			return addCircle;
		},
		get addRectangle() {
			return addRectangle;
		},
		get addSoftRectangle() {
			return addSoftRectangle;
		},
		get addTriangle() {
			return addTriangle;
		},
		get addInverseTriangle() {
			return addInverseTriangle;
		},
		get addDiamond() {
			return addDiamond;
		},
		get deleteSelected() {
			return deleteSelected;
		},
		get setZoom() {
			return setZoom;
		},
		get zoomIn() {
			return zoomIn;
		},
		get zoomOut() {
			return zoomOut;
		},
		get changeSize() {
			return changeSize;
		},
		get changeBackground() {
			return changeBackground;
		},
		get changeFontFamily() {
			return changeFontFamily;
		},
		get changeFontSize() {
			return changeFontSize;
		},
		get changeFontWeight() {
			return changeFontWeight;
		},
		get changeFontStyle() {
			return changeFontStyle;
		},
		get changeFontUnderline() {
			return changeFontUnderline;
		},
		get changeTextAlign() {
			return changeTextAlign;
		},
		get changeOpacity() {
			return changeOpacity;
		},
		get changeFillColor() {
			return changeFillColor;
		},
		get bringForward() {
			return bringForward;
		},
		get sendBackwards() {
			return sendBackwards;
		},
		get savePng() {
			return savePng;
		},
		get saveJpg() {
			return saveJpg;
		},
		get saveSvg() {
			return saveSvg;
		},
		get savePdf() {
			return savePdf;
		},
		get saveJson() {
			return saveJson;
		},
		get loadJson() {
			return loadJson;
		},
		get getActiveOpacity() {
			return getActiveOpacity;
		},
		get getActiveFontSize() {
			return getActiveFontSize;
		},
		get getActiveTextAlign() {
			return getActiveTextAlign;
		},
		get getActiveFontUnderline() {
			return getActiveFontUnderline;
		},
		get getActiveFontLinethrough() {
			return getActiveFontLinethrough;
		},
		get getActiveFontStyle() {
			return getActiveFontStyle;
		},
		get getActiveFontWeight() {
			return getActiveFontWeight;
		},
		get getActiveFontFamily() {
			return getActiveFontFamily;
		},
		get getActiveFillColor() {
			return getActiveFillColor;
		},
		get getActiveScaleX() {
			return getActiveScaleX;
		},
		get getActiveScaleY() {
			return getActiveScaleY;
		},
		get onUndo() {
			return history.undo;
		},
		get onRedo() {
			return history.redo;
		},
		get onCopy() {
			return clipboard.copy;
		},
		get onPaste() {
			return clipboard.paste;
		},
		get canUndo() {
			return history.canUndo;
		},
		get canRedo() {
			return history.canRedo;
		},
		get history() {
			return history;
		},
		get updateObjectSize() {
			return updateObjectSize;
		}
	};
}
