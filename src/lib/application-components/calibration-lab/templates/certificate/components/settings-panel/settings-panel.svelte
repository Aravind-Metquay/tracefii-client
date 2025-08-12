<script lang="ts">
	import { certificate, CertificateManager } from '@/certificate/lib/store.svelte';

	// Get access to the certificate manager for proper updates
	const certificateManager = CertificateManager();
	const certificateActions = certificateManager.updateCertificate();

	// Initialize with proper A4 settings on load
	$effect(() => {
		// Ensure A4 format is properly set on initial load
		if (certificate.page.format === 'A4') {
			handleFormatChange('A4');
		}
	});

	$effect(() => {
		if (certificate.page.margin.linked) {
			const newMargin = certificate.page.margin.margin;
			certificate.page.margin.top = newMargin;
			certificate.page.margin.right = newMargin;
			certificate.page.margin.bottom = newMargin;
			certificate.page.margin.left = newMargin;
		}
	});

	// Handler functions for proper updates
	function handleFormatChange(format: 'A4' | 'Custom' | 'A5') {
		console.log('Format change:', format);
		
		// Direct update approach
		certificate.page.format = format;
		
		// Set standard dimensions for preset formats
		if (format === 'A4') {
			certificate.page.width = 21;
			certificate.page.height = 29.7;
			certificate.page.unit = 'cm';
		} else if (format === 'A5') {
			certificate.page.width = 14.8;
			certificate.page.height = 21;
			certificate.page.unit = 'cm';
		}
		
		// Also call the certificate manager method
		certificateActions.updateFormat(format);
	}

	function handleUnitChange(unit: 'in' | 'mm' | 'cm' | 'px') {
		certificateActions.updateUnit(unit);
	}

	function handleDimensionChange(width?: number, height?: number) {
		console.log('Dimension change:', { width, height, format: certificate.page.format });
		
		// Direct update approach
		if (width !== undefined) {
			certificate.page.width = width;
		}
		if (height !== undefined) {
			certificate.page.height = height;
		}
		
		// Also call the certificate manager method
		certificateActions.setDimensions(width, height);
	}

	function handleMarginChange() {
		certificateActions.updateMargins(
			certificate.page.margin.top,
			certificate.page.margin.right,
			certificate.page.margin.bottom,
			certificate.page.margin.left
		);
	}
</script>

<div class="flex h-full flex-col gap-6 p-6">
	<div class="rounded-lg p-4">
		<h3 class="mb-2 text-lg font-semibold text-gray-900">Page Setup</h3>
		<div class="space-y-3">
			<div>
				<label for="format" class="mb-2 block text-sm font-medium text-gray-700">Format</label>
				<select
					id="format"
					value={certificate.page.format}
					onchange={(e) =>
						handleFormatChange((e.target as HTMLSelectElement).value as 'A4' | 'Custom' | 'A5')}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option value="A4">A4</option>
					<option value="A5">A5</option>
					<option value="Custom">Custom</option>
				</select>
			</div>
			<div>
				<label for="unit" class="mb-2 block text-sm font-medium text-gray-700">Unit</label>
				<select
					id="unit"
					value={certificate.page.unit}
					onchange={(e) =>
						handleUnitChange((e.target as HTMLSelectElement).value as 'in' | 'mm' | 'cm' | 'px')}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option value="mm">mm</option>
					<option value="cm">cm</option>
					<option value="in">in</option>
					<option value="px">px</option>
				</select>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="width" class="mb-2 block text-sm font-medium text-gray-700">Width</label>
					<input
						id="width"
						type="number"
						value={certificate.page.width}
						oninput={(e) =>
							handleDimensionChange(Number((e.target as HTMLInputElement).value), undefined)}
						disabled={certificate.page.format !== 'Custom'}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
				<div>
					<label for="height" class="mb-2 block text-sm font-medium text-gray-700">Height</label>
					<input
						id="height"
						type="number"
						value={certificate.page.height}
						oninput={(e) =>
							handleDimensionChange(undefined, Number((e.target as HTMLInputElement).value))}
						disabled={certificate.page.format !== 'Custom'}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
			</div>
			{#if certificate.page.format !== 'Custom'}
				<p class="mt-1 text-xs text-gray-500">Select "Custom" format to edit width and height</p>
			{/if}
		</div>

		<h3 class="mt-2 mb-3 text-lg font-semibold text-gray-900">
			Margin ({certificate.page.unit})
		</h3>
		<div class="space-y-3">
			<div class="flex items-center">
				<input
					id="link-margins"
					type="checkbox"
					bind:checked={certificate.page.margin.linked}
					class="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-500"
				/>
				<label for="link-margins" class="ml-2 block text-sm font-medium text-gray-900"
					>All sides</label
				>
			</div>
			<div>
				<label for="margin-default" class="mb-2 block text-sm font-medium text-gray-700"
					>Margin</label
				>
				<input
					id="margin-default"
					type="number"
					value={certificate.page.margin.margin}
					oninput={(e) => {
						const value = Number((e.target as HTMLInputElement).value);
						certificate.page.margin.margin = value;
						if (certificate.page.margin.linked) {
							certificate.page.margin.top = value;
							certificate.page.margin.right = value;
							certificate.page.margin.bottom = value;
							certificate.page.margin.left = value;
							handleMarginChange();
						}
					}}
					disabled={!certificate.page.margin.linked}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
				/>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="margin-top" class="mb-2 block text-sm font-medium text-gray-700">Top</label>
					<input
						id="margin-top"
						type="number"
						value={certificate.page.margin.top}
						oninput={(e) => {
							certificate.page.margin.top = Number((e.target as HTMLInputElement).value);
							handleMarginChange();
						}}
						disabled={certificate.page.margin.linked}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
				<div>
					<label for="margin-right" class="mb-2 block text-sm font-medium text-gray-700"
						>Right</label
					>
					<input
						id="margin-right"
						type="number"
						value={certificate.page.margin.right}
						oninput={(e) => {
							certificate.page.margin.right = Number((e.target as HTMLInputElement).value);
							handleMarginChange();
						}}
						disabled={certificate.page.margin.linked}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="margin-bottom" class="mb-2 block text-sm font-medium text-gray-700"
						>Bottom</label
					>
					<input
						id="margin-bottom"
						type="number"
						value={certificate.page.margin.bottom}
						oninput={(e) => {
							certificate.page.margin.bottom = Number((e.target as HTMLInputElement).value);
							handleMarginChange();
						}}
						disabled={certificate.page.margin.linked}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
				<div>
					<label for="margin-left" class="mb-2 block text-sm font-medium text-gray-700">Left</label>
					<input
						id="margin-left"
						type="number"
						value={certificate.page.margin.left}
						oninput={(e) => {
							certificate.page.margin.left = Number((e.target as HTMLInputElement).value);
							handleMarginChange();
						}}
						disabled={certificate.page.margin.linked}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
			</div>
		</div>

		<div class="pt-4">
			<label for="work" class="mb-2 block text-sm font-medium text-gray-700">Work</label>
			<select
				id="work"
				bind:value={certificate.metadata.work}
				class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
			>
				<option>WN25-77</option>
				<option>AB12-34</option>
				<option>CD56-78</option>
			</select>
		</div>
	</div>
</div>

<style>
	/* Hide scrollbar for Chrome, Safari and Opera */
	::-webkit-scrollbar {
		display: none;
	}

	/* Hide scrollbar for IE, Edge and Firefox */
	::-ms-scrollbar {
		display: none;
	}
</style>
