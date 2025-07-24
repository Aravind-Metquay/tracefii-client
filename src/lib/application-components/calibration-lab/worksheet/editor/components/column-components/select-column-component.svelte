<script lang="ts">
	import type { TableColumn } from '@/Types';

	let { column, value, onChange } = $props<{
		column: TableColumn;
		value: string | undefined;
		onChange: (val: string) => void;
	}>();

	const selectOptions = $derived(column.selectComponent?.values ?? []);
</script>

<select
	class="w-full border-none bg-transparent text-sm outline-none"
	required={column.isRequired}
	disabled={column.isReadOnly || column.isDisabled}
	value={value ?? ''}
	onchange={(e) => onChange((e.target as HTMLSelectElement).value)}
>
	<option value="" disabled>Select...</option>
	{#each selectOptions as item (item.key)}
		<option value={item.value} class="bg-white">
			{item.value}
		</option>
	{/each}
</select>
