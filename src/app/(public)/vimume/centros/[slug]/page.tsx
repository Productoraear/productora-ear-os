import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Brain, Stethoscope, Activity, ShieldCheck, ArrowRight, Phone } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const name = resolved.slug.replace(/-/g, ' ').toUpperCase();
  return {
    title: `Programa Clínico VIMUME // Centro ${name}`,
    description: `Protocolo de estimulación acústica 40 Hz Gamma para residentes y centros de día en ${name}. Retorno social y reducción del 38.2% en agitación.`,
  };
}

export default async function CentroSlugPage({ params }: Props) {
  const resolved = await params;
  const centerName = resolved.slug.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-28 pb-32 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
          <Brain size={14} />
          <span>VIMUME // CENTRO HOMOLOGADO SENIOR</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white">
          Programa Clínico en {centerName}
        </h1>

        <p className="text-zinc-300 text-base max-w-2xl font-light">
          Protocolo de neuro-musicoterapia para mayores con deterioro cognitivo. Financiación directa vía mecenazgo Ley 49/2002 con deducción de hasta el 80% en IRPF.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-cyan-400 block text-lg font-bold">40 Hz Gamma</span>
            <span className="text-zinc-400">Estimulación síncrona</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-emerald-400 block text-lg font-bold">-38.2%</span>
            <span className="text-zinc-400">Desescalada agitación</span>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[#ecb613] block text-lg font-bold">SROI 4.85x</span>
            <span className="text-zinc-400">Retorno social auditado</span>
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <a
            href="tel:+34693693048"
            className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs uppercase flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Consultar con Dirección Médica</span>
          </a>
          <Link
            href="/vimume"
            className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold font-mono text-xs uppercase"
          >
            Ver Portal VIMUME
          </Link>
        </div>
      </div>
    </div>
  );
}
