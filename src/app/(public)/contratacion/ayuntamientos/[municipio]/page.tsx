import React from 'react';
import { notFound } from 'next/navigation';
import { getCorredorData, getMunicipioBySlug } from '@/lib/services/municipal-pricing-engine';

interface PageProps {
  params: Promise<{ municipio: string }>;
}

export async function generateStaticParams() {
  try {
    const data = getCorredorData();
    return data.municipios.map((m) => ({ municipio: m.slug }));
  } catch {
    return [{ municipio: 'mentrida' }, { municipio: 'navalcarnero' }];
  }
}

export default async function AyuntamientoPage({ params }: PageProps) {
  const { municipio: slug } = await params;
  const data = getMunicipioBySlug(slug);

  if (!data) {
    notFound();
  }

  const corredor = getCorredorData();
  const iva = Math.round(data.tarifaBaseMenor * 0.21);
  const totalConIva = data.tarifaBaseMenor + iva;

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100 px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Cabecera Institucional */}
        <header className="border-b border-neutral-800 pb-6">
          <div className="inline-block bg-neutral-800 text-amber-400 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-3">
            Expediente Contrato Menor · LCSP (Ley 9/2017)
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Propuesta Institucional: Ayuntamiento de {data.nombre}
          </h1>
          <p className="text-neutral-400 mt-2 text-sm md:text-base">
            Corredor Estratégico {corredor.zona} · Producción Acústica Integral Directa
          </p>
        </header>

        {/* Bloque Doble Impacto */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-lg font-bold text-amber-300">1. Actuación Fiestas Patronales</h3>
            <p className="text-sm text-neutral-300 mt-2">
              Espacio prioritario: <span className="font-semibold text-white">{data.espacio}</span>.
            </p>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Espectáculo vocal de alta gama (Edwin Agudelo - Tenor Lírico) con repertorio popular institucional.
            </p>
            <div className="mt-4 text-xl font-bold text-white">
              {data.desglose.showPatronal.toLocaleString('es-ES')} € <span className="text-xs text-neutral-400 font-normal">+ IVA</span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-lg font-bold text-emerald-300">2. Programa Senior Vimume</h3>
            <p className="text-sm text-neutral-300 mt-2">
              Centro asignado: <span className="font-semibold text-white">{data.centroSenior}</span>.
            </p>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
              Sesión de musicoterapia activa y estimulación sensorial de la memoria para la tercera edad.
            </p>
            <div className="mt-4 text-xl font-bold text-white">
              {data.desglose.programaVimume.toLocaleString('es-ES')} € <span className="text-xs text-neutral-400 font-normal">+ IVA</span>
            </div>
          </div>
        </section>

        {/* Desglose Económico y Rider */}
        <section className="bg-neutral-900/80 border border-neutral-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-white">Rider Técnico Autónomo Integrado (Ahorro Consistorio)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-neutral-300">
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="font-bold text-white block">P.A. Principal:</span> {corredor.riderTecnico.pa}
            </div>
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="font-bold text-white block">Mesa Digital:</span> {corredor.riderTecnico.mesa}
            </div>
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="font-bold text-white block">Microfonía:</span> {corredor.riderTecnico.microfonia}
            </div>
          </div>
          <p className="text-xs text-neutral-400 italic">
            * {corredor.riderTecnico.ventajaLogistica} ({data.justificacion})
          </p>

          <div className="border-t border-neutral-800 pt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wider block">Presupuesto Cerrado Adjudicación Menor</span>
              <div className="text-3xl font-extrabold text-amber-400">
                {data.tarifaBaseMenor.toLocaleString('es-ES')} € <span className="text-sm text-neutral-400 font-medium">+ 21% IVA ({totalConIva.toLocaleString('es-ES')} € Total)</span>
              </div>
            </div>

            <a
              href="tel:+34693693048"
              className="inline-flex items-center justify-center bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-6 py-3 rounded-lg transition-colors text-sm"
            >
              Contactar Dirección Artística (+34 693 693 048)
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
