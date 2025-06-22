import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy :{
      "/api" : {
        target: "https://api.pvpscalpel.com",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }

    }
  },
  resolve: {
  extensions: ['.js', '.jsx', '.ts', '.tsx']
}

})
