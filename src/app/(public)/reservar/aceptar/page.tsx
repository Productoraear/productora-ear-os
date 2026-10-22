'use client';

import React, { useState, useEffect, useTransition, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Clock,
    ShieldCheck,
    Lock,
    Sparkles,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ExternalLink,
    PhoneCall
} from 'lucide-react';
import { TARIFA_BASE_SOLISTA_EUR, DEPOSITO_STRIPE_EUR, CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';

interface TokenPayload {
    requestId: string;
    providerId: string;
    timestamp: number;
}

interface VerificationState {
    loading: boolean;
    valid: boolean;
    error?: string;
    payload?: TokenPayload;
    remainingMs?: number;
    alreadyAccepted?: boolean;
    checkoutUrl?: string | null;
}

interface AcceptResult {
    success: boolean;
    status?: string;
    requestId?: string;
    checkoutUrl?: string;
    acceptedAt?: string;
    message?: string;
    error?: string;
}

function AcceptBookingContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';

    const [state, setState] = useState<VerificationState>({
        loading: true,
        valid: false
    });

    const [timeLeftMs, setTimeLeftMs] = useState<number>(0);
    const [isPending, startTransition] = useTransition();
    const [acceptResult, setAcceptResult] = useState<AcceptResult | null>(null);

    // 1. Verificación inicial del token al montar el componente
    useEffect(() => {
        if (!token) {
            setState({
                loading: false,
                valid: false,
                error: 'Enlace incompleto: falta el token criptográfico firmado de aceptación.'
            });
            return;
        }

        let isMounted = true;

        async function verifyToken() {
            try {
                const res = await fetch(`/api/booking/accept?token=${encodeURIComponent(token)}`);
                const data = (await res.json()) as {
                    success: boolean;
                    valid?: boolean;
                    payload?: TokenPayload;
                    remainingMs?: number;
                    error?: string;
                    alreadyAccepted?: boolean;
                    checkoutUrl?: string | null;
                };

                if (!isMounted) return;

                if (data.success && data.valid && data.payload) {
                    setState({
                        loading: false,
                        valid: true,
                        payload: data.payload,
                        remainingMs: data.remainingMs ?? 0,
                        alreadyAccepted: data.alreadyAccepted,
                        checkoutUrl: data.checkoutUrl
                    });
                    setTimeLeftMs(data.remainingMs ?? 0);
                    if (data.alreadyAccepted && data.checkoutUrl) {
                        setAcceptResult({
                            success: true,
                            status: 'ACCEPTED_BY_PROVIDER',
                            requestId: data.payload.requestId,
                            checkoutUrl: data.checkoutUrl,
                            message: 'Este bolo ya ha sido formalmente confirmado.'
                        });
                    }
                } else {
                    setState({
                        loading: false,
                        valid: false,
                        error: data.error ?? 'El token de invitación no es válido o ha expirado.'
                    });
                }
            } catch {
                if (isMounted) {
                    setState({
                        loading: false,
                        valid: false,
                        error: 'Error de conexión al verificar la solicitud de reserva.'
                    });
                }
            }
        }

        void verifyToken();

        return () => {
            isMounted = false;
        };
    }, [token]);

    // 2. Temporizador dinámico regresivo para la ventana SLA de 2 horas
    useEffect(() => {
        if (!state.valid || timeLeftMs <= 0 || acceptResult?.success) return;

        const interval = setInterval(() => {
            setTimeLeftMs((prev) => {
                if (prev <= 1000) {
                    clearInterval(interval);
                    setState((s) => ({ ...s, valid: false, error: 'La ventana de exclusividad de 2 horas ha expirado.' }));
                    return 0;
                }
                return prev - 1000;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [state.valid, timeLeftMs, acceptResult]);

    // 3. Formateo amigable del tiempo restante (MM:SS)
    const formatTimeRemaining = (ms: number): string => {
        if (ms <= 0) return '00:00';
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        if (hours > 0) {
            return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
        }
        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    // 4. Acción de aceptación formal
    const handleAcceptBooking = () => {
        startTransition(async () => {
            try {
                const res = await fetch('/api/booking/accept', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token })
                });

                const data = (await res.json()) as AcceptResult;

                if (data.success) {
                    setAcceptResult(data);
                } else {
                    setAcceptResult({
                        success: false,
                        error: data.error ?? 'No se pudo registrar la confirmación del bolo.'
                    });
                }
            } catch {
                setAcceptResult({
                    success: false,
                    error: 'Error de red al conectar con el servidor central de Productora EAR.'
                });
            }
        });
    };

    // Cálculos de honorarios basados en el Split Soberano (80% Artista)
    const cacheEstimadoEur = TARIFA_BASE_SOLISTA_EUR; // 350 € base
    const netoArtistaEur = Math.round(cacheEstimadoEur * 0.80); // 80% = 280 €
    const fianzaDeducibleEur = DEPOSITO_STRIPE_EUR; // 100 €

    return (
        <main className="min-h-screen bg-[#030305] text-white pt-28 pb-20 px-4 md:px-8 flex items-center justify-center selection:bg-[#ecb613] selection:text-black">
            <div className="w-full max-w-xl space-y-6">

                {/* Badge de Cabecera */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-mono text-xs uppercase tracking-widest">
                        <Sparkles size={13} className="text-[#ecb613]" />
                        <span>Confirmación Soberana de Bolo</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black font-syne uppercase tracking-tight text-white">
                        Aceptación de Fecha Prioritaria
                    </h1>
                    <p className="text-xs text-zinc-400 font-mono">
                        Productora EAR // Ventana de Exclusividad de Proveedor
                    </p>
                </div>

                {/* ESTADO 1: CARGANDO */}
                {state.loading && (
                    <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 p-8 text-center space-y-4 backdrop-blur-md">
                        <div className="w-10 h-10 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs font-mono text-zinc-400">Verificando firma criptográfica HMAC SHA-256...</p>
                    </div>
                )}

                {/* ESTADO 2: TOKEN INVÁLIDO O EXPIRADO */}
                {!state.loading && !state.valid && (
                    <div className="rounded-3xl bg-red-950/30 border border-red-500/30 p-8 text-center space-y-4 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
                            <AlertCircle size={24} />
                        </div>
                        <h2 className="text-lg font-bold font-syne text-white">Invitación No Disponible</h2>
                        <p className="text-xs text-zinc-300 font-mono leading-relaxed max-w-md mx-auto">
                            {state.error}
                        </p>
                        <div className="pt-2">
                            <a
                                href={`tel:${CENTRALITA_EAR_OS.replace(/\s+/g, '')}`}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 border border-white/15 text-xs font-mono text-white hover:bg-white/10 transition-colors"
                            >
                                <PhoneCall size={14} className="text-[#ecb613]" />
                                <span>Contactar con Centralita Concierge</span>
                            </a>
                        </div>
                    </div>
                )}

                {/* ESTADO 3: TOKEN VÁLIDO - CONFIRMACIÓN PENDIENTE */}
                {!state.loading && state.valid && !acceptResult?.success && (
                    <div className="rounded-3xl bg-[#09090d]/90 border border-white/10 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-2xl">

                        {/* Banner Cuenta Atrás SLA */}
                        <div className="p-4 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                                <Clock size={18} className="text-[#ecb613] animate-pulse" />
                                <div>
                                    <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                                        Tiempo Restante para Aceptar
                                    </span>
                                    <span className="text-lg font-mono font-black text-[#ecb613]">
                                        {formatTimeRemaining(timeLeftMs)}
                                    </span>
                                </div>
                            </div>
                            <span className="text-[9px] font-mono px-2 py-1 rounded bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/40 uppercase font-bold">
                                SLA 2 Horas
                            </span>
                        </div>

                        {/* Ficha Resumen del Bolo */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                                Datos del Bolo Solicitado
                            </h3>
                            <div className="p-4 rounded-2xl bg-black/50 border border-white/5 space-y-3 font-mono text-xs">
                                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                    <span className="text-zinc-500">Expediente ID</span>
                                    <span className="font-bold text-white tracking-wider">{state.payload?.requestId}</span>
                                </div>
                                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                    <span className="text-zinc-500">Proveedor / Artista</span>
                                    <span className="text-[#AAD6CD] font-bold">{state.payload?.providerId}</span>
                                </div>
                                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                    <span className="text-zinc-500">Fianza Deducible Cliente</span>
                                    <span className="text-[#00E5FF] font-bold">{fianzaDeducibleEur},00 € (Stripe)</span>
                                </div>
                                <div className="flex items-center justify-between pt-1">
                                    <div className="flex items-center gap-1.5">
                                        <Sparkles size={14} className="text-[#ecb613]" />
                                        <span className="text-white font-bold">Tus Honorarios Netos (80%)</span>
                                    </div>
                                    <span className="text-base font-black text-[#ecb613]">
                                        {netoArtistaEur},00 €
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Cláusula de Transparencia Split Soberano */}
                        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-zinc-400 space-y-1">
                            <div className="flex items-center gap-1.5 text-white font-bold">
                                <ShieldCheck size={14} className="text-[#ecb613]" />
                                <span>Garantía de Cobro Split Soberano</span>
                            </div>
                            <p className="text-[10px] text-zinc-500 leading-tight">
                                Al aceptar la fecha, se genera de inmediato el enlace de pago de fianza de 100 € para el cliente.
                                El 80% íntegro de la liquidación final se abona directamente a tu cuenta sin comisiones ocultas.
                            </p>
                        </div>

                        {/* Error de envío si ocurre */}
                        {acceptResult?.error && (
                            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs font-mono text-red-300">
                                {acceptResult.error}
                            </div>
                        )}

                        {/* Botón de Acción Principal */}
                        <button
                            type="button"
                            onClick={handleAcceptBooking}
                            disabled={isPending || timeLeftMs <= 0}
                            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ecb613] via-amber-400 to-[#ecb613] hover:brightness-110 text-black font-syne font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(236,182,19,0.35)] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                    <span>Registrando Confirmación...</span>
                                </>
                            ) : (
                                <>
                                    <Lock size={16} />
                                    <span>Aceptar Fecha y Desbloquear Depósito de Fianza</span>
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </div>
                )}

                {/* ESTADO 4: ACEPTACIÓN EXITOSA Y ENLACE DE PAGO */}
                {acceptResult?.success && (
                    <div className="rounded-3xl bg-[#09090d]/90 border border-emerald-500/40 p-6 sm:p-8 space-y-6 backdrop-blur-md shadow-[0_0_50px_rgba(16,185,129,0.15)] text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30 animate-bounce">
                            <CheckCircle2 size={32} />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-xl sm:text-2xl font-black font-syne text-white uppercase">
                                ¡Bolo Confirmado Exitosamente!
                            </h2>
                            <p className="text-xs font-mono text-zinc-400">
                                La fecha ha quedado bloqueada para ti en el calendario operativo.
                            </p>
                        </div>

                        {/* Bloque Enlace de Pago / Stripe Checkout */}
                        {acceptResult.checkoutUrl && (
                            <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3 text-left">
                                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">
                                    Enlace de Fianza Generado para el Cliente (100 €)
                                </span>
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-[#00E5FF] break-all flex items-center justify-between gap-2">
                                    <span className="truncate">{acceptResult.checkoutUrl}</span>
                                    <a
                                        href={acceptResult.checkoutUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 p-1.5 rounded-lg bg-[#00E5FF]/20 text-[#00E5FF] hover:bg-[#00E5FF] hover:text-black transition-colors"
                                        title="Abrir Pasarela de Pago"
                                    >
                                        <ExternalLink size={14} />
                                    </a>
                                </div>
                                <p className="text-[10px] font-mono text-zinc-500">
                                    El concierge ha notificado simultáneamente al cliente vía WhatsApp para que formalice el abono de la fianza deducible.
                                </p>
                            </div>
                        )}

                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/artistas/dashboard"
                                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-mono text-xs font-bold transition-colors"
                            >
                                Ir al Dashboard de Artista
                            </Link>
                            <Link
                                href="/"
                                className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white font-mono text-xs transition-colors"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
}

export default function AceptarReservaPage() {
    return (
        <Suspense fallback={
            <main className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-4">
                <div className="w-8 h-8 border-2 border-[#ecb613] border-t-transparent rounded-full animate-spin" />
            </main>
        }>
            <AcceptBookingContent />
        </Suspense>
    );
}
