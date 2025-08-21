<script lang="ts">
	import GridTable from '@/application-components/common/grid-table/grid-table.svelte';
    import Buttoncell from './buttoncell.svelte';

interface User {
        id: number;
        firstname: string;
        lastname: string;
        email: string;
        user: string;
    }

    const data: User[] = [
        {
            id: 1,
            firstname: 'Emma',
            lastname: 'Wilson',
            email: 'calibrations@ozmetrology.com.au',
            user: 'emma.wilson'
        },
        {
            id: 2,
            firstname: 'Lars',
            lastname: 'Pedersen',
            email: 'info@nordlab.dk',
            user: 'lars.pedersen'
        },
        {
            id: 3,
            firstname: 'Thomas',
            lastname: 'Weber',
            email: 'service@aerocalibration.de',
            user: 'thomas.weber'
        },
        {
            id: 4,
            firstname: 'James',
            lastname: 'Thompson',
            email: 'support@meditechcal.co.uk',
            user: 'james.thompson'
        },
        {
            id: 5,
            firstname: 'Miguel',
            lastname: 'Rodriguez',
            email: 'quality@caltech-ind.com',
            user: 'miguel.rodriguez'
        },
        {
            id: 6,
            firstname: 'Marie',
            lastname: 'Dubois',
            email: 'contact@biolab-precision.ch',
            user: 'marie.dubois'
        },
        {
            id: 7,
            firstname: 'Min-Jun',
            lastname: 'Tan',
            email: 'calibration@singtech.com.sg',
            user: 'minjun.tan'
        },
        {
            id: 8,
            firstname: 'David',
            lastname: 'Chen',
            email: 'operations@precisionmetrics.com',
            user: 'david.chen'
        },
        {
            id: 9,
            firstname: 'Sarah',
            lastname: 'Johnson',
            email: 'contact@techcal.com',
            user: 'sarah.johnson'
        }
    ];

	 const columns = [
        { id: 'firstname', header: 'First Name', flexgrow: 1, sort: true },
        { id: 'lastname', header: 'Last Name', flexgrow: 1, sort: true },
        { id: 'email', header: 'Email ID', flexgrow: 1, sort: true },
        { id: 'user', header: 'User', flexgrow: 1, sort: true },
        { 
            id: 'actions', 
            header: 'Actions', 
            flexgrow: 1, 
            sort: false,
            cell: Buttoncell
        }
    ];
     function handleEdit(id: number) {
        console.log('Edit user with ID:', id);
        // Your edit logic here
    }

    function handleDelete(id: number) {
        console.log('Delete user with ID:', id);
        // Your delete logic here
    }
</script>

<GridTable {data} {columns} />

