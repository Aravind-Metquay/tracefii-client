<script lang="ts">
	import type { TableColumn } from '@/Types';

	let { column, value, onChange } = $props<{
		column: TableColumn;
		value: string | number | undefined;
		onChange: (val: string | number) => void;
	}>();

	const inputClass = $derived(
		'w-full border-none outline-none bg-transparent text-sm' +
			(column.isReadOnly ? ' bg-gray-50 cursor-not-allowed' : '')
	);

	const inputType = $derived(column.inputComponent?.type?.toLowerCase() ?? 'text');

	function handleInput(e: Event) {
		const targetValue = (e.target as HTMLInputElement).value;

		if (inputType === 'number') {
			if (targetValue === '') {
				onChange('');
				return;
			}
			const num = parseFloat(targetValue);
			if (!isNaN(num)) {
				onChange(num);
			}
		} else {
			onChange(targetValue);
		}
	}
</script>

<input
	class={inputClass}
	aria-label={column.columnName}
	id={column.columnId}
	type={inputType}
	readonly={column.isReadOnly}
	disabled={column.isDisabled}
	oninput={handleInput}
	value={value ?? ''}
/>
