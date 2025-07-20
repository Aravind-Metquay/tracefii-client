import type { Component, Snippet } from 'svelte';

export type ComponentRenderer<TValue = any> = {
  component: Component<{ value: TValue } & Record<string, any>>;
  props?: Record<string, any>;
};

export type ColumnConfig<TData extends Record<string, any>> = {
    id: keyof TData | ((row: TData) => any);
    header: string | { snippet: Snippet<[string]>; value: string };
    cellRenderer?: Snippet<[any]> | ComponentRenderer;
};


export type HeaderConfig = 
  | string 
  | { 
      snippet: Snippet<[string]>; 
      value: string;
    };
