import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    optimizeDeps: {
      include: ['@stripe/react-stripe-js', '@stripe/stripe-js'],
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://spm-mini-project.onrender.com',  // Backend server URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Optional: Adjust the URL path if needed
      },
    },
  },
})
