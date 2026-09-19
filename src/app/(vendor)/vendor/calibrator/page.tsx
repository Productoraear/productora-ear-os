import React from 'react';
import { Metadata } from 'next';
import ProviderCalibrator from '@/components/vendor/ProviderCalibrator';

export const metadata: Metadata = {
    title: 'Calibrador de Captación | EAR OS Vendor',
    description: 'Auto-gestión de tu calibrador de 100 dimensiones. Solo te llegarán leads cualificados.'
};

const DEMO_PROVIDER_ID = 'prov-demo-cortijo-01';
const DEMO_PROVIDER_NAME = 'Finca La Rosa · Cortijo Rural';

export default function VendorCalibratorPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="border-b border-white/10 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase mb-3">
                    🎛️ Motor Neural Bilateral
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
                    Tu Calibrador de Captación
                </h1>
                <p className="text-sm text-zinc-400 font-light mt-2 max-w-2xl">
                    Define el tipo de boda que quieres recibir. El motor cruzará tus 100 dimensiones con las
                    100 de cada pareja y solo te mostrará contactos con encaje real.
                </p>
            </header>

            <ProviderCalibrator
                providerId={DEMO_PROVIDER_ID}
                providerName={DEMO_PROVIDER_NAME}
                adminMode={false}
            />

            {/* Nota de gobernanza */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-[11px] font-mono text-zinc-500 leading-relaxed">
                ⚠️ <span className="text-zinc-300 font-bold">Regla inmutable:</span> Score bilateral =
                (coupleScore × 0.5) + (providerScore × 0.5). Una dimensión knockout fallida (aforo máximo,
                depósito 1 €, fecha confirmada) fuerza score 0 inmediato. Umbral de visibilidad ≥ 65% y
                notificación WhatsApp ≥ 85%.
            </div>
        </div>
    );
}