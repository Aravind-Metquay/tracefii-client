import type { Function as FnType } from '@/Types';
import { generateComponentId } from '../utils/componentId-generator';
import {
  currentActiveStore,
  setCurrentActiveColumn,
  setCurrentActiveComponent
} from './currentActiveElements-store.svelte';

export let functionStore = $state<FnType[]>([]);

/**
 * Add a new function, auto-naming and ID’ing it,
 * and make it the current active function.
 */
export function addNewFunction(): void {
  const fn: FnType = {
    functionName: `Function ${functionStore.length + 1}`,
    functionId: generateComponentId(`Function ${functionStore.length + 1}`),
    order: functionStore.length,
    worksheetId: '1233',
    isRepeat: false,
    repeatExpression: ''
  };

  functionStore.push(fn);
  currentActiveStore.function = fn;
  setCurrentActiveComponent(null);
  setCurrentActiveColumn(null);
}

/**
 * Remove one by ID; if it was active, clear it.
 */
export function removeFunction(id: string): void {
  const idx = functionStore.findIndex((f) => f.functionId === id);
  if (idx >= 0) functionStore.splice(idx, 1);

  if (currentActiveStore.function?.functionId === id) {
    currentActiveStore.function = null;
  }
}

/**
 * Patch any subset of fields on an existing function.
 */
export function updateFunction(
  id: string,
  properties: Partial<FnType>
): void {
  const fn = functionStore.find((f) => f.functionId === id);
  if (fn) Object.assign(fn, properties);
}

/**
 * Rename only the functionName.
 */
export function updateFunctionName(name: string, id: string): void {
  const fn = functionStore.find((f) => f.functionId === id);
  if (fn) fn.functionName = name;
}

/**
 * Reorder functions by dragIndex → hoverIndex
 * and reassign their `.order` fields.
 */
export function reorderFunction(
  dragIndex: number,
  hoverIndex: number
): void {
  const [dragged] = functionStore.splice(dragIndex, 1);
  functionStore.splice(hoverIndex, 0, dragged);

  functionStore.forEach((f, i) => (f.order = i));
}
