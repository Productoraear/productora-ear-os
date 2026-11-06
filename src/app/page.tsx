import Link from 'next/link';
import { ArrowRight, ShieldCheck, Music2, Sparkles } from 'lucide-react';
import { HeroWeddingCinematic } from '@/components/home/HeroWeddingCinematic';
import { CENTRALITA_EAR_OS, TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';
import { HomeNeuralConstellationSection } from '@/components/home/HomeNeuralConstellationSection';
import { SovereignHomeHeroNodes } from '@/components/home/SovereignHomeHeroNodes';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import { LumenBentoGrid } from '@/components/lumen/LumenBentoGrid';
import { FreeViabilityScanner } from '@/components/scanner/FreeViabilityScanner';

export default function Home() {
  return (
    <main className="bg-[#030305] relative w-full max-w-full min-h-screen overflow-x-hidden text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Textura de Grano de Ruido SVG Acelerada por GPU */}
      <LumenNoiseGrain />

      {/* 1. NÚCLEO SUPREMO: Logo EAR OS Receptor + Nodos de Viaje del Cliente (Vigil WebGL) */}
      <div className="relative pt-24 sm:pt-28">
        <SovereignHomeHeroNodes />
      </div>

      {/* 2. Constelación de Nodos Interactiva 3D con Telemetría Integrada (Bento HorizonX) */}
      <div className="relative">
        <HomeNeuralConstellationSection />
      </div>

      {/* 3. Escáner de Viabilidad & Presupuesto en 60 Segundos (Lead Magnet BeeDigital S-Class) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <FreeViabilityScanner />
      </section>

      {/* 4. Bento Grid de Arquitectura Operativa y SSOT (HorizonX Cards) */}
      <div className="relative">
        <LumenBentoGrid />
      </div>

      {/* 5. Hero de Alta Conversión */}
      <div className="relative">
        <HeroWeddingCinematic />
      </div>

      {/* BLOQUE DE CONFIANZA EDITORIAL S-CLASS: 3 PILARES QUE CIERRAN VENTAS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 border-t border-zinc-200/50 dark:border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Pilar 1: Edwin Agudelo Tenor */}
          <div className="p-6 rounded-3xl border bg-zinc-950/60 border-white/10 transition-all hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
              <Music2 size={20} />
            </div>
            <h3 className="text-[16px] font-bold font-syne mb-2 text-white">Edwin Agudelo · Tenor Insignia</h3>
            <p className="text-[13px] text-zinc-400 font-montserrat leading-relaxed mb-4">
              Voz solista educada en lírica y mariachi de gala. Tarifa base oficial de <strong>{TARIFA_BASE_SOLISTA_EUR} €</strong> sin costes ocultos ni comisiones de agencia.
            </p>
            <Link
              href="/reservar/solista"
              className="text-[12px] font-mono font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Ver Repertorio y Reserva</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pilar 2: Blindaje Acústico Ley 37/2003 */}
          <div className="p-6 rounded-3xl border bg-zinc-950/60 border-white/10 transition-all hover:border-cyan-400/50">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-[16px] font-bold font-syne mb-2 text-white">Ingeniería Acústica &lt; 75 dB</h3>
            <p className="text-[13px] text-zinc-400 font-montserrat leading-relaxed mb-4">
              Protección legal homologada para fincas, salones y espacios al aire libre. Sonido Bose nítido a cualquier volumen sin riesgo de sanción policial.
            </p>
            <Link
              href="/fincas/portal-demostrativo"
              className="text-[12px] font-mono font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Homologación de Fincas</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Pilar 3: Garantía Stripe Price-Lock */}
          <div className="p-6 rounded-3xl border bg-zinc-950/60 border-white/10 transition-all hover:border-amber-400/50">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
              <Sparkles size={20} />
            </div>
            <h3 className="text-[16px] font-bold font-syne mb-2 text-white">Bloqueo con {DEPOSITO_STRIPE_EUR} € Deducible</h3>
            <p className="text-[13px] text-zinc-400 font-montserrat leading-relaxed mb-4">
              Fianza segura con cifrado SHA-256 que bloquea tu fecha y hora en el calendario exclusivo del artista. Se resta íntegra del total de tu evento.
            </p>
            <Link
              href="/reservar/solista"
              className="text-[12px] font-mono font-bold text-amber-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Verificación SHA-256</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
