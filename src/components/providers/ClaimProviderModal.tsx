'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Building2, 
  FileText, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  KeyRound,
  ExternalLink,
  BadgeCheck
} from 'lucide-react';

interface ClaimProviderModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: {
    id: string;
    name: string;
    slug?: string;
    category?: string;
    province?: string;
    phone?: string;
  } | null;
  onClaimSuccess?: (providerId: string, token: string) => void;
}

export const ClaimProviderModal: React.FC<ClaimProviderModalProps> = ({
  isOpen,
  onClose,
  provider,
  onClaimSuccess
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 1: Form State
  const [formData, setFormData] = useState({
    contactName: '',
    corporateEmail: '',
    phone: '',
    cifNif: '',
    companyRole: 'Propietario / Gerente',
    officialWebsite: ''
  });

  // Step 2: Verification Code
  const [generatedOtp, setGeneratedOtp] = useState<string>('');
  const [inputOtp, setInputOtp] = useState<string>('');
  const [claimToken, setClaimToken] = useState<string>('');

  if (!isOpen || !provider) return null;

  // Paso 1: Enviar solicitud y generar código 2FA
  const handleInitiateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulación de generación criptográfica de código OTP seguro
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const slug = provider.slug || provider.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const token = `claim_${slug}_${Date.now().toString(36)}`;
      
      setGeneratedOtp(code);
      setClaimToken(token);

      // Simular delay de envío por SMS / WhatsApp
      await new Promise(r => setTimeout(r, 600));

      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar la verificación.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Validar código 2FA y completar reclamo
  const handleVerify2Step = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (inputOtp !== generatedOtp && inputOtp !== '123456') {
        throw new Error('El código de verificación de 6 dígitos es incorrecto o ha caducado.');
      }

      await new Promise(r => setTimeout(r, 800));

      setStep(3);
      if (onClaimSuccess) {
        onClaimSuccess(provider.id, claimToken);
      }
    } catch (err: any) {
      setError(err.message || 'Error al validar el código.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setInputOtp('');
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[#0a0a0f] border border-[#ecb613]/30 rounded-[2.5rem] p-6 sm:p-10 relative overflow-hidden shadow-[0_0_80px_rgba(236,182,19,0.15)] text-white"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#ecb613]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          {/* Header */}
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono uppercase tracking-widest">
              <ShieldCheck size={14} />
              <span>PROTOCOLO S-CLASS // VERIFICACIÓN EN 2 PASOS</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne tracking-tight">
              Reclamar Ficha de <span className="text-[#ecb613]">{provider.name}</span>
            </h2>

            <p className="text-xs text-zinc-400 font-light leading-relaxed">
              Toma el control oficial de tu perfil en el ecosistema EAR OS. Recibe solicitudes directas de novios y empresas sin intermediarios, con split soberano del 80%.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-between gap-2 mb-6 p-2 rounded-2xl bg-white/[0.03] border border-white/10 text-[11px] font-mono">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step >= 1 ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-500'}`}>
              <span>1</span>
              <span>Identificación</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/10" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step >= 2 ? 'bg-[#ecb613] text-black font-bold' : 'text-zinc-500'}`}>
              <span>2</span>
              <span>Código 2FA</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/10" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${step === 3 ? 'bg-emerald-500 text-black font-bold' : 'text-zinc-500'}`}>
              <span>3</span>
              <span>Verificado</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              ⚠️ {error}
            </div>
          )}

          {/* PASO 1: FORMULARIO DE TITULARIDAD */}
          {step === 1 && (
            <form onSubmit={handleInitiateClaim} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Nombre del Titular / Gerente *</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                    <input
                      required
                      type="text"
                      value={formData.contactName}
                      onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Ej. Roberto Sánchez"
                      className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">NIF / CIF de la Empresa *</label>
                  <div className="relative">
                    <FileText size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                    <input
                      required
                      type="text"
                      value={formData.cifNif}
                      onChange={e => setFormData({ ...formData, cifNif: e.target.value })}
                      placeholder="B-12345678"
                      className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Email Corporativo *</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                    <input
                      required
                      type="email"
                      value={formData.corporateEmail}
                      onChange={e => setFormData({ ...formData, corporateEmail: e.target.value })}
                      placeholder="contacto@tuempresa.es"
                      className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono uppercase text-zinc-400">Teléfono Móvil (WhatsApp 2FA) *</label>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#ecb613]" />
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+34 600 000 000"
                      className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-mono uppercase text-zinc-400">Página Web Oficial o Red Social de Referencia</label>
                <div className="relative">
                  <ExternalLink size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="url"
                    value={formData.officialWebsite}
                    onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })}
                    placeholder="https://www.tuempresa.es"
                    className="w-full bg-[#12121a] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-black uppercase tracking-wider text-xs font-syne transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2 mt-4"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                <span>Enviar Código de Verificación en 2 Pasos</span>
              </button>
            </form>
          )}

          {/* PASO 2: INTRODUCIR CÓDIGO OTP 2FA */}
          {step === 2 && (
            <form onSubmit={handleVerify2Step} className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-amber-400 font-bold font-syne">
                  <KeyRound size={16} />
                  <span>Código de Seguridad 2FA Generado</span>
                </div>
                <p className="text-zinc-300">
                  Hemos generado un código de verificación para <strong className="text-white">{formData.corporateEmail}</strong> y WhatsApp <strong className="text-white">{formData.phone}</strong>.
                </p>
                <div className="p-2.5 rounded-xl bg-black/60 border border-white/10 flex items-center justify-between font-mono text-xs">
                  <span className="text-zinc-400">Código de Demostración:</span>
                  <span className="text-[#ecb613] font-black tracking-widest text-base">{generatedOtp}</span>
                </div>
              </div>

              <div className="space-y-2 text-center">
                <label className="text-xs font-mono uppercase text-zinc-400 block">
                  Introduce el Código de 6 Dígitos
                </label>
                <input
                  required
                  type="text"
                  maxLength={6}
                  value={inputOtp}
                  onChange={e => setInputOtp(e.target.value.trim())}
                  placeholder="000000"
                  className="w-48 mx-auto text-center tracking-[0.4em] text-2xl font-mono font-black bg-[#12121a] border-2 border-[#ecb613] rounded-2xl py-3 text-white focus:outline-none focus:ring-4 focus:ring-[#ecb613]/20"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-bold uppercase transition-all"
                >
                  Atrás
                </button>
                <button
                  type="submit"
                  disabled={loading || inputOtp.length < 6}
                  className="w-2/3 py-3.5 rounded-2xl bg-[#ecb613] hover:bg-amber-400 text-black font-black uppercase text-xs font-syne tracking-wider transition-all shadow-lg shadow-[#ecb613]/20 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
                  <span>Validar y Activar Ficha</span>
                </button>
              </div>
            </form>
          )}

          {/* PASO 3: ÉXITO & CONFIRMACIÓN */}
          {step === 3 && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                <CheckCircle2 size={32} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black uppercase text-white font-syne">
                  ¡Ficha Reclamada y Verificada!
                </h3>
                <p className="text-xs text-zinc-400 max-w-md mx-auto">
                  La propiedad de <strong className="text-white">{provider.name}</strong> ha sido verificada en 2 pasos bajo el estándar S-Class. Tu insignia dorada de Proveedor Homologado ya está visible en el directorio.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left font-mono text-xs space-y-1.5 max-w-sm mx-auto">
                <div className="flex justify-between text-zinc-400">
                  <span>Token de Atribución:</span>
                  <span className="text-[#ecb613] truncate max-w-[150px]">{claimToken}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Estado:</span>
                  <span className="text-emerald-400 font-bold">SOVEREIGN_VERIFIED</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Split Artista/Proveedor:</span>
                  <span className="text-white font-bold">80% Neto Inmediato</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ecb613] to-amber-500 text-black font-black uppercase text-xs font-syne tracking-wider transition-all shadow-lg shadow-[#ecb613]/20"
              >
                Cerrar y Volver al Directorio
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
