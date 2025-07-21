import axios from 'axios';
import type { WorksheetType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const WORKSHEET_ENDPOINT = `${API_BASE_URL}/worksheet`;


interface WorksheetResponse {
  worksheets: WorksheetType[];
  customerAssetWorksheetCount: number;
  referenceAssetWorksheetCount: number;
  totalCount : number
}

export class WorksheetService {
  /**
   * Create a new worksheet
   */
  async createNewWorksheet(
    worksheetData: Omit<WorksheetType, "_id">, 
    token: string
  ): Promise<ApiResponse<WorksheetType>> {
    const response = await axios.post<ApiResponse<WorksheetType>>(
      WORKSHEET_ENDPOINT,
      worksheetData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all worksheets
   */
  async getAllWorksheets(token: string): Promise<ApiResponse<WorksheetType[]>> {
    const response = await axios.get<ApiResponse<WorksheetType[]>>(
      WORKSHEET_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all worksheets of an organization
   */
  async getAllWorksheetsOfOrg(
    orgId: string, 
    token: string,
    type? : "Reference Worksheet" | "Customer Worksheet" | "All"
  ): Promise<WorksheetResponse> {
    const response = await axios.get<Promise<WorksheetResponse>>(
      `${WORKSHEET_ENDPOINT}/organization/${orgId}/${type ? type : "All"}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get all worksheets of a workspace within an organization
   */
  async getAllWorksheetsOfAWorkspace(
    orgId: string,
    workspaceId: string,
    token: string
  ): Promise<ApiResponse<WorksheetType[]>> {
    const response = await axios.get<ApiResponse<WorksheetType[]>>(
      `${WORKSHEET_ENDPOINT}/organization/${orgId}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Find worksheet by ID
   */
  async findWorksheetById(id: string, token: string): Promise<WorksheetType> {
    const response = await axios.get<WorksheetType>(
      `${WORKSHEET_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Edit a worksheet
   */
  async editWorksheet(worksheet: WorksheetType, token: string): Promise<ApiResponse<WorksheetType>> {
    const response = await axios.patch<ApiResponse<WorksheetType>>(
      `${WORKSHEET_ENDPOINT}/${worksheet._id}`,
      worksheet,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a worksheet
   */
  async deleteWorksheet(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORKSHEET_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all worksheets of an organization
   */
  async deleteWorksheetsOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${WORKSHEET_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const worksheetService = new WorksheetService();