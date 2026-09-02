'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  CheckCircle2,
  Clock,
  Flame,
  PhoneCall,
  Wallet,
  AlertCircle,
} from 'lucide-react';

interface StripeSmartLockCtaProps {
  vertical: string;
  intentSlug: string;
  priceBase: number;
  isUrgent?: boolean;
  daysUntilEvent?: number;
}

type FunnelState =
  | 'BLUR_LOCKED'
  | 'CAPTURE_CONTACT'
  | 'URGENCY_VALIDATION'
  | 'URGENCY_BYPASSED'
  | 'REDIRECTING_STRIPE'
  | 'UNLOCKED'
  | 'ERROR';

/**
 * 🔐 StripeSmartLockCta S-Class — Micro-Compromiso de 10 € con Price-Lock 72h
 *
 * Flujo:
 * 1. Contenido técnico y precios están detrás del blur.
 * 2. El usuario introduce su email/WhatsApp (CAPTURE_CONTACT).
 * 3. Si P0 urgencia → pregunta de validación → bypass sin cobro.
 * 4. Si estándar → Stripe Checkout 10 € → unlock 72h.
 */
export default function StripeSmartLockCta({
  vertical,
  intentSlug,
  priceBase,
  isUrgent = false,
  daysUntilEvent = 30,
}: StripeSmartLockCtaProps) {
  const [state, setState] = useState<FunnelState>(isUrgent ? 'URGENCY_VALIDATION' : 'BLUR_LOCKED');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [urgencyAnswer, setUrgencyAnswer] = useState('');
  const [error, setError] = useState('');

  // ── Step 1: Show the lock overlay ──
  const handleStartUnlock = () => {
    setState('CAPTURE_CONTACT');
  };

  // ── Step 2: After capturing contact → decide urgency or Stripe ──
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    if (isUrgent || daysUntilEvent <= 7) {
      setState('URGENCY_VALIDATION');
      return;
    }

    // Standard path: redirect to Stripe
    await redirectToStripe();
  };

  // ── Step 3: Urgency Bypass validation ──
  const handleUrgencyValidation = async () => {
    if (!urgencyAnswer.trim()) return;

    // The filter question was answered — bypass the paywall
    setState('URGENCY_BYPASSED');
  };

  // ── Stripe redirect ──
  const redirectToStripe = async () => {
    setState('REDIRECTING_STRIPE');
    try {
      const { createSmartLockCheckoutAction } = await import('@/app/actions/smartLockActions');
      const result = await createSmartLockCheckoutAction({
        email,
        phone,
        vertical,
        intentSlug,
        daysUntilEvent,
      });

      if (result.urgencyBypassed) {
        setState('URGENCY_BYPASSED');
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError('No se pudo generar el enlace de pago.');
        setState('ERROR');
      }
    } catch (err: any) {
      setError(err.message || 'Error de conexión con Stripe.');
      setState('ERROR');
    }
  };

  // ── URGENCY BYPASSED or UNLOCKED: No overlay needed ──
  if (state === 'UNLOCKED' || state === 'URGENCY_BYPASSED') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-3xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-3"
      >
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
          <Unlock size={22} />
        </div>
        <h4 className="text-lg font-bold font-syne text-white">
          {state === 'URGENCY_BYPASSED'
            ? '🔥 Modo Urgencia — Acceso Inmediato Concedido'
            : '🔓 Dossier Desbloqueado — Price-Lock 72h Activo'}
        </h4>
        <p className="text-xs text-zinc-400 font-mono">
          {state === 'URGENCY_BYPASSED'
            ? 'El Conserje de Emergencia ha eliminado la barrera. Contacta con la Centralita directamente.'
            : `Tu tarifa de ${priceBase} € base está protegida durante las próximas 72 horas con garantía SHA-256.`}
        </p>
        {state === 'URGENCY_BYPASSED' && (
          <a
            href="tel:+34693693048"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white text-xs font-mono font-black uppercase rounded-2xl transition-all hover:scale-105 shadow-lg shadow-rose-950/40"
          >
            <PhoneCall size={14} />
            <span>Llamar Centralita Ahora (+34 693 693 048)</span>
          </a>
        )}
      </motion.div>
    );
  }

  return (
    <div className="relative">
      {/* ── THE BLUR OVERLAY ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={state}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35 }}
          className="p-8 rounded-3xl bg-gradient-to-b from-[#081226] via-[#040914] to-[#000000] border border-[#AAD6CD]/30 shadow-2xl shadow-black/80 space-y-6"
        >
          {/* ── STATE: BLUR_LOCKED ── */}
          {state === 'BLUR_LOCKED' && (
            <div className="text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-[#258DCD]/15 border border-[#258DCD]/30 text-[#AAD6CD] flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(37,141,205,0.25)]">
                <Lock size={26} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#AAD6CD] font-bold uppercase tracking-widest block mb-1">
                  Price-Lock SHA-256 & Dossier Técnico Cifrado
                </span>
                <h3 className="text-2xl font-black font-syne text-white">
                  Desbloquea el Rider Completo y Precios Exactos
                </h3>
                <p className="text-sm text-zinc-300 font-light mt-2 max-w-md mx-auto">
                  Bloquea tu fecha durante 72h con un micro-compromiso de <strong className="text-[#AAD6CD]">10 €</strong> (descontable de la factura final o convertible en saldo EAR Wallet).
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleStartUnlock}
                  className="px-8 py-4 bg-[#258DCD] hover:bg-[#1e7ebd] text-white font-mono text-sm font-black uppercase rounded-2xl transition-all shadow-[0_0_25px_rgba(37,141,205,0.4)] flex items-center gap-2 hover:scale-105"
                >
                  <CreditCard size={16} />
                  <span>Desbloquear por 10 €</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-400 justify-center">
                <span className="flex items-center gap-1"><ShieldCheck size={12} className="text-[#AAD6CD]" /> 100% reembolsable</span>
                <span className="flex items-center gap-1"><Clock size={12} className="text-[#258DCD]" /> Price-Lock 72h</span>
                <span className="flex items-center gap-1"><Wallet size={12} className="text-[#AAD6CD]" /> Convertible a Wallet</span>
              </div>
            </div>
          )}

          {/* ── STATE: CAPTURE_CONTACT ── */}
          {state === 'CAPTURE_CONTACT' && (
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <div className="text-center">
                <span className="text-[10px] font-mono text-[#AAD6CD] font-bold uppercase tracking-widest block">
                  Paso 1 de 2: Tu Contacto Prioritario
                </span>
                <h3 className="text-xl font-bold font-syne text-white mt-1">
                  ¿Dónde enviamos el Dossier Técnico?
                </h3>
              </div>

              <div className="space-y-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-5 py-3.5 bg-[#081226] border border-[#AAD6CD]/25 rounded-2xl text-sm font-mono text-white placeholder-zinc-500 focus:border-[#258DCD] outline-none"
                />
                <input
                  type="tel"
                  placeholder="WhatsApp (+34 600 000 000) — Opcional"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-5 py-3.5 bg-[#050505] border border-white/20 rounded-2xl text-sm font-mono text-white placeholder-zinc-500 focus:border-[#ecb613] outline-none"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-[#ecb613] hover:bg-amber-400 text-black font-mono text-xs font-black uppercase rounded-2xl transition-all shadow-xl shadow-amber-950/40 flex items-center gap-2 mx-auto hover:scale-105"
                >
                  <Lock size={14} />
                  <span>Proceder al Bloqueo (10 € Stripe)</span>
                </button>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 justify-center">
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Sin spam</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> RGPD compliant</span>
                <span className="flex items-center gap-1"><CheckCircle2 size={12} className="text-emerald-400" /> Descontable del total</span>
              </div>
            </form>
          )}

          {/* ── STATE: URGENCY_VALIDATION ── */}
          {state === 'URGENCY_VALIDATION' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 justify-center">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 flex items-center justify-center">
                  <Flame size={20} className="animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-rose-300 font-bold uppercase tracking-widest block">
                    Conserje de Emergencia Activado
                  </span>
                  <h3 className="text-lg font-bold font-syne text-white">
                    Validación de Urgencia (Bypass de Barrera)
                  </h3>
                </div>
              </div>

              <p className="text-sm text-zinc-400 text-center font-light max-w-lg mx-auto">
                Tu evento es en menos de 7 días. Para eliminar la barrera de los 10 € y conectarte directamente con la Centralita, responde brevemente:
              </p>

              <div className="max-w-md mx-auto space-y-3">
                <textarea
                  value={urgencyAnswer}
                  onChange={(e) => setUrgencyAnswer(e.target.value)}
                  placeholder="Describe brevemente tu situación: ¿Qué tipo de evento? ¿Se canceló otro proveedor? ¿Fecha exacta?"
                  rows={3}
                  className="w-full px-5 py-3.5 bg-[#050505] border border-rose-500/30 rounded-2xl text-sm font-mono text-white placeholder-zinc-500 focus:border-rose-400 outline-none resize-none"
                />
                <button
                  onClick={handleUrgencyValidation}
                  disabled={!urgencyAnswer.trim()}
                  className="w-full py-3.5 bg-rose-500 hover:bg-rose-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-mono text-xs font-black uppercase rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  <PhoneCall size={14} />
                  <span>Confirmar Urgencia y Desbloquear</span>
                </button>
              </div>
            </div>
          )}

          {/* ── STATE: REDIRECTING_STRIPE ── */}
          {state === 'REDIRECTING_STRIPE' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/40 flex items-center justify-center mx-auto animate-pulse">
                <CreditCard size={22} />
              </div>
              <h3 className="text-lg font-bold font-syne text-white">Conectando con Stripe Checkout...</h3>
              <p className="text-xs text-zinc-400 font-mono">Redirigiendo a la pasarela de pago seguro (10.00 EUR). No cierres esta ventana.</p>
            </div>
          )}

          {/* ── STATE: ERROR ── */}
          {state === 'ERROR' && (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto">
                <AlertCircle size={22} />
              </div>
              <h4 className="text-lg font-bold text-white">Error en la Conexión</h4>
              <p className="text-xs text-zinc-400 font-mono">{error}</p>
              <button
                onClick={() => setState('BLUR_LOCKED')}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-mono rounded-xl transition-all"
              >
                Reintentar
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
