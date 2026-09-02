import React from 'react';
import { Sparkles, GraduationCap, DollarSign, Waves, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: "Academia Boreas | Productora EAR",
  description: "Monetización integral, Subvenciones, EPKs y Riders de alta calidad para artistas de conservatorio."
};

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="p-8 border border-white/10 rounded-2xl bg-white/5 space-y-4 hover:border-amber-500/40 transition-colors">
      <div className="text-amber-400 w-8 h-8">{icon}</div>
      <h3 className="text-lg font-bold font-serif uppercase tracking-wider text-white">{title}</h3>
      <p className="text-sm text-zinc-400 font-mono leading-relaxed">{text}</p>
    </div>
  );
}

export default function BoreasPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-6 sm:p-12 flex flex-col items-center pt-24">
      <nav className="w-full max-w-6xl flex justify-between items-center mb-16 px-4">
        <Link href="/" className="flex items-center space-x-2 text-xs font-bold tracking-widest text-zinc-400 hover:text-amber-400 transition-colors uppercase font-mono">
          <ChevronLeft size={16} />
          <span>Volver al Diamante</span>
        </Link>
        <div className="flex items-center space-x-2">
          <Sparkles size={16} className="text-amber-400" />
          <span className="text-[10px] tracking-[0.4em] uppercase font-mono text-zinc-500">
            Nivel: Artista / Academia / E-Manager
          </span>
        </div>
      </nav>

      <div className="w-full max-w-6xl space-y-16">
        <header className="space-y-4">
          <span className="text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
            EAR Studio & Formación
          </span>
          <h1 className="text-4xl sm:text-6xl font-black uppercase font-serif tracking-tight">
            ACADEMIA <span className="text-amber-400">BOREAS</span>
          </h1>
          <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-mono leading-relaxed">
            La monetización integral de tu carrera artística. Aprende con nuestra metodología validada de E-Manager y soberanía musical.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard icon={<GraduationCap />} title="Academia Elite" text="Cursos de producción, industria y gestión de carrera sin intermediarios." />
          <FeatureCard icon={<DollarSign />} title="Monetización" text="Gestión de Subvenciones, EPKs y Riders técnicos de alta calidad." />
          <FeatureCard icon={<Waves />} title="Soberanía Creativa" text="Tus activos de audio y masterización protegidos. Tu legado es tuyo." />
        </section>
      </div>
    </main>
  );
}
