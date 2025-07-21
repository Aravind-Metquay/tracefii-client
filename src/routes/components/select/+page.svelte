<script>
	import { Select } from "@/components";
</script>


<div class="h-full w-full flex items-center justify-center">
	<Select.Root>
        <Select.Trigger>Select Fruit</Select.Trigger>
        <Select.Content>
            <Select.Item value="Apple">Apple</Select.Item>
            <Select.Item value="Grape">Grape</Select.Item>
            <Select.Item value="Orange">Orange</Select.Item>
        </Select.Content>
    </Select.Root>
</div>