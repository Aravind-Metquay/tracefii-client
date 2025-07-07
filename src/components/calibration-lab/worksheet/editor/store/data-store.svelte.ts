import type { DataStore, FunctionData, TableColumn, TableRow } from '@/Types';
// import { processDependencyUpdates } from './Expression/ExpressionDependencyResolution.svelte.ts';


export let dataStore = $state<DataStore>({});

// Helper type guard
function isTableData(data: any): data is TableRow[] {
  return Array.isArray(data);
}

// Remove a component value
export function removeComponentValue(
  functionId: string,
  componentId: string
): void {
  const fnData = dataStore[functionId];
  if (fnData && componentId in fnData) {
    delete fnData[componentId];
    if (Object.keys(fnData).length === 0) {
      delete dataStore[functionId];
    }
  } else {
    console.warn(`Component ID ${componentId} not found in function ${functionId}`);
  }
}

// Get raw component value
function getComponentValue(
  functionId: string,
  componentId: string
): any {
  const fnData = dataStore[functionId];
  if (fnData && componentId in fnData) {
    return fnData[componentId];
  }
  console.warn(`Component ID ${componentId} not found in function ${functionId}`);
  return null;
}

// Get value by path (e.g., "funcId.compId" or "funcId.tableId.columnId")
export function getValueByPath(path: string): any {
  const parts = path.split('.');
  if (parts.length === 2) {
    return getComponentValue(parts[0], parts[1]);
  } else if (parts.length === 3) {
    const [funcId, tableId, colId] = parts;
    const tableData = getComponentValue(funcId, tableId);
    if (isTableData(tableData)) {
      return tableData.map((row) => row[colId]);
    }
  }
  return null;
}

// Remove a table row by key
export function removeTableRow(
  functionId: string,
  tableId: string,
  rowKey: string
): void {
  const fnData = dataStore[functionId];
  if (!fnData || !isTableData(fnData[tableId])) {
    console.error(`Table ${tableId} not found in function ${functionId}`);
    return;
  }
  const rows = fnData[tableId];
  const idx = rows.findIndex((r) => r.key === rowKey);
  if (idx !== -1) rows.splice(idx, 1);
  else console.warn(`Row with key ${rowKey} not found in table ${tableId}`);
}

// Add a new table row with empty values
export function addTableRow(
  functionId: string,
  tableId: string,
  columns: TableColumn[]
): void {
  if (!dataStore[functionId]) dataStore[functionId] = {};
  const current = dataStore[functionId][tableId] as TableRow[] | undefined;
  const rows = isTableData(current) ? current : [];
  const nextKey = rows.length
    ? String(Math.max(...rows.map((r) => parseInt(r.key))) + 1)
    : '1';
  const newRow = columns.reduce(
    (acc, col) => ({ ...acc, [col.columnId]: '' }),
    { key: nextKey }
  );
  dataStore[functionId][tableId] = [...rows, newRow];
}

// Adjust row count to target
export function updateTableRows(
  functionId: string,
  tableId: string,
  columns: TableColumn[],
  targetRowCount: number
): void {
  if (!dataStore[functionId]) dataStore[functionId] = {};
  const current = dataStore[functionId][tableId] as TableRow[] | undefined;
  const rows = isTableData(current) ? current : [];
  const count = rows.length;
  if (targetRowCount === count) return;

  if (targetRowCount > count) {
    const newRows: TableRow[] = [];
    for (let i = 0; i < targetRowCount - count; i++) {
      const key = String(count + i + 1);
      const row = columns.reduce(
        (acc, col) => ({ ...acc, [col.columnId]: '' }),
        { key }
      );
      newRows.push(row);
    }
    dataStore[functionId][tableId] = [...rows, ...newRows];
  } else {
    dataStore[functionId][tableId] = rows.slice(0, targetRowCount);
  }
}

// Initialize an empty table
export function initializeTable(
  functionId: string,
  tableId: string
): void {
  if (!dataStore[functionId]) dataStore[functionId] = {};
  if (!dataStore[functionId][tableId]) dataStore[functionId][tableId] = [];
}

// Get all values for a function
export function getFunctionValues(
  functionId: string
): FunctionData | null {
  if (functionId in dataStore) return dataStore[functionId];
  console.warn(`Function ID ${functionId} not found in data store`);
  return null;
}

// Clear data for a function
export function clearFunctionData(functionId: string): void {
  if (functionId in dataStore) delete dataStore[functionId];
}

// Clear entire store
export function clearDataStore(): void {
  Object.keys(dataStore).forEach((fid) => delete dataStore[fid]);
}

// Set component value and propagate dependencies
export function setComponentValue(
  functionId: string,
  componentId: string,
  value: any
): void {
  if (!dataStore[functionId]) dataStore[functionId] = {};
  dataStore[functionId][componentId] = value;
//   processDependencyUpdates(functionId, componentId);
}

// Update a specific cell in a table row
export function updateTableCell(
  functionId: string,
  tableId: string,
  rowKey: string,
  columnId: string,
  value: any
): void {
  const fnData = dataStore[functionId];
  if (!fnData || !isTableData(fnData[tableId])) {
    console.error(`Table ${tableId} not found in function ${functionId}`);
    return;
  }
  const rows = fnData[tableId];
  const idx = rows.findIndex((r) => r.key === rowKey);
  if (idx !== -1) {
    rows[idx][columnId] = value;
    // processDependencyUpdates(functionId, tableId, columnId, rowKey);
  } else {
    console.warn(`Row with key ${rowKey} not found in table ${tableId}`);
  }
}
