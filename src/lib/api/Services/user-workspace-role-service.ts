import axios from 'axios';
import type { UserWorkspaceRoleType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const USER_WORKSPACE_ROLE_ENDPOINT = `${API_BASE_URL}/user-workspace-role`;

interface ResponseWorkspaceRole{
  count : number;
  userWorkspaceRoleMappings : UserWorkspaceRoleType[] ;
}
export class UserWorkspaceRoleService {
  /**
   * Create a new user workspace role mapping
   */
  async createNewUserWorkspaceRoleMapping(
    mappingData: Omit<UserWorkspaceRoleType, "_id">, 
    token: string
  ): Promise<ApiResponse<UserWorkspaceRoleType>> {
    const response = await axios.post<ApiResponse<UserWorkspaceRoleType>>(
      USER_WORKSPACE_ROLE_ENDPOINT,
      mappingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
 /**
   * Create multiple user workspace role mappings of a user
   */
async createBatchMappings(
    mappingsData: Omit<UserWorkspaceRoleType, "_id">[],
    token: string 
  ): Promise<ApiResponse<UserWorkspaceRoleType[]>> {
  const response = await axios.post<ApiResponse<UserWorkspaceRoleType[]>>(
    `${USER_WORKSPACE_ROLE_ENDPOINT}/batch/create`,
    mappingsData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}

  /**
   * Get all mappings of a user
   */
  async getAllMappingsOfAUser(
    emailId: string, 
    token: string
  ): Promise<ResponseWorkspaceRole> {
    const response = await axios.get<ApiResponse<ResponseWorkspaceRole>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/user/${emailId}/mappings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }
  
  async getMappingWithWorkspaceAndUser(
    emailId: string,
    workspaceId :string ,
    token: string
  ): Promise<{userWorkspaceRoleMappings : UserWorkspaceRoleType}> {
    const response = await axios.get<ApiResponse<{userWorkspaceRoleMappings : UserWorkspaceRoleType}>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/user/${emailId}/workspace/${workspaceId}/mappings`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Edit user workspace role mapping
   */
  async editUserWorkspaceRoleMappingOfUser(
    mappingData: UserWorkspaceRoleType, 
    token: string
  ): Promise<ApiResponse<UserWorkspaceRoleType>> {
    const response = await axios.patch<ApiResponse<UserWorkspaceRoleType>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/${mappingData._id}`,
      mappingData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete user workspace role mapping
   */
  async deleteUserWorkspaceRoleMappingofUser(
    id: string, 
    token: string
  ): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

/**
 * Delete multiple mappings of an user
 */

async deleteBatchMappings(
  ids: string[],
  token: string
): Promise<ApiResponse<void>> {
  const response = await axios.delete<ApiResponse<void>>(
    `${USER_WORKSPACE_ROLE_ENDPOINT}/batch/delete`,
    {
      data: { ids },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
}


  /**
   * Delete all mappings of an organization
   */
  async deleteUserWorkspaceRoleMappingsOfOrg(
    orgId: string, 
    token: string
  ): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all mappings of a user
   */
  async deleteUserWorkspaceRoleMappingsOfUser(
    emailId: string, 
    token: string
  ): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_WORKSPACE_ROLE_ENDPOINT}/user/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const userWorkspaceRoleService = new UserWorkspaceRoleService();