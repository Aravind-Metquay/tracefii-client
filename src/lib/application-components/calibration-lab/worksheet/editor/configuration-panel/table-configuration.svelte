<script lang="ts">
	import { Code } from '@lucide/svelte';
	import type { WorksheetManager } from '@/Types';
	import { getContext } from 'svelte';
	import type { Component, TableColumn, TableComponent } from '@/Types';

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');
	let { component, onExpressionModal } = $props();

	function handleComponentUpdate(updates: Partial<Component>) {
		worksheetManager.updateBaseComponentProperties(component.componentId, updates);
	}

	function handleTableUpdate(updates: Partial<TableComponent>) {
		worksheetManager.updateTableComponent(component.componentId, updates);
	}

	function handleColumnSelect(column: TableColumn) {
		worksheetManager.setCurrentActiveColumn(column);
	}
</script>

{#if component?.tableComponent}
	<div class="space-y-4 p-4">
		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Table Name</label>
			<input
				type="text"
				class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
				bind:value={component.tableComponent.tableName}
				oninput={(e) => handleTableUpdate({ tableName: e.currentTarget.value })}
			/>
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

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Order</label>
			<input
				type="number"
				class="w-full rounded-md border p-2 text-sm"
				bind:value={component.order}
				oninput={(e) => handleComponentUpdate({ order: parseInt(e.currentTarget.value) })}
			/>
		</div>

		<div class="space-y-2">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<input
						type="checkbox"
						checked={component.tableComponent.isTableRowExpressionEnabled}
						onchange={(e) =>
							handleTableUpdate({
								isTableRowExpressionEnabled: e.currentTarget.checked,
								tableRowExpression: e.currentTarget.checked
									? (component.tableComponent.tableRowExpression ?? '')
									: ''
							})}
					/>
					<label class="text-sm text-gray-700">Apply Table Row Expression</label>
				</div>
				<button
					class="rounded bg-blue-500 p-1 text-white disabled:opacity-50"
					disabled={!component.tableComponent.isTableRowExpressionEnabled}
					onclick={() => onExpressionModal('tableRowExpression')}
				>
					<Code size={16} />
				</button>
			</div>
		</div>

		<div class="space-y-2">
			<label class="block text-sm font-medium text-gray-700">Columns</label>
			<div class="space-y-2">
				{#each component.tableComponent.columns as column (column.columnId)}
					<div
						class="flex cursor-pointer items-center justify-between rounded-md border p-2 hover:bg-gray-50"
						onclick={() => handleColumnSelect(column)}
					>
						<span class="text-sm">{column.columnName}</span>
						<span class="text-xs text-gray-500">#{column.order}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}
