<script lang="ts">
	import { Trash } from '@lucide/svelte';
	import { FunnelPlus } from '@lucide/svelte';
	import Button from '@/components/button/button.svelte';

	type Column = {
		key: string;
		label: string;
		type: string;
	};

	type Filter = {
		id: string;
		selectedColumn: Column | null;
		selectedOperator: string | null;
		filterQuery: string | null;
		showDropDown: boolean;
		showOperators: boolean;
		showInput: boolean;
		inputRef: HTMLInputElement | null;
		funnelButton: boolean;
	};
	type StringOperator = {
		value: string;
		label: string;
	};
	type NumberOperator = {
		value: string;
		label: string;
	};
	type FilterObject = Record<string, { value: string; operator: string }>;

	let {columns,
		stringOperators,
		numberOperators,
		filterObject = $bindable({}),
		
	}: { columns: Column[], stringOperators: StringOperator[], numberOperators: NumberOperator[],filterObject: FilterObject } = $props();
	let filters = $state([
        {
            id: crypto.randomUUID(),
            selectedColumn: null,
            selectedOperator: null,
            filterQuery: '',
            showDropDown: false,
            showOperators: false,
            showInput: false,
            inputRef: null,
            funnelButton: true
        }
    ]) as Filter[];
	let Addbutton = $state<boolean>(false);

	$effect(() => {
		if (!filters || filters.length === 0) {
			filters = [createNewFilter()];
		}
		filterObject = filters.reduce((acc: FilterObject, f) => {
    	if (f.selectedColumn?.key && f.selectedOperator) {
      	acc[f.selectedColumn.key] = {
        value: f.filterQuery ?? '',
        operator: f.selectedOperator,
      };
    }
    return acc;
  }, {});
		    
	});
	
	function closeAllDropdowns() {
		filters.forEach((f) => {
			f.showDropDown = false;
			f.showOperators = false;
			f.showInput = false;
		});
	}

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node)) {
				if (!filters[filters.length - 1].selectedColumn) {
					removeFilter(filters[filters.length - 1].id);
				}
				callback();
			}
		};
		document.addEventListener('click', handleClick, true);
		return {
			destroy() {
				document.removeEventListener('click', handleClick, true);
			}
		};
	}

	function createNewFilter(): Filter {
		return {
			id: crypto.randomUUID(),
			selectedColumn: null,
			selectedOperator: null,
			filterQuery: '',
			showDropDown: false,
			showOperators: false,
			showInput: false,
			inputRef: null,
			funnelButton: true
    };
	}

	function addFilter() {
		const newFilter = createNewFilter();
		filters = [...filters, newFilter];
		newFilter.funnelButton = false;
		openDropDown(newFilter.id);
	}

	function removeFilter(filterId: string) {
		if (filters.length > 1) {
			filters = filters.filter((f) => f.id !== filterId);
			const lastFilter = filters[filters.length - 1];
			if (lastFilter?.selectedOperator) {
				Addbutton = true;
			}
		} else {
			const filter = filters.find((f) => f.id === filterId);
			if (filter) {
				Object.assign(filter, createNewFilter(), { id: filter.id });
				Addbutton = false;
			}
		}
	}

	function openDropDown(filterId?: string) {
		if (!filters[filters.length - 1].selectedColumn && filters[filters.length - 1].showDropDown) {
			removeFilter(filters[filters.length - 1].id);
		}
		const targetState = !filters.find((f) => f.id === filterId)?.showDropDown;
		closeAllDropdowns();
		const filter = filters.find((f) => f.id === filterId);
		if (filter) {
			filter.showDropDown = targetState;
		}
	}

	function openOperators(filterid: string) {
		const targetState = !filters.find((f) => f.id === filterid)?.showOperators;
		closeAllDropdowns();
		const filter = filters.find((f) => f.id == filterid);
		if (filter) {
			filter.showOperators = targetState;
		}
		if (!filters[filters.length - 1].selectedColumn) {
			removeFilter(filters[filters.length - 1].id);
		}
	}

	function selectColumn(filterid: string, col: Column) {
		Addbutton = false;
		const filter = filters.find((f) => f.id == filterid);
		if (filter) {
			filter.funnelButton = true;
			filter.selectedColumn = col;
			filter.selectedOperator = null;
			filter.showDropDown = false;
			filter.showOperators = true;
			filter.filterQuery = '';
			Addbutton = false;
		}
	}

	function selectOperator(filterid: string, value: string) {
		Addbutton = true;
		const filter = filters.find((f) => f.id == filterid);
		if (filter) {
			filter.selectedOperator = value;
			filter.showOperators = false;
			if (value !== 'is empty' && value !== 'is not empty') {
				filter.showInput = true;
				setTimeout(() => filter.inputRef?.focus(), 0);
			} else {
				filter.showInput = false;
			}
		}
	}

	function customizeText(filterid: string) {
		const filter = filters.find((f) => f.id == filterid);
		if (filter) {
			filter.showInput = true;
			filter.showOperators = false;
			filter.showDropDown = false;
			setTimeout(() => filter.inputRef?.focus(), 0);
		}
		if (!filters[filters.length - 1].selectedColumn) {
			removeFilter(filters[filters.length - 1].id);
		}
	}
</script>

<div class=" flex flex-wrap items-start" use:clickOutside={closeAllDropdowns}>
	{#each filters as filter, index (filter.id)}
		<div class="my-2 flex items-center">
			<div class="ml-1 flex items-center rounded-md border border-gray-300 bg-white">
				<div class="relative">
					{#if filter.funnelButton}
						<Button
							class="min-w-3 text-xs text-black"
							size="tiny"
							variant="secondary"
							onclick={() => openDropDown(filter.id)}
						>
							{#if filter.selectedColumn}
								{filter.selectedColumn.label}
							{:else}
								<FunnelPlus size={15} />
							{/if}
						</Button>
					{/if}
					{#if filter.showDropDown}
						<div
							class="absolute top-full left-0 z-10 mt-1 w-56 cursor-pointer rounded border border-gray-300 bg-white p-2"
						>
							<div class="mb-1 text-xs text-gray-500">Select a column</div>
							{#each columns as col}
								<div
									class="text-xs rounded-sm px-2.5 py-1.5 hover:bg-gray-100"
									onclick={() => selectColumn(filter.id, col)}
								>
									{col.label}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				{#if filter.selectedColumn}
					<div class="relative">
						<Button
							class="text-xs"
							onclick={() => openOperators(filter.id)}
							size="tiny"
							variant="secondary"
						>
							{filter.selectedOperator || 'Select an Operator'}
						</Button>
						{#if filter.showOperators}
							<div
								class="absolute top-full left-0 z-10 mt-1 w-56 rounded border border-gray-300 bg-white p-2"
							>
								<div class="mb-1 text-xs text-gray-500">Select an operator</div>
								{#if filter.selectedColumn?.type === 'string'}
									{#each stringOperators as Operator}
										<div
											class="text-xs cursor-pointer rounded-sm px-2.5 py-1.5 hover:bg-gray-100"
											onclick={() => selectOperator(filter.id, Operator.label)}
										>
											{Operator.label}
										</div>
									{/each}
								{:else if filter.selectedColumn?.type === 'number'}
									{#each numberOperators as Operator}
										<div
											class="cursor-pointer rounded-sm px-2.5 py-1.5 hover:bg-gray-100"
											onclick={() => selectOperator(filter.id, Operator.label)}
										>
											{Operator.label}
										</div>
									{/each}
								{/if}
							</div>
						{/if}
					</div>
				{/if}

				{#if filter.selectedOperator && filter.selectedOperator !== 'is empty' && filter.selectedOperator !== 'is not empty'}
					<div class="relative">
						<div
							class="h-[24px] cursor-pointer rounded-md px-1 pt-1 pb-1.5 text-xs"
							onclick={() => customizeText(filter.id)}
						>
							{#if filter.selectedColumn?.type === 'string'}
								{filter.filterQuery || 'Enter a Text'}
							{:else}
								{filter.filterQuery || 'Enter a Number'}
							{/if}
						</div>
						{#if filter.showInput}
							<input
								type="text"
								placeholder="Enter value"
								class="absolute top-full left-0 z-10 mt-1 min-w-18 rounded-md border p-1 text-xs bg-white"
								bind:this={filter.inputRef}
								bind:value={filter.filterQuery}
							/>
						{/if}
					</div>
				{/if}

				{#if filter.selectedColumn}
					<div class="pl-1">
						<Button
							class="rounded-md bg-red-500 text-xs text-white"
							onclick={() => removeFilter(filter.id)}
							size="tiny"
						>
							<Trash size={14} />
						</Button>
					</div>
				{/if}
			</div>
			{#if index === filters.length - 1 && Addbutton}
				<div class="ml-1">
					<Button size="tiny" onclick={addFilter} class="h-[12px]">+</Button>
				</div>
			{/if}
		</div>
	{/each}
</div>
