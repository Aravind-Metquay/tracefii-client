<script lang="ts">
	import { Button } from '@/components/ui/button';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Input } from '@/components/ui/input';

	let { editor } = $props();

	let selectedObject = $derived(editor.selectedObject);
	let hasSelection = $derived(editor.hasSelection);

	function updateProperty(property: string, value: any) {
		if (selectedObject) {
			editor.updateSelectedObject({ [property]: value });
		}
	}

	function handleColorChange(color: { hex: string | null }) {
		if (color.hex) {
			updateProperty('fill', color.hex);
		}
	}
</script>

<div class="property-panel h-full w-80 overflow-y-auto border-l bg-white">
	{#if hasSelection}
		<div class="space-y-6 p-4">
			<h3 class="text-lg font-semibold">Properties</h3>

			<!-- Appearance Properties -->
			{#if selectedObject?.type === 'textbox'}
				<div class="space-y-4">
					<h4 class="text-sm font-medium text-gray-700">Text</h4>

					<div>
						<label for="content" class="text-xs text-gray-600">Content</label>
						<Input
							id="content"
							value={selectedObject?.text ?? ''}
							oninput={(e: Event) => updateProperty('text', (e.target as HTMLInputElement).value)}
						/>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<label for="font-size" class="text-xs text-gray-600">Font Size</label>
							<Input
								id="font-size"
								type="number"
								value={selectedObject?.fontSize ?? 32}
								oninput={(e: Event) =>
									updateProperty('fontSize', Number((e.target as HTMLInputElement).value))}
							/>
						</div>
						<div>
							<label for="font-family" class="text-xs text-gray-600">Font Family</label>
							<select
								id="font-family"
								value={selectedObject?.fontFamily ?? 'Arial'}
								onchange={(e: Event) =>
									updateProperty('fontFamily', (e.target as HTMLSelectElement).value)}
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
						<Button
							onclick={() =>
								updateProperty(
									'fontWeight',
									selectedObject?.fontWeight === 'bold' ? 'normal' : 'bold'
								)}
							variant={selectedObject?.fontWeight === 'bold' ? 'default' : 'outline'}
							size="sm"
						>
							B
						</Button>
						<Button
							onclick={() =>
								updateProperty(
									'fontStyle',
									selectedObject?.fontStyle === 'italic' ? 'normal' : 'italic'
								)}
							variant={selectedObject?.fontStyle === 'italic' ? 'default' : 'outline'}
							size="sm"
						>
							I
						</Button>
						<Button
							onclick={() => updateProperty('underline', !selectedObject?.underline)}
							variant={selectedObject?.underline ? 'default' : 'outline'}
							size="sm"
						>
							U
						</Button>
					</div>
				</div>
			{/if}

			<!-- Color Properties -->
			<div class="space-y-4">
				<h4 class="text-sm font-medium text-gray-700">Appearance</h4>

				<div class="flex items-center gap-2">
					<label for="fill-color" class="text-xs text-gray-600">Fill Color</label>
					<ColorPicker hex={selectedObject?.fill ?? '#000000'} onInput={handleColorChange} />
				</div>

				<div>
					<label for="opacity" class="text-xs text-gray-600">Opacity</label>
					<input
						id="opacity"
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={selectedObject?.opacity ?? 1}
						oninput={(e: Event) =>
							updateProperty('opacity', Number((e.target as HTMLInputElement).value))}
						class="w-full"
					/>
					<span class="text-xs text-gray-500"
						>{Math.round((selectedObject?.opacity ?? 1) * 100)}%</span
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex h-full flex-col items-center justify-center text-gray-500">
			<div class="mb-4 text-4xl">🧩</div>
			<p class="text-base font-medium">No object selected</p>
			<p class="text-sm">Select an object to edit its properties</p>
		</div>
	{/if}
</div>

<style>
	.property-panel {
		display: flex;
		flex-direction: column;
	}
</style>
