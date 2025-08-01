<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';

	// Customer Details properties
	let customerName = $state(certificate.data.customer.name);
	let customerAddress = $state(certificate.data.customer.address);
	let instrumentType = $state(certificate.data.instrument.type);
	let instrumentManufacturer = $state(certificate.data.instrument.manufacturer);
	let instrumentModel = $state(certificate.data.instrument.model);
	let instrumentSerial = $state(certificate.data.instrument.serial);
	let instrumentTag = $state(certificate.data.instrument.tag);

	// Date fields
	let dateIssue = $state(certificate.data.dates.issue);
	let dateReceived = $state(certificate.data.dates.received);
	let dateCalibrated = $state(certificate.data.dates.calibrated);
	let dateDue = $state(certificate.data.dates.due);

	// Condition fields
	let location = $state(certificate.data.conditions.location);
	let dataType = $state(certificate.data.conditions.dataType);
	let humidity = $state(certificate.data.conditions.humidity);
	let temperature = $state(certificate.data.conditions.temperature);
	let workProcedure = $state(certificate.data.conditions.workProcedure);
	let asFound = $state(certificate.data.conditions.asFound);
	let asLeft = $state(certificate.data.conditions.asLeft);

	function updateCustomerName(value: string) {
		customerName = value;
		certificate.data.customer.name = value;
	}

	function updateCustomerAddress(value: string) {
		customerAddress = value;
		certificate.data.customer.address = value;
	}

	function updateInstrumentField(field: string, value: string) {
		(certificate.data.instrument as any)[field] = value;
	}

	function updateDateField(field: string, value: string) {
		(certificate.data.dates as any)[field] = value;
	}

	function updateConditionField(field: string, value: string) {
		(certificate.data.conditions as any)[field] = value;
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium text-gray-900">Customer & Instrument Details</h3>
		<p class="text-sm text-gray-600">Configure customer and instrument information</p>
	</div>

	<!-- Customer Information -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Customer Information</h4>
		<div class="space-y-3">
			<div>
				<label for="customer-name" class="mb-1 block text-xs text-gray-500">Customer Name</label>
				<input
					id="customer-name"
					type="text"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={customerName}
					oninput={(e) => updateCustomerName((e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="customer-address" class="mb-1 block text-xs text-gray-500"
					>Customer Address</label
				>
				<textarea
					id="customer-address"
					rows="2"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={customerAddress}
					oninput={(e) => updateCustomerAddress((e.target as HTMLTextAreaElement).value)}
				></textarea>
			</div>
		</div>
	</div>

	<!-- Instrument Information -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Instrument Information</h4>
		<div class="space-y-3">
			<div>
				<label for="instrument-type" class="mb-1 block text-xs text-gray-500">Type</label>
				<input
					id="instrument-type"
					type="text"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={instrumentType}
					oninput={(e) => updateInstrumentField('type', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="instrument-manufacturer" class="mb-1 block text-xs text-gray-500"
					>Manufacturer</label
				>
				<input
					id="instrument-manufacturer"
					type="text"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={instrumentManufacturer}
					oninput={(e) =>
						updateInstrumentField('manufacturer', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="instrument-model" class="mb-1 block text-xs text-gray-500">Model/Part No.</label
				>
				<input
					id="instrument-model"
					type="text"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={instrumentModel}
					oninput={(e) => updateInstrumentField('model', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="instrument-serial" class="mb-1 block text-xs text-gray-500">Serial No.</label>
					<input
						id="instrument-serial"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={instrumentSerial}
						oninput={(e) => updateInstrumentField('serial', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<label for="instrument-tag" class="mb-1 block text-xs text-gray-500">Tag No.</label>
					<input
						id="instrument-tag"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={instrumentTag}
						oninput={(e) => updateInstrumentField('tag', (e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
		</div>
	</div>

	<!-- Dates -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Important Dates</h4>
		<div class="grid grid-cols-2 gap-3">
			<div>
				<label for="date-issue" class="mb-1 block text-xs text-gray-500">Date of Issue</label>
				<input
					id="date-issue"
					type="date"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={dateIssue}
					oninput={(e) => updateDateField('issue', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="date-received" class="mb-1 block text-xs text-gray-500">Received Date</label>
				<input
					id="date-received"
					type="date"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={dateReceived}
					oninput={(e) => updateDateField('received', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="date-calibrated" class="mb-1 block text-xs text-gray-500">Calibrated Date</label
				>
				<input
					id="date-calibrated"
					type="date"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={dateCalibrated}
					oninput={(e) => updateDateField('calibrated', (e.target as HTMLInputElement).value)}
				/>
			</div>
			<div>
				<label for="date-due" class="mb-1 block text-xs text-gray-500">Calibration Due</label>
				<input
					id="date-due"
					type="date"
					class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
					value={dateDue}
					oninput={(e) => updateDateField('due', (e.target as HTMLInputElement).value)}
				/>
			</div>
		</div>
	</div>

	<!-- Conditions -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Calibration Conditions</h4>
		<div class="space-y-3">
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="location" class="mb-1 block text-xs text-gray-500">Location</label>
					<input
						id="location"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={location}
						oninput={(e) => updateConditionField('location', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<label for="data-type" class="mb-1 block text-xs text-gray-500">Data Type</label>
					<input
						id="data-type"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={dataType}
						oninput={(e) => updateConditionField('dataType', (e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div class="grid grid-cols-3 gap-3">
				<div>
					<label for="humidity" class="mb-1 block text-xs text-gray-500">Humidity</label>
					<input
						id="humidity"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={humidity}
						oninput={(e) => updateConditionField('humidity', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<label for="temperature" class="mb-1 block text-xs text-gray-500">Temperature</label>
					<input
						id="temperature"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={temperature}
						oninput={(e) =>
							updateConditionField('temperature', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<label for="work-procedure" class="mb-1 block text-xs text-gray-500">Work Procedure</label
					>
					<input
						id="work-procedure"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={workProcedure}
						oninput={(e) =>
							updateConditionField('workProcedure', (e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<label for="as-found" class="mb-1 block text-xs text-gray-500">As Found Condition</label>
					<input
						id="as-found"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={asFound}
						oninput={(e) => updateConditionField('asFound', (e.target as HTMLInputElement).value)}
					/>
				</div>
				<div>
					<label for="as-left" class="mb-1 block text-xs text-gray-500">As Left Condition</label>
					<input
						id="as-left"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={asLeft}
						oninput={(e) => updateConditionField('asLeft', (e.target as HTMLInputElement).value)}
					/>
				</div>
			</div>
		</div>
	</div>
</div>
