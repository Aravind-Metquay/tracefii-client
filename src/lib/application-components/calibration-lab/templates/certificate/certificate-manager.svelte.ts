import type { WorksheetType } from '@/Types';
import * as fabric from 'fabric';
import type { WorkType } from '@/Types';

interface Header {
	height: number;
	unit: 'in' | 'mm' | 'cm' | 'px';
	pageType: 'First Page Header' | 'Last Page Header' | 'Default Header';
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
enum CustomerAndInstrumentDetailsColoumn {
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
		contents: [
			{
				order: 2, // Fixed typo: "orde,r" -> "order"
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
			}
		]
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
