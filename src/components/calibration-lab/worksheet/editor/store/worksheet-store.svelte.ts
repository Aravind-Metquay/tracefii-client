import type { Component, CurrentActiveElement, DataStore, DependentStore, ExpressionStore, ReferenceInstrumentDataStore, ReferenceWorksheetStore , Function as FnType } from "@/Types";
import { componentStore } from "./component-store.svelte";
import { functionStore } from "./function-store.svelte";
import { componentIdStore } from "./componentId-store.svelte";
import { certificateVisibilityDependentStore, disableDependentStore, expressionStore, repeatDependentStore, tableRowDependentStore, validationDependentStore, valueDependentStore } from "./expression-store.svelte";
import { dataStore } from "./data-store.svelte";
import { currentActiveStore } from "./currentActiveElements-store.svelte";
import { referenceInstrumentData, referenceWorksheetStore } from "./referenceWorksheet-store.svelte";

export interface WorksheetStore {
  components: Component[];
  functions: FnType[];
  componentIds: Set<string>;
  expressions: ExpressionStore;
  valueDependents: DependentStore;
  disableDependents: DependentStore;
  certificateVisibilityDependents: DependentStore;
  validationDependents: DependentStore;
  tableRowDependents: DependentStore;
  repeatDependents: DependentStore;
  data: DataStore;
  currentActiveElements: CurrentActiveElement;
  referenceWorksheetStore: ReferenceWorksheetStore;
  referenceInstrumentData: ReferenceInstrumentDataStore;
}

// Combine all individual stores into a single reactive state
export let worksheetStore = $state<WorksheetStore>({
  components: componentStore,
  functions: functionStore,
  componentIds: componentIdStore,
  expressions: expressionStore,
  valueDependents: valueDependentStore,
  disableDependents: disableDependentStore,
  certificateVisibilityDependents: certificateVisibilityDependentStore,
  validationDependents: validationDependentStore,
  tableRowDependents: tableRowDependentStore,
  repeatDependents: repeatDependentStore,
  data: dataStore,
  currentActiveElements: currentActiveStore,
  referenceWorksheetStore: referenceWorksheetStore,
  referenceInstrumentData: referenceInstrumentData
});
