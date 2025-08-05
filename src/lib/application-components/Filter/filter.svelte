<script lang="ts">
  import { Trash } from "@lucide/svelte";
  import Button from "@/components/button/button.svelte";
  import {FunnelPlus} from "@lucide/svelte";
  
  type Column = {
    key: string,
    label: string,
    type: string
  };

  type Filter = {
    id: string,
    selectedColumn: Column | null,
    selectedOperator: string | null,
    filterQuery: string | null,
    showDropDown: boolean,
    showOperators: boolean,
    showInput: boolean,
    inputRef: HTMLInputElement | null
  };

   let filters = $state<Filter[]>([]);

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

  let showDropDown = $state(false);
  let showOperators = $state(false);
  let showInput= $state(false)
  let inputRef: HTMLInputElement | null = $state(null);

  function clearFilter(){
    selectedColumn=null;
    selectedOperator=null;
    filterQuery=null;
    showDropDown=false;
    showInput=false;
    showOperators=false;
  }

  function openDropDown() {
    showDropDown = true;
    showOperators=false;
    showInput=false;
    
   }
  function openOperators(){
    showOperators=true;
    showDropDown=false;
    showInput=false;
  }

  let selectedColumn = $state<null|Column>();
  let selectedOperator= $state<string|null>(null)
  let filterQuery= $state<string|null>("");
  
  function selectColumn(col:Column){
    selectedColumn=col;
    selectedOperator=null;
    showDropDown=false;
    showOperators=true;
    filterQuery="";
  }
  function selectOperator(value:string){
    selectedOperator=value;
    console.log(selectedOperator);
    showOperators=false;   
    if(filterQuery){
        showInput=false
    }
    else{
       showInput=true;
    }
  }

  function customizeText(){
    showInput=true;
    showOperators=false;
    showDropDown=false;
    inputRef?.focus();
  }
  $effect(() => {
    if (inputRef && showInput && selectedOperator) {
      inputRef.focus();
    }
  });
</script>

<div class="flex gap-1" >
 <Button 
      class="border my-7 ml-7 rounded-md min-w-3 bg-white text-black text-xs" 
      size="tiny" 
      variant="secondary"  
      onclick={openDropDown}
>
  {#if selectedColumn}
    {selectedColumn.label}
  {:else}
    <FunnelPlus />
  {/if}
 </Button>

  {#if selectedColumn}
  <Button 
      class="border my-7 rounded-md text-xs" 
      onclick={openOperators}
      size="tiny"
      variant="secondary"
      >
    {selectedOperator ? selectedOperator : 'Select a Operator'}
  </Button>
  {/if}
  {#if selectedOperator && selectedOperator !== "is empty" && selectedOperator !== "is not empty" }
  <div class="border my-7 text-xs p-1 rounded-md cursor-pointer"
       onclick={customizeText}
       >
  {#if selectedColumn && selectedColumn.type === "string"}
    {filterQuery ? filterQuery : "Enter a Text"}
  {:else}
    {filterQuery ? filterQuery : "Enter a Number"}
  {/if}
</div>

  {/if}
  {#if selectedColumn}
  <Button 
      class="border rounded-md my-7 bg-red-500 text-white text-xs"
      onclick={clearFilter}
      size="tiny"
      >
    <Trash size=14/>
</Button>
  {/if}
</div>

{#if showDropDown}
  <div class="filter-dropdown ml-7">
    <div class="filter-dropdown-header">
      Select a column
    </div>
    {#each columns as col}
      <div
        class="filter-dropdown-item"
        onclick={() => selectColumn(col)}
      >
        {col.label}
      </div>
    {/each}
  </div>
{/if}

{#if showOperators && selectedColumn}
  <div class="filter-dropdown ml-18 ">
    <div class="filter-dropdown-header">
      Select an operator
    </div>
    {#if selectedColumn.type === "string"}
      {#each stringOperators as Operator}
        <div
          class="filter-dropdown-item"
          onclick={() => selectOperator(Operator.label)}
        >
          {Operator.label}
        </div>
      {/each}
    {:else if selectedColumn.type === "number"}
      {#each numberOperators as Operator}
        <div
          class="filter-dropdown-item"
          onclick={() => selectOperator(Operator.label)}
        >
          {Operator.label}
        </div>
      {/each}
    {/if}
  </div>
{/if}

{#if selectedOperator && selectedOperator !== "is empty" && selectedOperator !== "is not empty" && showInput}
<input 
     type="text" 
     placeholder=""
     class="border rounded-md ml-10 p-1 w-30 text-sm ml-35"
     bind:this={inputRef}
     bind:value={filterQuery}
     />
{/if}

<style>
  .filter-dropdown {
    border: 1px solid #ccc;
    background: #fff;
    border-radius: 4px;
    padding: 8px;
    width: 220px;
  }
  
  .filter-dropdown-header {
    font-size: 0.8em;
    color: #888;
    margin-bottom: 4px;
  }
  
  .filter-dropdown-item {
    padding: 6px 10px;
    cursor: pointer;
    border-radius: 3px;
  }
  
  .filter-dropdown-item:hover {
    background-color: #f3f4f6;
  }
</style>
