<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data: any = [];

    const columns = [
        { id: 'name',           header: 'Worksheet Name', flexgrow: 1, sort: true, editor: 'text' },
        { id: 'email',          header: 'Worksheet Id',   flexgrow: 1, sort: true, editor: 'text' },
        { id: 'assetType',      header: 'Asset Type',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'createdBy',      header: 'Created By',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'createdAt',      header: 'Created At',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'modifiedBy',     header: 'Modified By',    flexgrow: 1, sort: true, editor: 'text' },
        { id: 'modifiedAt',     header: 'Modified At',    flexgrow: 1, sort: true, editor: 'text' },
        { id: 'actions',        header: 'Actions',        flexgrow: 1, sort: true, editor: 'text' },
    ];
</script>

<GridTable {data} {columns} />
