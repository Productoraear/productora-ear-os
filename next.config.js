const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: [
      'puppeteer',
      'puppeteer-extra',
      'puppeteer-extra-plugin-stealth',
      'clone-deep',
      'merge-deep',
      'undici',
      'cheerio',
      '@protobufjs/inquire', // Add this line
    ],
    // runtime: false, // Disable edge runtime
  },
  images: {
    domains: ['images.unsplash.com'],
  },
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@'] = path.join(__dirname, './src');
    config.resolve.alias['@protobufjs'] = path.join(__dirname, 'node_modules/@protobufjs'); // Add this line
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/bridge/:path*',
        destination: 'https://productoraear.com/wp-json/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/mariachis-madrid',
        destination: '/servicios/mariachi-madrid',
        permanent: true,
      },
      {
        source: '/mariachis-toledo',
        destination: '/servicios/mariachi-toledo',
        permanent: true,
      },
      // 301 Redirects para transferir Link Juice de URLs previas a la nueva arquitectura
    ];
  },
};

module.exports = nextConfig;