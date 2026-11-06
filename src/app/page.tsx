import { SovereignHomeHeroNodes } from '@/components/home/SovereignHomeHeroNodes';
import { FreeViabilityScanner } from '@/components/scanner/FreeViabilityScanner';
import { HeroWeddingCinematic } from '@/components/home/HeroWeddingCinematic';
import { HomeNeuralConstellationSection } from '@/components/home/HomeNeuralConstellationSection';
import { LumenBentoGrid } from '@/components/lumen/LumenBentoGrid';
import { LumenNoiseGrain } from '@/components/lumen/LumenNoiseGrain';
import { SovereignHomeClosingSection } from '@/components/home/SovereignHomeClosingSection';

export default function Home() {
  return (
    <main className="bg-[#030305] relative w-full max-w-full min-h-screen overflow-x-hidden text-zinc-100 font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Textura de Grano de Ruido SVG Acelerada por GPU */}
      <LumenNoiseGrain />

      {/* ACTO 1: EL NÚCLEO CINEMÁTICO & EL VIAJE DEL CLIENTE (Vigil WebGL) */}
      <section className="relative pt-24 sm:pt-28">
        <SovereignHomeHeroNodes />
      </section>

      {/* ACTO 2: EL DIAGNÓSTICO EN TIEMPO REAL (Escáner de Viabilidad en 60s) */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <FreeViabilityScanner />
      </section>

      {/* ACTO 3: LA EVIDENCIA ARTÍSTICA & HUMANA (Edwin Agudelo Voz en Directo & Sonido Bose) */}
      <section className="relative">
        <HeroWeddingCinematic />
      </section>

      {/* ACTO 4: LA ARQUITECTURA SOBERANA (Constelación 3D del Diamante & Command Deck) */}
      <section className="relative">
        <HomeNeuralConstellationSection />
      </section>

      {/* ACTO 5: LOS CUATRO CERROJOS OPERATIVOS (Bento Grid SSOT) */}
      <section className="relative">
        <LumenBentoGrid />
      </section>

      {/* ACTO 6: CIERRE BIFURCADO & ASISTENCIA DIRECTA S-CLASS */}
      <SovereignHomeClosingSection />
    </main>
  );
}
