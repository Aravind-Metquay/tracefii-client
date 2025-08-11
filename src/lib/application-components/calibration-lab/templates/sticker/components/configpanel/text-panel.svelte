<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from '@lucide/svelte';
	
	// Receive all text-related state and update functions from the parent
	let {
		fontSize = $bindable(),
		fontFamily = $bindable(),
		fillColor = $bindable(),
		fontWeight = $bindable(),
		fontStyle = $bindable(),
		textUnderline = $bindable(),
		textAlign = $bindable(),
		opacity = $bindable(),
		updateFontSize,
		updateFontFamily,
		updateFillColor,
		toggleBold,
		toggleItalic,
		toggleUnderline,
		setTextAlign,
		updateOpacity
	} = $props();

	const isBold = $derived<boolean>(fontWeight >= 700);
	const isItalic = $derived<boolean>(fontStyle === 'italic');
	const isUnderline = $derived<boolean>(textUnderline);
</script>

<div class="space-y-4">
	<div class="grid grid-cols-2 gap-3">
		<div>
			<label for="font-size" class="block text-xs font-medium text-gray-600">Font Size</label>
			<input
				id="font-size"
				type="number"
				bind:value={fontSize}
				oninput={updateFontSize}
				class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
			/>
		</div>
		<div>
			<label for="font-family" class="block text-xs font-medium text-gray-600">Font Family</label>
			<select
				id="font-family"
				bind:value={fontFamily}
				onchange={updateFontFamily}
				class="w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat 
			bg-[right_0.75rem_center] bg-[length:1em_1em] 
			bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22currentColor%22%20class%3d%22h-5%20w-5%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.23%207.21a.75.75%200%20011.06.02L10%2010.94l3.71-3.71a.75.75%200%20111.06%201.06l-4.25%204.25a.75.75%200%2001-1.06%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%20clip-rule%3d%22evenodd%22%20/%3e%3c/svg%3e')]
			mt-1 py-2 pl-3 pr-8 text-sm focus:border-blue-500 ">
				<option value="Arial">Arial</option>
				<option value="Times New Roman">Times New Roman</option>
				<option value="Courier New">Courier New</option>
				<option value="Verdana">Verdana</option>
			</select>
		</div>
	</div>

	<div>
		<label class="block text-xs font-medium text-gray-600">Text Color</label>
		<div class="mt-1 flex items-center gap-2 rounded-md border border-gray-300 p-2">
			<input
				type="color"
				bind:value={fillColor}
				oninput={updateFillColor}
				class="h-6 w-6 cursor-pointer border-none bg-transparent p-0"
			/>
			<span class="text-sm">Choose a color</span>
		</div>
	</div>

	<div class="flex items-center gap-2 p-1">
		<div class="flex items-center gap-2">
			<Button
				size="icon"
				onclick={toggleBold}
				variant={isBold ? 'primary' : 'secondary'}
				title="Bold"
			>
				<Bold class="h-4 w-4" />
			</Button>
			<Button
				size="icon"
				onclick={toggleItalic}
				variant={isItalic ? 'primary' : 'secondary'}
				title="Italic"
			>
				<Italic class="h-4 w-4" />
			</Button>
			<Button
				size="icon"
				onclick={toggleUnderline}
				variant={isUnderline ? 'primary' : 'secondary'}
				title="Underline"
			>
				<Underline class="h-4 w-4" />
			</Button>
		</div>
		<div class="flex items-center gap-2">
			<Button
				size="icon"
				onclick={() => setTextAlign('left')}
				variant={textAlign === 'left' ? 'primary' : 'secondary'}
				title="Align Left"
			>
				<AlignLeft class="h-4 w-4" />
			</Button>
			<Button
				size="icon"
				onclick={() => setTextAlign('center')}
				variant={textAlign === 'center' ? 'primary' : 'secondary'}
				title="Align Center"
			>
				<AlignCenter class="h-4 w-4" />
			</Button>
			<Button
				size="icon"
				onclick={() => setTextAlign('right')}
				variant={textAlign === 'right' ? 'primary' : 'secondary'}
				title="Align Right"
			>
				<AlignRight class="h-4 w-4" />
			</Button>
		</div>
	</div>

	<div>
		<label for="opacity" class="block text-xs font-medium text-gray-600">Opacity</label>
		<div class="mt-1 flex items-center gap-3">
			<input
				id="opacity"
				type="range"
				bind:value={opacity}
				oninput={updateOpacity}
				min="0"
				max="1"
				step="0.01"
				class="h-2 w-full appearance-none rounded-md bg-gray-200 accent-violet-500"
			/>
			<input
				type="number"
				value={Math.round(opacity * 100)}
				oninput={(e) => {
					opacity = parseInt(e.currentTarget.value) / 100;
					updateOpacity();
				}}
				class="w-16 rounded-md border border-gray-300 p-2 text-center text-sm"
			/>
		</div>
	</div>
</div>