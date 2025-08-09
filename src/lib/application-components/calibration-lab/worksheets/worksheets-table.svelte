<script lang="ts">
    import GridTable from "@/application-components/common/grid-table/grid-table.svelte";
    const data = [
    {
        name: 'Digital Pressure Gauge Calibration',
        email: 'WS-CAL-PRES-01A',
        assetType: 'Measurement Equipment',
        createdBy: 'Sandeep Nair',
        createdAt: '2025-02-15T11:30:00Z',
        modifiedBy: 'Priya Varma',
        modifiedAt: '2025-07-20T10:05:00Z'
    },
    {
        name: 'Micropipette Performance Verification',
        email: 'WS-VER-PIP-003',
        assetType: 'Lab Equipment',
        createdBy: 'George Mathew',
        createdAt: '2025-05-10T09:00:00Z',
        modifiedBy: 'George Mathew',
        modifiedAt: '2025-05-10T09:00:00Z'
    },
    {
        name: 'Torque Wrench Inspection Sheet',
        email: 'WS-INSP-TORQ-05B',
        assetType: 'Mechanical Tool',
        createdBy: 'Lakshmi Pillai',
        createdAt: '2024-11-01T14:00:00Z',
        modifiedBy: 'Sandeep Nair',
        modifiedAt: '2025-06-25T16:22:00Z'
    },
    {
        name: 'Analytical Balance Linearity Test',
        email: 'WS-TEST-BAL-002',
        assetType: 'Lab Equipment',
        createdBy: 'Priya Varma',
        createdAt: '2025-08-01T12:15:00Z',
        modifiedBy: 'Priya Varma',
        modifiedAt: '2025-08-01T12:15:00Z'
    },
    {
        name: 'Electrical Safety Analyzer Checklist',
        email: 'WS-CHK-ELEC-007',
        assetType: 'Test Equipment',
        createdBy: 'George Mathew',
        createdAt: '2025-03-30T10:45:00Z',
        modifiedBy: 'Lakshmi Pillai',
        modifiedAt: '2025-04-15T13:00:00Z'
    }
];

    const columns = [
        { id: 'name',           header: 'Worksheet Name', flexgrow: 1, sort: true, editor: 'text' },
        { id: 'email',          header: 'Worksheet Id',   flexgrow: 1, sort: true, editor: 'text' },
        { id: 'assetType',      header: 'Asset Type',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'createdBy',      header: 'Created By',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'createdAt',      header: 'Created At',     flexgrow: 1, sort: true, editor: 'text' },
        { id: 'modifiedBy',     header: 'Modified By',    flexgrow: 1, sort: true, editor: 'text' },
        { id: 'modifiedAt',     header: 'Modified At',    flexgrow: 1, sort: true, editor: 'text' },
    ];
</script>

<GridTable {data} {columns} />
