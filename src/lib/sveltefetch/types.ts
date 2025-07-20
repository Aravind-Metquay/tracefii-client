type QuerySuccess<TData> = {
	success: true;
	data: TData;
};

type QueryFailure<TError> = {
	success: false;
	error: TError;
	isRetrying?: boolean;
	attemptNumber?: number;
};

type QueryResult<TData, TError> = QuerySuccess<TData> | QueryFailure<TError>;

interface QueryState<TData, TError> {
	data: TData | undefined;
	error: TError | undefined;

	isLoading: boolean;
	isInitialLoading: boolean;
	isRefetching: boolean;
	isReloading: boolean;

	dataUpdatedAt: number | undefined;
	errorUpdatedAt: number | undefined;
	staleTime: number | undefined;
	isStale: boolean;

	isSuccess: boolean;
	isError: boolean;
	hasData: boolean;

	fetchCount: number;
	retryCount: number;
}

interface QueryOptions<TData, TError> {
	staleTime?: number;
	cacheTime?: number;

	initialData?: TData | (() => TData);

	retry?: boolean | number | ((failureCount: number, error: TError) => false);
	retryDelay?: (attemptMax: number) => number;

	onSuccess?: (data: TData) => void;
	onError?: (data: TError) => void;
	onSettled?: (data?: TData, error?: TError) => void;

	keepPreviousData?: boolean;
	suspense?: boolean;

	validator?: (data: unknown) => data is TData;
}
