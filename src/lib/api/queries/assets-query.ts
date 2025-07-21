import { createQuery, createMutation } from '@tanstack/svelte-query';
import { assetService } from '../Services/assets-service';
import type { AssetType } from '@/Types';

//Create a new asset
export const useCreateNewAsset = () => {
	return createMutation({
		mutationFn: ({ assetData, token }: { assetData: Omit<AssetType, '_id'>[]; token: string }) =>
			assetService.createNewAsset(assetData, token)
	});
};

//Get all assets
export const useGetAllAssets = (token: string | undefined) => {
	return createQuery({
		queryKey: ['assets'],
		queryFn: () => assetService.getAllAssets(token!),
		enabled: !!token
	});
};

//Get all assets of an organization
export const useGetAllAssetsOfOrg = (orgId: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['assets', { orgId }],
		queryFn: () => assetService.getAllAssetsOfOrg(orgId!, token!),
		enabled: !!orgId && !!token
	});
};

//Get all items of an organization with filter
export const useGetAllAssetsOfOrgWithFilter = (
	orgId: string | undefined,
	assetMode: string | undefined,
	filter: string | undefined,
	token: string | undefined
) => {
	return createQuery({
		queryKey: ['assets', { orgId, assetMode, filter }],
		queryFn: () => assetService.getAllAssetsOfOrgWithFilter(orgId!, assetMode!, filter!, token!),

		enabled: !!orgId && !!assetMode && !!filter && !!token
	});
};

//Find asset by ID
export const useFindAssetById = (id: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['asset', id],
		queryFn: () => assetService.findAssetById(id!, token!),
		enabled: !!id && !!token
	});
};

//Edit an asset
export const useEditAsset = () => {
	return createMutation({
		mutationFn: ({ asset, token }: { asset: AssetType; token: string }) =>
			assetService.editAsset(asset, token)
	});
};

//Delete a asset
export const useDeleteAsset = () => {
	return createMutation({
		mutationFn: ({ id, token }: { id: string; token: string }) =>
			assetService.deleteAsset(id, token)
	});
};

//Delete all assets of an organization
export const useDeleteAssetsOfAnOrg = () => {
	return createMutation({
		mutationFn: ({ orgId, token }: { orgId: string; token: string }) =>
			assetService.deleteAssetsOfAnOrg(orgId, token)
	});
};
