<script lang="ts">
	import { Code } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

	let { component, onExpressionModal } = $props();

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	function handleComponentUpdate(updates: Partial<typeof component>) {
		worksheetManager.updateBaseComponentProperties(component.componentId, updates);
	}

	function handleInputUpdate(updates: Partial<typeof component>) {
		worksheetManager.updateInputComponent(component.componentId, updates);
	}
	
</script>

{#if component?.inputComponent}
	<div class="space-y-4 p-4">
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Label</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.label}
				oninput={(e) => handleComponentUpdate({ label: e.currentTarget.value })}
			/>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Default Value</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.defaultValue}
				oninput={(e) => handleComponentUpdate({ defaultValue: e.currentTarget.value })}
			/>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Input Type</label>
			<select
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.inputComponent.type}
				onchange={(e) => handleInputUpdate({ type: e.currentTarget.value })}
			>
				<option value="Text">Text</option>
				<option value="Number">Number</option>
			</select>
		</div>

		{#if component.inputComponent.type === 'Number'}
			<div class="space-y-2">
				<label class="block text-sm font-medium text-gray-700">Rounding Digits</label>
				<input
					type="number"
					class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
					bind:value={component.inputComponent.roundingDigits}
					oninput={(e) => handleInputUpdate({ roundingDigits: parseInt(e.currentTarget.value) })}
				/>
			</div>
		{/if}

		<div class="flex justify-between">
			<div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						checked={component.isRequired}
						onchange={(e) => handleComponentUpdate({ isRequired: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Required</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
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
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						checked={component.isDisabled}
						onchange={(e) => handleComponentUpdate({ isDisabled: e.currentTarget.checked })}
						
					/>
					<label class="text-sm text-gray-700">Disabled</label>
				</div>
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						checked={component.showInCertificate}
						onchange={(e) => handleComponentUpdate({ showInCertificate: e.currentTarget.checked })}
					/>
					<label class="text-sm text-gray-700">Show in Certificate</label>
				</div>
			</div>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Order</label>
			<input
				type="number"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.order}
				oninput={(e) => handleComponentUpdate({ order: parseInt(e.currentTarget.value) })}
			/>
		</div>

		<div class="space-y-4">
			{#each [{ key: 'isComponentDisabledOnExpression', label: 'Disable on Expression', expression: 'disableExpression' }, { key: 'isValidationEnabled', label: 'Apply Validation', expression: 'validationExpression' }, { key: 'isExpressionEnabled', label: 'Apply Expression on Value', expression: 'valueExpression' }, { key: 'certificateVisibilityBasedonExpression', label: 'Certificate Visibility Expression', expression: 'certificateVisibleExpression' }] as item}
				<div class="space-y-2">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<input
								type="checkbox"
								class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
								checked={component[item.key]}
								onchange={(e) =>
									handleComponentUpdate({
										[item.key]: e.currentTarget.checked,
										...(item.key === 'isComponentDisabledOnExpression' &&
											e.currentTarget.checked && {
												disableExpression: component.disableExpression ?? ''
											})
									})}
							/>
							<label class="text-sm text-gray-700">{item.label}</label>
						</div>
						<button
							class="rounded-md bg-blue-500 p-1 text-white disabled:opacity-50"
							disabled={!component[item.key]}
							onclick={() => onExpressionModal(item.expression)}
						>
							<Code size={16} />
						</button>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/if}
