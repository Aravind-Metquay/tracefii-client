import { defineConfig, type ViteUserConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';


export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss()	
	] as ViteUserConfig["plugins"],
	resolve: {
		alias: {
		'@': resolve('./src')
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
