import { createMutation, createQuery } from '@tanstack/svelte-query';
import type { ItemType } from '@/Types';
import { itemService } from '../Services/item-service';

//Create a new item
export const useCreateNewItem = () => {
	return createMutation({
		mutationFn: ({ itemData, token }: { itemData: Omit<ItemType, '_id'>; token: string }) =>
			itemService.createNewItem(itemData, token)
	});
};

//Get all items
export const useGetAllItems = (token: string | undefined) => {
	return createQuery({
		queryKey: ['items'],
		queryFn: () => itemService.getAllItems(token!),
		enabled: !!token
	});
};

//Get all items of an organization
export const useGetAllItemsOfOrg = (orgId: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['items', { orgId }],
		queryFn: () => itemService.getAllItemsOfOrg(orgId!, token!),
		enabled: !!orgId && !!token
	});
};

//Get all items of an organization with filter. ->Filter is string<-
export const useGetAllItemsOfOrgWithFilter = (
	orgId: string | undefined,
	itemType: string | undefined,
	filter: string | undefined,
	token: string | undefined
) => {
	return createQuery({
		queryKey: ['items', { orgId, itemType, filter }],
		queryFn: () => itemService.getAllItemsOfOrgWithFilter(orgId!, itemType!, filter!, token!),
		enabled: !!orgId && !!itemType && !!filter && !!token
	});
};

//Find item by ID
export const useFindItemById = (id: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['item', id],
		queryFn: () => itemService.findItemById(id!, token!),
		enabled: !!id && !!token
	});
};

//Edit a item
export const useEditItem = () => {
	return createMutation({
		mutationFn: ({ item, token }: { item: ItemType; token: string }) =>
			itemService.editItem(item, token)
	});
};

//Delete a item
export const useDeleteItem = () => {
	return createMutation({
		mutationFn: ({ id, token }: { id: string; token: string }) => itemService.deleteItem(id, token)
	});
};

//Delete all items of an organization
export const useDeleteItemsOfAnOrg = () => {
	return createMutation({
		mutationFn: ({ orgId, token }: { orgId: string; token: string }) =>
			itemService.deleteItemsOfAnOrg(orgId, token)
	});
};
