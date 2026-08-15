import { metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import publicCatalog from '@/scripts/vampire_public_catalog_zk.json';
import { calculateGeoPricing } from '@/lib/services/pricing/geo-pricer';

interface PageProps {
  params: { category: string; province: string };
}

// 1. Matriz de Generación Estática (Categoría x Provincia)
export async function generateStaticParams() {
  const categories = ['musica', 'fotografia', 'animacion', 'catering', 'organizacion'];
  const provinces = ['madrid', 'barcelona', 'valencia', 'sevilla', 'malaga', 'toledo', 'alicante'];

  const params: { category: string; province: string }[] = [];
  categories.forEach((category) => {
    provinces.forEach((province) => {
      params.push({ category, province });
    });
  });
  return params;
}

export default function CategoryProvinceSeoPage({ params }: PageProps) {
  const categoryTitle = params.category.toUpperCase();
  const provinceData = calculateGeoPricing(params.province);
  const normalizedProvince = provinceData.normalizedProvince || params.province;

  // Filtrado de proveedores por categoría y localización
  const filteredVendors = publicCatalog.filter(
    (vendor: any) =>
      vendor.category?.toLowerCase().includes(params.category.toLowerCase()) ||
      vendor.description?.toLowerCase().includes(normalizedProvince.toLowerCase())
  );

  // 2. Marcado de Datos Estructurados JSON-LD Schema (Google Search)
  const jsonLdSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Los mejores profesionales de ${categoryTitle} en ${normalizedProvince}`,
    description: `Directorio oficial y contratacion directa de ${categoryTitle} en ${normalizedProvince}. Reserva garantizada con Price-Lock 72h.`,
    url: `https://www.productoraear.com/servicios/${params.category}/${params.province}`,
    numberOfItems: filteredVendors.length,
    itemListElement: filteredVendors.slice(0, 10).map((vendor: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LocalBusiness',
        name: vendor.rawName,
        description: vendor.description,
        url: `https://www.productoraear.com/proveedores/${vendor.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: normalizedProvince,
          addressCountry: 'ES',
        },
      },
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-white font-mono">
      {/* Inyección del marcado de datos JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
      />

      <div className="mb-8 border-b border-slate-800 pb-6">
        <div className="text-xs text-amber-500 font-bold mb-1">
          INSPECCIÓN SEO PROGRAMÁTICA // COBERTURA NACIONAL
        </div>
        <h1 className="text-3xl font-bold text-white">
          {categoryTitle} EN {normalizedProvince.toUpperCase()}
        </h1>
        <p className="text-xs text-slate-400 mt-2">
          {filteredVendors.length} profesionales auditados con infraestructura técnica directa y reserva mediante garantía.
        </p>
      </div>

      {/* Grid de Fichas Estáticas Canónicas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVendors.slice(0, 24).map((vendor: any) => (
          <div key={vendor.slug} className="bg-slate-900 border border-slate-800 p-5 rounded-lg flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg text-white truncate">{vendor.rawName}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 mt-2">{vendor.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-[10px] bg-slate-800 text-amber-400 px-2 py-1 rounded">
                Verificado ZK
              </span>
              <Link href={`/proveedores/${vendor.slug}`} className="text-xs text-amber-400 hover:underline">
                Ver Escaparate →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
