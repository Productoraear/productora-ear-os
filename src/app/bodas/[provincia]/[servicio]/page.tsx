import { redirect } from 'next/navigation';

interface Props {
  params: Promise<{ provincia: string; servicio: string }>;
}

/**
 * Redirect duplicated non-grouped route to canonical (public) route.
 * This file existed as 0 bytes causing potential build issues.
 */
export default async function BodasRedirectPage({ params }: Props) {
  const { provincia, servicio } = await params;
  redirect(`/bodas/${provincia}/${servicio}`);
}
