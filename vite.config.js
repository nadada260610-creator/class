import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 로컬 개발 시 /api/* 를 Express 서버로 프록시
      // Vercel 배포 후에는 Vercel Serverless Function이 직접 처리
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})

