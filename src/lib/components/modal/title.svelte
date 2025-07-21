<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		class?: string | undefined;
		children: Snippet | undefined;
	}

	let { class: _class = '', children }: Props = $props();
</script>

{#if children}
	<h3
		class="text-[24px] text-kui-light-gray-1000 dark:text-kui-dark-gray-1000 leading-[32px] font-semibold {_class}"
	>
		{@render children()}
	</h3>
{/if}
