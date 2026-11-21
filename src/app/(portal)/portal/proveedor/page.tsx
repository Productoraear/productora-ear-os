import type { Metadata } from 'next';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ProviderUniversalCockpitGate } from '@/components/providers/ProviderUniversalCockpitGate';
import { loadProviderProfile } from '@/lib/providers/provider-profile-store';
import { requireAdminFromHeaders } from '@/lib/security/adminGuard';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import {
  mapTrojanCategoryToCatalog,
  ProviderProfileCategoryEnum,
  type ProviderProfileCategory,
} from '@/lib/providers/trojan-horse-schema';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Centro de Mando Soberano del Proveedor | EAR OS',
  description:
    'Gestión multicanal S-Class, Ficha Universal de 380 campos tipados Zod, Seating Planner Pulpetti integrado y agenda iCal anti-overbooking.',
  // Herramienta de proveedor: jamás se indexa ni se ofrece al cliente final.
  robots: { index: false, follow: false },
};

interface PortalProveedorPageProps {
  readonly searchParams?: Promise<{
    readonly slug?: string;
    readonly category?: string;
  }>;
}

/**
 * ── GUARDA ESTRICTA DE SUPERFICIE (RBAC ZERO-LEAKAGE · R4) ──────────────────
 * Este cockpit expone la Ficha Universal de 380 campos y herramientas de
 * captación. Poda estricta en servidor (fail-closed, sin bypass en no-prod):
 *   · ADMIN/EDITOR verificado (`requireAdminFromHeaders()` o coincidencia exacta
 *     de `EAR_ADMIN_TOKEN` en entorno).
 *   · Nadie más → pantalla «Acceso restringido a proveedores», sin cargar perfil
 *     ni instanciar `ProviderUniversalCockpitGate`.
 */
export default async function PortalProveedorPage({ searchParams }: PortalProveedorPageProps) {
  const adminAuth = await requireAdminFromHeaders();
  const cookieStore = await cookies();
  const envAdminToken = process.env.EAR_ADMIN_TOKEN?.trim();
  const cookieAdminToken = cookieStore.get('ear_admin_token')?.value?.trim();
  const authorized =
    adminAuth.ok ||
    Boolean(envAdminToken && cookieAdminToken && cookieAdminToken === envAdminToken);

  if (!authorized) {
    return (
      <main className="flex min-h-screen w-full items-center justify-center bg-[#030305] px-4 text-white">
        <section className="w-full max-w-md space-y-4 rounded-3xl border border-white/10 bg-[#09090D] p-6 text-center">
          <h1 className="text-lg font-bold text-[#F4F1EA]">Acceso restringido a proveedores</h1>
          <p className="text-sm leading-relaxed text-[#8E8A80]">
            El Centro de Mando del Proveedor contiene la ficha interna de 380 campos y las
            herramientas de captación. Inicia sesión con tu cuenta verificada para editarla.
          </p>
          <Link
            href={`/login?from=${encodeURIComponent('/portal/proveedor')}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#ecb613] px-4 py-2 text-sm font-bold text-black transition-colors hover:bg-[#f7cb45]"
          >
            Iniciar sesión como proveedor
          </Link>
          <p className="text-[11px] text-[#6F6B62]">
            ¿Aún no tienes ficha? La Centralita oficial gestiona el alta: {CENTRALITA_EAR_OS}.
          </p>
        </section>
      </main>
    );
  }

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
      <ProviderUniversalCockpitGate
        initialSlug={slug}
        initialBusinessName={businessName}
        initialCategory={category}
        initialTier="CLAIMED_PRO"
        initialValues={initialValues}
      />
    </main>
  );
}
