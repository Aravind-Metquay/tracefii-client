<script lang="ts">
	import { env } from '$env/dynamic/public';
	import '../app.css';
		
	let { children } = $props();
	import { ModeWatcher } from "mode-watcher";
	import { type Auth0Config , AuthProvider } from '@/svelte-auth0';

	const auth0Config: Auth0Config = {
        domain: env.PUBLIC_AUTH0_DOMAIN,
        clientID: env.PUBLIC_AUTH0_CLIENTID,
        redirectUri: env.PUBLIC_AUTH0_REDIRECT_URI,
        scope: 'openid profile email',
        responseType: 'token id_token',
        audience: env.PUBLIC_APP_AUTH0_API_URL
    };
</script>

<!-- <ModeWatcher defaultMode={"dark"}/> -->
<AuthProvider config={auth0Config}> 
	<main class="h-[100vh] bg-[#FAFAFA]">
		{@render children()}
	</main>
</AuthProvider>