<script lang="ts">
  import { auth } from './auth.svelte';
  import type { Auth0Config } from './types';
  
  interface Props {
    config: Auth0Config;
    children?: any;
  }
  
  let { config, children }: Props = $props();
  
  $effect(() => {
    auth.init(config);
  });
</script>

{@render children()}