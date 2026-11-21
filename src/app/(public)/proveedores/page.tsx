import { ProveedoresDirectoryClient } from '@/components/providers/ProveedoresDirectoryClient';
import { PROVIDERS_GRAND_TOTAL } from '@/lib/constants/providers-manifest';
import {
  findCanonicalProvinceName,
  normalizeBodasNetCategory,
} from '@/lib/constants/spain-regions-and-categories';
import {
  sanitizePublicDirectoryProviders,
  searchProvidersServer,
} from '@/lib/providers/directory-search-server';

export const dynamic = 'force-dynamic';

interface ProveedoresPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}

export default async function ProveedoresPage({ searchParams }: ProveedoresPageProps) {
  const resolved = await searchParams;

  const rawCat =
    firstParam(resolved.cat) ||
    firstParam(resolved.categoria) ||
    firstParam(resolved.category);
  const rawSubcat =
    firstParam(resolved.subcat) || firstParam(resolved.subcategory) || 'all';
  const rawProv =
    firstParam(resolved.provincia) ||
    firstParam(resolved.province) ||
    firstParam(resolved.prov) ||
    firstParam(resolved.location);
  const rawQ = firstParam(resolved.q) || firstParam(resolved.search);
  const rawPage = firstParam(resolved.page);

  const initialCategory = rawCat ? normalizeBodasNetCategory(rawCat) : 'ALL';
  const initialSubcategory = rawSubcat || 'all';
  const initialProvince = rawProv
    ? findCanonicalProvinceName(rawProv) || rawProv
    : '';
  const initialQuery = rawQ.trim();
  const parsedPage = parseInt(rawPage || '1', 10);
  const initialPage = Number.isFinite(parsedPage) && parsedPage >= 1 ? parsedPage : 1;

  const searchResult = await searchProvidersServer({
    category: initialCategory === 'ALL' ? null : initialCategory,
    subcategory: initialSubcategory,
    province: initialProvince || null,
    q: initialQuery || null,
    page: initialPage,
    limit: 24,
  });

  const initialProviders = sanitizePublicDirectoryProviders(searchResult.providers);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Directorio Homologado de Proveedores EAR OS',
            description:
              'Selección de profesionales de España con seguro de RC de 1.000.000 €, rider acústico estandarizado y reserva protegida.',
            mainEntity: {
              '@type': 'CollectionPage',
              numberOfItems: PROVIDERS_GRAND_TOTAL,
              isPartOf: {
                '@type': 'WebSite',
                name: 'EAR OS',
              },
            },
          }),
        }}
      />
      <ProveedoresDirectoryClient
        initialCategory={initialCategory}
        initialSubcategory={initialSubcategory}
        initialProvince={initialProvince}
        initialQuery={initialQuery}
        initialPage={initialPage}
        initialProviders={initialProviders}
        initialTotal={searchResult.total}
      />
    </>
  );
}
