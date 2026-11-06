'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Undo2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import {
  DEPOSITO_STRIPE_EUR,
  LOGISTICA_KM_EXENTOS,
} from '@/lib/constants/ear-os-ssot';

/**
 * SovereignCartDrawer
 * Replicación 1:1 de HorizonX Cart Drawer:
 * - Cesta editable con control de cantidad (+ / -).
 * - Eliminación de artículos con notificación y función Deshacer (Undo).
 * - Barra de seguimiento de logística gratuita (< 50 km Hub Méntrida).
 * - Total desglosado con Fianza Deducible Stripe de 100,00 € (Price-Lock SHA-256).
 * - Navegación accesible por teclado y pantalla completa.
 */
export function SovereignCartDrawer() {
  const {
    isOpen,
    setIsOpen,
    items,
    removeItem,
    updateQuantity,
    lastRemovedItem,
    undoRemove,
    subtotalEur,
    fianzaStripeEur,
    liquidacionEventoEur,
    freeLogisticsProgress,
  } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={() => setIsOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-zinc-950 border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl relative">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h2 id="cart-title" className="text-base font-bold font-mono tracking-wider text-white uppercase">
                  Bolsa de Contratación ({items.length})
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Cerrar cajón de compra"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Free Logistics Progress Bar (Seguimiento de Logística Exenta) */}
            <div className="my-4 p-3 rounded-xl bg-zinc-900/60 border border-white/5">
              <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                <span className="flex items-center gap-1.5 text-zinc-300">
                  <Truck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hub Méntrida: 50 km Exentos</span>
                </span>
                <span className="text-cyan-400 font-bold">
                  {freeLogisticsProgress >= 100 ? 'Logística 0 € Cubierta' : `${freeLogisticsProgress.toFixed(0)}%`}
                </span>
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-500 rounded-full"
                  style={{ width: `${freeLogisticsProgress}%` }}
                />
              </div>
            </div>

            {/* Undo Notification Bar */}
            {lastRemovedItem && (
              <div className="mb-4 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-300 truncate">
                  "{lastRemovedItem.name}" eliminado
                </span>
                <button
                  type="button"
                  onClick={undoRemove}
                  className="inline-flex items-center gap-1 text-white hover:text-amber-200 underline cursor-pointer ml-2 flex-shrink-0"
                >
                  <Undo2 className="w-3 h-3" />
                  <span>Deshacer</span>
                </button>
              </div>
            )}

            {/* Cart Items List */}
            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-380px)] pr-1">
              {items.length === 0 ? (
                <div className="py-16 text-center text-zinc-500 font-mono text-xs">
                  Tu bolsa de contratación está vacía.
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-2xl bg-zinc-900/60 border border-white/5 flex flex-col justify-between transition-all hover:border-white/10"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        {item.badge && (
                          <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 mb-1 inline-block">
                            {item.badge}
                          </span>
                        )}
                        <h3 className="text-xs font-bold text-white leading-snug">{item.name}</h3>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{item.description}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        aria-label={`Eliminar ${item.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-lg border border-white/5">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-zinc-400 hover:text-white p-0.5"
                          aria-label="Reducir cantidad"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-white px-1.5">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-zinc-400 hover:text-white p-0.5"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Line Item Total */}
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-white">
                          {(item.unitPriceEur * item.quantity).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer & Checkout Trigger */}
          <div className="pt-4 border-t border-white/10 space-y-3 font-mono">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal Presupuesto:</span>
                <span className="text-zinc-200">{subtotalEur.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Fianza Stripe a Pagar Hoy:</span>
                <span>{fianzaStripeEur.toFixed(2)} € (100% Deducible)</span>
              </div>
              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>Liquidación Restante en Evento:</span>
                <span>{liquidacionEventoEur.toFixed(2)} €</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Proceder al Pago ({fianzaStripeEur.toFixed(2)} €)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 text-center">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Garantía Price-Lock SHA-256 · Calendario Inmutable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

