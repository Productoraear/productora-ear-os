import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
    MARIACHI_LANDINGS,
    MARIACHI_ACCENT_HEX,
} from '@/lib/mariachi/mariachiLandingCatalog';

/**
 * Directorio servidor de intenciones mariachi (pSEO).
 * Enlaza cada sub-landing transaccional desde la página hub `/mariachis`.
 * Sin datos ficticios: solo título H1 y etiqueta descriptiva del catálogo.
 */
export default function MariachiLandingDirectory() {
    return (
        <div id="ocasiones" className="space-y-8">
            <div className="text-center max-w-3xl mx-auto space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono uppercase tracking-[0.25em]">
                    <ArrowUpRight size={14} />
                    OCASIONES & INTENCIONES DE BÚSQUEDA
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-syne uppercase text-white tracking-tight">
                    Elige tu momento
                </h2>
                <p className="text-sm sm:text-base text-white/60 font-sans">
                    Cada ocasión tiene su propia guía de contratación, su formación recomendada y su presupuesto cerrado.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {MARIACHI_LANDINGS.map((landing) => {
                    const accent = MARIACHI_ACCENT_HEX[landing.accent];
                    return (
                        <Link
                            key={landing.slug}
                            href={`/mariachis/${landing.slug}`}
                            className="group p-6 rounded-3xl bg-[#060609] border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between gap-6"
                        >
                            <div className="space-y-2">
                                <span
                                    className="text-[10px] font-mono uppercase tracking-widest"
                                    style={{ color: accent }}
                                >
                                    {landing.navLabel}
                                </span>
                                <h3 className="text-xl font-bold font-syne text-white group-hover:text-[#ecb613] transition-colors">
                                    {landing.h1}
                                </h3>
                                <p className="text-xs text-white/50 font-sans leading-relaxed line-clamp-3">
                                    {landing.heroSubheadline}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/60 group-hover:text-white transition-colors">
                                Ver guía y reservar
                                <ArrowUpRight size={13} style={{ color: accent }} />
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}