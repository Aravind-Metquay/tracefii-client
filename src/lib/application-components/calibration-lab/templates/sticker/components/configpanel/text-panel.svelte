<script lang="ts">
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
				class="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
			>
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

	<div class="flex items-center justify-between rounded-md border border-gray-300 p-1">
		<div class="flex">
			<button
				onclick={toggleBold}
				class="p-2 transition hover:bg-gray-100"
				class:bg-gray-200={fontWeight === 700}
				title="Bold"
			>
				<span class="font-bold">B</span>
			</button>
			<button
				onclick={toggleItalic}
				class="p-2 transition hover:bg-gray-100"
				class:bg-gray-200={fontStyle === 'italic'}
				title="Italic"
			>
				<span class="italic">I</span>
			</button>
			<button
				onclick={toggleUnderline}
				class="p-2 transition hover:bg-gray-100"
				class:bg-gray-200={textUnderline}
				title="Underline"
			>
				<span class="underline">U</span>
			</button>
		</div>
		<div class="flex">
			<button
				onclick={() => setTextAlign('left')}
				class="p-2 transition hover:bg-gray-100"
				class:bg-blue-500={textAlign === 'left'}
				class:text-white={textAlign === 'left'}
				title="Align Left"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm0 4h10v2H2V8zm0 4h16v2H2v-2zm0 4h10v2H2v-2z"></path></svg>
			</button>
			<button
				onclick={() => setTextAlign('center')}
				class="p-2 transition hover:bg-gray-100"
				class:bg-blue-500={textAlign === 'center'}
				class:text-white={textAlign === 'center'}
				title="Align Center"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm3 4h10v2H5V8zm-3 4h16v2H2v-2zm3 4h10v2H5v-2z"></path></svg>
			</button>
			<button
				onclick={() => setTextAlign('right')}
				class="p-2 transition hover:bg-gray-100"
				class:bg-blue-500={textAlign === 'right'}
				class:text-white={textAlign === 'right'}
				title="Align Right"
			>
				<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 4h16v2H2V4zm6 4h10v2H8V8zm-6 4h16v2H2v-2zm6 4h10v2H8v-2z"></path></svg>
			</button>
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
				class="flex-1"
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