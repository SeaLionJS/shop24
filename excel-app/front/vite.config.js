import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      //"/api/auth/login": "http://localhost:4000/",
      "/api": {
        target: "http://localhost:4000",
        //changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: '../electron-back/dist'
  },
  base: './'
})
