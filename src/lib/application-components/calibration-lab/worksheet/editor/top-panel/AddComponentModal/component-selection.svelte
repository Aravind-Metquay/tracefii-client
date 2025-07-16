<script lang='ts'>
	import { Label } from "@/components/ui/label";
    import * as Select from "$lib/components/ui/select/index.js";

    const components = [
        {value : 'input' , label : 'Input'},
        {value : 'select' , label : 'Select'},
        {value : 'graph' , label : 'Graph'},
        {value : 'table' , label : 'Table'},
        {value : 'text' , label : 'Text'},
    ]

    let value = $state("");
 
    const triggerContent = $derived(
        components.find((f) => f.value === value)?.label ?? "Select a component"
    );
</script>


<div>
    <Label for="Component" class='py-2'>Component</Label>
    <Select.Root type="single">
    <Select.Trigger class="w-[180px]">{triggerContent}</Select.Trigger>
    <Select.Content>
        {#each components as component}
            <Select.Item value={component.value}>{component.label}</Select.Item>
        {/each}
    </Select.Content>
    </Select.Root>
</div>