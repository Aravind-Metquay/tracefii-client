import { env } from '$env/dynamic/public';
import type { ApiResponse, AssetType } from '@/Types';
import axios from 'axios';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ASSET_ENDPOINT = `${API_BASE_URL}/asset`;

interface AssetResponse {
  assets: AssetType[];
  count : number
}
export class AssetService {
  /**
   * Create a new asset
   */
  async createNewAsset(
    assetData: Omit<AssetType, "_id">[], 
    token: string
  ): Promise<ApiResponse<AssetType>> {
    const response = await axios.post<ApiResponse<AssetType>>(
      ASSET_ENDPOINT,
      assetData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all assets
   */
  async getAllAssets(token: string): Promise<AssetResponse> {
    const response = await axios.get<ApiResponse<AssetResponse>>(
      ASSET_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all assets of an organization
   */
  async getAllAssetsOfOrg(
    orgId: string, 
    token: string
  ): Promise<AssetResponse> {
    const response = await axios.get<ApiResponse<AssetResponse>>(
      `${ASSET_ENDPOINT}/organization/${orgId}`,
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
  async getAllAssetsOfOrgWithFilter(
    orgId: string, 
    assetMode:string,
    filter:string,
    token: string
  ): Promise<AssetResponse> {
    const response = await axios.get<ApiResponse<AssetResponse>>(
      `${ASSET_ENDPOINT}/organization/${orgId}/assetMode/${assetMode}/filter/${filter}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }
  /**
   * Find asset by ID
   */
  async findAssetById(id: string, token: string): Promise<AssetType> {
    const response = await axios.get<ApiResponse<AssetType>>(
      `${ASSET_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Edit an asset
   */
  async editAsset(asset: AssetType, token: string): Promise<ApiResponse<AssetType>> {
    const response = await axios.patch<ApiResponse<AssetType>>(
      `${ASSET_ENDPOINT}/${asset._id}`,
      asset,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a asset
   */
  async deleteAsset(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ASSET_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all assets of an organization
   */
  async deleteAssetsOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ASSET_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const assetService = new AssetService();