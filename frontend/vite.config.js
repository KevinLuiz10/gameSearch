import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'https://www.freetogame.com',
//         changeOrigin: true,
//         secure: false,
//         rewrite: (path) => path.replace(/^\/api/, '/api')
//       },
//     },
//   },
// })

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:3000',
//         changeOrigin: true,
//         secure: false,
//       },
//     },
//   },
// })

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Necessário para Docker
    proxy: {
      // Toda requisição que começar com /api será enviada para o container 'backend'
      '/api': {
        target: 'http://backend:3000', // 'backend' é o nome do serviço no docker-compose
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, '') // Remove o '/api' antes de enviar, se suas rotas no back não tiverem '/api'
        // OBS: Se suas rotas no backend JÁ começam com /api (ex: router.get('/api/games')), REMOVA a linha 'rewrite' acima.
      }
    }
  }
})