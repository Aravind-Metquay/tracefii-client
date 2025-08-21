import axios from 'axios';
import type { WorkspaceType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const WORKSPACE_ENDPOINT = `${API_BASE_URL}/workspace`;

interface responseWorkspaces {
  workspaces: WorkspaceType[];
  count: number;
}

export class WorkspaceService {
  /**
   * Create a new workspace
   */
  async createNewWorkspace(
    workspaceData: Omit<WorkspaceType, "_id">, 
    token: string
  ): Promise<ApiResponse<WorkspaceType>> {
    const response = await axios.post<ApiResponse<WorkspaceType>>(
      WORKSPACE_ENDPOINT,
      workspaceData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all workspaces
   */
  async getAllWorkspaces(token: string): Promise<responseWorkspaces> {
    const response = await axios.get<ApiResponse<responseWorkspaces>>(
      WORKSPACE_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all workspaces of an organization 
   */
  async getAllWorkspacesOfOrg(
    orgId: string, 
    token: string
  ): Promise<{ Workspaces: WorkspaceType[] }> {
    const response = await axios.get(
      `${WORKSPACE_ENDPOINT}/${orgId}`, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Return the full response structure
  }

  /**
   * Edit a workspace
   */
  async editWorkspace(workspace: WorkspaceType, token: string): Promise<ApiResponse<WorkspaceType>> {
    const response = await axios.patch<ApiResponse<WorkspaceType>>(
      `${WORKSPACE_ENDPOINT}/${workspace._id}`,
      workspace,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a workspace
   */
  async deleteWorkspace(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORKSPACE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all workspaces of an organization
   */
  async deleteWorkspacesOfOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORKSPACE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const workspaceService = new WorkspaceService();