import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Blog S-Class & Estrategia GEO | Productora EAR',
  description: 'Perspectivas avanzadas, ingeniería acústica, legalidad B2G y análisis estratégico del ecosistema artístico.',
};

const blogPosts = [
  {
    slug: 'auditoria-fincas-b2b',
    title: 'Cómo superamos la Auditoría Acústica en Fincas de Lujo B2B',
    category: 'Ingeniería B2B',
    date: '12 Nov 2026',
    excerpt: 'Descubre los parámetros de la auditoría S-Class para homologar fincas y dominar el yield management del sector nupcial.'
  },
  {
    slug: 'lcsp-ayuntamientos-118',
    title: 'El Bypass Institucional: Dominando el Art. 118 de la LCSP',
    category: 'Marco Legal B2G',
    date: '08 Nov 2026',
    excerpt: 'Ingeniería legal para facturación directa a la Administración Pública mediante contratos menores sin fricción ni concursos abiertos.'
  },
  {
    slug: 'vimume-evidencia-clinica',
    title: 'VIMUME: Terapia a 40 Hz y el Retorno Social (SROI)',
    category: 'VIMUME Catarsis',
    date: '02 Nov 2026',
    excerpt: 'Análisis clínico de las ondas Gamma aplicadas al tejido asociativo y su mecanismo de financiación vía Ley 49/2002.'
  }
];

export default function BlogIndexPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] font-sans selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-6xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <header className="mb-16 text-center">
          <span className="px-3 py-1 bg-[#ecb613]/10 text-[#ecb613] border border-[#ecb613]/30 rounded-full text-xs font-mono font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 mb-4">
            Blog Multipolar
          </span>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-serif mb-6">
            Inteligencia S-Class <br className="hidden md:block"/> para un Sector Elevado
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Gobernanza acústica, ingeniería legal, catarsis neurocientífica y soberanía transaccional en el marco B2C, B2B y B2G.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className="block group">
              <article className="h-full rounded-3xl bg-gradient-to-br from-[#0d0d12] to-[#14141e] border border-white/5 p-8 transition-all duration-300 hover:border-[#ecb613]/30 hover:shadow-[0_0_30px_rgba(236,182,19,0.1)] flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono uppercase px-2 py-1 bg-white/5 text-gray-300 rounded-md border border-white/10">
                    {post.category}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">{post.date}</span>
                </div>
                <h2 className="text-xl font-bold text-white font-serif mb-4 group-hover:text-[#ecb613] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-400 mb-8 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-[#ecb613] uppercase tracking-wider">
                  Desbloquear Dictamen 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
