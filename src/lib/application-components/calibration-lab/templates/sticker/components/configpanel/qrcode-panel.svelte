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
		expression = selectedObject.data.expression || '{{default_qrcode}}';
		errorLevel = selectedObject.data.errorCorrectionLevel || 'H';
	});

	// Effect to update the preview in real-time 
	$effect(() => {
		evaluatedValue = expression.replace(
			'{{default_qrcode}}',
			`https://metquay.com/generated/${Date.now()}`
		);
		
		// Debounced QR code generation
		clearTimeout(debounceTimer);
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
	});

	// Separate handler for select changes (immediate update)
	async function handleSelectChange() {
		isGenerating = true;
		try {
			await updateQRCode({
				expression: expression,
				errorCorrectionLevel: errorLevel as 'L' | 'M' | 'Q' | 'H'
			});
		} finally {
			isGenerating = false;
		}
	}
</script>

<div class="space-y-4">
	<h3 class="mb-3 text-sm font-semibold uppercase text-gray-600">QR Code Properties</h3>

	<div class="flex flex-col gap-1">
		<label for="error-level" class="text-xs text-gray-600">Error Correction Level</label>
		<select
			id="error-level"
			class="w-full rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
			disabled={isGenerating}
			bind:value={errorLevel}
			onchange={handleSelectChange}
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
			class="w-full rounded border px-3 py-2 text-sm"
			placeholder="Enter URL or text"
			bind:value={expression}
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