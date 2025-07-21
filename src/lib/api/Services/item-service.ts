import axios from 'axios';
import type { ItemType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ITEM_ENDPOINT = `${API_BASE_URL}/item`;

interface ItemResponse {
  items: ItemType[];
  productsCount: number;
  servicesCount: number;
  totalCount : number
}
export class ItemService {
  /**
   * Create a new item
   */
  async createNewItem(
    itemData: Omit<ItemType, "_id">, 
    token: string
  ): Promise<ApiResponse<ItemType>> {
    const response = await axios.post<ApiResponse<ItemType>>(
      ITEM_ENDPOINT,
      itemData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all items
   */
  async getAllItems(token: string): Promise<ItemResponse> {
    const response = await axios.get<ApiResponse<ItemResponse>>(
      ITEM_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all items of an organization
   */
  async getAllItemsOfOrg(
    orgId: string, 
    token: string
  ): Promise<ItemResponse> {
    const response = await axios.get<ApiResponse<ItemResponse>>(
      `${ITEM_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }
  /**
   * Get all items of an organization with filter
   */
  async getAllItemsOfOrgWithFilter(
    orgId: string, 
    itemType:string,
    filter:string,
    token: string
  ): Promise<ItemResponse> {
    const response = await axios.get<ApiResponse<ItemResponse>>(
      `${ITEM_ENDPOINT}/organization/${orgId}/itemType/${itemType}/filter/${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Find item by ID
   */
  async findItemById(id: string, token: string): Promise<ItemType> {
    const response = await axios.get<ApiResponse<ItemType>>(
      `${ITEM_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Edit a item
   */
  async editItem(item: ItemType, token: string): Promise<ApiResponse<ItemType>> {
    const response = await axios.patch<ApiResponse<ItemType>>(
      `${ITEM_ENDPOINT}/${item._id}`,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a item
   */
  async deleteItem(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ITEM_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all items of an organization
   */
  async deleteItemsOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ITEM_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const itemService = new ItemService();