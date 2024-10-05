/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    serverRuntimeConfig: {
      apiEndpoint: 'http://localhost:8080' // La URL de tu servidor
    },
    publicRuntimeConfig: {
      wsEndpoint: 'ws://localhost:8080', // La URL de tu servidor WebSocket
      NEXT_PUBLIC_WS_ENDPOINT: 'ws://localhost:8080' // Asegúrate de que sea accesible desde el frontend
    },
};

// Exporta la configuración usando la sintaxis de ES
export default nextConfig;