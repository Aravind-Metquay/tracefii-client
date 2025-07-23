<script lang="ts">
	import type { TableColumn } from '@/Types';
	import { Code } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

	let { currentColumn, onExpressionModal } = $props();
	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	function handleColumnUpdate(updates: Partial<TableColumn>) {
		worksheetManager.updateBaseColumnProperties(
			currentColumn.tableId,
			currentColumn.columnId,
			updates
		);
	}
</script>

{#if currentColumn}
	<div class="space-y-4 p-4">
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Column Name</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={currentColumn.columnName}
				oninput={(e) => handleColumnUpdate({ columnName: e.currentTarget.value })}
			/>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Default Value</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={currentColumn.defaultValue}
				oninput={(e) => handleColumnUpdate({ defaultValue: e.currentTarget.value })}
			/>
		</div>

		<div class="flex justify-between">
			<div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={currentColumn.isRequired}
						onchange={(e) => handleColumnUpdate({ isRequired: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Required</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={currentColumn.isReadOnly}
						onchange={(e) => handleColumnUpdate({ isReadOnly: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Read Only</label>
				</div>
			</div>
			<div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={currentColumn.isDisabled}
						onchange={(e) => handleColumnUpdate({ isDisabled: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Disabled</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={currentColumn.showInCertificate}
						onchange={(e) => handleColumnUpdate({ showInCertificate: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Show in Certificate</label>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Order</label>
			<input
				type="number"
				class="w-full rounded-md border p-2 text-sm"
				bind:value={currentColumn.order}
				oninput={(e) => handleColumnUpdate({ order: parseInt(e.currentTarget.value) })}
			/>
		</div>

		{#each [{ key: 'isRepeatColumn', label: 'Is Repeat Column?', expr: 'repeatExpression' }, { key: 'isComponentDisabledOnExpression', label: 'Disable on Expression', expr: 'disableExpression' }, { key: 'isExpressionEnabled', label: 'Apply Expression on Value', expr: 'valueExpression' }, { key: 'isValidationEnabled', label: 'Apply Validation', expr: 'validationExpression' }, { key: 'certificateVisibilityBasedonExpression', label: 'Certificate Visibility Expression', expr: 'certificateVisibleExpression' }] as item}
			<div class="space-y-2">
				<div class="flex items-center justify-between">
					<div class="flex items-center space-x-2">
						<input
							type="checkbox"
							checked={currentColumn[item.key]}
							onchange={(e) => handleColumnUpdate({ [item.key]: e.currentTarget.checked })}
						/>
						<label class="text-sm text-gray-700">{item.label}</label>
					</div>
					<button
						class="rounded bg-blue-500 p-1 text-white disabled:opacity-50"
						disabled={!currentColumn[item.key]}
						onclick={() => onExpressionModal(item.expr)}
					>
						<Code size={16} />
					</button>
				</div>
			</div>
		{/each}

		<!-- Input Component Fields -->
		{#if currentColumn.columnType === 'Input' && currentColumn.inputComponent}
			<div class="space-y-4 border-t pt-4">
				<h3 class="text-sm font-medium text-gray-700">Input Settings</h3>
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Type</label>
					<select
						class="w-full rounded-md border p-2 text-sm"
						bind:value={currentColumn.inputComponent.type}
						onchange={(e) =>
							handleColumnUpdate({
								inputComponent: {
									type: e.currentTarget.value as 'Text' | 'Number',
									roundingDigits: e.currentTarget.value === 'Number' ? 0 : 0
								}
							})}
					>
						<option value="Text">Text</option>
						<option value="Number">Number</option>
					</select>
				</div>

				{#if currentColumn.inputComponent.type === 'Number'}
					<div class="space-y-2">
						<label class="block text-sm font-medium text-gray-700">Rounding Digits</label>
						<input
							type="number"
							class="w-full rounded-md border p-2 text-sm"
							bind:value={currentColumn.inputComponent.roundingDigits}
							oninput={(e) =>
								handleColumnUpdate({
									inputComponent: {
										type: currentColumn.inputComponent.type,
										roundingDigits:
											e.currentTarget.value === '' ? 0 : parseInt(e.currentTarget.value)
									}
								})}
						/>
					</div>
				{/if}
			</div>
		{/if}

		{#if currentColumn.columnType === 'Select' && currentColumn.selectComponent}
			<div class="space-y-4 border-t pt-4">
				<h3 class="text-sm font-medium text-gray-700">Select Settings</h3>
				<div class="space-y-2">
					<label class="block text-sm font-medium text-gray-700">Type</label>
					<select
						class="w-full rounded-md border p-2 text-sm"
						bind:value={currentColumn.selectComponent.type}
						onchange={(e) =>
							handleColumnUpdate({
								selectComponent: {
									...currentColumn.selectComponent,
									type: e.currentTarget.value,
									values:
										e.currentTarget.value === 'Yes or No'
											? [
													{ key: 'yes', value: 'Yes' },
													{ key: 'no', value: 'No' }
												]
											: []
								}
							})}
					>
						<option value="Yes or No">Yes or No</option>
						<option value="Reference Asset">Reference Asset</option>
						<option value="Custom">Custom</option>
					</select>
				</div>
			</div>
		{/if}
	</div>
{/if}
