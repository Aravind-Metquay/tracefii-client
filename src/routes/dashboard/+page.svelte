<script lang=ts>
	import { getContext } from "svelte";

    const authUser = getContext("auth")
    console.log(authUser)
    
</script>