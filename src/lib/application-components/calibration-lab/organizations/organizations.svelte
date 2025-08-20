<script lang="ts">
	import { useRegisterOrgAndUser } from "@/api/queries/onboarding-query";
	import { getAllOrganizations } from "@/api/queries/organization-query";
	import type { OrganizationType, UserType } from "@/Types";

	// Local state
	let orgType = $state<OrganizationType["organizationType"]>("Native");
	let searchQuery = $state<string>("");
	let filter = $state<any>({});
	let token = $state<string>("");

	// Queries & mutations
	const createOrgMutation = useRegisterOrgAndUser();
	const allorgs = getAllOrganizations(token, orgType, filter, searchQuery || "");

	// Reactive data
	const organizations = $allorgs.data?.organizations || [];
	const isLoading = $allorgs.isLoading;
	const isCreating = $createOrgMutation.isPending;

	// Handlers
	const handleOrg = async () => {
		const statOrg: Omit<OrganizationType, "_id"> = {
			organizationName: "SUDH5s",
			organizationDescription: "",
			organizationType: "Native",
			emailId: "sudhi@test.com",
			createdBy: "sudhi",
			modifiedBy: "sudhi",
			createdAt: new Date()
		};
		const userDetails: Omit<UserType, "_id"> = {
			firstName: "Sudhi",
			lastName: "Test",
			emailId: "sudhionboardingTest@gmail.com",
			createdBy: "Sudhi",
			system_role: "Service Provider",
			orgId: ""
		};

		try {
			const res = await $createOrgMutation.mutateAsync({
				user: userDetails,
				organization: statOrg,
				token: token
			});
			console.log("res", res);
			$allorgs.refetch();
		} catch (error) {
			console.error("Failed:", error);
		}
	};

	const handleRefresh = () => {
		$allorgs.refetch();
	};

	const handleSearchInput = (e: Event) => {
		const target = e.target as HTMLInputElement;
		searchQuery = target.value;
	};

	const handleOrgTypeChange = (e: Event) => {
		const target = e.target as HTMLSelectElement;
		orgType = target.value as OrganizationType["organizationType"];
	};
</script>

<style>
	.container {
		max-width: 900px;
		margin: auto;
		padding: 2rem;
		font-family: system-ui, sans-serif;
	}
	.controls {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 1.5rem;
	}
	input,
	select {
		padding: 0.6rem;
		border: 1px solid #ccc;
		border-radius: 0.5rem;
		flex: 1;
	}
	button {
		padding: 0.6rem 1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
	}
	.button-primary {
		background: #2563eb;
		color: white;
	}
	.button-secondary {
		background: #f3f4f6;
		color: #111827;
	}
	.org-card {
		padding: 1rem;
		border: 1px solid #e5e7eb;
		border-radius: 0.75rem;
		margin-bottom: 1rem;
		background: white;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}
	.org-card h3 {
		margin: 0;
		font-size: 1.25rem;
	}
	.status {
		margin: 0.5rem 0;
		color: #6b7280;
	}
</style>

<div class="container">
	<h1>Organization Management</h1>

	<!-- Controls -->
	<div class="controls">
		<input
			type="text"
			placeholder="🔍 Search organizations..."
			oninput={handleSearchInput}
			value={searchQuery}
		/>
		<select onchange={handleOrgTypeChange} value={orgType}>
			<option value="Native">Native</option>
			<option value="Metquay Integrated Service Provider">
				Metquay Integrated Service Provider
			</option>
			<option value="Metquay Integrated Asset Owner">Metquay Integrated Asset Owner</option>
			<option value="Service Provider">Service Provider</option>
		</select>
		<button class="button-primary" onclick={handleOrg}>
			{isCreating ? "⏳ Creating..." : "➕ Create Org"}
		</button>
		<button class="button-secondary" onclick={handleRefresh} disabled={isLoading}>
			{isLoading ? "🔄 Loading..." : "🔁 Refresh"}
		</button>
	</div>

	<!-- Status -->
	{#if isCreating}
		<p class="status">⏳ Creating organization...</p>
	{/if}
	{#if isLoading}
		<p class="status">🔄 Loading organizations...</p>
	{/if}

	<!-- Organizations -->
	<h2>Organizations ({organizations.length})</h2>
	{#if organizations.length === 0}
		<p>No organizations found</p>
	{:else}
		{#each organizations as org}
			<div class="org-card">
				<h3>{org.organizationName}</h3>
				<p>Type: {org.organizationType}</p>
				<p>Email: {org.emailId}</p>
				<p>Created by: {org.createdBy}</p>
				<p>ID: {org._id}</p>
			</div>
		{/each}
	{/if}

	<!-- Debug Info -->
	<details>
		<summary>Debug Info</summary>
		<pre>{JSON.stringify(
			{ orgType, searchQuery, organizationsCount: organizations.length, isLoading, isCreating },
			null,
			2
		)}</pre>
	</details>
</div>
