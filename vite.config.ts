import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/React-alphacore-task/',
  plugins: [react()],
  resolve: {
    alias: {
      '@alphacore/ui-kit/dist': path.resolve(__dirname, 'node_modules/@alphacore/ui-kit/dist'),
    },
  },
  server: {
    proxy: {
      '/graphql': {
        target: 'http://185.207.66.100:8080',
        changeOrigin: true,
      },
    },
  },
})
