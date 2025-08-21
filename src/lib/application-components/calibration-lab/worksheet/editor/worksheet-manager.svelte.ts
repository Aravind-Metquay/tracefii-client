import type {
	Component,
	DataStore,
	DependentStore,
	ExcludeColumnPropsThatCannotBeEdited,
	ExcludeComponentPropsThatCannotBeEdited,
	ExpressionType,
	Function,
	FunctionData,
	GraphComponent,
	InputComponent,
	SelectComponent,
	TableColumn,
	TableComponent,
	TableRow,
	TextComponent,
	UniqueIdGeneratorOptions,
	WorksheetManager,
	WorksheetStateType,
	WorksheetType,
	SchemaNode,
	PropertyType
} from '@/Types';

function isTableData(data: any): data is TableRow[] {
	return Array.isArray(data);
}

export function initializeWorksheet(worksheetData?: WorksheetType): WorksheetManager {
	const worksheet = $state<WorksheetStateType>({
		metadata: {
			_id: '',
			orgId: '',
			createdAt: '',
			createdBy: '',
			modifiedAt: '',
			modifiedBy: '',
			worksheetId: '',
			worksheetName: '',
			assetType: '',
			type: ''
		},
		functions: [],
		functionIds: new Set<string>(),
		components: [],
		componentIds: new Set<string>(),
		expressions: {},
		valueDependents: {},
		disableDependents: {},
		certificateVisibilityDependents: {},
		validationDependents: {},
		tableRowDependents: {},
		repeatDependents: {},
		data: {},
		currentActiveElements: {
			function: null,
			component: null,
			column: null
		},
		referenceWorksheets: {},
		referenceInstruments: {}
	});

	let updating = new Set<string>();

	if (worksheetData) {
		worksheet.metadata._id = worksheetData._id;
		worksheet.metadata.orgId = worksheetData.orgId;
		worksheet.metadata.createdAt = worksheetData.createdAt.toString();
		worksheet.metadata.createdBy = worksheetData.createdBy;
		worksheet.metadata.modifiedAt = worksheetData.modifiedAt?.toString() || '';
		worksheet.metadata.modifiedBy = worksheetData.modifiedBy || '';
		worksheet.metadata.worksheetId = worksheetData.worksheetId;
		worksheet.metadata.worksheetName = worksheetData.worksheetName;
		worksheet.metadata.assetType = worksheetData.assetType || '';
		worksheet.metadata.type = worksheetData.type;

		worksheet.functions = worksheetData.stores.functions;
		worksheet.components = worksheetData.stores.components;

		if (Array.isArray(worksheetData.stores.functionIds)) {
			worksheet.functionIds = new Set(worksheetData.stores.functionIds);
		} else if (worksheetData.stores.functionIds instanceof Set) {
			worksheet.functionIds = new Set(worksheetData.stores.functionIds);
		}

		if (Array.isArray(worksheetData.stores.componentIds)) {
			worksheet.componentIds = new Set(worksheetData.stores.componentIds);
		} else if (worksheetData.stores.componentIds instanceof Set) {
			worksheet.componentIds = new Set(worksheetData.stores.componentIds);
		}

		worksheet.expressions = worksheetData.stores.expression;
		worksheet.data = worksheetData.stores.data;
		worksheet.referenceWorksheets = worksheetData.stores.referenceWorksheets;
		worksheet.referenceInstruments = worksheetData.stores.refereneInstruments;

		worksheet.valueDependents = worksheetData.stores.dependents.value;
		worksheet.disableDependents = worksheetData.stores.dependents.disable;
		worksheet.certificateVisibilityDependents =
			worksheetData.stores.dependents.certificateVisibility;
		worksheet.validationDependents = worksheetData.stores.dependents.validation;
		worksheet.tableRowDependents = worksheetData.stores.dependents.tableRow;
		worksheet.repeatDependents = worksheetData.stores.dependents.repeat;
	}

	/**
	 * Evaluates a mathematical expression with custom functions and conditional logic.
	 * All preprocessing (IFs, custom functions, and property paths) is handled inline here.
	 *
	 * @param expression - The expression to evaluate
	 * @param data - The data structure to use for evaluation
	 * @param rowIndex - The current row index being processed
	 * @param referenceInstrumentData - Optional reference data used by CFNLookup
	 * @returns The result of the evaluated expression, or null on error
	 */
	function evaluateExpression(
		expression: string,
		data: DataStore,
		rowIndex: number,
		referenceInstrumentData?: Record<string, any>
	): any {
		const preprocess = (expr: string): string => {
			let result = expr;

			const transformIfs = (s: string): string => {
				let processed = s.replace(
					/IF\s*\(\s*([^,]+),\s*IF\s*\(\s*([^,]+),\s*([^,]+),\s*([^,]+)\s*\),\s*([^)]+)\s*\)/g,
					'($1) ? (($2) ? ($3) : ($4)) : ($5)'
				);
				processed = processed.replace(
					/IF\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\s*\)/g,
					'($1) ? ($2) : ($3)'
				);
				return processed;
			};

			let prev = '';
			while (prev !== result) {
				prev = result;
				result = transformIfs(result);
			}

			type FunctionHandler = (path: string) => number;
			interface FunctionRegistry {
				[functionName: string]: FunctionHandler;
			}

			const functions: FunctionRegistry = {
				RepeatMax: (path: string): number => {
					const parts = path.split('.');
					if (parts.length !== 3) throw new Error(`Invalid path format: ${path}`);
					const [func, comp, field] = parts;

					if (
						!(func in data) ||
						!(comp in (data as any)[func]) ||
						!Array.isArray((data as any)[func][comp])
					) {
						throw new Error(`Invalid data path: ${path}`);
					}

					const targetRow = (data as any)[func][comp][rowIndex] as TableRow;
					if (!targetRow) throw new Error(`Row index out of bounds: ${rowIndex}`);

					const repeatValues = Object.entries(targetRow)
						.filter(([key]) => key.startsWith(field + '_repeat_'))
						.map(([, v]) => Number(v))
						.filter((v) => !isNaN(v));

					return repeatValues.length > 0 ? Math.max(...repeatValues) : 0;
				},

				RowMax: (path: string): number => {
					const parts = path.split('.');
					if (parts.length !== 3) throw new Error(`Invalid path format: ${path}`);
					const [func, comp, field] = parts;

					if (
						!(func in data) ||
						!(comp in (data as any)[func]) ||
						!Array.isArray((data as any)[func][comp])
					) {
						throw new Error(`Invalid data path: ${path}`);
					}

					const rows = (data as any)[func][comp] as TableRow[];
					const vals = rows
						.map((r) =>
							typeof r[field] === 'number'
								? (r[field] as number)
								: typeof r[field] === 'string'
									? Number(r[field])
									: NaN
						)
						.filter((v) => !isNaN(v));
					return vals.length > 0 ? Math.max(...vals) : 0;
				},

				RowAverage: (path: string): number => {
					const parts = path.split('.');
					if (parts.length !== 3) throw new Error(`Invalid path format: ${path}`);
					const [func, comp, field] = parts;

					if (
						!(func in data) ||
						!(comp in (data as any)[func]) ||
						!Array.isArray((data as any)[func][comp])
					) {
						throw new Error(`Invalid data path: ${path}`);
					}

					const rows = (data as any)[func][comp] as TableRow[];
					const vals = rows
						.map((r) =>
							typeof r[field] === 'number'
								? (r[field] as number)
								: typeof r[field] === 'string'
									? Number(r[field])
									: NaN
						)
						.filter((v) => !isNaN(v));

					if (vals.length === 0) return 0;
					const sum = vals.reduce((a, b) => a + b, 0);
					return sum / vals.length;
				},

				RowSum: (path: string): number => {
					const parts = path.split('.');
					if (parts.length !== 3) throw new Error(`Invalid path format: ${path}`);
					const [func, comp, field] = parts;

					if (
						!(func in data) ||
						!(comp in (data as any)[func]) ||
						!Array.isArray((data as any)[func][comp])
					) {
						throw new Error(`Invalid data path: ${path}`);
					}

					const rows = (data as any)[func][comp] as TableRow[];
					const vals = rows
						.map((r) =>
							typeof r[field] === 'number'
								? (r[field] as number)
								: typeof r[field] === 'string'
									? Number(r[field])
									: NaN
						)
						.filter((v) => !isNaN(v));

					return vals.reduce((a, b) => a + b, 0);
				},

				CFNLookup: (paths: string): number => {
					if (!referenceInstrumentData) {
						throw new Error('CFNLookup requires referenceInstrumentData to be provided.');
					}

					const args = paths.split(',');
					const lv = args[0].trim();
					const lcn = args[1].trim();
					const vcn = args[2].trim();

					const lcnParts = lcn.split('.');
					const vcnParts = vcn.split('.');

					if (lcnParts.length < 2 || vcnParts.length < 2) {
						throw new Error('LCN and VCN must have at least two hierarchical levels');
					}

					const lcnRefId = `${lcnParts[0]}.${lcnParts[1]}`;
					const vcnRefId = `${vcnParts[0]}.${vcnParts[1]}`;
					if (lcnRefId !== vcnRefId)
						throw new Error('LCN and VCN must point to the same reference data');

					const refData = JSON.parse(JSON.stringify(referenceInstrumentData))[lcnRefId];
					if (!refData) throw new Error(`Reference data not found for ${lcnRefId}`);

					const [fn, comp, col] = lv.split('.');
					const lvValue = (data as any)[fn]?.[comp]?.[rowIndex]?.[col];
					if (lvValue === undefined) throw new Error(`Value not found for LV path: ${lv}`);

					const lcnRemainingPath = lcnParts.slice(2).join('.');
					const vcnRemainingPath = vcnParts.slice(2).join('.');
					const functionName = lcnRemainingPath.split('.')[0];
					const tableName = lcnRemainingPath.split('.')[1];
					const tableData = refData?.[functionName]?.[tableName];

					if (!Array.isArray(tableData)) {
						throw new Error(`Expected an array for table at path: ${lcnRemainingPath}`);
					}

					const lcnField = lcnRemainingPath.split('.').pop()!;
					const vcnField = vcnRemainingPath.split('.').pop()!;

					let out: any;
					for (const row of tableData) {
						if (row.from_range !== undefined && row.to_range !== undefined) {
							const fromRange = parseFloat(row.from_range);
							const toRange = parseFloat(row.to_range);
							if (lvValue >= fromRange && lvValue < toRange) {
								out = row[vcnField];
								break;
							}
						} else if (row[lcnField] == lvValue) {
							out = row[vcnField];
							break;
						}
					}

					return out !== undefined ? Number(out) || 0 : 0;
				}
			};

			result = result.replace(/(\w+)\s*\(\s*([^)]+)\s*\)/g, (match, funcName, args) => {
				if (funcName in functions) {
					try {
						const value = functions[funcName](String(args).trim());
						return String(value);
					} catch (err: any) {
						console.error(`Error in function ${funcName}:`, err.message);
						throw err;
					}
				}
				return match;
			});

			result = result.replace(/\b([a-zA-Z]\w*(?:\.\w+)+)\b/g, (match) => {
				try {
					const path = match.split('.');
					let value: any = data;

					if (path.length === 3) {
						const [funcName, tableName, fieldName] = path;

						if (!(funcName in data)) throw new Error(`Invalid function name: ${funcName}`);
						const functionData: FunctionData = (data as any)[funcName];

						if (Array.isArray((functionData as any)[tableName])) {
							const tableData = (functionData as any)[tableName] as TableRow[];
							if (rowIndex >= tableData.length) {
								throw new Error(`Row index out of bounds: ${rowIndex} for table ${tableName}`);
							}

							const rowData: TableRow = tableData[rowIndex];
							if (fieldName in rowData) {
								const fieldValue = rowData[fieldName];
								if (typeof fieldValue === 'string' && !isNaN(Number(fieldValue))) {
									return String(Number(fieldValue));
								}
								return typeof fieldValue === 'number'
									? String(fieldValue)
									: ((fieldValue ?? '0') as any);
							}
							throw new Error(
								`Field ${fieldName} not found in table ${tableName} at row ${rowIndex}`
							);
						}
					}

					for (const key of path) {
						if (value === undefined || value === null) throw new Error(`Invalid path: ${match}`);
						value = value[key];
					}

					if (typeof value === 'number') return String(value);
					if (value !== undefined && value !== null) return JSON.stringify(value);
					return '0';
				} catch (err: any) {
					console.error(`Error accessing property ${match}:`, err.message);
					throw err;
				}
			});

			return result;
		};

		try {
			const processed = preprocess(expression);
			const result = eval(processed);
			return result;
		} catch (error: any) {
			console.error(`Error evaluating expression "${expression}": ${error.message}`);
			return null;
		}
	}

	const worksheetExpressionData = $derived.by(() => {
		function mapToDataType(comp: Component | TableColumn): 'T' | 'N' | 'B' | 'D' {
			const t = (comp as any).inputComponent?.type ?? (comp as any).selectComponent?.type;
			switch (t) {
				case 'Number':
					return 'N';
				case 'Yes or No':
					return 'B';
				case 'Date':
					return 'D';
				default:
					return 'T';
			}
		}

		const schema: SchemaNode = { type: 'object', children: {} };

		for (const fn of worksheet.functions) {
			const key = fn.functionId;
			const fnNode: SchemaNode = { type: 'object', children: {} };

			const comps = worksheet.components.filter((c) => c.functionId === fn.functionId);
			for (const comp of comps) {
				if (comp.componentType === 'Table' && comp.tableComponent) {
					const tableChildren: Record<string, SchemaNode> = {};
					for (const col of comp.tableComponent.columns) {
						tableChildren[col.columnId] = {
							type: 'variable',
							dataType: mapToDataType(col)
						};
					}
					fnNode.children![comp.componentId] = {
						type: 'object',
						children: tableChildren
					};
				} else {
					fnNode.children![comp.componentId] = {
						type: 'variable',
						dataType: mapToDataType(comp)
					};
				}
			}

			schema.children![key] = fnNode;
		}

		return schema;
	});

	function getDependentStore(type: ExpressionType): DependentStore {
		switch (type) {
			case 'valueExpression':
				return worksheet.valueDependents;
			case 'disableExpression':
				return worksheet.disableDependents;
			case 'certificateVisibleExpression':
				return worksheet.certificateVisibilityDependents;
			case 'validationExpression':
				return worksheet.validationDependents;
			case 'tableRowExpression':
				return worksheet.tableRowDependents;
			case 'repeatExpression':
				return worksheet.repeatDependents;
			default:
				throw new Error(`Unknown expression type: ${type}`);
		}
	}

	return {
		getWorkheetExpressionSchema() {
			return worksheetExpressionData;
		},

		getWorksheet() {
			return worksheet;
		},

		// Utils
		generateUniqueId(
			label: string,
			type: 'function' | 'component' | 'column',
			options?: UniqueIdGeneratorOptions
		): string {
			const DEFAULT_OPTIONS: Required<UniqueIdGeneratorOptions> = {
				maxLength: 50,
				reservedKeywords: new Set(['sum', 'avg', 'count', 'min', 'max', 'if', 'then', 'else']),
				tableId: ''
			};

			const { maxLength, reservedKeywords } = {
				...DEFAULT_OPTIONS,
				...options
			};

			if (!label.trim()) {
				let counter: number = 0;
				let newId: string = '';
				if (type === 'component') {
					counter = worksheet.components.length + 1;
					newId = `${type}_${counter}`;

					while (this.checkIfComponentIdExists(newId)) {
						counter++;
						newId = `${type}_${counter}`;
					}
				} else if (type === 'function') {
					counter = worksheet.functions.length + 1;
					newId = `${type}_${counter}`;

					while (this.checkIfFunctionIdExists(newId)) {
						counter++;
						newId = `${type}_${counter}`;
					}
				} else if (type === 'column') {
					if (!options?.tableId) {
						throw new Error('tableId is required when generating column IDs');
					}

					const tableComponent = this.getComponentById(options.tableId);
					const existingColumns = tableComponent?.tableComponent?.columns || [];
					counter = existingColumns.length + 1;
					newId = `${type}_${counter}`;

					while (this.checkIfColumnIdExistsInTable(options.tableId, newId)) {
						counter++;
						newId = `${type}_${counter}`;
					}
				}

				return newId;
			}

			let sanitizedId: string = label
				.toLowerCase()
				.trim()
				.replace(/[^a-z0-9]+/g, '_')
				.replace(/^_+|_+$/g, '')
				.replace(/_+/g, '_');

			if (sanitizedId.length > maxLength) {
				sanitizedId = sanitizedId.slice(0, maxLength).replace(/_+$/g, '');
			}

			if (reservedKeywords.has(sanitizedId)) {
				sanitizedId = `${type}_${sanitizedId}`;
			}

			let finalId = sanitizedId;
			let counter = 2;

			if (type === 'component') {
				while (this.checkIfComponentIdExists(finalId)) {
					finalId = `${sanitizedId}_${counter++}`;
				}
			} else if (type === 'function') {
				while (this.checkIfFunctionIdExists(finalId)) {
					finalId = `${sanitizedId}_${counter++}`;
				}
			} else if (type === 'column') {
				if (!options?.tableId) {
					throw new Error('tableId is required when generating column IDs');
				}

				while (this.checkIfColumnIdExistsInTable(options.tableId, finalId)) {
					finalId = `${sanitizedId}_${counter++}`;
				}
			}

			return finalId;
		},

		// Functions
		addNewFunction() {
			const functionId = this.generateUniqueId(
				`Function ${worksheet.functions.length + 1}`,
				'function'
			);

			const fn: Function = {
				functionName: `Function ${worksheet.functions.length + 1}`,
				functionId: functionId,
				order: worksheet.functions.length + 1,
				worksheetId: worksheet.metadata.worksheetId
			};

			worksheet.functions.push(fn);
			worksheet.functionIds.add(functionId);

			worksheet.currentActiveElements.function = fn;
			worksheet.currentActiveElements.column = null;
			worksheet.currentActiveElements.component = null;
		},

		removeFunction(functionId: string) {
			// Remove all components for this function
			const componentsToRemove = worksheet.components
				.filter((c) => c.functionId === functionId)
				.map((c) => c.componentId);

			for (const cid of componentsToRemove) {
				this.removeComponent(cid);
			}

			const idx = worksheet.functions.findIndex((f) => f.functionId === functionId);
			if (idx >= 0) worksheet.functions.splice(idx, 1);

			worksheet.functionIds.delete(functionId);

			if (worksheet.currentActiveElements.function?.functionId === functionId) {
				worksheet.currentActiveElements.function = null;
				worksheet.currentActiveElements.component = null;
				worksheet.currentActiveElements.column = null;
			}

			// Clear function data
			this.clearFunctionData(functionId);
		},

		updateFunctionName(functionId: string, newFunctionName: string) {
			const fn = worksheet.functions.find((fn) => fn.functionId === functionId);
			if (fn) {
				fn.functionName = newFunctionName;
			}
		},

		updateFunction(functionId: string, properties: Partial<Function>) {
			const fn = worksheet.functions.find((f) => f.functionId === functionId);
			if (fn) Object.assign(fn, properties);
		},

		getAllFunctions() {
			return worksheet.functions;
		},

		reorderFunction() {
			// Implementation for reordering functions
		},

		// ComponentIds
		addNewComponentId(id: string) {
			worksheet.componentIds.add(id);
		},

		checkIfComponentIdExists(id: string): boolean {
			return worksheet.componentIds.has(id);
		},

		removeComponentId(componentId: string) {
			worksheet.componentIds.delete(componentId);
		},

		// FunctionIds
		addNewFunctionId(id: string) {
			worksheet.functionIds.add(id);
		},

		checkIfFunctionIdExists(id: string): boolean {
			return worksheet.functionIds.has(id);
		},

		removeFunctionId(functionId: string) {
			worksheet.functionIds.delete(functionId);
		},

		// Components
		addNewComponent(comp: Component) {
			if (!worksheet.currentActiveElements.function?.functionId) {
				console.log('Component cannot be created since there is no active function ID');
				return;
			}
			comp.functionId = worksheet.currentActiveElements.function.functionId;
			const componentId = this.generateUniqueId(comp.label, 'component');
			this.addNewComponentId(componentId);
			comp.componentId = componentId;
			worksheet.components.push(comp);
			this.setCurrentActiveComponent(comp);
		},

		addComponent(comp: Component) {
			worksheet.components.push(comp);
			worksheet.componentIds.add(comp.componentId);
		},

		getComponentById(componentId: string): Component | null {
			return worksheet.components.find((c) => c.componentId === componentId) || null;
		},

		updateBaseComponentProperties(
			componentId: string,
			props: Partial<Omit<Component, ExcludeComponentPropsThatCannotBeEdited>>
		) {
			const component = this.getComponentById(componentId);
			if (!component)
				throw new Error('Component not found while updating properties: ' + componentId);
			Object.assign(component, props);
			this.setCurrentActiveComponent(component);
		},

		updateComponentProperties(
			componentId: string,
			properties: Partial<Omit<Component, ExcludeComponentPropsThatCannotBeEdited>>
		) {
			this.updateBaseComponentProperties(componentId, properties);
		},

		removeComponent(componentId: string) {
			const idx = worksheet.components.findIndex((comp) => comp.componentId === componentId);
			if (idx < 0) throw new Error('Component not found while trying to delete: ' + componentId);

			worksheet.components.splice(idx, 1);
			this.removeComponentId(componentId);

			// Remove component data
			Object.keys(worksheet.data).forEach((functionId) => {
				this.removeComponentValue(functionId, componentId);
			});

			worksheet.currentActiveElements.component = null;
		},

		updateInputComponent(componentId: string, props: Partial<InputComponent>) {
			const component = this.getComponentById(componentId);
			if (!component) throw new Error('Input component not found while updating: ' + componentId);
			if (component.componentType !== 'Input')
				throw new Error('Component is not an input component: ' + componentId);

			if (!component.inputComponent) {
				component.inputComponent = { type: 'Text', roundingDigits: 0 };
			}

			component.inputComponent = {
				...component.inputComponent,
				...props
			};

			this.setCurrentActiveComponent(component);
		},

		updateSelectComponent(componentId: string, props: Partial<SelectComponent>) {
			const component = this.getComponentById(componentId);
			if (!component)
				throw new Error('Component not found while updating select component: ' + componentId);
			if (component.componentType !== 'Select')
				throw new Error(
					'Found different component while updating select component: ' + componentId
				);

			if (!component.selectComponent) {
				component.selectComponent = {
					type: 'Yes or No',
					values: []
				};
			}

			component.selectComponent = {
				...component.selectComponent,
				...props
			};

			this.setCurrentActiveComponent(component);
		},

		updateTextComponent(componentId: string, props: Partial<TextComponent>) {
			const component = this.getComponentById(componentId);
			if (!component) throw new Error('Component not found while trying to update text');
			if (component.componentType !== 'Text')
				throw new Error('Mismatch in component while trying to update text');

			if (!component.textComponent) {
				component.textComponent = {
					type: 'Paragraph',
					heading: 'Text'
				};
			}

			component.textComponent = {
				...component.textComponent,
				...props
			};

			this.setCurrentActiveComponent(component);
		},

		updateGraphComponent(componentId: string, props: Partial<GraphComponent>) {
			const component = this.getComponentById(componentId);
			if (!component) throw new Error('Component not found while trying to update graph');
			if (component.componentType !== 'Graph')
				throw new Error('Mismatch in component while trying to update graph');

			if (!component.graphComponent) {
				component.graphComponent = {};
			}

			component.graphComponent = {
				...component.graphComponent,
				...props
			};
			this.setCurrentActiveComponent(component);
		},

		updateTableComponent(componentId: string, props: Partial<Omit<TableComponent, 'columns'>>) {
			const component = this.getComponentById(componentId);
			if (!component) throw new Error('Component not found while trying to update table');
			if (component.componentType !== 'Table')
				throw new Error('Mismatch in component while trying to update Table');

			if (!component.tableComponent) {
				component.tableComponent = {
					tableName: 'Test Table',
					showTableNameInWorksheet: false,
					isTableRowExpressionEnabled: false,
					tableRowExpression: '',
					columns: []
				};
			}

			component.tableComponent = {
				...component.tableComponent,
				...props
			};

			this.setCurrentActiveComponent(component);
		},

		checkIfComponentLabelExistsInFunction(functionId: string, label: string): boolean {
			const normalizedLabel = label.trim().toLowerCase();
			return worksheet.components.some(
				(c) => c.functionId === functionId && c.label.trim().toLowerCase() === normalizedLabel
			);
		},

		getAllComponents(): Component[] {
			return worksheet.components;
		},

		getComponentsOfCurrentFunction(): Component[] {
			const activeFunction = worksheet.currentActiveElements.function;
			if (!activeFunction) {
				return [];
			}
			return worksheet.components.filter((com) => com.functionId === activeFunction.functionId);
		},

		createNewColumn(newColumn: TableColumn) {
			const tableComponent = this.getComponentById(newColumn.tableId);
			if (!tableComponent) throw new Error('Table not found while creating column');

			if (!newColumn.columnId) {
				newColumn.columnId = this.generateUniqueId(newColumn.columnName, 'column', {
					tableId: newColumn.tableId
				});
			}

			if (tableComponent.tableComponent?.columns) {
				tableComponent.tableComponent.columns = [
					...tableComponent.tableComponent.columns,
					newColumn
				];
			} else {
				tableComponent.tableComponent = {
					tableName: tableComponent.tableComponent?.tableName ?? '',
					showTableNameInWorksheet:
						tableComponent.tableComponent?.showTableNameInWorksheet ?? false,
					isTableRowExpressionEnabled:
						tableComponent.tableComponent?.isTableRowExpressionEnabled ?? false,
					tableRowExpression: tableComponent.tableComponent?.tableRowExpression ?? '',
					columns: [newColumn]
				};
			}

			this.setCurrentActiveColumn(newColumn);
		},

		checkIfColumnNameExistsInTable(tableId: string, columnName: string): boolean {
			const tableComponent = this.getComponentById(tableId);

			if (
				!tableComponent ||
				tableComponent.componentType !== 'Table' ||
				!tableComponent.tableComponent?.columns
			) {
				return false;
			}

			const normalizedColumnName = columnName.trim().toLowerCase();

			return tableComponent.tableComponent.columns.some(
				(col) => col.columnName.trim().toLowerCase() === normalizedColumnName
			);
		},

		addColumn(tableId: string, col: TableColumn) {
			const component = worksheet.components.find((c) => c.componentId === tableId);
			if (!component) throw new Error('Table not found for adding column');

			if (component.tableComponent?.columns) {
				component.tableComponent.columns.push(col);
			} else {
				component.tableComponent = {
					tableName: component.tableComponent?.tableName ?? '',
					showTableNameInWorksheet: component.tableComponent?.showTableNameInWorksheet ?? false,
					isTableRowExpressionEnabled:
						component.tableComponent?.isTableRowExpressionEnabled ?? false,
					tableRowExpression: component.tableComponent?.tableRowExpression ?? '',
					columns: [col]
				};
			}
		},

		checkIfColumnIdExistsInTable(tableId: string, columnId: string): boolean {
			const tableComponent = this.getComponentById(tableId);
			if (!tableComponent || tableComponent.componentType !== 'Table') {
				return false;
			}

			if (tableComponent.tableComponent?.columns) {
				return tableComponent.tableComponent.columns.some((col) => col.columnId === columnId);
			}

			return false;
		},

		getColumnComponentById(tableId: string, columnId: string): TableColumn | null {
			const table = worksheet.components.find((c) => c.componentId === tableId);
			if (!table) return null;

			const column = table.tableComponent?.columns.find((col) => col.columnId === columnId);
			return column || null;
		},

		updateBaseColumnProperties(
			tableId: string,
			columnId: string,
			props: Partial<Omit<TableColumn, ExcludeColumnPropsThatCannotBeEdited>>
		) {
			const column = this.getColumnComponentById(tableId, columnId);
			if (!column)
				throw new Error(
					`Column or table not found while updating base col properties: ${tableId}, ${columnId}`
				);

			Object.assign(column, props);
		},

		updateColumnProperties(
			tableId: string,
			columnId: string,
			props: Partial<Omit<TableColumn, ExcludeColumnPropsThatCannotBeEdited>>
		) {
			this.updateBaseColumnProperties(tableId, columnId, props);
		},

		updateInputColumnProperties(tableId: string, columnId: string, props: Partial<InputComponent>) {
			const column = this.getColumnComponentById(tableId, columnId);
			if (!column)
				throw new Error(
					`Column or table not found while updating input col properties: ${tableId}, ${columnId}`
				);

			if (column.columnType !== 'Input')
				throw new Error(`Column is not an input column: ${tableId}, ${columnId}`);

			if (!column.inputComponent) {
				column.inputComponent = {
					type: 'Number',
					roundingDigits: 2
				};
			}

			column.inputComponent = {
				...column.inputComponent,
				...props
			};
		},

		updateColumnInputComponent(tableId: string, columnId: string, props: Partial<InputComponent>) {
			this.updateInputColumnProperties(tableId, columnId, props);
		},

		updateSelectColumnProperties(
			tableId: string,
			columnId: string,
			props: Partial<SelectComponent>
		) {
			const column = this.getColumnComponentById(tableId, columnId);
			if (!column)
				throw new Error(
					`Column or table not found while updating select col properties: ${tableId}, ${columnId}`
				);

			if (column.columnType !== 'Select')
				throw new Error(`Column is not an select column: ${tableId}, ${columnId}`);

			if (!column.selectComponent) {
				column.selectComponent = {
					type: 'Yes or No',
					values: []
				};
			}

			column.selectComponent = {
				...column.selectComponent,
				...props
			};
		},

		updateColumnSelectComponent(
			tableId: string,
			columnId: string,
			props: Partial<SelectComponent>
		) {
			this.updateSelectColumnProperties(tableId, columnId, props);
		},

		removeTableColumn(tableId: string, columnId: string) {
			const tableComponent = this.getComponentById(tableId);
			if (!tableComponent)
				throw new Error(`Table not found while trying to remove column: ${tableId}, ${columnId}`);

			if (tableComponent.componentType !== 'Table')
				throw new Error(`Component is not table while trying to remove column: ${tableId}`);

			if (!tableComponent.tableComponent?.columns)
				throw new Error(`Table has no columns: ${tableId}`);

			const colIdx = tableComponent.tableComponent.columns.findIndex(
				(c) => c.columnId === columnId
			);
			if (colIdx === -1) throw new Error(`Column not found: ${columnId}`);

			tableComponent.tableComponent.columns.splice(colIdx, 1);
		},

		removeColumn(tableId: string, columnId: string) {
			this.removeTableColumn(tableId, columnId);
		},

		reorderComponent() {
			// Implementation for reordering components
		},

		// CurrentActiveElements
		setCurrentActiveFunction(fn: Function | null) {
			worksheet.currentActiveElements.column = null;
			worksheet.currentActiveElements.component = null;
			worksheet.currentActiveElements.function = fn;
		},

		setCurrentActiveComponent(comp: Component | null) {
			worksheet.currentActiveElements.component = comp;
		},

		setCurrentActiveColumn(col: TableColumn | null) {
			worksheet.currentActiveElements.column = col;
		},

		getCurrentActiveFunction(): Function | null {
			return worksheet.currentActiveElements.function;
		},

		getCurrentActiveColumn(): TableColumn | null {
			return worksheet.currentActiveElements.column;
		},

		getCurrentActiveComponent(): Component | null {
			return worksheet.currentActiveElements.component;
		},

		// Data Store Operations
		getComponentValue(functionId: string, componentId: string) {
			const fnData = worksheet.data[functionId];
			if (fnData && componentId in fnData) {
				return fnData[componentId];
			}
			console.warn(`Component ID ${componentId} not found in function ${functionId}`);
			return null;
		},

		setComponentValue(functionId: string, componentId: string, value: any) {
			if (!worksheet.data[functionId]) worksheet.data[functionId] = {};
			worksheet.data[functionId][componentId] = value;
			this.processDependencyUpdates(functionId, componentId);
		},

		removeComponentValue(functionId: string, componentId: string) {
			const fnData = worksheet.data[functionId];
			if (fnData && componentId in fnData) {
				delete fnData[componentId];
				if (Object.keys(fnData).length === 0) {
					delete worksheet.data[functionId];
				}
			} else {
				console.warn(`Component ID ${componentId} not found in function ${functionId}`);
			}
		},

		getValueByPath(path: string) {
			const parts = path.split('.');
			if (parts.length === 2) {
				return this.getComponentValue(parts[0], parts[1]);
			} else if (parts.length === 3) {
				const [funcId, tableId, colId] = parts;
				const tableData = this.getComponentValue(funcId, tableId);
				if (isTableData(tableData)) {
					return tableData.map((row) => row[colId]);
				}
			}
			return null;
		},

		getFunctionValues(functionId: string): FunctionData | null {
			if (functionId in worksheet.data) return worksheet.data[functionId];
			console.warn(`Function ID ${functionId} not found in data store`);
			return null;
		},

		clearFunctionData(functionId: string) {
			if (functionId in worksheet.data) delete worksheet.data[functionId];
		},

		clearDataStore() {
			Object.keys(worksheet.data).forEach((fid) => delete worksheet.data[fid]);
		},

		// Table Data Operations
		addTableRow(functionId: string, componentId: string, cols: TableColumn[]) {
			if (!worksheet.data[functionId]) worksheet.data[functionId] = {};
			const current = worksheet.data[functionId][componentId] as TableRow[] | undefined;
			const rows = isTableData(current) ? current : [];
			const nextKey = rows.length ? String(Math.max(...rows.map((r) => parseInt(r.key))) + 1) : '1';
			const newRow = cols.reduce((acc, col) => ({ ...acc, [col.columnId]: '' }), { key: nextKey });
			worksheet.data[functionId][componentId] = [...rows, newRow];
		},

		removeTableRow(functionId: string, tableId: string, rowKey: string) {
			const fnData = worksheet.data[functionId];
			if (!fnData || !isTableData(fnData[tableId])) {
				console.error(`Table ${tableId} not found in function ${functionId}`);
				return;
			}
			const rows = fnData[tableId];
			const idx = rows.findIndex((r) => r.key === rowKey);
			if (idx !== -1) rows.splice(idx, 1);
			else console.warn(`Row with key ${rowKey} not found in table ${tableId}`);
		},

		updateTableRows(
			functionId: string,
			tableId: string,
			columns: TableColumn[],
			targetRowCount: number
		) {
			if (!worksheet.data[functionId]) worksheet.data[functionId] = {};
			const current = worksheet.data[functionId][tableId] as TableRow[] | undefined;
			const rows = isTableData(current) ? current : [];
			const count = rows.length;
			if (targetRowCount === count) return;

			if (targetRowCount > count) {
				const newRows: TableRow[] = [];
				for (let i = 0; i < targetRowCount - count; i++) {
					const key = String(count + i + 1);
					const row = columns.reduce((acc, col) => ({ ...acc, [col.columnId]: '' }), { key });
					newRows.push(row);
				}
				worksheet.data[functionId][tableId] = [...rows, ...newRows];
			} else {
				worksheet.data[functionId][tableId] = rows.slice(0, targetRowCount);
			}
		},

		initializeTable(functionId: string, tableId: string) {
			if (!worksheet.data[functionId]) worksheet.data[functionId] = {};
			if (!worksheet.data[functionId][tableId]) worksheet.data[functionId][tableId] = [];
		},

		updateTableCell(
			functionId: string,
			componentId: string,
			rowKey: string,
			columnId: string,
			value: any
		) {
			const fnData = worksheet.data[functionId];
			if (!fnData || !isTableData(fnData[componentId])) {
				console.error(`Table ${componentId} not found in function ${functionId}`);
				return;
			}
			const rows = fnData[componentId];
			const idx = rows.findIndex((r) => r.key === rowKey);
			if (idx !== -1) {
				rows[idx][columnId] = value;
				this.processDependencyUpdates(functionId, componentId, columnId, rowKey);
			} else {
				console.warn(`Row with key ${rowKey} not found in table ${componentId}`);
			}
		},

		// Expression Management
		getPath(functionId: string, componentId?: string, columnId?: string): string {
			let path = functionId;
			if (componentId) path += `.${componentId}`;
			if (columnId) path += `.${columnId}`;
			return path;
		},

		extractDependencies(expression: string): string[] {
			const regex = /\b[a-zA-Z]\w*(?:\.\w+)+\b/g;
			const matches = expression.match(regex) ?? [];
			return Array.from(new Set(matches));
		},

		updateExpression(
			type: ExpressionType,
			expression: string,
			functionId: string,
			componentId?: string,
			columnId?: string
		) {
			const path = this.getPath(functionId, componentId, columnId);
			const dependentStore = getDependentStore(type);

			// Ensure entry exists
			if (!worksheet.expressions[path]) worksheet.expressions[path] = {};
			worksheet.expressions[path][type] = expression;

			// Clear old dependencies
			Object.keys(dependentStore).forEach((dep) => {
				const idx = dependentStore[dep].indexOf(path);
				if (idx > -1) {
					dependentStore[dep].splice(idx, 1);
					if (dependentStore[dep].length === 0) delete dependentStore[dep];
				}
			});

			// Add new dependencies
			const deps = this.extractDependencies(expression);
			deps.forEach((dep) => {
				if (!dependentStore[dep]) dependentStore[dep] = [];
				if (!dependentStore[dep].includes(path)) {
					dependentStore[dep].push(path);
				}
			});
		},

		removeExpression(
			functionId: string,
			type: ExpressionType,
			componentId?: string,
			columnId?: string
		) {
			const path = this.getPath(functionId, componentId, columnId);
			const dependentStore = getDependentStore(type);

			if (worksheet.expressions[path]) {
				delete worksheet.expressions[path][type];
				if (Object.keys(worksheet.expressions[path]).length === 0) {
					delete worksheet.expressions[path];
				}
			}

			Object.keys(dependentStore).forEach((dep) => {
				const idx = dependentStore[dep].indexOf(path);
				if (idx > -1) {
					dependentStore[dep].splice(idx, 1);
					if (dependentStore[dep].length === 0) delete dependentStore[dep];
				}
			});
		},

		getDependents(
			functionId: string,
			type: ExpressionType,
			componentId?: string,
			columnId?: string
		): string[] {
			const path = this.getPath(functionId, componentId, columnId);
			const store = getDependentStore(type);
			return store[path] ?? [];
		},

		getExpression(
			functionId: string,
			type: ExpressionType,
			componentId: string,
			columnId?: string
		): string | undefined {
			const path = this.getPath(functionId, componentId, columnId);
			return worksheet.expressions[path]?.[type];
		},

		// Reference Data Management
		addReferenceWorksheet(path: string, worksheet: WorksheetType) {
			if (worksheet.stores.referenceWorksheets[path]) {
				console.warn(`Worksheet reference at path '${path}' already exists — overwriting.`);
			}
			worksheet.stores.referenceWorksheets[path] = {
				components: worksheet.stores.components,
				functions: worksheet.stores.functions
			};
		},

		removeReferenceWorksheet(path: string) {
			if (!(path in worksheet.referenceWorksheets)) {
				console.warn(`No worksheet reference found at path '${path}'.`);
				return;
			}
			delete worksheet.referenceWorksheets[path];
		},

		getReferenceWorksheet(
			path: string
		): { components: Component[]; functions: Function[] } | undefined {
			return worksheet.referenceWorksheets[path];
		},

		addReferenceInstrumentData(path: string, data: DataStore) {
			if (worksheet.referenceInstruments[path]) {
				console.warn(`Instrument data reference at path '${path}' already exists — overwriting.`);
			}
			worksheet.referenceInstruments[path] = data;
		},

		removeReferenceInstrumentData(path: string) {
			if (!(path in worksheet.referenceInstruments)) {
				console.warn(`No instrument data reference found at path '${path}'.`);
				return;
			}
			delete worksheet.referenceInstruments[path];
		},

		getReferenceInstrumentData(path: string): DataStore | undefined {
			const data = worksheet.referenceInstruments[path];
			if (!data) {
				console.error(`Instrument data not found for path '${path}'.`);
			}
			return data;
		},

		processDependencyUpdates(
			functionId: string,
			componentId: string,
			columnId?: string,
			rowKey?: string
		) {
			const self = this;
			const path = self.getPath(functionId, componentId, columnId);
			if (updating.has(path)) return;

			try {
				updating.add(path);

				const collectDependents = (
					p: string,
					updateQueue: Set<string>,
					visited: Set<string>,
					expressionType: ExpressionType
				) => {
					if (visited.has(p)) return;
					visited.add(p);

					let [pathFunctionId, compId, colId] = p.split('.');
					const comp = worksheet.components.find((c: Component) => c.componentId === compId);
					if (comp?.componentType === 'Table') {
						const col = comp.tableComponent?.columns.find((c: any) => c.columnId === colId);
						if (col && col.baseColumnId && col.baseColumnId.length > 0) {
							colId = col.baseColumnId;
						}
					}

					const dependents = self.getDependents(pathFunctionId, expressionType, compId, colId);
					dependents.forEach((dep: string) => {
						updateQueue.add(dep);
						collectDependents(dep, updateQueue, visited, expressionType);
					});
				};

				// const processValueQueue = (updateQueue: Set<string>, rk?: string) => {
				// 	const updates = Array.from(updateQueue);
				// 	updates.forEach((p) => {
				// 		const [fnId, compId, colId] = p.split('.');
				// 		const expression = self.getExpression(fnId, 'valueExpression', compId, colId);
				// 		if (!expression) return;

				// 		try {
				// 			if (colId) {
				// 				const tableData = worksheet.data[fnId]?.[compId];
				// 				if (Array.isArray(tableData)) {
				// 					if (rk) {
				// 						const row = tableData.find((r: any) => r.key === rk);
				// 						if (row) {
				// 							row[colId] = evaluateExpression(
				// 								expression,
				// 								JSON.parse(JSON.stringify(worksheet.data)),
				// 								Number(rk) - 1
				// 							);
				// 						}
				// 					}
				// 				}
				// 			} else {
				// 				const newValue = evaluateExpression(
				// 					expression,
				// 					JSON.parse(JSON.stringify(worksheet.data)),
				// 					0
				// 				);
				// 				if (!worksheet.data[fnId]) worksheet.data[fnId] = {};
				// 				worksheet.data[fnId][compId] = newValue;
				// 			}
				// 		} catch (error) {
				// 			console.error(`Error updating dependent ${p}:`, error);
				// 		}
				// 	});
				// };

				const processValueQueue = (updateQueue: Set<string>, rk?: string) => {
					const updates = Array.from(updateQueue);
					updates.forEach((p) => {
						const [fnId, compId, colId] = p.split('.');
						const expression = self.getExpression(fnId, 'valueExpression', compId, colId);
						if (!expression) return;

						try {
							if (colId && rk) {
								const tableData = worksheet.data[fnId]?.[compId];
								if (Array.isArray(tableData)) {
									const newTableData = tableData.map((row: TableRow) => {
										if (row.key === rk) {
											return {
												...row, 
												[colId]: evaluateExpression(
													expression,
													JSON.parse(JSON.stringify(worksheet.data)),
													Number(rk) - 1
												)
											};
										}
										return row;
									});

									worksheet.data[fnId][compId] = newTableData;
								}
							} else {
								const newValue = evaluateExpression(
									expression,
									JSON.parse(JSON.stringify(worksheet.data)),
									0
								);
								if (!worksheet.data[fnId]) worksheet.data[fnId] = {};
								worksheet.data[fnId][compId] = newValue;
							}
						} catch (error) {
							console.error(`Error updating dependent ${p}:`, error);
						}
					});
				};

				const processPropertyQueue = (updateQueue: Set<string>, propertyType: PropertyType) => {
					const updates = Array.from(updateQueue);
					let expressionType: ExpressionType;

					if (propertyType === 'isDisabled') expressionType = 'disableExpression';
					else if (propertyType === 'isInvalid') expressionType = 'validationExpression';
					else expressionType = 'certificateVisibleExpression';

					updates.forEach((p) => {
						const [pathFunctionId, compId, colId] = p.split('.');
						const expression = self.getExpression(pathFunctionId, expressionType, compId, colId);
						if (!expression) return;

						try {
							const result = evaluateExpression(
								expression,
								JSON.parse(JSON.stringify(worksheet.data)),
								0
							);
							const [fnId, componentId2, columnId2] = p.split('.');

							if (columnId2) {
								const comp = worksheet.components.find(
									(c: Component) => c.componentId === componentId2 && c.functionId === fnId
								);
								if (comp?.tableComponent) {
									const column = comp.tableComponent.columns.find(
										(col: any) => col.columnId === columnId2
									);
									if (column) {
										self.updateColumnProperties(column.tableId, column.columnId, {
											[propertyType]: !!result
										});
									}
								}
							} else {
								self.updateComponentProperties(componentId2, { [propertyType]: !!result });
							}
						} catch (error) {
							console.error(`Error updating ${propertyType} for ${p}:`, error);
						}
					});
				};

				const processTableRowQueue = (updateQueue: Set<string>) => {
					const updates = Array.from(updateQueue);
					updates.forEach((p) => {
						const [pathFunctionId, compId] = p.split('.');
						const expression = self.getExpression(pathFunctionId, 'tableRowExpression', compId);
						if (!expression) return;

						try {
							const result = evaluateExpression(
								expression,
								JSON.parse(JSON.stringify(worksheet.data)),
								0
							);
							const [fnId, componentId2] = p.split('.');
							const table = worksheet.components.find(
								(c: Component) => c.componentId === componentId2
							);
							if (
								table?.tableComponent?.columns.length &&
								table?.tableComponent?.columns.length > 0
							) {
								self.updateTableRows(fnId, componentId2, table.tableComponent.columns, result);
							}
						} catch (error) {
							console.error(`Error updating table rows for ${p}:`, error);
						}
					});
				};

				const processRepeatColumnQueue = (updateQueue: Set<string>) => {
					const updates = Array.from(updateQueue);
					updates.forEach((p) => {
						const [pathFunctionId, compId, colId] = p.split('.');
						const expression = self.getExpression(
							pathFunctionId,
							'repeatExpression',
							compId,
							colId
						);
						if (!expression) return;

						try {
							const result = evaluateExpression(
								expression,
								JSON.parse(JSON.stringify(worksheet.data)),
								0
							);
							const table = worksheet.components.find((c: Component) => c.componentId === compId);
							if (table?.tableComponent) {
								const repeatColumn = table.tableComponent.columns.find(
									(col: any) => col.columnId === colId
								);
								if (repeatColumn) {
									table.tableComponent.columns = table.tableComponent.columns.filter(
										(col: any) => !col.columnId.startsWith(`${repeatColumn.columnId}_repeat_`)
									);

									for (let i = 1; i <= result; i++) {
										const newColumn = { ...repeatColumn };
										newColumn.columnId = `${repeatColumn.columnId}_repeat_${i}`;
										newColumn.columnName = `${repeatColumn.columnName}${i}`;
										newColumn.isRepeatColumn = false;
										newColumn.repeatExpression = '';
										newColumn.baseColumnId = repeatColumn.columnId;
										table.tableComponent.columns.push(newColumn);
									}
								}
							}
						} catch (error) {
							console.error(`Error updating repeat columns for ${p}:`, error);
						}
					});
				};

				const cleanupExpressionsAndDependencies = (baseFunctionId: string) => {
					Object.keys(worksheet.expressions).forEach((p) => {
						if (p.startsWith(`${baseFunctionId}_repeat_`)) delete worksheet.expressions[p];
					});

					const dependentStores: DependentStore[] = [
						worksheet.valueDependents,
						worksheet.disableDependents,
						worksheet.certificateVisibilityDependents,
						worksheet.validationDependents,
						worksheet.tableRowDependents,
						worksheet.repeatDependents
					];

					dependentStores.forEach((store: Record<string, string[]>) => {
						Object.keys(store).forEach((p) => {
							if (p.startsWith(`${baseFunctionId}_repeat_`)) {
								delete store[p];
							} else {
								store[p] = store[p].filter(
									(dep: string) => !dep.startsWith(`${baseFunctionId}_repeat_`)
								);
								if (store[p].length === 0) delete store[p];
							}
						});
					});
				};

				const cleanupExistingRepeats = (baseFunctionId: string) => {
					for (let i = worksheet.functions.length - 1; i >= 0; i--) {
						if (worksheet.functions[i].functionId.startsWith(`${baseFunctionId}_repeat_`)) {
							worksheet.functions.splice(i, 1);
						}
					}
					for (let i = worksheet.components.length - 1; i >= 0; i--) {
						if (
							(worksheet.components[i] as Component).functionId.startsWith(
								`${baseFunctionId}_repeat_`
							)
						) {
							worksheet.components.splice(i, 1);
						}
					}
					cleanupExpressionsAndDependencies(baseFunctionId);
				};

				const createRepeatedFunction = (
					baseFunction: Function,
					newFunctionId: string,
					repeatIndex: number
				): Function => {
					return {
						...baseFunction,
						functionId: newFunctionId,
						functionName: `${baseFunction.functionName} ${repeatIndex}`,
						order: baseFunction.order + repeatIndex * 0.1
					} as Function;
				};

				const createRepeatedComponents = (
					baseComponents: Component[],
					newFunctionId: string,
					repeatIndex: number
				): Component[] => {
					return baseComponents.map((baseComponent) => ({
						...baseComponent,
						functionId: newFunctionId,
						componentId: `${baseComponent.componentId}_${repeatIndex}`,
						label: `${baseComponent.label} ${repeatIndex}`
					}));
				};

				const transformExpression = (
					expression: string,
					baseFunctionId: string,
					newFunctionId: string,
					repeatIndex: number
				): string => {
					let newExpression = expression.replace(
						new RegExp(`${baseFunctionId}\\.([\\w]+)`, 'g'),
						`${newFunctionId}.$1_${repeatIndex}`
					);

					newExpression = newExpression
						.replace(/REPEAT_INDEX\(\)/g, String(repeatIndex))
						.replace(/BASE_VALUE\(['"](.*?)['"]\)/g, (_: any, p1: string) => `GET('${p1}')`)
						.replace(/PREV_REPEAT\(['"](.*?)['"]\)/g, (_: any, p1: string) => {
							const prevIndex = repeatIndex - 1;
							if (prevIndex < 1) return 'null';
							return `GET('${p1}_repeat_${prevIndex}')`;
						});

					return newExpression;
				};

				const updateComponentExpressions = (
					baseFunctionId: string,
					baseComponentId: string,
					newFunctionId: string,
					newComponentId: string,
					repeatIndex: number
				) => {
					const basePath = `${baseFunctionId}.${baseComponentId}`;
					const newPath = `${newFunctionId}.${newComponentId}`;

					const expressionTypes: ExpressionType[] = [
						'valueExpression',
						'disableExpression',
						'certificateVisibleExpression',
						'validationExpression',
						'tableRowExpression',
						'repeatExpression'
					];

					if (!worksheet.expressions[newPath]) worksheet.expressions[newPath] = {};

					expressionTypes.forEach((type) => {
						const baseExpression = worksheet.expressions[basePath]?.[type];
						if (baseExpression) {
							const newExpression = transformExpression(
								baseExpression,
								baseFunctionId,
								newFunctionId,
								repeatIndex
							);
							worksheet.expressions[newPath][type] = newExpression;
							self.updateExpression(type, newExpression, newFunctionId, newComponentId);
						}
					});
				};

				const updateDependentStore = (
					baseFunctionId: string,
					newFunctionId: string,
					repeatIndex: number
				) => {
					const expressionTypes: ExpressionType[] = [
						'valueExpression',
						'disableExpression',
						'certificateVisibleExpression',
						'validationExpression',
						'tableRowExpression',
						'repeatExpression'
					];

					expressionTypes.forEach((type) => {
						Object.entries(worksheet.expressions)
							.filter(
								([p, expressions]: any) =>
									p.startsWith(baseFunctionId) && !p.includes('repeat') && expressions[type]
							)
							.forEach(([basePath, expressions]: any) => {
								const [, baseComponentId] = (basePath as string).split('.');
								const baseExpression = expressions[type];
								if (baseExpression) {
									const newExpression = transformExpression(
										baseExpression,
										baseFunctionId,
										newFunctionId,
										repeatIndex
									);
									self.updateExpression(
										type,
										newExpression,
										newFunctionId,
										`${baseComponentId}_${repeatIndex}`
									);
								}
							});
					});
				};

				const updateExpressionsAndDependencies = (
					baseFunctionId: string,
					newFunctionId: string,
					baseComponents: Component[],
					repeatedComponents: Component[],
					repeatIndex: number
				) => {
					baseComponents.forEach((baseComp, index) => {
						const repeatedComp = repeatedComponents[index];
						updateComponentExpressions(
							baseFunctionId,
							baseComp.componentId,
							newFunctionId,
							repeatedComp.componentId,
							repeatIndex
						);
					});
					updateDependentStore(baseFunctionId, newFunctionId, repeatIndex);
				};

				const processRepeatFunctionQueue = (updateQueue: Set<string>) => {
					const updates = Array.from(updateQueue);
					updates.forEach((p) => {
						const [pathFunctionId] = p.split('.');
						const expression = self.getExpression(pathFunctionId, 'repeatExpression');
						if (!expression) return;

						try {
							const repeatCount = evaluateExpression(
								expression,
								JSON.parse(JSON.stringify(worksheet.data)),
								0
							);
							const baseFunction = worksheet.functions.find(
								(fn: Function) => fn.functionId === pathFunctionId
							);
							const baseComponents = worksheet.components.filter(
								(c: Component) => c.functionId === pathFunctionId
							);
							if (!baseFunction || !baseComponents.length) return;

							cleanupExistingRepeats(pathFunctionId);

							for (let i = 1; i <= repeatCount; i++) {
								const newFunctionId = `${pathFunctionId}_repeat_${i}`;
								const repeatedFunction = createRepeatedFunction(baseFunction, newFunctionId, i);
								worksheet.functions.push(repeatedFunction);

								const repeatedComponents = createRepeatedComponents(
									baseComponents,
									newFunctionId,
									i
								);
								repeatedComponents.forEach((comp: Component) => worksheet.components.push(comp));

								updateExpressionsAndDependencies(
									pathFunctionId,
									newFunctionId,
									baseComponents,
									repeatedComponents,
									i
								);
							}
						} catch (error) {
							console.error(`Error updating repeat functions for ${p}:`, error);
						}
					});
				};

				const valueQueue = new Set<string>();
				const disableQueue = new Set<string>();
				const certificateQueue = new Set<string>();
				const invalidQueue = new Set<string>();
				const tableRowQueue = new Set<string>();
				const repeatQueue = new Set<string>();

				collectDependents(path, valueQueue, new Set<string>(), 'valueExpression');
				collectDependents(path, disableQueue, new Set<string>(), 'disableExpression');
				collectDependents(
					path,
					certificateQueue,
					new Set<string>(),
					'certificateVisibleExpression'
				);
				collectDependents(path, invalidQueue, new Set<string>(), 'validationExpression');
				collectDependents(path, tableRowQueue, new Set<string>(), 'tableRowExpression');
				collectDependents(path, repeatQueue, new Set<string>(), 'repeatExpression');

				processValueQueue(valueQueue, rowKey ? rowKey : undefined);
				processPropertyQueue(disableQueue, 'isDisabled');
				processPropertyQueue(certificateQueue, 'showInCertificate');
				processPropertyQueue(invalidQueue, 'isInvalid');
				processTableRowQueue(tableRowQueue);
				processRepeatColumnQueue(repeatQueue);
				processRepeatFunctionQueue(repeatQueue);
			} finally {
				updating.delete(path);
			}
		}
	};
}
