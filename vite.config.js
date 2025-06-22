import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
    plugins: [react()],
    base: "/",
    server: {
        proxy: {
            "/api": {
                target: "https://api.pvpscalpel.com",
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, "")
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            'src': path.resolve(__dirname, './src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
})
