import axios from 'axios';
import type { OrganizationType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ORGANIZATION_ENDPOINT = `${API_BASE_URL}/organization`;

interface allOrgType {
  organizations: OrganizationType[]
  count: number
}

export class OrganizationService {
  /**
   * Create a new organization
   */
  async createNewOrganization(
    organizationData: Omit<OrganizationType, "_id">,
    token: string
  ): Promise<ApiResponse<OrganizationType>> {
    const response = await axios.post<ApiResponse<OrganizationType>>(
      ORGANIZATION_ENDPOINT,
      organizationData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all organizations
   */
  async getAllOrganizations(token: string, organizationType?: string, filter?: string): Promise<allOrgType> {
    const response = await axios.get<allOrgType>(
      `${ORGANIZATION_ENDPOINT}/organizationType/${organizationType || "All"}`,
      {
        params: {
          filter: filter || '',
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Find organization by ID
   */
  async findOrganizationById(id: string, token: string): Promise<ApiResponse<OrganizationType>> {
    const response = await axios.get<ApiResponse<OrganizationType>>(
      `${ORGANIZATION_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Edit an organization
   */
  async editOrganization(
    organization: OrganizationType,
    token: string
  ): Promise<ApiResponse<OrganizationType>> {
    const response = await axios.patch<ApiResponse<OrganizationType>>(
      `${ORGANIZATION_ENDPOINT}/${organization._id}`,
      organization,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete an organization
   */
  async deleteOrganization(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ORGANIZATION_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const organizationService = new OrganizationService();