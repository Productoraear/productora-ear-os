import { redirect, notFound } from 'next/navigation';
import { resolveGeoSegment } from '@/lib/navigation/canonical-taxonomy';

export default async function LegacyResidenciasProvinciaPage({ params }: { params: Promise<{ provincia: string }> }) {
  const { provincia } = await params;
  const provKey = provincia.toLowerCase();
  
  const geo = resolveGeoSegment(provKey);
  
  if (geo.province) {
    redirect(`/vimume/centros/${geo.province}`);
  }
  
  notFound();
}
