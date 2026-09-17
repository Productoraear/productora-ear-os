import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  staticPageGenerationTimeout: 300,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ["sharp", "@prisma/client", "bcryptjs"],
  outputFileTracingExcludes: {
    '*': [
      "EAR_CALL_CENTER_PROVEEDORES.html",
      "benchmark_localizados.csv",
      './src/data/**',
      './scripts/**',
      'node_modules/puppeteer/**',
      'node_modules/playwright/**',
      'node_modules/@sparticuz/**',
      'node_modules/pdfjs-dist/**',
      'node_modules/better-sqlite3/**',
      // Anti-bloat: los activos de `public/` se sirven por CDN, NUNCA deben
      // empaquetarse en la función serverless (causa raíz del limite de 250 MB).
      'public/**',
      'reports/**',
      'scripts/**',
      // Motores/CLI de Prisma no necesarios en runtime serverless.
      'node_modules/@prisma/engines/**',
      'node_modules/prisma/**',
      'node_modules/typescript/**',
      'node_modules/@types/**',
      // Motores temporales/duplicados y wasm multi-plataforma de Prisma.
      'node_modules/.prisma/**/*.tmp*',
      'node_modules/@prisma/client/runtime/*wasm*',
      'node_modules/@prisma/client/runtime/*.d.ts',
    ],
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@heroicons/react",
      "lodash",
      "@supabase/supabase-js",
      "firebase",
      "firebase/app",
      "firebase/auth",
      "firebase/firestore",
      "firebase/storage",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(self), geolocation=()",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Alias de producción
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/command-center",
        destination: "/admin",
        permanent: false,
      },
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