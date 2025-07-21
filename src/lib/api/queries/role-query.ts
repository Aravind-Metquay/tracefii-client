import { createMutation, createQuery } from '@tanstack/svelte-query';
import { roleService } from '../Services/role-service';
import type { RoleType } from '@/Types';

//Create a new role
export const useCreateNewRole = () => {
	return createMutation({
		mutationFn: ({ roleData, token }: { roleData: Omit<RoleType, '_id'>; token: string }) =>
			roleService.createNewRole(roleData, token)
	});
};

//Get all roles
export const useGetAllRoles = (token: string | undefined) => {
	return createQuery({
		queryKey: ['roles'],
		queryFn: () => roleService.getAllRoles(token!),
		enabled: !!token
	});
};

//Get all roles of an organization
export const useGetAllRolesOfOrg = (orgId: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['roles', { orgId }],
		queryFn: () => roleService.getAllRolesOfOrg(orgId!, token!),
		enabled: !!orgId && !!token
	});
};

//Get all roles of a workspace within an organization
export const useGetAllRolesOfAWorkspace = (
	orgId: string | undefined,
	workspaceId: string | undefined,
	token: string | undefined
) => {
	return createQuery({
		queryKey: ['roles', { orgId, workspaceId }],
		queryFn: () => roleService.getAllRolesOfAWorkspace(orgId!, workspaceId!, token!),
		enabled: !!orgId && !!workspaceId && !!token
	});
};

//Find role by ID
export const useFindRoleById = (id: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['role', id],
		queryFn: () => roleService.findRoleById(id!, token!),
		enabled: !!id && !!token
	});
};

//Edit a role
export const useEditRole = () => {
	return createMutation({
		mutationFn: ({ role, token }: { role: RoleType; token: string }) =>
			roleService.editRole(role, token)
	});
};

//Delete a role
export const useDeleteRole = () => {
	return createMutation({
		mutationFn: ({ id, token }: { id: string; token: string }) => roleService.deleteRole(id, token)
	});
};

//Delete all roles of an organization
export const useDeleteRolesOfAnOrg = () => {
	return createMutation({
		mutationFn: ({ orgId, token }: { orgId: string; token: string }) =>
			roleService.deleteRolesOfAnOrg(orgId, token)
	});
};
