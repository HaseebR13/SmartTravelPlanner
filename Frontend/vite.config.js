import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// allowedHosts: true  ->  Vite accepts ANY host header, so every fresh
// ngrok URL works without editing this file again.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,          // listen on 0.0.0.0 so ngrok can reach it
    allowedHosts: true,  // accept any ngrok-free.app / ngrok-free.dev URL
  },
})
