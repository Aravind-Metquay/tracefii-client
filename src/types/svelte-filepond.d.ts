declare module 'svelte-filepond' {
	import type { SvelteComponent } from 'svelte';

	export interface FilePondServerConfig {
		process?: {
			url: string;
			method?: string;
			onload?: (response: any) => void;
			onerror?: (error: any) => void;
		};
	}

	export interface FilePondProps {
		files?: File[];
		allowMultiple?: boolean;
		acceptedFileTypes?: string[];
		server?: FilePondServerConfig;
		[key: string]: any;
	}

	export class FilePond extends SvelteComponent<FilePondProps> {}

	export function registerPlugin(...plugins: any[]): void;
}
