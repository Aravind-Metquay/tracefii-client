import { createMutation, createQuery } from "@tanstack/svelte-query";
import type { WorksheetType } from "@/Types";
import { worksheetService } from "../Services/worksheet-service";

// Create a new worksheet
export const useCreateNewWorksheet = () => {
  return createMutation({
    mutationFn: ({
      worksheetData,
      token,
    }: {
      worksheetData: Omit<WorksheetType, "_id">;
      token: string;
    }) => worksheetService.createNewWorksheet(worksheetData, token),
  });
};

// Fetch all worksheets (for current user/session)
export const useGetAllWorksheets = (token: string | undefined) => {
  return createQuery({
    queryKey: ["Worksheets"],
    queryFn: async () => worksheetService.getAllWorksheets(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch all worksheets belonging to an organization, optionally filtered by type
export const useGetAllWorksheetsOfOrg = (
  orgId: string | undefined,
  token: string | undefined,
  type?: "Reference Worksheet" | "Customer Worksheet" | "All"
) => {
  return createQuery({
    queryKey: ["worksheets", orgId, type],
    queryFn: async () => worksheetService.getAllWorksheetsOfOrg(orgId!, token!, type),
    enabled: !!orgId && !!token,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch all worksheets of a specific workspace within an organization
export const useGetAllWorksheetsOfAWorkspace = (
  orgId: string | undefined,
  workspaceId: string | undefined,
  token: string | undefined
) => {
  return createQuery({
    queryKey: ["Workspace", orgId, workspaceId],
    queryFn: async () => worksheetService.getAllWorksheetsOfAWorkspace(orgId!, workspaceId!, token!),
    enabled: !!orgId && !!workspaceId,
    staleTime: 1000 * 60 * 5,
  });
};

// Fetch a worksheet by its ID
export const useFindWorksheetById = (id: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["worksheet", id],
    queryFn: async () => worksheetService.findWorksheetById(id!, token!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Edit/update an existing worksheet
export const useEditWorksheet = () => {
  return createMutation({
    mutationFn: ({
      worksheet,
      token,
    }: {
      worksheet: WorksheetType;
      token: string;
    }) => worksheetService.editWorksheet(worksheet, token),
  });
};

// Delete a worksheet by its ID
export const useDeleteWorksheet = () => {
  return createMutation({
    mutationFn: ({
      id,
      token,
    }: {
      id: string;
      token: string;
    }) => worksheetService.deleteWorksheet(id, token),
  });
};

// Delete all worksheets associated with an organization
export const useDeleteWorksheetsOfAnOrg = () => {
  return createMutation({
    mutationFn: ({
      orgId,
      token,
    }: {
      orgId: string;
      token: string;
    }) => worksheetService.deleteWorksheetsOfAnOrg(orgId, token),
  });
};
