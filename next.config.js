const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname, // Set the Turbopack root to the current directory
  },
  serverExternalPackages: [
    'puppeteer',
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth',
    'clone-deep',
    'merge-deep',
    'undici',
    'cheerio',
    '@protobufjs/inquire',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  reactStrictMode: true,
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
      // 🎯 CANONICAL STAKEHOLDER REDIRECTS (V165.L - DEFENSIVE LAYER)
      
      // 📬 Contact Hub Consolidation
      { source: '/cotizador', destination: '/contacto', permanent: true },
      { source: '/contact', destination: '/contacto', permanent: true },
      { source: '/contacto-vimume', destination: '/contacto', permanent: true },
      { source: '/vimume/contacto', destination: '/contacto', permanent: true },

      // 🧪 VIMUME Authority Nodes
      { source: '/metodo', destination: '/vimume/protocolo', permanent: true },
      { source: '/protocolo', destination: '/vimume/protocolo', permanent: true },
      { source: '/fundacion', destination: '/vimume/fundacion', permanent: true },
      { source: '/roadmap', destination: '/vimume/roadmap', permanent: true },
      { source: '/hoja-de-ruta', destination: '/vimume/roadmap', permanent: true },
      { source: '/vimume/fundacion-cientifica', destination: '/vimume/fundacion', permanent: true },

      // 🛠️ Legacy Branding Purge (Antigravity -> VIMUME)
      { source: '/antigravity', destination: '/vimume', permanent: true },
      { source: '/antigravity/:path*', destination: '/vimume', permanent: true },
      { source: '/centro-de-gravedad', destination: '/vimume', permanent: true },

      // 🛡️ System Infrastructure Redirection
      { source: '/ear-os-gold', destination: '/', permanent: true },
      { source: '/ear-os-gold/:path*', destination: '/', permanent: true },
      { source: '/antigravity-alpha-dev', destination: '/', permanent: true },

      // 🎸 Legacy Services
      { source: '/mariachis-madrid', destination: '/servicios/mariachi-madrid', permanent: true },
      { source: '/mariachis-toledo', destination: '/servicios/mariachi-toledo', permanent: true },
    ];
  },
};

module.exports = nextConfig;
