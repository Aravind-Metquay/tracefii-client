<script lang="ts">
	let { editor } = $props();

	let selectedObject = $derived(editor?.selectedObjects?.[0]);
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Image Properties</h4>

	<div>
		<label for="image-src" class="text-xs text-gray-600">Image Source</label>
		<input
			id="image-src"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.src ?? ''}
			placeholder="Enter image URL or path"
			oninput={(e) => editor?.changeImageSrc?.((e.target as HTMLInputElement).value)}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="image-width" class="text-xs text-gray-600">Width</label>
			<input
				id="image-width"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.width ?? 100}
				oninput={(e) => editor?.changeImageWidth?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="image-height" class="text-xs text-gray-600">Height</label>
			<input
				id="image-height"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.height ?? 100}
				oninput={(e) => editor?.changeImageHeight?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>
	</div>

	<div>
		<label for="image-fit" class="text-xs text-gray-600">Object Fit</label>
		<select
			id="image-fit"
			value={selectedObject?.objectFit ?? 'cover'}
			onchange={(e) => editor?.changeImageFit?.((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
		>
			<option value="cover">Cover</option>
			<option value="contain">Contain</option>
			<option value="fill">Fill</option>
			<option value="scale-down">Scale Down</option>
		</select>
	</div>
</div>