"use client";

import React, { useState } from 'react';
import { CreditCard, MessageCircle, FileText, AlertCircle } from 'lucide-react';
import { checkoutMariachiDeposit } from '@/app/actions/mariachiCheckoutActions';
import {
    MARIACHI_FORMATS,
    MARIACHI_DISPATCH_HUBS,
    calculateMariachiQuote,
    MariachiFormatId,
} from '@/lib/mariachi/mariachiDispatchCore';

interface MariachiLandingCtaProps {
    formatId: MariachiFormatId;
    finalCta: string;
    isB2g?: boolean;
}

/**
 * CTA de conversión real de las sub-landings mariachi.
 * - Retail: botón primario de bloqueo Stripe (100 € deducible) + WhatsApp.
 * - B2G (Fiestas patronales / Ayuntamientos): sin pago online, FACe + WhatsApp.
 * Todo botón escribe de verdad (Stripe real o centralita WhatsApp verificada).
 */
export default function MariachiLandingCta({ formatId, finalCta, isB2g = false }: MariachiLandingCtaProps) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const format = MARIACHI_FORMATS.find((f) => f.id === formatId) ?? MARIACHI_FORMATS[0];
    const reserveHub = MARIACHI_DISPATCH_HUBS[0];

    const whatsappText = encodeURIComponent(
        `Hola, quiero información para: ${finalCta}.\n\n` +
        `Formación recomendada: ${format.name} (${format.members} músicos).\n` +
        `Tarifa base: ${format.basePrice} € + logística real según distancia.\n\n` +
        `¿Podéis confirmar disponibilidad y presupuesto cerrado?`
    );

    const handleStripeCheckout = async () => {
        if (isB2g) return;
        try {
            setLoading(true);
            setErrorMsg(null);
            const quote = calculateMariachiQuote(
                formatId,
                { lat: reserveHub.lat, lng: reserveHub.lng },
                `${format.name} — sub-landing precio cerrado`,
                2,
                reserveHub.id,
            );
            const result = await checkoutMariachiDeposit({
                formatId,
                destinationLat: reserveHub.lat,
                destinationLng: reserveHub.lng,
                destinationName: `${format.name} — precio cerrado`,
                endHour: 2,
                overrideHubId: reserveHub.id,
                repertoireSongs: 0,
                clientHash: quote.priceLockHash,
                issuedAt: Date.now(),
            });
            if (!result.ok) {
                setErrorMsg(result.error || 'No se pudo iniciar la pasarela de pago Stripe.');
                return;
            }
            window.location.href = result.url;
        } catch (err: unknown) {
            console.error('MARIACHI_LANDING_STRIPE_ERROR:', err);
            setErrorMsg('Error de conexión con la pasarela de pago.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-3">
            {errorMsg && (
                <div role="alert" className="flex items-center gap-3 p-4 rounded-2xl bg-red-950/60 border border-red-500/50 text-red-200 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                </div>
            )}
            <div className="flex flex-wrap items-center gap-4">
            {isB2g ? (
                <>
                    <a
                        href="https://wa.me/34693693048?text=Hola,%20solicito%20una%20memoria%20B2G%20desglosada%20para%20contrataci%C3%B3n%20por%20contrato%20menor%20(Art.%20118%20LCSP)%20y%20factura%20FACe"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#00E5FF] hover:bg-cyan-300 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-[#00E5FF]/20"
                    >
                        <MessageCircle size={15} />
                        Solicitar memoria B2G por WhatsApp
                    </a>
                    <a
                        href="tel:+34693693048"
                        className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all"
                    >
                        <FileText size={15} className="text-[#00E5FF]" />
                        Factura FACe · Centralita
                    </a>
                </>
            ) : (
                <>
                    <button
                        onClick={handleStripeCheckout}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-lg shadow-[#ecb613]/25 disabled:opacity-50 cursor-pointer"
                    >
                        <CreditCard size={15} />
                        {loading ? 'Conectando...' : 'Bloquear Fecha (100 €)'}
                    </button>
                    <a
                        href={`https://wa.me/34693693048?text=${whatsappText}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-mono text-xs uppercase tracking-wider transition-all"
                    >
                        <MessageCircle size={15} className="text-emerald-400" />
                        {finalCta}
                    </a>
                </>
            )}
            </div>
        </div>
    );
}