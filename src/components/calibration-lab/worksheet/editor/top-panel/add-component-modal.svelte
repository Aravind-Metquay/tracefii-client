<script lang="ts">
  import { X, Plus } from "@lucide/svelte";
  import type { 
    Component, 
    InputComponent, 
    SelectComponent, 
    TextComponent, 
    TableComponent, 
    GraphComponent 
  } from "@/Types";
  import { currentActiveStore, setCurrentActiveComponent } from "../store/currentActiveElements-store.svelte";
  import { addComponent } from "../store/component-store.svelte";
  import { addComponentId } from "../store/componentId-store.svelte";
  import { setComponentValue } from "../store/data-store.svelte";
  import { generateComponentId } from "../utils/componentId-generator";

  interface Props {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onClose: () => void;
  }

  let { isOpen = $bindable(), onOpenChange, onClose }: Props = $props();

  // Get current active function
  let currentActiveFunction = $derived(currentActiveStore.function);

  // Form state
  let formData = $state<Component>({
    functionId: "",
    componentType: "Input",
    componentId: "",
    label: "",
    showInCertificate: false,
    certificateVisibilityExpression: '',
    isExpressionEnabled: false,
    valueExpression: "",
    isRequired: false,
    defaultValue: "",
    isComponentDisabledOnExpression: false,
    disableExpression: "",
    isDisabled: false,
    isReadOnly: false,
    order: 0,
    isValidationEnabled: false,
    validationExpression: "",
    validationMessage: "",
    isInvalid: false,
    certificateVisibilityBasedonExpression: false
  });

  let inputComponentData = $state<InputComponent>({
    type: "Number",
    roundingDigits: 0
  });

  let selectComponentData = $state<SelectComponent>({
    type: "Yes or No",
    referenceWorksheetId: "",
    values: [{ key: "Yes", value: "Yes" }, { key: "No", value: "No" }]
  });

  let textComponentData = $state<TextComponent>({
    type: "Paragraph",
    heading: ""
  });

  let tableComponentData = $state<TableComponent>({
    tableName: "",
    showTableNameInWorksheet: false,
    columns: [],
    isTableRowExpressionEnabled: false,
    tableRowExpression: ''
  });

  let graphComponentData = $state<GraphComponent>({});

  let label = $state('');
  let customSelectValues = $state<Array<{ key: string; value: string }>>([]);
  let newCustomValue = $state('');

  // Auto-generate component ID when label changes
  let componentId = $derived.by(() => {
    if (label.trim()) {
      return generateComponentId(label);
    }
    return '';
  });

  // Update formData when componentId changes
  $effect(() => {
    if (componentId) {
      formData.componentId = componentId;
    }
  });

  // Update formData functionId when currentActiveFunction changes
  $effect(() => {
    if (currentActiveFunction?.functionId) {
      formData.functionId = currentActiveFunction.functionId;
    }
  });

  // Handle component type changes
  function handleComponentTypeChange(value: string) {
    formData.componentType = value as any;
    
    // Reset type-specific data when component type changes
    if (value === "Select") {
      selectComponentData.type = "Yes or No";
      selectComponentData.values = [{ key: "Yes", value: "Yes" }, { key: "No", value: "No" }];
    }
  }

  // Handle input type changes
  function handleInputTypeChange(value: string) {
    if (value === "Text" || value === "Number") {
      inputComponentData.type = value;
    }
  }

  // Handle select type changes
  function handleSelectTypeChange(value: string) {
    if (value === "Yes or No" || value === "Reference Asset" || value === "Custom") {
      selectComponentData.type = value;
      
      if (value === "Yes or No") {
        selectComponentData.values = [{ key: "Yes", value: "Yes" }, { key: "No", value: "No" }];
      } else if (value === "Custom") {
        selectComponentData.values = [...customSelectValues];
      } else {
        selectComponentData.values = [];
      }
    }
  }

  // Handle text type changes
  function handleTextTypeChange(value: string) {
    if (value === "Heading" || value === "Paragraph") {
      textComponentData.type = value;
    }
  }

  // Add custom select value
  function addCustomValue() {
    if (newCustomValue.trim() && !customSelectValues.some(item => item.value === newCustomValue.trim())) {
      const newItem = { key: newCustomValue.trim(), value: newCustomValue.trim() };
      customSelectValues = [...customSelectValues, newItem];
      selectComponentData.values = [...customSelectValues];
      newCustomValue = '';
    }
  }

  // Remove custom select value
  function removeCustomValue(index: number) {
    customSelectValues = customSelectValues.filter((_, i) => i !== index);
    selectComponentData.values = [...customSelectValues];
  }

  // Handle form submission
  function handleAddComponent() {
    if (!currentActiveFunction) {
      console.error("No current active function");
      return;
    }

    if (!formData.componentId.trim()) {
      console.error("Component ID is required");
      return;
    }

    const component = {
      ...formData,
      functionId: currentActiveFunction.functionId
    };

    // Add specific component data based on type
    switch (formData.componentType) {
      case "Input":
        component.inputComponent = inputComponentData;
        break;
      case "Select":
        component.selectComponent = selectComponentData;
        // TODO: Handle reference worksheet if needed
        break;
      case "Text":
        component.textComponent = textComponentData;
        break;
      case "Table":
        component.tableComponent = tableComponentData;
        break;
      case "Graph":
        component.graphComponent = graphComponentData;
        break;
    }

    // Initialize table data if it's a table component
    if (component.componentType === "Table") {
      setComponentValue(currentActiveFunction.functionId, component.componentId, []);
    }

    // Add component ID to the global set and add component
    addComponentId(formData.componentId);
    addComponent(component);
    setCurrentActiveComponent(component);
    
    // Reset form and close modal
    resetForm();
    onClose();
  }

  // Reset form data
  function resetForm() {
    label = '';
    formData = {
      functionId: currentActiveFunction?.functionId || "",
      componentType: "Input",
      componentId: "",
      label: "",
      showInCertificate: false,
      certificateVisibilityExpression: '',
      isExpressionEnabled: false,
      valueExpression: "",
      isRequired: false,
      defaultValue: "",
      isComponentDisabledOnExpression: false,
      disableExpression: "",
      isDisabled: false,
      isReadOnly: false,
      order: 0,
      isValidationEnabled: false,
      validationExpression: "",
      validationMessage: "",
      isInvalid: false,
      certificateVisibilityBasedonExpression: false
    };
    
    inputComponentData = { type: "Number", roundingDigits: 0 };
    selectComponentData = { 
      type: "Yes or No", 
      referenceWorksheetId: "", 
      values: [{ key: "Yes", value: "Yes" }, { key: "No", value: "No" }] 
    };
    textComponentData = { type: "Paragraph", heading: "" };
    tableComponentData = { 
      tableName: "", 
      showTableNameInWorksheet: false, 
      columns: [], 
      isTableRowExpressionEnabled: false, 
      tableRowExpression: '' 
    };
    customSelectValues = [];
    newCustomValue = '';
  }

  // Handle Enter key for custom values
  function handleCustomValueKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addCustomValue();
    }
  }
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-xl font-semibold">Add New Component</h2>
        <button onclick={onClose} class="p-1 hover:bg-gray-100 rounded">
          <X size={20} />
        </button>
      </div>

      <!-- Modal Body -->
      <div class="p-6 space-y-6">
        <!-- Component Type Selection -->
        <div class="flex justify-between gap-4">
          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Component Type</label>
            <select 
              bind:value={formData.componentType}
              onchange={(e) => handleComponentTypeChange(e.target.value)}
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Input">Input</option>
              <option value="Select">Select</option>
              <option value="Table">Table</option>
              <option value="Text">Text</option>
              <option value="Graph">Graph</option>
            </select>
          </div>

          <!-- Conditional Sub-type Selection -->
          {#if formData.componentType === "Input"}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
              <select 
                bind:value={inputComponentData.type}
                onchange={(e) => handleInputTypeChange(e.target.value)}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Text">Text</option>
                <option value="Number">Number</option>
              </select>
            </div>
          {/if}

          {#if formData.componentType === "Select"}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Select Type</label>
              <select 
                bind:value={selectComponentData.type}
                onchange={(e) => handleSelectTypeChange(e.target.value)}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Yes or No">Yes or No</option>
                <option value="Reference Asset">Reference Asset</option>
                <option value="Custom">Custom</option>
              </select>
            </div>
          {/if}

          {#if formData.componentType === "Text"}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Text Type</label>
              <select 
                bind:value={textComponentData.type}
                onchange={(e) => handleTextTypeChange(e.target.value)}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Heading">Heading</option>
                <option value="Paragraph">Paragraph</option>
              </select>
            </div>
          {/if}
        </div>

        <!-- Component Label and ID -->
        <div class="flex justify-between gap-4">
          {#if formData.componentType === "Text" && textComponentData.type === "Heading"}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Heading</label>
              <input 
                bind:value={textComponentData.heading}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter heading text"
              />
            </div>
          {:else if formData.componentType === "Table"}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
              <input 
                bind:value={tableComponentData.tableName}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter table name"
              />
            </div>
          {:else}
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-2">Component Label</label>
              <input 
                bind:value={label}
                oninput={(e) => formData.label = e.target.value}
                class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter component label"
              />
            </div>
          {/if}

          <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700 mb-2">Component ID</label>
            <input 
              bind:value={formData.componentId}
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Auto-generated or enter custom ID"
            />
          </div>
        </div>

        <!-- Component Specific Inputs -->
        {#if formData.componentType === "Input" && inputComponentData.type === "Number"}
          <div class="w-full max-w-xs">
            <label class="block text-sm font-medium text-gray-700 mb-2">Rounding Digits</label>
            <input 
              type="number"
              bind:value={inputComponentData.roundingDigits}
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
        {/if}

        {#if formData.componentType === "Select" && selectComponentData.type === "Reference Asset"}
          <div class="w-full max-w-xs">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reference Worksheet</label>
            <select 
              bind:value={selectComponentData.referenceWorksheetId}
              class="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a worksheet...</option>
              <!-- TODO: Add worksheet options from API -->
            </select>
          </div>
        {/if}

        {#if formData.componentType === "Select" && selectComponentData.type === "Custom"}
          <div class="w-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">Custom Values</label>
            <div class="flex gap-2 mb-2">
              <input 
                bind:value={newCustomValue}
                onkeydown={handleCustomValueKeydown}
                class="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value and press Enter"
              />
              <button 
                onclick={addCustomValue}
                class="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-1"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            
            {#if customSelectValues.length > 0}
              <div class="flex flex-wrap gap-2">
                {#each customSelectValues as item, index}
                  <div class="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
                    <span>{item.value}</span>
                    <button 
                      onclick={() => removeCustomValue(index)}
                      class="hover:bg-blue-200 rounded-full p-1"
                    >
                      <X size={14} />
                    </button>
                  </div>
                {/each}
              </div>
            {/if}
          </div>
        {/if}

        <!-- Checkboxes -->
        <div class="flex flex-wrap gap-4">
          {#if formData.componentType === "Table"}
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                bind:checked={tableComponentData.showTableNameInWorksheet}
                class="rounded"
              />
              <span class="text-sm">Show table name in certificate</span>
            </label>
          {/if}

          <label class="flex items-center gap-2">
            <input 
              type="checkbox" 
              bind:checked={formData.showInCertificate}
              class="rounded"
            />
            <span class="text-sm">Show component in certificate</span>
          </label>

          {#if !(formData.componentType === "Text" && textComponentData.type === "Heading") && formData.componentType !== "Table"}
            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                bind:checked={formData.isRequired}
                class="rounded"
              />
              <span class="text-sm">Is component mandatory</span>
            </label>

            <label class="flex items-center gap-2">
              <input 
                type="checkbox" 
                bind:checked={formData.isReadOnly}
                class="rounded"
              />
              <span class="text-sm">Is component readonly</span>
            </label>
          {/if}
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end gap-2 p-6 border-t">
        <button 
          onclick={onClose}
          class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button 
          onclick={handleAddComponent}
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Add Component
        </button>
      </div>
    </div>
  </div>
{/if}