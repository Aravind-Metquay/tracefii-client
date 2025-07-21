import axios from 'axios';
import type { RoleType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ROLE_ENDPOINT = `${API_BASE_URL}/role`;

interface RolesResponse {
  roles: RoleType[];
  count : number
}
export class RoleService {
  /**
   * Create a new role
   */
  async createNewRole(
    roleData: Omit<RoleType, "_id">, 
    token: string
  ): Promise<ApiResponse<RoleType>> {
    const response = await axios.post<ApiResponse<RoleType>>(
      ROLE_ENDPOINT,
      roleData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all roles
   */
  async getAllRoles(token: string): Promise<RolesResponse> {
    const response = await axios.get<ApiResponse<RolesResponse>>(
      ROLE_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all roles of an organization
   */
  async getAllRolesOfOrg(
    orgId: string, 
    token: string
  ): Promise<RolesResponse> {
    const response = await axios.get<ApiResponse<RolesResponse>>(
      `${ROLE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all roles of a workspace within an organization
   */
  async getAllRolesOfAWorkspace(
    orgId: string,
    workspaceId: string,
    token: string
  ): Promise<RolesResponse> {
    const response = await axios.get<ApiResponse<RolesResponse>>(
      `${ROLE_ENDPOINT}/organization/${orgId}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Find role by ID
   */
  async findRoleById(id: string, token: string): Promise<RoleType> {
    const response = await axios.get<ApiResponse<RoleType>>(
      `${ROLE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Edit a role
   */
  async editRole(role: RoleType, token: string): Promise<ApiResponse<RoleType>> {
    const response = await axios.patch<ApiResponse<RoleType>>(
      `${ROLE_ENDPOINT}/${role._id}`,
      role,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a role
   */
  async deleteRole(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ROLE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all roles of an organization
   */
  async deleteRolesOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${ROLE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const roleService = new RoleService();