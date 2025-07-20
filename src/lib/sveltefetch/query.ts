class QueryExecutor<TData, TError> {
  private requestVersion = 0;
  private retryCount = 0;
  private retryTimer?: number;
  
  constructor(
    private key: string,
    private queryFn: () => Promise<QueryResult<TData, TError>>,
    private options: QueryOptions<TData, TError>,
    private cacheEntry: CacheEntry<TData, TError>,
    private updateState: (updater: (state: QueryState<TData, TError>) => void) => void
  ) {}
  
  async execute(): Promise<void> {
    this.requestVersion++;
    const currentVersion = this.requestVersion;
    
    this.cacheEntry.abortController?.abort();
    this.cacheEntry.abortController = new AbortController();
    
    this.updateState(state => {
      state.isLoading = true;
      state.isInitialLoading = !state.hasData;
      state.isRefetching = state.hasData;
      state.fetchCount++;
    });
    
    try {
      const result = await this.executeWithAbort();
      
      if (currentVersion !== this.requestVersion) {
        return; // A newer request has started, discard this result
      }
      
      if (result.success) {
        this.handleSuccess(result.data);
      } else {
        await this.handleError(result.error);
      }
    } catch (error) {
      if (currentVersion === this.requestVersion) {
        await this.handleError(error as TError);
      }
    }
  }
  
  private async executeWithAbort(): Promise<QueryResult<TData, TError>> {
    if (this.queryFn.length > 0) {
      return (this.queryFn as any)(this.cacheEntry.abortController!.signal);
    }
    
    return new Promise((resolve, reject) => {
      const signal = this.cacheEntry.abortController!.signal;
      
      if (signal.aborted) {
        reject(new Error('Query aborted'));
        return;
      }
      
      signal.addEventListener('abort', () => {
        reject(new Error('Query aborted'));
      });
      
      this.queryFn().then(resolve, reject);
    });
  }
  
  private handleSuccess(data: TData) {
    this.retryCount = 0; // Reset retry count on success
    
    if (this.options.validator && import.meta.env.DEV) {
      if (!this.options.validator(data)) {
        console.error(`Query "${this.key}" returned invalid data:`, data);
      }
    }
    
    this.updateState(state => {
      state.data = data;
      state.error = undefined;
      state.dataUpdatedAt = Date.now();
      state.isLoading = false;
      state.isInitialLoading = false;
      state.isRefetching = false;
      state.isSuccess = true;
      state.isError = false;
      state.hasData = true;
      state.isStale = false;
      state.staleTime = Date.now() + (this.options.staleTime ?? 0);
      state.retryCount = 0;
    });
    
    this.options.onSuccess?.(data);
    this.options.onSettled?.(data, undefined);
  }
  
  private async handleError(error: TError) {
    const shouldRetry = this.shouldRetry(error);
    
    this.updateState(state => {
      state.error = error;
      state.errorUpdatedAt = Date.now();
      state.isError = true;
      
      if (!shouldRetry) {
        state.isLoading = false;
        state.isInitialLoading = false;
        state.isRefetching = false;
      }
      
      state.retryCount = this.retryCount;
    });
    
    if (shouldRetry) {
      this.retryCount++;
      const delay = this.getRetryDelay();
      
      this.retryTimer = window.setTimeout(() => {
        this.execute();
      }, delay);
    } else {
      this.options.onError?.(error);
      this.options.onSettled?.(undefined, error);
    }
  }
  
  private shouldRetry(error: TError): boolean {
    const { retry } = this.options;
    
    if (retry === false) return false;
    if (retry === true) return this.retryCount < 3;
    if (typeof retry === 'number') return this.retryCount < retry;
    if (typeof retry === 'function') return retry(this.retryCount, error);
    
    return this.retryCount < 3;
  }
  
  private getRetryDelay(): number {
    if (this.options.retryDelay) {
      return this.options.retryDelay(this.retryCount);
    }
    
    const baseDelay = Math.min(1000 * Math.pow(2, this.retryCount), 30000);
    const jitter = Math.random() * 0.2 * baseDelay; // 20% jitter
    return baseDelay + jitter;
  }
  
  cancel() {
    this.cacheEntry.abortController?.abort();
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
      this.retryTimer = undefined;
    }
  }
}