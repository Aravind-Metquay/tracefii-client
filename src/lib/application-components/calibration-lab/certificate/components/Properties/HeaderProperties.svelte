<script lang="ts">
	import { certificate } from '@/certificate/lib/store.svelte';
	
	// Header-specific properties
	let companyName = $state(certificate.data.companyName || 'Metquay');
	let companyAddress = $state(certificate.data.companyAddress || 'Building No: 5421, Old Street\nAustin, Texas, USA. 956565');
	let companyPhone = $state(certificate.data.companyPhone || '+17185028848');
	let certificateTitle = $state(certificate.data.certificateTitle || 'CERTIFICATE OF CALIBRATION');
	let showLogo = $state(certificate.data.showLogo !== false);
	let showAccreditation = $state(certificate.data.showAccreditation !== false);
	
	function updateCompanyName(value: string) {
		companyName = value;
		certificate.data.companyName = value;
	}
	
	function updateCompanyAddress(value: string) {
		companyAddress = value;
		certificate.data.companyAddress = value;
	}
	
	function updateCompanyPhone(value: string) {
		companyPhone = value;
		certificate.data.companyPhone = value;
	}
	
	function updateCertificateTitle(value: string) {
		certificateTitle = value;
		certificate.data.certificateTitle = value;
	}
	
	function updateShowLogo(value: boolean) {
		showLogo = value;
		certificate.data.showLogo = value;
	}
	
	function updateShowAccreditation(value: boolean) {
		showAccreditation = value;
		certificate.data.showAccreditation = value;
	}
</script>

<div class="space-y-6">
	<div>
		<h3 class="text-lg font-medium text-gray-900">Header Properties</h3>
		<p class="text-sm text-gray-600">Configure the certificate header section</p>
	</div>

	<!-- Company Name -->
	<div>
		<label for="company-name" class="mb-2 block text-sm font-medium text-gray-700">
			Company Name
		</label>
		<input
			id="company-name"
			type="text"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={companyName}
			oninput={(e) => updateCompanyName((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Company Address -->
	<div>
		<label for="company-address" class="mb-2 block text-sm font-medium text-gray-700">
			Company Address
		</label>
		<textarea
			id="company-address"
			rows="3"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={companyAddress}
			oninput={(e) => updateCompanyAddress((e.target as HTMLTextAreaElement).value)}
		></textarea>
	</div>

	<!-- Company Phone -->
	<div>
		<label for="company-phone" class="mb-2 block text-sm font-medium text-gray-700">
			Phone Number
		</label>
		<input
			id="company-phone"
			type="text"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={companyPhone}
			oninput={(e) => updateCompanyPhone((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Certificate Title -->
	<div>
		<label for="certificate-title" class="mb-2 block text-sm font-medium text-gray-700">
			Certificate Title
		</label>
		<input
			id="certificate-title"
			type="text"
			class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
			value={certificateTitle}
			oninput={(e) => updateCertificateTitle((e.target as HTMLInputElement).value)}
		/>
	</div>

	<!-- Display Options -->
	<div>
		<div class="mb-3 block text-sm font-medium text-gray-700">Display Options</div>
		<div class="space-y-3">
			<div class="flex items-center">
				<input
					id="show-logo"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					checked={showLogo}
					onchange={(e) => updateShowLogo((e.target as HTMLInputElement).checked)}
				/>
				<label for="show-logo" class="ml-2 text-sm text-gray-700">
					Show Company Logo
				</label>
			</div>
			<div class="flex items-center">
				<input
					id="show-accreditation"
					type="checkbox"
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
					checked={showAccreditation}
					onchange={(e) => updateShowAccreditation((e.target as HTMLInputElement).checked)}
				/>
				<label for="show-accreditation" class="ml-2 text-sm text-gray-700">
					Show Accreditation Logo
				</label>
			</div>
		</div>
	</div>
</div>