<script>
	import { Button } from '@/components/ui/button';
	import { ColorPicker } from '@/components/ui/color-picker';
	import { Input } from '@/components/ui/input';

	let {
		selectedType = $bindable(),
		onTypeChange,
		dimensions = $bindable({ width: '', height: '' }),
		unit = $bindable('cm'),
		backgroundColor = $bindable({ r: 255, g: 255, b: 255 }),
		editor
	} = $props();

	function handleTypeChange(type) {
		selectedType = type;
		onTypeChange?.(type);
	}

	function handleUnitChange(newUnit) {
		unit = newUnit;
	}

	function handleBackgroundColorChange(color) {
		backgroundColor = color;
		if (editor.canvas) {
			const workspace = editor.canvas.getObjects().find((obj) => obj.name === 'workspace');
			if (workspace) {
				const hex =
					'#' + ((1 << 24) + (color.r << 16) + (color.g << 8) + color.b).toString(16).slice(1);
				workspace.set('fill', hex);
				editor.canvas.renderAll();
			}
		}
	}
</script>


<div class="container-panel h-full w-80 overflow-y-auto border-r bg-white">
	<div class="space-y-6 p-4">
		<Button variant="outline" size="sm" class="flex items-center gap-2">← Back</Button>

		<h1 class="text-2xl font-semibold">Untitled Design</h1>

		<div class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium">Content Container</div>

		<div class="space-y-4">
			<!-- Type Selection -->
			<div>
				<label class="mb-1 block text-xs text-gray-600">
					Type <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={selectedType}
					onchange={(e) => handleTypeChange(e.target.value)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="">Select type...</option>
					<option value="Label">Label</option>
					<option value="Certificate">Certificate</option>
				</select>
			</div>

			<!-- Unit Selection -->
			<div>
				<label class="mb-1 block text-xs text-gray-600">
					Unit of Measurement <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={unit}
					onchange={(e) => handleUnitChange(e.target.value)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="mm">mm</option>
					<option value="cm">cm</option>
					<option value="px">px</option>
				</select>
			</div>

			<!-- Dimensions -->
			<div>
				<label class="mb-1 block text-xs text-gray-600">Dimensions</label>
				<div class="grid grid-cols-2 gap-2">
					<Input placeholder="Width ({unit})" bind:value={dimensions.width} />
					<Input placeholder="Height ({unit})" bind:value={dimensions.height} />
				</div>
			</div>

			<!-- Background Color -->
			<div class="flex items-center justify-between">
				<label class="text-xs text-gray-600">Background Color</label>
				<ColorPicker bind:color={backgroundColor} onchange={handleBackgroundColorChange} />
			</div>
		</div>

		<div class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium">Templates</div>

		<Input placeholder="🔍 Search" />
	</div>
</div>
