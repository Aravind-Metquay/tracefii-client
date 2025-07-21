import { createMutation, createQuery } from "@tanstack/svelte-query";
import type { UserWorkspaceRoleType } from "@/Types";
import { userWorkspaceRoleService } from "../Services/user-workspace-role-service";

// Create a new user/workspace/role mapping
export const useCreateNewUserWorkspaceRoleMapping = () => {
  return createMutation({
    mutationFn: ({
      mappingData,
      token,
    }: {
      mappingData: Omit<UserWorkspaceRoleType, "_id">;
      token: string;
    }) => userWorkspaceRoleService.createNewUserWorkspaceRoleMapping(mappingData, token),
  });
};

// Create multiple user/workspace/role mappings at once (batch)
export const useCreateBatchMappings = () => {
  return createMutation({
    mutationFn: ({
      mappingData,
      token,
    }: {
      mappingData: Omit<UserWorkspaceRoleType, "_id">[];
      token: string;
    }) => userWorkspaceRoleService.createBatchMappings(mappingData, token),
  });
};

// Fetch all workspace-role mappings for a user by email
export const useGetAllMappingsOfAUser = (emailId: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["email", emailId],
    queryFn: async () =>
      await userWorkspaceRoleService.getAllMappingsOfAUser(emailId!, token!),
    enabled: !!emailId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch the mapping of a specific user-workspace pair
export const useGetMappingWithWorkspaceAndUser = (
  emailId: string | undefined,
  workspaceId: string | undefined,
  token: string | undefined
) => {
  return createQuery({
    queryKey: ["mapping", emailId, workspaceId],
    queryFn: async () =>
      await userWorkspaceRoleService.getMappingWithWorkspaceAndUser(emailId!, workspaceId!, token!),
    enabled: !!emailId && !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};

// Edit (update) a user-workspace-role mapping
export const useEditUserWorkspaceRoleMappingOfUser = () => {
  return createMutation({
    mutationFn: ({
      mappingData,
      token,
    }: {
      mappingData: UserWorkspaceRoleType;
      token: string;
    }) =>
      userWorkspaceRoleService.editUserWorkspaceRoleMappingOfUser(mappingData, token),
  });
};

// Delete a specific user-workspace-role mapping by id
export const useDeleteUserWorkspaceRoleMappingofUser = () => {
  return createMutation({
    mutationFn: ({
      id,
      token,
    }: {
      id: string;
      token: string;
    }) => userWorkspaceRoleService.deleteUserWorkspaceRoleMappingofUser(id, token),
  });
};

// Delete multiple user-workspace-role mappings in batch
export const useDeleteBatchMappings = () => {
  return createMutation({
    mutationFn: ({
      ids,
      token,
    }: {
      ids: string[];
      token: string;
    }) => userWorkspaceRoleService.deleteBatchMappings(ids, token),
  });
};

// Delete all role mappings of an organization
export const useDeleteUserWorkspaceRoleMappingsOfOrg = () => {
  return createMutation({
    mutationFn: ({
      orgId,
      token,
    }: {
      orgId: string;
      token: string;
    }) =>
      userWorkspaceRoleService.deleteUserWorkspaceRoleMappingsOfOrg(orgId, token),
  });
};

// Delete all workspace-role mappings of a particular user
export const useDeleteUserWorkspaceRoleMappingsOfUser = () => {
  return createMutation({
    mutationFn: ({
      emailId,
      token,
    }: {
      emailId: string;
      token: string;
    }) =>
      userWorkspaceRoleService.deleteUserWorkspaceRoleMappingofUser(emailId, token),
  });
};
