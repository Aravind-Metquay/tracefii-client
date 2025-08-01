<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	
	// Calibration Data properties
	let showDataTable = $state(certificate.data.showDataTable !== false);
	let tableTitle = $state(certificate.data.tableTitle || 'Calibration Results');
	let uncertaintyStatement = $state(certificate.data.uncertaintyStatement || 'The reported expanded uncertainty is based on a standard uncertainty multiplied by a coverage factor k=2, providing a level of confidence of approximately 95%.');
	let traceabilityStatement = $state(certificate.data.traceabilityStatement || 'The measurements are traceable to national standards maintained by NIST.');
	
	function updateShowDataTable(value: boolean) {
		showDataTable = value;
		certificate.data.showDataTable = value;
	}
	
	function updateTableTitle(value: string) {
		tableTitle = value;
		certificate.data.tableTitle = value;
	}
	
	function updateUncertaintyStatement(value: string) {
		uncertaintyStatement = value;
		certificate.data.uncertaintyStatement = value;
	}
	
	function updateTraceabilityStatement(value: string) {
		traceabilityStatement = value;
		certificate.data.traceabilityStatement = value;
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium text-gray-900">Calibration Data Properties</h3>
		<p class="text-sm text-gray-600">Configure calibration data display and statements</p>
	</div>

	<!-- Display Options -->
	<div>
		<div class="mb-3 block text-sm font-medium text-gray-700">Display Options</div>
		<div class="flex items-center">
			<input
				id="show-data-table"
				type="checkbox"
				class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				checked={showDataTable}
				onchange={(e) => updateShowDataTable((e.target as HTMLInputElement).checked)}
			/>
			<label for="show-data-table" class="ml-2 text-sm text-gray-700">
				Show Calibration Data Table
			</label>
		</div>
	</div>

	<!-- Table Title -->
	<div>
		<label for="table-title" class="mb-2 block text-sm font-medium text-gray-700">
			Table Title
		</label>
		<input
			id="table-title"
			type="text"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={tableTitle}
			oninput={(e) => updateTableTitle((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Uncertainty Statement -->
	<div>
		<label for="uncertainty-statement" class="mb-2 block text-sm font-medium text-gray-700">
			Uncertainty Statement
		</label>
		<textarea
			id="uncertainty-statement"
			rows="3"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={uncertaintyStatement}
			oninput={(e) => updateUncertaintyStatement((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<!-- Traceability Statement -->
	<div>
		<label for="traceability-statement" class="mb-2 block text-sm font-medium text-gray-700">
			Traceability Statement
		</label>
		<textarea
			id="traceability-statement"
			rows="2"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={traceabilityStatement}
			oninput={(e) => updateTraceabilityStatement((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<!-- Data Configuration -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Data Configuration</h4>
		<div class="space-y-3">
			<div class="text-sm text-gray-600">
				<p>Calibration data is typically populated from worksheet results.</p>
				<p class="mt-2">Configure data source and formatting options here.</p>
			</div>
			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				onclick={() => {
					console.log('Configure data source');
				}}
			>
				Configure Data Source
			</button>
		</div>
	</div>
</div>