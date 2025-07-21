import { createQuery, createMutation } from '@tanstack/svelte-query';
import { procedureService } from '../Services/procedure-service';
import type { ProcedureType } from '@/Types';

//Create a new procedure
export const useCreateNewProcedure = () => {
	return createMutation({
		mutationFn: ({
			procedureData,
			token
		}: {
			procedureData: Omit<ProcedureType, '_id'>;
			token: string;
		}) => procedureService.createNewProcedure(procedureData, token)
	});
};

//Get all procedures
export const useGetAllProcedures = (token: string | undefined) => {
	return createQuery({
		queryKey: ['procedures'],
		queryFn: () => procedureService.getAllProcedures(token!),
		enabled: !!token
	});
};

//Get all procedures of an organization
export const useGetAllProceduresOfOrg = (orgId: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['procedures', { orgId }],
		queryFn: () => procedureService.getAllProceduresOfOrg(orgId!, token!),
		enabled: !!orgId && !!token
	});
};

//Get all procedures of a workspace within an organization
export const useGetAllProceduresOfAWorkspace = (
	orgId: string | undefined,
	workspaceId: string | undefined,
	token: string | undefined
) => {
	return createQuery({
		queryKey: ['procedures', { orgId, workspaceId }],
		queryFn: () => procedureService.getAllProceduresOfAWorkspace(orgId!, workspaceId!, token!),
		enabled: !!orgId && !!workspaceId && !!token
	});
};

//Find procedure by ID
export const useFindProcedureById = (id: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['procedure', id],
		queryFn: () => procedureService.findProcedureById(id!, token!),
		enabled: !!id && !!token
	});
};

//Edit a procedure
export const useEditProcedure = () => {
	return createMutation({
		mutationFn: ({ procedure, token }: { procedure: ProcedureType; token: string }) =>
			procedureService.editProcedure(procedure, token)
	});
};

//Delete a procedure
export const useDeleteProcedure = () => {
	return createMutation({
		mutationFn: ({ id, token }: { id: string; token: string }) =>
			procedureService.deleteProcedure(id, token)
	});
};

//Delete all procedures of an organization
export const useDeleteProceduresOfAnOrg = () => {
	return createMutation({
		mutationFn: ({ orgId, token }: { orgId: string; token: string }) =>
			procedureService.deleteProceduresOfAnOrg(orgId, token)
	});
};
