<script lang="ts">
	import { Button } from '@/components/ui/button';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Input } from '@/components/ui/input';
	import type { TemplateType, UnitType, Editor, Color, Dimensions } from '../lib/types';

	interface Props {
		selectedType?: TemplateType;
		onTypeChange?: (type: TemplateType) => void;
		dimensions?: Dimensions;
		unit?: UnitType;
		backgroundColor?: Color;
		editor: Editor;
	}

	let {
		selectedType = $bindable(''),
		onTypeChange,
		dimensions = $bindable({ width: '', height: '' }),
		unit = $bindable('cm'),
		backgroundColor = $bindable({ r: 255, g: 255, b: 255 }),
		editor
	}: Props = $props();

	function handleTypeChange(type: TemplateType) {
		selectedType = type;
		onTypeChange?.(type);
	}

	function handleUnitChange(newUnit: UnitType) {
		unit = newUnit;
	}

	function handleDimensionChange() {
		if (dimensions.width && dimensions.height && editor?.canvas) {
			const width = parseFloat(dimensions.width);
			const height = parseFloat(dimensions.height);

			if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
				editor.changeSize({ width, height });
			}
		}
	}

	function handleColorChange(color: { hex: string | null }) {
		if (color.hex && editor?.canvas) {
			const workspace = editor.getWorkspace();
			if (workspace) {
				workspace.set('fill', color.hex);
				editor.canvas.renderAll();

				// Update the bound backgroundColor state
				backgroundColor = hexToRgb(color.hex);
			}
		}
	}

	function hexToRgb(hex: string): { r: number; g: number; b: number } {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: { r: 255, g: 255, b: 255 };
	}

	function rgbToHex({ r, g, b }: { r: number; g: number; b: number }): string {
		return (
			'#' +
			[r, g, b]
				.map((x) => {
					const hex = x.toString(16);
					return hex.length === 1 ? '0' + hex : hex;
				})
				.join('')
		);
	}

	// Watch for dimension changes and apply them
	$effect(() => {
		if (dimensions.width || dimensions.height) {
			handleDimensionChange();
		}
	});
</script>

<div class="container-panel h-full w-80 overflow-y-auto border-r bg-white">
	<div class="space-y-6 p-4">
		<Button variant="outline" size="sm" class="flex items-center gap-2">← Back</Button>

		<h1 class="text-2xl font-semibold">Untitled Design</h1>

		<div class="space-y-4">
			<!-- Type Selection -->
			<div class="space-y-1">
				<label for="type" class="block text-xs text-gray-600">
					Type <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={selectedType}
					onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value as TemplateType)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="">Select type...</option>
					<option value="Label">Label</option>
					<option value="Certificate">Certificate</option>
				</select>
			</div>

			<!-- Unit Selection -->
			<div class="space-y-1">
				<label for="unit" class="block text-xs text-gray-600">
					Unit of Measurement <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={unit}
					onchange={(e) => handleUnitChange((e.target as HTMLSelectElement).value as UnitType)}
					class="w-full rounded border border-gray-300 p-2 text-sm"
				>
					<option value="mm">mm</option>
					<option value="cm">cm</option>
					<option value="px">px</option>
				</select>
			</div>

			<!-- Dimensions -->
			<div class="space-y-1">
				<label for="dimensions" class="block text-xs text-gray-600">Dimensions</label>
				<div class="grid grid-cols-2 gap-2">
					<Input placeholder={`Width (${unit})`} bind:value={dimensions.width} />
					<Input placeholder={`Height (${unit})`} bind:value={dimensions.height} />
				</div>
			</div>

			<!-- Background Color -->
			<div class="space-y-1">
				<label for="background-color" class="block text-xs text-gray-600">Background Color</label>
				<div class="flex w-full items-center gap-2">
					<ColorPicker hex={rgbToHex(backgroundColor)} onInput={handleColorChange} />
				</div>
			</div>
		</div>
	</div>
</div>
