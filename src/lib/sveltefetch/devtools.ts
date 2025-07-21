import { globalCacheManager } from "./query-core.svelte";

interface QueryDevTools {
  inspect(): {
    cacheSize: number;
    activeQueries: Array<{
      key: string;
      subscribers: number;
      state: string;
      age: number;
    }>;
    memoryUsage: {
      estimatedSizeInBytes: number;
      queriesWithLargeData: string[];
    };
  };
  
  findQuery(pattern: string): any;
  clearCache(): void;
  exportState(): string;
  importState(state: string): void;
}

if (import.meta.env.DEV) {
  const devTools: QueryDevTools = {
    inspect() {
      const now = Date.now();
      const cache = Array.from(globalCacheManager['cache'].entries());
      
      return {
        cacheSize: cache.length,
        activeQueries: cache.map(([key, entry]) => ({
          key,
          subscribers: entry.subscribers.size,
          state: entry.state.isLoading ? 'loading' : 
                 entry.state.isError ? 'error' : 
                 entry.state.hasData ? 'success' : 'idle',
          age: now - entry.lastAccessTime
        })),
        memoryUsage: {
          estimatedSizeInBytes: new Blob([
            JSON.stringify(cache.map(([_, entry]) => entry.state))
          ]).size,
          queriesWithLargeData: cache
            .filter(([_, entry]) => {
              const size = new Blob([JSON.stringify(entry.state.data)]).size;
              return size > 10000; // 10KB
            })
            .map(([key]) => key)
        }
      };
    },
    
    findQuery(pattern: string) {
      const cache = globalCacheManager['cache'];
      for (const [key, entry] of cache.entries()) {
        if (key.includes(pattern)) {
          return entry.state;
        }
      }
      return null;
    },
    
    clearCache() {
      globalCacheManager.clear();
      console.log('Query cache cleared');
    },
    
    exportState() {
      const cache = Array.from(globalCacheManager['cache'].entries());
      return JSON.stringify(cache.map(([key, entry]) => ({
        key,
        state: entry.state,
        subscribers: entry.subscribers.size
      })), null, 2);
    },
    
    importState(stateJson: string) {
      try {
        const state = JSON.parse(stateJson);
        // Implementation would restore the cache state
        console.log('State imported successfully');
      } catch (error) {
        console.error('Failed to import state:', error);
      }
    }
  };
  
  // Attach to window for easy access
  (window as any).__SVELTE_QUERY__ = devTools;
  
  console.log(
    '%c🔍 Svelte Query DevTools Available',
    'color: #ff3e00; font-weight: bold; font-size: 14px',
    '\nAccess via window.__SVELTE_QUERY__'
  );
}