import type * as fabric from 'fabric';
import type { createHistory } from '../store/history.svelte';
import type { createCanvasEvents } from '../store/canvas-events.svelte';

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
	canvas: fabric.Canvas | null;
	container: HTMLElement | null;
	selectedTool: string;
	selectedObjects: fabric.Object[];
	zoom: number;
	viewport: { x: number; y: number };
	fontFamily: string;
	fillColor: string;
	strokeColor: string;
	strokeWidth: number;
	strokeDashArray: number[];
	hasSelection: boolean;
	canvasSize: { width: number; height: number };
	initializeCanvas: (canvasElement: HTMLCanvasElement, containerElement: HTMLElement) => void;
	syncCanvasState: () => void;
	getWorkspace: () => fabric.Rect | undefined;
	center: (object: fabric.Object) => void;
	addToCanvas: (object: fabric.Object) => void;
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
	addImage: (fileOrUrl: File | string) => Promise<void>;
	addCircle: () => void;
	addRectangle: () => void;
	addSoftRectangle: () => void;
	addTriangle: () => void;
	addInverseTriangle: () => void;
	addDiamond: () => void;
	deleteSelected: () => void;
	setZoom: (newZoom: number) => void;
	zoomIn: () => void;
	zoomOut: () => void;
	changeSize: (value: { width: number; height: number }) => void;
	changeBackground: (value: string) => void;
	enableDrawingMode: () => void;
	disableDrawingMode: () => void;
	changeFillColor: (value: string) => void;
	changeStrokeColor: (value: string) => void;
	changeStrokeWidth: (value: number) => void;
	changeStrokeDashArray: (value: number[]) => void;
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
	changeImageFilter: (value: string) => void;
	savePng: () => void;
	saveJpg: () => void;
	saveSvg: () => void;
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
	getActiveStrokeColor: () => string;
	getActiveStrokeWidth: () => number;
	getActiveStrokeDashArray: () => number[];
	getActiveScaleX: () => number;
	getActiveScaleY: () => number;
	history: ReturnType<typeof createHistory>;
	canvasEvents: ReturnType<typeof createCanvasEvents>;
}
