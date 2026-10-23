'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, KeyRound, ArrowRight, AlertCircle, ShieldCheck, Edit3, UserCheck, Eye, EyeOff, Mail, Zap } from 'lucide-react';
import { SignIn2 } from '@/components/ui/clean-minimal-sign-in';

function OmniAuthLoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [mounted, setMounted] = useState(false);

  const [authRole, setAuthRole] = useState<'admin' | 'editor' | 'partner'>('admin');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('edwin.agudelo@productoraear.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code2fa, setCode2fa] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const fromPath = searchParams.get('from') || '/admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  // Paso 1: Enviar contraseña y solicitar desafío 2FA
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (authRole === 'admin') {
        const checkRes = await fetch('/api/auth/admin-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, role: 'admin', action: 'check-password' }),
        });

        const checkData = await checkRes.json();

        if (checkRes.ok && checkData.success) {
          const today = String(new Date().getDate()).padStart(2, '0');
          setInfoMsg(`Abre Google Authenticator e introduce tu código de 6 cifras (o usa el PIN Soberano de hoy: ${today}24).`);
          setStep(2);
          return;
        } else {
          setError(checkData.message || 'Contraseña incorrecta.');
          return;
        }
      }

      if (authRole === 'editor') {
        await handleEditorLogin();
      }
    } catch {
      setError('Error conectando con el servidor de autenticación.');
    } finally {
      setLoading(false);
    }
  };

  // Acceso Soberano Directo (Bypass 1-Click)
  const handleDirectBypass = async () => {
    setError(null);
    setLoading(true);
    try {
      const bypassRes = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: 'admin', bypassSovereign: true }),
      });

      const bypassData = await bypassRes.json();

      if (bypassRes.ok && bypassData.success) {
        // Navegación nativa para garantizar envío de cookies en localhost y producción
        window.location.href = fromPath || '/admin';
      } else {
        setError(bypassData.message || 'Error en bypass soberano.');
      }
    } catch {
      setError('Error al procesar bypass soberano.');
    } finally {
      setLoading(false);
    }
  };

  // Login directo para Editores Autorizados
  const handleEditorLogin = async () => {
    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, role: 'editor' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.location.href = fromPath || '/admin';
      } else {
        setError(data.message || 'Acceso de editor denegado.');
      }
    } catch {
      setError('Fallo de verificación de editor.');
    }
  };

  // Paso 2: Verificar Google Authenticator (TOTP) o Fórmula Soberana
  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, code2fa, role: 'admin' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirección completa con recarga para asentar cookies
        window.location.href = fromPath || '/admin';
      } else {
        setError(data.message || 'Código 2FA incorrecto o expirado.');
      }
    } catch {
      setError('Fallo de verificación en el servidor.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-[#030305]/95 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">

        {/* CABECERA */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">IDENTIDAD S-CLASS</h1>
          <p className="text-xs text-neutral-400 mt-1">Acceso Soberano Productora EAR • 2FA Google Authenticator</p>
        </div>

        {/* SELECTOR DE PERFIL DE ENTRADA */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          <button
            type="button"
            onClick={() => { setAuthRole('admin'); setStep(1); setError(null); }}
            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              authRole === 'admin' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-[#030305] border-neutral-800 text-neutral-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
            <div>
              <div className="text-[11px] font-bold">ADMIN</div>
              <div className="text-[8px] text-neutral-500">Google 2FA</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('editor'); setStep(1); setError(null); }}
            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              authRole === 'editor' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-[#030305] border-neutral-800 text-neutral-500'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-400 mb-1" />
            <div>
              <div className="text-[11px] font-bold">EDITOR</div>
              <div className="text-[8px] text-neutral-500">Contenido</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => { setAuthRole('partner'); setError(null); }}
            className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
              authRole === 'partner' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-[#030305] border-neutral-800 text-neutral-500'
            }`}
          >
            <UserCheck className="w-4 h-4 text-amber-400 mb-1" />
            <div>
              <div className="text-[11px] font-bold">PARTNERS</div>
              <div className="text-[8px] text-neutral-500">Clientes</div>
            </div>
          </button>
        </div>

        {/* MODO PARTNERS / CLIENTES */}
        {authRole === 'partner' && (
          <div className="w-full">
            <SignIn2
              onSuccess={() => {
                window.location.href = '/panel';
              }}
            />
          </div>
        )}

        {/* PASO 1 (ADMIN / EDITOR) */}
        {authRole !== 'partner' && step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div className="p-3 bg-[#030305] border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400 flex items-center justify-between">
              <span className="truncate">Destino: {fromPath}</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                {authRole}
              </span>
            </div>

            {authRole === 'admin' && (
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Email de Administrador
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="edwin.agudelo@productoraear.com"
                    className="w-full pl-10 pr-4 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition font-mono"
                  />
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                {authRole === 'admin' ? 'Contraseña Master EAR OS' : 'Contraseña de Editor Autorizado'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-4 pr-11 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-amber-400 transition cursor-pointer"
                  title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
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
              <span>{loading ? 'Verificando...' : authRole === 'admin' ? 'Continuar a Google Authenticator (2FA)' : 'Acceder como Editor'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {authRole === 'admin' && (
              <button
                type="button"
                onClick={handleDirectBypass}
                disabled={loading}
                className="w-full py-2.5 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-700/60 text-amber-400/90 hover:text-amber-300 font-mono text-[11px] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Entrar directo con Bypass Soberano</span>
              </button>
            )}
          </form>
        )}

        {/* PASO 2: VERIFICACIÓN 2FA PARA ADMIN */}
        {step === 2 && authRole === 'admin' && (
          <form onSubmit={handleStep2} className="space-y-4">
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex flex-col gap-1.5">
              <span className="font-bold flex items-center gap-1.5 text-amber-400">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                Doble Factor Requerido:
              </span>
              <span className="text-neutral-300 leading-relaxed text-[11px]">{infoMsg}</span>
              <div className="mt-1 pt-1.5 border-t border-amber-500/20 text-[10px] text-amber-400/90 font-mono">
                💡 PIN de respaldo para hoy: <strong>{String(new Date().getDate()).padStart(2, '0')}24</strong>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Código de 6 Cifras (Google Authenticator)
              </label>
              <input
                type="text"
                maxLength={6}
                autoFocus
                required
                value={code2fa}
                onChange={(e) => setCode2fa(e.target.value)}
                placeholder="000000"
                className="w-full px-4 py-3.5 bg-[#030305] border border-amber-500/40 rounded-xl text-xl font-mono tracking-widest text-center text-amber-400 focus:outline-none focus:border-amber-400 transition"
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
              <span>{loading ? 'Validando 2FA...' : 'DESBLOQUEAR PANELES SOBERANOS'}</span>
            </button>

            <button
              type="button"
              onClick={handleDirectBypass}
              disabled={loading}
              className="w-full py-2.5 bg-neutral-900/60 hover:bg-neutral-800/80 border border-neutral-700/60 text-amber-400/90 hover:text-amber-300 font-mono text-[11px] rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>¿Sin móvil? Entrar con Bypass Soberano</span>
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(null); }}
              className="w-full text-center text-xs text-neutral-500 hover:text-amber-400 transition py-1 block cursor-pointer"
            >
              ← Volver a introducir contraseña
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-[10px] text-neutral-600 font-mono">
          E2EE STATELESS PASSTHROUGH • EAR OS V2.6
        </div>
      </div>
    </div>
  );
}

export default function OmniAuthLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#030305] flex items-center justify-center text-amber-400 font-mono text-xs">Cargando Identidad S-Class...</div>}>
      <OmniAuthLoginForm />
    </Suspense>
  );
}