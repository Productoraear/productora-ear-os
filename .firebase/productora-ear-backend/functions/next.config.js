/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {}, // Silencia el conflicto con la config de webpack en Next.js 16
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devServer = {
        ...config.devServer,
        client: {
          webSocketURL: 'ws://localhost:3007/_next/webpack-hmr',
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;