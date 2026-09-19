"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { createSupplierUnlockCheckout } from '@/app/actions/vipCheckoutActions';

interface SupplierBlurLockProps {
  supplierId: string;
  supplierName: string;
  category: string;
  city: string;
  slug?: string;
  isUnlocked?: boolean;
  children?: React.ReactNode;
}

export const SupplierBlurLock: React.FC<SupplierBlurLockProps> = ({
  supplierId,
  supplierName,
  category,
  city,
  slug,
  isUnlocked = false,
  children
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUnlock = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await createSupplierUnlockCheckout({
        supplierId,
        supplierName,
        category,
        city,
        slug
      });

      if (res?.url) {
        window.location.href = res.url;
      } else {
        throw new Error('No se pudo generar la sesión de pago seguro.');
      }
    } catch (err: any) {
      console.error('Error initiating unlock:', err);
      setError(err?.message || 'Error al conectar con la pasarela de pago.');
      setLoading(false);
    }
  };

  if (isUnlocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative w-full overflow-hidden rounded-3xl border border-[#ecb613]/30 bg-[#050505] shadow-2xl p-6 sm:p-8">
      {/* BACKGROUND OBFUSCATED LAYER */}
      <div className="filter blur-[16px] opacity-25 select-none pointer-events-none space-y-4" aria-hidden="true">
        <div className="h-6 bg-zinc-700 rounded w-3/4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-zinc-800 rounded w-1/2"></div>
          <div className="h-10 bg-zinc-800 rounded w-1/2"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-zinc-700 rounded w-full"></div>
          <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
          <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
        </div>
        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Phone className="w-4 h-4" /> +34 699 ••• •••
          </div>
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <Mail className="w-4 h-4" /> direct-booking@••••••••.es
          </div>
        </div>
      </div>

      {/* FOREGROUND IMMERSIVE DARK SHIELD */}
      <div className="absolute inset-0 bg-[#050505]/85 backdrop-blur-md flex flex-col justify-center items-center text-center p-6 sm:p-8 z-20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ecb613]/20 to-black border border-[#ecb613]/40 flex items-center justify-center mb-4 shadow-lg shadow-[#ecb613]/10">
          <Lock className="w-7 h-7 text-[#ecb613]" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          Ficha Oficial Verificada · Garantía EAR OS
        </div>

        <h3 className="text-xl sm:text-2xl font-extrabold text-white font-syne max-w-xl leading-snug">
          Contacto Directo & <span className="text-[#ecb613]">Disponibilidad en Tiempo Real</span>
        </h3>

        <p className="text-xs sm:text-sm text-zinc-400 mt-2 max-w-lg leading-relaxed">
          Accede al teléfono directo auditado y WhatsApp personal de <strong className="text-zinc-200">{supplierName}</strong> ({category} en {city}) sin intermediarios ni comisiones de agencia.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 my-4 w-full max-w-md text-left text-xs font-mono text-zinc-300">
          <div className="flex items-center gap-1.5 bg-black/60 p-2.5 rounded-xl border border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Proveedor Auditado</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 p-2.5 rounded-xl border border-white/5">
            <Clock className="w-4 h-4 text-[#ecb613] shrink-0" />
            <span>Respuesta &lt; 15 min</span>
          </div>
          <div className="flex items-center gap-1.5 bg-black/60 p-2.5 rounded-xl border border-white/5">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Garantía Oficial</span>
          </div>
        </div>

        {error && (
          <div className="mb-3 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-mono flex items-center gap-2 w-full max-w-md">
            <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 🎯 ACCIÓN PRINCIPAL: TRIPWIRE CUÁNTICO 1,00 € (DESCONTABLE DE RESERVA) */}
        <div className="w-full max-w-md space-y-2 my-2">
          <button
            onClick={handleUnlock}
            disabled={loading}
            className="w-full py-4 px-5 bg-gradient-to-r from-[#ecb613] via-amber-500 to-[#ecb613] hover:brightness-110 text-black font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-amber-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 font-mono uppercase tracking-wider cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Conectando con Stripe Seguro...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Desbloquear Teléfono Maître & WhatsApp · 1,00 €</span>
              </>
            )}
          </button>

          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 text-center font-bold">
            ✓ 1,00 € descontable al 100% de tu reserva · Trato directo sin comisiones
          </div>
        </div>

        {/* CANALES DE CONTACTO ALTERNATIVOS CON CENTRALITA */}
        <div className="pt-3 border-t border-white/10 w-full max-w-md grid grid-cols-2 gap-2">
          <a
            href="tel:+34693693048"
            className="py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono uppercase"
          >
            <Phone className="w-3.5 h-3.5 text-[#ecb613]" />
            <span>Centralita EAR</span>
          </a>

          <a
            href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola, quiero consultar disponibilidad y condiciones oficiales para ${supplierName} (${category} en ${city}).`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] text-[11px] rounded-xl transition-all flex items-center justify-center gap-1.5 font-mono uppercase"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Asesor WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default SupplierBlurLock;
