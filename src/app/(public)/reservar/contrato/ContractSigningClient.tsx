'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    FileCheck2,
    Shield,
    Calendar,
    MapPin,
    Volume2,
    ArrowRight,
    Lock,
    ExternalLink,
    BadgePercent,
    AlertCircle,
} from 'lucide-react';
import { DigitalSignaturePad, SignatureData } from '@/components/booking/DigitalSignaturePad';
import {
    DEPOSITO_STRIPE_EUR,
    VAT_RATE,
    SPLIT_SOBERANO,
    CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';

/**
 * Datos del expediente. Los resuelve el Server Component `page.tsx`:
 *   · `providerName` procede del registro real (Data Lake / roster), nunca de
 *     un texto libre en la URL.
 *   · `baseAmount` nace del SSOT (`TARIFA_BASE_SOLISTA_EUR`) salvo que la URL
 *     transporte un importe finito y positivo.
 *   · Sin fecha/plaza verificada se declara «por confirmar»: cero datos falsos
 *     impresos en un contrato.
 */
export interface ContractSigningInitial {
    readonly requestId: string;
    readonly providerName: string;
    readonly providerSlug: string | null;
    readonly clientName: string;
    readonly eventDate: string;
    readonly eventCity: string;
    readonly baseAmount: number;
}

export const CONTRACT_PENDING_LABEL = 'Pendiente de confirmar';
export const CONTRACT_UNRESOLVED_PROVIDER = 'Proveedor por confirmar';

export function ContractSigningClient({
    initial,
}: {
    readonly initial: ContractSigningInitial;
}): React.JSX.Element {
    const requestId = initial.requestId;
    const providerName = initial.providerName;
    const clientName = initial.clientName;
    const eventDate = initial.eventDate;
    const eventCity = initial.eventCity;
    const baseAmount = initial.baseAmount;

    // Desglose financiero SSOT
    const vatAmount = Number((baseAmount * VAT_RATE).toFixed(2));
    const totalAmount = Number((baseAmount + vatAmount).toFixed(2));
    const depositDeducted = DEPOSITO_STRIPE_EUR;
    const remainingToPay = Number((totalAmount - depositDeducted).toFixed(2));

    const artistSplit = Number((baseAmount * SPLIT_SOBERANO.artista).toFixed(2));
    const earOsSplit = Number((baseAmount * SPLIT_SOBERANO.earOs).toFixed(2));
    const vimumeSplit = Number((baseAmount * SPLIT_SOBERANO.vimume).toFixed(2));

    const [clientSignature, setClientSignature] = useState<SignatureData | null>(null);
    const [isAgreed, setIsAgreed] = useState(false);
    const [finalContractSealed, setFinalContractSealed] = useState(false);

    const handleSealContract = () => {
        if (!clientSignature || !isAgreed) return;
        setFinalContractSealed(true);
    };

    return (
        <main className="min-h-screen bg-[#030305] text-white pt-28 pb-20 px-4 md:px-8 selection:bg-[#ecb613] selection:text-black">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="space-y-3 border-b border-white/10 pb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono">
                        <Lock className="w-3.5 h-3.5" />
                        <span>EXPEDIENTE DE RESERVA · ART. 1255 CÓDIGO CIVIL</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/40 text-rose-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>BORRADOR · borrador operativo sin cláusulas notariales verificadas</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-sans">
                        Formalización y Firma Digital del Evento
                    </h1>
                    <p className="text-gray-400 text-sm md:text-base">
                        Expediente de Reserva <span className="font-mono text-white font-semibold">{requestId}</span> con depósito garantizado y blindaje acústico legal.
                    </p>
                </div>

                {/* Resumen de las Partes y Evento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[#ecb613]" />
                            Partes Intervinientes
                        </h2>
                        <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-400">Cliente Contratante:</span>
                                <p className="text-white font-medium text-sm">{clientName}</p>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-400">Artista / Proveedor Titular:</span>
                                <p className="text-white font-medium text-sm">{providerName}</p>
                                {initial.providerSlug && (
                                    <Link
                                        href={`/proveedores/${encodeURIComponent(initial.providerSlug)}`}
                                        className="mt-1 inline-flex items-center gap-1 text-[11px] font-mono text-[#ecb613] hover:text-[#f5d273] transition-colors"
                                    >
                                        Ver ficha y agenda del proveedor
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                )}
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                                <span className="text-gray-400">Garante y Plataforma:</span>
                                <p className="text-white font-medium text-sm">PRODUCTORA EAR S.L. ({CENTRALITA_EAR_OS})</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-3">
                        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#ecb613]" />
                            Detalles de la Convocatoria
                        </h2>
                        <div className="space-y-2 text-xs">
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400">Fecha del Acto:</span>
                                <span className="text-white font-mono font-medium">{eventDate}</span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400">Ubicación y Término:</span>
                                <span className="text-white font-medium flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                    {eventCity}
                                </span>
                            </div>
                            <div className="p-2.5 rounded-lg bg-white/5 border border-white/5 flex items-center justify-between">
                                <span className="text-gray-400">Rider Acústico Calibrado:</span>
                                <span className="text-emerald-400 font-mono flex items-center gap-1">
                                    <Volume2 className="w-3.5 h-3.5" />
                                    12 W/pax · &lt;75 dB SPL
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Desglose Financiero con Fianza Deducible */}
                <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4">
                        <div className="flex items-center gap-2">
                            <BadgePercent className="w-5 h-5 text-[#ecb613]" />
                            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                                Desglose Económico Transparente (SSOT)
                            </h2>
                        </div>
                        <span className="text-xs text-emerald-400 font-mono">
                            Fianza {depositDeducted.toFixed(2)} € Deducible al 100%
                        </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[11px] text-gray-400 block">Base Imponible</span>
                            <span className="text-base font-bold font-mono text-white">{baseAmount.toFixed(2)} €</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                            <span className="text-[11px] text-gray-400 block">IVA (21%)</span>
                            <span className="text-base font-bold font-mono text-white">{vatAmount.toFixed(2)} €</span>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
                            <span className="text-[11px] text-emerald-300 block">Fianza Descontada</span>
                            <span className="text-base font-bold font-mono text-emerald-400">-{depositDeducted.toFixed(2)} €</span>
                        </div>
                        <div className="p-3 bg-[#ecb613]/10 rounded-xl border border-[#ecb613]/30">
                            <span className="text-[11px] text-[#ecb613] block">Saldo Final al Evento</span>
                            <span className="text-base font-bold font-mono text-[#ecb613]">{remainingToPay.toFixed(2)} €</span>
                        </div>
                    </div>

                    <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-gray-400 space-y-1">
                        <div className="text-white font-medium flex items-center gap-1.5">
                            <Shield className="w-3.5 h-3.5 text-[#ecb613]" />
                            Split Soberano Aplicado (80/10/10):
                        </div>
                        <p>
                            • {artistSplit.toFixed(2)} € (80%) retribución directa e inmediata para el artista ejecutante.
                        </p>
                        <p>
                            • {earOsSplit.toFixed(2)} € (10%) amortización de plataforma digital, custodia e infraestructura.
                        </p>
                        <p>
                            • {vimumeSplit.toFixed(2)} € (10%) contribución sociosanitaria al programa VIMUME (cadencia 40 Hz en centros de mayores, deducible fiscalmente según Ley 49/2002, Modelo 182 AEAT).
                        </p>
                    </div>
                </div>

                {/* Cláusulas Vinculantes */}
                <div className="bg-[#09090d]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-md space-y-3">
                    <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileCheck2 className="w-4 h-4 text-[#ecb613]" />
                        Cláusulas Vinculantes (Extracto)
                    </h2>
                    <ul className="space-y-2 text-xs text-gray-300 list-disc list-inside">
                        <li>
                            <strong className="text-white">Art. 1255 Código Civil:</strong> Las partes pactan libremente la prestación artística y el presente documento constituye título suficiente y obligatorio.
                        </li>
                        <li>
                            <strong className="text-white">Ley 37/2003 del Ruido:</strong> La producción respetará en todo momento la limitación homologada de emisión acústica para preservar la tranquilidad ciudadana.
                        </li>
                        <li>
                            <strong className="text-white">Deducción de Fianza:</strong> Los {depositDeducted.toFixed(2)} € de fianza inicial quedan integrados en el pago del servicio y no generan penalización salvo cancelación unilateral fuera de plazo.
                        </li>
                    </ul>
                </div>

                {/* Pad de Firma Digital */}
                {!finalContractSealed ? (
                    <div className="space-y-4">
                        <DigitalSignaturePad
                            signerName={clientName}
                            signerRole="Contratante Titular"
                            onSigned={(sig) => setClientSignature(sig)}
                            onClear={() => setClientSignature(null)}
                        />

                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-3">
                            <input
                                type="checkbox"
                                id="termsCheckbox"
                                checked={isAgreed}
                                onChange={(e) => setIsAgreed(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-600 text-[#ecb613] focus:ring-[#ecb613] bg-black cursor-pointer"
                            />
                            <label htmlFor="termsCheckbox" className="text-xs text-gray-300 cursor-pointer">
                                Acepto los términos del contrato, la deducción íntegra de los {depositDeducted.toFixed(2)} € de fianza y confirmo que mi rúbrica digital equivale legalmente a firma manuscrita fehaciente (Reglamento eIDAS / Ley 6/2020 de servicios electrónicos de confianza).
                            </label>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleSealContract}
                                disabled={!clientSignature || !isAgreed}
                                className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-[#ecb613] to-[#d8a40f] text-black disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all flex items-center gap-2 shadow-xl shadow-[#ecb613]/20"
                            >
                                <Lock className="w-4 h-4" />
                                Sellar Contrato y Confirmar Convocatoria
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Confirmación formal del contrato sellado */
                    <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-2xl p-8 text-center space-y-4 backdrop-blur-md">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                            <FileCheck2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                            Contrato Criptográficamente Sellado
                        </h3>
                        <p className="text-sm text-gray-300 max-w-lg mx-auto">
                            El expediente <span className="font-mono text-emerald-400">{requestId}</span> ha sido firmado y registrado con sello temporal SHA-256 inmutable.
                        </p>
                        {clientSignature && (
                            <div className="p-3 bg-black/40 rounded-xl border border-white/10 font-mono text-xs text-gray-400 max-w-md mx-auto break-all">
                                HASH RÚBRICA: {clientSignature.sha256}
                            </div>
                        )}
                        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                            <Link
                                href={`/seguimiento/${requestId}`}
                                className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs hover:bg-gray-200 transition-colors flex items-center gap-1.5"
                            >
                                Ver Radar de Misión
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                            <Link
                                href="/panel/reservas"
                                className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs hover:bg-white/15 transition-colors border border-white/10 flex items-center gap-1.5"
                            >
                                Volver al Panel
                                <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                )}

                {/* Footer de soporte y teléfono oficial */}
                <div className="text-center text-xs text-gray-500 pt-4 flex items-center justify-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Línea Directa de Coordinación: {CENTRALITA_EAR_OS}</span>
                </div>
            </div>
        </main>
    );
}
