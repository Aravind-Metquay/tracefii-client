<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog/index';
  import * as Select from '$lib/components/ui/select/index';
  import { Button } from '$lib/components/ui/button/index';
  import { Input } from '$lib/components/ui/input/index';
  import { Label } from '$lib/components/ui/label/index';
  import { Checkbox } from '$lib/components/ui/checkbox/index';
  import { Badge } from '$lib/components/ui/badge/index';
  import { X, Plus } from '@lucide/svelte';
  import { getContext } from 'svelte';
  import type { WorksheetManager } from '../store.svelte';
  import type { Component, GraphComponent, InputComponent, SelectComponent, TableComponent, TextComponent } from '@/Types';

  interface Props {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  let { open = $bindable(false), onOpenChange }: Props = $props();

  const worksheetManager = getContext<WorksheetManager>('worksheetManager');

  let currentActiveFunctionId = $derived(worksheetManager.getWorksheet().currentActiveElements.function?.functionId)

  let formData = $state<Component>({
    functionId: currentActiveFunctionId as string,
    componentType: 'Input',
    componentId: '',
    label: '',
    showInCertificate: false,
    certificateVisibilityExpression: '',
    isExpressionEnabled: false,
    valueExpression: '',
    isRequired: false,
    defaultValue: '',
    isComponentDisabledOnExpression: false,
    disableExpression: '',
    isDisabled: false,
    isReadOnly: false,
    order: 0,
    isValidationEnabled: false,
    validationExpression: '',
    validationMessage: '',
    isInvalid: false,
    certificateVisibilityBasedonExpression: false
  });

  let inputComponentData = $state<InputComponent>({
    type: 'Number',
    roundingDigits: 0
  });

  let selectComponentData = $state<SelectComponent>({
    type: 'Yes or No',
    referenceWorksheetId: '',
    values: [
      { key: 'Yes', value: 'Yes' },
      { key: 'No', value: 'No' }
    ]
  });

  let textComponentData = $state<TextComponent>({
    type: 'Paragraph',
    heading: ''
  });

  let tableComponentData = $state<TableComponent>({
    tableName: '',
    showTableNameInWorksheet: false,
    columns: [],
    isTableRowExpressionEnabled: false,
    tableRowExpression: ''
  });

  let graphComponentData = $state<GraphComponent>({});

  let label = $state('');
  let customSelectValues = $state<Array<{ key: string; value: string }>>([]);
  let newCustomValue = $state('');

  let componentId = worksheetManager.generateUniqueId(label, "component")

  $effect(() => {
    if (componentId) {
      formData.componentId = componentId;
    }
  });

  function handleComponentTypeChange(value: "Input" | "Select" | "Table" | "Text" | "Graph") {
    formData.componentType = value;

    // Reset type-specific data when component type changes
    if (value === 'Select') {
      selectComponentData.type = 'Yes or No';
      selectComponentData.values = [
        { key: 'Yes', value: 'Yes' },
        { key: 'No', value: 'No' }
      ];
    }
  }

  // Handle select type changes
  function handleSelectTypeChange(value: "Yes or No" | "Reference Asset" | "Custom") {
    selectComponentData.type = value;

    if (value === 'Yes or No') {
      selectComponentData.values = [
        { key: 'Yes', value: 'Yes' },
        { key: 'No', value: 'No' }
      ];
    } else if (value === 'Custom') {
      selectComponentData.values = [...customSelectValues];
    } else {
      selectComponentData.values = [];
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
    // Mock current active function for demo
    const currentActiveFunction = { functionId: currentActiveFunctionId };

    if (!currentActiveFunction) {
      console.error('No current active function');
      return;
    }

    if (!formData.componentId.trim()) {
      console.error('Component ID is required');
      return;
    }

    const component = {
      ...formData,
      functionId: currentActiveFunction.functionId as string
    };

    // Add specific component data based on type
    switch (formData.componentType) {
      case 'Input':
        component.inputComponent = inputComponentData;
        break;
      case 'Select':
        component.selectComponent = selectComponentData;
        break;
      case 'Text':
        component.textComponent = textComponentData;
        break;
      case 'Table':
        component.tableComponent = tableComponentData;
        break;
      case 'Graph':
        component.graphComponent = graphComponentData;
        break;
    }

    // Initialize table data if it's a table component
    if (component.componentType === 'Table') {
      // setComponentValue(currentActiveFunction.functionId, component.componentId, []);
    }

    // Add component ID to the global set and add component
    // addComponentId(formData.componentId);
    // addComponent(component);
    // setCurrentActiveComponent(component);
    worksheetManager.addNewComponent(component)

    // Reset form and close modal
    resetForm();
    open = false;
  }

  // Reset form data
  function resetForm() {
    label = '';
    formData = {
      functionId: '',
      componentType: 'Input',
      componentId: '',
      label: '',
      showInCertificate: false,
      certificateVisibilityExpression: '',
      isExpressionEnabled: false,
      valueExpression: '',
      isRequired: false,
      defaultValue: '',
      isComponentDisabledOnExpression: false,
      disableExpression: '',
      isDisabled: false,
      isReadOnly: false,
      order: 0,
      isValidationEnabled: false,
      validationExpression: '',
      validationMessage: '',
      isInvalid: false,
      certificateVisibilityBasedonExpression: false
    };

    inputComponentData = { type: 'Number', roundingDigits: 0 };
    selectComponentData = {
      type: 'Yes or No',
      referenceWorksheetId: '',
      values: [
        { key: 'Yes', value: 'Yes' },
        { key: 'No', value: 'No' }
      ]
    };
    textComponentData = { type: 'Paragraph', heading: '' };
    tableComponentData = {
      tableName: '',
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

<div>{currentActiveFunctionId}</div>

<Dialog.Root bind:open {onOpenChange}>
  <Dialog.Trigger>
    <Button>Add New Component</Button>
  </Dialog.Trigger>

  <Dialog.Content class="max-h-[90vh] max-w-4xl overflow-y-auto">
    <Dialog.Header>
      <Dialog.Title>Add New Component</Dialog.Title>
      <Dialog.Description>Configure your new component with the options below.</Dialog.Description>
    </Dialog.Header>

    <div class="space-y-6 py-4">
      <!-- Component Type Selection -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div class="space-y-2">
          <Label for="component-type">Component Type</Label>
          <Select.Root type="single" bind:value={formData.componentType}>
            <Select.Trigger id="component-type">
              {formData.componentType || "Select component type"}
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="Input" label="Input">Input</Select.Item>
              <Select.Item value="Select" label="Select">Select</Select.Item>
              <Select.Item value="Table" label="Table">Table</Select.Item>
              <Select.Item value="Text" label="Text">Text</Select.Item>
              <Select.Item value="Graph" label="Graph">Graph</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        <!-- Conditional Sub-type Selection -->
        {#if formData.componentType === 'Input'}
          <div class="space-y-2">
            <Label for="input-type">Input Type</Label>
            <Select.Root type="single" bind:value={inputComponentData.type}>
              <Select.Trigger id="input-type">
                {inputComponentData.type || "Select input type"}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Text" label="Text">Text</Select.Item>
                <Select.Item value="Number" label="Number">Number</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        {/if}

        {#if formData.componentType === 'Select'}
          <div class="space-y-2">
            <Label for="select-type">Select Type</Label>
            <Select.Root type="single" bind:value={selectComponentData.type}>
              <Select.Trigger id="select-type">
                {selectComponentData.type || "Select type"}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Yes or No" label="Yes or No">Yes or No</Select.Item>
                <Select.Item value="Reference Asset" label="Reference Asset">Reference Asset</Select.Item>
                <Select.Item value="Custom" label="Custom">Custom</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        {/if}

        {#if formData.componentType === 'Text'}
          <div class="space-y-2">
            <Label for="text-type">Text Type</Label>
            <Select.Root type="single" bind:value={textComponentData.type}>
              <Select.Trigger id="text-type">
                {textComponentData.type || "Select text type"}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="Heading" label="Heading">Heading</Select.Item>
                <Select.Item value="Paragraph" label="Paragraph">Paragraph</Select.Item>
              </Select.Content>
            </Select.Root>
          </div>
        {/if}
      </div>

      <!-- Component Label and ID -->
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        {#if formData.componentType === 'Text' && textComponentData.type === 'Heading'}
          <div class="space-y-2">
            <Label for="heading">Heading</Label>
            <Input
              id="heading"
              bind:value={textComponentData.heading}
              placeholder="Enter heading text"
            />
          </div>
        {:else if formData.componentType === 'Table'}
          <div class="space-y-2">
            <Label for="table-name">Table Name</Label>
            <Input
              id="table-name"
              bind:value={tableComponentData.tableName}
              placeholder="Enter table name"
            />
          </div>
        {:else}
          <div class="space-y-2">
            <Label for="component-label">Component Label</Label>
            <Input
              id="component-label"
              bind:value={label}
              oninput={(e) => (formData.label = e.currentTarget.value)}
              placeholder="Enter component label"
            />
          </div>
        {/if}

        <div class="space-y-2">
          <Label for="component-id">Component ID</Label>
          <Input
            id="component-id"
            bind:value={formData.componentId}
            placeholder="Auto-generated or enter custom ID"
          />
        </div>
      </div>

      <!-- Component Specific Inputs -->
      {#if formData.componentType === 'Input' && inputComponentData.type === 'Number'}
        <div class="w-full max-w-xs space-y-2">
          <Label for="rounding-digits">Rounding Digits</Label>
          <Input
            id="rounding-digits"
            type="number"
            bind:value={inputComponentData.roundingDigits}
            min="0"
          />
        </div>
      {/if}

      {#if formData.componentType === 'Select' && selectComponentData.type === 'Reference Asset'}
        <div class="w-full max-w-xs space-y-2">
          <Label for="reference-worksheet">Reference Worksheet</Label>
          <Select.Root type="single" bind:value={selectComponentData.referenceWorksheetId}>
            <Select.Trigger id="reference-worksheet">
              {selectComponentData.referenceWorksheetId || "Select a worksheet..."}
            </Select.Trigger>
            <Select.Content>
              <!-- TODO: Add worksheet options from API -->
              <Select.Item value="worksheet1" label="Worksheet 1">Worksheet 1</Select.Item>
              <Select.Item value="worksheet2" label="Worksheet 2">Worksheet 2</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      {/if}

      {#if formData.componentType === 'Select' && selectComponentData.type === 'Custom'}
        <div class="space-y-4">
          <Label>Custom Values</Label>
          <div class="flex gap-2">
            <Input
              bind:value={newCustomValue}
              onkeydown={handleCustomValueKeydown}
              placeholder="Enter value and press Enter"
              class="flex-1"
            />
            <Button onclick={addCustomValue} type="button" size="sm">
              <Plus class="mr-1 h-4 w-4" />
              Add
            </Button>
          </div>

          {#if customSelectValues.length > 0}
            <div class="flex flex-wrap gap-2">
              {#each customSelectValues as item, index}
                <Badge variant="secondary" class="flex items-center gap-1">
                  <span>{item.value}</span>
                  <button
                    onclick={() => removeCustomValue(index)}
                    class="hover:bg-muted rounded-full p-0.5"
                    type="button"
                  >
                    <X class="h-3 w-3" />
                  </button>
                </Badge>
              {/each}
            </div>
          {/if}
        </div>
      {/if}

      <!-- Checkboxes -->
      <div class="space-y-4">
        <div class="flex flex-wrap gap-6">
          {#if formData.componentType === 'Table'}
            <div class="flex items-center space-x-2">
              <Checkbox
                id="show-table-name"
                bind:checked={tableComponentData.showTableNameInWorksheet}
              />
              <Label for="show-table-name" class="text-sm font-normal">
                Show table name in certificate
              </Label>
            </div>
          {/if}

          <div class="flex items-center space-x-2">
            <Checkbox id="show-in-certificate" bind:checked={formData.showInCertificate} />
            <Label for="show-in-certificate" class="text-sm font-normal">
              Show component in certificate
            </Label>
          </div>

          {#if !(formData.componentType === 'Text' && textComponentData.type === 'Heading') && formData.componentType !== 'Table'}
            <div class="flex items-center space-x-2">
              <Checkbox id="is-required" bind:checked={formData.isRequired} />
              <Label for="is-required" class="text-sm font-normal">Is component mandatory</Label>
            </div>

            <div class="flex items-center space-x-2">
              <Checkbox id="is-readonly" bind:checked={formData.isReadOnly} />
              <Label for="is-readonly" class="text-sm font-normal">Is component readonly</Label>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <Dialog.Footer>
      <Button variant="outline" onclick={() => (open = false)}>Cancel</Button>
      <Button onclick={handleAddComponent}>Add Component</Button>
    </Dialog.Footer>
  </Dialog.Content>
</Dialog.Root>