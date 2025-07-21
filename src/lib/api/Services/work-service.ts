import axios from "axios";
import type { WorkType, ApiResponse, CreateWorkType } from "@/Types";
import { env } from "$env/dynamic/public";

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const WORK_ENDPOINT = `${API_BASE_URL}/work`;

interface WorkResponse {
  works: WorkType[];
  totalCount: number;
}

export class WorkService {
  /**
   * Create a new work
   */
  async createNewWork(
    workData: Omit<CreateWorkType, "_id">,
    token: string
  ): Promise<ApiResponse<CreateWorkType>> {
    const response = await axios.post<ApiResponse<CreateWorkType>>(
      WORK_ENDPOINT,
      workData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all works
   */
  async getAllWorks(token: string): Promise<ApiResponse<WorkType[]>> {
    const response = await axios.get<ApiResponse<WorkType[]>>(WORK_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Get all works of an organization
   */
  async getAllWorksOfOrg(
    orgId: string,
    token: string
  ): Promise<WorkResponse> {
    const response = await axios.get<WorkResponse>(
      `${WORK_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all works of a workspace within an organization
   */
  async getAllWorksOfAWorkspace(
    orgId: string,
    workspaceId: string,
    token: string
  ): Promise<ApiResponse<WorkType[]>> {
    const response = await axios.get<ApiResponse<WorkType[]>>(
      `${WORK_ENDPOINT}/organization/${orgId}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Find work by ID
   */
  async findWorkById(
    id: string,
    orgId : string,
    token: string
  ): Promise<WorkType> {
    const response = await axios.get<WorkType>(
      `${WORK_ENDPOINT}/${id}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Edit a work
   */
  async editWork(
    work: CreateWorkType,
    token: string
  ): Promise<ApiResponse<CreateWorkType>> {
    const response = await axios.patch<ApiResponse<CreateWorkType>>(
      `${WORK_ENDPOINT}/${work._id}`,
      work,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a work
   */
  async deleteWork(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORK_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all works of an organization
   */
  async deleteWorksOfAnOrg(
    orgId: string,
    token: string
  ): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORK_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const workService = new WorkService();
