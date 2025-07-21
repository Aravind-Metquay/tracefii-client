<script>
	import { Button, Modal, Select } from '@/components';
	let active = $state(false);
</script>

<div class="flex h-full w-full items-center justify-center">
	<Button size="small" variant="tertiary" onclick={() => (active = true)}>Open</Button>
	<Modal.Root size="large" bind:isOpen={active} title="Hello World!">
	<Select.Root size="small" class="w-full lg:w-auto">
		<Select.Trigger class="w-full lg:w-[200px]">
			<Select.Value placeholder="select a friuit" />
		</Select.Trigger>
		<Select.Content>
			<Select.Item value="apple">apple</Select.Item>
			<Select.Item value="banana">banana</Select.Item>
			<Select.Item value="orange">orange</Select.Item>
			<Select.Item value="pineapple">pineapple</Select.Item>
		</Select.Content>
	</Select.Root>
	</Modal.Root>
</div>
