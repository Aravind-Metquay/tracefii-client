<script lang="ts">
	import type { FabricObject } from 'fabric';
	import type { Editor, ExtendedFabricObject } from '../../../lib/types';

	let { editor } = $props<{ editor: Editor }>();
	let selectedObject = $derived<ExtendedFabricObject | undefined>(
		editor?.selectedObjects?.[0] as ExtendedFabricObject
	);

	function handleDateFormatChange(value: string) {
		if (editor?.changeDateFormat && selectedObject) {
			editor.changeDateFormat(value);
		}
	}

	function handleDateValueChange(value: string) {
		if (editor?.updateDateValue && selectedObject) {
			editor.updateDateValue(value);
		}
	}

	function handleFontSizeChange(value: number) {
		if (isNaN(value) || value <= 0) return;
		if (editor?.changeFontSize && selectedObject) {
			editor.changeFontSize(value);
		}
	}

	function handleFontFamilyChange(value: string) {
		if (editor?.changeFontFamily && selectedObject) {
			editor.changeFontFamily(value);
		}
	}
</script>

<div class="space-y-4">
	<h4 class="text-sm font-medium text-gray-700">Date Properties</h4>

	<div>
		<label for="date-format" class="text-xs text-gray-600">Date Format</label>
		<select
			id="date-format"
			value={selectedObject?.customDateFormat ?? 'MM/DD/YYYY'}
			onchange={(e) => handleDateFormatChange((e.target as HTMLSelectElement).value)}
			class="w-full rounded border border-gray-300 p-2 text-sm"
			disabled={!selectedObject || !editor?.changeDateFormat}
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
			value={selectedObject?.customDateValue
				? new Date(selectedObject.customDateValue).toISOString().split('T')[0]
				: new Date().toISOString().split('T')[0]}
			onchange={(e) => handleDateValueChange((e.target as HTMLInputElement).value)}
			disabled={!selectedObject || !editor?.updateDateValue}
		/>
	</div>

	<div class="grid grid-cols-2 gap-2">
		<div>
			<label for="date-font-size" class="text-xs text-gray-600">Font Size</label>
			<input
				id="date-font-size"
				type="number"
				min="1"
				class="w-full rounded border border-gray-300 p-2 text-sm"
				value={selectedObject?.fontSize ?? 16}
				oninput={(e) => handleFontSizeChange(Number((e.target as HTMLInputElement).value))}
				disabled={!selectedObject || !editor?.changeFontSize}
			/>
		</div>

		<div>
			<label for="date-font-family" class="text-xs text-gray-600">Font Family</label>
			<select
				id="date-font-family"
				value={selectedObject?.fontFamily ?? 'Arial'}
				onchange={(e) => handleFontFamilyChange((e.target as HTMLSelectElement).value)}
				class="w-full rounded border border-gray-300 p-2 text-sm"
				disabled={!selectedObject || !editor?.changeFontFamily}
			>
				<option>Arial</option>
				<option>Helvetica</option>
				<option>Times New Roman</option>
				<option>Georgia</option>
				<option>Verdana</option>
			</select>
		</div>
	</div>
</div>
