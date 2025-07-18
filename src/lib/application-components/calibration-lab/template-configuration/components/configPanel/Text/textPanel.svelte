<script lang="ts">
	import ColorPicker from 'svelte-awesome-color-picker';
	import { colord, type Colord } from 'colord';

	let { editor } = $props();

	let selectedObject = $derived(editor?.selectedObjects?.[0]);
	let color = $state<Colord>(colord('#000000'));

	$effect(() => {
		if (selectedObject?.fill) {
			color = colord(selectedObject.fill);
		}
	});

	function handleColorChange(colorData: {
		hsv: any | null;
		rgb: any | null;
		hex: string | null;
		color: Colord | null;
	}) {
		if (colorData.hex) {
			color = colord(colorData.hex);
			if (editor?.changeFillColor) {
				editor.changeFillColor(colorData.hex);
			}
		}
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Text Properties</h4>

	<div>
		<label for="content" class="text-xs text-gray-600">Content</label>
		<input
			id="content"
			class="w-full rounded border border-gray-300 p-2 text-sm"
			value={selectedObject?.text ?? ''}
			oninput={(e) => editor?.changeText?.((e.target as HTMLInputElement).value)}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="font-size"
				type="number"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.fontSize ?? 32}
				oninput={(e) => editor?.changeFontSize?.(Number((e.target as HTMLInputElement).value))}
			/>
		</div>

		<div>
			<label for="font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="font-family"
				value={selectedObject?.fontFamily ?? 'Arial'}
				onchange={(e) => editor?.changeFontFamily?.((e.target as HTMLSelectElement).value)}
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

	<div class="flex items-center gap-4">
		<button
			onclick={() =>
				editor?.changeFontWeight?.(selectedObject?.fontWeight === 'bold' ? 'normal' : 'bold')}
			class={`rounded-md border border-gray-300 p-2 ${
				selectedObject?.fontWeight === 'bold' ? 'bg-gray-200' : ''
			}`}
		>
			B
		</button>

		<button
			onclick={() =>
				editor?.changeFontStyle?.(selectedObject?.fontStyle === 'italic' ? 'normal' : 'italic')}
			class={`rounded-md border border-gray-300 p-2 ${
				selectedObject?.fontStyle === 'italic' ? 'bg-gray-200' : ''
			}`}
		>
			I
		</button>

		<button
			onclick={() => editor?.changeFontUnderline?.(!selectedObject?.underline)}
			class={`rounded-md border border-gray-300 p-2 ${selectedObject?.underline ? 'bg-gray-200' : ''}`}
		>
			U
		</button>
	</div>

	<div class="flex flex-col gap-2">
		<label for="fill-color" class="text-xs text-gray-600">Fill Color</label>
		<div class="w-full">
			<ColorPicker bind:color onInput={handleColorChange} />
		</div>
	</div>
</div>
