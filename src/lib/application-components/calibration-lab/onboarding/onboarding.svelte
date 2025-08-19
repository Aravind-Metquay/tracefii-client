<script lang="ts">
	import { useRegisterOrgAndUser } from '@/api/queries/onboarding-query';
	import type { UserType, OrganizationType } from '@/Types';

	// User form data - Pre-filled for testing
	let firstName = $state('John');
	let lastName = $state('Doe');
	let emailId = $state('john.doe@testcompany.com');
	let contactNumber = $state('+1-555-0123');
	let systemRole = $state<UserType['system_role']>('Admin');

	// Organization form data - Pre-filled for testing
	let organizationName = $state('Test Calibration Labs');
	let organizationDescription = $state(
		'A leading calibration laboratory providing precision measurement services for various industries including aerospace, automotive, and manufacturing.'
	);
	let organizationType = $state<OrganizationType['organizationType']>('Native');
	let orgEmailId = $state('info@testcalibrationlabs.com');

	const registerOrgAndUser = useRegisterOrgAndUser();

	const handleRegisterOrgAndUser = async () => {
		// Validate required fields
		if (!firstName?.trim() || !emailId?.trim() || !organizationName?.trim()) {
			console.error('Required fields are missing');
			alert('Please fill in all required fields: First Name, Email, and Organization Name');
			return;
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(emailId.trim())) {
			console.error('Invalid email format');
			alert('Please enter a valid email address');
			return;
		}

		// Clean and prepare user data - only include defined values
		const userData = {
			orgId: '', // Will be set by backend after organization creation
			firstName: firstName.trim(),
			emailId: emailId.trim(),
			system_role: systemRole,
			createdBy: emailId.trim()
		};

		// Clean and prepare organization data - only include defined values
		const organizationData = {
			organizationName: organizationName.trim(),
			organizationType: organizationType,
			createdBy: emailId.trim()
		};

		console.log('Sending user data:', userData);
		console.log('Sending organization data:', organizationData);

		const payload = {
			user: userData,
			organization: organizationData
		};
		console.log('Complete payload:', JSON.stringify(payload, null, 2));

		try {
			const result = await $registerOrgAndUser.mutateAsync({
				user: payload.user,
				organization: payload.organization
			});
			console.log('Success:', result);
		} catch (err) {
			console.error('Error:', err);
		}
	};

	// Input handlers
	const handleFirstNameChange = (e: Event) => {
		firstName = (e.target as HTMLInputElement).value;
	};

	const handleLastNameChange = (e: Event) => {
		lastName = (e.target as HTMLInputElement).value;
	};

	const handleEmailChange = (e: Event) => {
		emailId = (e.target as HTMLInputElement).value;
	};

	const handleContactNumberChange = (e: Event) => {
		contactNumber = (e.target as HTMLInputElement).value;
	};

	const handleSystemRoleChange = (e: Event) => {
		systemRole = (e.target as HTMLSelectElement).value as UserType['system_role'];
	};

	const handleOrgNameChange = (e: Event) => {
		organizationName = (e.target as HTMLInputElement).value;
	};

	const handleOrgDescriptionChange = (e: Event) => {
		organizationDescription = (e.target as HTMLTextAreaElement).value;
	};

	const handleOrgTypeChange = (e: Event) => {
		organizationType = (e.target as HTMLSelectElement)
			.value as OrganizationType['organizationType'];
	};

	const handleOrgEmailChange = (e: Event) => {
		orgEmailId = (e.target as HTMLInputElement).value;
	};
</script>

<div class="grid-cols grid gap-4 p-6">
	<h2 class="mb-6 text-2xl font-bold">Organization & User Onboarding</h2>

	<!-- User Information Section -->
	<div class="rounded-lg border bg-blue-50 p-4">
		<h3 class="mb-4 text-lg font-semibold">User Information</h3>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter first name *"
			value={firstName}
			onchange={handleFirstNameChange}
			required
		/>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter last name"
			value={lastName}
			onchange={handleLastNameChange}
		/>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter email address *"
			type="email"
			value={emailId}
			onchange={handleEmailChange}
			required
		/>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter contact number"
			type="tel"
			value={contactNumber}
			onchange={handleContactNumberChange}
		/>

		<select
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			value={systemRole}
			onchange={handleSystemRoleChange}
		>
			<option value="Admin">Admin</option>
			<option value="Asset Owner">Asset Owner</option>
			<option value="Service Provider">Service Provider</option>
			<option value="Metquay Integrated Asset Owner">Metquay Integrated Asset Owner</option>
			<option value="Metquay Integrated Service Provider"
				>Metquay Integrated Service Provider</option
			>
		</select>
	</div>

	<!-- Organization Information Section -->
	<div class="rounded-lg border bg-green-50 p-4">
		<h3 class="mb-4 text-lg font-semibold">Organization Information</h3>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter organization name *"
			value={organizationName}
			onchange={handleOrgNameChange}
			required
		/>

		<textarea
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter organization description"
			value={organizationDescription}
			onchange={handleOrgDescriptionChange}
			rows="3"
		></textarea>

		<select
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			value={organizationType}
			onchange={handleOrgTypeChange}
		>
			<option value="Native">Native</option>
			<option value="Metquay Integrated Service Provider"
				>Metquay Integrated Service Provider</option
			>
			<option value="Metquay Integrated Asset Owner">Metquay Integrated Asset Owner</option>
		</select>

		<input
			class="mb-3 w-full rounded-3xl border-2 border-amber-950 p-3"
			placeholder="Enter organization email"
			type="email"
			value={orgEmailId}
			onchange={handleOrgEmailChange}
		/>
	</div>

	<hr />

	<!-- Register Button -->
	<button
		class="rounded-lg border bg-amber-300 p-4 text-lg font-semibold"
		onclick={handleRegisterOrgAndUser}
		disabled={$registerOrgAndUser.isPending}
	>
		{$registerOrgAndUser.isPending ? 'Registering...' : 'Register Organization & User'}
	</button>

	<hr />

	<!-- Status Messages -->
	{#if $registerOrgAndUser.isError}
		<div class="rounded-lg border bg-red-100 p-4 text-red-700">
			Error during registration: {$registerOrgAndUser.error?.message || 'Unknown error'}
		</div>
	{/if}

	{#if $registerOrgAndUser.isSuccess}
		<div class="rounded-lg border bg-green-100 p-4 text-green-700">
			<h4 class="mb-2 font-semibold">Registration Successful!</h4>
			<p>Organization and user have been registered successfully.</p>
			{#if $registerOrgAndUser.data?.data}
				<div class="mt-3 rounded border bg-white p-3">
					<p><strong>User ID:</strong> {$registerOrgAndUser.data.data.user._id}</p>
					<p><strong>Organization ID:</strong> {$registerOrgAndUser.data.data.organization._id}</p>
					<p><strong>User Email:</strong> {$registerOrgAndUser.data.data.user.emailId}</p>
					<p>
						<strong>Organization Name:</strong>
						{$registerOrgAndUser.data.data.organization.organizationName}
					</p>
				</div>
			{/if}
		</div>
	{/if}

	{#if $registerOrgAndUser.isPending}
		<div class="rounded-lg border bg-yellow-100 p-4 text-yellow-700">
			Processing registration... Please wait.
		</div>
	{/if}
</div>

<style>
	.grid-cols {
		max-width: 800px;
		margin: 0 auto;
	}

	input:focus,
	select:focus,
	textarea:focus {
		outline: none;
		border-color: #d97706;
		box-shadow: 0 0 0 2px rgba(217, 119, 6, 0.2);
	}

	button:hover:not(:disabled) {
		background-color: #f59e0b;
		transform: translateY(-1px);
		transition: all 0.2s ease;
	}

	button:disabled {
		background-color: #6b7280;
		cursor: not-allowed;
		transform: none;
	}

	.grid-cols > * {
		margin-bottom: 1rem;
	}
</style>
