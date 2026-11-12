'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/checkout/CartContext';
import { SovereignCollectiveEventBuilder } from '@/components/checkout/SovereignCollectiveEventBuilder';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
} from '@/lib/constants/ear-os-ssot';
import { CONDICIONES_CONTRATO_SOLISTA } from '@/lib/pricing/solista-pricing';

/**
 * Cláusulas contractuales que el resumen previo al pago declara SIEMPRE.
 * Una sola fuente (motor de precios) para que copy y cálculo no diverjan.
 */
const CLAUSULAS_RESUMEN: ReadonlyArray<{ titulo: string; texto: string }> = [
  { titulo: 'Kilometraje', texto: `${CONDICIONES_CONTRATO_SOLISTA.kmIncluidos} ${CONDICIONES_CONTRATO_SOLISTA.costeKmAdicional}` },
  { titulo: 'Reserva y liquidación', texto: `${CONDICIONES_CONTRATO_SOLISTA.reserva} ${CONDICIONES_CONTRATO_SOLISTA.liquidacion}` },
  { titulo: 'Cancelación', texto: CONDICIONES_CONTRATO_SOLISTA.cancelacion },
  { titulo: 'Fuerza mayor', texto: CONDICIONES_CONTRATO_SOLISTA.fuerzaMayor },
];

/**
 * Nota de pasarela: el depósito histórico de 100,00 € sigue vigente para los
 * packs cerrados; la reserva del 50% aplica al Solista bajo la directiva del
 * CEO. Se declara el importe mínimo de pasarela para que el cliente sepa que
 * ningún cargo puede quedar por debajo de esa cifra.
 */
const NOTA_PASARELA = `Depósito mínimo de pasarela: ${DEPOSITO_STRIPE_EUR.toFixed(2).replace('.', ',')} €. Los cargos por debajo de esa cifra corresponden únicamente a pruebas privadas de pasarela.`;


export function SovereignFullCheckoutExperience() {
  const { items, subtotalEur, fianzaStripeEur, liquidacionEventoEur } = useCart();

  // Estados de los Pasos de Pago (Step-by-Step Flow)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Formulario de Contacto y Fecha
  const [clientData, setClientData] = useState({
    nombre: 'Edwin Agudelo',
    email: 'contacto@productoraear.com',
    telefono: '+34 693 693 048',
    fechaEvento: '2026-11-20',
    localidad: 'Méntrida (Toledo)',
  });

  // Método de Pago
  const [paymentMethod, setPaymentMethod] = useState<'stripe_card' | 'bizum' | 'apple_pay'>('stripe_card');

  // Modal de Venta Adicional (Upsell)
  const [isUpsellModalOpen, setIsUpsellModalOpen] = useState(false);
  const [hasAddedUpsell, setHasAddedUpsell] = useState(false);

  // Confirmación Final
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Ofrecer upsell de microfonía inalámbrica o acústica antes de pagar
      if (!hasAddedUpsell) {
        setIsUpsellModalOpen(true);
        return;
      }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
      setIsConfirmed(true);
    }
  };

  const handleAddUpsell = () => {
    setHasAddedUpsell(true);
    setIsUpsellModalOpen(false);
    setCurrentStep(2);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-zinc-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a la Matriz EAR OS</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Pasarela Segura SSL 256-Bit</span>
          </div>
        </div>

        {/* 1. INDICADOR DE PASOS DE PAGO (3 PASOS) */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-10 text-xs font-mono">
          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
              currentStep === 1
                ? 'border-amber-400 bg-amber-500/10 text-white'
                : 'border-white/10 bg-zinc-950/60 text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center font-bold">
              1
            </span>
            <span className="truncate">Datos & Fecha</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
              currentStep === 2
                ? 'border-amber-400 bg-amber-500/10 text-white'
                : 'border-white/10 bg-zinc-950/60 text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center font-bold">
              2
            </span>
            <span className="truncate">Método de Pago</span>
          </div>

          <div
            className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
              currentStep === 3
                ? 'border-emerald-400 bg-emerald-500/10 text-white'
                : 'border-white/10 bg-zinc-950/60 text-zinc-500'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-zinc-900 border border-white/20 flex items-center justify-center font-bold">
              3
            </span>
            <span className="truncate">Confirmación</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Interactive Stage (Left col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* PASO 1: DATOS DEL EVENTO Y CALENDARIO */}
            {currentStep === 1 && (
              <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
                <h3 className="text-xl font-bold font-display text-white mb-2">
                  1. Reserva de Fecha & Titular
                </h3>
                <p className="text-xs text-zinc-400 mb-6 font-sans">
                  Los datos introducidos quedan vinculados al contrato digital y al bloqueo pesimista en calendario.
                </p>

                <div className="space-y-4 text-xs font-mono">
                  <div>
                    <label className="block text-zinc-400 mb-1">Nombre Completo / Razón Social</label>
                    <input
                      type="text"
                      value={clientData.nombre}
                      onChange={(e) => setClientData({ ...clientData, nombre: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Teléfono Móvil (WhatsApp)</label>
                      <input
                        type="text"
                        value={clientData.telefono}
                        onChange={(e) => setClientData({ ...clientData, telefono: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Correo Electrónico</label>
                      <input
                        type="email"
                        value={clientData.email}
                        onChange={(e) => setClientData({ ...clientData, email: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-zinc-400 mb-1">Fecha del Evento (Lock Atómico)</label>
                      <input
                        type="date"
                        value={clientData.fechaEvento}
                        onChange={(e) => setClientData({ ...clientData, fechaEvento: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 mb-1">Municipio / Recinto</label>
                      <input
                        type="text"
                        value={clientData.localidad}
                        onChange={(e) => setClientData({ ...clientData, localidad: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Continuar a Métodos de Pago</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* PASO 2: MÉTODOS DE PAGO */}
            {currentStep === 2 && (
              <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
                <h3 className="text-xl font-bold font-display text-white mb-2">
                  2. Selección de Pasarela y Fianza
                </h3>
                <p className="text-xs text-zinc-400 mb-6 font-sans">
                  Pagas únicamente la fianza deducible de {fianzaStripeEur.toFixed(2)} € para fijar el Price-Lock.
                </p>

                {/* Métodos de Pago Disponibles */}
                <div className="space-y-3 mb-6">
                  <div
                    onClick={() => setPaymentMethod('stripe_card')}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'stripe_card'
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-5 h-5 text-amber-400" />
                      <div>
                        <div className="text-xs font-mono font-bold text-white">Tarjeta de Crédito / Débito (Stripe)</div>
                        <div className="text-[11px] text-zinc-400">Procesado con SHA-256 e idempotencia 1:1</div>
                      </div>
                    </div>
                    <span className="w-3 h-3 rounded-full border border-white/20 bg-amber-400" />
                  </div>

                  <div
                    onClick={() => setPaymentMethod('apple_pay')}
                    className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                      paymentMethod === 'apple_pay'
                        ? 'border-amber-400 bg-amber-500/10'
                        : 'border-white/10 bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-cyan-400" />
                      <div>
                        <div className="text-xs font-mono font-bold text-white">Apple Pay / Google Pay</div>
                        <div className="text-[11px] text-zinc-400">Pago biométrico en 1 clic</div>
                      </div>
                    </div>
                    <span className="w-3 h-3 rounded-full border border-white/20 bg-zinc-800" />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs font-mono text-zinc-400 hover:text-white"
                  >
                    ← Modificar Datos
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    disabled={isConfirmed}
                    aria-disabled={isConfirmed}
                    className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs font-mono uppercase tracking-wider transition-all ${
                      isConfirmed
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-amber-400 to-amber-500 text-zinc-950 shadow-[0_0_20px_rgba(236,182,19,0.3)] hover:scale-105 active:scale-95 cursor-pointer'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isConfirmed
                        ? 'Reserva Confirmada'
                        : `Confirmar Fianza (${fianzaStripeEur.toFixed(2)} €)`}
                    </span>
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: CONFIRMACIÓN Y RECIBO CLARO */}
            {currentStep === 3 && (
              <div className="p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-zinc-950/90 backdrop-blur-xl text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-400 mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <h3 className="text-2xl font-bold font-display text-white">
                  ¡Fecha VIP Bloqueada Exitosamente!
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto font-sans leading-relaxed">
                  Se ha generado tu recibo oficial y contrato digital con cifrado SHA-256. El depósito de{' '}
                  <strong className="text-emerald-400">{fianzaStripeEur.toFixed(2)} €</strong> se ha deducido
                  automáticamente de tu liquidación final.
                </p>

                {/* Recibo Claro */}
                <div className="max-w-md mx-auto p-4 rounded-2xl bg-zinc-900 border border-white/10 text-left text-xs font-mono space-y-2">
                  <div className="flex justify-between text-zinc-400">
                    <span>Identificador de Lock:</span>
                    <span className="text-white">EAR-LOCK-{Date.now().toString().slice(-6)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Titular:</span>
                    <span className="text-white">{clientData.nombre}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Fecha Bloqueada:</span>
                    <span className="text-amber-400 font-bold">{clientData.fechaEvento}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Localidad:</span>
                    <span className="text-white">{clientData.localidad}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 pt-2 border-t border-white/5 font-bold">
                    <span>Reserva Pagada (50%):</span>
                    <span>{fianzaStripeEur.toFixed(2)} € Deducible</span>
                  </div>
                </div>

                <div className="pt-4">
                  <a
                    href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hola Edwin, acabo de confirmar mi reserva VIP para el ${clientData.fechaEvento}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-bold transition-all"
                  >
                    <span>Notificar a Centralita ({CENTRALITA_EAR_OS})</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary (Right col 5) */}
          <div className="lg:col-span-5 p-6 rounded-3xl border border-white/10 bg-zinc-950/80 backdrop-blur-xl space-y-4">
            <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider pb-3 border-b border-white/10">
              Resumen del Pedido
            </h4>

            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-xs font-mono">
                  <span className="text-zinc-300">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="text-white font-bold">{(i.unitPriceEur * i.quantity).toFixed(2)} €</span>
                </div>
              ))}

              {hasAddedUpsell && (
                <div className="flex justify-between text-xs font-mono text-amber-300">
                  <span>1x Pack Microfonía Shure Axient Digital</span>
                  <span>+90.00 €</span>
                </div>
              )}
            </div>

            {/* Inyector de Servicios Colectivos Faltantes en el Carrito */}
            <div className="pt-4 border-t border-white/10">
              <details className="group">
                <summary className="cursor-pointer text-[11px] font-mono text-[#ecb613] hover:text-amber-300 flex items-center justify-between">
                  <span>¿Añadir más servicios a este evento?</span>
                  <span className="group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div className="pt-3">
                  <SovereignCollectiveEventBuilder
                    title="Añadir a Este Evento"
                    subtitle="Selecciona servicios complementarios y se sumarán automáticamente a esta misma reserva."
                    activeCategory={null}
                  />
                </div>
              </details>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal Contratación:</span>
                <span>{(subtotalEur + (hasAddedUpsell ? 90 : 0)).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Reserva de fecha (50%):</span>
                <span>-{fianzaStripeEur.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-white text-sm font-bold pt-2 border-t border-white/5">
                <span>Restante en Evento:</span>
                <span>{(liquidacionEventoEur + (hasAddedUpsell ? 90 : 0)).toFixed(2)} €</span>
              </div>
            </div>

            {/* DESGLOSE TRANSACCIONAL COMPLETO (100% de las condiciones) */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              <h5 className="text-[11px] font-mono font-bold text-white uppercase tracking-wider">
                Condiciones completas del contrato
              </h5>
              <dl className="space-y-2.5 text-[11px] font-mono">
                <div>
                  <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Concepto</dt>
                  <dd className="text-zinc-300 leading-relaxed">{CONDICIONES_CONTRATO_SOLISTA.concepto}</dd>
                </div>
                {CLAUSULAS_RESUMEN.map((clausula) => (
                  <div key={clausula.titulo}>
                    <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">
                      {clausula.titulo}
                    </dt>
                    <dd className="text-zinc-300 leading-relaxed">{clausula.texto}</dd>
                  </div>
                ))}
                <div>
                  <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">
                    Fecha límite de liquidación
                  </dt>
                  <dd className="text-zinc-300 leading-relaxed">
                    72 horas antes del evento ({clientData.fechaEvento}).
                  </dd>
                </div>
                <div>
                  <dt className="text-zinc-500 uppercase tracking-wider text-[10px]">Pasarela</dt>
                  <dd className="text-zinc-300 leading-relaxed">{NOTA_PASARELA}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* MODAL DE VENTA ADICIONAL (UPSELL) */}
        {isUpsellModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="max-w-md w-full bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold font-display text-white">
                ¿Añadir Microfonía Shure Axient Digital?
              </h3>

              <p className="text-xs text-zinc-400 font-sans leading-relaxed">
                Refuerzo acústico inalámbrico de máxima inmunidad RF para discursos de novios, presidentes o ceremonia sin cortes.
              </p>

              <div className="text-2xl font-black font-mono text-amber-400">
                +90,00 € <span className="text-xs text-zinc-500 font-normal">/ Evento</span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsUpsellModalOpen(false);
                    setCurrentStep(2);
                  }}
                  className="flex-1 py-3 rounded-xl border border-white/10 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono"
                >
                  Continuar sin extras
                </button>

                <button
                  type="button"
                  onClick={handleAddUpsell}
                  className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider"
                >
                  Añadir al Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

