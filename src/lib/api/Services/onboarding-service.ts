import axios from 'axios';
import type { UserType, OrganizationType, ApiResponse } from '@/Types';
import { env } from '$env/dynamic/public';

// Constants
const API_BASE_URL = env.PUBLIC_BACKEND_API_URL;
const ONBOARDING_ENDPOINT = `${API_BASE_URL}/onboarding`;

interface OnboardingResponse {
  mapping: {
    mappingId: string,
    orgId: string,
    userId: string,
    workspaceId: string,
  },
  success: boolean;
  message?: string;
  error?: string;
}
export class OnboardingService {
  /**
   * Register new organization and user
   */
  async registerOrganizationAndUser(
    user: Omit<UserType, "_id">,
    organization: Omit<OrganizationType, "_id">,
    token: string
  ): Promise<OnboardingResponse> {
    const response = await axios.post<OnboardingResponse>(
      ONBOARDING_ENDPOINT,
      {
        user,
        organization,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  }
}

export const onboardingService = new OnboardingService();