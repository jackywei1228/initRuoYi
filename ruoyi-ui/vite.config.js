import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const baseUrl = 'http://localhost:8080'
const port = Number(process.env.VITE_PORT || 80)
const baseApi = process.env.VUE_APP_BASE_API || '/dev-api'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src-react')
    }
  },
  define: {
    'process.env': {
      VUE_APP_BASE_API: baseApi,
      VUE_APP_TITLE: process.env.VUE_APP_TITLE || 'JK管理系统'
    }
  },
  server: {
    host: '0.0.0.0',
    port,
    open: true,
    proxy: {
      [baseApi]: {
        target: baseUrl,
        changeOrigin: true,
        rewrite: (p) => p.replace(new RegExp(`^${baseApi}`), '')
      },
      '^/v3/api-docs/(.*)': {
        target: baseUrl,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false
  }
})
