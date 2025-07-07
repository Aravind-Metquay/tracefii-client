import { SvelteSet } from 'svelte/reactivity';


export let componentIdStore = $state(new SvelteSet<string>());

/**
 * Add an ID to the global set.
 */
export function addComponentId(id: string): void {
  componentIdStore.add(id);
}

/**
 * Remove an ID from the global set.
 */
export function removeComponentId(id: string): void {
  componentIdStore.delete(id);
}

/**
 * Check whether an ID is in the set.
 */
export function checkIdExists(id: string): boolean {
  return componentIdStore.has(id);
}
