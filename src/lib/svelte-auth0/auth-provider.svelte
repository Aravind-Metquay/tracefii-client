<script lang="ts">
  import { setAuthContext } from './auth-context.svelte';
  import type { Auth0Config } from './types';
  
  interface Props {
    config: Auth0Config;
    children?: any;
  }
  
  let { config, children }: Props = $props();
  
  const authStore = setAuthContext(config);
</script>

{@render children()}