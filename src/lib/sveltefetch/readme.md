// Define your queries
const userQuery = createQuery(
  (params: { id: string }) => ['user', params.id],
  async ({ id }) => {
    const response = await fetch(`/api/users/${id}`);
    if (!response.ok) {
      return { success: false, error: `Failed to fetch user ${id}` };
    }
    return { success: true, data: await response.json() };
  },
  {
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
    retryDelay: attempt => Math.min(1000 * 2 ** attempt, 30000)
  }
);

// Use in a component
const user = userQuery({ id: userId });

// The component now has access to:
// - user.data (the user object)
// - user.isLoading, user.isInitialLoading, user.isRefetching
// - user.error
// - user.refetch() to manually refresh
// - user.cancel() to cancel in-flight requests

// Mutations with optimistic updates
const updateUserMutation = createMutation(
  async (userData: { id: string; name: string }) => {
    const response = await fetch(`/api/users/${userData.id}`, {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      return { success: false, error: 'Update failed' };
    }
    
    return { success: true, data: await response.json() };
  },
  {
    // Optimistic update
    onMutate: async (userData) => {
      // Cancel any in-flight queries
      await queryClient.cancelQueries(['user', userData.id]);
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', userData.id]);
      
      // Optimistically update
      queryClient.setQueryData(['user', userData.id], userData);
      
      return { previousUser };
    },
    
    // Rollback on error
    onError: (err, userData, context) => {
      if (context?.previousUser) {
        queryClient.setQueryData(['user', userData.id], context.previousUser);
      }
    },
    
    // Invalidate and refetch
    invalidates: [['user']]
  }
);