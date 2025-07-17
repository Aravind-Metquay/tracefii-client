<script lang="ts">
	import { onMount, createEventDispatcher } from 'svelte';

	export let options: { label: string; value: any }[] = [];
	export let value: any = null;
	export let placeholder: string = 'Select an option';
	export let width: string = '100%';

	let isOpen = false;
	let selectedOption = options.find((option) => option.value === value);
	let dropdownElement: HTMLDivElement;

	const dispatch = createEventDispatcher();

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function selectOption(option) {
		selectedOption = option;
		value = option.value;
		isOpen = false;
		dispatch('change', { value: option.value });
	}

	function handleClickOutside(event) {
		if (dropdownElement && !dropdownElement.contains(event.target)) {
			isOpen = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div class="relative" style="width: {width};" bind:this={dropdownElement}>
	<button
		type="button"
		class="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
		on:click={toggleDropdown}
	>
		<span>{selectedOption ? selectedOption.label : placeholder}</span>
		<svg
			class="h-4 w-4 transition-transform {isOpen ? 'rotate-180' : ''}"
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 20 20"
			fill="currentColor"
		>
			<path
				fill-rule="evenodd"
				d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
				clip-rule="evenodd"
			/>
		</svg>
	</button>

	{#if isOpen}
		<div class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
			<ul class="max-h-60 overflow-auto py-1">
				{#each options as option}
					<li>
						<button
							type="button"
							class="flex w-full items-center px-3 py-2 text-sm hover:bg-gray-100 {selectedOption &&
							selectedOption.value === option.value
								? 'bg-gray-50 font-medium'
								: ''}"
							on:click={() => selectOption(option)}
						>
							{option.label}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
