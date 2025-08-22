<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { initAuth, auth, type Auth0Config } from '@/svelte-auth0';
	import { goto } from '$app/navigation';
	import { setContext } from 'svelte';
	import { appState } from '@/global-store.svelte';

	let { children } = $props();

	const auth0Config: Auth0Config = {
		domain: env.PUBLIC_AUTH0_DOMAIN,
		clientID: env.PUBLIC_AUTH0_CLIENTID,
		redirectUri: env.PUBLIC_AUTH0_REDIRECT_URI,
		scope: 'openid profile email',
		responseType: 'token id_token',
		audience: env.PUBLIC_APP_AUTH0_API_URL
	};

	const queryClient = new QueryClient();

	if (browser) {
		initAuth(auth0Config);
	}

	$effect(() => {
		if (!auth.isLoading) {
			if (auth.isAuthenticated && auth.user) {
				appState.setAuth(auth.user)
				goto('/dashboard')
			} else {
				goto('/auth/signup');
			}
		}
	})
</script>

<QueryClientProvider client={queryClient}>
	{#if auth.isLoading}
		<p>Loading...</p>
	{:else}
		<main class="h-[100vh] bg-[#FAFAFA]">
			{@render children()}
		</main>
	{/if}
</QueryClientProvider>
