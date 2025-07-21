import axios from 'axios';
import type { UserType, OrganizationType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ONBOARDING_ENDPOINT = `${API_BASE_URL}/onboarding`;

export class OnboardingService {
  /**
   * Register new organization and user
   */
  async registerOrganizationAndUser(
    user: Omit<UserType, "_id">,
    organization: Omit<OrganizationType, "_id">
  ): Promise<ApiResponse<{ user: UserType; organization: OrganizationType }>> {
    const response = await axios.post<ApiResponse<{ user: UserType; organization: OrganizationType }>>(
      ONBOARDING_ENDPOINT,
      {
        user,
        organization,
      }
    );
    return response.data;
  }
}

export const onboardingService = new OnboardingService();