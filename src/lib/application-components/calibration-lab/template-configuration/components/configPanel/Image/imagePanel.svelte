<script lang="ts">
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived(editor?.selectedObjects?.[0]);

	function handleImageSrcChange(value: string) {
		if (editor?.addImage && selectedObject) {
			editor.addImage(value); // Replaces the image
		}
	}

	function handleImageWidthChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeImageWidth && selectedObject) {
			editor.changeImageWidth(value);
		}
	}

	function handleImageHeightChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeImageHeight && selectedObject) {
			editor.changeImageHeight(value);
		}
	}
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
			oninput={(e) => handleImageSrcChange((e.target as HTMLInputElement).value)}
			disabled={!selectedObject || !editor?.addImage}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="image-width" class="text-xs text-gray-600">Width</label>
			<input
				id="image-width"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.width ?? 100}
				oninput={(e) => handleImageWidthChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeImageWidth}
			/>
		</div>

		<div>
			<label for="image-height" class="text-xs text-gray-600">Height</label>
			<input
				id="image-height"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.height ?? 100}
				oninput={(e) => handleImageHeightChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeImageHeight}
			/>
		</div>
	</div>
</div>
