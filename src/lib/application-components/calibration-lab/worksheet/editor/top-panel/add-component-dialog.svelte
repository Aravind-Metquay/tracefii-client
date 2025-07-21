<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label';
	import {
		Select,
		SelectContent,
		SelectItem,
		SelectTrigger,
		SelectLabel
	} from '$lib/components/ui/select';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
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

	let inputType = $state<'Number' | 'Text'>('Number');
	let roundingDigits = $state(0);

	let selectType = $state<'Yes or No' | 'Reference Asset' | 'Custom'>('Yes or No');
	let referenceWorksheetId = $state('');
	let customValues = $state<SelectItemType[]>([]);
	let customInputValue = $state('');

	let textType = $state<'Paragraph' | 'Heading'>('Heading');

	let tableInCertificate = $state(false);

	const components = [
		{ value: 'Input', label: 'Input' },
		{ value: 'Select', label: 'Select' },
		{ value: 'Table', label: 'Table' },
		{ value: 'Text', label: 'Text' },
		{ value: 'Graph', label: 'Graph' }
	];
	const staticReferenceWorksheets = [
		{ varId: 'a', worksheetName: 'Pressure gauge reference' },
		{ varId: 'b', worksheetName: 'Multimeter reference' }
	];

	// --- Derived State for dynamic UI text ---
	const componentTriggerContent = $derived(
		components.find((c) => c.value === selectedComponent)?.label ?? 'Select a component'
	);
	const selectedRefWorksheetName = $derived(
		staticReferenceWorksheets.find((ws) => ws.varId === referenceWorksheetId)?.worksheetName ??
			'Select a worksheet'
	);

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
			order: 0,
			defaultValue: '',
			certificateVisibilityBasedonExpression: false,
			certificateVisibilityExpression: '',
			isComponentDisabledOnExpression: false,
			disableExpression: '',
			isDisabled: false,
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
		console.log('New Component:', component);
		// worksheetManager.addNewComponent(component);
		open = false;
	};
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>Add New Component</Dialog.Title>
		</Dialog.Header>
		<form onsubmit={handleCreateComponent} class="space-y-6 pt-2">
			<div class="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
				<div class="space-y-1">
					<Label for="component-type">Component</Label>
					<Select type="single" bind:value={selectedComponent}>
						<SelectTrigger id="component-type" class="w-full">{componentTriggerContent}</SelectTrigger>
						<SelectContent>
							{#each components as component}
								<SelectItem value={component.value}>{component.label}</SelectItem>
							{/each}
						</SelectContent>
					</Select>
				</div>

				<div class="space-y-1">
					{#if selectedComponent === 'Input'}
						<Label for="input-type">Input Type</Label>
						<Select type="single" bind:value={inputType}>
							<SelectTrigger id="input-type" class="w-full">{inputType}</SelectTrigger>
							<SelectContent>
								<SelectItem value={'Number'}>Number</SelectItem>
								<SelectItem value={'Text'}>Text</SelectItem>
							</SelectContent>
						</Select>
					{:else if selectedComponent === 'Select'}
						<Label for="select-type">Select Type</Label>
						<Select type="single" bind:value={selectType}>
							<SelectTrigger id="select-type" class="w-full">{selectType}</SelectTrigger>
							<SelectContent>
								<SelectItem value={'Yes or No'}>Yes or No</SelectItem>
								<SelectItem value={'Reference Asset'}>Reference Asset</SelectItem>
								<SelectItem value={'Custom'}>Custom</SelectItem>
							</SelectContent>
						</Select>
					{:else if selectedComponent === 'Text'}
						<Label for="text-type">Text Type</Label>
						<Select type="single" bind:value={textType}>
							<SelectTrigger id="text-type" class="w-full">{textType}</SelectTrigger>
							<SelectContent>
								<SelectItem value={'Paragraph'}>Paragraph</SelectItem>
								<SelectItem value={'Heading'}>Heading</SelectItem>
							</SelectContent>
						</Select>
					{/if}
				</div>

				<div class="space-y-1 md:col-span-2">
					<Label for="component-label">
						{selectedComponent === 'Table' ? 'Table Name' : 'Component Label'}
					</Label>
					<Input
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
							<Label for="rounding-digits">Rounding Digits</Label>
							<Input
								id="rounding-digits"
								type="number"
								bind:value={roundingDigits}
								placeholder="e.g., 2"
							/>
						</div>
					{/if}

					{#if selectedComponent === 'Select' && selectType === 'Reference Asset'}
						<div class="space-y-1">
							<Label for="reference-worksheet">Worksheet</Label>
							<Select type="single" bind:value={referenceWorksheetId}>
								<SelectTrigger id="reference-worksheet" class="w-full">
									{selectedRefWorksheetName}
								</SelectTrigger>
								<SelectContent>
									{#each staticReferenceWorksheets as ws}
										<SelectItem value={ws.varId}>{ws.worksheetName}</SelectItem>
									{/each}
								</SelectContent>
							</Select>
						</div>
					{/if}
				</div>
			</div>

			{#if selectedComponent === 'Select' && selectType === 'Custom'}
				<div class="space-y-3">
					<Label for="custom-values-input">Custom Values</Label>
					<Input
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
						<Label for="table-in-certificate" class="cursor-pointer font-normal">
							Show table name in certificate
						</Label>
					</div>
				{/if}
				<div class="flex items-center space-x-2">
					<Checkbox id="show-in-certificate" bind:checked={showInCertificate} />
					<Label for="show-in-certificate" class="cursor-pointer font-normal">
						Show in certificate?
					</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="component-mandatory" bind:checked={isRequired} />
					<Label for="component-mandatory" class="cursor-pointer font-normal">Is mandatory?</Label>
				</div>
				<div class="flex items-center space-x-2">
					<Checkbox id="component-readonly" bind:checked={isReadOnly} />
					<Label for="component-readonly" class="cursor-pointer font-normal">Is readonly?</Label>
				</div>
			</div>

			<div class="flex justify-end pt-4">
				<Button type="submit" size="sm">Add Component</Button>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>
