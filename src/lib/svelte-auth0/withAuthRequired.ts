import type { Component } from 'svelte';
import AuthGuard from './auth-guard.svelte';

interface AuthConfig {
  loginPath?: string;
  returnTo?: boolean;
  loadingComponent?: Component;
}

export function withAuthRequired<T extends Record<string, any>>(
  Component: Component<T>,
  config: AuthConfig = {}
) {
  return (props: T) => {
    return {
      component: AuthGuard,
      props: {
        ...config,
        children: () => ({
          component: Component,
          props
        })
      }
    };
  };
}