import type { Canvas, FabricObject, Rect } from 'fabric';
import type { createHistory } from '../store/history.svelte';
import type { createCanvasEvents } from '../store/canvas-events.svelte';

// Extended FabricObject types for custom properties
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

export type ComponentType = 'Text' | 'Date' | 'Image' | 'Barcode' | 'QR Code' | null;
export type TemplateType = string;
export type UnitType = 'cm' | 'mm' | 'in';
export type Dimensions = { width: string; height: string };
export type Color = { r: number; g: number; b: number };

export const COMPONENT_TYPES = {
	TEXT: 'Text',
	DATE: 'Date',
	IMAGE: 'Image',
	QR_CODE: 'QR Code',
	BARCODE: 'Barcode'
};

export const TOOLS = {
	SELECT: 'select',
	TEXT: 'text',
	IMAGE: 'image',
	RECTANGLE: 'rectangle',
	CIRCLE: 'circle'
};

export const TEMPLATE_TYPES = {
	LABEL: 'Label',
	CERTIFICATE: 'Certificate'
};

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

export interface Editor {
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
	initializeCanvas: (canvasElement: HTMLCanvasElement, containerElement: HTMLElement) => void;
	syncCanvasState: () => void;
	getWorkspace: () => Rect | undefined;
	center: (object: FabricObject) => void;
	addToCanvas: (object: FabricObject) => void;
	autoZoom: () => void;
	addText: (text?: string, textOptions?: any) => void;
	addDate: () => void;
	changeDateFormat: (format: string) => void;
	updateDateValue: (newDateStr: string) => void;
	getActiveDateValue: () => string | null;
	getActiveDateFormat: () => string | null;
	getActiveText: () => string | undefined;
	changeText: (text: string) => void;
	addQRCode: (value?: string | null) => Promise<void>;
	addBarcode: (value?: string | null) => Promise<void>;
	changeBarcodeData: (value: string) => void;
	changeBarcodeType: (value: string) => void;
	changeBarcodeWidth: (value: number) => void;
	changeBarcodeHeight: (value: number) => void;
	changeBarcodeShowText: (value: boolean) => void;
	changeQRData: (value: string) => void;
	changeQRSize: (value: number) => void;
	changeQRErrorLevel: (value: string) => void;
	changeQRForegroundColor: (value: string) => void;
	changeQRBackgroundColor: (value: string) => void;
	changeQRIncludeMargin: (value: boolean) => void;
	addImage: (fileOrUrl: File | string) => Promise<void>;
	addCircle: () => void;
	addRectangle: () => void;
	addSoftRectangle: () => void;
	addTriangle: () => void;
	deleteSelected: () => void;
	setZoom: (newZoom: number) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	changeSize: (value: { width: number; height: number }) => void;
	changeBackground: (value: string) => void;
	changeFontFamily: (value: string) => void;
	changeFontSize: (value: number) => void;
	changeFontWeight: (value: string | number) => void;
	changeFontStyle: (value: 'normal' | 'italic' | 'oblique') => void;
	changeFontUnderline: (value: boolean) => void;
	changeFontLinethrough: (value: boolean) => void;
	changeTextAlign: (value: string) => void;
	changeOpacity: (value: number) => void;
	bringForward: () => void;
	sendBackwards: () => void;
	savePng: () => void;
	saveJpg: () => void;
	savePdf: () => void;
	saveJson: () => Promise<void>;
	loadJson: (json: string) => void;
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
	history: ReturnType<typeof createHistory>;
	canvasEvents: ReturnType<typeof createCanvasEvents>;
}
