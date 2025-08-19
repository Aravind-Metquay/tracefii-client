import { createMutation } from "@tanstack/svelte-query";
import { onboardingService } from "../Services/onboarding-service";
import type { UserType, OrganizationType } from "@/Types";

// Register a new organization and user (onboarding step)
export const useRegisterOrgAndUser = () => {
    return createMutation({
        mutationFn: ({
            user,
            organization,
            token = "",
        }: {
            user: Omit<UserType, "_id">,
            organization: Omit<OrganizationType, "_id">
            token: string,
        }) => onboardingService.registerOrganizationAndUser(user, organization, token),
    });
};
