<script lang="ts">
	import { useGetUser } from "@/api/queries/user-query";

	const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{userId: "", orgId: ""}');
	const user = useGetUser(userMappings.userId,"");
</script>

{#if $user.isLoading || $user.isFetching}
	<div>Loading...</div>
{:else}
	<div>{$user.data?.firstName}</div>
{/if}
