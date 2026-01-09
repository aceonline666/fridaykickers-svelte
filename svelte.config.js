import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		// Configure for GitHub Pages deployment
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: '404.html',
			precompress: false,
			strict: false
		}),
		paths: {
			// Set this to your repository name for GitHub Pages
			// e.g., base: '/fridaykickers-svelte'
			base: process.env.NODE_ENV === 'production' ? '/fridaykickers-svelte' : ''
		},
		prerender: {
			handleHttpError: ({ path, message }) => {
				// Ignore errors for dynamic routes
				if (path.startsWith('/users/')) {
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
