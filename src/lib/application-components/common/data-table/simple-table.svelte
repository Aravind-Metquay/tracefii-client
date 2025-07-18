<script lang="ts" generics="TData extends Record<string, any>">
    import {
        createColumnHelper,
        createSvelteTable,
        getCoreRowModel,
        renderSnippet,
        renderComponent,
        type Cell
    } from '@/application-components/common/data-table';
    import FlexRender from '@/application-components/common/data-table/flex-render.svelte';
    import type { ColumnConfig, ComponentRenderer } from './types';

    // Props
    let {
        data = $bindable<TData[]>(),
        columns = $bindable<ColumnConfig<TData>[]>()
    }: {
        data: TData[];
        columns: ColumnConfig<TData>[];
    } = $props();

    // Helper function to check if renderer is a component
    function isComponentRenderer(renderer: any): renderer is ComponentRenderer {
        return renderer && 'component' in renderer;
    }

    // Create table using $derived
    const table = $derived.by(() => {
        const columnHelper = createColumnHelper<TData>();

        const _columns = columns.map((column) => {
            const config: any = {};

            // Handle header
            if (typeof column.header === 'string') {
                config.header = column.header;
            } else {
                const { snippet: headerSnippet, value } = column.header;
                config.header = () => renderSnippet(headerSnippet, value);
            }

            // Handle cell renderer
            if (column.cellRenderer) {
                if (isComponentRenderer(column.cellRenderer)) {
                    const { component, props = {} } = column.cellRenderer;
                    config.cell = ({ cell }: { cell: Cell<TData, any> }) => {
                        return renderComponent(component, {
                            value: cell.getValue(),
                            ...props
                        });
                    };
                } else {
                    const cellSnippet = column.cellRenderer;
                    config.cell = ({ cell }: { cell: Cell<TData, any> }) => {
                        return renderSnippet(cellSnippet, cell.getValue());
                    };
                }
            }

            return columnHelper.accessor(column.id as any, config);
        });

        return createSvelteTable<TData>({
            columns: _columns,
            data,
            getCoreRowModel: getCoreRowModel()
        });
    });
</script>

<table>
	<thead>
		<tr>
			{#each table.getHeaderGroups() as headerGroup}
				{#each headerGroup.headers as header}
					<th>
						<FlexRender content={header.column.columnDef.header} context={header.getContext()} />
					</th>
				{/each}
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each table.getRowModel().rows as row}
			<tr>
				{#each row.getVisibleCells() as cell}
					<td>
						<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
