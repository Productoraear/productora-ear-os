import { redirect } from 'next/navigation';

export default async function ArtistasEventosPage({
  searchParams,
}: {
  searchParams: Promise<{ tipo?: string }>;
}) {
  const params = await searchParams;
  const tipo = params.tipo || 'bodas';
  redirect(`/eventos?tipo=${tipo}`);
}