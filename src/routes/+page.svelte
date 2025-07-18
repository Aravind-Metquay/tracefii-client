<script lang="ts">
	import Signup from './auth/Signup.svelte';
	import Login from './auth/Login.svelte';
	import ForgotPassword from './auth/ForgotPassword.svelte';
	import { useAuth } from '@/svelte-auth0';
    //const { isAuthenticated, isLoading } = useAuth();
	let stage: 'Signup' | 'Login' | 'Forgotpassword' = 'Login';
</script>

{#if stage === 'Signup'}
	<Signup bind:stage />
{:else if stage === 'Login'}
	<Login bind:stage />
{:else if stage === 'Forgotpassword'}
	<ForgotPassword bind:stage />
{/if}
