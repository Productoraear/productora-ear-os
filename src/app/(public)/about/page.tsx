import type { Metadata } from 'next';
import SovereignNavbar from '@/app/components/layout/SovereignNavbar';
import About from '@/widgets/about/AboutWidget';
import SocialImpactWidget from '@/widgets/about/SocialImpactWidget';

export const metadata: Metadata = {
  title: {
    default: 'Quiénes Somos | Productora EAR',
    template: '%s | Productora EAR',
  },
  description:
    'Conoce la visión, misión y propósito de Productora EAR: una productora S-Class dedicada a crear experiencias audiovisuales de alto impacto, con estándares de excelencia y responsabilidad social.',
  keywords: [
    'Productora EAR',
    'productora audiovisual',
    'quiénes somos',
    'visión',
    'misión',
    'impacto social',
    'S-Class',
  ],
  alternates: {
    canonical: '/about',
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Quiénes Somos | Productora EAR',
    description:
      'Conoce la visión, misión y propósito de Productora EAR: una productora S-Class dedicada a crear experiencias audiovisuales de alto impacto.',
    type: 'website',
    locale: 'es_MX',
    siteName: 'Productora EAR',
  },
  twitter: {
    card: 'summary',
    title: 'Quiénes Somos | Productora EAR',
    description:
      'Conoce la visión, misión y propósito de Productora EAR: una productora S-Class dedicada a crear experiencias audiovisuales de alto impacto.',
  },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black">
      <SovereignNavbar />
      <About />
      <SocialImpactWidget />
    </main>
  );
}