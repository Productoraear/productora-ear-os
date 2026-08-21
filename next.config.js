/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      // 1. Redirecciones de URLs Legadas de WordPress / Directorios Antiguos
      {
        source: '/alquiler-pantalla-led/:path*',
        destination: '/arsenal',
        permanent: true,
      },
      {
        source: '/pantalla-led/:path*',
        destination: '/arsenal',
        permanent: true,
      },
      {
        source: '/pantallas-led/:path*',
        destination: '/arsenal',
        permanent: true,
      },
      {
        source: '/alquiler-sonido/:path*',
        destination: '/arsenal',
        permanent: true,
      },
      {
        source: '/alquiler-iluminacion/:path*',
        destination: '/arsenal',
        permanent: true,
      },
      {
        source: '/servicios/:path*',
        destination: '/bodas',
        permanent: true,
      },
      {
        source: '/categoria/:path*',
        destination: '/bodas',
        permanent: true,
      },
      {
        source: '/category/:path*',
        destination: '/bodas',
        permanent: true,
      },
      {
        source: '/tag/:path*',
        destination: '/bodas',
        permanent: true,
      },
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