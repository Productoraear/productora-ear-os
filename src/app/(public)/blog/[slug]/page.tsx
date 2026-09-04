import React from 'react';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  return {
    title: `Dictamen: ${resolvedParams.slug} | Oráculo EAR`,
    description: `Análisis avanzado y dictamen estratégico sobre ${resolvedParams.slug} en el ecosistema EAR OS.`,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  if (!resolvedParams.slug) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] font-sans selection:bg-[#ecb613] selection:text-black">
      <article className="max-w-4xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <header className="mb-12 border-b border-white/10 pb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase px-3 py-1 bg-white/5 text-gray-300 rounded-md border border-white/10">
              DICTAMEN TÉCNICO
            </span>
            <span className="text-xs text-gray-500 font-mono">12 Nov 2026</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-serif mb-6 leading-tight">
            Análisis S-Class: <span className="text-[#ecb613]">{resolvedParams.slug}</span>
          </h1>
          <p className="text-xl text-gray-400 font-serif italic">
            El verdadero apalancamiento no reside en competir, sino en destruir el paradigma del competidor mediante infraestructura inmutable.
          </p>
        </header>

        <div className="prose prose-invert prose-lg max-w-none font-serif prose-headings:font-bold prose-headings:text-white prose-a:text-[#ecb613] hover:prose-a:text-amber-400 prose-p:text-gray-300">
          <p>
            Este dictamen detalla la arquitectura de decisión y la asimetría de información extraída
            del sector. El objetivo de EAR OS no es operar en el mercado, sino crear un sistema 
            cerrado donde la competencia queda invalidada por estándares técnicos y legales superiores.
          </p>
          
          <h2>1. Anatomía del Problema</h2>
          <p>
            En la configuración actual, los operadores tradicionales sufren de márgenes exprimidos 
            y fricción transaccional constante. La ausencia de protocolos estandarizados (como la norma 
            SPL en acústica o los expedientes LCSP en el entorno B2G) los relega a una posición reactiva.
          </p>

          <h2>2. Ingeniería del Bypass</h2>
          <p>
            Al implementar un embudo criptográficamente firmado y una infraestructura homologada, 
            extraemos al cliente (o institución) de la fase de negociación y lo situamos directamente 
            en la fase transaccional. El <strong>Exit Code 0</strong> no es solo un estado del software, 
            es una filosofía de negocio.
          </p>

          <div className="my-12 p-6 rounded-2xl bg-[#09090d] border border-[#ecb613]/20 border-l-4 border-l-[#ecb613]">
            <h4 className="text-[#ecb613] font-mono text-sm uppercase tracking-wider mb-2">Directiva Soberana</h4>
            <p className="text-sm text-gray-300 m-0 font-sans">
              "La calidad es una métrica; la soberanía es un estado. No vendemos servicios, homologamos 
              ecosistemas para que el cliente opere de forma segura bajo nuestros protocolos."
            </p>
          </div>
        </div>
      </article>
    </main>
  );
}
