<script lang='ts'>
	import { goto } from "$app/navigation";
	import { useUserWithOrg } from "@/api/queries/user-query";
    import {auth} from '@/svelte-auth0'
	import type { UserType } from "@/Types";

    // const userQuery = useUserWithOrg(auth.user?.email , '')
   	const userDetails: Omit<UserType, "_id"> = {
			firstName: "Sudhi",
			lastName: "Test",
			emailId: "sudhionboardinga90@gmail.com",
			createdBy: "Sudhi",
			system_role: "Service Provider",
			orgId: ""
		};
    const userMappings = JSON.parse(localStorage.getItem('userMappings') || '{}');
    const userQuery = useUserWithOrg(userDetails.emailId , '')

    $effect(() => {
        if(userMappings.userId && userMappings.orgId) {
           goto('/calibration-lab/dashboard');
        }else if (!$userQuery.data?.success && $userQuery.data?.status === 404) {
            goto('/calibration-lab/onboarding',{state: { userDetails: userDetails}});
        }else if ($userQuery.data?.success && $userQuery.data?.user) {
            localStorage.setItem('userMappings', JSON.stringify({ userId: $userQuery.data.user._id, orgId: $userQuery.data.user.orgId }));
            goto('/calibration-lab/dashboard');
        } else if($userQuery.isError) {
            if (confirm("Something went wrong . Please try again")) {
              goto('/auth/login');
            }
        }
    });
</script>

{#if $userQuery.isLoading}
    <p>Loading...</p>
{:else if $userQuery.isError}
    <p>Error loading data!</p> 
{/if}