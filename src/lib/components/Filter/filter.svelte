<script lang="ts">
  import { Trash } from "@lucide/svelte";
  import { FunnelPlus } from "@lucide/svelte";
  import Button from "@/components/button/button.svelte";

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
    funnelButton:boolean
  };

  let filters = $state<Filter[]>([createNewFilter()]);
  let Addbutton = $state<boolean>(false);

  let columns = [
    { key: "Name", label: "Name", type: "string" },
    { key: "Email", label: "Email", type: "string" },
    { key: "Number", label: "Phone Number", type: "number" }
  ];

  let stringOperators = [
    { value: "contains", label: "contains" },
    { value: "notContains", label: "does not contain" },
    { value: "startsWith", label: "starts with" },
    { value: "endsWith", label: "ends with" },
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
    { value: "empty", label: "is empty" },
    { value: "notEmpty", label: "is not empty" }
  ];

  let numberOperators = [
    { value: "is", label: "is" },
    { value: "isNot", label: "is not" },
    { value: "lessThan", label: "less than" },
    { value: "greaterThan", label: "greater than" },
    { value: "empty", label: "is empty" },
    { value: "notEmpty", label: "is not empty" }
  ];

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
        if(!filters[filters.length-1].selectedColumn){
        removeFilter(filters[filters.length-1].id)
      }
        callback();
      }
    };
    document.addEventListener("click", handleClick, true);
    return {
      destroy() {
        document.removeEventListener("click", handleClick, true);
      }
    };
  }

  function createNewFilter(): Filter {
    return {
      id: crypto.randomUUID(),
      selectedColumn: null,
      selectedOperator: null,
      filterQuery: "",
      showDropDown: false,
      showOperators: false,
      showInput: false,
      inputRef: null,
      funnelButton:true
    };
  }

  function addFilter() {
    const newFilter = createNewFilter();
    filters = [...filters, newFilter];
    newFilter.funnelButton=false;
    openDropDown(newFilter.id);
  }

  function removeFilter(filterId: string) {
    console.log(filters.length);
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
    console.log(filters.length);
  }

  function openDropDown(filterId?: string) {
    if(!filters[filters.length-1].selectedColumn && filters[filters.length-1].showDropDown ){
        removeFilter(filters[filters.length-1].id)
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
    if(!filters[filters.length-1].selectedColumn){
        removeFilter(filters[filters.length-1].id)
      }
  }

  function selectColumn(filterid: string, col: Column) {

    Addbutton=false;
    const filter = filters.find((f) => f.id == filterid);
    if (filter) {
      filter.funnelButton=true
      filter.selectedColumn = col;
      filter.selectedOperator = null;
      filter.showDropDown = false;
      filter.showOperators = true;
      filter.filterQuery = "";
      Addbutton = false;
    }
  }

  function selectOperator(filterid: string, value: string) {
    Addbutton = true;
    const filter = filters.find((f) => f.id == filterid);
    if (filter) {
      filter.selectedOperator = value;
      filter.showOperators = false;
      if (value !== "is empty" && value !== "is not empty") {
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
    if(!filters[filters.length-1].selectedColumn){
        removeFilter(filters[filters.length-1].id)
      }
  }
</script>

<div class=" flex flex-wrap items-start" use:clickOutside={closeAllDropdowns}>
  {#each filters as filter, index (filter.id)}
    <div class="flex items-center my-2">
      <div class="flex items-center  rounded-md border border-gray-300 bg-white ml-1">
        <div class="relative">
          {#if filter.funnelButton}
          <Button
            class="min-w-3 text-black text-xs"
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
              class="absolute top-full left-0 mt-1 cursor-pointer rounded border border-gray-300 bg-white p-2 w-56 z-10"
            >
              <div class="text-xs text-gray-500 mb-1">Select a column</div>
              {#each columns as col}
                <div
                  class="py-1.5 px-2.5 r rounded-sm hover:bg-gray-100"
                  onclick={() => selectColumn(filter.id, col)}
                >
                  {col.label}
                </div>
              {/each}
            </div>
          {/if}
        </div>

        {#if filter.selectedColumn}
          <div class="relative ">
            <Button
              class="text-xs"
              onclick={() => openOperators(filter.id)}
              size="tiny"
              variant="secondary"
            >
              {filter.selectedOperator || "Select an Operator"}
            </Button>
            {#if filter.showOperators}
              <div
                class="absolute top-full left-0 mt-1 rounded border border-gray-300 bg-white p-2 w-56 z-10"
              >
                <div class="text-xs text-gray-500 mb-1">Select an operator</div>
                {#if filter.selectedColumn?.type === "string"}
                  {#each stringOperators as Operator}
                    <div
                      class="py-1.5 px-2.5 cursor-pointer rounded-sm hover:bg-gray-100"
                      onclick={() => selectOperator(filter.id, Operator.label)}
                    >
                      {Operator.label}
                    </div>
                  {/each}
                {:else if filter.selectedColumn?.type === "number"}
                  {#each numberOperators as Operator}
                    <div
                      class="py-1.5 px-2.5 cursor-pointer rounded-sm hover:bg-gray-100"
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

        {#if filter.selectedOperator && filter.selectedOperator !== "is empty" && filter.selectedOperator !== "is not empty"}
          <div class="relative ">
            <div
              class="px-1 pt-1 pb-1.5 text-xs rounded-md cursor-pointer h-[24px]"
              onclick={() => customizeText(filter.id)}
            >
              {#if filter.selectedColumn?.type === "string"}
                {filter.filterQuery || "Enter a Text"}
              {:else}
                {filter.filterQuery || "Enter a Number"}
              {/if}
            </div>
            {#if filter.showInput}
              <input
                type="text"
                placeholder="Enter value"
                class="absolute top-full left-0 mt-1 rounded-md border p-1 min-w-18 text-xs z-10"
                bind:this={filter.inputRef}
                bind:value={filter.filterQuery}
              />
            {/if}
          </div>
        {/if}

        {#if filter.selectedColumn}
          <div class="pl-1">
            <Button
              class="rounded-md bg-red-500 text-white text-xs"
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