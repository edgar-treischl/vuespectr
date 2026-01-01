import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  base: process.env.VITE_BASE_URL || '/vuetemplate/',  // fallback ensures deploy never breaks
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
