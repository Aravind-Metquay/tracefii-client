import type { WorksheetType } from '@/Types';
import * as fabric from 'fabric';
import type { WorkType } from '@/Types';

interface Header {
	height: number;
	unit: 'in' | 'mm' | 'cm' | 'px';
	setAs: 'First Page Header' | 'Last Page Header' | 'Default Header';
	canvasData: fabric.Canvas;
}

interface Footer {
	height: number;
	unit: 'in' | 'mm' | 'cm' | 'px';
	setAs: 'First Page Footer' | 'Last Page Footer' | 'Default Footer';
	canvasData: fabric.Canvas;
}

interface Content {
	order: number;
	ComponentType:
		| 'Custom Field'
		| 'Reference Instrument'
		| 'Calibration Data'
		| 'Customer and Instrument Details';
	CalibrationData?: CalibrationData;
	CustomField?: CustomField;
	ReferenceInstrument?: ReferenceInstrument;
	CustomerAndInstrumentDetails?: CustomerAndInstrumentDetails;
}
interface CalibrationData {
	// Pending types [ Empty]
}
interface ReferenceInstrument {
	format: 'Table';
	title?: string;
	masterInstrument?: boolean;
	columns: Record<
		string, // needs to change to enum later - reference instruments
		{
			isActive: boolean;
			order: number;
		}
	>; // Might want to convert into array, check for enum
}
interface CustomerAndInstrumentDetails {
	noOfColumns: 1 | 2;
	fields: Record<
		string, //  needs to change to enum based on customer and instrument details
		{
			isActive: boolean;
			columns: 1 | 2;
		}
	>;
}
interface CustomField {
	id: string;
	title: string;
	canvasData: fabric.Canvas;
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

	worksheet: WorksheetType | null;
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
	updateFormat: (format?: 'A4' | 'Custom' | 'A5') => void;
	updateUnit: (unit?: 'mm' | 'cm' | 'in' | 'px') => void;
	setDimensions: (width?: number, height?: number) => void;
	setMargins: (top: number, right: number, bottom: number, left: number) => void;
	updateWork: (work: WorkType) => void;
	updateHeaderHeight: (value?: number) => void;
	updateFooterHeight: (value?: number) => void;
	updateCertificateTemplateName: () => void;
	updateHeader: () => void;
	updateFooter: () => void;
	updateContent: () => void;
	updateCustomField?: () => void;
	updateReferenceInstrumentTitle?: () => void;
	updateCustomerAndInstrumentDetails?: () => void;
}

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
		worksheet: null,
		isTemplateBilingual: false,

		headers: {
			firstPageHeader: {},
			lastPageHeader: {},
			defaultHeader: {}
		},
		footers: {
			firstPageFooter: {},
			lastPageFooter: {},
			defaultFooter: {}
		},
		contents: []
	});

	const updateCustomerAndInstrumentDetails = (title?: string, columValue?: number) => {
		const changeTitle = () => {};

		const changeColumn = () => {};
		return {
			changeTitle,
			changeColumn
		};
	};

	const updateReferenceInstrumentTitle = (title?: string, columValue?: number) => {
		const changeTitle = () => {};

		const changeColumn = () => {};
		return {
			changeTitle,
			changeColumn
		};
	};

	return {
		getCertificate() {
			return certificateState;
		},
		updateReferenceInstrumentTitle
	};
}
