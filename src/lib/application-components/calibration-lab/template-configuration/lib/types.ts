import type { Canvas, FabricObject, Rect } from 'fabric';
import type { createHistory } from '../store/history.svelte';
import type { createCanvasEvents } from '../store/canvas-events.svelte';

// ============================================================================
// EXTENDED FABRIC OBJECT TYPES
// ============================================================================

/**
 * Extended FabricObject with custom properties for template components
 */
export interface ExtendedFabricObject extends FabricObject {
	data?: {
		template?: string;
		format?: string;
		displayValue?: boolean;
		dateFormat?: string;
		[key: string]: any;
	};

	// Text properties
	fontSize?: number;
	fontFamily?: string;
	fontWeight?: string | number;
	fontStyle?: string;
	textAlign?: string;
	underline?: boolean;
	linethrough?: boolean;

	// Date-specific properties
	customDateFormat?: string;
	customDateValue?: string;
}

// ============================================================================
// BASIC TYPES
// ============================================================================

export type ComponentType = 'Text' | 'Date' | 'Image' | 'Barcode' | 'QR Code' | null;
export type TemplateType = string;
export type UnitType = 'cm' | 'mm' | 'in' | 'px';
export type Dimensions = { width: string; height: string };
export type Color = { r: number; g: number; b: number };

// Position types for textbox location
export interface TextboxPosition {
	left: number;
	top: number;
	width: number;
	height: number;
}

// ============================================================================
// CONSTANTS
// ============================================================================

// Style Constants
export const FILL_COLOR = '#000000';
export const STROKE_COLOR = '#000000';
export const STROKE_WIDTH = 1;
export const STROKE_DASH_ARRAY: number[] = [];
export const FONT_FAMILY = 'Times New Roman';
export const FONT_SIZE = 24;
export const FONT_WEIGHT = 400;

// Component Types
export const COMPONENT_TYPES = {
	TEXT: 'Text',
	DATE: 'Date',
	IMAGE: 'Image',
	QR_CODE: 'QR Code',
	BARCODE: 'Barcode'
} as const;

// Tools
export const TOOLS = {
	SELECT: 'select',
	TEXT: 'text',
	IMAGE: 'image',
	RECTANGLE: 'rectangle',
	CIRCLE: 'circle'
} as const;

// Template Types
export const TEMPLATE_TYPES = {
	LABEL: 'Label',
	CERTIFICATE: 'Certificate'
} as const;

// ============================================================================
// DEFAULT OPTIONS FOR OBJECTS
// ============================================================================

export const TEXT_OPTIONS = {
	left: 100,
	top: 100,
	fill: FILL_COLOR,
	fontSize: FONT_SIZE,
	fontFamily: FONT_FAMILY,
	width: 200,
	height: 50,
	minWidth: 200
} as const;

export const RECTANGLE_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
} as const;

export const CIRCLE_OPTIONS = {
	radius: 50,
	left: 100,
	top: 100
} as const;

export const TRIANGLE_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
} as const;

export const DIAMOND_OPTIONS = {
	width: 100,
	height: 100,
	left: 100,
	top: 100
} as const;

// ============================================================================
// MAIN INTERFACES
// ============================================================================

/**
 * Application state interface
 */
export interface AppState {
	uiState: {
		selectedType: string;
		dimensions: { width: number; height: number };
		unit: string;
		backgroundColor: string;
	};
	editor: Editor;
	canAddComponents: boolean;
	availableComponents: string[];
	setSelectedComponentType: (type: string) => void;
	setSelectedType: (type: string) => void;
}

/**
 * Main editor interface containing all canvas operations and state
 */
export interface Editor {
	// ========================================================================
	// CORE PROPERTIES
	// ========================================================================
	canvas: Canvas | null;
	container: HTMLElement | null;
	selectedTool: string;
	selectedObjects: FabricObject[];
	zoom: number;
	viewport: { x: number; y: number };
	fontFamily: string;
	fillColor: string;
	hasSelection: boolean;
	canvasSize: { width: number; height: number };
	history: ReturnType<typeof createHistory>;
	canvasEvents: ReturnType<typeof createCanvasEvents>;
	updateObjectSize: (dimension: 'width' | 'height', pixelValue: number) => boolean;

	// ========================================================================
	// CANVAS MANAGEMENT
	// ========================================================================
	initializeCanvas: (canvasElement: HTMLCanvasElement, containerElement: HTMLElement) => void;
	syncCanvasState: () => void;
	getWorkspace: () => Rect | undefined;
	center: (object: FabricObject) => void;
	addToCanvas: (object: FabricObject) => void;
	autoZoom: () => void;

	// ========================================================================
	// TEXT OPERATIONS
	// ========================================================================
	addText: (text?: string, textOptions?: any) => void;
	getActiveText: () => string | undefined;
	changeText: (text: string) => void;
	getExactTextboxLocation: (textbox?: FabricObject) => TextboxPosition | null;

	// ========================================================================
	// DATE OPERATIONS
	// ========================================================================
	addDate: () => void;
	changeDateFormat: (format: string) => void;
	updateDateValue: (newDateStr: string) => void;
	getActiveDateValue: () => string | null;
	getActiveDateFormat: () => string | null;

	// ========================================================================
	// QR CODE OPERATIONS
	// ========================================================================
	addQRCode: (value?: string | null) => Promise<void>;
	changeQRData: (value: string) => void;
	changeQRSize: (value: number) => void;
	changeQRErrorLevel: (value: string) => void;
	changeQRForegroundColor: (value: string) => void;
	changeQRBackgroundColor: (value: string) => void;
	changeQRIncludeMargin: (value: boolean) => void;

	// ========================================================================
	// BARCODE OPERATIONS
	// ========================================================================
	addBarcode: (value?: string | null) => Promise<void>;
	changeBarcodeData: (value: string) => void;
	changeBarcodeType: (value: string) => void;
	changeBarcodeWidth: (value: number) => void;
	changeBarcodeHeight: (value: number) => void;
	changeBarcodeShowText: (value: boolean) => void;

	// ========================================================================
	// IMAGE OPERATIONS
	// ========================================================================
	addImage: (fileOrUrl: File | string) => Promise<void>;

	// ========================================================================
	// SHAPE OPERATIONS
	// ========================================================================
	addCircle: () => void;
	addRectangle: () => void;
	addSoftRectangle: () => void;
	addTriangle: () => void;

	// ========================================================================
	// OBJECT MANAGEMENT
	// ========================================================================
	deleteSelected: () => void;
	bringForward: () => void;
	sendBackwards: () => void;

	// ========================================================================
	// ZOOM AND VIEW OPERATIONS
	// ========================================================================
	setZoom: (newZoom: number) => void;
	zoomIn: () => void;
	zoomOut: () => void;

	// ========================================================================
	// CANVAS PROPERTIES
	// ========================================================================
	changeSize: (value: { width: number; height: number }) => void;
	changeBackground: (value: string) => void;

	// ========================================================================
	// FONT STYLING
	// ========================================================================
	changeFontFamily: (value: string) => void;
	changeFontSize: (value: number) => void;
	changeFontWeight: (value: string | number) => void;
	changeFontStyle: (value: 'normal' | 'italic' | 'oblique') => void;
	changeFontUnderline: (value: boolean) => void;
	changeFontLinethrough: (value: boolean) => void;
	changeTextAlign: (value: string) => void;
	changeOpacity: (value: number) => void;

	// ========================================================================
	// PROPERTY GETTERS
	// ========================================================================
	getActiveOpacity: () => number;
	getActiveFontSize: () => number;
	getActiveTextAlign: () => string;
	getActiveFontUnderline: () => boolean;
	getActiveFontLinethrough: () => boolean;
	getActiveFontStyle: () => string;
	getActiveFontWeight: () => string | number;
	getActiveFontFamily: () => string;
	getActiveFillColor: () => string;
	getActiveScaleX: () => number;
	getActiveScaleY: () => number;

	// ========================================================================
	// FILE OPERATIONS
	// ========================================================================
	savePng: () => void;
	saveJpg: () => void;
	savePdf: () => void;
	saveJson: () => Promise<void>;
	loadJson: (json: string) => void;
}
