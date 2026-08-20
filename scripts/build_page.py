import os

path = os.path.join("src", "app", "(public)", "proveedores", "page.tsx")
os.makedirs(os.path.dirname(path), exist_ok=True)

code = """import React from 'react';
import providersData from '@/data/all_providers_database.json';

export const dynamic = 'force-dynamic';

interface Props {
  searchParams: Promise<{ page?: string; query?: string }>;
}

export default async function ProveedoresPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const pageSize = 24;

  const searchQuery = (params.query || '').toLowerCase().trim();
  const filtered = searchQuery
    ? providersData.filter(
        (p: any) =>
          p.name.toLowerCase().includes(searchQuery) ||
          p.province.toLowerCase().includes(searchQuery) ||
          p.category.toLowerCase().includes(searchQuery)
      )
    : providersData;

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
      <header className="max-w-7xl mx-auto border-b border-neutral-800 pb-6 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[#ecb613] animate-pulse"></span>
          <span className="text-xs font-bold tracking-widest text-[#ecb613] uppercase">
            Productora EAR • Centralita Soberana
          </span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
          Red Homologada de Proveedores
        </h1>
        <p className="text-neutral-400 mt-2 text-base">
          {filtered.length.toLocaleString('es-ES')} proveedores de bodas y eventos verificados sin duplicados.
        </p>
      </header>

      <main className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paginated.map((item: any) => (
            <article
              key={item.id}
              className="bg-neutral-900/60 border border-neutral-800 hover:border-[#ecb613]/50 transition-all duration-300 p-6 rounded-2xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#ecb613] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-neutral-400 uppercase font-mono">{item.province}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{item.name}</h3>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                <span>Tel: {item.phone || 'Contacto Directo EAR'}</span>
                <span className="bg-[#ecb613]/10 text-[#ecb613] px-2 py-0.5 rounded border border-[#ecb613]/30">
                  S-Class Verified
                </span>
              </div>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 pt-8 border-t border-neutral-800">
            <a
              href={`/proveedores?page=${Math.max(1, page - 1)}${searchQuery ? `&query=${searchQuery}` : ''}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                page === 1
                  ? 'bg-neutral-900 text-neutral-600 pointer-events-none'
                  : 'bg-neutral-800 hover:bg-[#ecb613] text-white hover:text-black'
              }`}
            >
              Anterior
            </a>
            <span className="text-xs text-neutral-400 font-mono">
              Página {page} de {totalPages}
            </span>
            <a
              href={`/proveedores?page=${Math.min(totalPages, page + 1)}${searchQuery ? `&query=${searchQuery}` : ''}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                page === totalPages
                  ? 'bg-neutral-900 text-neutral-600 pointer-events-none'
                  : 'bg-neutral-800 hover:bg-[#ecb613] text-white hover:text-black'
              }`}
            >
              Siguiente
            </a>
          </div>
        )}
      </main>
    </div>
  );
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(code)

print("✅ Archivo page.tsx generado en UTF-8 estricto sin caracteres corruptos.")
