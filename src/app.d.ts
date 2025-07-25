// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import 'fabric';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

// Type declarations for svelte-filepond
declare module 'svelte-filepond' {
	import type { SvelteComponent } from 'svelte';
	
	export interface FilePondProps {
		files?: File[];
		allowMultiple?: boolean;
		acceptedFileTypes?: string[];
		server?: {
			process?: {
				url: string;
				method?: string;
				onload?: (response: any) => void;
			};
		};
	}
	
	export class FilePond extends SvelteComponent<FilePondProps> {}
	
	export function registerPlugin(...plugins: any[]): void;
	
}
declare module 'fabric' {
	namespace fabric {
		// This adds the custom 'guides' property to every FabricObject
		interface FabricObject {
			guides?: { [key: string]: Line };
		}
	}
}


export {};