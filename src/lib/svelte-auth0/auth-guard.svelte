<script lang="ts">
	import { useAuth } from './use-auth';
	import { goto } from '$app/navigation';

	interface Props {
		loginPath?: string;
		returnTo?: boolean;
		loadingComponent?: any;
		children?: any;
	}

	let { loginPath = '/login', returnTo = true, loadingComponent, children }: Props = $props();

	const auth = useAuth();

	$effect(() => {
		if (!auth.isLoading && !auth.isAuthenticated && !auth.error) {
			const currentUrl = window.location.pathname + window.location.search + window.location.hash;

			if (returnTo) {
				const returnPath = encodeURIComponent(currentUrl);
				goto(`${loginPath}?returnTo=${returnPath}`);
			} else {
				goto(loginPath);
			}
		}
	});

	$effect(() => {
		if (auth.error) {
			console.error(auth.error);
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
