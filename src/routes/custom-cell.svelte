<script lang="ts">
	let { value, showIcon = false }: { value: any; showIcon: boolean } = $props();
</script>

<div class="custom-cell">
	{#if showIcon}
		<span class="icon">📧</span>
	{/if}
	<span>{value}</span>
</div>
