<script lang="ts">
	let { function: functionData } = $props();

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
</div>
