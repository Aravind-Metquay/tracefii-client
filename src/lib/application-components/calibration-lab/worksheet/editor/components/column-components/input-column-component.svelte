<script lang="ts">
	import type { TableColumn } from '@/Types';

	let { column, value, onChange } : {column : TableColumn , value : string | number | undefined , onChange: (val: string | number) => void} = $props();

	const inputClass = $derived(
		'w-full border-none outline-none bg-transparent text-sm' +
			(column.isReadOnly ? ' bg-gray-50 cursor-not-allowed' : '')
	);

	const isNumberType = $derived(column.inputComponent?.type === 'Number');

	function handleNumberChange(e: Event) {
		const targetValue = (e.target as HTMLInputElement).value.trim();

		if (targetValue === '' || targetValue === '-') {
			onChange('');
			return;
		}

		let numValue = parseFloat(targetValue);
		if (!isNaN(numValue)) {
			const roundingDigits = column.inputComponent?.roundingDigits;

			if (typeof roundingDigits === 'number' && roundingDigits >= 0) {
				numValue = parseFloat(numValue.toFixed(roundingDigits));
			}
			onChange(numValue);
		}
	}

	function handleTextChange(e: Event) {
		const targetValue = (e.target as HTMLInputElement).value;
		onChange(targetValue);
	}
</script>

{#if isNumberType}
	<input
		class={inputClass}
		aria-label={column.columnName}
		id={column.columnId}
		type="number"
		readonly={column.isReadOnly}
		disabled={column.isDisabled}
		onchange={handleNumberChange}
		value={value ?? ''}
	/>
{:else}
	<input
		class={inputClass}
		aria-label={column.columnName}
		id={column.columnId}
		type="text"
		readonly={column.isReadOnly}
		disabled={column.isDisabled}
		oninput={handleTextChange}
		value={value ?? ''}
	/>
{/if}
