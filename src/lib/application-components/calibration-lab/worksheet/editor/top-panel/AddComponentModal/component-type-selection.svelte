<script lang='ts'>
	import Label from "@/components/ui/label/label.svelte";
    import * as Select from "$lib/components/ui/select/index.js";

    type ComponentType = 'text' | 'input' | 'select' | 'table' | 'graph'

    let { component } : {component : ComponentType} = $props();

    const selectValues = {
        input : [
            {label : 'Number' , value : 'number'},
            {label : 'Text' , value : 'text'},  
        ],
        select : [
            {label : 'Custom' , value : 'Custom'},
            {label : 'Yes or No' , value : 'Yes or No'},
            {label : 'Reference Asset' , value : 'Reference Asset'},
        ],
        text : [
            {label : 'Heading' , value : 'Heading'},
            {label : 'Sub Heading' , value : 'Sub Heading'},
            {label : 'Text Area' , value : 'Text Area'}
        ]
    }
</script>

<div>      
    {#if ['input' , 'select' , 'text'].includes(component)}
        <Label for="ComponentType" class='py-2'>Component Type</Label>
        <Select.Root type="single">
        <Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
        <Select.Content>
            {#each selectValues[component] as item}
                <Select.Item value={item.value}>{item.label}</Select.Item>
            {/each}
        </Select.Content>
        </Select.Root>
    {:else}
        <div></div>
    {/if}    
</div>