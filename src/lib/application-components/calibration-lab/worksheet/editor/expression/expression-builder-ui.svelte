<script lang="ts">
  import { onDestroy } from 'svelte';
  import { EditorView, ViewUpdate } from '@codemirror/view';
  import type { Extension } from '@codemirror/state';
  import { basicSetup } from 'codemirror';
  import { javascript } from '@codemirror/lang-javascript';
  import { tags as t } from '@lezer/highlight';
  import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
  import {
    autocompletion,
    CompletionContext,
    type CompletionResult,
  } from '@codemirror/autocomplete';
  import {Button} from 'bits-ui'
	import { functionStore } from '../store/function-store.svelte';
	import { componentStore } from '../store/component-store.svelte';
	import { currentActiveStore } from '../store/currentActiveElements-store.svelte';

  // Props
  interface Props {
    type: ExpressionType;
    componentId: string;
    onClose: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    isColumn?: boolean;
    columnId?: string;
  }

  let {
    type,
    componentId,
    onClose,
    isOpen = $bindable(),
    onOpenChange,
    isColumn = false,
    columnId
  }: Props = $props();

  // State
  let expression = $state('');
  let validationMessage = $state('');
  let editorContainer: HTMLDivElement | null = $state(null);
  let editorView: EditorView | null = $state(null);

  // Colors for syntax highlighting
  const COLORS = {
    mathFunction: '#E63946', // Bright red
    sectionFunction: '#457B9D', // Steel blue
    component: '#2A9D8F', // Teal
    column: '#F4A261', // Sandy brown
  };

  const expressionHighlightStyle = HighlightStyle.define([
    { tag: t.function(t.variableName), color: COLORS.mathFunction },
    { tag: t.variableName, color: COLORS.sectionFunction },
    { tag: t.propertyName, color: COLORS.component },
    { tag: t.atom, color: COLORS.column },
  ]);
  
  // Computed values
  let SECTION_FUNCTIONS = $derived(
    convertToEditorFormat(
      functionStore,
      componentStore,
      currentActiveStore.component,
      currentActiveStore.column
    )
  );

  let modalTitle = $derived.by(() => {
    switch (type) {
      case 'valueExpression':
        return 'Add Value Expression';
      case 'disableExpression':
        return 'Add Disable Expression';
      case 'certificateVisibleExpression':
        return 'Add Certificate Visibility Expression';
      case 'validationExpression':
        return 'Add Validation Expression';
      case 'tableRowExpression':
        return 'Add Table Row Expression';
      default:
        return 'Add Expression';
    }
  });

  // Custom completion function
  function expressionCompletion(context: CompletionContext): CompletionResult | null {
    let word = context.matchBefore(/[@/][\w.]*/) || context.matchBefore(/[\w.]+/);
    if ((!word || word.text.length === 0) && !context.explicit) return null;

    // Math functions (@)
    if (word && (word.text === '@' || word.text.startsWith('@'))) {
      return {
        from: word.from + (word.text === '@' ? 1 : 0),
        options: MATH_FUNCTIONS.map((func) => ({
          label: func.name,
          type: 'function',
          detail: func.description,
          apply: (view, _, from, to) => {
            view.dispatch({
              changes: { from: word!.from, to, insert: `${func.name}()` },
              selection: { anchor: word!.from + func.name.length + 1 },
            });
          },
        })),
      };
    }

    // Section functions (/)
    if (word?.text === '/' || word?.text.startsWith('/')) {
      return {
        from: word.from + (word.text === '/' ? 1 : 0),
        options: SECTION_FUNCTIONS.map((func) => ({
          label: func.name,
          type: 'sectionFunction',
          apply: (view, _, from, to) => {
            view.dispatch({
              changes: { from: word!.from, to, insert: func.name },
              selection: { anchor: word!.from + func.name.length },
            });
          },
        })),
      };
    }

    // Components within a function
    const parts = word?.text.split('.');
    if (parts?.length === 2) {
      const functionName = parts[0];
      const sectionFunction = SECTION_FUNCTIONS.find(f => f.name === functionName);

      if (sectionFunction && word) {
        return {
          from: word.from + functionName.length + 1,
          options: sectionFunction.components.map((comp) => ({
            label: comp.componentId,
            type: comp.componentType,
            detail: comp.label ? comp.label : '',
            boost: 1,
          })),
        };
      }
    }

    // Columns within a table component
    if (parts?.length === 3) {
      const functionName = parts[0];
      const componentName = parts[1];
      const sectionFunction = SECTION_FUNCTIONS.find(f => f.name === functionName);
      const component = sectionFunction?.components.find(c => c.componentId === componentName);

      if (
        component?.componentType === 'Select' &&
        component?.selectComponent?.type === 'Reference Asset' &&
        word &&
        component.selectComponent.referenceWorksheetId
      ) {
        const referenceWorksheet = getReferenceWorksheet(
          `${component.functionId}.${component.componentId}`
        );

        let functions = [];
        if (referenceWorksheet) {
          functions = referenceWorksheet.functions;
        }
        return {
          from: word.from + parts[0].length + parts[1].length + 2,
          options: functions.map((fn) => ({
            label: fn.functionId,
            type: 'sectionFunction',
            boost: 1,
            detail: fn.functionName,
          })),
        };
      } else if (
        component?.componentType === 'Table' &&
        component.tableComponent?.columns &&
        word
      ) {
        return {
          from: word.from + parts[0].length + parts[1].length + 2,
          options: component.tableComponent.columns.map((col) => ({
            label: col.columnId,
            type: 'column',
            boost: 1,
          })),
        };
      }
    }

    if (parts?.length === 4) {
      const functionName = parts[0];
      const componentName = parts[1];
      const referenceFunction = parts[2];

      const sectionFunction = SECTION_FUNCTIONS.find(f => f.name === functionName);
      const component = sectionFunction?.components.find(c => c.componentId === componentName);

      if (
        component?.componentType === 'Select' &&
        component?.selectComponent?.type === 'Reference Asset' &&
        word &&
        component.selectComponent.referenceWorksheetId
      ) {
        const referenceWorksheet = getReferenceWorksheet(
          `${component.functionId}.${component.componentId}`
        );

        if (referenceWorksheet) {
          const components = referenceWorksheet.components.filter(
            c => c.functionId === referenceFunction
          );
          const tableComponents = components.filter(c => c.componentType === 'Table');

          if (tableComponents.length > 0) {
            return {
              from: word.from + functionName.length + componentName.length + referenceFunction.length + 3,
              options: tableComponents.map((c) => ({
                label: c.componentId,
                type: c.componentType,
                detail: c.tableComponent?.tableName || c.componentId,
                boost: 1,
              })),
            };
          }
        }
      }
      return null;
    }

    if (parts?.length === 5) {
      const functionName = parts[0];
      const componentName = parts[1];
      const referenceFunction = parts[2];
      const referenceFunctionTable = parts[3];

      if (!functionName || !componentName || !referenceFunction || !referenceFunctionTable || !word) {
        return null;
      }

      const sectionFunction = SECTION_FUNCTIONS.find(f => f.name === functionName);
      if (!sectionFunction) {
        console.log('Section function not found:', functionName);
        return null;
      }

      const component = sectionFunction.components.find(c => c.componentId === componentName);
      if (!component) {
        console.log('Component not found:', componentName);
        return null;
      }

      if (
        component.componentType !== 'Select' ||
        !component.selectComponent ||
        component.selectComponent.type !== 'Reference Asset' ||
        !component.selectComponent.referenceWorksheetId
      ) {
        console.log('Component is not a Reference Asset Select:', component);
        return null;
      }

      const referenceWorksheet = getReferenceWorksheet(
        `${component.functionId}.${component.componentId}`
      );
      if (!referenceWorksheet) {
        console.log('Reference worksheet not found');
        return null;
      }

      const components = referenceWorksheet.components.filter(
        c => c.functionId === referenceFunction
      );
      if (!components || components.length === 0) {
        console.log('No components found for reference function');
        return null;
      }

      const tableComponents = components.filter(c => c.componentType === 'Table');
      if (!tableComponents || tableComponents.length === 0) {
        console.log('No table components found');
        return null;
      }

      const tableComponent = tableComponents.find(
        t => t.componentId === referenceFunctionTable ||
          (t.tableComponent && t.tableComponent.tableName === referenceFunctionTable)
      );

      if (!tableComponent || !tableComponent.tableComponent) {
        console.log('Table component not found:', referenceFunctionTable);
        return null;
      }

      const columns = tableComponent.tableComponent.columns;
      if (!columns || columns.length === 0) {
        console.log('No columns found in table component');
        return null;
      }

      const startPos = word.from;
      const totalLength = functionName.length + componentName.length + referenceFunction.length + referenceFunctionTable.length + 4;

      return {
        from: startPos + totalLength,
        options: columns.map((c) => ({
          label: c.columnId,
          type: 'column',
          detail: c.columnName,
          boost: 1,
        })),
      };
    }

    return null;
  }

  // CodeMirror extensions
  let expressionLanguage: Extension = $derived([
    basicSetup,
    javascript(),
    syntaxHighlighting(expressionHighlightStyle),
    autocompletion({
      override: [expressionCompletion],
      defaultKeymap: true,
      optionClass: (option) => {
        switch (option.type) {
          case 'function':
            return 'cm-completion-mathfunction';
          case 'sectionFunction':
            return 'cm-completion-sectionfunction';
          case 'table':
          case 'input':
          case 'select':
            return 'cm-completion-component';
          case 'column':
            return 'cm-completion-column';
          default:
            return 'cm-completion-default';
        }
      },
    }),
    EditorView.theme({
      '.cm-content': {
        fontFamily: 'monospace',
        fontSize: '14px',
      },
      '.cm-line': {
        padding: '4px 0',
      },
      '.cm-completion-mathfunction': {
        color: COLORS.mathFunction,
      },
      '.cm-completion-sectionfunction': {
        color: COLORS.sectionFunction,
      },
      '.cm-completion-component': {
        color: COLORS.component,
      },
      '.cm-completion-column': {
        color: COLORS.column,
      },
      '.cm-tooltip.cm-tooltip-autocomplete': {
        border: '1px solid #ddd',
        backgroundColor: 'white',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        '& > ul': {
          maxHeight: '300px',
          fontFamily: 'monospace',
          padding: '4px 0',
        },
        '& > ul > li': {
          padding: '6px 12px',
          lineHeight: '1.4',
          fontSize: '14px',
        },
        '& > ul > li[aria-selected]': {
          backgroundColor: '#f5f5f5',
        },
      },
    }),
  ]);

  // Initialize editor
  function initializeEditor() {
    if (editorContainer && !editorView) {
      editorView = new EditorView({
        doc: expression,
        extensions: [
          expressionLanguage,
          EditorView.updateListener.of((update: ViewUpdate) => {
            if (update.docChanged) {
              expression = update.state.doc.toString();
            }
          }),
        ],
        parent: editorContainer,
      });
    }
  }

  // Update editor content
  function updateEditorContent(newValue: string) {
    if (editorView && editorView.state.doc.toString() !== newValue) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: newValue,
        },
      });
    }
  }

  // Load expression based on current state
  function loadExpression() {
    if (isOpen && currentActiveFunction) {
      if (currentActiveComponent) {
        if (
          currentActiveComponent?.componentType === 'Table' &&
          currentActiveComponent.componentId === currentActiveColumn?.tableId
        ) {
          if (type === 'valueExpression') {
            expression = currentActiveColumn.valueExpression || '';
          } else if (type === 'disableExpression') {
            expression = currentActiveColumn.disableExpression || '';
          } else if (type === 'certificateVisibleExpression') {
            expression = currentActiveColumn.certificateVisibilityExpression || '';
          } else if (type === 'validationExpression') {
            expression = currentActiveColumn.validationExpression || '';
            validationMessage = currentActiveColumn.validationMessage || '';
          }
        } else {
          if (type === 'valueExpression') {
            expression = currentActiveComponent.valueExpression || '';
          } else if (type === 'disableExpression') {
            expression = currentActiveComponent.disableExpression || '';
          } else if (type === 'certificateVisibleExpression') {
            expression = currentActiveComponent.certificateVisibilityExpression || '';
          } else if (type === 'validationExpression') {
            expression = currentActiveComponent.validationExpression || '';
            validationMessage = currentActiveComponent.validationMessage || '';
          } else {
            expression = currentActiveComponent.tableComponent?.tableRowExpression || '';
          }
        }
      } else {
        expression = currentActiveFunction.repeatExpression || '';
      }
    }
  }

  // Handle save expression
  function handleAddExpression() {
    if (!currentActiveFunction) {
      console.error('There is no current active function.');
      return;
    }

    if (!expression.trim()) {
      console.error('Expression cannot be empty');
      return;
    }

    try {
      let expressionObject = {};

      switch (type) {
        case 'valueExpression':
          expressionObject = { valueExpression: expression };
          break;
        case 'disableExpression':
          expressionObject = { disableExpression: expression };
          break;
        case 'certificateVisibleExpression':
          expressionObject = { certificateVisibilityExpression: expression };
          break;
        case 'validationExpression':
          if (!validationMessage.trim()) {
            console.error('Validation message is required');
            return;
          }
          expressionObject = {
            validationExpression: expression,
            validationMessage: validationMessage,
          };
          break;
        case 'tableRowExpression':
          expressionObject = {
            tableRowExpression: expression,
          };
          break;
        case 'repeatExpression':
          if (currentActiveColumn) {
            expressionObject = {
              repeatExpression: expression,
              baseColumnId: columnId,
            };
          } else {
            expressionObject = {
              repeatExpression: expression,
            };
          }
          break;
      }

      if (type === 'tableRowExpression') {
        updateTableComponent(componentId, { tableRowExpression: expression });
      } else {
        if (currentActiveComponent) {
          if (
            currentActiveComponent?.componentType === 'Table' &&
            currentActiveComponent.componentId === currentActiveColumn?.tableId
          ) {
            updateColumnProperties(
              currentActiveComponent.componentId,
              currentActiveColumn.columnId,
              expressionObject
            );
          } else {
            updateComponentProperties(componentId, expressionObject);
          }
        } else {
          updateFunction(currentActiveFunction.functionId, expressionObject);
        }
      }

      updateExpression(
        type,
        expression,
        currentActiveFunction.functionId,
        componentId,
        currentActiveColumn ? currentActiveColumn.columnId : undefined
      );

      // Clear state and close modal
      expression = '';
      validationMessage = '';
      onClose();
    } catch (error) {
      console.error('Error updating expression:', error);
    }
  }

  // Handle cancel
  function handleCancel() {
    expression = '';
    validationMessage = '';
    onClose();
  }

  // Reactive effects
  $effect(() => {
    if (isOpen) {
      loadExpression();
    }
  });

  $effect(() => {
    if (editorContainer) {
      initializeEditor();
    }
  });

  $effect(() => {
    if (editorView) {
      updateEditorContent(expression);
    }
  });

  // Cleanup
  onDestroy(() => {
    if (editorView) {
      editorView.destroy();
    }
  });

  // Validation
  let isDisabled = $derived(
    !expression.trim() ||
    (type === 'validationExpression' && !validationMessage.trim())
  );

  // Mock functions - replace with actual implementations
  function convertToEditorFormat(functions, components, activeComponent, activeColumn) {
    // Mock implementation
    return [];
  }

  function getReferenceWorksheet(key) {
    // Mock implementation
    return null;
  }

  function updateTableComponent(id, data) {
    // Mock implementation
  }

  function updateColumnProperties(componentId, columnId, properties) {
    // Mock implementation
  }

  function updateComponentProperties(id, properties) {
    // Mock implementation
  }

  function updateFunction(id, properties) {
    // Mock implementation
  }

  function updateExpression(type, expression, functionId, componentId, columnId) {
    // Mock implementation
  }

  const MATH_FUNCTIONS = [
    // Mock data
  ];

  // Types (you'll need to import these)
  type ExpressionType = 'valueExpression' | 'disableExpression' | 'certificateVisibleExpression' | 'validationExpression' | 'tableRowExpression' | 'repeatExpression';
</script>

<Dialog.Root bind:open={isOpen} onOpenChange={onOpenChange}>
  <Dialog.Portal>
    <Dialog.Overlay class="fixed inset-0 bg-black/50 z-50" />
    <Dialog.Content class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <Dialog.Header class="p-6 border-b">
        <Dialog.Title class="text-xl font-semibold">
          {modalTitle}
        </Dialog.Title>
      </Dialog.Header>
      
      <div class="p-6 space-y-4">
        <!-- Expression Editor -->
        <div class="border rounded-md overflow-hidden">
          <div bind:this={editorContainer} class="min-h-[200px]"></div>
        </div>

        <!-- Validation Message Input -->
        {#if type === 'validationExpression'}
          <div class="space-y-2">
            <label for="validationMessage" class="block text-sm font-medium text-gray-700">
              Validation Message *
            </label>
            <input
              id="validationMessage"
              type="text"
              class="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              bind:value={validationMessage}
              placeholder="Enter message to show when validation fails"
            />
          </div>
        {/if}

        <!-- Action Buttons -->
        <div class="flex justify-end gap-2">
          <Button
            variant="ghost"
            class="px-4 py-2 text-red-600 hover:bg-red-50"
            onclick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onclick={handleAddExpression}
            disabled={isDisabled}
          >
            Save Expression
          </Button>
        </div>
      </div>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

<style>
  :global(.cm-editor) {
    height: 200px;
  }
  
  :global(.cm-content) {
    font-family: monospace;
    font-size: 14px;
  }
  
  :global(.cm-line) {
    padding: 4px 0;
  }
  
  :global(.cm-completion-mathfunction) {
    color: #E63946;
  }
  
  :global(.cm-completion-sectionfunction) {
    color: #457B9D;
  }
  
  :global(.cm-completion-component) {
    color: #2A9D8F;
  }
  
  :global(.cm-completion-column) {
    color: #F4A261;
  }
  
  :global(.cm-tooltip.cm-tooltip-autocomplete) {
    border: 1px solid #ddd;
    background-color: white;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  :global(.cm-tooltip.cm-tooltip-autocomplete > ul) {
    max-height: 300px;
    font-family: monospace;
    padding: 4px 0;
  }
  
  :global(.cm-tooltip.cm-tooltip-autocomplete > ul > li) {
    padding: 6px 12px;
    line-height: 1.4;
    font-size: 14px;
  }
  
  :global(.cm-tooltip.cm-tooltip-autocomplete > ul > li[aria-selected]) {
    background-color: #f5f5f5;
  }
</style>