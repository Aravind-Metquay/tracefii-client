<script lang="ts">
	import { Input, Checkbox, Button, Modal, Select } from '@/components';
	import type { Component, SelectItem as SelectItemType } from '@/Types';
	import type { WorksheetManager } from '../store.svelte';
	import { getContext } from 'svelte';
	let { open = $bindable() }: { open: boolean } = $props();

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let selectedComponent = $state<Component['componentType']>('Input');
	let componentName = $state('');
	let showInCertificate = $state(false);
	let isRequired = $state(false);
	let isReadOnly = $state(false);
	let isDisabled = $state(false);

	let inputType = $state<'Number' | 'Text'>('Number');
	let roundingDigits = $state(0);

	let selectType = $state<'Yes or No' | 'Reference Asset' | 'Custom'>('Yes or No');
	let referenceWorksheetId = $state('');
	let customValues = $state<SelectItemType[]>([]);
	let customInputValue = $state('');

	let textType = $state<'Paragraph' | 'Heading'>('Heading');

	let tableInCertificate = $state(false);
	//If the modal is open,it resets the values
	$effect(() => {
		if (open) {
			selectedComponent = 'Input';
			componentName = '';
			showInCertificate = false;
			isRequired = false;
			isReadOnly = false;
			inputType = 'Number';
			roundingDigits = 0;
			selectType = 'Yes or No';
			referenceWorksheetId = '';
			customValues = [];
			customInputValue = '';
			textType = 'Heading';
			tableInCertificate = false;
			const focusComponent = document.getElementById('component-type');
			focusComponent?.focus();
		}
	});

	// Convert data for Select
	const componentOptions = [
		{ value: 'Input', label: 'Input' },
		{ value: 'Select', label: 'Select' },
		{ value: 'Table', label: 'Table' },
		{ value: 'Text', label: 'Text' },
		{ value: 'Graph', label: 'Graph' }
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

	const textTypeOptions = [
		{ value: 'Paragraph', label: 'Paragraph' },
		{ value: 'Heading', label: 'Heading' }
	];

	const worksheetOptions = [
		{ value: 'a', label: 'Pressure gauge reference' },
		{ value: 'b', label: 'Multimeter reference' }
	];

	// --- Event Handlers ---
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

	const handleCreateComponent = () => {
		const component: Component = {
			functionId: worksheetManager.getCurrentActiveFunction()?.functionId || '',
			componentType: selectedComponent,
			componentId: worksheetManager.generateUniqueId(componentName, 'component'),
			label: componentName,
			showInCertificate,
			isRequired,
			isReadOnly,
			isDisabled,
			order: 0,
			defaultValue: '',
			certificateVisibilityBasedonExpression: false,
			certificateVisibilityExpression: '',
			isComponentDisabledOnExpression: false,
			disableExpression: '',
			isValidationEnabled: false,
			validationExpression: '',
			validationMessage: '',
			isInvalid: false,
			isExpressionEnabled: false,
			valueExpression: '',
			inputComponent: {
				type: inputType,
				roundingDigits
			},
			textComponent: {
				type: textType
			},
			selectComponent: {
				type: selectType,
				referenceWorksheetId,
				values:
					selectType === 'Custom'
						? customValues
						: selectType === 'Yes or No'
							? [
									{ key: 'true', value: 'Yes' },
									{ key: 'false', value: 'No' }
								]
							: []
			},
			tableComponent: {
				tableName: componentName,
				showTableNameInWorksheet: tableInCertificate,
				columns: [],
				isTableRowExpressionEnabled: false,
				tableRowExpression: ''
			}
		};
		// console.log('New Component:', component);
		worksheetManager.addNewComponent(component);
		open = false;
	};
</script>

<Modal.Root bind:isOpen={open} title="Add New Component">
	<form onsubmit={handleCreateComponent} class="space-y-6 pt-2">
		<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
			<div class="space-y-1">
				<label for="component-type">Component</label>
				<Select
					size="small"
					id="component-type"
					bind:value={selectedComponent}
					items={componentOptions}
					placeholder="Select a component"
					class="w-full"
				/>
			</div>

			<div class="space-y-1">
				{#if selectedComponent === 'Input'}
					<label for="input-type">Input Type</label>
					<Select
						size="small"
						id="input-type"
						bind:value={inputType}
						items={inputTypeOptions}
						placeholder="Select input type"
						class="w-full"
					/>
				{:else if selectedComponent === 'Select'}
					<label for="select-type">Select Type</label>
					<Select
						size="small"
						id="select-type"
						bind:value={selectType}
						items={selectTypeOptions}
						placeholder="Select type"
						class="w-full"
					/>
				{:else if selectedComponent === 'Text'}
					<label for="text-type">Text Type</label>
					<Select
						size="small"
						id="text-type"
						bind:value={textType}
						items={textTypeOptions}
						placeholder="Select text type"
						class="w-full"
					/>
				{/if}
			</div>

			<div class="space-y-1 md:col-span-2">
				<label for="component-label">
					{selectedComponent === 'Table' ? 'Table Name' : 'Component Label'}
				</label>
				<Input
					size="small"
					id="component-label"
					bind:value={componentName}
					placeholder={selectedComponent === 'Table'
						? 'e.g., Measurement Results'
						: 'e.g., Ambient Temperature'}
				/>
			</div>

			<div class="md:col-span-2">
				{#if selectedComponent === 'Input' && inputType === 'Number'}
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

				{#if selectedComponent === 'Select' && selectType === 'Reference Asset'}
					<div class="space-y-1">
						<label for="reference-worksheet">Worksheet</label>
						<Select
							size="small"
							id="reference-worksheet"
							bind:value={referenceWorksheetId}
							items={worksheetOptions}
							placeholder="Select a worksheet"
							class="w-full"
						/>
					</div>
				{/if}
			</div>
		</div>

		{#if selectedComponent === 'Select' && selectType === 'Custom'}
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
			{#if selectedComponent === 'Table'}
				<div class="flex items-center space-x-2">
					<Checkbox id="table-in-certificate" bind:checked={tableInCertificate} />
					<label for="table-in-certificate" class="cursor-pointer font-normal">
						Show table name in certificate
					</label>
				</div>
			{/if}
			<div class="flex items-center space-x-2">
				<Checkbox id="show-in-certificate" bind:checked={showInCertificate} />
				<label for="show-in-certificate" class="cursor-pointer font-normal">
					Show in certificate?
				</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="component-mandatory" bind:checked={isRequired} />
				<label for="component-mandatory" class="cursor-pointer font-normal">Is Required?</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="component-readonly" bind:checked={isReadOnly} />
				<label for="component-readonly" class="cursor-pointer font-normal">Is readonly?</label>
			</div>
			<div class="flex items-center space-x-2">
				<Checkbox id="component-disabled" bind:checked={isDisabled} />
				<label for="component-disabled" class="cursor-pointer font-normal">Is Disabled?</label>
			</div>
		</div>

		<div class="flex justify-end pt-4">
			<Button type="submit" size="small">Add Component</Button>
		</div>
	</form>
</Modal.Root>
