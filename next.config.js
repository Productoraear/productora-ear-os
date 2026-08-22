const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      // 1. Sanitización de WordPress y Escaneos Obsoletos
      {
        source: '/wp-content/:path*',
        destination: '/',
        permanent: true,
      },
      {
        source: '/wp-admin/:path*',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/wp-login.php',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/inicio',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home-2',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contacto',
        destination: '/empresarios',
        permanent: true,
      },
      {
        source: '/contacto-2',
        destination: '/empresarios',
        permanent: true,
      },
      {
        source: '/quienes-somos',
        destination: '/empresarios',
        permanent: true,
      },
      {
        source: '/sobre-nosotros',
        destination: '/empresarios',
        permanent: true,
      },
      {
        source: '/portfolio/:path*',
        destination: '/artistas',
        permanent: true,
      },
      {
        source: '/galeria/:path*',
        destination: '/artistas',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;