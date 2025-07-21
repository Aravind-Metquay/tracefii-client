<script>
	import { Button, Select } from '@/components';
	import Modal from './modal.svelte';
	let active = $state(false);
</script>

<div class="flex h-full w-full items-center justify-center">
	<Button size="small" variant="tertiary" onclick={() => (active = true)}>Open</Button>
	<Modal size="large" bind:isOpen={active} title='Hello World!'>
		<Select.Root>
			<Select.Trigger>Select Fruit</Select.Trigger>
			<Select.Content>
				<Select.Item value="Apple">Apple</Select.Item>
				<Select.Item value="Grape">Grape</Select.Item>
				<Select.Item value="Orange">Orange</Select.Item>
			</Select.Content>
		</Select.Root>
	</Modal>
</div>
