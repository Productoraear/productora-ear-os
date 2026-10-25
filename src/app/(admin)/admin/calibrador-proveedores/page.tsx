import { Metadata } from 'next';
import CalibratorProxyBoundary from '@/components/admin/CalibratorErrorBoundary';
import SClassVendorHistoricPriceShield from '@/components/vendor/SClassVendorHistoricPriceShield';
import {
    ROLE_METRICS,
    WEDDING_VENDOR_CATEGORIES,
    VENDOR_PRICE_POLICY,
    HISTORIC_PRICE_WINDOW_YEARS,
    HISTORIC_PRICE_ANNUAL_INCREASE_PCT,
    CDN_VENDOR_PARTITION_COUNT,
} from '@/lib/constants/macro-ecosystem-manifest';

export const metadata: Metadata = {
    title: 'Calibrador de Proveedores | EAR OS Admin',
    description: 'Gestión delegada de calibradores de captación para fincas y proveedores.'
};

export default function AdminCalibratorProxyPage(): React.ReactElement {
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

            <CalibratorProxyBoundary />

            {/* TELEMETRÍA MULTI-ROL & BLINDAJE DE PRECIO HISTÓRICO */}
            <section className="space-y-6">
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
                            TELEMETRÍA INDIVIDUAL POR ROL // {CDN_VENDOR_PARTITION_COUNT.toLocaleString('es-ES')} PROVEEDORES CDN
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
                            Matriz de Métricas del Ecosistema
                        </h2>
                        <p className="text-xs text-zinc-400 max-w-2xl">
                            Métricas de conversión, volumen de leads y retención tipadas por rol, consumidas
                            directamente del manifest canónico (cero mocks quemados).
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {ROLE_METRICS.map((metric) => (
                            <div
                                key={metric.role}
                                className="rounded-2xl bg-white/5 border border-white/5 p-4 space-y-2.5 transition-all duration-300 hover:border-[#ecb613]/30 hover:bg-white/[0.07]"
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-white uppercase font-mono">
                                        {metric.label}
                                    </span>
                                    <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-wider">
                                        {metric.role}
                                    </span>
                                </div>
                                <p className="text-[11px] text-zinc-400 leading-relaxed">
                                    {metric.description}
                                </p>
                                <div className="grid grid-cols-3 gap-2 pt-1">
                                    <div className="bg-black/40 rounded-xl p-2 text-center">
                                        <div className="text-[9px] font-mono text-white/40 uppercase">Conversión</div>
                                        <div className="text-sm font-black text-white font-syne">
                                            {metric.conversionTargetPct}%
                                        </div>
                                    </div>
                                    <div className="bg-black/40 rounded-xl p-2 text-center">
                                        <div className="text-[9px] font-mono text-white/40 uppercase">Leads/mes</div>
                                        <div className="text-sm font-black text-white font-syne">
                                            {metric.leadVolumeBaseline}
                                        </div>
                                    </div>
                                    <div className="bg-black/40 rounded-xl p-2 text-center">
                                        <div className="text-[9px] font-mono text-white/40 uppercase">Retención</div>
                                        <div className="text-sm font-black text-white font-syne">
                                            {metric.retentionTargetPct}%
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {metric.kpiFocus.map((kpi) => (
                                        <span
                                            key={kpi}
                                            className="px-2 py-0.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-[9px] font-mono uppercase"
                                        >
                                            {kpi}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
                    <div className="space-y-2">
                        <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold">
                            BLINDAJE DE PRECIO HISTÓRICO // {VENDOR_PRICE_POLICY}
                        </span>
                        <h2 className="text-2xl sm:text-3xl font-black font-syne text-white uppercase">
                            Categorías Homologadas & Sello de Precio Congelado
                        </h2>
                        <p className="text-xs text-zinc-400 max-w-2xl">
                            Precio medio histórico de {HISTORIC_PRICE_WINDOW_YEARS} años con{' '}
                            {HISTORIC_PRICE_ANNUAL_INCREASE_PCT}% de subida anual. Categorías del
                            marketplace nupcial servidas por gremio en particiones CDN.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {WEDDING_VENDOR_CATEGORIES.map((category) => (
                            <span
                                key={category}
                                className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-mono uppercase tracking-wider transition-all hover:border-[#ecb613]/40 hover:text-[#ecb613]"
                            >
                                {category}
                            </span>
                        ))}
                    </div>

                    <SClassVendorHistoricPriceShield
                        category={WEDDING_VENDOR_CATEGORIES[0]}
                        vendorName="Productora EAR · Proveedores Homologados"
                        frozenSinceIso={new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000).toISOString()}
                    />
                </div>

            </section>


            {/* Nota de gobernanza */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-4 text-[11px] font-mono text-zinc-500 leading-relaxed">
                ⚠️ <span className="text-zinc-300 font-bold">Preconfiguración inteligente:</span> toda finca
                nueva se autoconfigura con el preset más cercano a su tipología (Palacio, Cortijo, Masía…).
                El admin puede ajustarlo manualmente o delegar su aprobación final al proveedor.
            </div>
        </div>
    );
}