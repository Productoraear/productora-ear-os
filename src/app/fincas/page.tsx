import { Metadata } from 'next';
import FincasB2BPortal from '@/components/fincas/FincasB2BPortal';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

export const metadata: Metadata = {
  title: 'Red de 12 Fincas Homologadas S-Class & Afiliación B2B | Productora EAR',
  description: 'Auditoría técnica de espacios para bodas en Madrid y Toledo. Póliza RC >= 300.000€, acometida CETAC 32A/16A y comisiones de 380€ a 570€ con liquidación en 7 días hábiles.',
  keywords: [
    'fincas para bodas madrid toledo',
    'homologacion fincas eventos',
    'afiliacion b2b wedding planner',
    'comisiones fincas bodas',
    'toma cetac 32a eventos',
    'sonido bodas bose f1',
    'acustica fincas madrid',
    'Méntrida Hub Logístico'
  ],
  alternates: {
    canonical: 'https://www.productoraear.com/fincas',
  },
  openGraph: {
    title: 'Red de 12 Fincas Homologadas S-Class & Portal de Afiliación B2B',
    description: 'Espacios certificados con auditoría de potencia y límites acústicos. Liquidación de comisiones garantizada en 7 días hábiles.',
    url: 'https://www.productoraear.com/fincas',
    siteName: 'Productora EAR — EAR OS',
    locale: 'es_ES',
    type: 'website',
  },
};

const fincasSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ItemList',
      name: 'Red de 12 Fincas Homologadas Productora EAR',
      description: 'Espacios singulares con auditoría técnica certificada (RC 300k, CETAC 32A/16A)',
      numberOfItems: SCLASS_12_FINCAS_HOMOLOGADAS.length,
      itemListElement: SCLASS_12_FINCAS_HOMOLOGADAS.map((f, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'EventVenue',
          name: f.name,
          address: {
            '@type': 'PostalAddress',
            addressLocality: f.location,
            addressRegion: f.provincia,
            addressCountry: 'ES'
          },
          maximumAttendeeCapacity: f.capacidadMaxPax,
          description: f.description
        }
      }))
    }
  ]
};

export default function FincasPage() {
  return (
    <main className="w-full max-w-full overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(fincasSchema) }}
      />
      <FincasB2BPortal />
    </main>
  );
}
