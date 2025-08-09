<script lang="ts">
    import { env } from '$env/dynamic/public';
    import '../index.css';
    import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
    import { browser } from '$app/environment';
    import { initAuth, auth, type Auth0Config } from '@/svelte-auth0';
    import { appState } from '@/global-store.svelte';
    import { userService } from "@/api/Services/user-service";

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

    $effect(() => {
        async function refreshUserData() {
            if (!auth.isLoading && auth.isAuthenticated && auth.user?.email) {
                try {
                    const user = await userService.getUserWithOrg(auth.user.email, '');
                    appState.setUser(user); 
                } catch (error) {
                    console.error('Failed to refresh user data:', error);
                }
            } else if (!auth.isAuthenticated) {
                appState.clearUser();
            }
        }
        
        refreshUserData();
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