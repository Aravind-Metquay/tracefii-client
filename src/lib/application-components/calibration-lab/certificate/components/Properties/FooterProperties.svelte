<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	
	// Footer properties
	let showSignatures = $state(certificate.data.showSignatures !== false);
	let showPageNumbers = $state(certificate.data.showPageNumbers !== false);
	let footerText = $state(certificate.data.footerText || 'This certificate shall not be reproduced except in full, without written approval of the laboratory.');
	let calibratedBy = $state(certificate.data.calibratedBy || '');
	let reviewedBy = $state(certificate.data.reviewedBy || '');
	let approvedBy = $state(certificate.data.approvedBy || '');
	
	function updateShowSignatures(value: boolean) {
		showSignatures = value;
		certificate.data.showSignatures = value;
	}
	
	function updateShowPageNumbers(value: boolean) {
		showPageNumbers = value;
		certificate.data.showPageNumbers = value;
	}
	
	function updateFooterText(value: string) {
		footerText = value;
		certificate.data.footerText = value;
	}
	
	function updateCalibratedBy(value: string) {
		calibratedBy = value;
		certificate.data.calibratedBy = value;
	}
	
	function updateReviewedBy(value: string) {
		reviewedBy = value;
		certificate.data.reviewedBy = value;
	}
	
	function updateApprovedBy(value: string) {
		approvedBy = value;
		certificate.data.approvedBy = value;
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium text-gray-900">Footer Properties</h3>
		<p class="text-sm text-gray-600">Configure footer content and signatures</p>
	</div>

	<!-- Display Options -->
	<div>
		<div class="mb-3 block text-sm font-medium text-gray-700">Display Options</div>
		<div class="space-y-3">
			<div class="flex items-center">
				<input
					id="show-signatures"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					checked={showSignatures}
					onchange={(e) => updateShowSignatures((e.target as HTMLInputElement).checked)}
				/>
				<label for="show-signatures" class="ml-2 text-sm text-gray-700">
					Show Signature Section
				</label>
			</div>
			<div class="flex items-center">
				<input
					id="show-page-numbers"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					checked={showPageNumbers}
					onchange={(e) => updateShowPageNumbers((e.target as HTMLInputElement).checked)}
				/>
				<label for="show-page-numbers" class="ml-2 text-sm text-gray-700">
					Show Page Numbers
				</label>
			</div>
		</div>
	</div>

	<!-- Footer Text -->
	<div>
		<label for="footer-text" class="mb-2 block text-sm font-medium text-gray-700">
			Footer Text
		</label>
		<textarea
			id="footer-text"
			rows="3"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={footerText}
			oninput={(e) => updateFooterText((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<!-- Signatures -->
	{#if showSignatures}
		<div class="rounded-lg border border-gray-200 p-4">
			<h4 class="mb-3 text-sm font-medium text-gray-900">Signature Information</h4>
			<div class="space-y-3">
				<div>
					<label for="calibrated-by" class="mb-1 block text-xs text-gray-500">Calibrated By</label>
					<input
						id="calibrated-by"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={calibratedBy}
						oninput={(e) => updateCalibratedBy((e.target as HTMLInputElement).value)}
						placeholder="Enter technician name"
					/>
				</div>
				<div>
					<label for="reviewed-by" class="mb-1 block text-xs text-gray-500">Reviewed By</label>
					<input
						id="reviewed-by"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={reviewedBy}
						oninput={(e) => updateReviewedBy((e.target as HTMLInputElement).value)}
						placeholder="Enter reviewer name"
					/>
				</div>
				<div>
					<label for="approved-by" class="mb-1 block text-xs text-gray-500">Approved By</label>
					<input
						id="approved-by"
						type="text"
						class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
						value={approvedBy}
						oninput={(e) => updateApprovedBy((e.target as HTMLInputElement).value)}
						placeholder="Enter approver name"
					/>
				</div>
			</div>
		</div>
	{/if}

	<!-- Additional Settings -->
	<div class="rounded-lg border border-gray-200 p-4">
		<h4 class="mb-3 text-sm font-medium text-gray-900">Additional Settings</h4>
		<div class="space-y-3">
			<div class="text-sm text-gray-600">
				<p>Configure additional footer elements such as:</p>
				<ul class="mt-2 list-disc list-inside space-y-1 text-xs">
					<li>Company logo in footer</li>
					<li>Contact information</li>
					<li>Accreditation statements</li>
					<li>QR codes or barcodes</li>
				</ul>
			</div>
			<button
				class="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				onclick={() => {
					console.log('Configure advanced footer settings');
				}}
			>
				Advanced Footer Settings
			</button>
		</div>
	</div>
</div>