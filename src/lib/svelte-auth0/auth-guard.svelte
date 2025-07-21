<script lang="ts">
	import { auth } from './auth.svelte';
	import { goto } from '$app/navigation';
	import { browser } from '$app/environment';

	interface Props {
		loginPath?: string;
		returnTo?: boolean;
		loadingComponent?: any;
		children?: any;
	}

	let { loginPath = '/login', returnTo = true, loadingComponent, children }: Props = $props();

	$effect(() => {
		if (!browser) return;

		if (!auth.isLoading && !auth.isAuthenticated && !auth.error) {
			const currentUrl = window.location.pathname + window.location.search;

			if (returnTo && currentUrl !== loginPath) {
				const returnPath = encodeURIComponent(currentUrl);
				goto(`${loginPath}?returnTo=${returnPath}`);
			} else {
				goto(loginPath);
			}
		}
	});

	$effect(() => {
		if (auth.error) {
			console.error('Authentication Error:', auth.error);
			goto(loginPath);
		}
	});
</script>

{#if auth.isLoading}
	{#if loadingComponent}
		{@render loadingComponent()}
	{:else}
		<div>Loading...</div>
	{/if}
{:else if auth.isAuthenticated}
	{@render children()}
{/if}
