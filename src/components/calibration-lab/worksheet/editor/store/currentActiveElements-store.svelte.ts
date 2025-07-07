import type { Component, CurrentActiveElement, Function, TableColumn } from '@/Types';


export let currentActiveStore = $state<CurrentActiveElement>({
  function: null,
  component: null,
  column: null
});

/**
 * Set the currently active function (or clear it).
 */
export function setCurrentActiveFunction(fn: Function | null): void {
  currentActiveStore.function = fn;
}

/**
 * Set the currently active component (or clear it).
 */
export function setCurrentActiveComponent(component: Component | null): void {
  currentActiveStore.component = component;
}

/**
 * Set the currently active table column (or clear it).
 */
export function setCurrentActiveColumn(column: TableColumn | null): void {
  currentActiveStore.column = column;
}
