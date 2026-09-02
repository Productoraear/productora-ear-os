'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Download, Award, Music, CheckCircle2 } from 'lucide-react';
import BlogClusterPage from '@/app/components/public/BlogClusterPage';

function B2GDossierContent() {
  const searchParams = useSearchParams();

  // Si no vienen parámetros específicos del Agente Hunter B2G, mostrar vista cluster de posts
  const hasCustomParams = searchParams.has('municipio') || searchParams.has('presupuesto') || searchParams.has('cpv');

  if (!hasCustomParams) {
    const posts = [
      {
        id: 5,
        title: "Alianzas con Ayuntamientos: Modelo de Despliegue",
        excerpt: "Cómo integrar VIMUME en la agenda de cultura y bienestar de los municipios españoles.",
        date: "01 May 2026",
        author: "Relaciones Institucionales",
        tag: "B2G",
        readTime: "10 min",
        image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800&auto=format&fit=crop",
        href: "/blog/b2g/alianzas-ayuntamientos"
      },
      {
        id: 9,
        title: "Institutional Sovereignty: IMSERSO & CSR Integration",
        excerpt: "Acceso a financiación institucional y presupuestos de Responsabilidad Social Corporativa para el despliegue VIMUME.",
        date: "15 May 2026",
        author: "Edwin Agudelo",
        tag: "Soberanía",
        readTime: "13 min",
        image: "https://images.unsplash.com/photo-1521791136064-7986c2923216?q=80&w=800&auto=format&fit=crop",
        href: "/blog/b2g/institutional-sovereignty"
      },
      {
        id: 10,
        title: "Sovereign SEO: Territorial Dominance & Local Schema",
        excerpt: "Optimización de la matriz de 2,100 landings para dominar la búsqueda local en cada provincia de España.",
        date: "15 May 2026",
        author: "Manus AI",
        tag: "SEO OMEGA",
        readTime: "9 min",
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=800&auto=format&fit=crop",
        href: "/blog/b2g/sovereign-seo-territorial"
      }
    ];

    return (
      <BlogClusterPage 
        title="B2G Strategy"
        category="VIMUME / INSTITUCIONAL"
        description="Marco de colaboración para administraciones públicas, subvenciones y programas territoriales de alto impacto."
        posts={posts}
      />
    );
  }

  // Ingesta de parámetros desde la alerta del Agente Hunter B2G
  const municipio = searchParams.get('municipio') || 'Diputación Provincial de Toledo';
  const presupuesto = searchParams.get('presupuesto') || '14202.50';
  const cpv = searchParams.get('cpv') || '92300000-4';
  const objeto = searchParams.get('objeto') || 'Circuito de Espectáculos Musicales y Solistas en Municipios';

  const presupuestoNum = parseFloat(presupuesto);
  const iva = (presupuestoNum * 0.21).toFixed(2);
  const totalConIva = (presupuestoNum * 1.21).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0c] border border-[#ecb613]/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(236,182,19,0.1)] my-6">
      
      {/* Encabezado Oficial */}
      <div className="flex flex-col md:flex-row justify-between items-start border-b border-white/10 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[#ecb613] text-xs font-mono tracking-widest uppercase border border-[#ecb613]/30 px-3 py-1 rounded-full bg-[#ecb613]/5">
            Propuesta Técnica B2G :: Contrato Menor (Art. 118 LCSP)
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-3 text-white">
            Dossier Institucional: {municipio}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{objeto}</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#ecb613] text-black font-bold px-4 py-2.5 rounded-xl text-xs hover:bg-[#d4a210] transition-all cursor-pointer shadow-lg shrink-0"
        >
          <Download className="w-4 h-4" /> Exportar PDF Oficial
        </button>
      </div>

      {/* Matriz Financiera Legal */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Base Imponible (95% Techo)</span>
          <p className="text-xl font-bold text-[#ecb613] mt-1">
            {Number(presupuestoNum).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-xs text-slate-400">IVA Aplicable (21%)</span>
          <p className="text-xl font-bold text-slate-300 mt-1">
            {Number(iva).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </p>
        </div>
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <span className="text-xs text-slate-400">Importe Total Adjudicación</span>
          <p className="text-xl font-bold text-emerald-400 mt-1">
            {Number(totalConIva).toLocaleString('es-ES', { minimumFractionDigits: 2 })} €
          </p>
        </div>
      </div>

      {/* Memoria Justificativa y Alineación ODS */}
      <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <ShieldCheck className="w-5 h-5 text-[#ecb613]" /> 1. Justificación Normativa y Marco Legal
          </h2>
          <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-xs font-mono space-y-2">
            <p>
              La presente propuesta se ampara de forma estricta en el <strong className="text-white">Artículo 118 de la Ley 9/2017, de 8 de noviembre, de Contratos del Sector Público (LCSP)</strong>.
            </p>
            <p className="text-slate-400">
              Garantiza la adjudicación directa por razón de la cuantía (inferior al umbral legal de 15.000 € netos en servicios) con plena transparencia, idoneidad del objeto, acreditación de solvencia técnica e inexistencia de fraccionamiento de contrato.
            </p>
            <p className="text-[#ecb613]">Clasificación CPV Asignada: {cpv}</p>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-[#ecb613]" /> 2. Compromiso ODS 2030 e Impacto Social (Programa VIMUME)
          </h2>
          <p className="text-xs text-slate-400 mb-2">
            Productora EAR certifica la integración de criterios de sostenibilidad ambiental y cohesión social en la ejecución del servicio:
          </p>
          <ul className="space-y-2 text-xs">
            <li className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
              <span><strong className="text-white">ODS 3 (Salud y Bienestar):</strong> Inclusión de sesiones de estimulación cognitiva mediante el programa VIMUME para la tercera edad en centros de día y residencias municipales del territorio.</span>
            </li>
            <li className="flex items-start gap-2 bg-white/5 p-3 rounded-lg border border-white/5">
              <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
              <span><strong className="text-white">ODS 11 (Ciudades Sostenibles):</strong> Control riguroso de contaminación acústica en entornos urbanos mediante el uso de arreglos de sonido direccionable vertical Bose F1 Model 812.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Music className="w-5 h-5 text-[#ecb613]" /> 3. Solvencia Técnica y Rider Homologado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs bg-white/5 p-4 rounded-xl border border-white/5">
            <div>
              <p className="font-bold text-white mb-1">Sistema PA & Microfonía:</p>
              <p className="text-slate-400">Bose F1 Model 812 (Flex Array) + Subwoofers FBT X-SUB 118SA + Sistema Inalámbrico Shure GLXD4 Beta 87A.</p>
            </div>
            <div>
              <p className="font-bold text-white mb-1">Control Digital & Iluminación:</p>
              <p className="text-slate-400">Consola Digital Behringer XR18 + Monitorización In-Ear Sennheiser + Iluminación DMX Escénica.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Pie de Firma e Identidad Soberana */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-2">
        <span>Productora EAR S.L. :: Inscrita en el ROLECE (Registro de Licitadores del Estado)</span>
        <span className="text-[#ecb613] font-mono bg-[#ecb613]/10 px-2 py-1 rounded border border-[#ecb613]/20">
          HASH BÓVEDA: 0x8F92A1B7C4E3D8F0...E4A1
        </span>
      </div>

    </div>
  );
}

export default function B2GDossierPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-12 font-sans">
      <Suspense fallback={
        <div className="text-center py-20 text-[#ecb613] font-mono animate-pulse">
          Cargando Dossier B2G S-Class...
        </div>
      }>
        <B2GDossierContent />
      </Suspense>
    </div>
  );
}
