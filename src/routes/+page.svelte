<script lang="ts">
    import Signup from "./auth/Signup.svelte";
    import Login from "./auth/Login.svelte";
    let stage: "Signup" | "Login" | "Forgotpassword" = "Signup"
</script>


{#if stage === "Signup"}
    <Signup bind:stage={stage}/>
{:else if stage === "Login"}
    <Login bind:stage={stage}/>
{/if}
