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
      // ORDEN DIRECTIVA 2026-11-11 · UNIFICACIÓN DE CALCULADORA:
      // `/presupuesto` es la ruta CANÓNICA del cotizador. `/calculadora` (y su
      // alias histórico `/cotizador`, al que apuntaba el conmutador de la propia
      // página) dejan de ser rutas competidoras para no dividir autoridad SEO
      // ni duplicar el estado del formulario. 301 permanente: el PageRank y las
      // visitas consolidadas pasan íntegros a la canónica.
      {
        source: "/calculadora",
        destination: "/presupuesto",
        permanent: true,
      },
      {
        source: "/cotizador",
        destination: "/presupuesto",
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
      // Consolidación 12 Super-Pantallas (Anti-Frankenstein 301)
      { source: "/artists", destination: "/artistas", permanent: true },
      { source: "/artists/:slug", destination: "/artistas/:slug", permanent: true },
      { source: "/fincas-landing", destination: "/fincas", permanent: true },
      { source: "/fincasparaboda", destination: "/fincas", permanent: true },
      { source: "/boda", destination: "/fincas", permanent: true },
      { source: "/ayuntamientospremium", destination: "/b2g", permanent: true },
      { source: "/ayuntamientos-premium", destination: "/b2g", permanent: true },
      { source: "/afiliado", destination: "/contacto", permanent: true },
      { source: "/voicestudio", destination: "/studio/artist", permanent: true },
      { source: "/proveedores-servicios", destination: "/proveedores", permanent: true },
      { source: "/agent-skills", destination: "/admin/agentes", permanent: true },
      { source: "/radar", destination: "/admin?tab=RADAR", permanent: true },
      { source: "/sourcing", destination: "/admin/sourcing", permanent: true },
      { source: "/voice-studio", destination: "/admin/voice-studio", permanent: true },
      // Canonicalización mariachi con tilde: slugs ASCII legacy -> slug español canónico.
      { source: "/mariachis/cumpleanos", destination: "/mariachis/cumpleaños", permanent: true },
      { source: "/mariachis/quinceanera", destination: "/mariachis/quinceañera", permanent: true },
    ];
  },
};

export default nextConfig;
