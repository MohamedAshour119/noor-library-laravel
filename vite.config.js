import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: 'resources/frontend/src/main.tsx',
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    optimizeDeps: {
        include: ['react-select']
    }
});

