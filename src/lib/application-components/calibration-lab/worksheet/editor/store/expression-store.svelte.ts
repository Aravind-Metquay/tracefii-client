import type { DependentStore, ExpressionStore, ExpressionType } from "@/Types";

// Reactive stores
export let expressionStore = $state<ExpressionStore>({});
export let valueDependentStore = $state<DependentStore>({});
export let disableDependentStore = $state<DependentStore>({});
export let certificateVisibilityDependentStore = $state<DependentStore>({});
export let validationDependentStore = $state<DependentStore>({});
export let tableRowDependentStore = $state<DependentStore>({});
export let repeatDependentStore = $state<DependentStore>({});

// Helper to select the correct dependent store
function getDependentStore(type: ExpressionType): DependentStore {
  switch (type) {
    case 'valueExpression':
      return valueDependentStore;
    case 'disableExpression':
      return disableDependentStore;
    case 'certificateVisibleExpression':
      return certificateVisibilityDependentStore;
    case 'validationExpression':
      return validationDependentStore;
    case 'tableRowExpression':
      return tableRowDependentStore;
    case 'repeatExpression':
      return repeatDependentStore;
    default:
      throw new Error(`Unknown expression type: ${type}`);
  }
}

// Construct the lookup path
export function getPath(
  functionId: string,
  componentId?: string,
  columnId?: string
): string {
  let path = functionId;
  if (componentId) path += `.${componentId}`;
  if (columnId) path += `.${columnId}`;
  return path;
}

// Extract unique dependency paths from an expression
export function extractDependencies(expression: string): string[] {
  const regex = /[A-Za-z]+_?\d*\.[A-Za-z_]\d*(?:\.[A-Za-z_]\d*)?/g;
  const matches = expression.match(regex) ?? [];
  return Array.from(new Set(matches));
}

// Update an expression and rebuild its dependency lists
export function updateExpression(
  type: ExpressionType,
  expression: string,
  functionId: string,
  componentId?: string,
  columnId?: string
): void {
  const path = getPath(functionId, componentId, columnId);
  const dependentStore = getDependentStore(type);

  // Ensure entry exists
  if (!expressionStore[path]) expressionStore[path] = {};
  expressionStore[path][type] = expression;

  // Clear old dependencies
  Object.keys(dependentStore).forEach((dep) => {
    const idx = dependentStore[dep].indexOf(path);
    if (idx > -1) {
      dependentStore[dep].splice(idx, 1);
      if (dependentStore[dep].length === 0) delete dependentStore[dep];
    }
  });

  // Add new dependencies
  const deps = extractDependencies(expression);
  deps.forEach((dep) => {
    if (!dependentStore[dep]) dependentStore[dep] = [];
    if (!dependentStore[dep].includes(path)) {
      dependentStore[dep].push(path);
    }
  });
}

// Remove an expression and its dependencies
export function removeExpression(
  functionId: string,
  type: ExpressionType,
  componentId?: string,
  columnId?: string
): void {
  const path = getPath(functionId, componentId, columnId);
  const dependentStore = getDependentStore(type);

  if (expressionStore[path]) {
    delete expressionStore[path][type];
    if (Object.keys(expressionStore[path]).length === 0) {
      delete expressionStore[path];
    }
  }

  Object.keys(dependentStore).forEach((dep) => {
    const idx = dependentStore[dep].indexOf(path);
    if (idx > -1) {
      dependentStore[dep].splice(idx, 1);
      if (dependentStore[dep].length === 0) delete dependentStore[dep];
    }
  });
}

// Get all dependent paths for a given expression path
export function getDependents(
  functionId: string,
  type: ExpressionType,
  componentId?: string,
  columnId?: string
): string[] {
  const path = getPath(functionId, componentId, columnId);
  const store = getDependentStore(type);
  return store[path] ?? [];
}

// Fetch the stored expression
export function getExpression(
  functionId: string,
  type: ExpressionType,
  componentId?: string,
  columnId?: string
): string | undefined {
  const path = getPath(functionId, componentId, columnId);
  return expressionStore[path]?.[type];
}
