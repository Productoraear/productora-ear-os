'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Crown, Star, ShieldCheck, ArrowRight, Music, Volume2, 
  CheckCircle2, Sparkles, Download, Phone, Award, Zap
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEventCart } from '@/context/EventCartContext';
import { CENTRALITA } from '@/lib/phone-constants';

export const EdwinDossierHero: React.FC = () => {
  const { addToCart } = useEventCart();
  const router = useRouter();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const handleInjectBooking = (formatName: string, price: number) => {
    addToCart({
      slug: 'edwin-agudelo',
      rawName: `Edwin Agudelo — ${formatName}`,
      category: 'Artista S-Class // Paciente Cero',
      itemType: 'ARTIST_DIRECT',
      estimatedPrice: price,
      technicalWatts: 1500,
    });
    router.push('/cotizador');
  };

  return (
    <section className="bg-gradient-to-b from-[#141418] via-[#0d0d12] to-[#08080a] border border-[#ecb613]/40 rounded-[2.5rem] p-6 sm:p-12 shadow-[0_0_80px_rgba(236,182,19,0.15)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/10 blur-[140px] pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* COLUMNA IZQUIERDA: INFORMACIÓN Y DOSSIER */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 rounded-full bg-[#ecb613] text-black text-[9px] font-black uppercase tracking-widest font-mono flex items-center gap-1.5 shadow-lg shadow-[#ecb613]/20">
              <Crown size={12} /> PACIENTE CERO // ARTISTA INSIGNIA EAR OS
            </span>
            <span className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/80 text-[9px] font-mono">
              37+ Conciertos Internacionales
            </span>
            <span className="px-3.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold">
              ★ 5.0 / 5 (350+ Reseñas Verificadas)
            </span>
          </div>

          <div>
            <h2 className="text-4xl sm:text-6xl font-black uppercase italic tracking-tight text-white font-syne leading-[0.95]">
              Edwin Agudelo
            </h2>
            <p className="text-[#ecb613] font-mono text-xs sm:text-sm uppercase tracking-wider mt-1 font-bold">
              Tenor Lírico & Mariachi Imperial de Gran Gala
            </p>
          </div>

          <p className="text-white/70 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            La vanguardia en Mariachi y música lírica en España. Calibración acústica de alta gama con sistemas Bose F1 & microfonía Shure Axient Digital, repertorio de autor y garantía de solvencia logística en todo el territorio nacional bajo contrato mercantil homologado.
          </p>

          {/* MUESTRA DE AUDIO & FORMATOS */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-2xl">
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="w-10 h-10 rounded-xl bg-[#ecb613] hover:bg-[#d4a210] text-black flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-lg"
              >
                <Volume2 className="w-5 h-5" />
              </button>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">
                  {isPlayingAudio ? '▶ Reproduciendo Muestra Acústica Hi-Fi' : 'Muestra de Voz en Vivo (Tenor Lírico)'}
                </span>
                <span className="text-xs text-white font-mono truncate block">
                  Repertorio Gala: "Granada" & "El Rey" (Calibración Bose 12 W/pax)
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { name: 'Solista & Piano Acústico', price: 650 },
                { name: 'Cuarteto Imperial de Gala', price: 950 },
                { name: 'Quinteto de Honor', price: 1250 },
                { name: 'Cantando a Caballo (Ecuestre)', price: 5500 }
              ].map((f, i) => (
                <button
                  key={i}
                  onClick={() => handleInjectBooking(f.name, f.price)}
                  className="px-3 py-1.5 bg-white/5 hover:bg-[#ecb613]/20 hover:border-[#ecb613] border border-white/10 rounded-xl text-[10px] text-zinc-300 font-mono transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{f.name}</span>
                  <strong className="text-[#ecb613]">Desde {f.price}€</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => handleInjectBooking('Mariachi Imperial', 950)}
              className="px-8 py-4 bg-[#ecb613] hover:bg-[#d4a210] text-black font-black text-xs uppercase tracking-widest rounded-2xl transition-all text-center flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 cursor-pointer min-h-[48px]"
            >
              <span>+ Cotizar y Bloquear Fecha</span>
              <ArrowRight size={16} />
            </button>

            <Link
              href="/artistas/edwin-agudelo"
              className="px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-widest rounded-2xl transition-all text-center flex items-center justify-center gap-2 border border-white/10 min-h-[48px]"
            >
              <Download size={14} /> Ver Dossier Técnico & Rider
            </Link>
          </div>
        </div>

        {/* COLUMNA DERECHA: TARIFARIO & GARANTÍAS */}
        <div className="lg:col-span-4 bg-[#0a0a0e] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#ecb613] font-bold block">Tarifa Oficial S-Class</span>
            <div className="text-4xl font-black font-mono text-white mt-1">Desde 650 €</div>
            <p className="text-[11px] text-zinc-400 font-light mt-1">Depósito de reserva protegido con garantía Escrow.</p>
          </div>

          <div className="space-y-3 text-xs font-mono text-zinc-300 border-t border-b border-white/5 py-4">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Rider Técnico:</span>
              <span className="text-white font-bold">Bose F1 + Shure Axient</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">SLA de Montaje:</span>
              <span className="text-emerald-400 font-bold">T-120 min de Ensayo</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Póliza de Responsabilidad:</span>
              <span className="text-white font-bold">1.000.000 € (RC)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Régimen Contractual:</span>
              <span className="text-[#ecb613] font-bold">Mercantil / Factura Oficial</span>
            </div>
          </div>

          <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-2xl space-y-1">
            <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase block">Garantía EAR OS</span>
            <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
              Si el artista sufriera fuerza mayor, EAR OS provee reemplazo de igual o superior rango sin sobrecoste.
            </p>
          </div>

          <a
            href={CENTRALITA.tel}
            className="w-full py-3 bg-white/5 hover:bg-white/10 text-white font-mono text-xs font-bold uppercase rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2 block text-center"
          >
            <Phone size={14} className="text-[#ecb613]" /> Centralita Directa: {CENTRALITA.display}
          </a>
        </div>

      </div>
    </section>
  );
};

export default EdwinDossierHero;
