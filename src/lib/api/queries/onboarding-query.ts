import { createMutation } from "@tanstack/svelte-query";
import { onboardingService } from "../Services/onboarding-service";
import type { UserType,OrganizationType } from "@/Types";

export const useRegisterOrgAndUser=()=>{
    return createMutation({
        mutationFn:({
            user,
            organization
        } : {
            user: Omit<UserType,"_id">,
            organization: Omit<OrganizationType,"_id">
        })=>onboardingService.registerOrganizationAndUser(user,organization),
    });
};