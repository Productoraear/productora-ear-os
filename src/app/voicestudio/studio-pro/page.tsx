import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import DawWorkspace from "@/components/voicestudio/DawWorkspace";
import DistributionRadar from "@/components/voicestudio/DistributionRadar";

export const metadata: Metadata = {
  title: "EAR OS Studio Pro — DAW Soberano, Agregadora DDEX y Radar Omnicanal",
  description:
    "Mesa de producción musical soberana con 4 stems (Lead Vocal, Percusión, Bajo, Armonía), masterización AES TD1004 a -14 LUFS, generación de ISRC/UPC y tracking omnicanal de streams.",
};

export default function StudioProPage() {
  return (
    <main className="w-full overflow-x-hidden bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black min-h-screen py-24 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          href="/voice-studio"
          className="inline-flex items-center gap-2 text-xs font-mono text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Volver a Voice Studio
        </Link>

        {/* Cabecera de la suite */}
        <section className="py-6">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[#ecb613]">
            <Sparkles size={12} />
            VoiceStudio Suno-Killer
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mt-3 max-w-4xl">
            Estudio Pro Soberano
          </h1>
          <p className="text-zinc-400 max-w-2xl mt-4 leading-relaxed">
            Produce con 4 stems aislados, masteriza a -14 LUFS (AES TD1004), emite ISRC y UPC
            oficiales, distribuye DDEX a DSPs y rastrea tus métricas virales en tiempo real —
            sin pagar herramientas de terceros.
          </p>
        </section>

        <DawWorkspace />
        <DistributionRadar />
      </div>
    </main>
  );
}