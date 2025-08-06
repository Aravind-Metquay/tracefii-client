<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { ModeWatcher } from 'mode-watcher';
	import { browser } from '$app/environment';

	import { initAuth, auth, type Auth0Config } from '@/svelte-auth0';
	import { setContext } from 'svelte';
	import { goto } from '$app/navigation';

	let { children } = $props();

	const auth0Config: Auth0Config = {
		domain: env.PUBLIC_AUTH0_DOMAIN,
		clientID: env.PUBLIC_AUTH0_CLIENTID,
		redirectUri: browser ? window.location.origin : '',
		scope: 'openid profile email',
		responseType: 'token id_token',
		audience: env.PUBLIC_APP_AUTH0_API_URL
	};

	const queryClient = new QueryClient();

	if (browser) {
		initAuth(auth0Config);
	}

	$inspect(auth);

	$effect(() => {
		if (!auth.isLoading) {
			if (auth.isAuthenticated) {
				console.log('Why is this not invoked');
				setContext('auth', auth.user);
			} else {
				// goto('/')
			}
		}
	});
</script>

<!-- <QueryClientProvider client={queryClient}>
	{#if auth.isLoading}
		<p>Loading...</p>
	{:else}
		<main class="h-[100vh] bg-[#FAFAFA]"> -->
{@render children()}
<!-- </main>
	{/if}
</QueryClientProvider> -->
