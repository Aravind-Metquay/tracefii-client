import axios from 'axios';
import type { UserType, ApiResponse, Pagination, OrganizationType } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const USER_ENDPOINT = `${API_BASE_URL}/user`;

interface ResponseUsers {
	users: UserType[];
	pagination: Pagination;
}
interface ResponseOfUsersWithOrg extends UserType {
	organization: OrganizationType;
}
export interface DeleteUserResponse {
	id: string;
	message: string;
	success: boolean;
	error: string | any;
	deletedCount: number;
}

export class UserService {
	/**
	 * Create a new user
	 */
	async createNewUser(userData: Omit<UserType, '_id'>, token: string): Promise<string> {
		const response = await axios.post<string>(USER_ENDPOINT, userData, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}

	/**
	 * Find all users
	 */
	async findAllUsers(token: string, filter: {}, searchQuery?: string): Promise<ResponseUsers> {
		const response = await axios.get<ResponseUsers>(USER_ENDPOINT, {
			params: {
				filter: JSON.stringify(filter),
				searchQuery: searchQuery
			},
			headers: {
				Authorization: `Bearer ${token}`
			}
		});

		return response.data || [];
	}

	/**
	 * Find users of an organization
	 */
	async findUsersOfAnOrg(
		orgId: string,
		token: string,
		filter?: {},
		searchQuery?: string
	): Promise<ResponseUsers> {
		const response = await axios.get<ResponseUsers>(`${USER_ENDPOINT}/organization/${orgId}`, {
			params: {
				filter: JSON.stringify(filter),
				searchQuery: searchQuery
			},
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}

	async findUser(userId: string, token: string): Promise<UserType | null> {
		const response = await axios.get<UserType>(`${USER_ENDPOINT}/findUser/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}

	/**
	 * Edit a user
	 */
	async editUser(user: UserType, token: string): Promise<ApiResponse<UserType>> {
		const userId = user._id;
		const response = await axios.patch<ApiResponse<UserType>>(`${USER_ENDPOINT}/${userId}`, user, {
			params: {
				userId: userId
			},
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		console.log(response, 'UPDATERE');
		return response.data;
	}

	/**
	 * Delete a user
	 */
	async deleteUser(id: string, token: string): Promise<DeleteUserResponse> {
		const response = await axios.delete<DeleteUserResponse>(`${USER_ENDPOINT}/${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}

	/**
	 * Delete all users of an organization
	 */
	async deleteUsersOfAnOrg(orgId: string, token: string): Promise<DeleteUserResponse> {
		const response = await axios.delete<DeleteUserResponse>(
			`${USER_ENDPOINT}/organization/${orgId}`,
			{
				headers: {
					Authorization: `Bearer ${token}`
				}
			}
		);
		return response.data;
	}

	/**
	 * Get user with organization details by email
	 */
	async getUserWithOrg(emailId: string, token: string): Promise<ResponseOfUsersWithOrg> {
		const response = await axios.get<ResponseOfUsersWithOrg>(`${USER_ENDPOINT}/email/${emailId}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response.data;
	}
}

export const userService = new UserService();
