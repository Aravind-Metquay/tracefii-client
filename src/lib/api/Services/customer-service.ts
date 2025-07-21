import axios from 'axios';
import type { CustomerType, ApiResponse, FileWithContent } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const API_CLOUD_FLARE_URL = import.meta.env.VITE_CLOUD_FLARE_URL;
const CUSTOMER_ENDPOINT = `${API_BASE_URL}/customer`;
const CLOUD_FLARE_ENDPOINT = `${API_CLOUD_FLARE_URL}`;

interface ResponseCustomers {
  customers : CustomerType[],
  count : number,
}
interface ResponseCreateCustomers {
 acknowledged : boolean
  insertedId : string
}
export class CustomerService {
  /**
   * Create a new customer
   */
  async createNewCustomer(customerData: Omit<CustomerType, "_id">, token: string): Promise<string> {
    const response = await axios.post<ResponseCreateCustomers>(
      CUSTOMER_ENDPOINT,
      customerData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.insertedId;
  }
  async createCustomerAttachments(attachment: FileWithContent,customerId:string, key: string) {
     await axios.put<ApiResponse<FileWithContent>>(
      `${CLOUD_FLARE_ENDPOINT}/${key}-${customerId}`,
      attachment,
    );
  }

  /**
   * Get all customers
   */
  async getAllCustomers(token: string): Promise<ResponseCustomers> {
    const response = await axios.get<ApiResponse<ResponseCustomers>>(
      CUSTOMER_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  async getCustomerAttachments( key: string,customerId:string):Promise<FileWithContent>{
     const attachment = await axios.get<FileWithContent>(
      `${CLOUD_FLARE_ENDPOINT}/${key}-${customerId}`
    );
    return attachment.data;
  }
  /**
   * Get all customers of an organization
   */
  async getAllCustomersOfOrg(orgId: string, token: string): Promise<ResponseCustomers> {
    const response = await axios.get<ApiResponse<ResponseCustomers>>(
      `${CUSTOMER_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Get all customers of a workspace within an organization
   */
  async getAllCustomersOfAWorkspace(
    orgId: string,
    workspaceId: string,
    token: string
  ): Promise<ResponseCustomers> {
    const response = await axios.get<ApiResponse<ResponseCustomers>>(
      `${CUSTOMER_ENDPOINT}/organization/${orgId}/workspace/${workspaceId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Find customer by ID
   */
  async findCustomerById(id: string, token: string): Promise<CustomerType> {
    const response = await axios.get<ApiResponse<CustomerType>>(
      `${CUSTOMER_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Edit a customer
   */
  async editCustomer(customer: CustomerType, token: string): Promise<ApiResponse<CustomerType>> {
    const response = await axios.patch<ApiResponse<CustomerType>>(
      `${CUSTOMER_ENDPOINT}/${customer._id}`,
      customer,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a customer
   */
  async deleteCustomer(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${CUSTOMER_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  /**
   * Delete a customer attachment
   */
  async deleteCustomerAttachment(key: string, customerId: string) {
     await axios.delete<FileWithContent>(
      `${CLOUD_FLARE_ENDPOINT}/${key}-${customerId}`
    );
  }

  /**
   * Delete all customers of an organization
   */
  async deleteCustomersOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${CUSTOMER_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const customerService = new CustomerService();