export interface Margin {
	margin:number;
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
			margin:10,
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
		certificateTitle:"",
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

function deepClone(obj: any): any {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === 'object') {
        const cloned: any = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
    
    return obj;
}

export const certificate = $state<CertificateState>(deepClone(initialCertificateState));

// Helper functions to manage the store safely
export const certificateActions = {
   
    
	addCustomField: (fieldData: any) => {
    try {
        
        
        // Create deep copy to prevent reactivity issues
        const newField = deepClone(fieldData);
       
        
        // Check if field already exists
        if (certificate.customFields[newField.id]) {
            console.warn('⚠️ Field already exists, overwriting:', newField.id);
        }
        
        // CRITICAL: Force reactivity by creating new object
        const updatedCustomFields = { ...certificate.customFields };
        updatedCustomFields[newField.id] = newField;
        certificate.customFields = updatedCustomFields;
   
        
        // Add to sections with a unique ID to prevent conflicts
        const newSectionId = Math.max(...certificate.sections.map(s => s.id), 0) + 1;
       
        const newSection = {
            id: newSectionId,
            name: newField.name,
            component: 'CustomFieldSection',
            isCustom: true,
            customData: { fieldId: newField.id }
        };
        
        
        
        // CRITICAL: Force reactivity by creating new array
        certificate.sections = [...certificate.sections, newSection];
        
       
        // ADDITIONAL: Trigger manual reactivity check
        certificate.sections = certificate.sections.slice();
        certificate.customFields = { ...certificate.customFields };
        
      
        
    } catch (error) {
        console.error(' Store error adding custom field:', error);
        throw error;
    }
},
   
	
	
	updateCustomField: (fieldId: string, fieldData: any) => {
        try {
            const updatedField = deepClone(fieldData);
            certificate.customFields[fieldId] = updatedField;
            
            // Update section name if changed
            const sectionIndex = certificate.sections.findIndex(section => 
                section.isCustom && section.customData?.fieldId === fieldId
            );
            if (sectionIndex !== -1) {
                certificate.sections[sectionIndex] = {
                    ...certificate.sections[sectionIndex],
                    name: updatedField.name
                };
            }
        } catch (error) {
            console.error('Error updating custom field:', error);
            throw error;
        }
    },
    
    deleteCustomField: (fieldId: string) => {
        try {
            delete certificate.customFields[fieldId];
            certificate.sections = certificate.sections.filter(section => 
                !(section.isCustom && section.customData?.fieldId === fieldId)
            );
        } catch (error) {
            console.error('Error deleting custom field:', error);
            throw error;
        }
    },
    
    reorderSections: (newSections: typeof certificate.sections) => {
        try {
            // Create a deep copy to prevent reactivity issues
            certificate.sections = deepClone(newSections);
        } catch (error) {
            console.error('Error reordering sections:', error);
            throw error;
        }
    }
};
