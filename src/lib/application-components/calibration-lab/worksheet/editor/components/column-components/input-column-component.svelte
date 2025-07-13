<script lang="ts">
	import type { TableColumn } from "@/Types";

    export let column: TableColumn;
    export let value: any;
    export let onChange: (val: any) => void;

    // Local computed input props
    const inputClass =
        "w-full border-none outline-none bg-transparent text-sm" +
        (column.isReadOnly ? " bg-gray-50 cursor-not-allowed" : "");

    const inputType = column.inputComponent?.type
        ? column.inputComponent.type.toLowerCase()
        : "text";

    const inputValue = value ?? "";
</script>

<input
  class={inputClass}
  aria-label={column.columnName}
  id={column.columnId}
  value={inputValue}
  readonly={column.isReadOnly}
  type={inputType}
  on:input={(e) => {
    const inputValue = (e.target as HTMLInputElement).value;
    if (column.inputComponent?.type === "Number") {
      if (!inputValue) {
        onChange("");
        return;
      }
      const numValue = parseFloat(inputValue);
      if (!isNaN(numValue)) {
        onChange(numValue);
      }
    } else {
      onChange(inputValue);
    }
  }}
/>
