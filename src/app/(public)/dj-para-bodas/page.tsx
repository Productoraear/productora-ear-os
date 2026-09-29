import { redirect } from 'next/navigation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DJ para Bodas S-Class · Calibración 12 W/pax & Price-Lock 100€ | Productora EAR',
  description: 'Contratación oficial de DJs para bodas con psicología de pista, sonido Bose, seguro de RC y garantía 0% cancelaciones con relevo garantizado.',
  alternates: {
    canonical: 'https://productoraear.com/bodas/dj',
  },
};

export default function DjParaBodasAlias() {
  redirect('/bodas/dj');
}
