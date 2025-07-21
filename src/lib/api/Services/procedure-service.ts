import axios from 'axios';
import type { ProcedureType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const PROCEDURE_ENDPOINT = `${API_BASE_URL}/procedure`;

interface ProcedureResponse {
  procedures: ProcedureType[];
  totalCount: number;
}

export class ProcedureService {
  /**
   * Create a new procedure
   */
  async createNewProcedure(
    procedureData: Omit<ProcedureType, "_id">,
    token: string
  ): Promise<ApiResponse<ProcedureType>> {
    const response = await axios.post<ApiResponse<ProcedureType>>(
      PROCEDURE_ENDPOINT,
      procedureData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all procedures
   */
  async getAllProcedures(token: string): Promise<ApiResponse<ProcedureType[]>> {
    const response = await axios.get<ApiResponse<ProcedureType[]>>(
      PROCEDURE_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all procedures of an organization
   */
  async getAllProceduresOfOrg(
    orgId: string,
    token: string,
  ): Promise<ProcedureResponse> {
    const response = await axios.get<Promise<ProcedureResponse>>(
      `${PROCEDURE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all procedures of a workspace within an organization
   */
  async getAllProceduresOfAWorkspace(
    orgId: string,
    workspaceId: string,
    token: string
  ): Promise<ApiResponse<ProcedureType[]>> {
    const response = await axios.get<ApiResponse<ProcedureType[]>>(
      `${PROCEDURE_ENDPOINT}/organization/${orgId}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Find procedure by ID
   */
  async findProcedureById(id: string, token: string): Promise<ProcedureType> {
    const response = await axios.get<ProcedureType>(
      `${PROCEDURE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Edit a procedure
   */
  async editProcedure(procedure: ProcedureType, token: string): Promise<ApiResponse<ProcedureType>> {
    const response = await axios.patch<ApiResponse<ProcedureType>>(
      `${PROCEDURE_ENDPOINT}/${procedure._id}`,
      procedure,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a procedure
   */
  async deleteProcedure(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${PROCEDURE_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all procedures of an organization
   */
  async deleteProceduresOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${PROCEDURE_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const procedureService = new ProcedureService();