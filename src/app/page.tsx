import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';
import CinematicHeroSClass from '@/components/sclass/CinematicHeroSClass';

export default function Home() {
  return (
    <main className="relative w-full max-w-full min-h-screen overflow-x-hidden bg-[#030305] text-white font-sans selection:bg-[#ecb613] selection:text-black">
      {/* Header Comercial S-Class: logo, teléfono y CTA dorado */}
      <header className="fixed top-0 left-0 right-0 z-40 p-4 md:p-6 flex items-center justify-between gap-3">
        {/* Identidad de marca oficial */}
        <Link
          href="/"
          className="pointer-events-auto flex items-center gap-2.5 bg-black/70 backdrop-blur-xl border border-white/10 px-3.5 py-1.5 rounded-full shadow-lg transition-all hover:border-[#ecb613]/40"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-[#ecb613]/70 shadow-[0_0_12px_rgba(236,182,19,0.45)] shrink-0 bg-black">
            <img
              src="/images/brand/ear_logo_official_diamond.png"
              alt="Productora EAR Logotipo Oficial"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs tracking-tight text-white font-mono">PRODUCTORA</span>
            <span className="font-bold text-xs tracking-tight text-[#ecb613] font-mono">EAR</span>
          </div>
        </Link>

        {/* Contacto directo y botón de conversión */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          <a
            href="tel:+34693693048"
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 hover:bg-white/10 backdrop-blur-xl border border-white/15 text-xs font-mono transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <Phone size={13} className="text-[#ecb613]" />
            <span className="hidden sm:inline text-zinc-200">+34 693 693 048</span>
          </a>

          <Link
            href="/calculadora"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#ecb613] hover:bg-amber-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)] hover:scale-105 cursor-pointer font-mono"
          >
            <ArrowRight size={13} className="text-black" />
            <span>Cotizar en 1 Clic</span>
          </Link>
        </div>
      </header>

      {/* Vista principal limpia, elegante y comercial */}
      <div className="relative min-h-screen pt-20 md:pt-24 pb-12 flex flex-col justify-between">
        <CinematicHeroSClass />
      </div>
    </main>
  );
}