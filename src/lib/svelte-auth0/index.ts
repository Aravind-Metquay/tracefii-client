// Re-exports the Svelte component for route protection
export { default as AuthGuard } from './auth-guard.svelte';

// Re-exports all functions (login, logout, etc.) and state (user, isAuthenticated, etc.)
export * from './auth.svelte.ts';

// Re-exports all TypeScript types
export type * from './types';