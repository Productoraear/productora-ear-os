import type { Metadata } from 'next';
import { FreeViabilityScanner } from '@/components/scanner/FreeViabilityScanner';
import { Sparkles, ShieldCheck, Star } from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
  title: 'Escáner Gratuito de Viabilidad Acústica & Presupuesto | Productora EAR',
  description:
    'Comprueba en 60 segundos la presión sonora legal (Ley 37/2003), potencia W/pax y presupuesto real para tu evento, boda o gala sin comisiones de agencia.',
};

export default function EscanerGratisPage() {
  return (
    <main className="min-h-screen bg-[#030305] text-zinc-100 font-sans pt-24 pb-20 px-4 sm:px-6 selection:bg-[#ecb613] selection:text-black">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Encabezado Principal */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[11px] font-mono uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Auditoría Pre-Contratación · 0 € Sin Compromiso</span>
          </div>

          <h1 className="text-[20px] font-bold font-syne text-white tracking-tight mb-2 leading-snug">
            Escáner Gratuito de Viabilidad & Presupuesto en 60 Segundos
          </h1>

          <p className="text-[13px] text-zinc-400 font-montserrat leading-relaxed">
            Verifica al instante el límite de decibelios legal según la Ley 37/2003 del Ruido, potencia recomendada y desglose exacto de honorarios en céntimos enteros.
          </p>
        </div>

        {/* Componente del Escáner */}
        <FreeViabilityScanner />

        {/* Bloque de Confianza y Soporte */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-5 rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md">
            <div className="flex items-center gap-2.5 mb-2 text-amber-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-[14px] font-bold font-syne text-white">Suelo Inviolable Solista</h3>
            </div>
            <p className="text-[12px] text-zinc-400 font-montserrat leading-relaxed">
              Edwin Agudelo asegura un caché base de 350,00 € con split 80% artista, 10% infraestructura y 10% VIMUME.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md">
            <div className="flex items-center gap-2.5 mb-2 text-cyan-400">
              <Star className="w-5 h-5 fill-cyan-400" />
              <h3 className="text-[14px] font-bold font-syne text-white">Garantía Acústica 100%</h3>
            </div>
            <p className="text-[12px] text-zinc-400 font-montserrat leading-relaxed">
              Equipos de sonido homologados con limitador telemático para evitar sanciones o cortes intempestivos de música a las 2:00 AM.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-white/10 bg-zinc-950/60 backdrop-blur-md">
            <div className="flex items-center gap-2.5 mb-2 text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-[14px] font-bold font-syne text-white">Asistencia Centralita</h3>
            </div>
            <p className="text-[12px] text-zinc-400 font-montserrat leading-relaxed">
              Llámanos directamente al <strong className="text-white">{CENTRALITA_EAR_OS}</strong> si necesitas un rider especial o asesoría a medida.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

