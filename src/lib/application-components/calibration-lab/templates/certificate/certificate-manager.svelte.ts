import type { WorksheetType } from '@/Types';

interface Header {
    height : number;
    unit : 'in' |  'mm' | 'cm' | 'px';
    setAs : 'First Page Header' | 'Last Page Header' | 'Default Header';
    canvasData : any;
}

interface Footer {
    height : number;
    unit : 'in' |  'mm' | 'cm' | 'px';
    setAs : 'First Page Footer' | 'Last Page Footer' | 'Default Footer';
    canvasData : any;
}

interface Content {
    
}

interface CertificateTemplate {
	certificateTemplateId: string;
	certificateTemplateName: string;
	certificateTemplateVersion: string;

	format: 'A4' | 'Custom' | 'A5';
	dimensions: {
		width: number;
		height: number;
		unit: 'in' |  'mm' | 'cm' | 'px';
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
        firstPageHeader : Header
        lastPageHeader : Header
        defaultHeader : Header
    };
	footers: {
        firstPageFooter : Footer
        lastPageFooter : Footer
        defaultFooter : Footer
    }
	contents: Content[];
}

interface CertificateManager {
    getCertificate : () => CertificateTemplate;
}

export function CertificateManager() : CertificateManager {
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
            firstPageHeader : {},
            lastPageHeader : {},
            defaultHeader : {},
        },
		footers: {
            firstPageFooter : {},
            lastPageFooter : {},
            defaultFooter : {}
        },
		contents: []
	});

	return {
        getCertificate() {
            return certificateState
        },
    };
}
