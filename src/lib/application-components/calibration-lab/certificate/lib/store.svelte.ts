export interface Margin {
	top: number;
	right: number;
	bottom: number;
	left: number;
	linked: boolean;
}

export interface CertificateState {
	page: {
		format: string;
		unit: string;
		width: number;
		height: number;
		margin: Margin;
	};
	pagination: {
		enabled: boolean;
		currentPage: number;
		totalPages: number;
		pageBreaks: number[]; // Array of section IDs that start new pages
	};
	metadata: {
		work: string;
		version: string;
	};
	sections: {
		id: number;
		name: string;
		component: string;
		isCustom?: boolean;
		customData?: any;
	}[];
	customFields: {
		[key: string]: {
			id: string;
			name: string;
			type: 'text' | 'table' | 'image' | 'signature';
			content: any;
			styles: {
				fontSize: number;
				fontWeight: string;
				textAlign: string;
				margin: { top: number; bottom: number; left: number; right: number };
				border: boolean;
				backgroundColor: string;
			};
		};
	};
	data: any; // Define a more specific type for your data later
}

// Define the initial structure of your certificate
const initialCertificateState: CertificateState = {
	page: {
		format: 'A4',
		unit: 'mm',
		width: 210, // A4 width in mm
		height: 297, // A4 height in mm
		margin: {
			top: 20,
			right: 20,
			bottom: 20,
			left: 20,
			linked: true
		}
	},
	pagination: {
		enabled: true,
		currentPage: 1,
		totalPages: 1,
		pageBreaks: [] // Will be calculated dynamically
	},
	metadata: {
		work: 'WN25-77',
		version: 'LC5643UUC97B'
	},
	// Each object is a section on the certificate
	sections: [
		{ id: 1, name: 'Header', component: 'HeaderSection' },
		{ id: 2, name: 'Customer & Instrument Details', component: 'CustomerDetailsSection' },
		{ id: 3, name: 'Calibration Data', component: 'CalibrationDataSection' },
		{ id: 4, name: 'Reference Instrument', component: 'ReferenceInstrumentSection' },
		{ id: 5, name: 'Footer', component: 'FooterSection' }
	],
	customFields: {},
	data: {
		certificateNo: 'UAL/000087/25',
		customer: {
			name: 'Metquay Inc',
			address: ''
		},
		dates: {
			issue: '2025-06-16',
			received: '2025-06-16',
			calibrated: '2025-06-16',
			due: '2026-06-16'
		},
		instrument: {
			type: 'Leak Standard',
			manufacturer: '',
			model: 'CM551.0-7104BVP/2',
			serial: '2001',
			tag: ''
		},
		conditions: {
			location: 'At Lab',
			dataType: 'As Found & As Left',
			humidity: '55 %rh',
			temperature: '20 °C',
			workProcedure: 'LSP 101',
			asFound: '',
			asLeft: ''
		},
		referenceInstruments: [
			{
				id: 1,
				equipment: 'Leak Standard',
				serial: '111962',
				traceability: '...',
				certificate: '...',
				due: '2025-06-30'
			},
			{
				id: 2,
				equipment: 'Leak Standard',
				serial: '191829',
				traceability: '...',
				certificate: '...',
				due: '2025-06-30'
			},
			{
				id: 3,
				equipment: 'Leak Standard',
				serial: 'ETEMP-01',
				traceability: '...',
				certificate: '...',
				due: '2025-06-30'
			},
			{
				id: 4,
				equipment: 'Leak Standard',
				serial: '80824',
				traceability: '...',
				certificate: '...',
				due: '2025-06-30'
			}
		]
	}
};

export const certificate = $state<CertificateState>(initialCertificateState);
