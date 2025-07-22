import { render } from '@testing-library/svelte';
import { QueryClient } from '@tanstack/svelte-query';
import TestHookRunner from './test-component.svelte'; // Import the component

export function createTestQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false
			},
			mutations: {
				retry: false
			}
		}
	});
}

export function renderHook<T>(hookCallback: () => T) {
	const queryClient = createTestQueryClient();

	const { component } = render(TestHookRunner, {
		client: queryClient,
		hookCallback: hookCallback
	});

	return {
		result: component.result as { current: T },
		queryClient
	};
}
