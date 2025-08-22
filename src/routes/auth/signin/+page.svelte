<script>
	import { goto } from '$app/navigation';
	import Signin from '@/application-components/auth/sign-in.svelte';
	import { auth } from '@/svelte-auth0';

	$effect(() => {
		if (!auth.isLoading) {
			if (auth.isAuthenticated) {
				goto('/dashboard');
			}
		}
	});
</script>

<Signin />