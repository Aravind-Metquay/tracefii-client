<script lang="ts">
	import type { Component, TableColumn } from '@/Types';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '@/Types';
	import { AlertCircle, Repeat } from '@lucide/svelte';
	import InputColumnComponent from './column-components/input-column-component.svelte';
	import SelectColumnComponent from './column-components/select-column-component.svelte';
	import AddColumnModal from './column-components/add-column-modal.svelte';
	import { Button } from '@/components';

	let { component }: { component: Component } = $props();
	let worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let isOpen: boolean = $state(false);
	let tableData = $derived(
		worksheetManager.getComponentValue(component.functionId, component.componentId)
	);

	function onOpen() {
		isOpen = true;
	}
	function onClose() {
		isOpen = false;
	}

	function handleAddRow() {
		if (component.tableComponent?.columns) {
			worksheetManager.addTableRow(
				component.functionId,
				component.componentId,
				component.tableComponent.columns
			);
		}
	}

	function isGeneratedRepeatColumn(columnId: string) {
		return columnId.includes('_repeat_');
	}

	function getBaseColumnForRepeat(columnId: string) {
		const baseId = columnId.split('_repeat_')[0];
		return component.tableComponent?.columns.find((col) => col.columnId === baseId);
	}

	function getEffectiveColumnProps(column: TableColumn) {
		if (isGeneratedRepeatColumn(column.columnId)) {
			const baseColumn = getBaseColumnForRepeat(column.columnId);
			if (baseColumn) {
				return {
					...column,
					isRequired: baseColumn.isRequired,
					validationExpression: baseColumn.validationExpression,
					validationMessage: baseColumn.validationMessage,
					isDisabled: baseColumn.isDisabled,
					isReadOnly: baseColumn.isReadOnly,
					certificateVisibilityExpression: baseColumn.certificateVisibilityExpression,
					showInCertificate: baseColumn.showInCertificate
				};
			}
		}
		return column;
	}

	const visibleColumns = $derived.by(
		() =>
			component.tableComponent?.columns.filter((column) => {
				if (isGeneratedRepeatColumn(column.columnId)) return true;
				if (column.isRepeatColumn) {
					const hasGeneratedColumns = component.tableComponent?.columns.some((col) =>
						col.columnId.startsWith(`${column.columnId}_repeat_`)
					);
					return !hasGeneratedColumns;
				}
				return true;
			}) ?? []
	);
</script>

{#if component.componentType === 'Table' && component.tableComponent}
	<div
		class="col-span-3 flex flex-col rounded-md border p-2"
		onclick={() => {
			worksheetManager.setCurrentActiveComponent(component);
			worksheetManager.setCurrentActiveColumn(null);
		}}
	>
		<div class="mb-4 flex items-center justify-between">
			<div class="max-w-xs">
				<input
					type="text"
					value={component.tableComponent.tableName}
					oninput={(e) =>
						worksheetManager.updateTableComponent(component.componentId, {
							tableName: e.currentTarget.value
						})}
					class="rounded border border-transparent px-2 py-1 text-sm font-medium hover:bg-gray-50 focus:border-gray-200 focus:ring-0"
				/>
			</div>
			<div class="flex gap-2">
				<Button
					size="tiny"
					variant="primary"
					onclick={handleAddRow}
					disabled={component.tableComponent.isTableRowExpressionEnabled}
				>
					Add Row
				</Button>
				<Button
					onclick={() => {
						onOpen();
						worksheetManager.setCurrentActiveComponent(component);
					}}
					size="tiny"
					variant="primary"
				>
					Add Column
				</Button>
			</div>
		</div>
		<div class="overflow-x-auto">
			<table class="w-full border-collapse">
				<thead>
					<tr>
						{#each visibleColumns as column (column.columnId)}
							<th
								class="cursor-pointer border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium hover:bg-gray-100"
								onclick={(e) => {
									e.stopPropagation();
									worksheetManager.setCurrentActiveColumn(column);
									worksheetManager.setCurrentActiveComponent(component);
								}}
							>
								<div class="flex items-center gap-2">
									<span>{getEffectiveColumnProps(column).columnName}</span>
									{#if getEffectiveColumnProps(column).isRequired}
										<span class="text-red-600">*</span>
									{/if}
									{#if getEffectiveColumnProps(column).isRepeatColumn}
										<div class="flex items-center gap-1" title="Repeat Column">
											<Repeat class="h-4 w-4 text-blue-500" />
											{#if !getEffectiveColumnProps(column).repeatExpression}
												<AlertCircle class="h-4 w-4 text-amber-500" />
											{/if}
										</div>
									{/if}
									{#if isGeneratedRepeatColumn(getEffectiveColumnProps(column).columnId)}
										<Repeat class="h-4 w-4 text-gray-400" />
									{/if}
								</div>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each tableData as row, rowIndex (row.key ?? rowIndex)}
						<tr>
							{#each visibleColumns as column (column.columnId)}
								{@const effectiveColumn = getEffectiveColumnProps(column)}
								{@const CellComponent =
									effectiveColumn.columnType === 'Input'
										? InputColumnComponent
										: SelectColumnComponent}

								<td class="border border-gray-200 px-4 py-2">
									<CellComponent
										column={effectiveColumn}
										value={row[column.columnId]}
										onChange={(val: any) =>
											worksheetManager.updateTableCell(
												component.functionId,
												component.componentId,
												row.key,
												column.columnId,
												val
											)}
									/>
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		<AddColumnModal bind:isOpen currentTable={component} />
	</div>
{/if}
