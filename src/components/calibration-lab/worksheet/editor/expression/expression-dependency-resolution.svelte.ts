import type { Component, ExpressionType, Function } from "@/Types";
import { evaluateExpression } from "./expression-evaluator.svelte";
import { functionStore } from "../store/function-store.svelte";
import { certificateVisibilityDependentStore, disableDependentStore, expressionStore, getDependents, getExpression, getPath, repeatDependentStore, tableRowDependentStore, updateExpression, validationDependentStore, valueDependentStore } from "../store/expression-store.svelte";
import { componentStore, updateColumnProperties, updateComponentProperties } from "../store/component-store.svelte";
import { dataStore, updateTableRows } from "../store/data-store.svelte";

type PropertyType = 'isDisabled' | 'showInCertificate' | 'isInvalid';


let updating = new Set<string>();

export const processDependencyUpdates = (
    functionId: string,
    componentId: string,
    columnId?: string,
    rowKey? : string
) => {
    const path = getPath(functionId, componentId, columnId);
    if (updating.has(path)) {
        return;
    }
    
    try {
        updating.add(path);
        
        // Process all types of dependencies
        const valueQueue = new Set<string>(); //For mutating the value 
        const disableQueue = new Set<string>(); //For mutating the isDisabled
        const certificateQueue = new Set<string>();//For mutating the showInCertificate
        const invalidQueue = new Set<string>();//For mutating the isInvalid
        const tableRowQueue = new Set<string>();//For mutating the table data
        const repeatQueue = new Set<string>();//For mutating the repeat column
        
        // Collect dependents for each type
        collectDependents(path, valueQueue, new Set<string>(), 'valueExpression');
        collectDependents(path, disableQueue, new Set<string>(), 'disableExpression');
        collectDependents(path, certificateQueue, new Set<string>(), 'certificateVisibleExpression');
        collectDependents(path, invalidQueue, new Set<string>(), 'validationExpression');
        collectDependents(path, tableRowQueue, new Set<string>(), 'tableRowExpression');
        collectDependents(path, repeatQueue, new Set<string>(), 'repeatExpression');
        
        // Process each queue
        processValueQueue(valueQueue , rowKey ? rowKey : undefined);
        processPropertyQueue(disableQueue, 'isDisabled');
        processPropertyQueue(certificateQueue, 'showInCertificate');
        processPropertyQueue(invalidQueue ,'isInvalid')
        processTableRowQueue(tableRowQueue)
        processRepeatColumnQueue(repeatQueue)
        processRepeatFunctionQueue(repeatQueue)
    } finally {
        updating.delete(path);
    }
};

const collectDependents = (
    path: string,
    updateQueue: Set<string>,
    visited: Set<string>,
    expressionType: ExpressionType
) => {
    if (visited.has(path)) {
        return;
    }
    visited.add(path);
    var [pathFunctionId , componentId , columnId] = path.split('.');
    const component = componentStore.find((c) => c.componentId === componentId)
    if(component?.componentType === "Table"){
        const col = component.tableComponent?.columns.find((c) => c.columnId === columnId)
        if(col && col.baseColumnId && col.baseColumnId.length > 0){
            columnId = col.baseColumnId
        }
    }
    const dependents = getDependents(pathFunctionId,expressionType, componentId , columnId);
    dependents.forEach(dep => {
        updateQueue.add(dep);
        collectDependents(dep, updateQueue, visited, expressionType);
    });
};

const processValueQueue = (updateQueue: Set<string> , rowKey?: string) => {
    const updates = Array.from(updateQueue);
    updates.forEach(path => {
        // Split path correctly
        
        const [functionId, componentId, columnId] = path.split('.');
        // Get expression with correct parameters
        const expression = getExpression(
            functionId,
            'valueExpression',
            componentId,
            columnId
        );
        if (!expression) return;
        try {
                if (columnId) {
                    // Update table cell
                    const tableData = dataStore[functionId]?.[componentId];
                    if (Array.isArray(tableData)) {
                        // If rowKey is provided, only update that specific row
                        if (rowKey) {
                            const row = tableData.find(r => r.key === rowKey);
                            if (row) {
                                // row[columnId] = evaluateTableCellExpression(expression, JSON.parse(JSON.stringify(row)));
                                row[columnId] = evaluateExpression(expression, JSON.parse(JSON.stringify(dataStore)) , Number(rowKey) - 1);
                            }
                        }
                    }
            } else {
                const newValue = evaluateExpression(expression , JSON.parse(JSON.stringify(dataStore)) , 0)
                if (!dataStore[functionId]) {
                    dataStore[functionId] = {};
                }
                dataStore[functionId][componentId] = newValue;
            }
        } catch (error) {
            console.error(`Error updating dependent ${path}:`, error);
        }
    });
};

const processPropertyQueue = (
    updateQueue: Set<string>,
    propertyType: PropertyType
) => {
    const updates = Array.from(updateQueue);
    var expressionType : ExpressionType;
    
    if(propertyType === 'isDisabled'){
        expressionType = 'disableExpression'
    }else if(propertyType === 'isInvalid'){
        expressionType = 'validationExpression'
    }else if(propertyType === 'showInCertificate'){
        expressionType = 'certificateVisibleExpression'
    }

    updates.forEach(path => {
        const [pathFunctionId , componentId , columnId] = path.split('.');        

        const expression = getExpression(
            pathFunctionId,
            expressionType,
            componentId,
            columnId
        );
        if (!expression) return;
        
        try {
            const result = evaluateExpression(expression , JSON.parse(JSON.stringify(dataStore)) , 0);
            const [functionId, componentId, columnId] = path.split('.');
            
            if (columnId) {
                const component = componentStore.find(c => 
                    c.componentId === componentId && c.functionId === functionId
                );
                if (component?.tableComponent) {
                    const column = component.tableComponent.columns.find(
                        col => col.columnId === columnId
                    );
                    if (column) {
                        updateColumnProperties(
                            column.tableId, 
                            column.columnId, 
                            {[propertyType] : !!result}
                        );
                    }
                }
            } else {
                updateComponentProperties(componentId, {[propertyType] : !!result});
            }
        } catch (error) {
            console.error(`Error updating ${propertyType} for ${path}:`, error);
        }
    });
};

const processTableRowQueue = (updateQueue: Set<string>) => {
    const updates = Array.from(updateQueue);

    updates.forEach(path => {
        const [pathFunctionId , componentId] = path.split('.');        

        const expression = getExpression(
            pathFunctionId,
            'tableRowExpression',
            componentId,
        );
        if (!expression) return;
        
        try {
            var result = evaluateExpression(expression , JSON.parse(JSON.stringify(dataStore)) , 0)
            const [functionId, componentId] = path.split('.');
            
            const table = componentStore.find((c) => c.componentId === componentId)
            if(table?.tableComponent?.columns.length && table?.tableComponent?.columns.length > 0){
                updateTableRows(functionId , componentId , table?.tableComponent?.columns , result)
            }
        } catch (error) {
            console.error(`Error updating table rows for ${path}:`, error);
        }
    });
}

const processRepeatColumnQueue = (updateQueue: Set<string>) => {
    const updates = Array.from(updateQueue);
    updates.forEach(path => {
        const [pathFunctionId, componentId, columnId] = path.split('.');        
        const expression = getExpression(
            pathFunctionId,
            'repeatExpression',
            componentId,
            columnId
        );
        if (!expression) return;
        try {
            const result = evaluateExpression(expression , JSON.parse(JSON.stringify(dataStore)) , 0)
            const table = componentStore.find((c) => c.componentId === componentId);
            if (table?.tableComponent) {
                const repeatColumn = table.tableComponent.columns.find((col) => col.columnId === columnId);
                if (repeatColumn) {
                    // Remove existing repeat columns
                    table.tableComponent.columns = table.tableComponent.columns.filter(col => 
                        // Keep columns that don't match our repeat pattern
                        !col.columnId.startsWith(`${repeatColumn.columnId}_repeat_`)
                    );
                    // Create new repeat columns
                    for (let i = 1; i <= result; i++) {
                        const newColumn = {...repeatColumn};
                        // Create unique columnId for the repeat
                        newColumn.columnId = `${repeatColumn.columnId}_repeat_${i}`;
                        newColumn.columnName = `${repeatColumn.columnName}${i}`;
                        // Don't carry over repeat properties to generated columns
                        newColumn.isRepeatColumn = false;
                        newColumn.repeatExpression = '';
                        newColumn.baseColumnId = repeatColumn.columnId
                        
                        table.tableComponent.columns.push(newColumn);
                    }
                }
            }
        } catch (error) {
            console.error(`Error updating repeat columns for ${path}:`, error);
        }
    });
};

const processRepeatFunctionQueue = (updateQueue: Set<string>) => {
    const updates = Array.from(updateQueue);
    
    updates.forEach(path => {
        const [pathFunctionId] = path.split('.');
        const expression = getExpression(pathFunctionId, 'repeatExpression');
        
        if (!expression) return;
        
        try {
            const repeatCount = evaluateExpression(expression , JSON.parse(JSON.stringify(dataStore)) , 0)
            const baseFunction = functionStore.find((fn) => fn.functionId === pathFunctionId);
            const baseComponents = componentStore.filter((c) => c.functionId === pathFunctionId);
            
            if (!baseFunction || !baseComponents.length) return;
            
            // Remove any existing repeated functions and components
            cleanupExistingRepeats(pathFunctionId);
            
            // Generate new repeated instances
            for (let i = 1; i <= repeatCount; i++) {
                const newFunctionId = `${pathFunctionId}_repeat_${i}`;
                
                // Create repeated function
                const repeatedFunction = createRepeatedFunction(baseFunction, newFunctionId, i);
                functionStore.push(repeatedFunction);
                
                // Create repeated components
                const repeatedComponents = createRepeatedComponents(baseComponents, newFunctionId, i);
                repeatedComponents.forEach(component => {
                    componentStore.push(component);
                });
                
                // Update expressions and dependencies
                updateExpressionsAndDependencies(
                    pathFunctionId,
                    newFunctionId,
                    baseComponents,
                    repeatedComponents,
                    i
                );
            }
            
        } catch (error) {
            console.error(`Error updating repeat functions for ${path}:`, error);
        }
    });
};

const cleanupExistingRepeats = (baseFunctionId: string) => {
    // Remove existing repeated functions by splicing the array
    for (let i = functionStore.length - 1; i >= 0; i--) {
        if (functionStore[i].functionId.startsWith(`${baseFunctionId}_repeat_`)) {
            functionStore.splice(i, 1);
        }
    }
    
    // Remove existing repeated components by splicing the array
    for (let i = componentStore.length - 1; i >= 0; i--) {
        if (componentStore[i].functionId.startsWith(`${baseFunctionId}_repeat_`)) {
            componentStore.splice(i, 1);
        }
    }
    
    // Clean up expressions and dependencies
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
        order: baseFunction.order + (repeatIndex * 0.1), // Maintain relative ordering
        isRepeat: false // Repeated instances aren't themselves repeatable
    };
};

const createRepeatedComponents = (
    baseComponents: Component[],
    newFunctionId: string,
    repeatIndex: number
): Component[] => {
    return baseComponents.map(baseComponent => ({
        ...baseComponent,
        functionId: newFunctionId,
        componentId: `${baseComponent.componentId}_${repeatIndex}`,
        // Update any component-specific properties that need to be unique
        label: `${baseComponent.label} ${repeatIndex}`
    }));
};

const updateExpressionsAndDependencies = (
    baseFunctionId: string,
    newFunctionId: string,
    baseComponents: Component[],
    repeatedComponents: Component[],
    repeatIndex: number
) => {
    // Update expression store
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
    // Update dependent store
    updateDependentStore(baseFunctionId, newFunctionId, repeatIndex);
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
    
    // Get all expression types for the component
    const expressionTypes: ExpressionType[] = [
        'valueExpression',
        'disableExpression',
        'certificateVisibleExpression',
        'validationExpression',
        'tableRowExpression',
        'repeatExpression'
    ];
    
    // Initialize the new path in expressionStore if it doesn't exist
    if (!expressionStore[newPath]) {
        expressionStore[newPath] = {};
    }
    
    expressionTypes.forEach(type => {
        // Use basePath to get the original expression
        const baseExpression = expressionStore[basePath]?.[type];
        if (baseExpression) {
            const newExpression = transformExpression(
                baseExpression,
                baseFunctionId,
                newFunctionId,
                repeatIndex
            );
            
            // Store the new expression using newPath
            expressionStore[newPath][type] = newExpression;
            
            // Update dependencies using updateExpression
            updateExpression(
                type,
                newExpression,
                newFunctionId,
                newComponentId
            );
        }
    });
};

const transformExpression = (
    expression: string,
    baseFunctionId: string,
    newFunctionId: string,
    repeatIndex: number
): string => {
    // Replace references to base function components
    let newExpression = expression.replace(
        new RegExp(`${baseFunctionId}\\.([\\w]+)`, 'g'),
        `${newFunctionId}.$1_${repeatIndex}`
    );
    
    // Add support for special repeat functions
    newExpression = newExpression
        .replace(/REPEAT_INDEX\(\)/g, String(repeatIndex))
        .replace(
            /BASE_VALUE\(['"](.*?)['"]\)/g,
            (_, path) => `GET('${path}')`
        )
        .replace(
            /PREV_REPEAT\(['"](.*?)['"]\)/g,
            (_, path) => {
                const prevIndex = repeatIndex - 1;
                if (prevIndex < 1) return 'null';
                return `GET('${path}_repeat_${prevIndex}')`;
            }
        );
    
    return newExpression;
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
        // Get all base dependencies with this type of expression
        Object.entries(expressionStore)
            .filter(([path, expressions]) => 
                path.startsWith(baseFunctionId) && 
                !path.includes('repeat') && 
                expressions[type]
            )
            .forEach(([basePath, expressions]) => {
                const [_, baseComponentId] = basePath.split('.');
                const baseExpression = expressions[type];

                if (baseExpression) {
                    // Transform the expression for the repeated component
                    const newExpression = transformExpression(
                        baseExpression,
                        baseFunctionId,
                        newFunctionId,
                        repeatIndex
                    );

                    // Use updateExpression to properly update both expression and dependencies
                    updateExpression(
                        type,
                        newExpression,
                        newFunctionId,
                        `${baseComponentId}_${repeatIndex}`
                    );
                }
            });
    });
};

const cleanupExpressionsAndDependencies = (baseFunctionId: string) => {
    // Clean up expression store
    Object.keys(expressionStore).forEach(path => {
        if (path.startsWith(`${baseFunctionId}_repeat_`)) {
            delete expressionStore[path];
        }
    });
    
    // Clean up all dependent stores
    const dependentStores = [
        valueDependentStore,
        disableDependentStore,
        certificateVisibilityDependentStore,
        validationDependentStore,
        tableRowDependentStore,
        repeatDependentStore
    ];

    dependentStores.forEach(store => {
        Object.keys(store).forEach(path => {
            if (path.startsWith(`${baseFunctionId}_repeat_`)) {
                delete store[path];
            }
            else {
                // Remove dependencies to repeated functions
                store[path] = store[path].filter(
                    dep => !dep.startsWith(`${baseFunctionId}_repeat_`)
                );
                
                // Clean up empty dependency arrays
                if (store[path].length === 0) {
                    delete store[path];
                }
            }
        });
    });
};
