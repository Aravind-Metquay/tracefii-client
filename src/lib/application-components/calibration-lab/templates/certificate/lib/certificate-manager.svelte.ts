import type { WorksheetType } from '@/Types';
import type { WorkType } from '@/Types';

interface FabricBaseObject {
	type: string;
	version: string;
	originX: string;
	originY: string;
	left: number;
	top: number | null;
	width: number;
	height: number;
	fill: string;
	stroke: string | null;
	strokeWidth: number;
	strokeDashArray: number[] | null;
	strokeLineCap: string;
	strokeDashOffset: number;
	strokeLineJoin: string;
	strokeUniform: boolean;
	strokeMiterLimit: number;
	scaleX: number;
	scaleY: number;
	angle: number;
	flipX: boolean;
	flipY: boolean;
	opacity: number;
	shadow: any;
	visible: boolean;
	backgroundColor: string;
	fillRule: string;
	paintFirst: string;
	globalCompositeOperation: string;
	skewX: number;
	skewY: number;
}

interface FabricRectObject extends FabricBaseObject {
	type: 'Rect';
	rx: number;
	ry: number;
}

interface FabricTextboxObject extends FabricBaseObject {
	type: 'Textbox';
	fontSize: number;
	fontWeight: number;
	fontFamily: string;
	fontStyle: string;
	lineHeight: number;
	text: string;
	charSpacing: number;
	textAlign: string;
	styles: any;
	pathStartOffset: number;
	pathSide: string;
	pathAlign: string;
	underline: boolean;
	overline: boolean;
	linethrough: boolean;
	textBackgroundColor: string;
	direction: string;
	textDecorationThickness: number;
	minWidth: number;
	splitByGrapheme: boolean;
}

interface FabricImageObject extends FabricBaseObject {
	type: 'Image';
	cropX: number;
	cropY: number;
	selectable?: boolean;
	hasControls?: boolean;
	src: string;
	crossOrigin: string | null;
	filters: any[];
}

type FabricObject = FabricRectObject | FabricTextboxObject | FabricImageObject;

export interface FabricCanvasData {
	version?: string;
	objects: FabricObject[];
	background?: string;
	clipPath: FabricRectObject;
}

interface Header {
	height: number;
	unit: 'in' | 'mm' | 'cm' | 'px';
	pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader';
	canvasData: FabricCanvasData;
}

interface Footer {
	height: number;
	unit: 'in' | 'mm' | 'cm' | 'px';
	pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter';
	canvasData: FabricCanvasData;
}

interface Content {
	order: number;
	ComponentType:
		| 'Custom Field'
		| 'Reference Instrument'
		| 'Calibration Data'
		| 'Customer and Instrument Details'
		| 'Image';
	calibrationData?: CalibrationData;
	customField?: CustomField;
	referenceInstrument?: ReferenceInstrument;
	customerAndInstrumentDetails?: CustomerAndInstrumentDetails;
}

interface CalibrationData {
	// Pending types [ Empty]
}

enum ReferenceInstrumentColumn {
	EquipmentName = 'equipmentName',
	SerialNumber = 'serialNumber',
	Traceability = 'traceability',
	CertificateNumber = 'certificateNumber',
	CalibrationDueOn = 'calibrationDueOn',
	CompanyName = 'companyName',
	RecommendedDue = 'recommendedDue',
	CompanyEmail = 'companyEmail'
}

export enum CustomerAndInstrumentDetailsColoumn {
	CustomerNameAndAddress = 'Customer name and Address',
	ReceivedDate = 'Received Date',
	CalibratedDate = 'Calibrated Date',
	CalibrationDueOn = 'Calibration Due On',
	Location = 'Location',
	DataType = 'Data Type',
	AsFoundCondition = 'As Found Condition',
	AsLeftCondition = 'As Left Condition',
	Temperature = 'Temperature',
	DateOfIssue = 'Date of Issue',
	InstrumentType = 'Instrument Type',
	InstrumentManufacturer = 'Instrument Manufacturer',
	InstrumentModelNumber = 'Instrument Model Number',
	InstrumentSerialNumber = 'Instrument Serial Number',
	InstrumentTagNumber = 'Instrument Tag Number',
	Humidity = 'Humidity'
}

interface ReferenceInstrument {
	format: 'Table';
	title?: string;
	nextLevelOfmasterInstrument?: boolean;
	columns: Record<
		ReferenceInstrumentColumn,
		{
			isActive: boolean;
			order: number;
		}
	>;
}

interface CustomerAndInstrumentDetails {
	noOfColumns: 1 | 2;
	fields: Record<
		CustomerAndInstrumentDetailsColoumn,
		{
			isActive: boolean;
			columns: 1 | 2;
		}
	>;
}

interface CustomField {
	id: string;
	title: string;
	canvasData: FabricCanvasData;
}

interface CertificateTemplate {
	certificateTemplateId: string;
	certificateTemplateName: string;
	certificateTemplateVersion: string;

	format: 'A4' | 'Custom' | 'A5';
	dimensions: {
		width: number;
		height: number;
		unit: 'in' | 'mm' | 'cm' | 'px';
	};
	margin: {
		top: number;
		right: number;
		bottom: number;
		left: number;
	};

	work: WorkType | null;
	isTemplateBilingual: boolean;

	headers: {
		firstPageHeader: Header;
		lastPageHeader: Header;
		defaultHeader: Header;
	};
	footers: {
		firstPageFooter: Footer;
		lastPageFooter: Footer;
		defaultFooter: Footer;
	};
	contents: Content[];
}

interface CertificateTemplateManager {
	getCertificate: () => CertificateTemplate;
	savePDF: () => void;
	updateWork: (work: WorkType) => void;
	certificate: {
		updateCertificateTemplateName: (name: string) => void;
		updateMargins: (top: number, right: number, bottom: number, left: number) => void;
		updateFormat: (format: 'A4' | 'Custom' | 'A5') => void;
		updateUnit: (unit: 'in' | 'mm' | 'cm' | 'px') => void;
		setDimensions: (width?: number, height?: number) => void;
	};
	header: {
		updateHeaderHeight: (
			height: number,
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader'
		) => void;
		updateUnit: (
			unit: 'in' | 'mm' | 'cm' | 'px',
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader'
		) => void;
		updateCanvasData: (
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader',
			canvasData: FabricCanvasData
		) => void;
	};
	footer: {
		updateFooterHeight: (
			height: number,
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter'
		) => void;
		updateUnit: (
			unit: 'in' | 'mm' | 'cm' | 'px',
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter'
		) => void;
		updateCanvasData: (
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter',
			canvasData: FabricCanvasData
		) => void;
	};
	content: {
		updateOrder: (order1: number, order2: number) => void;
	};
	customField: {
		updateData: (id:string,canvasData: FabricCanvasData) => void;
		updateTitle: (id:string,title: string) => void;
	};
	deleteCustomField: (id: string) => void;
	referenceInstrumentDetails: {
		changeTitle: (title: string) => void;
		toggleActive: (colName: ReferenceInstrumentColumn) => void;
		ToggleMasterInstrument: () => void;
		dndAction: (col1: ReferenceInstrumentColumn, col2: ReferenceInstrumentColumn) => void;
	};
	customerAndInstrumentDetails: {
		updateColumnCount: (columns: 1 | 2) => void;
		toggleField: (fieldName: CustomerAndInstrumentDetailsColoumn) => void;
		updateFieldColumn: (fieldName: CustomerAndInstrumentDetailsColoumn, column: 1 | 2) => void;
		getFieldsByColumn: (column: 1 | 2) => CustomerAndInstrumentDetailsColoumn[];
	};
}

// STATIC JSON HEADER - DONT EDIT THIS
const defaultJsonHeader: FabricCanvasData = {
	version: '6.7.0',
	objects: [
		{
			rx: 0,
			ry: 0,
			type: 'Rect',
			version: '6.7.0',
			originX: 'left',
			originY: 'top',
			left: 99.5,
			top: -100.5,
			width: 793.7008,
			height: 302.3622,
			fill: '#ffffff',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: {
				color: 'rgba(0,0,0,0.1)',
				blur: 10,
				offsetX: 0,
				offsetY: 2,
				affectStroke: false,
				nonScaling: false,
				type: 'shadow'
			},
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 29,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Metquay',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 390,
			top: 45,
			width: 200,
			height: 32.77,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 29,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Metquay',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 390,
			top: 45,
			width: 200,
			height: 32.77,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 20,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: '2nd street,USA\nPh: +183276235628',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 390,
			top: 96.945,
			width: 200,
			height: 48.816,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 20,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: '2nd street,USA\nPh: +183276235628',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 390,
			top: 96.945,
			width: 200,
			height: 48.816,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			cropX: 0,
			cropY: 0,
			type: 'Image',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 186.7126,
			top: 83.2,
			width: 356,
			height: 142,
			fill: 'rgb(0,0,0)',
			stroke: null,
			strokeWidth: 0,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.378,
			scaleY: 0.538,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0,
			src: 'https://tracefii-upload.aravind-dfc.workers.dev/be197c89-07c6-41fb-b9ea-1e9f12dc1ef1.png-demo',
			crossOrigin: 'anonymous',
			filters: []
		},
		{
			cropX: 0,
			cropY: 0,
			type: 'Image',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 186.7126,
			top: 83.2,
			width: 356,
			height: 142,
			fill: 'rgb(0,0,0)',
			stroke: null,
			strokeWidth: 0,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.378,
			scaleY: 0.538,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0,
			src: 'https://tracefii-upload.aravind-dfc.workers.dev/be197c89-07c6-41fb-b9ea-1e9f12dc1ef1.png-demo',
			crossOrigin: 'anonymous',
			filters: []
		},
		{
			cropX: 0,
			cropY: 0,
			type: 'Image',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 670.25,
			top: 81.615,
			width: 246,
			height: 205,
			fill: 'rgb(0,0,0)',
			stroke: null,
			strokeWidth: 0,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6646,
			scaleY: 0.7659,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0,
			src: 'https://tracefii-upload.aravind-dfc.workers.dev/c14e25f9-6101-4d1b-bd12-c2e7d8e3e80c.png-demo',
			crossOrigin: 'anonymous',
			filters: []
		},
		{
			cropX: 0,
			cropY: 0,
			type: 'Image',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 670.25,
			top: 81.615,
			width: 246,
			height: 205,
			fill: 'rgb(0,0,0)',
			stroke: null,
			strokeWidth: 0,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6646,
			scaleY: 0.7659,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0,
			src: 'https://tracefii-upload.aravind-dfc.workers.dev/c14e25f9-6101-4d1b-bd12-c2e7d8e3e80c.png-demo',
			crossOrigin: 'anonymous',
			filters: []
		},
		{
			fontSize: 25,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Certificate of Calibration',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 468.6752,
			top: 160.1811,
			width: 327.6496,
			height: 28.25,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 25,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Certificate of Calibration',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 468.6752,
			top: 160.1811,
			width: 327.6496,
			height: 28.25,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 15,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Certificate No: 1U09/938736',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 720,
			top: 194.7811,
			width: 200,
			height: 16.95,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 15,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Certificate No: 1U09/938736',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 720,
			top: 194.7811,
			width: 200,
			height: 16.95,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		}
	],
	background: '#f8fafc',
	clipPath: {
		rx: 0,
		ry: 0,
		type: 'Rect',
		version: '6.7.0',
		originX: 'left',
		originY: 'top',
		left: 99.5,
		top: -100.5,
		width: 793.7008,
		height: 302.3622,
		fill: '#ffffff',
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: 'butt',
		strokeDashOffset: 0,
		strokeLineJoin: 'miter',
		strokeUniform: false,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: {
			color: 'rgba(0,0,0,0.1)',
			blur: 10,
			offsetX: 0,
			offsetY: 2,
			affectStroke: false,
			nonScaling: false,
			type: 'shadow'
		},
		visible: true,
		backgroundColor: '',
		fillRule: 'nonzero',
		paintFirst: 'fill',
		globalCompositeOperation: 'source-over',
		skewX: 0,
		skewY: 0
	}
};

// STATIC JSON FOOTER - DONT EDIT THIS
const defaultJsonFooter: FabricCanvasData = {
	objects: [
		{
			rx: 0,
			ry: 0,
			type: 'Rect',
			version: '6.7.0',
			originX: 'left',
			originY: 'top',
			left: 99.5,
			top: -100.5,
			width: 1360.6299,
			height: 491.3386,
			fill: '#ffffff',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: {
				color: 'rgba(0,0,0,0.1)',
				blur: 10,
				offsetX: 0,
				offsetY: 2,
				affectStroke: false,
				nonScaling: false,
				type: 'shadow'
			},
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Calibration Technician :  ____________________ Quality Control :   ____________________',
			charSpacing: 0,
			textAlign: 'left',
			styles: [
				{
					start: 67,
					end: 87,
					style: {
						fontSize: 24,
						fontWeight: 400,
						fontFamily: 'Times New Roman',
						fontStyle: 'normal',
						underline: false,
						overline: false,
						linethrough: false,
						stroke: null,
						strokeWidth: 1,
						fill: '#000000',
						deltaY: 0,
						textBackgroundColor: '',
						textDecorationThickness: 66.667
					}
				}
			],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 446.75,
			top: 86.6478,
			width: 920.6106,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7406,
			scaleY: 0.7406,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Calibration Technician :  ____________________ Quality Control :   ____________________',
			charSpacing: 0,
			textAlign: 'left',
			styles: [
				{
					start: 67,
					end: 87,
					style: {
						fontSize: 24,
						fontWeight: 400,
						fontFamily: 'Times New Roman',
						fontStyle: 'normal',
						underline: false,
						overline: false,
						linethrough: false,
						stroke: null,
						strokeWidth: 1,
						fill: '#000000',
						deltaY: 0,
						textBackgroundColor: '',
						textDecorationThickness: 66.667
					}
				}
			],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 446.75,
			top: 86.6478,
			width: 920.6106,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7406,
			scaleY: 0.7406,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'LQS-7-109 revD1 LCO-1562 Effective 10/20/22',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 256.4796,
			top: 319.2413,
			width: 498.5,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6045,
			scaleY: 0.6045,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'LQS-7-109 revD1 LCO-1562 Effective 10/20/22',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 256.4796,
			top: 319.2413,
			width: 498.5,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6045,
			scaleY: 0.6045,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'This document shall not be reproduced except in full without written approval from Laco Technologies',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 461.8364,
			top: 239.6174,
			width: 1027.3703,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6337,
			scaleY: 0.6337,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'This document shall not be reproduced except in full without written approval from Laco Technologies',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 461.8364,
			top: 239.6174,
			width: 1027.3703,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6337,
			scaleY: 0.6337,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'The calibration data reported above applies only to the item referenced in this certificate',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 504.75,
			top: 208.3553,
			width: 1024.9628,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6496,
			scaleY: 0.6496,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'The calibration data reported above applies only to the item referenced in this certificate',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 504.75,
			top: 208.3553,
			width: 1024.9628,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6496,
			scaleY: 0.6496,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Name ',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 357.9733,
			top: 125.2622,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7347,
			scaleY: 0.7347,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Name ',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 357.9733,
			top: 125.2622,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7347,
			scaleY: 0.7347,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Name',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 679.3045,
			top: 124.9245,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7107,
			scaleY: 0.7107,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Name',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 679.3045,
			top: 124.9245,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.7107,
			scaleY: 0.7107,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'lacotech.com',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 729.5528,
			top: 377.3193,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6693,
			scaleY: 0.6693,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'lacotech.com',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 729.5528,
			top: 377.3193,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.6693,
			scaleY: 0.6693,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'info@lacotech.com',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 558.7222,
			top: 377.4286,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.677,
			scaleY: 0.677,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'info@lacotech.com',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 558.7222,
			top: 377.4286,
			width: 200,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 0.677,
			scaleY: 0.677,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		}
	],
	background: '#f8fafc',
	clipPath: {
		rx: 0,
		ry: 0,
		type: 'Rect',
		version: '6.7.0',
		originX: 'left',
		originY: 'top',
		left: 99.5,
		top: -100.5,
		width: 1360.6299,
		height: 491.3386,
		fill: '#ffffff',
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: 'butt',
		strokeDashOffset: 0,
		strokeLineJoin: 'miter',
		strokeUniform: false,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: {
			color: 'rgba(0,0,0,0.1)',
			blur: 10,
			offsetX: 0,
			offsetY: 2,
			affectStroke: false,
			nonScaling: false,
			type: 'shadow'
		},
		visible: true,
		backgroundColor: '',
		fillRule: 'nonzero',
		paintFirst: 'fill',
		globalCompositeOperation: 'source-over',
		skewX: 0,
		skewY: 0
	}
};

// STATIC JSON CUSTOM FIELD - DONT EDIT THIS
const jsonCustomField: FabricCanvasData = {
	version: '6.7.0',
	objects: [
		{
			rx: 0,
			ry: 0,
			type: 'Rect',
			version: '6.7.0',
			originX: 'left',
			originY: 'top',
			left: 99.5,
			top: -100.5,
			width: 755.9055,
			height: 340.1575,
			fill: '#ffffff',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: {
				color: 'rgba(0,0,0,0.1)',
				blur: 10,
				offsetX: 0,
				offsetY: 2,
				affectStroke: false,
				nonScaling: false,
				type: 'shadow'
			},
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 18,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'This document ensures that all project requirements are clearly mapped to their corresponding design elements, implementation components, and test cases. It provides a clear linkage between each phase of the development lifecycle, allowing for validation, impact analysis, and verification that every requirement has been addressed and tested appropriately.',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 452.7264,
			top: 132.7726,
			width: 569.5472,
			height: 114.7176,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 0.8512,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 18,
			fontWeight: 400,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'This document ensures that all project requirements are clearly mapped to their corresponding design elements, implementation components, and test cases. It provides a clear linkage between each phase of the development lifecycle, allowing for validation, impact analysis, and verification that every requirement has been addressed and tested appropriately.',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 452.7264,
			top: 132.7726,
			width: 569.5472,
			height: 114.7176,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 0.8512,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Traceability Statement',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 327.7264,
			top: 57.0787,
			width: 321.5472,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		},
		{
			fontSize: 24,
			fontWeight: 700,
			fontFamily: 'Times New Roman',
			fontStyle: 'normal',
			lineHeight: 1.16,
			text: 'Traceability Statement',
			charSpacing: 0,
			textAlign: 'left',
			styles: [],
			pathStartOffset: 0,
			pathSide: 'left',
			pathAlign: 'baseline',
			underline: false,
			overline: false,
			linethrough: false,
			textBackgroundColor: '',
			direction: 'ltr',
			textDecorationThickness: 66.667,
			minWidth: 20,
			splitByGrapheme: false,
			type: 'Textbox',
			version: '6.7.0',
			originX: 'center',
			originY: 'center',
			left: 327.7264,
			top: 57.0787,
			width: 321.5472,
			height: 27.12,
			fill: '#000000',
			stroke: null,
			strokeWidth: 1,
			strokeDashArray: null,
			strokeLineCap: 'butt',
			strokeDashOffset: 0,
			strokeLineJoin: 'miter',
			strokeUniform: false,
			strokeMiterLimit: 4,
			scaleX: 1,
			scaleY: 1,
			angle: 0,
			flipX: false,
			flipY: false,
			opacity: 1,
			shadow: null,
			visible: true,
			backgroundColor: '',
			fillRule: 'nonzero',
			paintFirst: 'fill',
			globalCompositeOperation: 'source-over',
			skewX: 0,
			skewY: 0
		}
	],
	background: '#f8fafc',
	clipPath: {
		rx: 0,
		ry: 0,
		type: 'Rect',
		version: '6.7.0',
		originX: 'left',
		originY: 'top',
		left: 99.5,
		top: -100.5,
		width: 755.9055,
		height: 340.1575,
		fill: '#ffffff',
		stroke: null,
		strokeWidth: 1,
		strokeDashArray: null,
		strokeLineCap: 'butt',
		strokeDashOffset: 0,
		strokeLineJoin: 'miter',
		strokeUniform: false,
		strokeMiterLimit: 4,
		scaleX: 1,
		scaleY: 1,
		angle: 0,
		flipX: false,
		flipY: false,
		opacity: 1,
		shadow: {
			color: 'rgba(0,0,0,0.1)',
			blur: 10,
			offsetX: 0,
			offsetY: 2,
			affectStroke: false,
			nonScaling: false,
			type: 'shadow'
		},
		visible: true,
		backgroundColor: '',
		fillRule: 'nonzero',
		paintFirst: 'fill',
		globalCompositeOperation: 'source-over',
		skewX: 0,
		skewY: 0
	}
};

export function CertificateManager(): CertificateTemplateManager {
	let certificateState = $state<CertificateTemplate>({
		certificateTemplateId: '',
		certificateTemplateName: '',
		certificateTemplateVersion: '',

		format: 'A4',
		dimensions: {
			width: 21,
			height: 29.7,
			unit: 'cm'
		},
		margin: {
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		},
		work: null,
		isTemplateBilingual: false,

		headers: {
			// FIRST AND LAST PAGE HEADER NEEDS TO BE IMPLEMENTED AND ADDED HERE
			firstPageHeader: {
				// NEEDS ATTENTION
				height: 0,
				unit: 'cm',
				pageType: 'firstPageHeader',
				canvasData: { objects: [], background: '#ffffff', clipPath: {} as FabricRectObject }
			},
			lastPageHeader: {
				// NEEDS ATTENTION
				height: 0,
				unit: 'cm',
				pageType: 'lastPageHeader',
				canvasData: { objects: [], background: '#ffffff', clipPath: {} as FabricRectObject }
			},
			defaultHeader: {
				height: 8,
				unit: 'cm',
				pageType: 'defaultHeader',
				canvasData: defaultJsonHeader
			}
		},
		footers: {
			// FIRST AND LAST PAGE FOOTER NEEDS TO BE IMPLEMENTED AND ADDED HERE
			firstPageFooter: {
				// NEEDS ATTENTION
				height: 0,
				unit: 'cm',
				pageType: 'firstPageFooter',
				canvasData: { objects: [], background: '#ffffff', clipPath: {} as FabricRectObject }
			},
			lastPageFooter: {
				// NEEDS ATTENTION
				height: 0,
				unit: 'cm',
				pageType: 'lastPageFooter',
				canvasData: { objects: [], background: '#ffffff', clipPath: {} as FabricRectObject }
			},
			defaultFooter: {
				height: 8,
				unit: 'cm',
				pageType: 'defaultFooter',
				canvasData: defaultJsonFooter
			}
		},
		contents: [
			{
				order: 2,
				ComponentType: 'Customer and Instrument Details',
				customerAndInstrumentDetails: {
					noOfColumns: 2,
					fields: {
						[CustomerAndInstrumentDetailsColoumn.CustomerNameAndAddress]: {
							isActive: true,
							columns: 1
						},
						[CustomerAndInstrumentDetailsColoumn.ReceivedDate]: { isActive: true, columns: 2 },
						[CustomerAndInstrumentDetailsColoumn.CalibratedDate]: { isActive: true, columns: 1 },
						[CustomerAndInstrumentDetailsColoumn.CalibrationDueOn]: { isActive: true, columns: 2 },
						[CustomerAndInstrumentDetailsColoumn.Location]: { isActive: true, columns: 1 },
						[CustomerAndInstrumentDetailsColoumn.DataType]: { isActive: true, columns: 2 },
						[CustomerAndInstrumentDetailsColoumn.AsFoundCondition]: { isActive: true, columns: 1 },
						[CustomerAndInstrumentDetailsColoumn.AsLeftCondition]: { isActive: true, columns: 2 },
						[CustomerAndInstrumentDetailsColoumn.Temperature]: { isActive: true, columns: 1 },
						[CustomerAndInstrumentDetailsColoumn.DateOfIssue]: { isActive: false, columns: 2 },
						[CustomerAndInstrumentDetailsColoumn.InstrumentType]: { isActive: false, columns: 1 },
						[CustomerAndInstrumentDetailsColoumn.InstrumentManufacturer]: {
							isActive: false,
							columns: 2
						},
						[CustomerAndInstrumentDetailsColoumn.InstrumentModelNumber]: {
							isActive: false,
							columns: 1
						},
						[CustomerAndInstrumentDetailsColoumn.InstrumentSerialNumber]: {
							isActive: false,
							columns: 2
						},
						[CustomerAndInstrumentDetailsColoumn.InstrumentTagNumber]: {
							isActive: false,
							columns: 1
						},
						[CustomerAndInstrumentDetailsColoumn.Humidity]: { isActive: false, columns: 2 }
					}
				}
			},
			{
				order: 3,
				ComponentType: 'Reference Instrument',
				referenceInstrument: {
					format: 'Table',
					title: 'Reference Equipment(s) used',
					nextLevelOfmasterInstrument: true,
					columns: {
						[ReferenceInstrumentColumn.EquipmentName]: { isActive: true, order: 1 },
						[ReferenceInstrumentColumn.SerialNumber]: { isActive: true, order: 2 },
						[ReferenceInstrumentColumn.Traceability]: { isActive: true, order: 3 },
						[ReferenceInstrumentColumn.CertificateNumber]: { isActive: true, order: 4 },
						[ReferenceInstrumentColumn.CalibrationDueOn]: { isActive: true, order: 5 },
						[ReferenceInstrumentColumn.CompanyName]: { isActive: false, order: 6 },
						[ReferenceInstrumentColumn.RecommendedDue]: { isActive: false, order: 7 },
						[ReferenceInstrumentColumn.CompanyEmail]: { isActive: false, order: 8 }
					}
				}
			},
			{
				order: 4,
				ComponentType: 'Custom Field',
				customField: {
					id: 'custom',
					title: 'Custom Field',
					canvasData: jsonCustomField
				}
			}
		]
	});

	const customerAndInstrumentDetails = (() => {
		const getContent = () =>
			certificateState.contents.find((c) => c.ComponentType === 'Customer and Instrument Details');

		return {
			// Change number of columns
			updateColumnCount: (columns: 1 | 2) => {
				const content = getContent();
				if (content?.customerAndInstrumentDetails) {
					content.customerAndInstrumentDetails.noOfColumns = columns;
				}
			},

			// Toggle Active / Inactive
			toggleField: (fieldName: CustomerAndInstrumentDetailsColoumn) => {
				const content = getContent();
				if (content?.customerAndInstrumentDetails?.fields[fieldName]) {
					content.customerAndInstrumentDetails.fields[fieldName].isActive =
						!content.customerAndInstrumentDetails.fields[fieldName].isActive;
				}
			},

			// Change column placement for a field
			updateFieldColumn: (fieldName: CustomerAndInstrumentDetailsColoumn, column: 1 | 2) => {
				const content = getContent();
				if (content?.customerAndInstrumentDetails?.fields[fieldName]) {
					content.customerAndInstrumentDetails.fields[fieldName].columns = column;
				}
			},

			// Get fields by column (only active ones)
			getFieldsByColumn: (column: 1 | 2) => {
				const content = getContent();
				if (!content?.customerAndInstrumentDetails) return [];
				return Object.entries(content.customerAndInstrumentDetails.fields)
					.filter(([_, field]) => field.isActive && field.columns === column)
					.map(([fieldName]) => fieldName as CustomerAndInstrumentDetailsColoumn);
			}
		};
	})();

	const referenceInstrumentDetails = (() => {
		const getRefIndex = () =>
			certificateState.contents.findIndex(
				(c) => c.ComponentType === 'Reference Instrument' && c.referenceInstrument
			);

		return {
			changeTitle: (title: string) => {
				const refIndex = getRefIndex();
				if (certificateState.contents[refIndex]?.referenceInstrument) {
					certificateState.contents[refIndex].referenceInstrument.title = title;
				}
			},

			ToggleMasterInstrument: () => {
				const refIndex = getRefIndex();
				if (certificateState.contents[refIndex]?.referenceInstrument) {
					certificateState.contents[refIndex].referenceInstrument.nextLevelOfmasterInstrument =
						!certificateState.contents[refIndex].referenceInstrument.nextLevelOfmasterInstrument;
				}
			},

			toggleActive: (colName: ReferenceInstrumentColumn) => {
				const refIndex = getRefIndex();
				if (certificateState.contents[refIndex]?.referenceInstrument) {
					certificateState.contents[refIndex].referenceInstrument.columns[colName].isActive =
						!certificateState.contents[refIndex].referenceInstrument.columns[colName].isActive;
				}
			},

			dndAction: (col1: ReferenceInstrumentColumn, col2: ReferenceInstrumentColumn) => {
				const refIndex = getRefIndex();
				if (
					certificateState.contents[refIndex]?.referenceInstrument?.columns[col1] &&
					certificateState.contents[refIndex]?.referenceInstrument?.columns[col2]
				) {
					const order = certificateState.contents[refIndex].referenceInstrument.columns[col1].order;
					certificateState.contents[refIndex].referenceInstrument.columns[col1].order =
						certificateState.contents[refIndex].referenceInstrument.columns[col2].order;
					certificateState.contents[refIndex].referenceInstrument.columns[col2].order = order;
				}
			}
		};
	})();

	const customField = {
		updateData: (id: string, canvasData: FabricCanvasData) => {
			const refIndex = certificateState.contents.findIndex(
				(c) => c.ComponentType === 'Custom Field' && c.customField?.id === id
			);
			if (refIndex !== -1 && certificateState.contents[refIndex].customField) {
				certificateState.contents[refIndex].customField.canvasData = canvasData;
			}
		},

		updateTitle: (id: string, title: string) => {
			const refIndex = certificateState.contents.findIndex(
				(c) => c.ComponentType === 'Custom Field' && c.customField?.id === id
			);
			if (refIndex !== -1 && certificateState.contents[refIndex].customField) {
				certificateState.contents[refIndex].customField.title = title;
			}
		}
	};

	const header = {
		updateHeaderHeight: (
			height: number,
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader'
		) => {
			certificateState.headers[pageType].height = height;
		},
		updateUnit: (
			unit: 'in' | 'mm' | 'cm' | 'px',
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader'
		) => {
			certificateState.headers[pageType].unit = unit;
		},
		updateCanvasData: (
			pageType: 'firstPageHeader' | 'lastPageHeader' | 'defaultHeader',
			canvasData: FabricCanvasData
		) => {
			certificateState.headers[pageType].canvasData = canvasData;
		}
	};

	const footer = {
		updateFooterHeight: (
			height: number,
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter'
		) => {
			certificateState.footers[pageType].height = height;
		},
		updateUnit: (
			unit: 'in' | 'mm' | 'cm' | 'px',
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter'
		) => {
			certificateState.footers[pageType].unit = unit;
		},
		updateCanvasData: (
			pageType: 'firstPageFooter' | 'lastPageFooter' | 'defaultFooter',
			canvasData: FabricCanvasData
		) => {
			certificateState.footers[pageType].canvasData = canvasData;
		}
	};

	const content = {
		updateOrder: (order1: number, order2: number) => {
			if (
				order1 > 1 &&
				order1 < certificateState.contents.length &&
				order2 > 1 &&
				order2 < certificateState.contents.length &&
				order1 !== order2
			) {
				[certificateState.contents[order1], certificateState.contents[order2]] = [
					certificateState.contents[order2],
					certificateState.contents[order1]
				];
			}
		}
	};

	const deleteCustomField = (id: string) => {
		const refIndex = certificateState.contents.findIndex(
			(c) => c.ComponentType === 'Custom Field' && c.customField && c.customField.id === id
		);
		certificateState.contents.splice(refIndex, 1);
	};

	const certificate = {
		updateCertificateTemplateName: (name: string) => {
			certificateState.certificateTemplateName = name;
		},

		// const certificateTemplateName = () =>{}   Pending
		updateMargins: (top: number, right: number, bottom: number, left: number) => {
			certificateState.margin = { top, right, bottom, left };
		},
		updateFormat: (format: 'A4' | 'Custom' | 'A5') => {
			certificateState.format = format;
			// Set default dimensions based on format
			if (format === 'A4') {
				certificateState.dimensions = {
					width: 21,
					height: 29.7,
					unit: 'cm'
				};
			} else if (format === 'A5') {
				certificateState.dimensions = {
					width: 14.8,
					height: 21,
					unit: 'cm'
				};
			}
		},
		updateUnit: (unit: 'in' | 'mm' | 'cm' | 'px') => {
			const currentWidth = certificateState.dimensions.width;
			const currentHeight = certificateState.dimensions.height;
			const currentUnit = certificateState.dimensions.unit;
			let newWidth = currentWidth;
			let newHeight = currentHeight;
			// Conversion factors to mm (base unit)
			const toMm = {
				mm: 1,
				cm: 10,
				in: 25.4,
				px: 0.264583 // assuming 96 DPI
			};
			const fromMm = {
				mm: 1,
				cm: 0.1,
				in: 0.0393701,
				px: 3.77953 // assuming 96 DPI
			};
			// Convert current dimensions to mm, then to new unit
			const widthInMm = currentWidth * toMm[currentUnit];
			const heightInMm = currentHeight * toMm[currentUnit];
			newWidth = Math.round(widthInMm * fromMm[unit] * 100) / 100;
			newHeight = Math.round(heightInMm * fromMm[unit] * 100) / 100;
			certificateState.dimensions = {
				width: newWidth,
				height: newHeight,
				unit: unit
			};
		},
		setDimensions: (width?: number, height?: number) => {
			if (width !== undefined) {
				certificateState.dimensions.width = width;
			}
			if (height !== undefined) {
				certificateState.dimensions.height = height;
			}
			if (width !== undefined || height !== undefined) {
				certificateState.format = 'Custom';
			}
		}
	};

    const updateWork=(work:WorkType)=>{
      certificateState.work=work;
    }

	return {
		getCertificate() {
			return certificateState;
		},
		savePDF() {},
		updateWork,
		certificate,
		header,
		footer,
		content,
		customField,
		deleteCustomField,
		referenceInstrumentDetails,
		customerAndInstrumentDetails
	};
}
