'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowRight, ShieldCheck, Phone, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { CENTRALITA } from '@/lib/phone-constants';

export default function VendorLogin() {
  const [step, setStep] = useState<'IDENTIFY' | 'CHALLENGE'>('IDENTIFY');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('CHALLENGE');
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      window.location.href = '/vendor/dashboard';
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <Link href="/" className="inline-flex justify-center">
          <div className="w-16 h-16 bg-[#09090d] border border-[#ecb613]/40 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/10 hover:scale-105 transition-all">
            <Fingerprint className="w-8 h-8 text-[#ecb613]" />
          </div>
        </Link>
        
        <h2 className="text-3xl font-black font-syne text-white tracking-tight uppercase">
          Portal de Proveedores S-Class
        </h2>
        
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-sm mx-auto">
          Reclama tu ficha corporativa pre-indexada o accede a tu panel de gestión de eventos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#09090d]/80 backdrop-blur-2xl py-8 px-6 sm:px-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {step === 'IDENTIFY' && (
            <form onSubmit={handleIdentify} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label htmlFor="identifier" className="block text-xs font-mono font-bold uppercase text-zinc-300">
                  Email, CIF o Nombre del Proveedor
                </label>
                <div className="mt-2">
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej. alberto-navarro o info@empresa.com"
                    required
                    className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#ecb613] focus:border-[#ecb613] bg-black/60 text-white text-xs font-mono transition-all"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-2 block">
                  Identificación determinista en catálogo de 4.906 entidades.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-mono text-xs font-black uppercase text-black bg-[#ecb613] hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Verificando Catálogo...' : 'Verificar Identidad'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'CHALLENGE' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-1">
                <div className="flex items-center gap-2 text-[#ecb613] font-bold text-xs font-mono">
                  <ShieldCheck size={16} />
                  <span>DESAFÍO CRIPTOGRÁFICO OTP</span>
                </div>
                <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
                  Hemos generado un token de un solo uso para autorizar este dispositivo. Para entorno de pruebas, introduce cualquier código de 6 dígitos.
                </p>
              </div>

              <div>
                <label htmlFor="otp" className="block text-xs font-mono font-bold uppercase text-zinc-300">
                  Código de 6 Dígitos
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="• • • • • •"
                    required
                    className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-[#ecb613] focus:border-[#ecb613] bg-black/60 text-center text-2xl tracking-[0.8em] text-white transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-mono text-xs font-black uppercase text-black bg-[#ecb613] hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Validando Dispositivo...' : 'Autorizar y Entrar al Workspace'}</span>
                <ShieldCheck className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('IDENTIFY')}
                className="w-full text-center text-xs font-mono text-zinc-500 hover:text-white transition-colors block pt-2"
              >
                ← Cambiar identificador
              </button>
            </form>
          )}

          {/* Centralita Footer Link */}
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <span className="text-[10px] font-mono text-zinc-500 block">¿Necesitas soporte técnico con tu reclamación?</span>
            <a
              href={CENTRALITA.tel}
              className="mt-1 inline-flex items-center gap-1.5 text-xs font-mono text-[#ecb613] hover:underline"
            >
              <Phone size={12} />
              <span>Contactar con Centralita ({CENTRALITA.display})</span>
            </a>
          </div>

        </div>
      </div>

    </div>
  );
}
