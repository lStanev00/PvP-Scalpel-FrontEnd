import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy :{
      "/api" : {
<<<<<<< HEAD
=======
        // target: "https://api.pvpscalpel.com",
>>>>>>> 42af99c54e636fc19d3f4a9c00097f65532698a2
        target: "http://localhost:59535",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }

    }
  },
  
})
