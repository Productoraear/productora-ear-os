'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Lock, 
  KeyRound, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  Edit3, 
  UserCheck, 
  Eye, 
  EyeOff, 
  Mail, 
  Zap, 
  RefreshCw, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { SignIn2 } from '@/components/ui/clean-minimal-sign-in';

interface TeamQuickAccount {
  name: string;
  email: string;
  role: 'admin' | 'editor';
  desc: string;
}

const AUTHORIZED_ACCOUNTS: TeamQuickAccount[] = [
  {
    name: 'Edwin Agudelo',
    email: 'edwin.agudelo@productoraear.com',
    role: 'admin',
    desc: 'CEO & Fundador'
  },
  {
    name: 'Adriana',
    email: 'adri521@hotmail.com',
    role: 'editor',
    desc: 'Marketing & Relaciones'
  },
  {
    name: 'Leire Agudelo',
    email: 'agudeloleire@gmail.com',
    role: 'editor',
    desc: 'Campañas & Redes'
  }
];

function OmniAuthLoginForm() {
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'recovery'>('login');

  // Login normal
  const [authRole, setAuthRole] = useState<'admin' | 'editor' | 'partner'>('admin');
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('edwin.agudelo@productoraear.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [code2fa, setCode2fa] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  // Recuperación en 3 Fases
  const [recPhase, setRecPhase] = useState<1 | 2 | 3>(1);
  const [recEmail, setRecEmail] = useState('edwin.agudelo@productoraear.com');
  const [recOtp, setRecOtp] = useState('');
  const [recPassword, setRecPassword] = useState('');
  const [rec2fa, setRec2fa] = useState('');
  const [phase2Token, setPhase2Token] = useState('');
  const [recSuccessMsg, setRecSuccessMsg] = useState<string | null>(null);

  const fromPath = searchParams.get('from') || '/admin';

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // FLUJO DE LOGIN REGULAR
  // ─────────────────────────────────────────────────────────────
  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMsg(null);
    setLoading(true);

    try {
      if (authRole === 'admin') {
        // Acceso Soberano Inviolable Instantáneo con PIN 1012
        if (password.trim() === '1012') {
          const pinRes = await fetch('/api/auth/admin-verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password: '1012', role: 'admin' }),
          });
          const pinData = await pinRes.json();
          if (pinRes.ok && pinData.success) {
            window.location.href = fromPath || '/admin';
            return;
          }
        }

        const checkRes = await fetch('/api/auth/admin-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: 'admin', action: 'check-password' }),
        });

        const checkData = await checkRes.json();

        if (checkRes.ok && checkData.success) {
          const today = String(new Date().getDate()).padStart(2, '0');
          setInfoMsg(`Abre Google Authenticator e introduce tu código de 6 cifras (o usa el PIN Maestro: 1012).`);
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
        body: JSON.stringify({ email, password, role: 'admin', bypassSovereign: true }),
      });

      const bypassData = await bypassRes.json();

      if (bypassRes.ok && bypassData.success) {
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

  // Login directo para Editores Autorizados (Marketing / Campañas)
  const handleEditorLogin = async () => {
    try {
      const res = await fetch('/api/auth/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: 'editor' }),
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
        body: JSON.stringify({ email, password, code2fa, role: 'admin' }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
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

  // ─────────────────────────────────────────────────────────────
  // FLUJO DE RECUPERACIÓN EN 3 FASES
  // ─────────────────────────────────────────────────────────────
  const handleRecoveryPhase1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/recovery-3phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'phase1_send_otp', email: recEmail }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRecSuccessMsg(data.message);
        setRecPhase(2);
      } else {
        setError(data.message || 'Error al enviar código OTP.');
      }
    } catch {
      setError('Fallo al conectar con el servicio de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryPhase2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setRecSuccessMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/recovery-3phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'phase2_verify_password', 
          otpCode: recOtp, 
          password: recPassword 
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setPhase2Token(data.phase2Token);
        setRecSuccessMsg(data.message);
        setRecPhase(3);
      } else {
        setError(data.message || 'Código OTP o contraseña incorrecta.');
      }
    } catch {
      setError('Fallo al validar Fase 2.');
    } finally {
      setLoading(false);
    }
  };

  const handleRecoveryPhase3 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/recovery-3phase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'phase3_verify_authenticator', 
          phase2Token, 
          code2fa: rec2fa 
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setRecSuccessMsg('¡Identidad y acceso restaurados con éxito! Redirigiendo...');
        setTimeout(() => {
          window.location.href = fromPath || '/admin';
        }, 1000);
      } else {
        setError(data.message || 'Código Authenticator 2FA incorrecto.');
      }
    } catch {
      setError('Fallo al validar Fase 3.');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-[#030305]/95 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl">

        {/* CABECERA */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
            <Lock className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">IDENTIDAD S-CLASS</h1>
          <p className="text-xs text-neutral-400 mt-1">Acceso Soberano Productora EAR • Blindaje 3 Fases</p>
        </div>

        {/* PESTAÑAS PRINCIPALES: LOGIN VS RECUPERACIÓN */}
        <div className="flex border border-neutral-800 rounded-xl p-1 bg-black/40 mb-6">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'login' 
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Acceso Directo
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('recovery'); setError(null); setRecPhase(1); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'recovery' 
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Recuperación 3 Fases
          </button>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PESTAÑA: ACCESO DIRECTO (LOGIN) */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'login' && (
          <>
            {/* SELECTOR DE PERFIL DE ENTRADA */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button
                type="button"
                onClick={() => { 
                  setAuthRole('admin'); 
                  setEmail('edwin.agudelo@productoraear.com');
                  setStep(1); 
                  setError(null); 
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  authRole === 'admin' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-[#030305] border-neutral-800 text-neutral-500'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
                <div>
                  <div className="text-[11px] font-bold">ADMIN</div>
                  <div className="text-[8px] text-neutral-500">Edwin Agudelo</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => { 
                  setAuthRole('editor'); 
                  setStep(1); 
                  setError(null); 
                }}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  authRole === 'editor' ? 'bg-amber-500/15 border-amber-500 text-amber-300' : 'bg-[#030305] border-neutral-800 text-neutral-500'
                }`}
              >
                <Edit3 className="w-4 h-4 text-amber-400 mb-1" />
                <div>
                  <div className="text-[11px] font-bold">MARKETING</div>
                  <div className="text-[8px] text-neutral-500">Adriana / Leire</div>
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

                {/* SELECTOR RÁPIDO DE CUENTAS AUTORIZADAS DE MARKETING */}
                {authRole === 'editor' && (
                  <div>
                    <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                      Selecciona Tu Cuenta de Marketing
                    </label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setEmail('adri521@hotmail.com')}
                        className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                          email === 'adri521@hotmail.com'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-black/40 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px]">Adriana</div>
                        <div className="text-[9px] font-mono opacity-70 truncate">adri521@hotmail.com</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setEmail('agudeloleire@gmail.com')}
                        className={`p-2 rounded-lg border text-left text-xs transition cursor-pointer ${
                          email === 'agudeloleire@gmail.com'
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-black/40 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        <div className="text-[11px]">Leire Agudelo</div>
                        <div className="text-[9px] font-mono opacity-70 truncate">agudeloleire@gmail.com</div>
                      </button>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Email Autorizado
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@productoraear.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    {authRole === 'admin' ? 'Contraseña Master EAR OS' : 'Contraseña del Sistema'}
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
                  <span>{loading ? 'Verificando...' : authRole === 'admin' ? 'Continuar a Google Authenticator (2FA)' : 'Acceder al Panel de Marketing'}</span>
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
          </>
        )}

        {/* ───────────────────────────────────────────────────────────── */}
        {/* PESTAÑA: RECUPERACIÓN SOBERANA EN 3 FASES */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'recovery' && (
          <div className="space-y-4">
            {/* Indicador de Fases */}
            <div className="flex items-center justify-between p-3 bg-black/60 border border-neutral-800 rounded-xl text-xs font-mono">
              <div className={`flex items-center gap-1.5 ${recPhase >= 1 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">1</span>
                <span>Email OTP</span>
              </div>
              <div className="text-neutral-700">→</div>
              <div className={`flex items-center gap-1.5 ${recPhase >= 2 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">2</span>
                <span>Password</span>
              </div>
              <div className="text-neutral-700">→</div>
              <div className={`flex items-center gap-1.5 ${recPhase >= 3 ? 'text-amber-400 font-bold' : 'text-neutral-600'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">3</span>
                <span>2FA PIN</span>
              </div>
            </div>

            {/* SELECCIÓN RÁPIDA DE CUENTA EN RECUPERACIÓN */}
            {recPhase === 1 && (
              <div>
                <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                  Selecciona la Cuenta a Recuperar
                </label>
                <div className="space-y-1.5 mb-3">
                  {AUTHORIZED_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.email}
                      type="button"
                      onClick={() => setRecEmail(acc.email)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs transition flex items-center justify-between cursor-pointer ${
                        recEmail === acc.email
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-black/40 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-white text-[12px]">{acc.name}</div>
                        <div className="text-[10px] font-mono text-neutral-400">{acc.email}</div>
                      </div>
                      <span className="text-[9px] uppercase px-2 py-0.5 rounded border border-neutral-700 font-mono">
                        {acc.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* FASE 1: ENVIAR CÓDIGO AL EMAIL */}
            {recPhase === 1 && (
              <form onSubmit={handleRecoveryPhase1} className="space-y-4">
                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Email Autorizado de Destino
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={recEmail}
                      onChange={(e) => setRecEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition font-mono"
                    />
                    <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    El código se enviará a tu correo y se respaldará en el canal de Telegram oficial de la dirección.
                  </p>
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
                  <Mail className="w-4 h-4" />
                  <span>{loading ? 'Generando código...' : 'Fase 1: Enviar Código de Verificación'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* FASE 2: INTRODUCIR OTP + CONTRASEÑA */}
            {recPhase === 2 && (
              <form onSubmit={handleRecoveryPhase2} className="space-y-4">
                {recSuccessMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{recSuccessMsg}</span>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Código OTP Recibido (6 cifras)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    value={recOtp}
                    onChange={(e) => setRecOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-center text-lg font-mono tracking-widest text-amber-400 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Contraseña del Sistema (Master / Editor)
                  </label>
                  <input
                    type="password"
                    required
                    value={recPassword}
                    onChange={(e) => setRecPassword(e.target.value)}
                    placeholder="••••••••••••••••"
                    className="w-full px-4 py-3 bg-[#030305] border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition"
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
                  <span>{loading ? 'Validando...' : 'Fase 2: Validar OTP + Contraseña'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => { setRecPhase(1); setError(null); }}
                  className="w-full text-center text-xs text-neutral-500 hover:text-amber-400 transition py-1 block cursor-pointer"
                >
                  ← Reenviar código a otro email
                </button>
              </form>
            )}

            {/* FASE 3: GOOGLE AUTHENTICATOR / FÓRMULA DEL DÍA */}
            {recPhase === 3 && (
              <form onSubmit={handleRecoveryPhase3} className="space-y-4">
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex flex-col gap-1.5">
                  <span className="font-bold flex items-center gap-1.5 text-amber-400">
                    <Sparkles className="w-4 h-4 shrink-0" />
                    Fase 3: Doble Factor Militar
                  </span>
                  <span className="text-neutral-300 text-[11px] leading-relaxed">
                    Introduce el código de Google Authenticator de 6 dígitos o utiliza la Fórmula Soberana del día.
                  </span>
                  <div className="mt-1 pt-1.5 border-t border-amber-500/20 text-[10px] text-amber-400 font-mono">
                    💡 PIN de respaldo para hoy: <strong>{String(new Date().getDate()).padStart(2, '0')}24</strong>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                    Código 2FA / PIN Soberano
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={rec2fa}
                    onChange={(e) => setRec2fa(e.target.value)}
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

                {recSuccessMsg && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-900/60 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{recSuccessMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{loading ? 'Restaurando Sesión...' : 'Fase 3: Completar Restauración y Acceder'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => { setRecPhase(2); setError(null); }}
                  className="w-full text-center text-xs text-neutral-500 hover:text-amber-400 transition py-1 block cursor-pointer"
                >
                  ← Volver a Fase 2
                </button>
              </form>
            )}
          </div>
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