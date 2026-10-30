import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // P0 ANTI-BLOAT (deploy Coolify): excluir del trazado standalone la
  // bóveda monolítica de datos locales (src/data, NUCLEO_DATA, vault,
  // scripts, docs, reports...) que inflaba la imagen a ~6.3 GB y
  // provocaba OOM/timeout en el VPS de 4 GB. Los datos de venta viven en
  // public/data/providers/*.json (particiones < 1 MB, copiadas aparte).
  outputFileTracingExcludes: {
    "/*": [
      "./src/data/**/*",
      "./src/lib/NUCLEO_DATA/**/*",
      "./vault/**/*",
      "./vault_absorbed/**/*",
      "./scripts/**/*",
      "./docs/**/*",
      "./reports/**/*",
      "./scratch/**/*",
      "./deploy/**/*",
      "./n8n-workflows/**/*",
      "./.firebase/**/*",
      "./.obsidian/**/*",
      "./.models/**/*",
      "./public/**/*",
      "./*.log",
      "./*.pdf",
      "./*.html",
    ],
  },
  staticPageGenerationTimeout: 120,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  typescript: {
    // Validación estricta ejecutada localmente en pre-push (tsc --noEmit -> Exit 0).
    // Omitirla en Docker ahorra más de 5 minutos de CPU en el VPS.
    ignoreBuildErrors: true,
  },

  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },
  serverExternalPackages: ["sharp", "@prisma/client", "bcryptjs"],
  experimental: {
    webpackMemoryOptimizations: true,
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
        // U13 · Superficie de Verdad Pública (`/confianza`).
        // JUR-5 exige poder retirar un claim en < 10 minutos. max-age=0 evita
        // que el navegador congele el registro; s-maxage=300 + stale-while-
        // revalidate=60 acotan a 5 min la ventana de una CDN intermedia.
        // Se declara ANTES de "/:path*" para que su Cache-Control prevalezca
        // (Next.js resuelve por primera regla que define la misma cabecera).
        source: "/confianza",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
          },
        ],
      },
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
      // Canonicalización de host: unifica productoraear.com -> www.productoraear.com.
      // Google indexa el host www (GSC 2026-10-24). Sin este 301 ambos hosts compiten
      // y dividen la autoridad, hundiendo el posicionamiento. No afecta al IP de Coolify.
      {
        source: "/:path*",
        has: [{ type: "host", value: "productoraear.com" }],
        destination: "https://www.productoraear.com/:path*",
        permanent: true,
      },
      // Alias de producción
      {
        source: "/checkout",
        destination: "/checkout/presupuesto",
        permanent: false,
      },
      {
        source: "/dashboard",
        destination: "/admin",
        permanent: false,
      },
      {
        source: "/command-center",
        destination: "/admin/command-center",
        permanent: true,
      },
      {
        source: "/journey-heatmap",
        destination: "/admin/journey-heatmap",
        permanent: true,
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
      // Consolidación anti-doorway: rutas legacy /weddings -> hub real de bodas
      { source: "/weddings", destination: "/bodas", permanent: true },
      { source: "/weddings/:path*", destination: "/bodas", permanent: true },
      // Canonicalización mariachi con tilde: slugs ASCII legacy -> slug español canónico.
      { source: "/mariachis/cumpleanos", destination: "/mariachis/cumpleaños", permanent: true },
      { source: "/mariachis/quinceanera", destination: "/mariachis/quinceañera", permanent: true },
    ];
  },
};

export default nextConfig;
