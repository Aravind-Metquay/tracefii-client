<script lang='ts'>
	import { Label } from "@/components/ui/label";
    import * as Select from "$lib/components/ui/select/index.js";
	import Input from "@/components/ui/input/input.svelte";
	import Checkbox from "@/components/ui/checkbox/checkbox.svelte";
	import Button from "@/components/ui/button/button.svelte";
	import type { WorksheetManager } from "../../store.svelte";
	import { getContext } from "svelte";
	import type { Component } from "@/Types";
	import InputComponent from "../../components/input-component.svelte";

    const components = [
        {value : 'Input' , label : 'Input'},
        {value : 'Select' , label : 'Select'},
        {value : 'Table' , label : 'Table'},
        {value : 'Text' , label : 'Text'},
        {value : 'Graph' , label : 'Graph'},

    ]
    const staticReferenceWorksheets = [
    {varId:"a",worksheetName : "Pressure gauge reference"},
    {varId:"b",worksheetName : "Multimeter reference"}
    ]
  const worksheetManager = getContext<WorksheetManager>("worksheetManager");

    let selectedComponent = $state<Component["componentType"]>("Input");
    let componentName = $state("");

    let inputType = $state<InputComponent["type"]>("Number");
    let roundingDigits = $state(0);

    let selectType = $state("Yes or No");
    let referenceWorksheetId = $state("");
    let customValues = $state<string[]>([]);
    let inputValue = $state<string>("");


    let textType = $state("Heading");

    let tableInCertificate = $state(false)
    let showInCertificate = $state(false);
    let isRequired = $state(false);
    let isReadOnly = $state(false);

 
    const triggerContent = $derived(
        components.find((f) => f.value === selectedComponent)?.label ?? "Select a component"
    );
    const selectedRefWorksheet = $derived(
        staticReferenceWorksheets.find((f) => f.varId === referenceWorksheetId)?.worksheetName ?? "Select a component"
    );
    const  addCustomValues = () => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue && !customValues.includes(trimmedValue)) {
            customValues = [...customValues, trimmedValue];
            inputValue = "";
        }
    }
    const  removeTag = (index: number) => {
        customValues = customValues.filter((_, i) => i !== index);
    }
    const  handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addCustomValues();
        }
    }
    const handleCreateComponent =() => {
      const  component : Component  = {
        functionId:worksheetManager.getCurrentActiveFunction()?.functionId || "",
        componentType: selectedComponent,
        componentId:worksheetManager.generateUniqueId(componentName,"component"),
        certificateVisibilityBasedonExpression:false,
        certificateVisibilityExpression:"",
        showInCertificate,
        isRequired,
        defaultValue:"",
        isComponentDisabledOnExpression:false,
        disableExpression:"",
        isDisabled:false,
        isReadOnly,
        order:0,
        isValidationEnabled:false,
        validationExpression:"",
        validationMessage:"",
        isInvalid:false,
        label:componentName,
        isExpressionEnabled:false,
        valueExpression:"",
        inputComponent:{
            type: inputType,
            roundingDigits,
        }
    }
    worksheetManager.addNewComponent(component)

    }


</script>
<div>
    <div id="component-selection" class="flex justify-between">
        <div id="component-selection-left-side" class="flex flex-col gap-5">
            <div id="component-drop-down">
                <Label for="Component" class='py-2 text-gray-800 font-normal text-xs'>Component</Label>
                    <Select.Root type="single" bind:value={selectedComponent}>
                        <Select.Trigger class="w-[180px] border-0 shadow-none border-b-2 rounded-none">{triggerContent}</Select.Trigger>
                            <Select.Content >
                                {#each components as component}
                                    <Select.Item value={component.value}>{component.label}</Select.Item>
                                {/each}
                            </Select.Content>
                    </Select.Root>
            </div>
            <div id="component-label">
                <Input 
                    bind:value={componentName} 
                    placeholder={selectedComponent === "Table" ? "Table Name" : "Component Label"} 
                    class="border-0 shadow-none border-b-2 rounded-none"
                />
            </div>
        </div>
        <div id="component-selection-right-side" class="flex flex-col gap-5">
            {#if selectedComponent === "Input"}
            <div id="input-type">
                <Label for="Input type" class='py-2 text-gray-800 font-normal text-xs'>Input type</Label>
                    <Select.Root type="single" bind:value={inputType}>
                    <Select.Trigger class="w-[180px] border-0 shadow-none border-b-2 rounded-none">{inputType}</Select.Trigger>
                        <Select.Content>
                                <Select.Item value={"Number"}>Number</Select.Item>
                                <Select.Item value={"Text"}>Text</Select.Item>
                        </Select.Content>
                    </Select.Root>
            </div>
            {/if}
            {#if selectedComponent === "Select"}
            <div id="select-type">
                <Label for="select type" class='py-2 text-gray-800 font-normal text-xs'>Select type</Label>
                    <Select.Root type="single" bind:value={selectType}>
                    <Select.Trigger class="w-[180px] border-0 shadow-none border-b-2 rounded-none">{selectType}</Select.Trigger>
                        <Select.Content>
                                <Select.Item value={"yes Or No"}>Yes or No</Select.Item>
                                <Select.Item value={"Reference Asset"}>Reference Asset</Select.Item>
                                <Select.Item value={"Custom"}>Custom</Select.Item>
                        </Select.Content>
                    </Select.Root>
            </div>
            {/if}
            {#if selectedComponent === "Text"}
            <div id="text-type">
                <Label for="text type" class='py-2 text-gray-800 font-normal text-xs'>Text type</Label>
                    <Select.Root type="single" bind:value={textType}>
                    <Select.Trigger class="w-[180px] border-0 shadow-none border-b-2 rounded-none">{textType}</Select.Trigger>
                        <Select.Content>
                                <Select.Item value={"Paragraph"}>Paragraph</Select.Item>
                                <Select.Item value={"Heading"}>Heading</Select.Item>
                        </Select.Content>
                    </Select.Root>
            </div>
            {/if}
            {#if inputType === "Number" && selectedComponent === "Input"}
                <div id="Rounding-digits">
                    <Input bind:value={roundingDigits} placeholder="Rounding digits" class="border-0 shadow-none border-b-2 rounded-none"/>
                </div>
            {/if}
            {#if selectType === "Reference Asset"}
                <div id="Select-reference-worksheet">
                    <Label for="reference-worksheet" class='py-2 text-gray-800 font-normal text-xs'>Worksheet</Label>
                        <Select.Root type="single" bind:value={referenceWorksheetId}>
                            <Select.Trigger class="w-[180px] border-0 shadow-none border-b-2 rounded-none">{selectedRefWorksheet}</Select.Trigger>
                                <Select.Content >
                                    {#each staticReferenceWorksheets as component}
                                        <Select.Item value={component.varId}>{component.worksheetName}</Select.Item>
                                    {/each}
                                </Select.Content>
                        </Select.Root>
                </div>
            {/if}
        </div>
    </div>
    <div id="component-selection-bottom">
        <div id="custom-values-for-select" >
            {#if selectedComponent === "Select" && selectType === "Custom"}
                <Input
                    bind:value={inputValue}
                    onkeydown={ handleKeyPress}
                    placeholder="Enter values and press enter"
                    class="border-0 shadow-none border-b-2 rounded-none w-full"
                    /> 
                    <!-- Tags display -->
                {#if customValues.length > 0}
                    <div class="flex flex-wrap gap-2 mt-2">
                        {#each customValues as tag, index (index)}
                            <div class="bg-gray-100 px-3 py-1 rounded-full flex items-center">
                                {tag}
                                <button
                                    onclick={() => removeTag(index)}
                                    class="ml-2 text-gray-500 hover:text-gray-700"
                                    aria-label={`Remove ${tag}`}
                                >
                                ×
                                </button>
                            </div>
                        {/each}
                    </div>
                {/if}              
                
            {/if}
        </div>
        <div  class="flex pt-10">
             <div class="flex gap-2 items-center">
            <Checkbox id="table-in-certificate" bind:checked={tableInCertificate} />
            <Label for="table-in-certificate" class='py-2 cursor-pointer text-gray-900 font-normal text-sm'>Show table name in certificate</Label>
        </div>
        <div class="flex gap-2 items-center">
            <Checkbox id="show-in-certificate" bind:checked={showInCertificate} />
            <Label for="show-in-certificate" class='py-2 cursor-pointer text-gray-900 font-normal text-sm'>Show component in certificate?</Label>
        </div>
        <div class="flex gap-2 items-center">
            <Checkbox id="component-mandatory" bind:checked={isRequired} />
            <Label for="component-mandatory" class='py-2 cursor-pointer text-gray-900 font-normal text-sm'>Is component mandatory?</Label>
        </div>
        <div class="flex gap-2 items-center">
            <Checkbox id="component-readonly" bind:checked={isReadOnly} />
            <Label for="component-readonly" class='py-2 cursor-pointer text-gray-900 font-normal text-sm'>Is component readonly?</Label>
        </div>
        </div>
        <div id="add" class="flex justify-end pt-5">
            <Button size="sm" class="text-xs w-18" onclick={handleCreateComponent}>Add</Button>  
        </div>
    </div>
</div>