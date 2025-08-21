<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
    {
        itemNumber: 'HW-CPU-015',
        itemName: 'Intel Core i7 Processor',
        active: true,
        soldToCustomer: true,
        boughtFromVendor: true,
        trackedOnInventory: true,
        createdBy: 'Prakash Menon',
        createdAt: '2025-06-10T10:00:00Z',
        modifiedBy: 'Prakash Menon',
        modifiedAt: '2025-06-10T10:00:00Z'
    },
    {
        itemNumber: 'SW-CRM-A50',
        itemName: 'CRM Pro - Annual License',
        active: true,
        soldToCustomer: true,
        boughtFromVendor: false,
        trackedOnInventory: false,
        createdBy: 'Deepa Nair',
        createdAt: '2025-07-21T14:30:00Z',
        modifiedBy: 'Rajesh Pillai',
        modifiedAt: '2025-08-01T11:15:00Z'
    },
    {
        itemNumber: 'FD-SP-N01',
        itemName: 'Nendran Banana Chips (500g)',
        active: true,
        soldToCustomer: true,
        boughtFromVendor: true,
        trackedOnInventory: true,
        createdBy: 'Anitha Varma',
        createdAt: '2025-05-15T09:00:00Z',
        modifiedBy: 'Anitha Varma',
        modifiedAt: '2025-07-30T16:45:00Z'
    },
    {
        itemNumber: 'BK-TRV-002',
        itemName: 'A Short History of Travancore',
        active: false,
        soldToCustomer: true,
        boughtFromVendor: true,
        trackedOnInventory: true,
        createdBy: 'Prakash Menon',
        createdAt: '2024-11-20T12:00:00Z',
        modifiedBy: 'Deepa Nair',
        modifiedAt: '2025-08-02T18:00:00Z'
    },
    {
        itemNumber: 'SVC-IT-SUP',
        itemName: 'Annual IT Support Contract',
        active: true,
        soldToCustomer: true,
        boughtFromVendor: false,
        trackedOnInventory: false,
        createdBy: 'Rajesh Pillai',
        createdAt: '2025-01-15T11:00:00Z',
        modifiedBy: 'Rajesh Pillai',
        modifiedAt: '2025-01-15T11:00:00Z'
    },
    {
        itemNumber: 'TX-HND-C05',
        itemName: 'Kerala Cotton Kasavu Saree',
        active: true,
        soldToCustomer: true,
        boughtFromVendor: true,
        trackedOnInventory: true,
        createdBy: 'Anitha Varma',
        createdAt: '2025-04-05T15:20:00Z',
        modifiedBy: 'Deepa Nair',
        modifiedAt: '2025-07-28T09:55:00Z'
    }
];
    const columns = [
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
];

</script>

<GridTable {data} {columns} />
