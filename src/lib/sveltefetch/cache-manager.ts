interface CacheEntry<TData, TError> {
	state: QueryState<TData, TError>;
	subscribers: Set<string>;
	lastAccessTime: number;
	queryHash: string;
	abortController?: AbortController;
	gcTimer?: number;
}

class CacheManager {
	private cache = new Map<string, CacheEntry<any, any>>();
	private subscriberCount = new Map<string, number>();

	private readonly maxCacheSize: number = 100;
	private readonly defaultCacheTime: number = 5 * 60 * 1000;

	constructor(
		private config?: {
			maxCacheSize?: number;
			defaultCacheTime?: number;
		}
	) {
		if (config?.maxCacheSize) this.maxCacheSize = config.maxCacheSize;
		if (config?.defaultCacheTime) this.defaultCacheTime = config.defaultCacheTime;
	}

	getOrCreate<TData, TError>(
		key: string,
		initialState: QueryState<TData, TError>
	): CacheEntry<TData, TError> {
		const existing = this.cache.get(key);
		if (existing) {
			existing.lastAccessTime = Date.now();
			return existing;
		}

		const entry: CacheEntry<TData, TError> = {
			state: initialState,
			subscribers: new Set(),
			lastAccessTime: Date.now(),
			queryHash: key
		};

		this.cache.set(key, entry);
		this.enforceMaxSize();

		return entry;
	}

	subscribe(key: string, subscriberId: string): () => void {
		const entry = this.cache.get(key);
		if (!entry) return () => {};

		entry.subscribers.add(subscriberId);

		if (entry.gcTimer) {
			clearTimeout(entry.gcTimer);
			entry.gcTimer = undefined;
		}

		return () => {
			entry.subscribers.delete(subscriberId);

			if (entry.subscribers.size === 0) {
				entry.gcTimer = window.setTimeout(() => {
					this.cache.delete(key);
				}, this.defaultCacheTime);
			}
		};
	}

	private enforceMaxSize() {
		if (this.cache.size <= this.maxCacheSize) return;

		const evictionCandidates = Array.from(this.cache.entries())
			.filter(([_, entry]) => entry.subscribers.size === 0)
			.sort((a, b) => a[1].lastAccessTime - b[1].lastAccessTime);

		const toEvict = this.cache.size - this.maxCacheSize;
		for (let i = 0; i < toEvict && i < evictionCandidates.length; i++) {
			const [key, entry] = evictionCandidates[i];

			entry.abortController?.abort();

			if (entry.gcTimer) clearTimeout(entry.gcTimer);

			this.cache.delete(key);
		}
	}

	invalidate(
		pattern: string[],
		options?: {
			exact?: boolean;
			refetch?: boolean;
		}
	) {
		const patternKey = pattern.join('__');
		const toInvalidate: string[] = [];

		this.cache.forEach((entry, key) => {
			const matches = options?.exact ? key === patternKey : key.startsWith(patternKey);

			if (matches) {
				entry.state.isStale = true;
				entry.state.staleTime = Date.now() - 1;

				if (options?.refetch && entry.subscribers.size > 0) {
					toInvalidate.push(key);
				}
			}
		});

		return toInvalidate;
	}

	clear() {
		this.cache.forEach((entry) => {
			entry.abortController?.abort();
			if (entry.gcTimer) clearTimeout(entry.gcTimer);
		});
		this.cache.clear();
	}
}
