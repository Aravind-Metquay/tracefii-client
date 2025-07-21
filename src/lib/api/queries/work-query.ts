import { createMutation, createQuery } from "@tanstack/svelte-query";
import { workService } from "../Services/work-service";
import type { WorkType, CreateWorkType } from "@/Types";


// Create a new work
export const useCreateNewWork = () => {
  return createMutation({
    mutationFn: ({
      workData,
      token,
    }: {
      workData: Omit<CreateWorkType, "_id">;
      token: string;
    }) => workService.createNewWork(workData, token),
  });
};


// Fetch all works (for a user/session)
export const useGetAllWorks = (token: string | undefined) => {
  return createQuery({
    queryKey: ["works"],
    queryFn: () => workService.getAllWorks(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};


// Fetch all works belonging to an organization
export const useGetAllWorksOfOrg = (orgId: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["org", orgId],
    queryFn: () => workService.getAllWorksOfOrg(orgId!, token!),
    enabled: !!orgId && !!token,
    staleTime: 1000 * 60 * 5,
  });
};


// Fetch all works within a workspace of an organization
export const useGetAllWorksOfAWorkspace = (
  orgId: string | undefined,
  workspaceId: string | undefined,
  token: string | undefined
) => {
  return createQuery({
    queryKey: ["org", orgId, "workspace", workspaceId],
    queryFn: () => workService.getAllWorksOfAWorkspace(orgId!, workspaceId!, token!),
    enabled: !!orgId && !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};


// Fetch a single work by its ID within an organization
export const useFindWorkById = (
  id: string | undefined,
  orgId: string | undefined,
  token: string | undefined
) => {
  return createQuery({
    queryKey: ["work", id, "org", orgId],
    queryFn: () => workService.findWorkById(id!, orgId!, token!),
    enabled: !!id && !!orgId && !!token,
    staleTime: 1000 * 60 * 5,
  });
};


// Edit an existing work
export const useEditWork = () => {
  return createMutation({
    mutationFn: ({
      work,
      token,
    }: {
      work: CreateWorkType;
      token: string;
    }) => workService.editWork(work, token),
  });
};


// Delete a work by ID
export const useDeleteWork = () => {
  return createMutation({
    mutationFn: ({
      id,
      token,
    }: {
      id: string;
      token: string;
    }) => workService.deleteWork(id, token),
  });
};


// Delete all works associated with an organization
export const useDeleteWorksOfAnOrg = () => {
  return createMutation({
    mutationFn: ({
      orgId,
      token,
    }: {
      orgId: string;
      token: string;
    }) => workService.deleteWorksOfAnOrg(orgId, token),
  });
};
