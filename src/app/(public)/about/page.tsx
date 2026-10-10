import type { Metadata } from 'next';
import { Suspense } from 'react';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import About from '@/widgets/about/AboutWidget';
import SocialImpactWidget from '@/widgets/about/SocialImpactWidget';

const SITE_URL = 'https://productoraear.com';
const PAGE_PATH = '/about';
const PAGE_TITLE = 'Quiénes Somos | Productora EAR';
const PAGE_DESCRIPTION =
  'Productora EAR: casa productora audiovisual en México. Dirección creativa, producción ejecutiva y postproducción para marcas, artistas y proyectos culturales. Portafolio, equipo y metodología de trabajo.';
const OG_DESCRIPTION =
  'Casa productora audiovisual en México. Dirección creativa, producción ejecutiva y postproducción para marcas, artistas y proyectos culturales.';

export const metadata: Metadata = {
  title: {
    default: PAGE_TITLE,
    template: '%s | Productora EAR',
  },
  description: PAGE_DESCRIPTION,
  keywords: [
    'Productora EAR',
    'productora audiovisual',
    'quiénes somos',
    'casa productora México',
    'dirección creativa',
    'producción ejecutiva',
    'postproducción',
    'impacto social',
    'S-Class',
  ],
  alternates: {
    canonical: PAGE_PATH,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
    type: 'website',
    locale: 'es_MX',
    siteName: 'Productora EAR',
    url: `${SITE_URL}${PAGE_PATH}`,
  },
  twitter: {
    card: 'summary_large_image',
    title: PAGE_TITLE,
    description: OG_DESCRIPTION,
  },
};

interface AboutJsonLd {
  readonly '@context': 'https://schema.org';
  readonly '@type': 'AboutPage';
  readonly name: string;
  readonly description: string;
  readonly url: string;
  readonly inLanguage: string;
  readonly mainEntity: {
    readonly '@type': 'Organization';
    readonly name: string;
    readonly url: string;
    readonly description: string;
    readonly knowsAbout: readonly string[];
  };
}

const aboutJsonLd: AboutJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}${PAGE_PATH}`,
  inLanguage: 'es-MX',
  mainEntity: {
    '@type': 'Organization',
    name: 'Productora EAR',
    url: SITE_URL,
    description:
      'Casa productora audiovisual en México. Dirección creativa, producción ejecutiva y postproducción para marcas, artistas y proyectos culturales.',
    knowsAbout: [
      'Producción audiovisual',
      'Dirección creativa',
      'Producción ejecutiva',
      'Postproducción',
      'Impacto social',
    ],
  },
};

function AboutSkeleton(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando contenido de Quiénes Somos"
      className="mx-auto w-full max-w-7xl px-6 py-24"
    >
      <span className="sr-only">Cargando…</span>
      <div className="animate-pulse space-y-8">
        <div className="h-4 w-32 rounded-full bg-white/5" />
        <div className="h-12 w-3/4 rounded-2xl bg-white/5" />
        <div className="h-6 w-2/3 rounded-xl bg-white/5" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="h-40 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-2xl bg-white/5" />
        </div>
        <div className="h-64 w-full rounded-2xl bg-white/5" />
      </div>
    </div>
  );
}

function SocialImpactSkeleton(): React.JSX.Element {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Cargando sección de impacto social"
      className="mx-auto w-full max-w-7xl px-6 py-16"
    >
      <span className="sr-only">Cargando…</span>
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-40 rounded-full bg-white/5" />
        <div className="h-10 w-1/2 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="h-48 rounded-2xl bg-white/5" />
          <div className="h-48 rounded-2xl bg-white/5" />
        </div>
      </div>
    </div>
  );
}

export default function AboutPage(): React.JSX.Element {
  return (
    <main className="min-h-screen bg-[#030305] text-white antialiased selection:bg-white/10 selection:text-white">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <SovereignNavbar />
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]"
        />
        <Suspense fallback={<AboutSkeleton />}>
          <div className="motion-safe:animate-[fadeIn_600ms_ease-out_both]">
            <About />
          </div>
        </Suspense>
        <Suspense fallback={<SocialImpactSkeleton />}>
          <div className="motion-safe:animate-[fadeIn_800ms_ease-out_both]">
            <SocialImpactWidget />
          </div>
        </Suspense>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [class*="motion-safe:animate-"] {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}