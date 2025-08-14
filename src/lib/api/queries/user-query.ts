import { createQuery, createMutation } from '@tanstack/svelte-query';
import { userService } from '../Services/user-service';
import type { UserType } from '@/Types';

// Fetch a user's data along with their organization
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

// Create a new user
export const useCreateNewUser = () => {
  return createMutation({
    mutationFn: ({
      userData,
      token,
    }: {
      userData: Omit<UserType, "_id">;
      token: string;
    }) => userService.createNewUser(userData, token),
  });
};

// Fetch all users the current token can access
export const useGetAllUsers = (token: string, filter: string) => {
  return createQuery({
    queryKey: ['findAllUsers'],
    queryFn: async () => {
      return await userService.findAllUsers(token!, filter);
    },
    enabled: true,
    staleTime: 1000 * 60 * 5
  });
};

// Fetch all users of a specific organization
export const useGetAllUsersOfAnOrg = (orgId: string, token: string, filter: string) => {
  return createQuery({
    queryKey: [orgId, filter],
    queryFn: async () => {
      return await userService.findUsersOfAnOrg(orgId!, token!, filter);
    },
    enabled: !!orgId,
    staleTime: 1000 * 60 * 5
  });
};

// Fetch a specific user by their MongoDB ID
export const useGetUser = (_id: string | undefined, token: string | undefined) => {
  return createQuery({
    queryKey: ["id", _id],
    queryFn: async () => {
      return await userService.findUser(_id!, token!);
    },
    enabled: !!_id,
    staleTime: 1000 * 60 * 5
  });
};

// Edit/update a user's information
export const useEditUser = () => {
  return createMutation({
    mutationFn: ({
      user,
      token
    }: {
      user: UserType;
      token: string;
    }) => userService.editUser(user, token),
  });
};

// Delete a user by their ID
export const useDeleteUser = () => {
  return createMutation({
    mutationFn: ({
      id,
      token
    }: {
      id: string;
      token: string;
    }) => userService.deleteUser(id, token),
  });
};

// Delete all users of an organization
export const useDeleteUsersOfOrg = () => {
  return createMutation({
    mutationFn: ({
      orgId,
      token
    }: {
      orgId: string;
      token: string;
    }) => userService.deleteUsersOfAnOrg(orgId, token),
  });
};
