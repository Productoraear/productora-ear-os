'use client';

import React, { useMemo, useState, useTransition, useDeferredValue } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    ShieldCheck,
    Zap,
    Users,
    ArrowRight,
    Volume2,
    VolumeX,
    SlidersHorizontal,
    Phone,
    Compass,
    Sparkles,
    CheckCircle2,
    Building2,
    Gauge,
    Lock,
    CreditCard,
    AlertCircle,
    X,
    Clock,
} from 'lucide-react';
import type { FincaHomologada } from '@/lib/constants/fincas-catalog';
import { CENTRALITA } from '@/lib/phone-constants';
import { getFincaImage } from '@/lib/constants/fincas-images';
import { DEPOSITO_STRIPE_EUR } from '@/lib/constants/ear-os-ssot';

export interface FincasCatalogExplorerProps {
    fincas: FincaHomologada[];
    provinceName: string;
}

type SortKey = 'cercania' | 'aforo-desc' | 'aforo-asc';

export interface VisitLockFormData {
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    desiredVisitDate: string;
    timeSlot: 'MORNING' | 'AFTERNOON' | 'ALL_DAY';
    notes: string;
}

export interface VisitLockApiResponse {
    success: boolean;
    mode?: 'stripe_checkout' | 'offline_seal_simulation';
    isMockSession?: boolean;
    checkoutUrl?: string;
    priceLockSeal?: string;
    priceLockSha256?: string;
    depositAmountEur?: number;
    depositDeductibleCents?: number;
    error?: string;
    message?: string;
    detail?: string;
}

/**
 * Enmascara números de teléfono en el escaparate público para cumplir
 * con la política de Contact-Gate anti-picaresca (AGENTS.md §4).
 * La centralita oficial (+34 693 693 048) se mantiene como canal canónico de soporte.
 */
export function maskPhone(phone: string): string {
    if (!phone) return '••• ••• •••';
    const clean = phone.trim();
    if (clean.startsWith('+34')) {
        const parts = clean.split(' ').filter(Boolean);
        if (parts.length >= 2) {
            return `${parts[0]} ${parts[1]} ••• •••`;
        }
    }
    return clean.slice(0, 4) + ' ••• •••';
}

/**
 * 🏰 EXPLORADOR DE FINCAS HOMOLOGADAS S-CLASS
 * Garantiza 0% de fuga publicitaria (cero competidores en fichas, cero banners cruzados),
 * protección de datos Contact-Gate y bloqueo de visita técnica con Stripe Price-Lock 100 €.
 */
export default function FincasCatalogExplorer({ fincas, provinceName }: FincasCatalogExplorerProps) {
    const [minPax, setMinPax] = useState<number>(0);
    const [maxKm, setMaxKm] = useState<number>(200);
    const [onlyNoLimiter, setOnlyNoLimiter] = useState<boolean>(false);
    const [sortKey, setSortKey] = useState<SortKey>('cercania');

    // React 19 / Next.js 16: useDeferredValue desvincula el arrastre de sliders a 120 FPS
    // del re-filtrado y re-ordenamiento del catálogo, erradicando jank en móviles y CPUs limitadas.
    const deferredMinPax = useDeferredValue(minPax);
    const deferredMaxKm = useDeferredValue(maxKm);

    // Estado del modal de Bloqueo de Visita Técnica
    const [activeFincaForVisit, setActiveFincaForVisit] = useState<FincaHomologada | null>(null);

    const maxKmBound = useMemo(
        () => Math.max(150, ...fincas.map((f) => f.distanciaHubMentridaKm)),
        [fincas]
    );

    const results = useMemo(() => {
        const filtered = fincas.filter((f) => {
            if (f.capacidadMaxPax < deferredMinPax) return false;
            if (f.distanciaHubMentridaKm > deferredMaxKm) return false;
            if (onlyNoLimiter && f.limiteAcustico.limitadorInstalado) return false;
            return true;
        });

        return [...filtered].sort((a, b) => {
            if (sortKey === 'aforo-desc') return b.capacidadMaxPax - a.capacidadMaxPax;
            if (sortKey === 'aforo-asc') return a.capacidadMaxPax - b.capacidadMaxPax;
            return a.distanciaHubMentridaKm - b.distanciaHubMentridaKm;
        });
    }, [fincas, deferredMinPax, deferredMaxKm, onlyNoLimiter, sortKey]);

    const noLimiterCount = useMemo(
        () => fincas.filter((f) => !f.limiteAcustico.limitadorInstalado).length,
        [fincas]
    );

    return (
        <div className="w-full space-y-8 overflow-x-hidden">
            {/* 🎛️ PANEL DE FILTROS INTELIGENTES */}
            <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/20">
                        <SlidersHorizontal size={18} className="text-[#ecb613]" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black uppercase tracking-wider text-white font-syne">
                            Ajusta tu espacio ideal en {provinceName}
                        </h2>
                        <p className="text-[11px] font-mono text-zinc-400">
                            Filtros en tiempo real sobre datos técnicos y acústicos auditados
                        </p>
                    </div>
                    <span className="ml-auto px-3.5 py-1.5 rounded-full bg-[#ecb613] text-black text-[11px] font-mono font-black uppercase tracking-wider">
                        {results.length} / {fincas.length}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Aforo mínimo */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                <Users size={13} className="text-[#ecb613]" /> Aforo mínimo
                            </span>
                            <span className="text-xs font-black text-white font-syne">
                                {minPax === 0 ? 'Cualquiera' : `${minPax} pax`}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={800}
                            step={50}
                            value={minPax}
                            onChange={(e) => setMinPax(Number(e.target.value))}
                            className="w-full accent-[#ecb613] cursor-pointer"
                        />
                    </div>

                    {/* Distancia máxima */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                                <Compass size={13} className="text-[#00E5FF]" /> Distancia máx. a Méntrida
                            </span>
                            <span className="text-xs font-black text-white font-syne">{maxKm} km</span>
                        </div>
                        <input
                            type="range"
                            min={0}
                            max={maxKmBound}
                            step={5}
                            value={maxKm}
                            onChange={(e) => setMaxKm(Number(e.target.value))}
                            className="w-full accent-[#00E5FF] cursor-pointer"
                        />
                    </div>

                    {/* Sin limitador */}
                    <div className="space-y-3">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                            <Volume2 size={13} className="text-emerald-400" /> Libertad acústica
                        </span>
                        <button
                            type="button"
                            onClick={() => setOnlyNoLimiter((v) => !v)}
                            className={`w-full p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                                onlyNoLimiter
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:border-white/20'
                            }`}
                        >
                            <span className="text-xs font-bold font-syne flex items-center gap-2">
                                {onlyNoLimiter ? <VolumeX size={16} /> : <Volume2 size={16} />}
                                Sin limitador instalado
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/40">
                                {noLimiterCount} fincas
                            </span>
                        </button>
                    </div>
                </div>

                {/* Ordenación */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/10">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 mr-1">
                        Ordenar por:
                    </span>
                    {([
                        { key: 'cercania', label: 'Más cercana a Méntrida' },
                        { key: 'aforo-desc', label: 'Mayor aforo' },
                        { key: 'aforo-asc', label: 'Menor aforo' },
                    ] as Array<{ key: SortKey; label: string }>).map((opt) => (
                        <button
                            key={opt.key}
                            type="button"
                            onClick={() => setSortKey(opt.key)}
                            className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold font-mono uppercase tracking-wide border transition-all cursor-pointer ${
                                sortKey === opt.key
                                    ? 'bg-[#ecb613] text-black border-[#ecb613]'
                                    : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 🛡️ SELLO DE EXCLUSIVIDAD B2B: 0% FUGA PUBLICITARIA */}
            <div className="rounded-3xl bg-gradient-to-r from-[#09090d] via-[#12121a] to-[#09090d] border border-[#ecb613]/30 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="p-3.5 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/20 shrink-0">
                        <ShieldCheck size={28} className="text-[#ecb613]" />
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-[#ecb613] font-bold">
                                Pacto de los 100 Fundadores · Cláusula Anti-Fuga
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                                0% Fuga a Competidores
                            </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black uppercase text-white font-syne mt-1">
                            Garantía de Blindaje Territorial y Exclusividad de Ficha
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-2xl mt-1 leading-relaxed">
                            En Productora EAR cada finca cuenta con un perfil protegido: <strong className="text-zinc-200">jamás vendemos publicidad de rivales ni sugerimos alternativas competidoras dentro de la ficha de un espacio</strong>. Tus parejas solo verán tu propuesta.
                        </p>
                    </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                    <a
                        href="#simulador-2026"
                        className="px-4 py-2.5 rounded-xl bg-[#ecb613] hover:bg-amber-300 text-black text-xs font-mono font-black uppercase tracking-wider transition-all cursor-pointer shadow-md"
                    >
                        Simular Menú 2026
                    </a>
                </div>
            </div>

            {/* 🏰 GRID DE RESULTADOS (0% COMPETITOR AD LEAK - NEURAL NAVIGATION ERADICATED) */}
            {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {results.map((finca) => (
                            <FincaCard
                                key={finca.id}
                                finca={finca}
                                onOpenVisitLock={() => setActiveFincaForVisit(finca)}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-12 text-center space-y-4">
                    <Sparkles size={32} className="mx-auto text-[#ecb613]" />
                    <h3 className="text-lg font-black uppercase font-syne text-white">
                        Ningún espacio con esos criterios
                    </h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto">
                        Amplía el aforo, la distancia o desactiva el filtro acústico. Nuestro equipo también
                        localiza espacios a medida para tu evento en {provinceName}.
                    </p>
                    <a
                        href={`https://wa.me/${CENTRALITA.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                            `Hola Productora EAR, busco un espacio a medida para mi evento en ${provinceName}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#ecb613] text-black font-mono text-xs font-black uppercase rounded-xl hover:bg-amber-300 transition-all"
                    >
                        <Phone size={14} /> Búsqueda personalizada · {CENTRALITA.display}
                    </a>
                </div>
            )}

            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {/* MODAL TRANSACCIONAL: BLOQUEO DE VISITA TÉCNICA (100 € STRIPE PRICE-LOCK)    */}
            {/* ════════════════════════════════════════════════════════════════════════════ */}
            {activeFincaForVisit && (
                <TechnicalVisitLockModal
                    finca={activeFincaForVisit}
                    onClose={() => setActiveFincaForVisit(null)}
                />
            )}
        </div>
    );
}

/**
 * Tarjeta individual de Finca Homologada S-Class
 */
function FincaCard({
    finca,
    onOpenVisitLock,
}: {
    finca: FincaHomologada;
    onOpenVisitLock: () => void;
}) {
    const img = getFincaImage(finca.id);
    const facturables = Math.max(0, finca.distanciaHubMentridaKm - 50);
    const hasLimiter = finca.limiteAcustico.limitadorInstalado;
    const freeFieldDba = finca.limiteAcustico.exteriorDBA;

    const waHref = `https://wa.me/${CENTRALITA.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola Productora EAR, me interesa consultar disponibilidad técnica para "${finca.name}" (${finca.location}).`
    )}`;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="rounded-3xl overflow-hidden bg-[#09090d]/80 border border-white/10 backdrop-blur-md hover:border-[#ecb613]/50 transition-all flex flex-col group shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
            {/* FOTOGRAFÍA CON OVERLAYS S-CLASS */}
            <div className="relative h-52 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={img}
                    alt={finca.name}
                    loading="lazy"
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#09090d] via-[#09090d]/30 to-transparent" />
                <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur border border-[#ecb613]/30 text-[#ecb613] font-mono text-[10px] uppercase tracking-widest">
                    <ShieldCheck size={12} /> Certificada S-Class
                </span>
                <span
                    className={`absolute top-4 right-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur font-mono text-[10px] uppercase tracking-widest ${
                        hasLimiter
                            ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300'
                            : 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    }`}
                >
                    {hasLimiter ? <Volume2 size={11} /> : <VolumeX size={11} />}
                    {hasLimiter ? `Limitador ${freeFieldDba} dB` : `Libre ${freeFieldDba} dB`}
                </span>
            </div>

            {/* CONTENIDO TÉCNICO Y COMERCIAL */}
            <div className="p-6 space-y-4 flex flex-col flex-grow">
                <div>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#ecb613]" /> {finca.location}
                    </p>
                    <h3 className="font-syne text-xl font-black text-white mt-1 group-hover:text-[#ecb613] transition-colors">
                        {finca.name}
                    </h3>
                </div>

                <p className="font-sans text-xs text-white/60 leading-relaxed line-clamp-3 flex-grow">
                    {finca.description}
                </p>

                {/* MATRIZ TÉCNICA 4 CUADRANTES */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Users size={12} className="text-[#ecb613]" /> Aforo
                        </span>
                        <span className="text-white font-bold">{finca.capacidadMaxPax} pax</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Zap size={12} className="text-[#ecb613]" /> Potencia
                        </span>
                        <span className="text-white font-bold">{finca.potenciaKw} kW</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Gauge size={12} className="text-[#00E5FF]" /> Logística Hub
                        </span>
                        <span className="text-white font-bold">
                            {finca.distanciaHubMentridaKm} km
                            {facturables > 0 ? ` · ${facturables} fact.` : ' · 0 fact.'}
                        </span>
                    </div>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="flex items-center gap-1.5 text-white/40 mb-1">
                            <Building2 size={12} className="text-[#ecb613]" /> Póliza RC
                        </span>
                        <span className="text-white font-bold">
                            {finca.polizaRC.coberturaEuros.toLocaleString('es-ES')} €
                        </span>
                    </div>
                </div>

                {/* CONTACT-GATE COMPLIANCE (AGENTS.md §4) */}
                <div className="p-3 rounded-xl bg-[#030305] border border-white/10 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between">
                        <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                            <Lock size={11} className="text-[#ecb613]" /> Contacto Directo:
                        </span>
                        <span className="text-zinc-300 font-semibold">{finca.directorioContacto.director}</span>
                    </div>
                    <div className="flex items-center justify-between font-mono">
                        <span className="text-zinc-500">Teléfono:</span>
                        <span className="text-zinc-400 font-mono tracking-wider">
                            {maskPhone(finca.directorioContacto.telefono)}
                        </span>
                    </div>
                    <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-500">
                        <span>Centralita Oficial EAR OS:</span>
                        <span className="text-[#ecb613] font-bold">{CENTRALITA.display}</span>
                    </div>
                </div>

                {/* ACCIONES TRANSACCIONALES */}
                <div className="pt-2 flex flex-col gap-2">
                    {/* BOTÓN OBLIGATORIO: BLOQUEO DE VISITA TÉCNICA CON PRICE-LOCK */}
                    <button
                        type="button"
                        onClick={onOpenVisitLock}
                        className="w-full py-3.5 bg-gradient-to-r from-[#ecb613] to-[#f5d77f] hover:from-white hover:to-white text-black font-syne font-black text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ecb613]/20 cursor-pointer"
                    >
                        <CreditCard size={15} />
                        Bloquear Visita Técnica ({DEPOSITO_STRIPE_EUR} € deducible)
                    </button>

                    {/* BOTÓN SECUNDARIO: WHATSAPP CONCIERGE */}
                    <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#ecb613]/40 text-white font-mono text-[11px] font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all"
                    >
                        <Phone size={13} className="text-[#ecb613]" />
                        Consultar Disponibilidad (Centralita)
                        <ArrowRight size={12} />
                    </a>
                </div>
            </div>
        </motion.article>
    );
}

/**
 * 🔒 MODAL DE BLOQUEO DE VISITA TÉCNICA (100 € STRIPE PRICE-LOCK)
 * Conexión transaccional completa con `POST /api/fincas/visit-lock`.
 */
function TechnicalVisitLockModal({
    finca,
    onClose,
}: {
    finca: FincaHomologada;
    onClose: () => void;
}) {
    // Fecha por defecto: mañana en formato YYYY-MM-DD
    const tomorrowStr = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    }, []);

    const [formData, setFormData] = useState<VisitLockFormData>({
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        desiredVisitDate: tomorrowStr,
        timeSlot: 'MORNING',
        notes: '',
    });

    const [isSubmitting, startTransition] = useTransition();
    const [apiResponse, setApiResponse] = useState<VisitLockApiResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);

        // Validaciones básicas de cliente
        if (!formData.contactName.trim()) {
            setErrorMessage('Por favor introduce el nombre del responsable o pareja.');
            return;
        }
        if (!formData.contactEmail.trim() || !formData.contactEmail.includes('@')) {
            setErrorMessage('Por favor introduce un correo electrónico válido.');
            return;
        }
        if (formData.contactPhone.replace(/\D/g, '').length < 9) {
            setErrorMessage('El teléfono de contacto debe tener al menos 9 dígitos.');
            return;
        }

        startTransition(async () => {
            try {
                const res = await fetch('/api/fincas/visit-lock', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fincaId: finca.id,
                        fincaName: finca.name,
                        contactName: formData.contactName.trim(),
                        contactEmail: formData.contactEmail.trim().toLowerCase(),
                        contactPhone: formData.contactPhone.trim(),
                        desiredVisitDate: formData.desiredVisitDate,
                        timeSlot: formData.timeSlot,
                        locationAddress: finca.location,
                        municipio: finca.location.split('(')[0]?.trim() || finca.location,
                        provincia: finca.provincia,
                        distanceHubKm: finca.distanciaHubMentridaKm,
                        notes: formData.notes.trim() || undefined,
                    }),
                });

                const data: VisitLockApiResponse = await res.json();

                if (!res.ok || !data.success) {
                    setErrorMessage(data.message || data.error || 'Error al procesar el bloqueo de visita técnica.');
                    return;
                }

                setApiResponse(data);

                // Si Stripe devolvió URL directa de Checkout en modo live, redirigir
                if (data.checkoutUrl && !data.isMockSession && data.mode !== 'offline_seal_simulation') {
                    window.location.href = data.checkoutUrl;
                }
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : String(err);
                setErrorMessage(`Fallo de conexión con el servidor transaccional: ${msg}`);
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <div className="bg-[#09090d] border border-white/20 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8 text-white space-y-6">
                {/* Botón de cierre */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-5 right-5 text-zinc-400 hover:text-white p-2 rounded-xl bg-white/5 border border-white/10 transition-colors cursor-pointer"
                >
                    <X size={18} />
                </button>

                {/* Header del Modal */}
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-[11px] uppercase tracking-wider">
                        <CreditCard size={12} />
                        <span>Depósito Stripe Price-Lock 100,00 € (100% Deducible)</span>
                    </div>
                    <h3 className="text-2xl font-black font-syne text-white tracking-tight mt-2">
                        Bloquear Visita Técnica
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono">
                        {finca.name} · {finca.location}
                    </p>
                </div>

                {/* Si ya tenemos respuesta exitosa en modo offline/simulado */}
                {apiResponse && apiResponse.success ? (
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 size={28} className="text-emerald-400 shrink-0" />
                            <div>
                                <h4 className="font-syne font-black text-white text-base">
                                    ¡Visita Técnica Solicitada con Éxito!
                                </h4>
                                <p className="text-xs text-zinc-300">
                                    Hemos recibido la solicitud y despachado la orden al equipo técnico de Productora EAR.
                                </p>
                            </div>
                        </div>

                        {(apiResponse.priceLockSeal || apiResponse.priceLockSha256) && (
                            <div className="p-3 rounded-xl bg-black/50 border border-white/10 font-mono text-xs space-y-1">
                                <span className="text-[10px] uppercase text-zinc-500 block">Sello HMAC SHA-256 Price-Lock:</span>
                                <span className="text-[#ecb613] font-bold break-all">
                                    {apiResponse.priceLockSeal || apiResponse.priceLockSha256}
                                </span>
                            </div>
                        )}

                        <p className="text-xs text-zinc-400 leading-relaxed">
                            Un ingeniero acústico de Productora EAR se pondrá en contacto en menos de 2 horas para confirmar hora exacta y coordinar el acceso con la dirección de la finca.
                        </p>

                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 rounded-xl bg-[#ecb613] text-black font-mono font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                            Entendido y Cerrar
                        </button>
                    </div>
                ) : (
                    /* Formulario de reserva */
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {errorMessage && (
                            <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-3.5 flex items-center gap-2.5 text-xs text-red-300">
                                <AlertCircle size={16} className="text-red-400 shrink-0" />
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                    Fecha Deseada
                                </label>
                                <input
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.desiredVisitDate}
                                    onChange={(e) => setFormData({ ...formData, desiredVisitDate: e.target.value })}
                                    required
                                    className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#ecb613] focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                    Franja Horaria
                                </label>
                                <select
                                    value={formData.timeSlot}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            timeSlot: e.target.value as 'MORNING' | 'AFTERNOON' | 'ALL_DAY',
                                        })
                                    }
                                    className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#ecb613] focus:outline-none cursor-pointer"
                                >
                                    <option value="MORNING">Mañana (10:00 - 14:00)</option>
                                    <option value="AFTERNOON">Tarde (16:00 - 20:00)</option>
                                    <option value="ALL_DAY">Cualquiera / Flexible</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                Nombre y Apellidos (Responsable)
                            </label>
                            <input
                                type="text"
                                placeholder="Ej. Carmen Gómez / Roberto Delgado"
                                value={formData.contactName}
                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                required
                                className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white font-sans focus:border-[#ecb613] focus:outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                    Email de Contacto
                                </label>
                                <input
                                    type="email"
                                    placeholder="pareja@ejemplo.com"
                                    value={formData.contactEmail}
                                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                    required
                                    className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white font-sans focus:border-[#ecb613] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                    Teléfono Móvil
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+34 600 000 000"
                                    value={formData.contactPhone}
                                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                    required
                                    className="w-full rounded-xl bg-black/50 border border-white/15 px-3.5 py-2.5 text-xs text-white font-mono focus:border-[#ecb613] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono uppercase text-zinc-400 mb-1.5">
                                Notas o Requerimientos de Producción (Opcional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Aforo previsto, tipo de ceremonia, necesidades eléctricas o catering..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                className="w-full rounded-xl bg-black/50 border border-white/15 p-3 text-xs text-white font-sans focus:border-[#ecb613] focus:outline-none resize-none"
                            />
                        </div>

                        {/* Desglose de Fianza y Blindaje */}
                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 space-y-2 text-xs font-mono">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-400">Depósito Price-Lock:</span>
                                <span className="text-white font-bold">{DEPOSITO_STRIPE_EUR},00 €</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-400">
                                <span>Garantía Deducible:</span>
                                <span>100% reintegrable en factura de evento</span>
                            </div>
                            <p className="text-[11px] text-zinc-500 pt-1 border-t border-white/5 font-sans leading-relaxed">
                                Este depósito garantiza la reserva de fecha de nuestros ingenieros acústicos y el bloqueo de agenda para auditoría in-situ del espacio.
                            </p>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="w-1/3 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-2/3 py-3.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-amber-300 hover:from-white hover:to-white text-black font-syne font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Clock size={15} className="animate-spin" />
                                        <span>Procesando...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard size={15} />
                                        <span>Bloquear con 100 €</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}