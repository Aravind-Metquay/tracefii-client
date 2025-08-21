<script lang="ts">
	import { Input, Checkbox, Button, Modal, Select } from '@/components';
	import type {
		Component,
		SelectItem as SelectItemType,
		TableColumn,
		WorksheetManager
	} from '@/Types';
	import { getContext } from 'svelte';

	let {
		isOpen = $bindable(false),
		currentTable
	}: { isOpen: boolean; currentTable: Component } = $props();

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let columnType = $state<'Input' | 'Select'>('Input');
	let columnName = $state('');
	let isRequired = $state(false);
	let showInCertificate = $state(false);
	let readOnly = $state(false);
	let disabled = $state(false);
	let enableValidation = $state(false);

	let inputType = $state<'Number' | 'Text'>('Number');
	let roundingDigits = $state(0);

	let selectType = $state<'Yes or No' | 'Reference Asset' | 'Custom'>('Reference Asset');
	let referenceWorksheetId = $state('');
	let customValues = $state<SelectItemType[]>([]);
	let customInputValue = $state('');

	let columnNameError = $state('');


	$effect(() => {
		if (isOpen) {
			columnType = 'Input';
			columnName = '';
			isRequired = false;
			showInCertificate = false;
			readOnly = false;
			disabled = false;
			enableValidation = false;
			inputType = 'Number';
			roundingDigits = 0;
			selectType = 'Reference Asset';
			referenceWorksheetId = '';
			customValues = [];
			customInputValue = '';
			columnNameError = ''; 

			const focusElement = document.getElementById('column-type');
			focusElement?.focus();
		}
	});

	$effect(() => {
		if (!isOpen || !currentTable) return;

		const trimmedName = columnName.trim();
		if (!trimmedName) {
			columnNameError = 'Column name is required.';
		} else if (
			worksheetManager.checkIfColumnNameExistsInTable(currentTable.componentId, trimmedName)
		) {
			columnNameError = 'This column name already exists in the table.';
		} else {
			columnNameError = '';
		}
	});

	const columnTypeOptions = [
		{ value: 'Input', label: 'Input' },
		{ value: 'Select', label: 'Select' }
	];

	const inputTypeOptions = [
		{ value: 'Number', label: 'Number' },
		{ value: 'Text', label: 'Text' }
	];

	const selectTypeOptions = [
		{ value: 'Yes or No', label: 'Yes or No' },
		{ value: 'Reference Asset', label: 'Reference Asset' },
		{ value: 'Custom', label: 'Custom' }
	];

	const worksheetOptions = [
		{ value: 'a', label: 'Pressure gauge reference' },
		{ value: 'b', label: 'Multimeter reference' }
	];

	const addCustomValue = () => {
		const trimmedValue = customInputValue.trim();
		if (trimmedValue && !customValues.some((item) => item.value === trimmedValue)) {
			customValues = [...customValues, { key: crypto.randomUUID(), value: trimmedValue }];
			customInputValue = '';
		}
	};

	const removeCustomValue = (index: number) => {
		customValues = customValues.filter((_, i) => i !== index);
	};

	const handleCustomInputKeydown = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			addCustomValue();
		}
	};

	const handleAddColumn = () => {
		if (columnNameError) {
			console.error('Cannot add column due to validation errors.');
			return;
		}

		if (!currentTable || currentTable.componentType !== 'Table') {
			console.error('No active table component found or current component is not a table.');
			return;
		}

		const column: TableColumn = {
			columnType,
			tableId: currentTable.componentId,
			columnId: worksheetManager.generateUniqueId(columnName, 'column', {
				tableId: currentTable.componentId
			}),
			columnName,
			defaultValue: '',
			isRequired,
			certificateVisibilityBasedonExpression: false,
			certificateVisibilityExpression: '',
			showInCertificate,
			isComponentDisabledOnExpression: false,
			disableExpression: '',
			isDisabled: disabled,
			isReadOnly: readOnly,
			order: currentTable.tableComponent?.columns.length ? currentTable.tableComponent?.columns.length + 1 : 1, 
			isExpressionEnabled: false,
			valueExpression: '',
			isValidationEnabled: enableValidation,
			validationExpression: enableValidation ? '' : undefined,
			validationMessage: enableValidation ? '' : undefined,
			isInvalid: false,
			isRepeatColumn: false,
			repeatExpression: undefined,
			baseColumnId: undefined,

			inputComponent:
				columnType === 'Input'
					? {
							type: inputType,
							roundingDigits: inputType === 'Number' ? roundingDigits : 0
						}
					: undefined,

			selectComponent:
				columnType === 'Select'
					? {
							type: selectType,
							referenceWorksheetId:
								selectType === 'Reference Asset' ? referenceWorksheetId : undefined,
							values:
								selectType === 'Custom'
									? customValues
									: selectType === 'Yes or No'
										? [
												{ key: 'true', value: 'Yes' },
												{ key: 'false', value: 'No' }
											]
										: []
						}
					: undefined
		};

		worksheetManager.createNewColumn(column);
		isOpen = false;
	};
</script>

<Modal.Root bind:isOpen title="Add New Column">
	<form onsubmit={handleAddColumn} class="space-y-6 pt-2">
		<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
			<div class="space-y-1">
				<label for="column-type">Column Type</label>
				<Select
					size="small"
					id="column-type"
					bind:value={columnType}
					items={columnTypeOptions}
					placeholder="Select column type"
					class="w-full"
				/>
			</div>

			<div class="space-y-1">
				{#if columnType === 'Input'}
					<label for="input-type">Input Type</label>
					<Select
						size="small"
						id="input-type"
						bind:value={inputType}
						items={inputTypeOptions}
						placeholder="Select input type"
						class="w-full"
					/>
				{:else if columnType === 'Select'}
					<label for="select-type">Select Type</label>
					<Select
						size="small"
						id="select-type"
						bind:value={selectType}
						items={selectTypeOptions}
						placeholder="Select type"
						class="w-full"
					/>
				{/if}
			</div>

			<div class="space-y-1">
				<label for="column-name">Column Name</label>
				<Input
					size="small"
					id="column-name"
					bind:value={columnName}
					placeholder="Enter column name"
				/>
				{#if columnNameError && columnName}
					<p class="mt-1 text-sm text-red-600">{columnNameError}</p>
				{/if}
			</div>

			<div class="md:col-span-2">
				{#if columnType === 'Input' && inputType === 'Number'}
					<div class="space-y-1">
						<label for="rounding-digits">Rounding Digits</label>
						<Input
							size="small"
							id="rounding-digits"
							bind:value={roundingDigits}
							placeholder="e.g., 2"
						/>
					</div>
				{/if}

				{#if columnType === 'Select' && selectType === 'Reference Asset'}
					<div class="space-y-1">
						<label for="reference-worksheet">Worksheet</label>
						<Select
							size="small"
							id="reference-worksheet"
							bind:value={referenceWorksheetId}
							items={worksheetOptions}
							placeholder="Select Worksheet"
							class="w-full"
						/>
					</div>
				{/if}
			</div>
		</div>

		{#if columnType === 'Select' && selectType === 'Custom'}
			<div class="space-y-3">
				<label for="custom-values-input">Custom Values</label>
				<Input
					size="small"
					id="custom-values-input"
					bind:value={customInputValue}
					onkeydown={handleCustomInputKeydown}
					placeholder="Enter a value and press Enter..."
				/>
				{#if customValues.length > 0}
					<div class="flex flex-wrap gap-2 rounded-md border p-2">
						{#each customValues as tag, index (tag.key)}
							<div
								class="bg-secondary text-secondary-foreground flex items-center gap-2 rounded-md px-2.5 py-1 text-sm"
							>
								{tag.value}
								<button
									type="button"
									onclick={() => removeCustomValue(index)}
									class="ring-offset-background opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
									aria-label={`Remove ${tag.value}`}
								>
									&times;
								</button>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		{/if}

		<div class="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4">
			<div class="flex items-center space-x-2">
				<Checkbox id="is-required" bind:checked={isRequired} />
				<label for="is-required" class="cursor-pointer font-normal">Is Required</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="show-in-certificate" bind:checked={showInCertificate} />
				<label for="show-in-certificate" class="cursor-pointer font-normal"
					>Show in Certificate</label
				>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="read-only" bind:checked={readOnly} />
				<label for="read-only" class="cursor-pointer font-normal">Read Only</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="disabled" bind:checked={disabled} />
				<label for="disabled" class="cursor-pointer font-normal">Disabled</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="enable-validation" bind:checked={enableValidation} />
				<label for="enable-validation" class="cursor-pointer font-normal"
					>Enable Validation</label
				>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<Button type="submit" size="small" disabled={!!columnNameError}>Add Column</Button>
		</div>
	</form>
</Modal.Root>
