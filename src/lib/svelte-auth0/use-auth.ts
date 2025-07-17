import { getAuthContext } from './auth-context.svelte.ts';
import type { AuthContextValue } from './types.ts';

export function useAuth(): AuthContextValue {
	let authStore = getAuthContext();

	return {
		get user() {
			return authStore.user;
		},
		get isAuthenticated() {
			return authStore.isAuthenticated;
		},
		get isLoading() {
			return authStore.isLoading;
		},
		get error() {
			return authStore.error;
		},
		login: authStore.login.bind(authStore),
		signup: authStore.signup.bind(authStore),
		logout: authStore.logout.bind(authStore),
		checkSession: authStore.checkSession.bind(authStore),
		getAccessToken: authStore.getAccessToken.bind(authStore)
	};
}
