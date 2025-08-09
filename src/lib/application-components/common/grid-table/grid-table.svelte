<script lang="ts">
	import { Grid, Material } from 'wx-svelte-grid';
	let { data, columns } = $props();
	
</script>

<div class="pr-1">
	<Material>
		<Grid {data} {columns} />
	</Material>
</div>
