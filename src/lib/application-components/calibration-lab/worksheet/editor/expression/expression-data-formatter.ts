import type { Component, Function, TableColumn } from "@/Types";

// Types expected by the editor
interface MathFunction {
  id: string;
  name: string;
  type: "mathFunction";
  description?: string;
}

interface EditorSectionFunction {
  id: string;
  name: string;
  type: "sectionFunction";
  description?: string;
  components: Component[];
}

// Math functions remain unchanged
export const MATH_FUNCTIONS: MathFunction[] = [
  {
    id: "avg",
    name: "avg",
    type: "mathFunction",
    description: "Calculate average",
  },
  {
    id: "sum",
    name: "sum",
    type: "mathFunction",
    description: "Calculate sum",
  },
  {
    id: "mean",
    name: "mean",
    type: "mathFunction",
    description: "Calculate mean",
  },
  {
    id: "min",
    name: "min",
    type: "mathFunction",
    description: "Find minimum value",
  },
  {
    id: "max",
    name: "max",
    type: "mathFunction",
    description: "Find maximum value",
  },
  {
    id: "CFNLookup",
    name: "CFNLookup",
    type: "mathFunction",
    description: "Simple Lookup",
  },
  {
    id: "RepeatMax",
    name: "RepeatMax",
    type: "mathFunction",
    description: "Finds the max of the repeats",
  }
];

export const convertToEditorFormat = (
  functions: Function[],
  components: Component[],
  currentActiveComponent: Component | null,
  currentActiveColumn: TableColumn | null
): EditorSectionFunction[] => {
  // First apply the filtering
  const filteredComponents = filterComponents(
    components,
    currentActiveComponent,
    currentActiveColumn
  );

  return functions.map((func) => ({
    id: func.functionId,
    name: func.functionId,
    type: "sectionFunction" as const,
    description: `Function: ${func.functionName}`,
    components: filteredComponents.filter(
      (comp) => comp.functionId === func.functionId
    ),
    // .map(comp => convertComponent(comp, func.functionId))
  }));
};

const filterComponents = (
  components: Component[],
  currentActiveComponent: Component | null,
  currentActiveColumn: TableColumn | null
): Component[] => {
  if (!currentActiveComponent) return components;

  // Create a deep copy of components to avoid mutations
  const componentsCopy: Component[] = JSON.parse(JSON.stringify(components));

  if (currentActiveComponent.componentType === "Table" && currentActiveColumn) {
    // For table components, filter out the current column from the table
    return componentsCopy.map((component) => {
      if (component.componentId === currentActiveComponent.componentId) {
        return {
          ...component,
          tableComponent: component.tableComponent
            ? {
                ...component.tableComponent,
                columns: component.tableComponent.columns.filter(
                  (column) => column.columnId !== currentActiveColumn?.columnId
                ),
              }
            : component.tableComponent,
        };
      }
      return component;
    });
  } else {
    // For non-table components, filter out the current active component
    return componentsCopy.filter(
      (component) =>
        component.componentId !== currentActiveComponent.componentId
    );
  }
};
