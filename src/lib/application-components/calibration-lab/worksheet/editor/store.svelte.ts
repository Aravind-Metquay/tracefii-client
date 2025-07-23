import type { Component, DataStore, DependentStore, ExpressionStore, Function, GraphComponent, InputComponent, ReferenceInstrumentDataStore, ReferenceWorksheetStore, SelectComponent, TableColumn, TableComponent, TextComponent, WorksheetType } from "@/Types";

interface WorksheetStateType {
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
    functionIds : string[];
    components: Component[];
    componentIds: string[];
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
        column: any | null;
    };
    referenceWorksheets: ReferenceWorksheetStore;
    referenceInstruments: ReferenceInstrumentDataStore;
}

interface UniqueIdGeneratorOptions {
    maxLength? : number;
    reservedKeywords? : Set<string>;
}

type ExcludeComponentPropsThatCannotBeEdited = 
    'componentType' 
    | 'componentId'
    | 'functionId'
    | 'inputComponent'
    | 'selectComponent'
    | 'tableComponent'
    | 'textComponent'
    | 'graphComponent';

type ExcludeColumnPropsThatCannotBeEdited  = 'columnType' | 'columnId' | 'inputComponent' | 'selectComponent'

// Return type for the initializeWorksheet function
export type WorksheetManager = {
    getWorksheet(): WorksheetStateType;
    
    // Utils
    generateUniqueId(label: string, type: "function" | "component", options?: UniqueIdGeneratorOptions): string;
    
    // Functions
    addNewFunction(): void;
    removeFunction(functionId: string): void;
    updateFunctionName(functionId: string, newFunctionName: string): void;
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
    getComponentById(componentId: string): Component | null;
    updateBaseComponentProperties(componentId: string, props: Partial<Omit<Component, ExcludeComponentPropsThatCannotBeEdited>>): void;
    removeComponent(componentId: string): void;
    updateInputComponent(componentId: string, props: Partial<InputComponent>): void;
    updateSelectComponent(componentId: string, props: Partial<SelectComponent>): void;
    updateTextComponent(componentId: string, props: Partial<TextComponent>): void;
    updateGraphComponent(componentId: string, props: Partial<GraphComponent>): void;
    updateTableComponent(componentId: string, props: Partial<TableComponent>): void;
    getAllComponents() : void
    getComponentsOfCurrentFunction(): Component[];

    // Table Columns
    createNewColumn(tableId: string, newColumn: TableColumn): void;
    getColumnComponentById(tableId: string, columnId: string): TableColumn | null;
    updateBaseColumnProperties(tableId: string, columnId: string, props: Partial<Omit<TableColumn, ExcludeColumnPropsThatCannotBeEdited>>): void;
    updateInputColumnProperties(tableId: string, columnId: string, props: Partial<InputComponent>): void;
    updateSelectColumnProperties(tableId: string, columnId: string, props: Partial<SelectComponent>): void;
    removeTableColumn(tableId: string, columnId: string): void;
    reorderComponent(): void;
    
    // CurrentActiveElements
    setCurrentActiveFunction(fn: Function): void;
    setCurrentActiveComponent(comp: Component): void;
    setCurrentActiveColumn(col: TableColumn): void;
    getCurrentActiveFunction() : Function | null;
    getCurrentActiveComponent() : Component | null;
    getCurrentActiveColumn() : TableColumn | null;
};

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
        functionIds : [],
        components: [],
        componentIds: [],
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
        // Set metadata
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

        // Set stores data
        worksheet.functions = worksheetData.stores.functions;
        worksheet.components = worksheetData.stores.components;
        worksheet.functionIds = worksheetData.stores.functionIds;
        worksheet.componentIds = worksheetData.stores.componentIds;
        worksheet.expressions = worksheetData.stores.expression;
        worksheet.data = worksheetData.stores.data;
        worksheet.referenceWorksheets = worksheetData.stores.referenceWorksheets;
        worksheet.referenceInstruments = worksheetData.stores.refereneInstruments;

        // Set dependents
        worksheet.valueDependents = worksheetData.stores.dependents.value;
        worksheet.disableDependents = worksheetData.stores.dependents.disable;
        worksheet.certificateVisibilityDependents = worksheetData.stores.dependents.certificateVisibility;
        worksheet.validationDependents = worksheetData.stores.dependents.validation;
        worksheet.tableRowDependents = worksheetData.stores.dependents.tableRow;
        worksheet.repeatDependents = worksheetData.stores.dependents.repeat;
    } else {
        
    }

    return {
        
        getWorksheet(){
            return worksheet;
        },

        //Utils
        generateUniqueId(label : string , type : "function" | "component" , options? : UniqueIdGeneratorOptions) : string{

            const DEFAULT_OPTIONS : Required<UniqueIdGeneratorOptions> = {
                maxLength : 50,
                reservedKeywords : new Set([
                    'sum' , 'avg' , 'count' , 'min' , 'max' , 'if' , 'then' , 'else'
                ])
            }

            var {maxLength  , reservedKeywords} = {
                ...DEFAULT_OPTIONS,
                ...options
            }

            if(!label.trim()){
                let counter : number = 0;
                let newId : string = ''
                if(type === "component"){
                    counter = worksheet.components.length + 1;
                    newId = `${type}_${counter}`;

                    while(this.checkIfComponentIdExists(newId)){
                        counter++;
                        newId = `${type}_${counter}`;
                    }
                }else if(type === 'function'){
                    counter = worksheet.functions.length + 1;
                    newId = `${type}_${counter}`;

                    while(this.checkIfFunctionIdExists(newId)){
                        counter++;
                        newId = `${type}_${counter}`;
                    }
                }
                
                return newId;
            }

            let sanitizedId : string = label
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '')    
                .replace(/_+/g, '_');  

            if(sanitizedId.length > maxLength){
                sanitizedId = sanitizedId
                    .slice(0 , maxLength)
                    .replace(/_+$/g , '');
            }

            if(reservedKeywords.has(sanitizedId)){
                sanitizedId = `${type}_${sanitizedId}`;
            }

            let finalId = sanitizedId;
            let counter = 2;

            if(type === "component"){ // Fixed: changed = to ===
                while(this.checkIfComponentIdExists(finalId)){
                    finalId = `${sanitizedId}_${counter++}`;
                }
            }else if(type === "function"){ // Fixed: changed = to ===
                while(this.checkIfFunctionIdExists(finalId)){
                    finalId = `${sanitizedId}_${counter++}`;
                }
            }

            return finalId;
        },

        //Functions
        addNewFunction(){
            const functionId = this.generateUniqueId(`Function ${worksheet.functions.length + 1}` , "function")

            let fn : Function = {
                functionName: `Function ${worksheet.functions.length + 1}`,
                functionId: functionId,
                order: worksheet.functions.length,
                worksheetId: worksheet.metadata.worksheetId,
            }
            worksheet.functions.push(fn);
            worksheet.functionIds.push(functionId);

            worksheet.currentActiveElements.function = fn;
            worksheet.currentActiveElements.column = null;
            worksheet.currentActiveElements.component = null;
            
        },

        removeFunction(functionId : string){
            const idx = worksheet.functions.findIndex((f) => f.functionId === functionId);
            if (idx >= 0) worksheet.functions.splice(idx, 1);
        
            if (worksheet.currentActiveElements.function?.functionId === functionId) {
                worksheet.currentActiveElements.function = null;
            }

            //Here we need to remove the component id 
            //We also need to remove the components before rendering a UI confirmation
        },

        updateFunctionName(functionId : string , newFunctionName : string){
            const fn = worksheet.functions.find((fn) => fn.functionId === functionId);
            if(fn){
                fn.functionName = newFunctionName;
            }
        },

        getAllFunctions(){
            return worksheet.functions
        },
        reorderFunction(){

        },

        getAllComponents() : Component[]{
            return worksheet.components
        },
        
        getComponentsOfCurrentFunction() : Component[]{
            if(worksheet.currentActiveElements.function){
                return worksheet.components.filter((com) => com.functionId === worksheet.currentActiveElements.function?.functionId);
            }else{
                return [];
            }
        },

        //ComponentIds
        addNewComponentId(id : string){
            worksheet.componentIds.push(id)
        },

        checkIfComponentIdExists(id : string) : boolean{
            return worksheet.componentIds.includes(id)
        },

        removeComponentId(componentId : string){
            // Fixed: assign the filtered result or use splice
            worksheet.componentIds = worksheet.componentIds.filter(id => id !== componentId);
        },

        //FunctionIds
        addNewFunctionId(id : string){
            worksheet.functionIds.push(id)
        },

        checkIfFunctionIdExists(id : string) : boolean{
            return worksheet.functionIds.includes(id)
        },

        removeFunctionId(functionId : string){
            // Fixed: assign the filtered result or use splice
            worksheet.functionIds = worksheet.functionIds.filter(id => id !== functionId);
        },

        //Components
        addNewComponent(comp : Component){
            if(!worksheet.currentActiveElements.function?.functionId){
                console.log("Component cannot be created since there is no active function ID")
                return;
            }
            comp.functionId = worksheet.currentActiveElements.function?.functionId;
            const componentId = this.generateUniqueId(comp.label , "component");
            this.addNewComponentId(componentId);
            comp.componentId = componentId;
            worksheet.components.push(comp);
            this.setCurrentActiveComponent(comp);
        },

        getComponentById(componentId : string) : Component | null {
            const component = worksheet.components.find((c) => c.componentId === componentId);
        
            if(!component){
                return null
            }else{
                return component
            }
        },

        updateBaseComponentProperties(componentId : string , props: Partial<Omit<Component , ExcludeComponentPropsThatCannotBeEdited>>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error('Component not found while updating properties' + " " + JSON.stringify(component));
            Object.assign(component , props);
            this.setCurrentActiveComponent(component);
        },

        removeComponent(componentId : string){
            const idx = worksheet.components.findIndex((comp) => comp.componentId === componentId);
            if(idx < 0) throw new Error("Component not found while trying to delete" + " " + JSON.stringify(componentId)); // Fixed: changed <= to <
            worksheet.components.splice(idx , 1);
            this.removeComponentId(componentId);
            worksheet.currentActiveElements.component = null;
            //If this is a table component , we need to remove the columns and columnIds also
        },

        updateInputComponent(componentId : string, props : Partial<InputComponent>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error("Input component not found while updating" + " " + componentId);
            if(component.componentType !== "Input") throw new Error("Component is not an input component" + " " + JSON.stringify(component));

            if (!component.inputComponent) {
                component.inputComponent = { type: "Text", roundingDigits: 0 };
            }
            
            component.inputComponent = {
                ...component.inputComponent,
                ...props
            };

            this.setCurrentActiveComponent(component);
        },

        updateSelectComponent(componentId : string , props : Partial<SelectComponent>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error("Component not found while updating select component" + " " + componentId);
            if(component.componentType !== "Select") throw new Error("Found different component while updating select component" + " " +JSON.stringify(component))
            
            if(!component.selectComponent){
                component.selectComponent = {
                    type : "Yes or No",
                    values : []
                }
            }

            component.selectComponent = {
                ...component.selectComponent,
                ...props
            }
            
            this.setCurrentActiveComponent(component);

        },

        updateTextComponent(componentId : string , props : Partial<TextComponent>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error("Component not found while trying to update text");
            if(component.componentType !== "Text") throw new Error("Mismatch in component while trying to update text")

            if(!component.textComponent){
                component.textComponent = {
                    type : "Paragraph",
                    heading : "Text"
                }
            }

            component.textComponent = {
                ...component.textComponent,
                ...props
            }

            this.setCurrentActiveComponent(component);
        },

        updateGraphComponent(componentId : string , props : Partial<GraphComponent>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error("Component not found while trying to update graph");
            if(component.componentType !== "Graph") throw new Error("Mismatch in component while trying to update graph")

            if(!component.graphComponent){
                component.graphComponent = {
                    //Here we need to add the properties of graph
                }
            }
            
            component.graphComponent = {
                ...component.graphComponent,
                ...props
            }
            this.setCurrentActiveComponent(component);
        },

        updateTableComponent(componentId : string , props : Partial<TableComponent>){
            const component = this.getComponentById(componentId);
            if(!component) throw new Error("Component not found while trying to update table");
            if(component.componentType !== "Table") throw new Error("Mismatch in component while trying to update Table")

            if(!component.tableComponent) {
                component.tableComponent = {
                    tableName : "Test Table",
                    showTableNameInWorksheet : false,
                    isTableRowExpressionEnabled : false,
                    tableRowExpression : "",
                    columns : [],
                }
            }

            component.tableComponent = {
                ...component.tableComponent,
                ...props
            }

            this.setCurrentActiveComponent(component);
        },

        createNewColumn(tableId : string , newColumn : TableColumn){
            const tableComponent = this.getComponentById(tableId);
            if(!tableComponent) throw new Error("Table not found while creating column");

            if(tableComponent.tableComponent?.columns){
                tableComponent.tableComponent.columns.push(newColumn);
            }else{
                tableComponent.tableComponent = {
                    tableName: tableComponent.tableComponent?.tableName ?? '',
                    showTableNameInWorksheet: tableComponent.tableComponent?.showTableNameInWorksheet ?? false,
                    isTableRowExpressionEnabled:tableComponent.tableComponent?.isTableRowExpressionEnabled ?? false,
                    tableRowExpression: tableComponent.tableComponent?.tableRowExpression ?? '',
                    columns: [newColumn]
                };
            }

            this.setCurrentActiveColumn(newColumn);
        },

        getColumnComponentById(tableId : string , columnId : string) : null | TableColumn {
            const table = worksheet.components.find((c) => c.componentId === tableId);

            if(!table){
                return null;
            }else{
                const column = table.tableComponent?.columns.find((col) => col.columnId === columnId);
                if(!column){
                    return null;
                }else{
                    return column;
                }
            }

        },
        updateBaseColumnProperties(tableId : string , columnId : string , props : Partial<Omit<TableColumn , ExcludeColumnPropsThatCannotBeEdited>>){
            const column = this.getColumnComponentById(tableId , columnId);
            if(!column) throw new Error("Column or table not found while updating base col properties" + " " + "Table & Column" + tableId + " " + columnId)
            
            Object.assign(column , props);
        },

        updateInputColumnProperties(tableId : string , columnId : string , props : Partial<InputComponent>){
            const column = this.getColumnComponentById(tableId , columnId);
            if(!column) throw new Error("Column or table not found while updating input col properties" + " " + "Table & Column" + tableId + " " + columnId)
            
            if(column.columnType !== "Input") throw new Error("Column is not an input column" + tableId + columnId);

            if(!column.inputComponent){
                column.inputComponent = {
                    type : "Number",
                    roundingDigits : 2
                }
            }

            column.inputComponent = {
                ...column.inputComponent,
                ...props
            }
        },

        updateSelectColumnProperties(tableId : string , columnId : string , props : Partial<SelectComponent>){
            const column = this.getColumnComponentById(tableId , columnId);
            if(!column) throw new Error("Column or table not found while updating select col properties" + " " + "Table & Column" + tableId + " " + columnId)
            
            if(column.columnType !== "Select") throw new Error("Column is not an select column" + tableId + columnId);

            if(!column.selectComponent){
                column.selectComponent = {
                    type :"Yes or No",
                    values : []
                }
            }

            column.selectComponent = {
                ...column.selectComponent,
                ...props
            }
        },

        removeTableColumn(tableId : string, columnId : string){
            const tableComponent = this.getComponentById(tableId);
            if(!tableComponent) throw new Error("Table not found while trying to remove column" + tableId + " " + columnId);

            if(tableComponent.componentType !== "Table") throw new Error("Component is not table while trying to remove column" + tableId);

            if(!tableComponent.tableComponent?.columns) throw new Error("Table has no columns" + tableId);

            const colIdx = tableComponent.tableComponent?.columns.findIndex((c) => c.columnId === columnId);
            if(colIdx === -1) throw new Error('Column not found' + columnId);

            tableComponent.tableComponent?.columns.splice(colIdx , 1);
        },
        reorderComponent(){

        },

        //CurrentActiveElements
        setCurrentActiveFunction(fn : Function){
            worksheet.currentActiveElements.column = null;
            worksheet.currentActiveElements.component = null;
            worksheet.currentActiveElements.function = fn;
        },

        setCurrentActiveComponent(comp : Component){
            worksheet.currentActiveElements.component = comp;
        },

        setCurrentActiveColumn(col : TableColumn){
            worksheet.currentActiveElements.column = col;
        },

        getCurrentActiveFunction() : Function | null {
            return worksheet.currentActiveElements.function || null
        },

        getCurrentActiveColumn() : TableColumn | null {
            return worksheet.currentActiveElements.column || null
        },

        getCurrentActiveComponent() : Component | null {
            return worksheet.currentActiveElements.component || null
        },
    }
}