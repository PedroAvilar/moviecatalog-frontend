import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repoName = 'moviecatalog-frontend';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	base: `/${repoName}/`,
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/test/setup.js',
		css: true,
	},
});
