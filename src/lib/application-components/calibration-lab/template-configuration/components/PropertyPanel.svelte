<script>
	import { Button } from '@/components/ui/button';
	import { ColorPicker } from '@/components/ui/color-picker';
	import { Input } from '@/components/ui/input';

	let { editor } = $props();

	let selectedObject = $derived(editor.selectedObject);
	let hasSelection = $derived(editor.hasSelection);

	function updateProperty(property, value) {
		if (selectedObject) {
			editor.updateSelectedObject({ [property]: value });
		}
	}

	function handleColorChange(color) {
		const hex =
			'#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
		updateProperty('fill', hex);
	}
</script>

<div class="property-panel h-full w-80 overflow-y-auto border-l bg-white">
	{#if hasSelection}
		<div class="space-y-6 p-4">
			<h3 class="text-lg font-semibold">Properties</h3>

			<!-- Transform Properties -->
			<div class="space-y-4">
				<h4 class="text-sm font-medium text-gray-700">Transform</h4>

				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="text-xs text-gray-600">X</label>
						<Input
							type="number"
							value={selectedObject?.left || 0}
							oninput={(e) => updateProperty('left', Number(e.target.value))}
						/>
					</div>
					<div>
						<label class="text-xs text-gray-600">Y</label>
						<Input
							type="number"
							value={selectedObject?.top || 0}
							oninput={(e) => updateProperty('top', Number(e.target.value))}
						/>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-2">
					<div>
						<label class="text-xs text-gray-600">Width</label>
						<Input
							type="number"
							value={selectedObject?.width || 0}
							oninput={(e) => updateProperty('width', Number(e.target.value))}
						/>
					</div>
					<div>
						<label class="text-xs text-gray-600">Height</label>
						<Input
							type="number"
							value={selectedObject?.height || 0}
							oninput={(e) => updateProperty('height', Number(e.target.value))}
						/>
					</div>
				</div>
			</div>

			<!-- Appearance Properties -->
			{#if selectedObject?.type === 'textbox'}
				<div class="space-y-4">
					<h4 class="text-sm font-medium text-gray-700">Text</h4>

					<div>
						<label class="text-xs text-gray-600">Content</label>
						<Input
							value={selectedObject?.text || ''}
							oninput={(e) => updateProperty('text', e.target.value)}
						/>
					</div>

					<div class="grid grid-cols-2 gap-2">
						<div>
							<label class="text-xs text-gray-600">Font Size</label>
							<Input
								type="number"
								value={selectedObject?.fontSize || 32}
								oninput={(e) => updateProperty('fontSize', Number(e.target.value))}
							/>
						</div>
						<div>
							<label class="text-xs text-gray-600">Font Family</label>
							<select
								value={selectedObject?.fontFamily || 'Arial'}
								onchange={(e) => updateProperty('fontFamily', e.target.value)}
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
					<label class="text-xs text-gray-600">Fill Color</label>
					<ColorPicker color={{ r: 0, g: 0, b: 0 }} onchange={handleColorChange} />
				</div>

				<div>
					<label class="text-xs text-gray-600">Opacity</label>
					<input
						type="range"
						min="0"
						max="1"
						step="0.1"
						value={selectedObject?.opacity || 1}
						oninput={(e) => updateProperty('opacity', Number(e.target.value))}
						class="w-full"
					/>
					<span class="text-xs text-gray-500"
						>{Math.round((selectedObject?.opacity || 1) * 100)}%</span
					>
				</div>
			</div>
		</div>
	{:else}
		<div class="p-4 text-center text-gray-500">
			<div class="mb-2 text-4xl">🧩</div>
			<p>No object selected</p>
			<p class="text-sm">Select an object to edit its properties</p>
		</div>
	{/if}
</div>
