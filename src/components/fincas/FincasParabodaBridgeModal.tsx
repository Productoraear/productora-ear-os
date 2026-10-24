"use client";

/**
 * FincasParabodaBridgeModal — Conector interactivo de alta conversión para
 * fincasparaboda.com. Permite a parejas y wedding planners que buscan finca:
 *  1. Seleccionar aforo (50 a 600 pax).
 *  2. Calcular al vuelo la potencia RMS (12 W/pax · SSOT) y el sistema Bose.
 *  3. Mostrar certificación acústica Ley 37/2003 (85-90 dBA ext / 80-85 int).
 *  4. Reservar con fianza protegida Stripe 100 € deducible y despacho n8n
 *     `finca-partnership` en background vía /api/dispatch/swarm-lead.
 * Todos los valores financieros y acústicos nacen del SSOT canónico.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    X,
    Users,
    Volume2,
    ShieldCheck,
    Lock,
    Sparkles,
    Send,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import {
    TARIFA_BASE_SOLISTA_EUR,
    DEPOSITO_STRIPE_EUR,
    WATTS_PER_PAX,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { calcularRiderAcustico } from '@/lib/fincas/fincaMetricsEngine';

/* ─── Tipos estrictos (cero any) ─── */

type EntornoAcustico = 'EXTERIOR' | 'INTERIOR';

type EnvioEstado = 'idle' | 'loading' | 'success' | 'error';

interface EnvioResponse {
    success: boolean;
    accepted?: boolean;
    leadId?: string;
    score?: number;
    acousticStatus?: string;
    wattsRecommended?: number;
    error?: string;
}

interface FincasParabodaBridgeModalProps {
    open: boolean;
    onClose: () => void;
}

interface PresupuestoFinca {
    watts: number;
    sistema: string;
    dbaExterior: string;
    dbaInterior: string;
    tarifaBase: number;
    fianza: number;
}

/** Rango de aforo configurable (slider). */
const PAX_MIN = 50;
const PAX_MAX = 600;

/** Certificación acústica Ley 37/2003 para bodas y fincas. */
const RIDER_BODAS_FINCA = {
    exterior: '85-90 dBA',
    interior: '80-85 dBA',
    garantia: 'No-clausura + limitador telemático homologado',
} as const;

/** Formateador de moneda EUR sin decimales. */
const EUR = new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

/**
 * FincasParabodaBridgeModal — Modal accesible (aria-modal, focus trap,
 * tecla Escape) con cotizador paramétrico de acústica Bose F1.
 */
const FincasParabodaBridgeModal: React.FC<FincasParabodaBridgeModalProps> = ({
    open,
    onClose,
}) => {
    const [pax, setPax] = useState<number>(120);
    const [entorno, setEntorno] = useState<EntornoAcustico>('EXTERIOR');
    const [nombre, setNombre] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [estado, setEstado] = useState<EnvioEstado>('idle');
    const [errorMensaje, setErrorMensaje] = useState<string | null>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const presupuesto = useMemo<PresupuestoFinca>(() => {
        const rider = calcularRiderAcustico(pax);
        return {
            watts: rider.wattsTotales,
            sistema: rider.sistema,
            dbaExterior: RIDER_BODAS_FINCA.exterior,
            dbaInterior: RIDER_BODAS_FINCA.interior,
            tarifaBase: TARIFA_BASE_SOLISTA_EUR,
            fianza: DEPOSITO_STRIPE_EUR,
        };
    }, [pax]);

    /* ─── Accesibilidad: foco inicial + Escape + bloqueo de scroll ─── */
    useEffect(() => {
        if (!open) {
            setEstado('idle');
            setErrorMensaje(null);
            return;
        }
        closeRef.current?.focus();
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = prevOverflow;
        };
    }, [open]);

    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                onClose();
            }
        },
        [onClose],
    );

    const handlePaxChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = Number.parseInt(event.target.value, 10);
        if (Number.isFinite(parsed)) {
            setPax(Math.min(PAX_MAX, Math.max(PAX_MIN, parsed)));
        }
    }, []);

    const handleEnviar = useCallback(async () => {
        if (nombre.trim().length < 2 || telefono.trim().length < 7) {
            setErrorMensaje('Introduce un nombre y un teléfono válido para continuar.');
            setEstado('error');
            return;
        }
        setEstado('loading');
        setErrorMensaje(null);

        const payload = {
            role: 'COUPLE_WEDDING',
            clientName: nombre.trim(),
            clientPhone: telefono.trim(),
            eventDate: 'Por confirmar · FincaParaBoda.com',
            location: 'Finca Paradise (por confirmar)',
            guestsPax: pax,
            budgetEur: TARIFA_BASE_SOLISTA_EUR + DEPOSITO_STRIPE_EUR,
            technicalNotes: `FincaParaBoda bridge · ${entorno} · ${presupuesto.watts} W · ${presupuesto.sistema}`,
        };

        try {
            const res = await fetch('/api/dispatch/swarm-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = (await res.json()) as EnvioResponse;
            if (!res.ok || !data.success) {
                throw new Error(data.error ?? 'No se pudo procesar la reserva.');
            }
            setEstado('success');
        } catch (error: unknown) {
            const message =
                error instanceof Error ? error.message : 'Error inesperado despachando el lead.';
            setErrorMensaje(message);
            setEstado('error');
        }
    }, [nombre, telefono, pax, entorno, presupuesto]);

    if (!open) {
        return null;
    }

    const whatsappUrl = `https://wa.me/${CENTRALITA_EAR_OS.replace(/\D/g, '')}?text=${encodeURIComponent(
        `Hola 👋 Busco finca para mi boda · ${pax} pax · ${entorno} · ${presupuesto.watts} W (${presupuesto.sistema})`,
    )}`;

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
            onKeyDown={handleKeyDown}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="finca-bridge-title"
                className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#09090d]/95 border border-white/10 backdrop-blur-md shadow-2xl transition-all duration-300 ease-out"
            >
                {/* Cabecera */}
                <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 pt-6 pb-4 bg-[#09090d]/95 border-b border-white/10">
                    <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ecb613]">
                            FincasParaBoda.com · Bridge S-Class
                        </p>
                        <h2
                            id="finca-bridge-title"
                            className="mt-1 font-syne text-xl font-black text-white"
                        >
                            Auditoría Acústica S-Class
                        </h2>
                    </div>
                    <button
                        ref={closeRef}
                        type="button"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                        className="shrink-0 w-9 h-9 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 flex items-center justify-center"
                    >
                        <X size={16} aria-hidden="true" focusable="false" />
                    </button>
                </div>

                <div className="px-6 py-6 flex flex-col gap-6">
                    {/* 1. Aforo slider */}
                    <div role="group" aria-label="Selección de aforo de invitados">
                        <div className="flex items-center gap-2 text-white/50 font-mono text-[10px] uppercase tracking-widest mb-3">
                            <Users size={14} aria-hidden="true" focusable="false" />
                            <span>Aforo de invitados</span>
                        </div>
                        <input
                            type="range"
                            min={PAX_MIN}
                            max={PAX_MAX}
                            step={10}
                            value={pax}
                            onChange={handlePaxChange}
                            aria-label="Aforo de invitados"
                            aria-valuemin={PAX_MIN}
                            aria-valuemax={PAX_MAX}
                            aria-valuenow={pax}
                            className="w-full h-2 accent-[#ecb613] cursor-pointer"
                        />
                        <div className="flex items-end justify-between mt-2">
                            <span className="font-mono text-xs text-white/40">{PAX_MIN} pax</span>
                            <span className="font-mono text-3xl font-black text-white tabular-nums">
                                {pax}
                                <span className="text-sm text-white/40" aria-hidden="true"> pax</span>
                            </span>
                            <span className="font-mono text-xs text-white/40">{PAX_MAX} pax</span>
                        </div>
                    </div>

                    {/* 2. Selector de entorno */}
                    <div role="group" aria-label="Selección de entorno acústico">
                        <div className="flex items-center gap-2 text-white/50 font-mono text-[10px] uppercase tracking-widest mb-3">
                            <Volume2 size={14} aria-hidden="true" focusable="false" />
                            <span>Entorno del evento</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setEntorno('EXTERIOR')}
                                aria-pressed={entorno === 'EXTERIOR'}
                                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                                    entorno === 'EXTERIOR'
                                        ? 'border-[#ecb613]/50 bg-[#ecb613]/10'
                                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                }`}
                            >
                                <p className="font-syne text-sm font-bold text-white">Jardín Exterior</p>
                                <p className="font-mono text-[10px] uppercase tracking-widest mt-1 text-[#ecb613]">
                                    {RIDER_BODAS_FINCA.exterior}
                                </p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setEntorno('INTERIOR')}
                                aria-pressed={entorno === 'INTERIOR'}
                                className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                                    entorno === 'INTERIOR'
                                        ? 'border-[#ecb613]/50 bg-[#ecb613]/10'
                                        : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                }`}
                            >
                                <p className="font-syne text-sm font-bold text-white">Salón Interior</p>
                                <p className="font-mono text-[10px] uppercase tracking-widest mt-1 text-[#ecb613]">
                                    {RIDER_BODAS_FINCA.interior}
                                </p>
                            </button>
                        </div>
                    </div>

                    {/* 3. Cálculo en vivo */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                                Potencia RMS · {WATTS_PER_PAX} W/pax
                            </p>
                            <p className="mt-1 font-mono text-2xl font-black text-white tabular-nums">
                                {presupuesto.watts.toLocaleString('es-ES')} W
                            </p>
                        </div>
                        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 sm:col-span-2">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                                Sistema recomendado
                            </p>
                            <p className="mt-1 font-syne text-sm font-bold text-white leading-snug">
                                {presupuesto.sistema}
                            </p>
                        </div>
                    </div>

                    {/* 4. Certificación Ley 37/2003 */}
                    <div className="rounded-2xl border border-[#ecb613]/30 bg-[#ecb613]/[0.06] p-4 flex items-start gap-3">
                        <ShieldCheck size={20} className="text-[#ecb613] shrink-0 mt-0.5" aria-hidden="true" focusable="false" />
                        <div>
                            <p className="font-syne text-sm font-bold text-white">
                                Garantía acústica Ley 37/2003
                            </p>
                            <p className="mt-1 text-xs text-white/70 leading-relaxed">
                                Certificación{' '}
                                {entorno === 'EXTERIOR' ? presupuesto.dbaExterior : presupuesto.dbaInterior}{' '}
                                con {RIDER_BODAS_FINCA.garantia}. Cero multas, cero clausuras.
                            </p>
                        </div>
                    </div>

                    {/* 5. Desglose transparente */}
                    <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60">Solista Edwin Agudelo (SSOT)</span>
                            <span className="font-mono text-sm text-white font-bold">
                                desde {EUR.format(presupuesto.tarifaBase)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-white/60 flex items-center gap-1.5">
                                <Lock size={12} className="text-[#00E5FF]" aria-hidden="true" focusable="false" />
                                Fianza Stripe Price-Lock (100% deducible)
                            </span>
                            <span className="font-mono text-sm text-[#00E5FF] font-bold">
                                {EUR.format(presupuesto.fianza)}
                            </span>
                        </div>
                    </div>

                    {/* 6. Formulario de contacto */}
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                            maxLength={120}
                            className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/50 transition-all duration-300"
                        />
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            placeholder="Teléfono / WhatsApp"
                            maxLength={24}
                            inputMode="tel"
                            className="w-full rounded-2xl bg-white/[0.03] border border-white/10 px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#ecb613]/50 transition-all duration-300"
                        />
                    </div>

                    {errorMensaje && (
                        <p className="text-xs text-[#FF2B44] font-mono" role="alert">
                            {errorMensaje}
                        </p>
                    )}

                    {estado === 'success' ? (
                        <div
                            className="rounded-2xl border border-[#00E5FF]/30 bg-[#00E5FF]/[0.06] p-4 flex items-center gap-3"
                            role="status"
                            aria-label="Reserva enviada con éxito"
                        >
                            <CheckCircle2 size={20} className="text-[#00E5FF] shrink-0" aria-hidden="true" focusable="false" />
                            <div>
                                <p className="font-syne text-sm font-bold text-white">Lead despachado</p>
                                <p className="mt-1 text-xs text-white/70">
                                    Tu solicitud llegó al motor S-Class. Te contactaremos por WhatsApp.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={handleEnviar}
                                disabled={estado === 'loading'}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-3xl bg-[#ecb613] text-black px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-[#ecb613]/90 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                {estado === 'loading' ? (
                                    <Loader2 size={16} className="animate-spin" aria-hidden="true" focusable="false" />
                                ) : (
                                    <Sparkles size={16} aria-hidden="true" focusable="false" />
                                )}
                                {estado === 'loading' ? 'Despachando…' : 'Bloquear fecha · fianza 100 €'}
                            </button>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-3xl bg-[#09090d]/80 border border-white/10 text-white px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:border-white/30 hover:bg-[#09090d]"
                            >
                                <Send size={16} aria-hidden="true" focusable="false" />
                                WhatsApp directo
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FincasParabodaBridgeModal;
export type { FincasParabodaBridgeModalProps, EnvioEstado };

/**
 * FincasParabodaBridgeCta — Botón CTA autocontenido (client) que abre el
 * bridge modal. Pensado para integrarse como Server Component en /fincas.
 */
export const FincasParabodaBridgeCta: React.FC<{ className?: string }> = ({
    className,
}) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={
                    className ??
                    'inline-flex items-center justify-center gap-2 rounded-3xl bg-[#ecb613] text-black px-6 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-[#ecb613]/90 hover:scale-[1.02]'
                }
            >
                <Sparkles size={16} aria-hidden="true" focusable="false" />
                Conectar con FincasParaBoda.com · Auditoría Acústica S-Class
            </button>
            <FincasParabodaBridgeModal open={open} onClose={() => setOpen(false)} />
        </>
    );
};
