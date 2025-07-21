import axios from 'axios';
import type { UserType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';


// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const USER_ENDPOINT = `${API_BASE_URL}/user`;

interface ResponseUsers {

  users : UserType[]
  count : number
}

export class UserService {
  /**
   * Create a new user
   */
  async createNewUser(
    userData: Omit<UserType, "_id">, 
    token: string
  ): Promise<string> {
    const response = await axios.post<string>(
      USER_ENDPOINT,
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Find all users
   */
  async findAllUsers(token: string): Promise<ResponseUsers> {
    const response = await axios.get<ApiResponse<ResponseUsers>>(
      USER_ENDPOINT,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  /**
   * Find users of an organization
   */
  async findUserOfAnOrg(
    orgId: string, 
    token: string
  ): Promise<ResponseUsers>{
    const response = await axios.get<ApiResponse<ResponseUsers>>(
      `${USER_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }

  async findUser(
    _id: string, 
    token: string
  ): Promise<UserType | null>{
    const response = await axios.get<{user:UserType}>(
      `${USER_ENDPOINT}/findUser/${_id}`,
      {
        params:{_id},
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.user;
  }

  /**
   * Edit a user
   */
  async editUser(user: UserType, token: string): Promise<ApiResponse<UserType>> {
    const response = await axios.patch<ApiResponse<UserType>>(
      `${USER_ENDPOINT}/${user._id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete a user
   */
  async deleteUser(id: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_ENDPOINT}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
  /**
   * Delete a orgnization ,related users ,roles ,workspaces ,mapppings  
   */
  async removeOrganization(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_ENDPOINT}/removeOrganization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Delete all users of an organization
   */
  async deleteUsersOfAnOrg(orgId: string, token: string): Promise<ApiResponse<void>> {
    const response = await axios.delete<ApiResponse<void>>(
      `${USER_ENDPOINT}/organization/${orgId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }

  /**
   * Get user with organization details by email
   */
  async getUserWithOrg(emailId: string, token: string): Promise<UserType> {
    
    const response = await axios.get<ApiResponse<UserType>>(
      `${USER_ENDPOINT}/email/${emailId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  }
}
 

export const userService = new UserService();