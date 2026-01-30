import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['react-toastify'],
          api: ['axios']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
  },
  server: {
    host: true,
    port: 5173,
    historyApiFallback: true,  // Ensure that all routes fallback to index.html
  },
  preview: {
    host: true,
    port: 4173,
    historyApiFallback: true,  // Ensure that all routes fallback to index.html during preview as well
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  }
})
