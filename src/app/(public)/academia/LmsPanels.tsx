"use client";

import dynamic from 'next/dynamic';
import { GraduationCap, Sparkles } from 'lucide-react';
import type { ComponentType } from 'react';

/**
 * Wrappers client-only para los motores LMS de la Academia S-Class.
 * `ssr: false` solo es legal dentro de un Client Component.
 */

const AcademyPanel = dynamic(
    () => import('@/modules/SClassScreens/panels/AcademyPanel').then((mod) => mod.AcademyPanel),
    {
        ssr: false,
        loading: () => (
            <div className="h-96 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex flex-col items-center justify-center animate-pulse">
                <GraduationCap className="w-12 h-12 text-[#ecb613] mb-4 opacity-50" />
                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                    Cargando Campus LMS S-Class...
                </span>
            </div>
        ),
    }
);

const AstraNeuralTwinPanel = dynamic(
    () =>
        import('@/modules/SClassScreens/panels/AstraNeuralTwinPanel').then(
            (mod) => mod.AstraNeuralTwinPanel
        ),
    {
        ssr: false,
        loading: () => (
            <div className="h-80 bg-[#0a0a0c] border border-[#ecb613]/20 rounded-3xl p-8 flex flex-col items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-[#ecb613] mb-4 opacity-50" />
                <span className="text-slate-400 font-mono text-xs uppercase tracking-widest">
                    Sincronizando Astra OS: Neural Strategic Engine...
                </span>
            </div>
        ),
    }
);

export const AcademyPanelClient: ComponentType = AcademyPanel;
export const AstraNeuralTwinPanelClient: ComponentType = AstraNeuralTwinPanel;