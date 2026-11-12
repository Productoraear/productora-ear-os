import type { Metadata } from 'next';
import {
    ShieldCheck,
    Sparkles,
    Calculator,
    Building2,
    Phone,
    Award,
} from 'lucide-react';
import FincasB2BPortal from '@/components/fincas/FincasB2BPortal';
import FincaMenuSimulator2026 from '@/components/fincas/FincaMenuSimulator2026';
import FincasCatalogExplorer from '@/features/bodas/ui/FincasCatalogExplorer';
import { FincasParabodaBridgeCta } from '@/components/fincas/FincasParabodaBridgeModal';
import { SovereignCollectiveEventBuilder } from '@/components/checkout/SovereignCollectiveEventBuilder';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

export const metadata: Metadata = {
    title: 'Fincas y Venues B2B · Pacto 100 Fundadores & Simulador 2026 | EAR OS',
    description:
        'Pacto de los 100 Fundadores para propietarios de fincas: igualamos tu cuota anterior con tarifa vitalicia y 0% de fuga a competidores. ' +
        `Simulador de menús 2026, garantía acústica Ley 37/2003 y bloqueo de visita técnica con depósito deducible de ${DEPOSITO_STRIPE_EUR} €.`,
};

const OFFER_SCHEMA = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Pacto de los 100 Fundadores · Red Homologada de Fincas EAR OS',
    description:
        'Escaparate B2B exclusivo para propietarios de fincas y bodas de alta fidelidad acústica en España. ' +
        `Price-Match de cuota vitalicia, 0% fuga publicitaria, menú simulator 2026 y depósito Price-Lock de ${DEPOSITO_STRIPE_EUR} €.`,
    offers: {
        '@type': 'Offer',
        price: DEPOSITO_STRIPE_EUR.toFixed(2),
        priceCurrency: 'EUR',
        availability: 'https://schema.org/InStock',
        category: 'B2B Partnership',
        url: '/fincas',
    },
};

export default function FincasB2BPage() {
    return (
        <div className="w-full min-h-screen bg-[#030305] text-white overflow-x-hidden selection:bg-[#ecb613]/20 selection:text-[#ecb613]">
            {/* Metadatos Estructurados JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(OFFER_SCHEMA) }}
            />

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* 1. HERO B2B PRINCIPAL: PACTO DE LOS 100 FUNDADORES                         */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            <section className="w-full px-4 sm:px-6 lg:px-8 pt-8 pb-12 border-b border-white/10 relative overflow-hidden">
                {/* Iluminación ambiental OLED */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#ecb613]/10 via-transparent to-transparent blur-3xl pointer-events-none" />

                <div className="mx-auto max-w-7xl relative z-10 space-y-8">
                    {/* Badge de Protocolo B2B */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-widest">
                            <Sparkles size={14} className="text-[#ecb613]" />
                            <span>Programa Exclusivo Propietarios de Fincas</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
                            <ShieldCheck size={14} className="text-emerald-400" />
                            <span>Garantía Contractual 0% Fuga a Competidores</span>
                        </div>
                    </div>

                    {/* Titular Principal & Propuesta de Valor */}
                    <div className="max-w-4xl space-y-4">
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-syne tracking-tight text-white leading-tight">
                            Pacto de los 100 Fundadores:{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-[#ecb613]">
                                Igualamos tu cuota anterior
                            </span>{' '}
                            con tarifa vitalicia y 0% de fuga
                        </h1>
                        <p className="text-base sm:text-lg text-zinc-300 font-sans leading-relaxed max-w-3xl">
                            ¿Cansado de que los macro-portales incrementen tus cuotas anualmente y muestren publicidad de fincas rivales dentro de tu propia ficha? 
                            En Productora EAR <strong className="text-white">igualamos tu tarifa actual</strong> como cuota vitalicia congelada (0% IPC), 
                            garantizamos contractualmente que <strong className="text-white">ningún competidor aparecerá jamás en tu espacio</strong> y te abonamos comisiones de hasta el 15% por cada evento producido.
                        </p>
                    </div>

                    {/* Matriz de Indicadores Clave del Pacto */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                        <div className="rounded-2xl bg-[#09090d]/90 border border-[#ecb613]/30 p-5 backdrop-blur-md">
                            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                                <span>Cupo Fundadores</span>
                                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                            </div>
                            <p className="mt-2 text-3xl font-black font-syne text-[#ecb613]">
                                42 <span className="text-base text-zinc-500 font-mono">/ 100</span>
                            </p>
                            <p className="mt-1 text-xs text-emerald-400 font-mono font-medium">
                                58 plazas disponibles
                            </p>
                        </div>

                        <div className="rounded-2xl bg-[#09090d]/90 border border-white/10 p-5 backdrop-blur-md">
                            <span className="text-xs font-mono text-zinc-400 uppercase">Fuga Publicitaria</span>
                            <p className="mt-2 text-3xl font-black font-syne text-white">0%</p>
                            <p className="mt-1 text-xs text-zinc-400">Exclusividad total en tu ficha</p>
                        </div>

                        <div className="rounded-2xl bg-[#09090d]/90 border border-white/10 p-5 backdrop-blur-md">
                            <span className="text-xs font-mono text-zinc-400 uppercase">Tarifa Vitalicia</span>
                            <p className="mt-2 text-3xl font-black font-syne text-white">Price-Match</p>
                            <p className="mt-1 text-xs text-zinc-400">Congelada sin subidas IPC</p>
                        </div>

                        <div className="rounded-2xl bg-[#09090d]/90 border border-white/10 p-5 backdrop-blur-md">
                            <span className="text-xs font-mono text-zinc-400 uppercase">Comisión Afiliado</span>
                            <p className="mt-2 text-3xl font-black font-syne text-[#ecb613]">10% - 15%</p>
                            <p className="mt-1 text-xs text-zinc-400">Liquidación SEPA ≤ 7 días</p>
                        </div>
                    </div>

                    {/* Barra de Llamadas a la Acción (CTAs Principales) */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <a
                            href="#simulador-2026"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-400 hover:from-white hover:to-white text-black px-6 py-3.5 text-xs font-black font-syne uppercase tracking-wider transition-all duration-300 shadow-lg shadow-[#ecb613]/20"
                        >
                            <Calculator size={16} />
                            Simular Menús & Logística 2026
                        </a>
                        <a
                            href="#portal-b2b"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#ecb613]/50 text-white hover:text-[#ecb613] px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300"
                        >
                            <Award size={16} />
                            Portal B2B & Price-Match
                        </a>
                        <a
                            href="#catalogo-fincas"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300"
                        >
                            <Building2 size={16} />
                            Ver Catálogo Homologado
                        </a>
                        <a
                            href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
                                'Hola Edwin, soy propietario de finca y deseo consultar el Pacto de los 100 Fundadores con Price-Match.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] hover:bg-[#00E5FF]/20 px-6 py-3.5 text-xs font-bold font-mono uppercase tracking-wider transition-all duration-300 ml-auto"
                        >
                            <Phone size={14} />
                            Centralita B2B: {CENTRALITA_EAR_OS}
                        </a>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* 2. SECCIÓN TÉCNICA: SIMULADOR DE MENÚS & LOGÍSTICA 2026                     */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            <section id="simulador-2026" className="scroll-mt-24 w-full px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-3 max-w-3xl mx-auto">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-widest">
                        <Sparkles size={14} /> Paciente Cero Hostelería · Eduardo Martínez (Ezkertza Berria &amp; Otzarreta)
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
                        Simulador Gastronómico (Caso Real Ezkertza Berria) &amp; Logística B2B
                    </h2>
                    <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
                        Demostración interactiva con la carta oficial 2026 de <strong className="text-white">Eduardo Martínez (Restaurante Ezkertza Berria &amp; Otzarreta)</strong>.
                        Cada finca o restaurante adherido dispone de su propio catálogo editable en su ficha interna sin mezclar cartas ni tarifas.
                    </p>
                </div>

                {/* Componente Interactivo Oficial */}
                <div className="rounded-3xl border border-white/10 bg-[#09090d]/80 p-2 sm:p-6 backdrop-blur-md">
                    <FincaMenuSimulator2026 />
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* 3. ESCAPARATE PROTEGIDO: EXPLORADOR DE FINCAS CON 0% FUGA PUBLICITARIA      */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            <section id="catalogo-fincas" className="w-full px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10 bg-[#050507]">
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="space-y-2">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider">
                                <ShieldCheck size={13} />
                                <span>Red Homologada S-Class</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-black font-syne text-white tracking-tight">
                                Catálogo Homologado con Blindaje Anti-Fuga
                            </h2>
                            <p className="text-sm text-zinc-400 max-w-2xl">
                                Espacios auditados con limitador Cesva/Bose calibrado, acometida CETAC 32A y póliza RC ≥ 300.000 €. 
                                Teléfonos protegidos bajo Contact-Gate y bloqueo de visita técnica con depósito deducible de 100 €.
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-xs font-mono text-zinc-500 block">Tarifa Solista Oficial SSOT</span>
                            <span className="text-2xl font-black font-syne text-[#ecb613]">{TARIFA_BASE_SOLISTA_EUR} €</span>
                        </div>
                    </div>

                    {/* Explorador de Fincas con Contact-Gate & Visita Técnica */}
                    <FincasCatalogExplorer
                        fincas={SCLASS_12_FINCAS_HOMOLOGADAS}
                        provinceName="Comunidad de Madrid & Zona Centro"
                    />
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* 4. CONSTRUCTOR COLECTIVO DE EVENTO & PUENTE DE BODA                          */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            <section className="w-full px-4 sm:px-6 lg:px-8 py-14 max-w-7xl mx-auto space-y-6">
                <SovereignCollectiveEventBuilder
                    title="Constructor de Evento Colectivo · Suma de Proveedores"
                    subtitle="Elige tu finca y complementa con música en directo, sonorización Bose Ley 37/2003 o transporte convoy sin pagar fianzas fragmentadas."
                />
                <div className="mt-4">
                    <FincasParabodaBridgeCta />
                </div>
            </section>

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* 5. PORTAL B2B INTEGRAL: PRICE-MATCH, HOMOLOGACIÓN & ONBOARDING              */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            <section id="portal-b2b" className="scroll-mt-24 w-full border-t border-white/10 pt-10 pb-20 bg-[#030305]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
                    <div className="rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Building2 className="text-[#ecb613] shrink-0" size={24} />
                            <div>
                                <h3 className="font-syne font-bold text-white text-sm">
                                    Portal B2B de Homologación & Comparativa Bodas.net vs EAR OS
                                </h3>
                                <p className="text-xs text-zinc-400 font-sans">
                                    Accede al simulador de Price-Match, cálculo de autofacturas a 7 días y formulario de Onboarding Express en 15 minutos.
                                </p>
                            </div>
                        </div>
                        <a
                            href="#simulador-2026"
                            className="shrink-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs uppercase tracking-wider transition-all"
                        >
                            Volver al Simulador ↑
                        </a>
                    </div>
                </div>

                <FincasB2BPortal />
            </section>
        </div>
    );
}