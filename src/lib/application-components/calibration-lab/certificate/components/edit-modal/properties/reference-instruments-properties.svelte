<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';

	// Reference Instrument properties
	let showReferenceTable = $state(certificate.data.showReferenceTable !== false);
	let referenceTableTitle = $state(
		certificate.data.referenceTableTitle || 'Reference Instruments Used'
	);
	let referenceInstruments = $state(certificate.data.referenceInstruments || []);

	function updateShowReferenceTable(value: boolean) {
		showReferenceTable = value;
		certificate.data.showReferenceTable = value;
	}

	function updateReferenceTableTitle(value: string) {
		referenceTableTitle = value;
		certificate.data.referenceTableTitle = value;
	}

	function addReferenceInstrument() {
		const newInstrument = {
			id: Date.now(),
			equipment: '',
			serial: '',
			traceability: '',
			certificate: '',
			due: ''
		};
		referenceInstruments = [...referenceInstruments, newInstrument];
		certificate.data.referenceInstruments = referenceInstruments;
	}

	function removeReferenceInstrument(id: number) {
		referenceInstruments = referenceInstruments.filter((inst) => inst.id !== id);
		certificate.data.referenceInstruments = referenceInstruments;
	}

	function updateReferenceInstrument(id: number, field: string, value: string) {
		const index = referenceInstruments.findIndex((inst) => inst.id === id);
		if (index !== -1) {
			(referenceInstruments[index] as any)[field] = value;
			certificate.data.referenceInstruments = [...referenceInstruments];
		}
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium text-gray-900">Reference Instrument Properties</h3>
		<p class="text-sm text-gray-600">Configure reference instruments used in calibration</p>
	</div>

	<!-- Display Options -->
	<div>
		<div class="mb-3 block text-sm font-medium text-gray-700">Display Options</div>
		<div class="flex items-center">
			<input
				id="show-reference-table"
				type="checkbox"
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				checked={showReferenceTable}
				onchange={(e) => updateShowReferenceTable((e.target as HTMLInputElement).checked)}
			/>
			<label for="show-reference-table" class="ml-2 text-sm text-gray-700">
				Show Reference Instruments Table
			</label>
		</div>
	</div>

	<!-- Table Title -->
	<div>
		<label for="reference-table-title" class="mb-2 block text-sm font-medium text-gray-700">
			Table Title
		</label>
		<input
			id="reference-table-title"
			type="text"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={referenceTableTitle}
			oninput={(e) => updateReferenceTableTitle((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Reference Instruments List -->
	<div>
		<div class="mb-3 flex items-center justify-between">
			<div class="block text-sm font-medium text-gray-700">Reference Instruments</div>
			<button
				class="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				onclick={addReferenceInstrument}
			>
				+ Add Instrument
			</button>
		</div>

		<div class="space-y-4">
			{#each referenceInstruments as instrument (instrument.id)}
				<div class="rounded-lg border border-gray-200 p-4">
					<div class="mb-3 flex items-center justify-between">
						<h4 class="text-sm font-medium text-gray-900">Instrument #{instrument.id}</h4>
						<button
							class="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
							onclick={() => removeReferenceInstrument(instrument.id)}
						>
							Remove
						</button>
					</div>

					<div class="grid grid-cols-2 gap-3">
						<div>
							<label class="mb-1 block text-xs text-gray-500">Equipment</label>
							<input
								type="text"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								value={instrument.equipment}
								oninput={(e) =>
									updateReferenceInstrument(
										instrument.id,
										'equipment',
										(e.target as HTMLInputElement).value
									)}
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-500">Serial Number</label>
							<input
								type="text"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								value={instrument.serial}
								oninput={(e) =>
									updateReferenceInstrument(
										instrument.id,
										'serial',
										(e.target as HTMLInputElement).value
									)}
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-500">Traceability</label>
							<input
								type="text"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								value={instrument.traceability}
								oninput={(e) =>
									updateReferenceInstrument(
										instrument.id,
										'traceability',
										(e.target as HTMLInputElement).value
									)}
							/>
						</div>
						<div>
							<label class="mb-1 block text-xs text-gray-500">Certificate</label>
							<input
								type="text"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								value={instrument.certificate}
								oninput={(e) =>
									updateReferenceInstrument(
										instrument.id,
										'certificate',
										(e.target as HTMLInputElement).value
									)}
							/>
						</div>
						<div class="col-span-2">
							<label class="mb-1 block text-xs text-gray-500">Due Date</label>
							<input
								type="date"
								class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
								value={instrument.due}
								oninput={(e) =>
									updateReferenceInstrument(
										instrument.id,
										'due',
										(e.target as HTMLInputElement).value
									)}
							/>
						</div>
					</div>
				</div>
			{/each}

			{#if referenceInstruments.length === 0}
				<div class="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
					<p class="text-sm text-gray-500">No reference instruments added yet.</p>
					<p class="mt-1 text-xs text-gray-400">Click "Add Instrument" to get started.</p>
				</div>
			{/if}
		</div>
	</div>
</div>
