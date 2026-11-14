import type { Metadata } from 'next';
import { ProviderUniversalCockpit } from '@/components/providers/ProviderUniversalCockpit';
import { loadProviderProfile } from '@/lib/providers/provider-profile-store';
import {
  mapTrojanCategoryToCatalog,
  ProviderProfileCategoryEnum,
  type ProviderProfileCategory,
} from '@/lib/providers/trojan-horse-schema';

export const metadata: Metadata = {
  title: 'Centro de Mando Soberano del Proveedor | EAR OS',
  description:
    'Gestión multicanal S-Class, Ficha Universal de 380 campos tipados Zod, Seating Planner Pulpetti integrado y agenda iCal anti-overbooking.',
};

interface PortalProveedorPageProps {
  readonly searchParams?: Promise<{
    readonly slug?: string;
    readonly category?: string;
  }>;
}

export default async function PortalProveedorPage({ searchParams }: PortalProveedorPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const slug = resolvedParams.slug || 'eduardo-martinez';

  // Validación y resolución segura de la categoría
  const rawCat = resolvedParams.category?.toUpperCase() || 'FINCA_ALQUILER';
  const categoryParsed = ProviderProfileCategoryEnum.safeParse(rawCat);
  const category: ProviderProfileCategory = categoryParsed.success
    ? categoryParsed.data
    : 'FINCA_ALQUILER';

  const catalogCategory = mapTrojanCategoryToCatalog(category);

  let initialValues: Record<string, string> = {};
  try {
    const profile = await loadProviderProfile(slug, catalogCategory);
    initialValues = { ...profile.values };
  } catch {
    // Si aún no existen registros persistidos, se arranca con el esquema limpio
    initialValues = {};
  }

  const businessName =
    slug === 'eduardo-martinez'
      ? 'Restaurante Otzarreta / Ezkertza Berria'
      : slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

  return (
    <main className="w-full overflow-x-hidden min-h-screen bg-[#030305]">
      <ProviderUniversalCockpit
        initialSlug={slug}
        initialBusinessName={businessName}
        initialCategory={category}
        initialTier="CLAIMED_PRO"
        initialValues={initialValues}
      />
    </main>
  );
}
