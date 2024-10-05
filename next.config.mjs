/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // ... otras configuraciones
    serverRuntimeConfig: {
      // Variables de configuración del servidor
      apiEndpoint: 'http://localhost:3001' // La URL de tu servidor
    },
    publicRuntimeConfig: {
      // Variables de configuración accesibles desde el frontend
      wsEndpoint: 'ws://localhost:8080' // La URL de tu servidor WebSocket
    },
  }
  
  module.exports = nextConfig