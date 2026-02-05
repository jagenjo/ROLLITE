import { defineConfig } from 'vite';

export default defineConfig({
    root: '.',
    build: {
        outDir: 'dist/client',
        emptyOutDir: true,
    },
    server: {
        port: 5173,
        proxy: {
            // Proxy socket.io to server
            '/socket.io': {
                target: 'http://localhost:4001',
                ws: true
            },
            '/upload': {
                target: 'http://localhost:4001'
            }
        }
    }
});
