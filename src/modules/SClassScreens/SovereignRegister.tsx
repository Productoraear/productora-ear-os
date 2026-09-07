"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SovereignRegister() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateForm = (): string | null => {
    if (!name.trim()) return 'El nombre es obligatorio.';
    if (!email.trim()) return 'El email es obligatorio.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Formato de email inválido.';
    if (password.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
    if (password !== confirmPassword) return 'Las contraseñas no coinciden.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/onboarding/select-profile');
        }, 1500);
      } else {
        if (res.status === 409) {
          setError('Este email ya está registrado. Intenta iniciar sesión.');
        } else {
          setError(data.message || 'Error en el registro. Inténtalo de nuevo.');
        }
      }
    } catch {
      setError('Error conectando con el servidor. Verifica tu conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans selection:bg-amber-500 selection:text-black">
      <div className="max-w-md w-full bg-neutral-950/95 border border-neutral-800 rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">

        {/* CABECERA */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-2">
            <UserPlus className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white uppercase">
            Registro S-Class
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Acceso Soberano al Ecosistema EAR OS V2
          </p>
        </div>

        {/* ESTADO DE ÉXITO */}
        {success ? (
          <div className="text-center py-12 space-y-4">
            <div className="inline-flex p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-emerald-400">
              Registro Completado
            </h2>
            <p className="text-xs text-neutral-400">
              Redirigiendo a selección de perfil operativo...
            </p>
            <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: '100%' }} />
            </div>
          </div>
        ) : (
          /* FORMULARIO */
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* BADGE DE SEGURIDAD */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-xl text-xs font-mono text-neutral-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Registro encriptado • Protección bcryptjs • Split Soberano 80/10/10</span>
            </div>

            {/* NOMBRE */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Nombre Completo
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre profesional"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* CONTRASEÑA */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Contraseña (mín. 8 caracteres)
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition placeholder:text-neutral-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-amber-400 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRMAR CONTRASEÑA */}
            <div>
              <label className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block mb-1.5">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••••••"
                  className="w-full pl-11 pr-4 py-3 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500 transition placeholder:text-neutral-600"
                />
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-xl text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10 disabled:opacity-50"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Registrando...' : 'CREAR CUENTA SOBERANA'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* ENLACE A LOGIN */}
            <div className="text-center pt-2">
              <p className="text-[11px] text-neutral-500">
                ¿Ya tienes cuenta?{' '}
                <Link
                  href="/login"
                  className="text-amber-400 hover:text-amber-300 font-bold transition"
                >
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </form>
        )}

        <div className="mt-6 text-center text-[10px] text-neutral-600 font-mono">
          REGISTRO SOBERANO • BCRYPTJS E2EE • EAR OS V2.6
        </div>
      </div>
    </div>
  );
}