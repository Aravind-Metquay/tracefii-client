<script>
	import { goto } from '$app/navigation';
	import Signup from '@/application-components/auth/sign-up.svelte';
	import { auth } from '@/svelte-auth0';

	$effect(() => {
		if (!auth.isLoading) {
			if (auth.isAuthenticated) {
				goto('/dashboard');
			}
		}
	});
</script>

<Signup />