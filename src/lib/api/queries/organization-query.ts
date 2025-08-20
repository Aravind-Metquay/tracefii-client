import { createMutation, createQuery } from '@tanstack/svelte-query';
import { organizationService } from '../Services/organization-service';
import type { OrganizationType } from '@/Types';
import type Organizations from '@/application-components/calibration-lab/organizations/organizations.svelte';

//Create a new organization
export const useCreateNewOrganization = () => {
	return createMutation({
		mutationFn: ({
			organizationData,
			token
		}: {
			organizationData: Omit<OrganizationType, '_id'>;
			token: string;
		}) => organizationService.createNewOrganization(organizationData, token),
		onSuccess: (res) => {
			console.log(res, 'RES');
		},
		onError: (error) => {
			console.log(error, 'error');
		}
	});
};

//Get all organizations

export const getAllOrganizations = (token: string, organizationType?: string, filter?: Partial<Organizations>, searchQuery?: string,) => {
	return createQuery({
		queryKey: ['allOrgs', token, organizationType, filter, searchQuery],
		queryFn: () => organizationService.getAllOrganizations(token, organizationType, filter, searchQuery),
		enabled: !!token
	});
};

//Find organization by ID
export const useFindOrganizationById = (id: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['organization', id],
		queryFn: async () => {
			console.log(
				'Fetching organization with ID:',
				id,
				'and token:',
				token ? 'present' : 'missing'
			);
			const result = await organizationService.findOrganizationById(id!, token!);
			console.log('Organization fetch result:', result);
			return result;
		},
		enabled: !!id && !!token,
		retry: 1
	});
};

//Edit an organization
export const useEditOrganization = () => {
	return createMutation({
		mutationFn: ({ organization, token }: { organization: OrganizationType; token: string }) =>
			organizationService.editOrganization(organization, token)
	});
};

//Delete an organization
export const useDeleteOrganization = () => {
	return createMutation({
		mutationFn: ({ id, token }: { id: string; token: string }) =>
			organizationService.deleteOrganization(id, token)
	});
};
