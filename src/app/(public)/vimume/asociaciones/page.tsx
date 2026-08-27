import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Users, ShieldCheck, Phone, ArrowRight, Building2, Sparkles } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Alianzas con AFAs y Fundaciones | VIMUME',
  description: 'Programas conjuntos de estimulación cognitiva neuroacústica para asociaciones de familiares de Alzheimer y fundaciones de salud en toda España.',
};

export default function VimumeAsociacionesPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-[10px] font-mono tracking-widest uppercase">
          <Heart size={14} />
          <span>VIMUME // ALIANZAS AFAS &amp; FUNDACIONES</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
          Alianzas con AFAs &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-300 to-[#ecb613]">
            Entidades de Alzheimer
          </span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed">
          Colaboramos con Asociaciones de Familiares de Personas con Alzheimer y otras Demencias (AFAs) y fundaciones para llevar talleres neuroacústicos sin coste para el usuario final gracias al mecenazgo cruzado y al Split Soberano de Productora EAR.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
            <Users size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Talleres Grupales Apadrinados</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Sesiones de reminiscencia y canciones de memoria para grupos reducidos de socios de la AFA.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-[#ecb613]/20 text-[#ecb613] rounded-xl w-fit mb-4">
            <Sparkles size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Mapeo de Bandas Sonoras</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Herramientas gratuitas para que los terapeutas y familias de la asociación registren su historia musical.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-green-500/20 text-green-400 rounded-xl w-fit mb-4">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Convenios Interinstitucionales</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Acuerdos marco de colaboración para optar conjuntamente a convocatorias públicas del 0,7% IRPF.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-pink-950/40 via-neutral-900 to-black p-8 rounded-3xl border border-pink-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">¿Perteneces a una AFA o Fundación?</h2>
          <p className="text-white/60 text-xs">Solicita información sobre el programa de talleres apadrinados para tu entidad.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vimume/contacto"
            className="px-6 py-3 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <span>Solicitar Taller para la AFA</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={CENTRALITA.whatsapp}
            className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Centralita Solidaria</span>
          </a>
        </div>
      </div>
    </main>
  );
}
