<script lang="ts">
	let { editor } = $props();

	let selectedObject = $derived(editor?.selectedObjects?.[0]);
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Date Properties</h4>

	<div>
		<label for="date-format" class="text-xs text-gray-600">Date Format</label>
		<select
			id="date-format"
			value={selectedObject?.dateFormat ?? 'MM/DD/YYYY'}
			onchange={(e) => editor?.changeDateFormat?.((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
		>
			<option value="MM/DD/YYYY">MM/DD/YYYY</option>
			<option value="DD/MM/YYYY">DD/MM/YYYY</option>
			<option value="YYYY-MM-DD">YYYY-MM-DD</option>
			<option value="MMM DD, YYYY">MMM DD, YYYY</option>
			<option value="DD MMM YYYY">DD MMM YYYY</option>
			<option value="MMMM DD, YYYY">MMMM DD, YYYY</option>
		</select>
	</div>

	<div>
		<label for="date-value" class="text-xs text-gray-600">Date Value</label>
		<input
			id="date-value"
			type="date"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.dateValue ?? new Date().toISOString().split('T')[0]}
			onchange={(e) => editor?.changeDateValue?.((e.target as HTMLInputElement).value)}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="date-font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="date-font-size"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.fontSize ?? 16}
				oninput={(e) => editor?.changeDateFontSize?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="date-font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="date-font-family"
				value={selectedObject?.fontFamily ?? 'Arial'}
				onchange={(e) => editor?.changeDateFontFamily?.((e.target as HTMLSelectElement).value)}
				class="w-full rounded border border-gray-300 p-2 text-sm"
			>
				<option>Arial</option>
				<option>Helvetica</option>
				<option>Times New Roman</option>
				<option>Georgia</option>
				<option>Verdana</option>
			</select>
		</div>
	</div>

	<div>
		<label class="flex items-center gap-2 text-xs text-gray-600">
			<input
				type="checkbox"
				checked={selectedObject?.useCurrentDate ?? false}
				onchange={(e) => editor?.changeDateUseCurrent?.((e.target as HTMLInputElement).checked)}
			/>
			Use Current Date
		</label>
	</div>
</div>
