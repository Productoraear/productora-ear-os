import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "date-fns"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async redirects() {
    return [
      // Alias de producción
      {
        source: "/catering-brasas",
        destination: "/catering-de-brasas",
        permanent: true,
      },
      {
        source: "/admin/mobile_studio",
        destination: "/admin/mobile-studio",
        permanent: true,
      },
      // Sanitización de escaneos WordPress
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/login", permanent: true },
      { source: "/wp-login.php", destination: "/login", permanent: true },
      // Redirecciones SEO canónicas
      { source: "/inicio", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/home-2", destination: "/", permanent: true },
      {
        source: "/contacto",
        destination: "/empresarios",
        permanent: true,
      },
      {
        source: "/contacto-2",
        destination: "/empresarios",
        permanent: true,
      },
      {
        source: "/quienes-somos",
        destination: "/empresarios",
        permanent: true,
      },
      {
        source: "/sobre-nosotros",
        destination: "/empresarios",
        permanent: true,
      },
      {
        source: "/portfolio/:path*",
        destination: "/artistas",
        permanent: true,
      },
      {
        source: "/galeria/:path*",
        destination: "/artistas",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/sitemap-index.xml",
      },
    ];
  },
};

export default nextConfig;
