<script lang="ts">
	import { Button } from '@/components/ui/button';
	import ColorPicker from 'svelte-awesome-color-picker';
	import { Input } from '@/components/ui/input';
	import type { TemplateType, UnitType, Editor, Color, Dimensions } from '../lib/types';
	import {convert} from '../lib/logic.svelte'
	import { CircleArrowLeft } from '@lucide/svelte';

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

	
		function handleUnitChange(event: Event) {
			const newUnit = (event.target as HTMLSelectElement).value as UnitType;
			const oldUnit = unit;

			if (newUnit !== oldUnit) {
				const w = parseFloat(dimensions.width);
				const h = parseFloat(dimensions.height);

				if (!isNaN(w)) {
					const px = convert(w, oldUnit, 'px');
					dimensions.width = convert(px, 'px', newUnit).toFixed(2);
				}

				if (!isNaN(h)) {
					const px = convert(h, oldUnit, 'px');
					dimensions.height = convert(px, 'px', newUnit).toFixed(2);
				}

				unit = newUnit; // Update unit only after conversion
			}
		}




	function handleDimensionChange() {
		if (dimensions.width && dimensions.height && editor?.canvas) {
			const width = parseFloat(dimensions.width);
			const height = parseFloat(dimensions.height);

			if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
				// Convert current dimensions from the selected unit to pixels
                const widthInPx = convert(width, unit, 'px');
                const heightInPx = convert(height, unit, 'px');
                
				
				editor.changeSize({ width:widthInPx, height:heightInPx });
			}
		}
	}

	function handleColorChange(color: { hex: string | null }) {
		if (color.hex && editor?.canvas) {
			backgroundColor = hexToRgb(color.hex);
			
			const workspace = editor.getWorkspace();
			if (workspace) {
				workspace.set('fill', color.hex);
				
		
			}

			editor.canvas.backgroundColor = color.hex;
			editor.canvas.renderAll();

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
		if (dimensions.width && dimensions.height && unit) {
			handleDimensionChange();
		}
	});
</script>

<div class="container-panel h-full w-full max-w-[320px] overflow-y-auto border-r bg-white">
	<div class="space-y-6 p-4">
	
		 <CircleArrowLeft class="flex-shrink-0 h-7 w-7 text-black cursor-pointer "  />

		<h1 class="text-2xl font-semibold">Untitled Design</h1>

		<div class="space-y-4">
			<!-- Type Selection -->
			<div class="space-y-2">
				<label for="type" class="block text-xs font-medium text-gray-600">
					Type <span class="text-red-500">*</span>
				</label>
				<select
					bind:value={selectedType}
					onchange={(e) => handleTypeChange((e.target as HTMLSelectElement).value as TemplateType)}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="">Select type...</option>
					<option value="Label">Label</option>
					<option value="Certificate">Certificate</option>
				</select>
			</div>

			<!-- Unit Selection -->
			<div class="space-y-2">
				<label for="unit" class="block text-xs font-medium text-gray-600">
					Unit of Measurement <span class="text-red-500">*</span>
				</label>
				<select
					value={unit}
					onchange={handleUnitChange}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				>
					<option value="mm">mm</option>
					<option value="cm">cm</option>
					<option value="px">px</option>
					<option value="in">in</option>

				</select>
			</div>

			<!-- Dimensions -->
			<div class="space-y-2">
				<label for="dimensions" class="block text-xs font-medium text-gray-600">Dimensions</label>
				<div class="grid grid-cols-2 gap-2">
					<input
						type="text"
						placeholder={`Width (${unit})`}
						bind:value={dimensions.width}
						class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
					<input
						type="text"
						placeholder={`Height (${unit})`}
						bind:value={dimensions.height}
						class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					/>
				</div>
			</div>

			<!-- Background Color -->
			<div class="space-y-2">
				<label for="background-color" class="block text-xs font-medium text-gray-600"
					>Background Color</label
				>
				<div class="items-center gap-3 p-2 rounded-md text-xs">
					<ColorPicker
						hex={rgbToHex(backgroundColor)}
						onInput={handleColorChange}
					/>
				</div>
				
			</div>
		</div>
	</div>
</div>
