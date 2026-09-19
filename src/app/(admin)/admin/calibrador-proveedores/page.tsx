import React from 'react';
import { Metadata } from 'next';
import AdminCalibratorProxy from '@/components/admin/AdminCalibratorProxy';

export const metadata: Metadata = {
    title: 'Calibrador de Proveedores | EAR OS Admin',
    description: 'Gestión delegada de calibradores de captación para fincas y proveedores.'
};

export default function AdminCalibratorProxyPage() {
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <header className="border-b border-white/10 pb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[10px] font-mono text-[#ecb613] font-bold uppercase mb-3">
                    🎛️ Gestión Delegada · Motor Neural Bilateral
                </div>
                <h1 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
                    Calibradores de Proveedores
                </h1>
                <p className="text-sm text-zinc-400 font-light mt-2 max-w-2xl">
                    Configura por delegación el calibrador de 100 dimensiones de las fincas que aún no lo
                    han afinado. Cada finca nueva arranca con un preset inteligente por tipología.
                </p>
            </header>

            <AdminCalibratorProxy />

            {/* Nota de gobernanza */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-[11px] font-mono text-zinc-500 leading-relaxed">
                ⚠️ <span className="text-zinc-300 font-bold">Preconfiguración inteligente:</span> toda finca
                nueva se autoconfigura con el preset más cercano a su tipología (Palacio, Cortijo, Masía…).
                El admin puede ajustarlo manualmente o delegar su aprobación final al proveedor.
            </div>
        </div>
    );
}