<script lang="ts">
	import Button from '../button/button.svelte';
	let { options = [], selectedValue = $bindable() } = $props();
	import { ArrowUpNarrowWide, ArrowDownNarrowWide, CircleCheck } from '@lucide/svelte';

	let isOpen = $state(false);
	
	function toggle() {
		isOpen = !isOpen;
	}
	function addAttribute(option: string) {
		selectedValue.direction = option;
		isOpen = false;
	}

</script>


<div class="relative inline-block w-1/3 pr-2">
	<Button
		class="w-full flex items-center justify-between"
		iconPrefix={selectedValue?.direction === 'Descending' ? ArrowDownNarrowWide : ArrowUpNarrowWide}
		variant="secondary"
		size="tiny"
		onclick={toggle}
	>
		<span>{selectedValue?.direction}</span>
	</Button>

	{#if isOpen}
		<div
			class="absolute top-full right-0 left-0 z-50 mt-1 w-52 rounded border border-gray-300 bg-white shadow-lg"
		>
			<div class="mt-2 mb-2 space-y-1 pl-2">
				{#each options as option}
					<div
						class="cursor-pointer flex items-center justify-start gap-2 rounded px-2 py-1 text-xs hover:bg-gray-100"
						onclick={(event) => {
							event.stopPropagation();
							addAttribute(option);
						}}
					>
						{option}
						{#if selectedValue?.direction === option}
						<CircleCheck size="12" color="blue" />			
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
