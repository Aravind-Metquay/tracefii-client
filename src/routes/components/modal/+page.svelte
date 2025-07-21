<script>
	import { Button, Select } from '@/components';
	import Modal from './modal.svelte';
	let active = $state(false);
</script>

<div class="flex h-full w-full items-center justify-center">
	<Button size="small" variant="tertiary" onclick={() => (active = true)}>Open</Button>
	<Modal size="medium" bind:isOpen={active} title="Hello World!">
		<!-- <Select.Root>
			<Select.Trigger>Select Fruit</Select.Trigger>
			<Select.Content>
				<Select.Item value="Apple">Apple</Select.Item>
				<Select.Item value="Grape">Grape</Select.Item>
				<Select.Item value="Orange">Orange</Select.Item>
			</Select.Content>
		</Select.Root> -->
		<label for="pet-select">Choose a pet:</label>

		<select name="pets" id="pet-select">
			<option value="">--Please choose an option--</option>
			<option value="dog">Dog</option>
			<option value="cat">Cat</option>
			<option value="hamster">Hamster</option>
			<option value="parrot">Parrot</option>
			<option value="spider">Spider</option>
			<option value="goldfish">Goldfish</option>
		</select>
	</Modal>
</div>
