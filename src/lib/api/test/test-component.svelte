<script lang="ts">
  import { setContext } from 'svelte';
  import type { QueryClient } from '@tanstack/svelte-query';

  export let client: QueryClient;
  export let hookCallback: () => any;

  export const result = { current: undefined as any };

  setContext('svelte-query-client', client);

  $: result.current = hookCallback();
</script>