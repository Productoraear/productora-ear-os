import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, ShieldCheck, HeartHandshake, Phone, ArrowRight, Building, Activity, Headphones } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export const metadata: Metadata = {
  title: 'Proveedores Silver Economy & Co-Branding | Fundación VIMUME',
  description: 'Marketplace homologado de productos y servicios para la tercera edad. Alianzas de patrocinio de kits neuroacústicos y co-branding ético.',
};

export default function VimumeProveedoresSeniorPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-[#f5f1e8] pt-28 pb-20 px-4 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono tracking-widest uppercase">
          <HeartHandshake size={14} />
          <span>VIMUME // SILVER ECONOMY PARTNERSHIP</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.95]">
          Ecosistema Silver Economy &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">
            Patrocinio de Dispositivos Senior
          </span>
        </h1>
        <p className="text-white/70 text-sm md:text-base max-w-3xl leading-relaxed">
          Unimos empresas de audioprótesis, domótica adaptativa, ortopedia y bienestar senior con la red de residencias de VIMUME mediante kits neuroacústicos homologados y reportes de retorno social SROI.
        </p>
      </div>

      {/* Grid de Modalidades de Partner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-[#ecb613]/20 text-[#ecb613] rounded-xl w-fit mb-4">
            <Headphones size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Donación Tecnológica en Especie</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Apadrina sesiones con auriculares cerrados de alta fidelidad o tablets con sello "Powered by [Tu Marca]".
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl w-fit mb-4">
            <Activity size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Homologación y Validación Clínica</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Integra tus dispositivos de salud en los protocolos de medición cognitiva y bienestar emocional de VIMUME.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-4">
            <Building size={24} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Tier Adopta un Centro (3k-5k€)</h3>
          <p className="text-white/60 text-xs leading-relaxed">
            Financia 3 meses de terapia en una residencia local con vídeo-documental dedicado para la memoria ESG corporativa.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-black p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">¿Representas a una empresa del sector Senior?</h2>
          <p className="text-white/60 text-xs">Agendamos una reunión de impacto para evaluar sinergias de co-branding y apadrinamiento.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/vimume/inversion"
            className="px-6 py-3 bg-[#ecb613] text-black text-xs font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-2"
          >
            <span>Ver Tiers de Patrocinio</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={CENTRALITA.whatsapp}
            className="px-6 py-3 border border-white/20 text-white text-xs font-mono uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Phone size={14} />
            <span>Contacto Directo</span>
          </a>
        </div>
      </div>
    </main>
  );
}
