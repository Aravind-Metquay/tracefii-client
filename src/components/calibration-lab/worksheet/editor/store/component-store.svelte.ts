import type {
  Component,
  GraphComponent,
  InputComponent,
  SelectComponent,
  TableColumn,
  TableComponent,
  TextComponent
} from '@/Types';
import { currentActiveStore } from './currentActiveElements-store.svelte';

export let componentStore = $state<Component[]>([]);

/**
 * Push a new component onto the store.
 */
export function addComponent(c: Component): void {
  componentStore.push(c);
}

/**
 * Add a column to a Table component (or init its tableComponent if missing).
 */
export function addColumn(tableId: string, col: TableColumn): void {
  const component = componentStore.find((c) => c.componentId === tableId);
  if (!component) throw new Error('Table not found for adding column');

  if (component.tableComponent?.columns) {
    component.tableComponent.columns.push(col);
  } else {
    component.tableComponent = {
      tableName: component.tableComponent?.tableName ?? '',
      showTableNameInWorksheet:
        component.tableComponent?.showTableNameInWorksheet ?? false,
      isTableRowExpressionEnabled:
        component.tableComponent?.isTableRowExpressionEnabled ?? false,
      tableRowExpression: component.tableComponent?.tableRowExpression ?? '',
      columns: [col]
    };
  }
}

/**
 * Update the base props of any component.
 */
export function updateComponentProperties(
  componentId: string,
  properties: Partial<Omit<
    Component,
    | 'componentType'
    | 'componentId'
    | 'functionId'
    | 'inputComponent'
    | 'selectComponent'
    | 'tableComponent'
    | 'textComponent'
    | 'graphComponent'
  >>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  Object.assign(component, properties);
}

/**
 * Update or initialize the InputConfig on an “Input” component.
 */
export function updateInputComponent(
  componentId: string,
  props: Partial<InputComponent>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  if (component.componentType !== 'Input')
    throw new Error('Component is not an input component');

  component.inputComponent = {
    type: 'Text',
    roundingDigits: 0,
    ...(component.inputComponent ?? {}),
    ...props
  };
}

/**
 * Update or initialize the SelectConfig on a “Select” component.
 */
export function updateSelectComponent(
  componentId: string,
  props: Partial<SelectComponent>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  if (component.componentType !== 'Select')
    throw new Error('Component is not a select component');

  component.selectComponent = {
    type: 'Custom',
    values: [],
    ...(component.selectComponent ?? {}),
    ...props
  };
}

/**
 * Update or initialize the TextConfig on a “Text” component.
 */
export function updateTextComponent(
  componentId: string,
  props: Partial<TextComponent>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  if (component.componentType !== 'Text')
    throw new Error('Component is not a text component');

  component.textComponent = {
    type: 'Paragraph',
    ...(component.textComponent ?? {}),
    ...props
  };
}

/**
 * Update or initialize the GraphConfig on a “Graph” component.
 */
export function updateGraphComponent(
  componentId: string,
  props: Partial<GraphComponent>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  if (component.componentType !== 'Graph')
    throw new Error('Component is not a graph component');

  component.graphComponent = {
    ...(component.graphComponent ?? {}),
    ...props
  };
}

/**
 * Update or initialize the TableConfig (excluding columns) on a “Table” component.
 */
export function updateTableComponent(
  componentId: string,
  props: Partial<Omit<TableComponent, 'columns'>>
): void {
  const component = componentStore.find((c) => c.componentId === componentId);
  if (!component) throw new Error('Component not found');
  if (component.componentType !== 'Table')
    throw new Error('Component is not a table component');

  component.tableComponent = {
    tableName: '',
    showTableNameInWorksheet: false,
    isTableRowExpressionEnabled: false,
    tableRowExpression: '',
    columns: [],
    ...(component.tableComponent ?? {}),
    ...props
  };
}

/**
 * Update the base props of a single column in a Table component.
 */
export function updateColumnProperties(
  tableId: string,
  columnId: string,
  props: Partial<Omit<TableColumn, 'columnType' | 'columnId' | 'inputComponent' | 'selectComponent'>>
): void {
  const comp = componentStore.find((c) => c.componentId === tableId);
  if (!comp) throw new Error('Table not found');
  if (comp.componentType !== 'Table')
    throw new Error('Component is not a table');

  const col = comp.tableComponent?.columns.find((c) => c.columnId === columnId);
  if (!col) throw new Error('Column not found');
  Object.assign(col, props);
}

/**
 * Update or initialize the InputConfig on a specific column.
 */
export function updateColumnInputComponent(
  tableId: string,
  columnId: string,
  props: Partial<InputComponent>
): void {
  const comp = componentStore.find((c) => c.componentId === tableId);
  if (!comp) throw new Error('Table not found');
  if (comp.componentType !== 'Table')
    throw new Error('Component is not a table');

  const col = comp.tableComponent?.columns.find((c) => c.columnId === columnId);
  if (!col) throw new Error('Column not found');
  if (col.columnType !== 'Input')
    throw new Error('Column is not an input column');

  col.inputComponent = {
    type: 'Text',
    roundingDigits: 0,
    ...(col.inputComponent ?? {}),
    ...props
  };
}

/**
 * Update or initialize the SelectConfig on a specific column.
 */
export function updateColumnSelectComponent(
  tableId: string,
  columnId: string,
  props: Partial<SelectComponent>
): void {
  const comp = componentStore.find((c) => c.componentId === tableId);
  if (!comp) throw new Error('Table not found');
  if (comp.componentType !== 'Table')
    throw new Error('Component is not a table');

  const col = comp.tableComponent?.columns.find((c) => c.columnId === columnId);
  if (!col) throw new Error('Column not found');
  if (col.columnType !== 'Select')
    throw new Error('Column is not a select column');

  col.selectComponent = {
    type: 'Custom',
    values: [],
    ...(col.selectComponent ?? {}),
    ...props
  };
}

/**
 * Remove a component entirely (and clear it from currentActiveStore).
 */
export function removeComponent(componentId: string): void {
  const idx = componentStore.findIndex((c) => c.componentId === componentId);
  if (idx === -1) throw new Error('Component not found');
  componentStore.splice(idx, 1);
  currentActiveStore.component = null;
}

/**
 * Remove one column from a Table component.
 */
export function removeColumn(tableId: string, columnId: string): void {
  const comp = componentStore.find((c) => c.componentId === tableId);
  if (!comp) throw new Error('Table not found');
  if (comp.componentType !== 'Table')
    throw new Error('Component is not a table');
  if (!comp.tableComponent?.columns) throw new Error('Table has no columns');

  const colIdx = comp.tableComponent.columns.findIndex((c) => c.columnId === columnId);
  if (colIdx === -1) throw new Error('Column not found');
  comp.tableComponent.columns.splice(colIdx, 1);
}
