import { invalidateQueries } from "./query-core.svelte";

export function createMutation<TData = unknown, TError = unknown, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<QueryResult<TData, TError>>,
  options?: {
    onMutate?: (variables: TVariables) => Promise<any> | any;
    onSuccess?: (data: TData, variables: TVariables, context: any) => void;
    onError?: (error: TError, variables: TVariables, context: any) => void;
    onSettled?: (data?: TData, error?: TError, variables?: TVariables) => void;
    invalidates?: string[][];
  }
) {
  const state = $state<{
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: TData | undefined;
    error: TError | undefined;
    variables: TVariables | undefined;
  }>({
    isLoading: false,
    isSuccess: false,
    isError: false,
    data: undefined,
    error: undefined,
    variables: undefined
  });
  
  const mutate = async (variables: TVariables) => {
    state.isLoading = true;
    state.isError = false;
    state.isSuccess = false;
    state.variables = variables;
    
    let context: any;
    
    try {
      // Call onMutate for optimistic updates
      if (options?.onMutate) {
        context = await options.onMutate(variables);
      }
      
      const result = await mutationFn(variables);
      
      if (result.success) {
        state.data = result.data;
        state.isSuccess = true;
        
        // Invalidate related queries
        options?.invalidates?.forEach(keys => {
          invalidateQueries(keys, { refetch: true });
        });
        
        await options?.onSuccess?.(result.data, variables, context);
      } else {
        throw result.error;
      }
    } catch (error) {
      state.error = error as TError;
      state.isError = true;
      await options?.onError?.(error as TError, variables, context);
      throw error;
    } finally {
      state.isLoading = false;
      await options?.onSettled?.(state.data, state.error, variables);
    }
    
    return state.data;
  };
  
  const reset = () => {
    state.isLoading = false;
    state.isSuccess = false;
    state.isError = false;
    state.data = undefined;
    state.error = undefined;
    state.variables = undefined;
  };
  
  return {
    ...state,
    mutate,
    mutateAsync: mutate, // Alias for consistency
    reset
  };
}