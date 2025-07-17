import { getContext, setContext } from 'svelte';
import { AuthStore } from './auth-store.svelte';
import type { Auth0Config } from './types';

const AUTH_CONTEXT_KEY = Symbol('auth');

export function setAuthContext(config: Auth0Config): AuthStore {
  const authStore = new AuthStore(config);
  setContext(AUTH_CONTEXT_KEY, authStore);
  return authStore;
}

export function getAuthContext(): AuthStore {
  const context = getContext<AuthStore>(AUTH_CONTEXT_KEY);
  if (!context) {
    throw new Error('Auth context not found. Make sure to use AuthProvider component.');
  }
  return context;
}