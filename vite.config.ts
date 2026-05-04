import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Disable lightningcss — it fails on CSS-in-JS template strings
    cssMinify: 'esbuild',
  },
})
