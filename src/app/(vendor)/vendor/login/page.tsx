'use client';

import React, { useState } from 'react';
import { Fingerprint, ArrowRight, ShieldCheck, Lock, Sparkles, MessageCircle, HelpCircle } from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { generateVendorOtpAction, verifyVendorOtpAction, adminImpersonateVendorAction } from '@/app/actions/vendorAuthActions';

export default function VendorLogin() {
  const [step, setStep] = useState<'IDENTIFY' | 'CHALLENGE'>('IDENTIFY');
  const [identifier, setIdentifier] = useState('edwin-agudelo');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);

  const handleIdentify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;
    setLoading(true);
    setError(null);

    const res = await generateVendorOtpAction(identifier);
    setLoading(false);

    if (res.success) {
      if (res.whatsappUrl) setWhatsappUrl(res.whatsappUrl);
      setStep('CHALLENGE');
    } else {
      setError(res.error || 'No se pudo generar el código OTP');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await verifyVendorOtpAction(identifier, otp || '123456');
    setLoading(false);

    if (res.success) {
      window.location.href = '/vendor/dashboard';
    } else {
      setError(res.error || 'Código incorrecto o expirado');
    }
  };

  const handleAdminImpersonate = async () => {
    setLoading(true);
    const res = await adminImpersonateVendorAction('edwin-agudelo', 'Edwin Agudelo (Admin)');
    setLoading(false);
    if (res.success) {
      window.location.href = '/vendor/dashboard';
    } else {
      setError(res.error || 'Error al iniciar suplantación');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center space-y-3">
        <div className="inline-flex justify-center">
          <div className="w-16 h-16 bg-[#09090d] border border-[#ecb613]/40 rounded-3xl flex items-center justify-center shadow-2xl shadow-amber-500/10 hover:scale-105 transition-all">
            <Fingerprint className="w-8 h-8 text-[#ecb613]" />
          </div>
        </div>
        
        <h2 className="text-3xl font-black font-syne text-white tracking-tight uppercase">
          Portal Privado de Proveedores
        </h2>
        
        <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-sm mx-auto">
          Acceso seguro 2FA vía WhatsApp (+34 693 693 048) o sesión asistida para administradores.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-4">
        <div className="bg-[#09090d]/80 backdrop-blur-2xl py-8 px-6 sm:px-10 rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
          
          {error && (
            <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-xs font-mono text-rose-300">
              {error}
            </div>
          )}

          {step === 'IDENTIFY' && (
            <form onSubmit={handleIdentify} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div>
                <label htmlFor="identifier" className="block text-xs font-mono font-bold uppercase text-zinc-300">
                  Email, CIF o Nombre del Proveedor / Artista
                </label>
                <div className="mt-2">
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="ej. edwin-agudelo o info@empresa.com"
                    required
                    className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#ecb613] focus:border-[#ecb613] bg-black/60 text-white text-xs font-mono transition-all"
                  />
                </div>
                <span className="text-[10px] font-mono text-zinc-500 mt-2 block">
                  Piloto oficial habilitado: <strong className="text-[#ecb613]">edwin-agudelo</strong>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-mono text-xs font-black uppercase text-black bg-[#ecb613] hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Generando 2FA...' : 'Solicitar Código 2FA por WhatsApp'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {step === 'CHALLENGE' && (
            <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-[#ecb613] font-bold text-xs font-mono">
                  <ShieldCheck size={16} />
                  <span>DESAFÍO SEGURIDAD 2FA WHATSAPP</span>
                </div>
                <p className="text-[11px] text-zinc-300 font-light leading-relaxed">
                  Código temporal enviado a tu móvil. Para este piloto, usa el código por defecto <strong className="text-emerald-400 font-mono font-bold">123456</strong>.
                </p>
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-400 hover:underline mt-1"
                  >
                    <MessageCircle size={12} />
                    <span>Abrir WhatsApp Central para recibir código</span>
                  </a>
                )}
              </div>

              <div>
                <label htmlFor="otp" className="block text-xs font-mono font-bold uppercase text-zinc-300">
                  Código OTP (6 Dígitos)
                </label>
                <div className="mt-2">
                  <input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    required
                    className="appearance-none block w-full px-4 py-3.5 border border-white/10 rounded-2xl placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-[#ecb613] focus:border-[#ecb613] bg-black/60 text-white text-center text-lg font-mono tracking-widest transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-4 px-4 rounded-2xl font-mono text-xs font-black uppercase text-black bg-[#ecb613] hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? 'Verificando...' : 'Acceder al Panel Privado'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setStep('IDENTIFY')}
                className="w-full text-center text-xs font-mono text-zinc-500 hover:text-white transition-colors"
              >
                Cambiar identificador
              </button>
            </form>
          )}

          {/* Botón de acceso asistido para Administradores / Empleados */}
          <div className="mt-8 pt-6 border-t border-white/10 space-y-3">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
              <HelpCircle size={12} className="text-[#ecb613]" />
              <span>¿Soporte Asistido o Gestión Delegada?</span>
            </div>

            <button
              type="button"
              onClick={handleAdminImpersonate}
              disabled={loading}
              className="w-full py-3 px-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs font-bold text-amber-300 hover:text-white transition-all flex items-center justify-center gap-2"
            >
              <Sparkles size={14} className="text-[#ecb613]" />
              <span>Acceso Rápido Administrador (Edwin Agudelo)</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
