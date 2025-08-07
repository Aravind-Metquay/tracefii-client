export interface SidebarItem {
	name: string;
	url: string;
	icon: any;
}

export interface ApiResponse<T> {
	data: T;
	message?: string;
	status: number;
}

export interface LineItemForRFQType {
	id?: number;
	assetId: string | number | null;
	description: string | null;
	quantity: number;
	tentativeStartDate: string;
	tentativeEndDate: string;
	isConverted: boolean;
	requirements: SpecificationType[];
	comments: CommentType[];
}

export interface RequestForEstimateType {
	id?: number;
	customerName: string;
	customerCode: string;
	requestNo: string;
	requestDate: string;
	attachments: any[];
	tentativeStartDate: string;
	tentativeEndDate: string;
	lineItems: LineItemForRFQType[];
	comments: CommentType[];
	status: string;
	requestType: string;
	salesPerson: string | null;
	quantity: number;
	createdBy: string | null;
	createdOn: string;
	modifiedBy: string | null;
	modifiedOn: string;
	requestForEstimatePdfUrl: string | null;
}

export interface SpecificationType {
	id?: number;
	requirement: string;
	createdBy: string;
	createdOn: string;
}

export interface CommentType {
	id?: string;
	comment: string;
	commentFrom: 'Sales Person' | 'Customer';
	createdBy: string;
	createdOn: string;
}

export interface LineItemForEstimateType {
	id: number;
	assetId: number | null;
	description: string;
	quantity: number;
	rate: number;
	amount: number;
	isAccepted: boolean | null;
	requirements: SpecificationType[];
	comments: CommentType[];
}

export interface EstimateType {
	id: number;
	customerName: string;
	customerCode: string;
	estimateNo: string;
	estimateDate: string;
	attachments: any[];
	lineItems: LineItemForEstimateType[];
	comments: CommentType[];
	status: string;
	salesPerson: string | null;
	estimatePdfUrl: string | null;
	amount: number;
	revisionDate: string | null;
	revisionNo: number;
	revisions: any[];
	createdBy: string;
	createdOn: string;
	modifiedBy: string;
	modifiedOn: string;
}
interface MetquayUserData {
	name?: string | null;
	code?: string | null;
	parentCompany?: string;
	active?: boolean;
	activateAlerts?: boolean;
	phone?: string | null;
	fax?: string | null;
	email?: string | null;
	website?: string | null;
	addressLine1?: string | null;
	addressLine2?: string | null;
	city?: string | null;
	state?: string | null;
	zip?: string | null;
	country?: string | null;
	tracefiiUID?: string | null;
	serviceProviderName?: string | null;
	serviceProviderShortName?: string | null;
}

interface TestAuth0 {
	user_id: string;
	email_verified: boolean;
	email: string;
	name: string;
	picture: string;
}

export interface ServiceProviderDetails {
	isOfflineEnabled?: boolean;
	offlineDeviceIp?: string;
}

export interface AssetOwnerDetails {
	role: 'Admin' | 'Viewer' | 'Editor' | 'Owner';
}

export interface MetquayIntegratedAssetOwnerDetails extends MetquayUserData {
	metquayToken: string;
	isMetquayIntegrated: boolean;
}
export type MetquayIntergratedServiceProviderRoleType = 'Admin' | 'Lab Manager' | 'Technician';
export interface UserType {
	_id: string;
	orgId: string;
	firstName: string; //First Name of the user
	lastName?: string; //Last name of the user
	emailId: string; //Email Id of the user
	system_role:
		| 'Admin'
		| 'Asset Owner'
		| 'Service Provider'
		| 'Metquay Integrated Asset Owner'
		| 'Metquay Integrated Service Provider';
	contactNumber?: string; //Phone number of the user
	serviceProviderDetails?: ServiceProviderDetails; //Service Provider Details
	assetOwnerDetails?: AssetOwnerDetails; //Asset Owner Details
	metquayIntegratedAssetOwnerDetails?: MetquayIntegratedAssetOwnerDetails; //Metquay Integrated Asset Owner Details
	metquayIntegratedServiceProviderDetails?: {
		tracefiiUID?: string;
		instanceURL?: string;
		inviteStatus: 'Invitation Pending' | 'Invitation Accepted' | 'Not Invited';
		role: MetquayIntergratedServiceProviderRoleType;
	};
	auth0?: TestAuth0; //Auth0 Details
	attachments?: string[];
	createdAt: Date; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user
	workspaceRoles?: { workspace: string; role: string }[];
	lastSelectedWorkspace?: string;
}
export interface FileWithContent {
	file: {
		name: string;
		size: number;
		type: string;
		lastModified: number;
		key: string;
	};
	content: string | ArrayBuffer | null;
}
export interface AddressType {
	streetAddress: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	addressType: 'PRIMARY' | 'SHIPPING' | 'BILLING' | 'CERTIFICATE';
}
export interface FormData {
	customerName: string;
	customerEmail: string;
	contactPersonNumber: string;
	website: string;
	parentCompany: string;
	contactPersonName: string;
	displayName: string;
	customerSpecificRequirement: string;
	additionalDetails: string;
	customerCurrency: string;
}

export interface FormErrors {
	customerName?: string;
	customerEmail?: string;
}
export interface CustomerType {
	_id: string;
	orgId: string;
	customerName: string; //Name of the customer
	customerEmail: string; //Email of the customer
	displayName?: string; //Name to be displayed on the labels and certificates
	contactPersonNumber?: string; //Contact number of the customers
	additionalDetails?: string; //Additional Details of the customer
	customerSpecificRequirement?: string; //The specific requirements of the customer
	primaryAddress?: string;
	parentCompany?: string;
	childCompanies?: string;
	contactPersonName?: string;
	customerCurrency?: string;
	website: string;
	attachments?: {
		name: string;
		size: number;
		type: string;
		lastModified: number;
		key: string;
	}[];
	addresses?: AddressType[];
	createdAt: string; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: string; //Modified Date
	modifiedBy?: string; //Modified by which user
	availableWorkspaces: string[];
	createdWorkspace: string;
}

export interface RoleType {
	_id: string;
	orgId: string;
	roleName: string; //The name of the role
	roleDescription?: string; // The description of the role
	availableWorkspaces: string[]; //The available workspaces of the role.
	permissions: string[];
	createdAt: Date; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user
}

export interface OrganizationType {
	_id: string;
	organizationName: string;
	organizationDescription?: string;
	organizationType:
		| 'Native'
		| 'Metquay Integrated Service Provider'
		| 'Metquay Integrated Asset Owner';
	emailId?: string;
	createdBy: string;
	createdAt: Date;
	modifiedAt?: Date;
	modifiedBy?: string;
}
export interface WorkspaceType {
	_id: string;
	orgId: string; //The organization Id
	workspaceName: string; //Name of the workspace
	workspaceCode: string; //The <4 letter code for the workspace
	createdAt: Date; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user
}

export interface UserWorkspaceRoleType {
	_id: string;
	orgId: string;
	workspaceId: string;
	roleId: string;
	userId: string;
	emailId: string;
	workspace?: WorkspaceType;
	role?: RoleType;
	createdBy: string;
	createdAt: Date;
	modifiedBy?: string;
	modifiedAt?: Date;
}

export interface ItemType {
	_id: string;
	orgId: string;
	createdAt: Date; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user
	createdWorkspace: string;

	itemNo: string;
	itemName: string;
	itemType: 'Product' | 'Service';
	isItemActive: string;
	remarks?: string;
	class?: string;

	isItemSoldToCustomer: boolean;
	itemSellDetails?: {
		description?: string;
		salesPricePerRate?: number;
		isTaxable?: boolean;
		markupPercentage?: number;
		roundingPrecision?: number;
		incomeAccount?: string;
	};

	isItemBoughtFromVendor: boolean;
	itemBuyDetails?: {
		description?: string;
		cost?: number;
		expenseAccount?: string;
		preferredVendor?: string;
	};

	isItemTrackedOnInventory: boolean;
	inventoryDetails?: {
		inventoryAssetAccount?: string;
		initialQty?: number;
		qtyOnHand?: number;
		availableQty?: number;
		onOrder?: number;
		commited?: number;
	};
}

export interface AssetType {
	_id: string;
	orgId: string;
	createdAt: Date | string; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user

	assetName: string;
	make: string;
	model: string;
	range: string;
	assetType: string;
	isReference: boolean;
	serialNo: string;
	tagNo?: string;
	assetImages: string[];
	assetRemarks: string;
	calibrationFrequency: string;
	lastCalibratedDate?: string;
	calibrationDueDate?: string;

	customerInstrumentDetails?: {
		customer: string;
		assetStatus?: string;
		lastReceivedDate?: string;
		lastDeliveredDate?: string;
	};

	referenceInstrumentDetails?: {
		referenceWorksheetId?: string;
		referenceWorksheet?: WorksheetType | null;
		verificationDueDate: Date;
		certificateUrl?: string;
		isActive?: string | boolean;
		certificateNo?: string;
		traceability?: string;
		certificateAgency?: string;
	};
}

export interface Function {
	functionName: string;
	functionId: string;
	order: number;
	worksheetId: string;
}

export interface Component {
	functionId: string;
	componentType: 'Input' | 'Select' | 'Table' | 'Text' | 'Graph';
	componentId: string;
	certificateVisibilityBasedonExpression: boolean;
	certificateVisibilityExpression: string;
	showInCertificate: boolean;
	isRequired: boolean;
	defaultValue?: string;
	isComponentDisabledOnExpression: boolean;
	disableExpression: string;
	isDisabled: boolean;
	isReadOnly: boolean;
	order: number;
	isValidationEnabled: boolean;
	validationExpression?: string;
	validationMessage?: string;
	isInvalid: boolean;
	label: string;
	isExpressionEnabled: boolean;
	valueExpression: string;
	inputComponent?: InputComponent;
	selectComponent?: SelectComponent;
	tableComponent?: TableComponent;
	textComponent?: TextComponent;
	graphComponent?: GraphComponent;
}

export interface InputComponent {
	type: 'Text' | 'Number';
	roundingDigits: number;
}

export type SelectItem = {
	key: string;
	value: string;
};
export interface SelectComponent {
	type: 'Yes or No' | 'Reference Asset' | 'Custom';
	referenceWorksheetId?: string;
	values: SelectItem[];
}

export interface TextComponent {
	type: 'Heading' | 'Paragraph';
	heading?: string;
}

export interface TableComponent {
	tableName: string;
	showTableNameInWorksheet: boolean;
	columns: TableColumn[];
	isTableRowExpressionEnabled: boolean;
	tableRowExpression: string;
}

export interface TableRow {
	key: string;
	[columnId: string]: any;
}

export interface FunctionData {
	[componentId: string]: any | TableRow[];
}

export interface DataStore {
	[functionId: string]: FunctionData;
}

export interface TableColumn {
	columnType: 'Input' | 'Select';
	tableId: string;
	columnId: string;
	columnName: string;
	defaultValue: any;
	isRequired: boolean;
	certificateVisibilityBasedonExpression: boolean;
	certificateVisibilityExpression: string;
	showInCertificate: boolean;
	isComponentDisabledOnExpression: boolean;
	disableExpression: string;
	isDisabled: boolean;
	isReadOnly: boolean;
	order: number;
	isExpressionEnabled: boolean;
	valueExpression: string;
	isValidationEnabled: boolean;
	validationExpression?: string;
	validationMessage?: string;
	isInvalid: boolean;
	isRepeatColumn: boolean;
	repeatExpression?: string;
	baseColumnId?: string;
	inputComponent?: InputComponent;
	selectComponent?: SelectComponent;
}

export interface GraphComponent {}

export type ReferenceWorksheetStore = Record<
	string,
	{ components: Component[]; functions: Function[] }
>;
export type ReferenceInstrumentDataStore = Record<string, DataStore>;

export interface ExpressionStore {
	[path: string]: {
		valueExpression?: string;
		disableExpression?: string;
		certificateVisibleExpression?: string;
		validationExpression?: string;
		tableRowExpression?: string;
		repeatExpression?: string;
	};
}

export interface DependentStore {
	[path: string]: string[];
}

export type ExpressionType =
	| 'valueExpression'
	| 'disableExpression'
	| 'certificateVisibleExpression'
	| 'validationExpression'
	| 'tableRowExpression'
	| 'repeatExpression';

export interface CurrentActiveElement {
	function: Function | null;
	component: Component | null;
	column: TableColumn | null;
}

export interface WorksheetType {
	_id: string;
	orgId: string;

	createdAt: Date | string;
	createdBy: string;
	modifiedAt?: Date;
	modifiedBy?: string;

	worksheetId: string;
	worksheetName: string;
	assetType?: string;
	type: 'All' | 'Customer Worksheet' | 'Reference Worksheet';
	stores: {
		functions: Function[];
		components: Component[];
		componentIds: Set<string>;
		functionIds: Set<string>;
		expression: ExpressionStore;
		data: DataStore;
		referenceWorksheets: ReferenceWorksheetStore;
		refereneInstruments: ReferenceInstrumentDataStore;
		dependents: {
			value: DependentStore;
			disable: DependentStore;
			certificateVisibility: DependentStore;
			validation: DependentStore;
			tableRow: DependentStore;
			repeat: DependentStore;
		};
	};
}

export type WorksheetManager = {
	getWorksheet(): WorksheetStateType;

	// Utils
	generateUniqueId(
		label: string,
		type: 'function' | 'component' | 'column',
		options?: UniqueIdGeneratorOptions
	): string;

	// Functions
	addNewFunction(): void;
	removeFunction(functionId: string): void;
	updateFunctionName(functionId: string, newFunctionName: string): void;
	updateFunction(functionId: string, properties: Partial<Function>): void;
	getAllFunctions(): Function[];
	reorderFunction(): void;

	// ComponentIds
	addNewComponentId(id: string): void;
	checkIfComponentIdExists(id: string): boolean;
	removeComponentId(componentId: string): void;

	// FunctionIds
	addNewFunctionId(id: string): void;
	checkIfFunctionIdExists(id: string): boolean;
	removeFunctionId(functionId: string): void;

	// Components
	addNewComponent(comp: Component): void;
	addComponent(comp: Component): void;
	getComponentById(componentId: string): Component | null;
	updateBaseComponentProperties(
		componentId: string,
		props: Partial<Omit<Component, ExcludeComponentPropsThatCannotBeEdited>>
	): void;
	updateComponentProperties(
		componentId: string,
		properties: Partial<Omit<Component, ExcludeComponentPropsThatCannotBeEdited>>
	): void;
	removeComponent(componentId: string): void;
	updateInputComponent(componentId: string, props: Partial<InputComponent>): void;
	updateSelectComponent(componentId: string, props: Partial<SelectComponent>): void;
	updateTextComponent(componentId: string, props: Partial<TextComponent>): void;
	updateGraphComponent(componentId: string, props: Partial<GraphComponent>): void;
	updateTableComponent(componentId: string, props: Partial<Omit<TableComponent, 'columns'>>): void;
	getAllComponents(): Component[];
	getComponentsOfCurrentFunction(): Component[];
	checkIfComponentLabelExistsInFunction(functionId: string, label: string): boolean;
	checkIfColumnNameExistsInTable(tableId: string, columnName: string): boolean;
	// Table Columns
	createNewColumn(newColumn: TableColumn): void;
	addColumn(tableId: string, col: TableColumn): void;
	getColumnComponentById(tableId: string, columnId: string): TableColumn | null;
	updateBaseColumnProperties(
		tableId: string,
		columnId: string,
		props: Partial<Omit<TableColumn, ExcludeColumnPropsThatCannotBeEdited>>
	): void;
	updateColumnProperties(
		tableId: string,
		columnId: string,
		props: Partial<Omit<TableColumn, ExcludeColumnPropsThatCannotBeEdited>>
	): void;
	updateInputColumnProperties(
		tableId: string,
		columnId: string,
		props: Partial<InputComponent>
	): void;
	updateColumnInputComponent(
		tableId: string,
		columnId: string,
		props: Partial<InputComponent>
	): void;
	updateSelectColumnProperties(
		tableId: string,
		columnId: string,
		props: Partial<SelectComponent>
	): void;
	updateColumnSelectComponent(
		tableId: string,
		columnId: string,
		props: Partial<SelectComponent>
	): void;
	removeTableColumn(tableId: string, columnId: string): void;
	removeColumn(tableId: string, columnId: string): void;
	checkIfColumnIdExistsInTable(tableId: string, columnId: string): boolean;
	reorderComponent(): void;

	// CurrentActiveElements
	setCurrentActiveFunction(fn: Function | null): void;
	setCurrentActiveComponent(comp: Component | null): void;
	setCurrentActiveColumn(col: TableColumn | null): void;
	getCurrentActiveFunction(): Function | null;
	getCurrentActiveComponent(): Component | null;
	getCurrentActiveColumn(): TableColumn | null;

	// Data Store Operations
	getComponentValue(functionId: string, componentId: string): any;
	setComponentValue(functionId: string, componentId: string, value: any): void;
	removeComponentValue(functionId: string, componentId: string): void;
	getValueByPath(path: string): any;
	getFunctionValues(functionId: string): FunctionData | null;
	clearFunctionData(functionId: string): void;
	clearDataStore(): void;

	// Table Data Operations
	addTableRow(functionId: string, componentId: string, cols: TableColumn[]): void;
	removeTableRow(functionId: string, tableId: string, rowKey: string): void;
	updateTableRows(
		functionId: string,
		tableId: string,
		columns: TableColumn[],
		targetRowCount: number
	): void;
	initializeTable(functionId: string, tableId: string): void;
	updateTableCell(
		functionId: string,
		componentId: string,
		rowKey: string,
		columnId: string,
		value: any
	): void;

	// Expression Management
	getPath(functionId: string, componentId?: string, columnId?: string): string;
	extractDependencies(expression: string): string[];
	updateExpression(
		type: ExpressionType,
		expression: string,
		functionId: string,
		componentId?: string,
		columnId?: string
	): void;
	removeExpression(
		functionId: string,
		type: ExpressionType,
		componentId?: string,
		columnId?: string
	): void;
	getDependents(
		functionId: string,
		type: ExpressionType,
		componentId?: string,
		columnId?: string
	): string[];
	getExpression(
		functionId: string,
		type: ExpressionType,
		componentId?: string,
		columnId?: string
	): string | undefined;

	// Reference Data Management
	addReferenceWorksheet(path: string, worksheet: WorksheetType): void;
	removeReferenceWorksheet(path: string): void;
	getReferenceWorksheet(
		path: string
	): { components: Component[]; functions: Function[] } | undefined;
	addReferenceInstrumentData(path: string, data: DataStore): void;
	removeReferenceInstrumentData(path: string): void;
	getReferenceInstrumentData(path: string): DataStore | undefined;
	getWorkheetExpressionSchema(): SchemaNode;
};

export interface ProcedureType {
	_id: string;
	orgId: string;

	createdAt: Date;
	createdBy: string;
	modifiedAt?: Date;
	modifiedBy?: string;

	procedureName: string;
	procedureNo: string;
	paperProcedureNo?: string;
	isActive: boolean;
	issueNo?: string;
	issueDate?: Date;
	temperature?: string;
	humidity?: string;
	internationalStandardsUsed?: string;
	preparedBy?: string;
	approvedBy?: string;
	ammendmentNo?: string;
	ammendmentDate?: Date;
	revisionRemark?: string;
	attachments: string[];
	certificateApprovers: string[];

	worksheet: WorksheetType;
}

export interface BaseWorkType {
	_id: string;
	rowId: string;
	orgId: string;
	createdAt: Date; //Created Date
	createdBy: string; //Created by which user
	modifiedAt?: Date; //Modified Date
	modifiedBy?: string; //Modified by which user

	startDate?: Date;
	finishDate?: Date;
	dueDate?: Date;

	isSalesOrderNoAvailable: boolean;
	orderNo?: string;
	workNo: string;
	workType: 'At Lab' | 'Sub Con' | 'Customer Place' | 'On Site' | 'In House';
	accreditation: 'Accredited' | 'Non Accredited';
	workStatus: 'To Do' | 'In Progress' | 'Done';
	remarks: string;
	comments: IComment[];
	certificate?: {
		certificateIssuedTo: string; //Can be the customer details also.
		certificateType: 'Supplementary' | 'Superseding' | 'Revision';
		certificateAddress: string;
		certificateTemplate: string; //Mostly this will be the template id
		certificateUrl: string;
		certificateNo: string;
	};
	calibrations: CalibrationType[];
	attachments?: {
		id: string;
		name: string;
		size: number;
		type: string;
		url?: string;
	}[];
}

export interface WorksheetStateType {
	metadata: {
		_id: string;
		orgId: string;
		createdAt: string;
		createdBy: string;
		modifiedAt: string;
		modifiedBy: string;
		worksheetId: string;
		worksheetName: string;
		assetType: string;
		type: string;
	};
	functions: Function[];
	functionIds: Set<string>;
	components: Component[];
	componentIds: Set<string>;
	expressions: ExpressionStore;
	valueDependents: DependentStore;
	disableDependents: DependentStore;
	certificateVisibilityDependents: DependentStore;
	validationDependents: DependentStore;
	tableRowDependents: DependentStore;
	repeatDependents: DependentStore;
	data: DataStore;
	currentActiveElements: {
		function: Function | null;
		component: Component | null;
		column: TableColumn | null;
	};
	referenceWorksheets: ReferenceWorksheetStore;
	referenceInstruments: ReferenceInstrumentDataStore;
}

export interface UniqueIdGeneratorOptions {
	maxLength?: number;
	reservedKeywords?: Set<string>;
	tableId?: string;
}

export type ExcludeComponentPropsThatCannotBeEdited =
	| 'componentType'
	| 'componentId'
	| 'functionId'
	| 'inputComponent'
	| 'selectComponent'
	| 'tableComponent'
	| 'textComponent'
	| 'graphComponent';

export type ExcludeColumnPropsThatCannotBeEdited =
	| 'columnType'
	| 'columnId'
	| 'inputComponent'
	| 'selectComponent';

export interface CreateWorkType extends BaseWorkType {
	customer: string;
	asset: string;
	procedure: string;
}

export interface WorkType extends BaseWorkType {
	customer: CustomerType;
	asset: AssetType;
	procedure: ProcedureType;
}
export interface MetquayWorksTypeForCalendar {
	workNo: string;
	customer: string;
	instrumentCategoryName: string;
	departmentName: string;
	status:
		| 'Work In Progress'
		| 'Unavailable'
		| 'Pending Technician Confirmation'
		| 'Schedule Changed Requested'
		| 'Ready To Start Work';
	technician: string;
	remarks: string;
	sourceNo: string;
	procedure: string;
	procedureNumber: string;
	procedureTitle: string;
	location: string;
	createdDate: string;
	startDate: string;
	endDate: string;
	estimatedHours: string;
}

export interface CalendarEventType {
	title: string;
	start: Date;
	status: MetquayWorksTypeForCalendar['status'];
	end: Date;
	allDay?: boolean;
	resource?: MetquayWorksTypeForCalendar;
}

export interface CalendarFilterType {
	startDate?: string;
	endDate?: string;
	sourceNo?: string;
	customerName?: string;
	username?: string;
	location?: string;
}

export interface IComment {
	commentId: string;
	commentDescription: string;
	commentCreatedBy: string;
	commentCreatedOn: string;
	commentText: string;
}
export interface CalibrationType {
	type: 'As Found' | 'As Left';
	worksheet: WorksheetType;
	startDate: Date;
	endDate: Date;
	calibrationTime: string;
	passed: boolean;
	showInCertificate: boolean;
	status: 'To Do' | 'In Progress' | 'Done';
}

export interface SchemaNode {
	type: 'object' | 'variable';
	children?: { [key: string]: SchemaNode };
	dataType?: 'T' | 'N' | 'B' | 'D';
}
