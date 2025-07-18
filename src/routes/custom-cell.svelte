<script lang="ts">
	let { value, showIcon = false }: { value: any; showIcon: boolean } = $props();
</script>

<div class="custom-cell">
	{#if showIcon}
		<span class="icon">📧</span>
	{/if}
	<span>{value}</span>
</div>

<style>
	.custom-cell {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.icon {
		font-size: 0.875rem;
	}
</style>
