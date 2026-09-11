/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
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
      { source: "/catering-brasas", destination: "/catering-de-brasas", permanent: true },
      { source: "/admin/mobile_studio", destination: "/admin/mobile-studio", permanent: true },
      { source: "/wp-content/:path*", destination: "/", permanent: true },
      { source: "/wp-admin/:path*", destination: "/login", permanent: true },
      { source: "/wp-login.php", destination: "/login", permanent: true },
      { source: "/inicio", destination: "/", permanent: true },
      { source: "/home", destination: "/", permanent: true },
      { source: "/contacto", destination: "/empresarios", permanent: true },
      { source: "/quienes-somos", destination: "/empresarios", permanent: true },
      { source: "/portfolio/:path*", destination: "/artistas", permanent: true },
      { source: "/galeria/:path*", destination: "/artistas", permanent: true },
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
