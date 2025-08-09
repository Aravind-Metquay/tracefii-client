<script lang="ts">
	let { options = [], selectedValue = $bindable() } = $props();
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';

	let isOpen = $state(false);
	let searchValue = $state('');

	const filteredAttributes = $derived(
		searchValue
			? options.filter((name) => name.toLowerCase().includes(searchValue.toLowerCase()))
			: options
	);

	function toggle() {
		isOpen = !isOpen;
	}
	function addAttribute(option: string) {
		selectedValue.attribute = option;
		isOpen = false;
	}
</script>


<div class="relative inline-block w-2/3 pr-2">
	<Button class="mr-2 w-full text-left" variant="secondary" size="tiny" onclick={toggle}>
		{selectedValue?.attribute}
	</Button>

	{#if isOpen}
		<div
			class="absolute top-full right-0 left-0 z-50 mt-1 w-98 rounded border border-gray-300 bg-white shadow-lg"
		>
			<div class="p-3">
				<Input size="small" placeholder="Search Attributes" bind:value={searchValue} />
			</div>
			<div class="mt-2 mb-2 space-y-1 pl-2">
				{#each filteredAttributes as attribute}
					<div
						class="cursor-pointer rounded px-2 py-1 text-xs hover:bg-gray-100"
						onclick={(event) => {
							event.stopPropagation();
							addAttribute(attribute);
						}}
					>
						{attribute}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
