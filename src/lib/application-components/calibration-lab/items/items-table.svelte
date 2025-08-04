<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data: any = [];

    const columns = [
    { id: 'id',            header: 'ID',                 flexgrow: 1, sort: true, editor: 'text' },
    { id: 'itemNumber',    header: 'Item Number',        flexgrow: 1, sort: true, editor: 'text' },
    { id: 'itemName',      header: 'Item Name',          flexgrow: 1, sort: true, editor: 'text' },
    { id: 'active',        header: 'Active',             flexgrow: 1, sort: true, editor: 'text' },
    { id: 'soldToCustomer',header: 'Sold to Customer',   flexgrow: 1, sort: true, editor: 'text' },
    { id: 'boughtFromVendor',header: 'Bought from Vendor', flexgrow: 1, sort: true, editor: 'text' },
    { id: 'trackedOnInventory', header: 'Tracked on Inventory', flexgrow: 1, sort: true, editor: 'text' },
    { id: 'createdBy',     header: 'Created By',         flexgrow: 1, sort: true, editor: 'text' },
    { id: 'createdAt',     header: 'Created At',         flexgrow: 1, sort: true, editor: 'text' },
    { id: 'modifiedBy',    header: 'Modified By',        flexgrow: 1, sort: true, editor: 'text' },
    { id: 'modifiedAt',    header: 'Modified At',        flexgrow: 1, sort: true, editor: 'text' },
    { id: 'actions',       header: 'Actions',            flexgrow: 1, sort: true, editor: 'text' }
];

</script>

<GridTable {data} {columns} />
