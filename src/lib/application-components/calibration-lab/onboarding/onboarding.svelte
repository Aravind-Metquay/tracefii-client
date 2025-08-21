<script lang="ts">
	import { auth } from './../../../svelte-auth0/auth.svelte.ts';
	import { useRegisterOrgAndUser } from "@/api/queries/onboarding-query";
	import { page } from '$app/state';
	import type { OrganizationType, UserType } from "@/Types";
	import Input from "@/components/ui/input/input.svelte";
	import { goto } from "$app/navigation";
	import Button from "@/components/ui/button/button.svelte";
	import { ChevronLeft } from "@lucide/svelte";

	// Props
	export let token = "";
	const userDetails = (page?.state as any)?.userDetails as Omit<UserType, "_id">;
    if (!userDetails) {
       goto("/auth/login");
    }

	const createOrgMutation = useRegisterOrgAndUser();
	
	// Form data
	let organizationName = "";
	let description = "";
	let acceptTerms = false;
	let showAdditionalInfo = false;
		
	const handleSubmit = async () => {
		if (!organizationName.trim()) {
			alert("Please enter an organization name");
			return;
		}
		
		if (!acceptTerms) {
			alert("Please accept the terms and conditions");
			return;
		}
		
		const statOrg:Omit<OrganizationType,"_id"> = {
			organizationName: organizationName,
			organizationDescription: description,
			organizationType: "Native",
			emailId: userDetails.emailId,
			createdBy: userDetails.firstName + " " + userDetails.lastName,
		};
		
		try {
			const res = await $createOrgMutation.mutateAsync({
				user: userDetails,
				organization: statOrg,
				token: token
			});
			console.log("Organization created successfully:", res);

            if(res.success) {
                alert("Organization created successfully!");
            // Reset form
			organizationName = "";
			description = "";
			acceptTerms = false;
            
            localStorage.setItem('userMappings', JSON.stringify({ userId: res.mapping.userId, orgId: res.mapping.orgId }));
            goto('/calibration-lab/dashboard');
            }else{
                alert("Failed to create organization. Please try again.");
            }
		} catch (error) {
			console.error("Failed to create organization:", error);
		}
	};
	
	// Toggle additional information section
	const toggleAdditionalInfo = () => {
		showAdditionalInfo = !showAdditionalInfo;
	};
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
	<div class="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
		<h1 class="text-xl font-bold text-gray-900 mb-8">
			Create an organization to get started
		</h1>
		
		<form on:submit|preventDefault={handleSubmit} class="space-y-5">
			<!-- Organization Name -->
			<div>
				<label for="orgName" class="block text-sm font-medium text-gray-700 mb-1">
					Organization Name <span class="text-red-500">*</span>
				</label>
                <Input 
                    id="orgName"
					type="text"
					bind:value={organizationName}
					placeholder="Enter organization name"
					class="w-full text-sm px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors"
					required
                    />
			
			</div>
			
			<!-- Description -->
			<div>
				<label for="description" class="block text-sm font-medium text-gray-700 mb-1">
					Description
				</label>
				<textarea
					id="description"
					bind:value={description}
					placeholder="Tell us about your organization."
					class="w-full px-4 py-5 border border-gray-300  text-sm rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-colors resize-none "
				></textarea>
			</div>
			
			<!-- Additional Information Toggle -->
			<div>
				<button
					type="button"
					on:click={toggleAdditionalInfo}
					class="flex items-center justify-between w-full text-left text-sm font-medium text-gray-700 py-1 hover:text-gray-900 transition-colors "
				>
					<span>Additional Information</span>
                    <ChevronLeft 
                    	class="w-4 h-4 transform transition-transform {showAdditionalInfo ? '-rotate-90' : ''}"
                    />
				</button>
				
				{#if showAdditionalInfo}
					<div class="mt-4 p-4 bg-gray-50 rounded-lg">
						<p class="text-sm text-gray-600">
							Additional organization details can be configured after registration.
						</p>
					</div>
				{/if}
			</div>
			
			<!-- Terms and Conditions -->
			<div class="flex items-center space-x-2">
				<input
					id="terms"
					type="checkbox"
					bind:checked={acceptTerms}
					class="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
				/>
				<label for="terms" class="text-sm text-gray-700">
					I accept the 
					<a class="text-purple-600 hover:text-purple-700 underline">
						terms and conditions
					</a>
				</label>
			</div>
			
			<!-- Submit Button -->
			<Button
				type="submit"
				disabled={$createOrgMutation.isPending || !organizationName.trim() || !acceptTerms}
				class="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-500 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
			>
				{#if $createOrgMutation.isPending}
					<div class="flex items-center justify-center space-x-2">
						<svg class="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
						</svg>
						<span>Creating...</span>
					</div>
				{:else}
					Register
				{/if}
			</Button>
		</form>
		
		<!-- Success/Error Messages -->
		{#if $createOrgMutation.isSuccess}
			<div class="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            >
				<p class="text-sm text-green-800">Organization created successfully!</p>
			</div>
		{/if}
		
		{#if $createOrgMutation.isError}
			<div class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
				<p class="text-sm text-red-800">
					Failed to create organization. Please try again.
				</p>
			</div>
		{/if}
	</div>
</div>