import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { waitFor } from '@testing-library/svelte';
import { get } from 'svelte/store';
import { useUserWithOrg, useCreateNewUser } from '../queries/user-query'; // Adjust path to your hook file
import { renderHook } from './test-utils'; // Adjust path to your utils
import { userService } from '../Services/user-service'; // Import to mock its type
import type { UserType } from '@/Types';

vi.mock('../Services/user-service', () => ({
	userService: {
		getUserWithOrg: vi.fn(),
		createNewUser: vi.fn()
	}
}));

describe('User Hooks', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('useUserWithOrg', () => {
		it('should fetch user data successfully when an email is provided', async () => {
			const mockUser = { _id: 'user-123', name: 'John Doe', org: 'Acme Corp' };
			(userService.getUserWithOrg as Mock).mockResolvedValue(mockUser);

			const { result } = renderHook(() => useUserWithOrg('john@example.com', 'token-abc'));

			await waitFor(() => {
				expect(get(result.current).isSuccess).toBe(true);
			});

			expect(get(result.current).data).toEqual(mockUser);
			expect(get(result.current).isLoading).toBe(false);
			expect(userService.getUserWithOrg).toHaveBeenCalledWith('john@example.com', 'token-abc');
			expect(userService.getUserWithOrg).toHaveBeenCalledTimes(1);
		});

		it('should be disabled and not fetch data if email is undefined', () => {
			const { result } = renderHook(() => useUserWithOrg(undefined, 'token-abc'));

			expect(get(result.current).isPending).toBe(true);
			expect(get(result.current).isFetching).toBe(false);
			expect(get(result.current).isSuccess).toBe(false);
			expect(userService.getUserWithOrg).not.toHaveBeenCalled();
		});

		it('should handle a fetch error correctly', async () => {
			const error = new Error('Network Error: 500 Internal Server Error');
			(userService.getUserWithOrg as Mock).mockRejectedValue(error);

			const { result } = renderHook(() => useUserWithOrg('error@example.com', 'token-abc'));

			await waitFor(() => {
				expect(get(result.current).isError).toBe(true);
			});

			expect(get(result.current).error).toEqual(error);
			expect(get(result.current).isSuccess).toBe(false);
			expect(get(result.current).isLoading).toBe(false);
			expect(userService.getUserWithOrg).toHaveBeenCalledWith('error@example.com', 'token-abc');
		});
	});

	describe('useCreateNewUser', () => {
		it('should create a new user successfully', async () => {
			const newUser: Omit<UserType, '_id'> = {
				firstName: 'Jane',
				lastName: 'Doe',
				emailId: 'jane@example.com',
				orgId: 'org-456',
				system_role: 'Admin',
				createdAt: new Date(),
				createdBy: 'test-runner'
			};
			const createdUser = { _id: 'new-user-456', ...newUser };
			(userService.createNewUser as Mock).mockResolvedValue(createdUser);

			const { result } = renderHook(() => useCreateNewUser());
			const mutation = get(result.current);

			expect(mutation.isIdle).toBe(true);

			await mutation.mutateAsync({ userData: newUser, token: 'token-xyz' });

			expect(mutation.isSuccess).toBe(true);
			expect(mutation.data).toEqual(createdUser);
			expect(mutation.isError).toBe(false);
			expect(userService.createNewUser).toHaveBeenCalledWith(newUser, 'token-xyz');
			expect(userService.createNewUser).toHaveBeenCalledTimes(1);
		});

		it('should handle an error during user creation', async () => {
			const newUser: Omit<UserType, '_id'> = {
				firstName: 'Jane',
				lastName: 'Doe',
				emailId: 'jane@example.com',
				orgId: 'org-456',
				system_role: 'Admin',
				createdAt: new Date(),
				createdBy: 'test-runner'
			};
			const error = new Error('Email already exists');
			(userService.createNewUser as Mock).mockRejectedValue(error);

			const { result } = renderHook(() => useCreateNewUser());
			const mutation = get(result.current);

			await expect(mutation.mutateAsync({ userData: newUser, token: 'token-xyz' })).rejects.toThrow(
				'Email already exists'
			);

			expect(mutation.isError).toBe(true);
			expect(mutation.error).toEqual(error);
			expect(mutation.isSuccess).toBe(false);
			expect(userService.createNewUser).toHaveBeenCalledWith(newUser, 'token-xyz');
		});
	});
});
