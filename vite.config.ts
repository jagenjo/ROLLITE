import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');
    const basePath = env.BASE_PATH || '/';

    return {
        root: '.',
        base: basePath,
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
            },
            watch: {
                ignored: ['**/public/uploads/**']
            }
        }
    };
});
