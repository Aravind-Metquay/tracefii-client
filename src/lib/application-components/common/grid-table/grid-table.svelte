<script lang="ts">
	// @ts-ignore
	import { Grid, Material } from 'wx-svelte-grid';
	let { data, columns } = $props();
</script>

<Material>
	<div class="row-borders-only">
		<Grid {data} {columns} />
	</div>
</Material>

<style>
	:global(.row-borders-only) {
		--wx-table-cell-border: 1px solid #e5e7eb;
		--wx-table-header-border: 1px solid #e5e7eb;
		--wx-table-header-cell-border: none;
	}

	/* Ensure only bottom borders show (not verticals) */
	:global(.row-borders-only .wx-cell) {
		border-right: none !important;
	}
</style>
