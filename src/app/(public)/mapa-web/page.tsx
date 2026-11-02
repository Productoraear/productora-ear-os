import React from 'react';
import sitemap from '@/app/sitemap';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

export default async function MapaWebPage() {
  const entries = await sitemap();

  return (
    <div className="min-h-screen bg-[#030305] text-white p-6 sm:p-12 font-sans">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="inline-block px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/40 text-[#ecb613] font-mono text-xs font-bold uppercase tracking-wider">
          Navegación S-Class Interactiva Directa
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-syne text-[#ecb613]">
          Índice Maestro de Productora EAR
        </h1>
        <p className="text-sm text-zinc-400 font-mono">
          {entries.length} URLs canónicas verificadas listas para navegar con 1 solo clic directo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-4">
          {entries.map((entry) => {
            const path = entry.url.replace('https://www.productoraear.com', '') || '/';
            return (
              <div
                key={entry.url}
                className="p-3.5 rounded-2xl bg-[#09090d] border border-white/10 hover:border-[#ecb613]/50 transition-all flex items-center justify-between group"
              >
                <Link
                  href={path}
                  target="_blank"
                  className="text-xs font-mono text-cyan-400 group-hover:text-[#ecb613] hover:underline truncate mr-2"
                >
                  🔗 {path}
                </Link>
                <span className="text-[10px] font-mono text-zinc-500 whitespace-nowrap">
                  p: {entry.priority ?? 0.8}
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-8 mt-8 border-t border-white/10 text-center font-mono text-xs text-zinc-500">
          EAR OS v14.0 · Total URLs Canónicas: {entries.length} · Servidor Bare-Metal Hostinger
        </div>
      </div>
    </div>
  );
}

