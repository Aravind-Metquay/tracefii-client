<script lang="ts">
	import { Button } from '@/components/ui/button';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Input } from '@/components/ui/input';

	let {
		selectedType = $bindable(),
		onTypeChange,
		dimensions = $bindable({ width: '', height: '' }),
		unit = $bindable('cm'),
		backgroundColor = $bindable({ r: 255, g: 255, b: 255 }),
		editor
	} = $props();

	let selectedObject = $derived(editor.selectedObject);

	function handleTypeChange(type: string) {
		selectedType = type;
		onTypeChange?.(type);
	}

	function handleUnitChange(newUnit: string) {
		unit = newUnit;
	}

	// ✅ Reused logic from earlier understood code
	function handleColorChange(color: { hex: string | null }) {
		if (color.hex && editor.canvas) {
			const workspace = editor.canvas
				.getObjects()
				.find((obj: { name: string }) => obj.name === 'workspace');
			if (workspace) {
				workspace.set('fill', color.hex);
				editor.canvas.renderAll();
			}
		}
	}
</script>

<div class="container-panel h-full w-80 overflow-y-auto border-r bg-white">
	<div class="space-y-6 p-4">
		<Button variant="outline" size="sm" class="flex items-center gap-2">← Back</Button>

		<h1 class="text-2xl font-semibold">Untitled Design</h1>

		<div class="space-y-4">
			<!-- Type Selection -->
			<div>
				<label for="type" class="mb-1 block text-xs text-gray-600">
					Type <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={selectedType}
					onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="">Select type...</option>
					<option value="Label">Label</option>
					<option value="Certificate">Certificate</option>
				</select>
			</div>

			<!-- Unit Selection -->
			<div>
				<label for="unit" class="mb-1 block text-xs text-gray-600">
					Unit of Measurement <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={unit}
					onchange={(e) => handleUnitChange((e.target as HTMLSelectElement).value)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="mm">mm</option>
					<option value="cm">cm</option>
					<option value="px">px</option>
				</select>
			</div>

			<!-- Dimensions -->
			<div>
				<label for="dimensions" class="mb-1 block text-xs text-gray-600">Dimensions</label>
				<div class="grid grid-cols-2 gap-2">
					<Input placeholder={`Width (${unit})`} bind:value={dimensions.width} />
					<Input placeholder={`Height (${unit})`} bind:value={dimensions.height} />
				</div>
			</div>

			<!-- Background Color -->
			<div class="flex items-center justify-between">
				<label for="background-color" class="text-xs text-gray-600">Background Color</label>
				<ColorPicker hex={selectedObject?.fill ?? '#FFFFFF'} onInput={handleColorChange} />
			</div>
		</div>
	</div>
</div>
