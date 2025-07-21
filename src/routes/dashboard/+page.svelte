<script lang='ts'>
	import { auth } from "@/svelte-auth0";

    // console.log(auth.user)

    $effect(()=>{
        if(!auth.isLoading){
            if(auth.isAuthenticated){
                console.log(auth.user)
            }else{
                console.log("Not authenticated")
            }
        }
    })
</script>