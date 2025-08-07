<script lang="ts">
	import { getContext } from 'svelte';
	import Function from './function.svelte';
	import type { WorksheetManager } from '@/Types.ts';
	import { Button } from '@/components';

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');
</script>

<div class="flex h-full flex-col">
	<div class="flex h-[60px] items-center justify-between border-b p-2">
		<p class="text-xl">Functions</p>
		<Button onclick={() => worksheetManager.addNewFunction()} variant="primary" size="small">
			Add
		</Button>
	</div>

	<div class="flex-1 overflow-y-auto">
		{#each worksheetManager.getAllFunctions() as fn, i (fn.functionId)}
			<Function {fn} {worksheetManager} {i} />
		{/each}
	</div>
</div>
