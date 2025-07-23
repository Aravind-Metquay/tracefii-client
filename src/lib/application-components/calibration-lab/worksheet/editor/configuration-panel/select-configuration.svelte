<script lang="ts">
	import { Code, Plus, X } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

	let { component, onExpressionModal } = $props();

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	function handleComponentUpdate(updates: Partial<typeof component>) {
		worksheetManager.updateBaseComponentProperties(component.componentId, updates);
	}

	function handleSelectUpdate(updates: any) {
		worksheetManager.updateSelectComponent(component.componentId, updates);
	}

	const generateKey = (value: string): string => {
		return value.replace(/[^a-zA-Z]/g, '').toLowerCase();
	};

	const ensureUniqueKey = (baseKey: string, existingItems: any[]) => {
		let key = baseKey;
		let counter = 1;
		while (existingItems.some((item) => item.key === key)) {
			key = `${baseKey}${counter}`;
			counter++;
		}
		return key;
	};

	function handleAddItem() {
		if (!component.selectComponent) return;
		const newKey = ensureUniqueKey('item', component.selectComponent.values);
		handleSelectUpdate({
			values: [...component.selectComponent.values, { key: newKey, value: '' }]
		});
	}

	function handleUpdateItem(index: number, newValue: string) {
		if (!component.selectComponent) return;
		const filtered = component.selectComponent.values.filter((_: any, i: number) => i !== index);
		const newKey = ensureUniqueKey(generateKey(newValue), filtered);
		const newValues = [...component.selectComponent.values];
		newValues[index] = { key: newKey, value: newValue };
		handleSelectUpdate({ values: newValues });
	}

	function handleRemoveItem(index: number) {
		const newValues = component.selectComponent.values.filter((_: any, i: number) => i !== index);
		handleSelectUpdate({ values: newValues });
	}
</script>

{#if component?.selectComponent}
	<div class="space-y-4 p-4">
		<!-- Label -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Label</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.label}
				oninput={(e) => handleComponentUpdate({ label: e.currentTarget.value })}
			/>
		</div>

		<!-- Default Value -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Default Value</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.defaultValue}
				oninput={(e) => handleComponentUpdate({ defaultValue: e.currentTarget.value })}
			/>
		</div>

		<!-- Select Type -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Select Type</label>
			<select
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.selectComponent.type}
				onchange={(e) =>
					handleSelectUpdate({
						type: e.currentTarget.value,
						values:
							e.currentTarget.value === 'Yes or No'
								? [
										{ key: 'yes', value: 'Yes' },
										{ key: 'no', value: 'No' }
									]
								: []
					})}
			>
				<option value="Yes or No">Yes or No</option>
				<option value="Reference Asset">Reference Asset</option>
				<option value="Custom">Custom</option>
			</select>
		</div>

		<!-- Reference Worksheet (you can plug your own API here) -->
		{#if component.selectComponent.type === 'Reference Asset'}
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">Select Reference Worksheet</label>
				<select
					class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					onchange={(e) => handleSelectUpdate({ referenceWorksheetId: e.currentTarget.value })}
				>
					<option disabled selected>Select one (mock)</option>
					<option value="dummy-id">Worksheet A</option>
					<option value="another-id">Worksheet B</option>
				</select>
			</div>
		{/if}

		<!-- Custom Values -->
		{#if component.selectComponent.type === 'Custom'}
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<label class="text-sm font-medium text-gray-700">Values</label>
					<button
						class="flex items-center gap-1 rounded bg-blue-500 px-2 py-1 text-sm text-white hover:bg-blue-600"
						onclick={handleAddItem}
					>
						<Plus size={16} /> Add Value
					</button>
				</div>
				<div class="mt-2 space-y-2">
					{#each component.selectComponent.values as item, index}
						<div class="group flex items-center space-x-2 rounded-md bg-gray-50 p-2">
							<input
								type="text"
								class="flex-1 rounded-md border bg-white p-2 text-sm"
								value={item.value}
								oninput={(e) => handleUpdateItem(index, e.currentTarget.value)}
								placeholder="Enter value"
							/>
							<button
								onclick={() => handleRemoveItem(index)}
								class="text-gray-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
							>
								<X size={16} />
							</button>
						</div>
					{/each}
				</div>
			</div>
		{/if}

		<!-- Checkboxes -->
		<div class="flex justify-between">
			<div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={component.isRequired}
						onchange={(e) => handleComponentUpdate({ isRequired: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Required</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={component.isReadOnly}
						onchange={(e) => handleComponentUpdate({ isReadOnly: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Read Only</label>
				</div>
			</div>
			<div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={component.isDisabled}
						onchange={(e) => handleComponentUpdate({ isDisabled: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Disabled</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={component.showInCertificate}
						onchange={(e) => handleComponentUpdate({ showInCertificate: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Show in Certificate</label>
				</div>
			</div>
		</div>

		<!-- Order -->
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Order</label>
			<input
				type="number"
				class="w-full rounded-md border p-2 text-sm"
				bind:value={component.order}
				oninput={(e) => handleComponentUpdate({ order: parseInt(e.currentTarget.value) })}
			/>
		</div>

		<!-- Expression Toggles -->
		{#each [{ key: 'isComponentDisabledOnExpression', label: 'Disable on Expression', expr: 'disableExpression', extra: { disableExpression: '' } }, { key: 'isExpressionEnabled', label: 'Apply Expression on Value', expr: 'valueExpression' }, { key: 'isValidationEnabled', label: 'Apply Validation', expr: 'validationExpression' }, { key: 'certificateVisibilityBasedonExpression', label: 'Certificate Visibility Expression', expr: 'certificateVisibleExpression' }] as item}
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={component[item.key]}
							onchange={(e) =>
								handleComponentUpdate({
									[item.key]: e.currentTarget.checked,
									...(item.key === 'isComponentDisabledOnExpression' && e.currentTarget.checked
										? { disableExpression: component.disableExpression ?? '' }
										: {})
								})}
						/>
						<label class="text-sm text-gray-700">{item.label}</label>
					</div>
					<button
						class="rounded bg-blue-500 p-1 text-white disabled:opacity-50"
						disabled={!component[item.key]}
						onclick={() => onExpressionModal(item.expr)}
					>
						<Code size={16} />
					</button>
				</div>
			</div>
		{/each}
	</div>
{/if}
