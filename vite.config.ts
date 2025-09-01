import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'TS2307' || warning.code === 'TS6133' || warning.code === 'TS6133' || warning.code === 'TS2339' || warning.code === 'TS2345' || warning.code === 'TS2322') {
          return
        }
        warn(warning)
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  define: {
    __DEV__: false
  }
})

