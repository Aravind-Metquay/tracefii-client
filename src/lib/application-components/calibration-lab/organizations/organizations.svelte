<script lang="ts">
    import { getAllOrganizations, useCreateNewOrganization } from "@/api/queries/organization-query";
    import type { OrganizationType } from "@/Types";
    // Local state using $state (if you had any local state to manage)
    let orgType = $state("Native");
    let searchTerm = $state("");
    let token = $state("");
    // Create mutation using runes
    const createOrgMutation = useCreateNewOrganization();
    // Get all organizations query - now reactive to local state
    const allorgs = getAllOrganizations(searchTerm, orgType, token);
    // Refetch function reference
    const refetch = $allorgs.refetch;
    const handleOrg = async () => {
        const statOrg: Omit<OrganizationType, '_id'> = {
            organizationName: "SUDH5s",
            organizationDescription: "",
            organizationType: "Native",
            emailId: "sudhi@test.com",
            createdBy: "sudhi",
            modifiedBy: "sudhi",
            createdAt: new Date() // or omit this field entirely if it's set server-side
        }
        try {
            await $createOrgMutation.mutateAsync({
                organizationData: statOrg,
                token: token // Now using the reactive state
            });
            refetch();
        } catch (error) {
            console.error("Failed:", error);
        }
    }
    const getOrg = async () => {
        console.log("refetch");
        refetch();
    }
</script>
<button onclick={handleOrg}>Create Org</button>
<button onclick={getOrg}>get Org</button>
<h1>{$createOrgMutation.isPending ? "Creating" : ""}</h1>
<p>{$allorgs.isLoading}</p>
{$allorgs.data?.pagination.totalItems}
<!-- <input type="text" onchange={(e) => {searchTerm = e.target.value}}> -->