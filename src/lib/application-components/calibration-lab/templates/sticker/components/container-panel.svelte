<script lang="ts">
	// The component now receives pixel dimensions and callbacks to update the parent
	import { CircleArrowLeft } from '@lucide/svelte';
	let {
		pixelWidth,
		pixelHeight,
		backgroundColor = $bindable(),
		onDimensionsChange,
		onBackgroundChange
	}: {
		pixelWidth: number;
		pixelHeight: number;
		backgroundColor: string;
		onDimensionsChange: (newPixelWidth: number, newPixelHeight: number) => void;
		onBackgroundChange: () => void;
	} = $props();

	// Local state for UI elements
	let selectedType: 'Label' | 'Certificate' | '' = $state('Label');
	type UnitType = 'mm' | 'cm' | 'px' | 'in';
	let unit: UnitType = $state('cm');
	let designName =$state("Untitled Design");
	let isEditingName =$state(false);

	const CONVERSION_FACTORS = { px: 1, in: 96, cm: 96 / 2.54, mm: 96 / 25.4 };

	function convert(value: number, fromUnit: UnitType | 'px', toUnit: UnitType | 'px'): number {
		const from = CONVERSION_FACTORS[fromUnit];
		const to = CONVERSION_FACTORS[toUnit];
		if (!from || !to) return value;
		const valueInPixels = value * from;
		return valueInPixels / to;
	}

	// --- DERIVED DISPLAY VALUES ---
	// These values are COMPUTED from the pixel props and the local unit state.
	// They are what the user sees in the input boxes.
	let displayWidth = $derived(parseFloat(convert(pixelWidth, 'px', unit).toFixed(2)));
	let displayHeight = $derived(parseFloat(convert(pixelHeight, 'px', unit).toFixed(2)));

	// --- INPUT HANDLERS ---
	// When the user types a new width, convert it back to pixels and update the parent.
	function handleWidthInput(e: Event) {
		const inputVal = parseFloat((e.target as HTMLInputElement).value);
		if (!isNaN(inputVal)) {
			const newPixelWidth = convert(inputVal, unit, 'px');
			onDimensionsChange(newPixelWidth, pixelHeight);
		}
	}

	// When the user types a new height, convert it back to pixels and update the parent.
	function handleHeightInput(e: Event) {
		const inputVal = parseFloat((e.target as HTMLInputElement).value);
		if (!isNaN(inputVal)) {
			const newPixelHeight = convert(inputVal, unit, 'px');
			onDimensionsChange(pixelWidth, newPixelHeight);
		}
	}

	function handleNameSave() {
	isEditingName = false;

	console.log("Design name saved:", designName);
}

function handleKeyDown(event: KeyboardEvent) {
	if (event.key === "Enter") {
		handleNameSave();
	}
}
</script>

<div class="h-full w-full space-y-6 overflow-y-auto bg-white p-4 ml-0.5 mr-0.5">
	<!-- <button class="cursor-pointer text-2xl font-bold text-black" title="Go Back"> ← </button> -->
	<CircleArrowLeft class="h-7 w-7 flex-shrink-0 cursor-pointer text-[#4B4B4B] " />
	{#if isEditingName}
			<input
				class="text-2xl font-semibold w-full border-b border-gray-300 focus:border-blue-500 focus:outline-none"
				type="text"
				bind:value={designName}
				onblur={handleNameSave}
				onkeydown={handleKeyDown}
				autofocus
			/>
		{:else}
			<h1
				class="text-2xl font-semibold cursor-pointer"
				onclick={() => (isEditingName = true)}
				title="Click to edit name"
			>
				{designName}
			</h1>
		{/if}

	<div class="space-y-4">
	

		<div class="space-y-2">
			<label for="unit" class="block text-xs font-medium text-gray-600">
				Unit of Measurement <span class="text-red-500">*</span>
			</label>
			<select
   			 bind:value={unit}
    		class="w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat 
			bg-[right_0.75rem_center] bg-[length:1em_1em] 
			bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22currentColor%22%20class%3d%22h-5%20w-5%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.23%207.21a.75.75%200%20011.06.02L10%2010.94l3.71-3.71a.75.75%200%20111.06%201.06l-4.25%204.25a.75.75%200%2001-1.06%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%20clip-rule%3d%22evenodd%22%20/%3e%3c/svg%3e')]
			 py-2 pl-3 pr-8 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			>
				<option value="cm">cm</option>
				<option value="mm">mm</option>	
				<option value="px">px</option>
				<option value="in">in</option>
			</select>
		</div>

		<div class="space-y-2">
			<label for="dimensions" class="block text-xs font-medium text-gray-600">Dimensions</label>
			<div class="grid grid-cols-2 gap-2">
				<input
					type="number"
					placeholder={`Width (${unit})`}
					bind:value={displayWidth}
					oninput={handleWidthInput}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
				<input
					type="number"
					placeholder={`Height (${unit})`}
					bind:value={displayHeight}
					oninput={handleHeightInput}
					class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
				/>
			</div>
		</div>

		<div class="space-y-2">
			<label for="background-color" class="block text-xs font-medium text-gray-600">Background Color</label>
			<div class="flex h-10 w-full items-center gap-3 rounded-md border border-gray-300 p-2 text-xs">
				<input
					id="background-color"
					type="color"
					class="h-6 w-10 cursor-pointer border-none bg-transparent p-0"
					bind:value={backgroundColor}
					onchange={onBackgroundChange}
				/>
				<span class="font-mono uppercase">{backgroundColor}</span>
			</div>
		</div>
	</div>
</div>