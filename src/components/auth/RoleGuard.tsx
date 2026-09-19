"use client";

import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, KeyRound, Sparkles, AlertCircle } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  requiredRole?: 'ADMIN' | 'SOVEREIGN' | 'EDITOR';
}

const SOVEREIGN_KEY = 'Ear2024Ear*';
const STORAGE_KEY = 'ear_os_sovereign_session';

export const RoleGuard: React.FC<RoleGuardProps> = ({ children, requiredRole = 'ADMIN' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const session = localStorage.getItem(STORAGE_KEY);
    if (session === SOVEREIGN_KEY) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SOVEREIGN_KEY) {
      localStorage.setItem(STORAGE_KEY, SOVEREIGN_KEY);
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Clave soberana incorrecta. Acceso denegado.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center font-mono text-xs text-zinc-500">
        Verificando credenciales soberanas EAR OS…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030305] text-white flex items-center justify-center p-4 selection:bg-[#ecb613] selection:text-black">
        <div className="w-full max-w-md p-8 rounded-3xl bg-gradient-to-b from-[#0a0a12] to-[#050508] border border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] mb-2">
              <ShieldCheck size={28} />
            </div>
            <h2 className="text-xl font-bold font-syne text-white">Acceso Restringido S-Class</h2>
            <p className="text-xs text-zinc-400 font-mono">
              Consola de Administración y Gobernanza EAR OS ({requiredRole})
            </p>
          </div>

          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                <KeyRound size={12} className="text-[#ecb613]" /> Clave Soberana
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/80 border border-white/10 text-sm text-white font-mono focus:border-[#ecb613] focus:outline-none tracking-widest"
                autoFocus
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#ecb613] hover:bg-[#d8a40f] text-black font-bold font-mono text-xs flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 transition-all"
            >
              <Lock size={14} />
              Desbloquear Consola Administrador
            </button>
          </form>

          <div className="text-center text-[10px] font-mono text-zinc-600 border-t border-white/5 pt-4">
            Productora EAR OS · Telemetría Protegida SHA-256 · Méntrida
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
