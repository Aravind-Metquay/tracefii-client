<script lang="ts">
	import type * as fabric from 'fabric';

	let { selectedObject, updateQRCode } = $props<{
		selectedObject: fabric.Object & { data?: any };
		updateQRCode: (options: {
			expression: string;
			errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
		}) => Promise<void>;
	}>();

	// Reactive state for the UI controls
	let expression = $state('');
	let errorLevel = $state('H');
	let isGenerating = $state(false);
	let evaluatedValue = $state('');
	let debounceTimer: NodeJS.Timeout;

	// Effect to sync the UI when the selected object changes
	$effect(() => {
		if (selectedObject && selectedObject.data){
		expression = selectedObject.data.expression || '{{default_qrcode}}';
		errorLevel = selectedObject.data.errorCorrectionLevel || 'H';
		} else {
			expression = '';
			errorLevel = 'H';
		}
	});

	function triggerUpdate() {
		// Clear any existing timer
		clearTimeout(debounceTimer);

		// Set a new timer to run the update after 200ms of inactivity
		debounceTimer = setTimeout(async () => {
			isGenerating = true;
			try {
				await updateQRCode({
					expression: expression,
					errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H'
				});
			} finally {
				isGenerating = false;
			}
		}, 200);
	}
</script>

<div class="space-y-4">
	<h3 class="mb-3 text-sm font-semibold uppercase text-gray-600">QR Code Properties</h3>

	<div class="flex flex-col gap-1">
		<label for="error-level" class="text-xs text-gray-600">Error Correction Level</label>
		<select
			id="error-level"
			 class="w-full appearance-none rounded-md border border-gray-300 bg-white bg-no-repeat 
			bg-[right_0.75rem_center] bg-[length:1em_1em] 
			bg-[url('data:image/svg+xml,%3csvg%20xmlns%3d%22http%3a//www.w3.org/2000/svg%22%20viewBox%3d%220%200%2020%2020%22%20fill%3d%22currentColor%22%20class%3d%22h-5%20w-5%22%3e%3cpath%20fill-rule%3d%22evenodd%22%20d%3d%22M5.23%207.21a.75.75%200%20011.06.02L10%2010.94l3.71-3.71a.75.75%200%20111.06%201.06l-4.25%204.25a.75.75%200%2001-1.06%200L5.21%208.27a.75.75%200%2001.02-1.06z%22%20clip-rule%3d%22evenodd%22%20/%3e%3c/svg%3e')]
			mt-1 py-2 pl-3 pr-8 text-sm  disabled:cursor-not-allowed disabled:bg-gray-100"
			disabled={isGenerating}
			bind:value={errorLevel}
			onchange={triggerUpdate}
		>
			<option value="L">Low (~7%)</option>
			<option value="M">Medium (~15%)</option>
			<option value="Q">Quartile (~25%)</option>
			<option value="H">High (~30%)</option>
		</select>
	</div>

	<div class="flex flex-col gap-1">
		<label for="expression" class="text-xs text-gray-600">QR Code Content</label>
		<input
			id="expression"
			type="text"
			class="w-full rounded-md border px-3 py-2 text-sm"
			placeholder="Enter URL or text"
			bind:value={expression}
			oninput={triggerUpdate}
		/>
		
		<!-- <div class="mt-1 text-xs text-gray-500">
			<div class="font-medium">Preview:</div>
			<div class="break-all" title={evaluatedValue}>
				{evaluatedValue.length > 50 ? evaluatedValue.substring(0, 50) + '...' : evaluatedValue}
			</div>
		</div>-->
	</div> 

	{#if isGenerating}
		<div class="flex items-center gap-2 text-xs text-blue-600">
			<div class="h-3 w-3 animate-spin rounded-full border border-blue-600 border-t-transparent"></div>
			Generating QR code...
		</div>
	{/if}
</div>