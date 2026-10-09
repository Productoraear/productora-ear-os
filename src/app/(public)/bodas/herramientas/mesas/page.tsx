import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import MesaMaestroSClass from '@/features/bodas/ui/MesaMaestroSClass';

export const metadata: Metadata = {
    title: 'Gestión de Mesas · Herramientas de Boda',
    description:
        'Centro de mando avanzado para la gestión de mesas e invitados: plano visual, arrastrar y soltar, auto-asignación inteligente por grupos y exportación a PDF.'
};

export default function MesasHerramientaPage() {
    return (
        <main className="min-h-screen bg-[#060507] text-white pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30 overflow-x-hidden">
            {/* Iluminación ambiental dorada */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-radial from-[#ecb613]/12 via-transparent to-transparent blur-[160px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                {/* Cabecera de herramienta */}
                <header className="space-y-5">
                    <Link
                        href="/bodas"
                        className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-white/50 hover:text-[#ecb613] transition-colors"
                    >
                        <ArrowLeft size={14} /> Bodas
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="h-px w-12 bg-gradient-to-r from-[#ecb613] to-transparent" />
                        <span className="text-[11px] font-mono font-black uppercase tracking-[0.35em] text-[#ecb613]">
                            Herramientas · Mesas
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.92]">
                                Gestión de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f5d77f] to-[#ecb613]">
                                    Mesas Pro
                                </span>
                            </h1>
                            <p className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed">
                                Plano visual de mesas con arrastrar y soltar, auto-asignación inteligente que mantiene unidos a los
                                grupos, detección de sobrecapacidad y exportación lista para imprenta.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
                            <Sparkles size={13} /> Motor S-Class
                        </div>
                    </div>
                </header>

                {/* Herramienta operativa */}
                <MesaMaestroSClass />

                {/* Nota de utilidad */}
                <p className="text-center text-[11px] font-mono text-white/30 tracking-widest uppercase">
                    Persistencia local automática · Auto-sentar por grupos · PDF con plano y lista
                </p>
            </div>
        </main>
    );
}