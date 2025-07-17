<script lang="ts">
	import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
</script>

<div class="flex items-center justify-center gap-2 h-screen">
	<Checkbox checked={true}/>
	<Checkbox checked={false}/>
	<Checkbox checked={false} indeterminate={true} />
	<Checkbox disabled={true} />
</div>
