import { componentIdStore } from "../store/componentId-store.svelte";

interface GeneratorOptions {
  maxLength?: number;
  prefix?: string;
  reservedWords?: Set<string>;
}

const DEFAULT_OPTIONS: Required<GeneratorOptions> = {
  maxLength: 50,
  prefix: 'component',
  reservedWords: new Set([
    'sum', 'avg', 'count', 'min', 'max', 'if', 'then', 'else'
  ])
};

export function generateComponentId(
  label = '',
  options: GeneratorOptions = {}
): string {
  const { maxLength, prefix, reservedWords } = {
    ...DEFAULT_OPTIONS,
    ...options
  };

  // 1) No label → use a counter
  if (!label.trim()) {
    let counter = componentIdStore.size + 1;
    let newId = `${prefix}_${counter}`;
    while (componentIdStore.has(newId)) {
      counter++;
      newId = `${prefix}_${counter}`;
    }
    return newId;
  }

  // 2) Sanitize
  let sanitizedId = label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '_')    // non-alphanum → _
    .replace(/^_+|_+$/g, '')        // no leading/trailing _
    .replace(/_+/g, '_');           // collapse repeats

  // 3) Truncate
  if (sanitizedId.length > maxLength) {
    sanitizedId = sanitizedId
      .slice(0, maxLength)
      .replace(/_+$/g, '');
  }

  // 4) Reserved word?
  if (reservedWords.has(sanitizedId)) {
    sanitizedId = `${prefix}_${sanitizedId}`;
  }

  // 5) De-duplicate
  let finalId = sanitizedId;
  let counter = 2;
  while (componentIdStore.has(finalId)) {
    finalId = `${sanitizedId}_${counter++}`;
  }

  return finalId;
}
