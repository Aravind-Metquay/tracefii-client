export const globalCacheManager = new CacheManager();

let componentIdCounter = 0;
const getComponentId = () => `component_${++componentIdCounter}`;

export function createQuery<TData = unknown, TError = unknown, TParam = void>(
  keyFn: TParam extends void 
    ? string[] | (() => string[])
    : string[] | ((param: TParam) => string[]),
  queryFn: TParam extends void
    ? () => Promise<QueryResult<TData, TError>>
    : (param: TParam) => Promise<QueryResult<TData, TError>>,
  options: QueryOptions<TData, TError> = {}
) {
  return (param?: TParam) => {
    const key = typeof keyFn === 'function' 
      ? (keyFn as any)(param) 
      : keyFn;
    const cacheKey = key.join('__');
    
    const initialState: QueryState<TData, TError> = {
      data: typeof options.initialData === 'function' 
        ? options.initialData() 
        : options.initialData,
      error: undefined,
      isLoading: false,
      isInitialLoading: false,
      isRefetching: false,
      isReloading: false,
      dataUpdatedAt: undefined,
      errorUpdatedAt: undefined,
      staleTime: undefined,
      isStale: true,
      isSuccess: false,
      isError: false,
      hasData: !!options.initialData,
      fetchCount: 0,
      retryCount: 0,
    };
    
    const cacheEntry = globalCacheManager.getOrCreate(cacheKey, initialState);
    
    const queryState = $state<QueryState<TData, TError>>({
      ...cacheEntry.state
    });
    
    const updateState = (updater: (state: QueryState<TData, TError>) => void) => {
      updater(cacheEntry.state);
      Object.assign(queryState, cacheEntry.state);
    };
    
    const executor = new QueryExecutor(
      cacheKey,
      () => (queryFn as any)(param),
      options,
      cacheEntry,
      updateState
    );
    
    $effect(() => {
      const componentId = getComponentId();
      const unsubscribe = globalCacheManager.subscribe(cacheKey, componentId);
      
      const shouldFetch = 
        !cacheEntry.state.hasData ||
        cacheEntry.state.isStale ||
        (cacheEntry.state.staleTime && cacheEntry.state.staleTime < Date.now());
      
      if (shouldFetch && !cacheEntry.state.isLoading) {
        executor.execute();
      }
      
      const syncInterval = setInterval(() => {
        if (JSON.stringify(queryState) !== JSON.stringify(cacheEntry.state)) {
          Object.assign(queryState, cacheEntry.state);
        }
      }, 100);
      
      return () => {
        unsubscribe();
        clearInterval(syncInterval);
        executor.cancel();
      };
    });
    
    return {
      ...queryState,
      
      refetch: () => {
        updateState(state => {
          state.isStale = true;
          state.isReloading = true;
        });
        return executor.execute();
      },
      
      cancel: () => {
        executor.cancel();
      },
      
      get query() {
        return queryState;
      }
    };
  };
}

export function invalidateQueries(
  pattern: string[],
  options?: { exact?: boolean; refetch?: boolean }
) {
  const keysToRefetch = globalCacheManager.invalidate(pattern, options);
  
  if (options?.refetch) {
    // For brevity, I'm omitting this implementation
  }
}

export async function prefetchQuery<TData = unknown, TError = unknown, TParam = void>(
  keyFn: TParam extends void 
    ? string[] | (() => string[])
    : string[] | ((param: TParam) => string[]),
  queryFn: TParam extends void
    ? () => Promise<QueryResult<TData, TError>>
    : (param: TParam) => Promise<QueryResult<TData, TError>>,
  param?: TParam,
  options?: QueryOptions<TData, TError>
) {
  const key = typeof keyFn === 'function' 
    ? (keyFn as any)(param) 
    : keyFn;
  const cacheKey = key.join('__');
  
  const existing = globalCacheManager.getOrCreate(cacheKey, {} as any);
  if (existing.state.hasData && !existing.state.isStale) {
    return existing.state.data;
  }
  
  const result = await (queryFn as any)(param);
  if (result.success) {
    existing.state = {
      ...existing.state,
      data: result.data,
      hasData: true,
      isStale: false,
      dataUpdatedAt: Date.now(),
      staleTime: Date.now() + (options?.staleTime ?? 0)
    };
    return result.data;
  }
  
  throw result.error;
}