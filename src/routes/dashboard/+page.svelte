<script lang=ts>
	import { goto } from "$app/navigation";
	import { userService } from "@/api/Services/user-service";
	import { appState } from "@/global-store.svelte";
	import { onMount } from "svelte";

    onMount(async()=>{
        const authUser = appState.getAuth()
        if(!authUser) goto('/')
        try {
            const user = await userService.getUserWithOrg(authUser.email!, '')
            if(user.system_role === 'Service Provider'){
                goto('/calibration-lab/dashboard')
            }else if(user.system_role === 'Admin'){
                goto('/admin/dashboard')
            }else if(user.system_role === 'Asset Owner'){
                goto('/asset-owner/dashboard')
            }
        } catch (error) {
            goto('/register')            
        }
    })
</script>