import type {
  Component,
  Function as FnType,
  ReferenceInstrumentDataStore,
  ReferenceWorksheetStore,
  WorksheetType,
  DataStore
} from '@/Types';

// Reactive store for worksheet references
export let referenceWorksheetStore = $state<ReferenceWorksheetStore>({});

/**
 * Add or overwrite a reference to a worksheet's components/functions
 */
export function addReferenceWorksheet(
  path: string,
  worksheet: WorksheetType
): void {
  if (referenceWorksheetStore[path]) {
    console.warn(
      `Worksheet reference at path '${path}' already exists — overwriting.`
    );
  }
  referenceWorksheetStore[path] = {
    components: worksheet.stores.components,
    functions: worksheet.stores.functions
  };
}

/**
 * Remove a worksheet reference by path
 */
export function removeReferenceWorksheet(path: string): void {
  if (!(path in referenceWorksheetStore)) {
    console.warn(
      `No worksheet reference found at path '${path}'.`
    );
    return;
  }
  delete referenceWorksheetStore[path];
}

/**
 * Retrieve a stored worksheet reference
 */
export function getReferenceWorksheet(
  path: string
): { components: Component[]; functions: FnType[] } | undefined {
  return referenceWorksheetStore[path];
}

// Reactive store for instrument data references
export let referenceInstrumentData = $state<ReferenceInstrumentDataStore>({});

/**
 * Add or overwrite reference instrument data
 */
export function addReferenceInstrumentData(
  path: string,
  data: DataStore
): void {
  if (referenceInstrumentData[path]) {
    console.warn(
      `Instrument data reference at path '${path}' already exists — overwriting.`
    );
  }
  referenceInstrumentData[path] = data;
}

/**
 * Remove reference instrument data by path
 */
export function removeReferenceInstrumentData(path: string): void {
  if (!(path in referenceInstrumentData)) {
    console.warn(
      `No instrument data reference found at path '${path}'.`
    );
    return;
  }
  delete referenceInstrumentData[path];
}

/**
 * Retrieve stored instrument data reference
 */
export function getReferenceInstrumentData(
  path: string
): DataStore | undefined {
  const data = referenceInstrumentData[path];
  if (!data) {
    console.error(
      `Instrument data not found for path '${path}'.`
    );
  }
  return data;
}
