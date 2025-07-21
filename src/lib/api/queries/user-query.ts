import { createQuery } from '@tanstack/svelte-query';
import { userService } from '../Services/user-service';

export const useUserWithOrg = (email: string | undefined, token: string | undefined) => {
	return createQuery({
		queryKey: ['user', email],
		queryFn: async () => {
			return await userService.getUserWithOrg(email!, token!);
		},
		enabled: !!email,
		staleTime: 1000 * 60 * 5 // 5 minutes
	});
};
	