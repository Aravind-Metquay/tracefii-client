<script lang="ts">
	import { certificate } from '@/calibration-lab/certificate/lib/store.svelte';

	$effect(() => {
		if (certificate.page.margin.linked) {
			const newMargin = certificate.page.margin.margin;
			certificate.page.margin.top = newMargin;
			certificate.page.margin.right = newMargin;
			certificate.page.margin.bottom = newMargin;
			certificate.page.margin.left = newMargin;
		}
	});
</script>

<div class="flex h-full flex-col gap-6 p-6">
	<div class="rounded-lg p-4">
		<h3 class="mb-2 text-lg font-semibold text-gray-900">Page Setup</h3>
		<div class="space-y-3">
			<div>
				<label for="format" class="mb-2 block text-sm font-medium text-gray-700">Format</label>
				<select
					id="format"
					bind:value={certificate.page.format}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option>A4</option>
					<option>Letter</option>
					<option>Custom</option>
				</select>
			</div>
			<div>
				<label for="unit" class="mb-2 block text-sm font-medium text-gray-700">Unit</label>
				<select
					id="unit"
					bind:value={certificate.page.unit}
					class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
				>
					<option>mm</option>
					<option>px</option>
					<option>in</option>
				</select>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="width" class="mb-2 block text-sm font-medium text-gray-700">Width</label>
					<input
						id="width"
						type="number"
						bind:value={certificate.page.width}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
				<div>
					<label for="height" class="mb-2 block text-sm font-medium text-gray-700">Height</label>
					<input
						id="height"
						type="number"
						bind:value={certificate.page.height}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none"
					/>
				</div>
			</div>
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
					bind:value={certificate.page.margin.margin}
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
						bind:value={certificate.page.margin.top}
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
						bind:value={certificate.page.margin.right}
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
						bind:value={certificate.page.margin.bottom}
						disabled={certificate.page.margin.linked}
						class="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-200"
					/>
				</div>
				<div>
					<label for="margin-left" class="mb-2 block text-sm font-medium text-gray-700">Left</label>
					<input
						id="margin-left"
						type="number"
						bind:value={certificate.page.margin.left}
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
