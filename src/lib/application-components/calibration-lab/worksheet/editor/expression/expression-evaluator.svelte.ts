import type { DataStore, FunctionData, TableRow } from "@/Types";
import { referenceInstrumentData } from "../Store/referenceWorksheet-store.svelte";

// Custom function types
type FunctionHandler = (path: string) => number;

interface FunctionRegistry {
  [functionName: string]: FunctionHandler;
}

/**
 * Evaluates a mathematical expression with custom functions and conditional logic
 * @param {string} expression - The expression to evaluate
 * @param {DataStore} data - The data structure to use for evaluation
 * @param {number} rowIndex - The current row index being processed
 * @returns {any} - The result of the evaluated expression
 */
export function evaluateExpression(
  expression: string,
  data: DataStore,
  rowIndex: number
): any {
  // First, pre-process any property paths and replace them with their actual values
  const processedExpression = preprocessExpression(expression, data, rowIndex);
  try {
    // Evaluate the processed expression
    const result = eval(processedExpression);
    return result;
  } catch (error: any) {
    console.error(
      `Error evaluating expression "${expression}": ${error.message}`
    );
    return null;
  }
}

/**
 * Preprocesses an expression to replace functions and property paths with their values
 */
function preprocessExpression(
  expression: string,
  data: DataStore,
  rowIndex: number
): string {
  let result = expression;

  // Function registry
  const functions: FunctionRegistry = {
    RepeatMax: (path: string): number => {
      const pathParts = path.split(".");
      if (pathParts.length !== 3) {
        throw new Error(`Invalid path format: ${path}`);
      }

      const [func, comp, field] = pathParts;

      if (
        !(func in data) ||
        !(comp in data[func]) ||
        !Array.isArray(data[func][comp])
      ) {
        throw new Error(`Invalid data path: ${path}`);
      }

      const targetRow = data[func][comp][rowIndex] as TableRow;
      if (!targetRow) {
        throw new Error(`Row index out of bounds: ${rowIndex}`);
      }

      const repeatValues = Object.entries(targetRow)
        .filter(([key]) => key.startsWith(field + "_repeat_"))
        .map(([, value]) => Number(value)) // Convert to number
        .filter((value) => !isNaN(value)); // Filter valid numbers

      return repeatValues.length > 0 ? Math.max(...repeatValues) : 0;
    },

    RowMax: (path: string): number => {
      const pathParts = path.split(".");
      if (pathParts.length !== 3) {
        throw new Error(`Invalid path format: ${path}`);
      }

      const [func, comp, field] = pathParts;

      if (
        !(func in data) ||
        !(comp in data[func]) ||
        !Array.isArray(data[func][comp])
      ) {
        throw new Error(`Invalid data path: ${path}`);
      }

      // Extract field values across all rows
      const tableRows = data[func][comp] as TableRow[];
      const fieldValues = tableRows
        .map((rowData) => {
          const value = rowData[field];
          return typeof value === "number"
            ? value
            : typeof value === "string"
            ? Number(value)
            : NaN;
        })
        .filter((value) => !isNaN(value));
      return fieldValues.length > 0 ? Math.max(...fieldValues) : 0;
    },

    RowAverage: (path: string): number => {
      const pathParts = path.split(".");
      if (pathParts.length !== 3) {
        throw new Error(`Invalid path format: ${path}`);
      }

      const [func, comp, field] = pathParts;

      if (
        !(func in data) ||
        !(comp in data[func]) ||
        !Array.isArray(data[func][comp])
      ) {
        throw new Error(`Invalid data path: ${path}`);
      }

      // Extract field values across all rows
      const tableRows = data[func][comp] as TableRow[];
      const fieldValues = tableRows
        .map((rowData) => {
          const value = rowData[field];
          return typeof value === "number"
            ? value
            : typeof value === "string"
            ? Number(value)
            : NaN;
        })
        .filter((value) => !isNaN(value));

      if (fieldValues.length === 0) return 0;
      const sum = fieldValues.reduce((acc, val) => acc + val, 0);
      return sum / fieldValues.length;
    },

    RowSum: (path: string): number => {
      const pathParts = path.split(".");
      if (pathParts.length !== 3) {
        throw new Error(`Invalid path format: ${path}`);
      }

      const [func, comp, field] = pathParts;

      if (
        !(func in data) ||
        !(comp in data[func]) ||
        !Array.isArray(data[func][comp])
      ) {
        throw new Error(`Invalid data path: ${path}`);
      }

      // Extract field values across all rows
      const tableRows = data[func][comp] as TableRow[];
      const fieldValues = tableRows
        .map((rowData) => {
          const value = rowData[field];
          return typeof value === "number"
            ? value
            : typeof value === "string"
            ? Number(value)
            : NaN;
        })
        .filter((value) => !isNaN(value));

      return fieldValues.reduce((acc, val) => acc + val, 0);
    },

    CFNLookup: (paths): number => {
      const args = paths.split(",");
      const lv = args[0].trim();
      const lcn = args[1].trim();
      const vcn = args[2].trim();

      // Extract the reference worksheet identifier
      const lcnParts = lcn.split(".");
      const vcnParts = vcn.split(".");

      if (lcnParts.length < 2 || vcnParts.length < 2) {
        throw new Error(
          "LCN and VCN must have at least two hierarchical levels"
        );
      }

      const lcnRefId = `${lcnParts[0]}.${lcnParts[1]}`;
      const vcnRefId = `${vcnParts[0]}.${vcnParts[1]}`;

      // Ensure both paths point to the same reference data
      if (lcnRefId !== vcnRefId) {
        throw new Error("LCN and VCN must point to the same reference data");
      }

      // Get the reference data object
      const refData = JSON.parse(JSON.stringify(referenceInstrumentData))[
        lcnRefId
      ];
      if (!refData) {
        throw new Error(`Reference data not found for ${lcnRefId}`);
      }

      // Get the LV value from instrument data
      const fn = lv.split(".")[0];
      const comp = lv.split(".")[1];
      const col = lv.split(".")[2];
      const lvValue = data[fn][comp][rowIndex][col];

      if (lvValue === undefined) {
        throw new Error(`Value not found for LV path: ${lv}`);
      }

      // Extract remaining paths
      const lcnRemainingPath = lcnParts.slice(2).join(".");
      const vcnRemainingPath = vcnParts.slice(2).join(".");

      // Navigate to the reference table
      const functionName = lcnRemainingPath.split(".")[0];
      const tableName = lcnRemainingPath.split(".")[1];
      const tableData = refData[functionName][tableName];

      if (!Array.isArray(tableData)) {
        throw new Error(
          `Expected an array for table at path: ${lcnRemainingPath}`
        );
      }

      // Get field names for lookup and return
      const lcnField = lcnRemainingPath.split(".").pop()!;
      const vcnField = vcnRemainingPath.split(".").pop()!;

      // Find a matching row in the table
      let result;
      for (const row of tableData) {
        // For ranges, check if value falls within range
        if (row.from_range !== undefined && row.to_range !== undefined) {
          const fromRange = parseFloat(row.from_range);
          const toRange = parseFloat(row.to_range);

          if (lvValue >= fromRange && lvValue < toRange) {
            result = row[vcnField];
            break;
          }
        }
        // For exact matches
        else if (row[lcnField] == lvValue) {
          result = row[vcnField];
          break;
        }
      }

      // Return the result or 0 if no match found
      return result !== undefined ? result : 0;
    },
  };

  // Step 1: Process IF statements with special handling for nested IFs
  const transformIfs = (expr: string): string => {
    // First handle nested IF patterns
    let processed = expr.replace(
      /IF\s*\(\s*([^,]+),\s*IF\s*\(\s*([^,]+),\s*([^,]+),\s*([^,]+)\s*\),\s*([^)]+)\s*\)/g,
      "($1) ? (($2) ? ($3) : ($4)) : ($5)"
    );

    // Then handle any remaining regular IFs
    processed = processed.replace(
      /IF\s*\(\s*([^,]+),\s*([^,]+),\s*([^)]+)\s*\)/g,
      "($1) ? ($2) : ($3)"
    );

    return processed;
  };

  // Process all IF statements (including nested ones)
  let previousResult = "";
  while (previousResult !== result) {
    previousResult = result;
    result = transformIfs(result);
  }

  // Step 2: Process function calls
  result = result.replace(
    /(\w+)\s*\(\s*([^)]+)\s*\)/g,
    (match, funcName, args) => {
      if (funcName in functions) {
        try {
          const value = functions[funcName](args.trim());
          return String(value);
        } catch (error: any) {
          console.error(`Error in function ${funcName}:`, error.message);
          throw error; // Re-throw to stop the evaluation
        }
      }
      return match; // Leave unknown functions as is
    }
  );

  // Step 3: Process property paths
  // Handle direct object property references (e.g., function1.component_1 or function1.pressure_table.tolerance)
  result = result.replace(/\b([a-zA-Z]\w*(?:\.\w+)+)\b/g, (match) => {
    try {
      // Navigate the data object using the path
      const path = match.split(".");
      let value: any = data;

      // Check if this might be a table reference (path has 3 parts and the middle part might be a table)
      if (path.length === 3) {
        const [funcName, tableName, fieldName] = path;

        // Get the function level object
        if (!(funcName in data)) {
          throw new Error(`Invalid function name: ${funcName}`);
        }
        const functionData: FunctionData = data[funcName];

        // Check if the next level is an array (table)
        if (Array.isArray(functionData[tableName])) {
          // This is a table reference, use rowIndex to access the correct row
          const tableData = functionData[tableName] as TableRow[];

          if (rowIndex >= tableData.length) {
            throw new Error(
              `Row index out of bounds: ${rowIndex} for table ${tableName}`
            );
          }

          // Access the specific row by index
          const rowData: TableRow = tableData[rowIndex];

          // Get the field value from the row
          if (fieldName in rowData) {
            const fieldValue = rowData[fieldName];

            // Convert to number if possible
            if (typeof fieldValue === "string" && !isNaN(Number(fieldValue))) {
              return String(Number(fieldValue));
            }

            return typeof fieldValue === "number"
              ? String(fieldValue)
              : fieldValue || "0";
          } else {
            throw new Error(
              `Field ${fieldName} not found in table ${tableName} at row ${rowIndex}`
            );
          }
        }
      }

      // Standard property path traversal for non-table references
      for (const key of path) {
        if (value === undefined || value === null) {
          throw new Error(`Invalid path: ${match}`);
        }
        value = value[key];
      }

      // Return the actual value
      if (typeof value === "number") {
        return String(value);
      } else if (value !== undefined && value !== null) {
        return JSON.stringify(value);
      } else {
        return "0";
      }
    } catch (error: any) {
      console.error(`Error accessing property ${match}:`, error.message);
      throw error; // Re-throw to stop the evaluation
    }
  });

  return result;
}
