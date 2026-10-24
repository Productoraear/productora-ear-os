import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directorio de Proveedores y Fincas Homologadas S-Class | Productora EAR',
  description:
    'Catálogo oficial y verificado de fincas, música en directo, catering y sonido profesional para bodas. Conexión directa vía n8n Dispatcher y depósito protegido Stripe.',
  alternates: {
    canonical: 'https://www.productoraear.com/proveedores',
  },
  openGraph: {
    title: 'Directorio de Proveedores y Fincas Homologadas · Productora EAR',
    description:
      'Catálogo oficial y verificado de fincas, música en directo, catering y sonido profesional para bodas.',
    url: 'https://www.productoraear.com/proveedores',
    type: 'website',
  },
};

export default function ProveedoresLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
