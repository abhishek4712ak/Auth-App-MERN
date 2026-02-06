import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';



export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: 'https://auth-app-mern-2.onrender.com', // Your backend server URL
                changeOrigin: true, // Allows the proxy to change the origin of the request
                
            },
        },
    }
});
