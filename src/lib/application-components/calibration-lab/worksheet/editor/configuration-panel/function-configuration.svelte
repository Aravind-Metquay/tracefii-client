<script lang="ts">
	import { Code } from '@lucide/svelte';
	import { getContext } from 'svelte';
	import type { WorksheetManager } from '../store.svelte';

	const worksheetManager = getContext<WorksheetManager>('worksheetManager');

	let { function: functionData, onExpressionModal } = $props();

	function handleFunctionUpdate(updates: Partial<typeof functionData>) {
		// worksheetManager.updateFunction(functionData.functionId, updates);
	}
</script>

<div class="space-y-4 p-4">
	<!-- Function Name -->
	<div class="space-y-2">
		<label class="block text-sm font-medium text-gray-700">Function Name</label>
		<input
			type="text"
			class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={functionData.functionName}
			oninput={(e) => handleFunctionUpdate({ functionName: e.currentTarget.value })}
			placeholder="Enter function name"
		/>
	</div>

	<!-- Order -->
	<div class="space-y-2">
		<label class="block text-sm font-medium text-gray-700">Order</label>
		<input
			type="number"
			class="w-full rounded-md border p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
			bind:value={functionData.order}
			oninput={(e) => handleFunctionUpdate({ order: parseInt(e.currentTarget.value) })}
			min={0}
		/>
	</div>

	<!-- Repeat Expression -->
	<div class="space-y-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center space-x-2">
				<input
					type="checkbox"
					class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					checked={functionData.isRepeat}
					onchange={(e) => handleFunctionUpdate({ isRepeat: e.currentTarget.checked })}
				/>
				<label class="text-sm text-gray-700">Is Repeat Function?</label>
			</div>
			<button
				class="rounded bg-blue-500 p-1 text-white disabled:opacity-50"
				disabled={!functionData.isRepeat}
				onclick={() => onExpressionModal('repeatExpression')}
			>
				<Code size={16} />
			</button>
		</div>
	</div>
</div>
