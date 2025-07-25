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
	WorksheetType
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
                (c) =>
                    c.functionId === functionId && c.label.trim().toLowerCase() === normalizedLabel
            );
        },

		getAllComponents(): Component[] {
			return worksheet.components;
		},

		getComponentsOfCurrentFunction(): Component[] {
			if (worksheet.currentActiveElements.function) {
				return worksheet.components.filter(
					(com) => com.functionId === worksheet.currentActiveElements.function?.functionId
				);
			} else {
				return [];
			}
		},

		// Table Columns
		createNewColumn(newColumn: TableColumn) {
			const tableComponent = this.getComponentById(newColumn.tableId);
			if (!tableComponent) throw new Error('Table not found while creating column');

			if (!newColumn.columnId) {
				newColumn.columnId = this.generateUniqueId(newColumn.columnName, 'column', {
					tableId: newColumn.tableId
				});
			}

			if (tableComponent.tableComponent?.columns) {
				tableComponent.tableComponent.columns.push(newColumn);
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
			// processDependencyUpdates could be called here
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
				// processDependencyUpdates could be called here
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
			const regex = /[A-Za-z]+_?\d*\.[A-Za-z_]\d*(?:\.[A-Za-z_]\d*)?/g;
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
			componentId?: string,
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
		}
	};
}
