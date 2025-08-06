<script lang="ts">
	import Button from '../button/button.svelte';
	import Input from '../input/input.svelte';
	import Dropdown from './sortdropdown.svelte';
	import Dropdown2 from './sortdropdown2.svelte';
	import { X } from '@lucide/svelte';

	let isPopoverOpen = $state(false);
	let containerElement: HTMLElement | null = $state(null);
	let searchValue = $state('');
	let selectedAttributes = $state<{ attribute: string; direction: 'Ascending' | 'Descending' }[]>(
		[]
	);
	let addSort = $state(false);
	const Attributes = [
		'Customer Name',
		'EmailId',
		'Contact Person Name',
		'Contact Person Number',
		'Year',
		'Website'
	];
	const filteredAttributes = $derived(
		searchValue
			? Attributes.filter((name) => name.toLowerCase().includes(searchValue.toLowerCase()))
			: Attributes
	);
	function addAttribute(name: string) {
		selectedAttributes.push({ attribute: name, direction: 'Ascending' });
	}
	function removeAttribute(index: number) {
		selectedAttributes.splice(index, 1);
	}
	function clearAttributes() {
		selectedAttributes = [];
	}
	function togglePopover() {
		isPopoverOpen = !isPopoverOpen;
	}
	function closePopover() {
		isPopoverOpen = false;
	}
	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (containerElement && containerElement.contains(target)) {
			return;
		}
		closePopover();
	}
	const sortOptions = ['Ascending', 'Descending'];
</script>

<svelte:document onclick={handleClickOutside} />

<div class="relative inline-block" bind:this={containerElement}>
	<div>
		<Button variant="secondary" size="tiny" onclick={togglePopover}>
			{#if selectedAttributes.length > 0}
				{'Sort by ' +
					selectedAttributes[0].attribute +
					(selectedAttributes.length > 1 ? '(+' + (selectedAttributes.length - 1) + ')' : '')}
			{:else}
				Sort
			{/if}
		</Button>
	</div>

	{#if isPopoverOpen}
		<div
			class="absolute top-full left-0 z-50 mt-1 w-98 rounded-md border border-gray-200 bg-white shadow-lg"
		>
			{#if filteredAttributes.length > 0 && selectedAttributes.length === 0}
				<div class="p-2">
					<Input size="small" placeholder="Search Attributes..." bind:value={searchValue} />
				</div>
				<div class="mt-2 mb-2 space-y-1 pl-2">
					{#each filteredAttributes as name}
						<div
							class="cursor-pointer rounded px-2 py-1 text-xs hover:bg-gray-100"
							onclick={(event) => {
								event.stopPropagation();
								addAttribute(name);
							}}
						>
							{name}
						</div>
					{/each}
				</div>
			{:else if selectedAttributes.length > 0}
				<div class="mt-2 mb-2 flex w-full flex-col space-y-1 pl-2">
					{#each selectedAttributes as name, index}
						<div class="flex">
							<Dropdown options={Attributes} bind:selectedValue={selectedAttributes[index]} />
							<Dropdown2 options={sortOptions} bind:selectedValue={selectedAttributes[index]} />
							<Button
								class="mr-2 text-xs"
								size="tiny"
								variant="error"
								onclick={(event) => {
									event.stopPropagation();
									removeAttribute(index);
								}}
							>
								<X size="12" color="white" />
							</Button>
						</div>
					{/each}
				</div>
				<div class="p-2">
					<Button size="tiny" variant="secondary" onclick={() => (addSort = !addSort)}
						>+Add More</Button
					>
					<Button
						size="tiny"
						variant="error"
						onclick={(event) => {
							event.stopPropagation();
							clearAttributes();
						}}>Clear All</Button
					>
				</div>
				{#if addSort}
					<div
						class="absolute top-full left-0 z-50 mt-1 w-98 rounded-md border border-gray-200 bg-white shadow-lg"
					>
						<div class="p-3">
							<Input size="small" placeholder="Search Attributes..." bind:value={searchValue} />
						</div>
						<div class="mt-2 mb-2 space-y-1 pl-2">
							{#each filteredAttributes as name}
								<div
									class="cursor-pointer rounded px-2 py-1 text-xs hover:bg-gray-100"
									onclick={(event) => {
										event.stopPropagation();
										addAttribute(name);
										addSort = false;
									}}
								>
									{name}
								</div>
							{/each}
						</div>
					</div>
				{/if}
			{:else}
				<div class="mt-2 space-y-1">
					<div class="cursor-pointer rounded px-2 py-1 text-sm hover:bg-gray-100">No results</div>
				</div>
			{/if}
		</div>
	{/if}
</div>
