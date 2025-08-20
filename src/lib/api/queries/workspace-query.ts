import type { WorkspaceQueryParams, WorkspaceType } from '@/Types';
import { workspaceService } from '../Services/workspace-service';
import { createMutation, createQuery } from '@tanstack/svelte-query';

// Create a new workspace
export const useCreateNewWorkspace = () => {
	return createMutation({
		mutationFn: ({
			workspaceData,
			token
		}: {
			workspaceData: Omit<WorkspaceType, '_id'>;
			token: string;
		}) => workspaceService.createNewWorkspace(workspaceData, token)
	});
};

// Fetch all workspaces (for the current user/session)
export const useGetAllWorkspaces = (token: string | undefined, params?: WorkspaceQueryParams) => {
	return createQuery({
		queryKey: ['WorkSpaces', params],
		queryFn: async () => await workspaceService.getAllWorkspaces(token!, params),
		enabled: !!token,
		staleTime: 1000 * 60 * 5
	});
};

// Fetch all workspaces belonging to an organization
export const useGetAllWorkspacesOfOrg = (
	orgId: string | undefined,
	token: string | undefined,
	params?: WorkspaceQueryParams
) => {
	return createQuery({
		queryKey: ['orgid', orgId, params],
		queryFn: async () => await workspaceService.getAllWorkspacesOfOrg(orgId!, token!, params)
	});
};

// Edit/update an existing workspace
export const useEditWorkspace = () => {
	return createMutation({
		mutationFn: ({ workspace, token }: { workspace: WorkspaceType; token: string }) =>
			workspaceService.editWorkspace(workspace, token)
	});
};

// Delete a specific workspace by ID [ As suggested by Kevin pass the orgID as props too]
export const useDeleteWorkspace = () => {
	return createMutation({
		mutationFn: (
			{ id, token }: { id: string; token: string } // PASS orgID with this too
		) => workspaceService.deleteWorkspace(id, token)
	});
};

// Delete all workspaces belonging to an organization
export const useDeleteWorkspacesofOrg = () => {
	return createMutation({
		mutationFn: ({ orgId, token }: { orgId: string; token: string }) =>
			workspaceService.deleteWorkspacesOfOrg(orgId, token)
	});
};
