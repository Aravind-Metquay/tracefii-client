<script lang="ts">
	import type { TableColumn } from "@/Types";

    export let column: TableColumn;
    export let value: any;
    export let onChange: (val: any) => void;

    const selectOptions = column.selectComponent?.values ?? [];
    let selectValue = value ?? "";
</script>

<select
  class="w-full border-none outline-none bg-transparent text-sm"
  bind:value={selectValue}
  required={column.isRequired}
  disabled={column.isReadOnly}
  on:change={(e) => onChange((e.target as HTMLSelectElement).value)}
>
  <option value="">Select...</option>
  {#each selectOptions as item (item.key)}
    <option value={item.value} class="bg-white">
      {item.value}
    </option>
  {/each}
</select>
