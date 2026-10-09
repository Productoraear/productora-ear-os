import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import EspacioEditorSClass from '@/features/espacio/ui/EspacioEditorSClass';

export const metadata: Metadata = {
    title: 'Tu Espacio · Panel de Edición Individual',
    description:
        'Edita tu espacio individual verificable: identidad, localización, servicios, galería y apariencia. Acceso sellado con doble verificación Google · Apple · Meta · Correo + WhatsApp 2FA.'
};

export default function EspacioPage() {
    return (
        <main className="min-h-screen bg-[#060507] text-white pt-24 pb-20 px-4 md:px-8 font-sans selection:bg-[#ecb613]/30 overflow-x-hidden">
            {/* Iluminación ambiental dorada */}
            <div className="pointer-events-none fixed inset-0 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-radial from-[#ecb613]/12 via-transparent to-transparent blur-[160px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                {/* Cabecera */}
                <header className="space-y-5">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-xs font-mono font-black uppercase tracking-widest text-white/50 hover:text-[#ecb613] transition-colors"
                    >
                        <ArrowLeft size={14} /> Inicio
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="h-px w-12 bg-gradient-to-r from-[#ecb613] to-transparent" />
                        <span className="text-[11px] font-mono font-black uppercase tracking-[0.35em] text-[#ecb613]">
                            Espacio Individual · Panel de Edición
                        </span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-3">
                            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black uppercase tracking-tight text-white font-syne leading-[0.92]">
                                Tu{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#f5d77f] to-[#ecb613]">
                                    Espacio
                                </span>{' '}
                                Pro
                            </h1>
                            <p className="text-white/70 text-sm sm:text-base max-w-2xl leading-relaxed">
                                Gestiona tu ficha individual verificable. Identidad, localización, servicios, galería y apariencia
                                con persistencia real en PostgreSQL y sincronización de telemetría en background.
                            </p>
                        </div>

                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-black uppercase tracking-widest">
                            <Sparkles size={13} /> Motor S-Class
                        </div>
                    </div>
                </header>

                {/* Editor operativo */}
                <EspacioEditorSClass />

                {/* Nota de utilidad */}
                <p className="text-center text-[11px] font-mono text-white/30 tracking-widest uppercase">
                    Guardado real en base de datos · Doble verificación WhatsApp · Vista previa en vivo
                </p>
            </div>
        </main>
    );
}