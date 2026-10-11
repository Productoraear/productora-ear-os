"use client";

import { useMemo, useState } from 'react';
import { Calculator, PhoneCall, ShieldCheck } from 'lucide-react';

interface AudiovisualCalculatorProps {
    tarifaBaseSolistaEur: number;
    depositoStripeEur: number;
    whatsappHref: string;
}

type ProductKey = 'led' | 'sonido' | 'iluminacion';

interface ProductOption {
    id: ProductKey;
    label: string;
    pricePerUnit: number;
}

const PRODUCTS: readonly ProductOption[] = [
    { id: 'led', label: 'Pantalla LED P2.9 (m²)', pricePerUnit: 320 },
    { id: 'sonido', label: 'Sonorización Bose F1', pricePerUnit: 450 },
    { id: 'iluminacion', label: 'Iluminación DMX (set)', pricePerUnit: 280 },
] as const;

/**
 * Simulador interactivo de alquiler audiovisual S-Class.
 * Calcula el presupuesto orientativo combinando módulos y aplicando
 * la tarifa base y depósito SSOT. El botón de cierre abre WhatsApp.
 */
export function AudiovisualCalculator({
    tarifaBaseSolistaEur,
    depositoStripeEur,
    whatsappHref,
}: AudiovisualCalculatorProps) {
    const [quantities, setQuantities] = useState<Record<ProductKey, number>>({
        led: 1,
        sonido: 1,
        iluminacion: 0,
    });

    const baseQuote = useMemo(() => {
        return PRODUCTS.reduce((total, product) => {
            const qty = quantities[product.id] ?? 0;
            return total + qty * product.pricePerUnit;
        }, tarifaBaseSolistaEur);
    }, [quantities, tarifaBaseSolistaEur]);

    const formatEur = (value: number): string =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(value);

    const updateQuantity = (id: ProductKey, delta: number): void => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max(0, (prev[id] ?? 0) + delta),
        }));
    };

    return (
        <div className="rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-6 sm:p-8 space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                    <Calculator className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">Simulador de Alquiler Audiovisual</h2>
                    <p className="text-xs text-white/50 font-mono">
                        Presupuesto orientativo instantáneo · Descuento íntegro del depósito al cerrar.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRODUCTS.map((product) => {
                    const qty = quantities[product.id] ?? 0;
                    return (
                        <div
                            key={product.id}
                            className="rounded-2xl bg-white/5 border border-white/5 p-4 space-y-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-bold text-white">{product.label}</span>
                                <span className="text-xs text-[#ecb613] font-mono">
                                    {formatEur(product.pricePerUnit)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    type="button"
                                    onClick={() => updateQuantity(product.id, -1)}
                                    aria-label={`Reducir ${product.label}`}
                                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                                >
                                    −
                                </button>
                                <span className="text-lg font-bold text-white tabular-nums">{qty}</span>
                                <button
                                    type="button"
                                    onClick={() => updateQuantity(product.id, 1)}
                                    aria-label={`Aumentar ${product.label}`}
                                    className="w-9 h-9 rounded-xl bg-[#ecb613] text-black font-bold hover:bg-[#d4a210] transition-all"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="rounded-2xl bg-black/40 border border-[#ecb613]/20 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="space-y-1">
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                        Presupuesto orientativo total
                    </span>
                    <p className="text-3xl font-extrabold text-white">{formatEur(baseQuote)}</p>
                    <p className="text-xs text-white/50 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#ecb613]" />
                        Incluye tarifa base SSOT y módulos seleccionados.
                    </p>
                </div>
                <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#ecb613] text-black font-bold px-6 py-3 rounded-xl text-xs uppercase tracking-widest hover:bg-[#d4a210] transition-all shadow-lg"
                >
                    <PhoneCall className="w-4 h-4" /> Solicitar presupuesto
                </a>
            </div>

            <p className="text-[11px] text-white/40 font-mono">
                Depósito de cierre deducible {formatEur(depositoStripeEur)} · Descontado íntegro de la
                liquidación final al confirmar fecha.
            </p>
        </div>
    );
}