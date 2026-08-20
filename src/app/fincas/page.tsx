import { Metadata } from 'next';
import FincasNationalCatalogClient from './FincasNationalCatalogClient';

export const metadata: Metadata = {
  title: 'Catálogo de Fincas para Bodas en España | Búsqueda por Provincias',
  description: 'Directorio nacional de fincas para bodas en España. Espacios verificados con auditoría de sonido, libertad de catering y cobertura técnica de Productora EAR.',
  keywords: [
    'fincas para bodas en españa',
    'fincas para bodas por provincias',
    'alquiler fincas eventos españa',
    'fincas de boda con sonido en vivo'
  ],
  alternates: {
    canonical: 'https://fincasparaboda.com/fincas',
  },
  openGraph: {
    title: 'Catálogo Nacional de Fincas para Bodas | fincasparaboda.com',
    description: 'Encuentra y reserva fincas para bodas en cualquier provincia de España con presupuesto garantizado.',
    url: 'https://fincasparaboda.com/fincas',
    siteName: 'FincasParaBoda.com',
    locale: 'es_ES',
    type: 'website',
  },
};

export default function Page() {
  return <FincasNationalCatalogClient />;
}
