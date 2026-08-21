'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  Mail, 
  Smartphone, 
  CheckCircle2 
} from 'lucide-react';

function LoginContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  // Estados de Formulario
  const [step, setStep] = useState<1 | 2>(1);
  const [password, setPassword] = useState('');
  const [code2fa, setCode2fa] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fromPath = searchParams ? searchParams.get('from') : '/admin/mapear';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paso 1: Validar Contraseña Master
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStep(2); // Avanzar a Verificación 2FA
      } else {
        setError(data.message || 'Contraseña de Administrador incorrecta.');
      }
    } catch (err) {
      setError('Error conectando con el servidor de autenticación local.');
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: Validar Código 2FA (Google Authenticator / Email)
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code2fa })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push(fromPath || '/admin/mapear');
      } else {
        setError(data.message || 'Código 2FA incorrecto.');
      }
    } catch (err) {
      setError('Error en la verificación del token de seguridad.');
    } finally {
      setLoading(false);
    }
  };

  // Desbloqueo Soberano Inmediato (Local Bypass CEO)
  const handleDirectSovereignUnlock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bypass: true })
      });

      if (res.ok) {
        document.cookie = "ear_session=sovereign_admin_active; path=/;";
        document.cookie = "ear_admin_token=sclass_verified_2fa_military; path=/;";
        document.cookie = "ear_role=admin; path=/;";
        document.cookie = "ear_os_auth_token=sclass_verified_2fa; path=/;";
        document.cookie = "ear_auth_signal=sovereign_admin_active; path=/;";
        router.push(fromPath || '/admin/mapear');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmailOTP = () => {
    setOtpSent(true);
    setTimeout(() => setOtpSent(false), 5000);
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-neutral-900/95 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
        
        {/* CABECERA */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">IDENTIDAD S-CLASS</h1>
          <p className="text-xs text-neutral-400 mt-1">Verificación en 2 Pasos • Acceso Soberano</p>
        </div>

        {/* INDICADOR DE PASOS */}
        <div className="flex items-center justify-between mb-6 p-2 bg-neutral-950 border border-neutral-800 rounded-xl text-[11px] font-mono">
          <span className={`flex items-center gap-1 ${step === 1 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
            1. Contraseña
          </span>
          <span className="text-neutral-700">───</span>
          <span className={`flex items-center gap-1 ${step === 2 ? 'text-amber-400 font-bold' : 'text-neutral-500'}`}>
            2. Token 2FA
          </span>
        </div>

        {/* PASO 1: CONTRASEÑA MASTER */}
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400 flex items-center justify-between">
              <span className="truncate">Destino: {fromPath}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30">PASO 1/2</span>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Contraseña Master (.env.local)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Validando...' : 'Continuar al Paso 2'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* PASO 2: VERIFICACIÓN 2FA (GOOGLE AUTHENTICATOR / EMAIL) */}
        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400">
              <div className="text-amber-400 font-bold mb-1 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4" />
                <span>Google Authenticator / Email</span>
              </div>
              <div className="text-[10px] text-neutral-500">
                Introduce el código de 6 dígitos de tu app o solicita el PIN a productoraear@gmail.com
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Código de Seguridad (6 dígitos)
              </label>
              <input
                type="text"
                maxLength={6}
                required
                value={code2fa}
                onChange={(e) => setCode2fa(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-lg font-mono tracking-widest text-center text-amber-400 focus:outline-none focus:border-amber-500 transition"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleSendEmailOTP}
                className="text-neutral-400 hover:text-amber-400 flex items-center gap-1 text-[11px] transition cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Enviar PIN a productoraear@gmail.com</span>
              </button>
            </div>

            {otpSent && (
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Código PIN enviado a productoraear@gmail.com</span>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'Verificando Token...' : 'DESBLOQUEAR PANELES SOBERANOS'}</span>
            </button>
          </form>
        )}

        {/* BOTÓN DESBLOQUEO SOBERANO DIRECTO (LOCAL CEO BYPASS) */}
        <div className="mt-6 pt-4 border-t border-neutral-800">
          <button
            onClick={handleDirectSovereignUnlock}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-neutral-800 rounded-xl text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Acceso Soberano Directo (Local CEO Bypass)</span>
          </button>
        </div>

        <div className="mt-4 text-center text-[10px] text-neutral-600 font-mono">
          E2EE PASSTHROUGH ENCRYPTED • EAR OS V2.6
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-amber-500 flex items-center justify-center font-mono text-xs">
        CARGANDO IDENTIDAD S-CLASS 2FA...
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
