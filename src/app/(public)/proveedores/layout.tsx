import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Directorio de Proveedores y Fincas | Productora EAR',
  description:
    'Directorio de fincas, música en directo, catering y sonido para bodas. El sello S-Class se acredita ficha a ficha con teléfono real verificable y depósito de 100 € en Stripe Price-Lock.',
  alternates: {
    canonical: 'https://www.productoraear.com/proveedores',
  },
  openGraph: {
    title: 'Directorio de Proveedores y Fincas · Productora EAR',
    description:
      'Directorio de fincas, música en directo, catering y sonido para bodas. Sello S-Class acreditado ficha a ficha.',
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
