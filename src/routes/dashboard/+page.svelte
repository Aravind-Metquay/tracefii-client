<script lang='ts'>
	import { useUserWithOrg } from "@/api/queries/user-query";
    import {auth} from '@/svelte-auth0'

    const userQuery = useUserWithOrg(auth.user?.email , '')
</script>

{#if $userQuery.isLoading}
    <p>Loading user data...</p>
{:else if $userQuery.isError}
    <p>Error loading data!</p>
{:else if $userQuery.data}
    <p>Welcome, {$userQuery.data.firstName}!</p>
{/if}