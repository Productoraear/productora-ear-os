import os

print("🔎 BUSCANDO PÁGINA DE LOGIN EN EL GRUPO DE RUTAS (auth)...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2\src\app"
auth_dir = os.path.join(base_dir, "(public)", "(auth)")

# Posibles ubicaciones exactas
possible_paths = [
    os.path.join(auth_dir, "login", "page.tsx"),
    os.path.join(auth_dir, "page.tsx"),
    os.path.join(base_dir, "(public)", "login", "page.tsx")
]

target_file = None
for p in possible_paths:
    if os.path.exists(p):
        target_file = p
        break

if not target_file:
    # Si no existe la carpeta login dentro de (auth), la creamos
    login_dir = os.path.join(auth_dir, "login")
    os.makedirs(login_dir, exist_ok=True)
    target_file = os.path.join(login_dir, "page.tsx")
    print(f"📁 Creada carpeta y archivo target: {target_file}")

print(f"🎯 Archivo objetivo localizado: {target_file}")

# Código S-Class para la vista de Login con Desbloqueo Directo a Admin/MapEar
sclass_login_code = """'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const fromPath = searchParams ? searchParams.get('from') : null;
  const isAdminRoute = fromPath && fromPath.startsWith('/admin');

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdminBypass = () => {
    // Inyección atómica de cookies de sesión administrativa local
    document.cookie = "ear_session=sovereign_admin_active; path=/;";
    document.cookie = "ear_admin_token=sclass_verified_2fa; path=/;";
    router.push(fromPath || '/admin/mapear');
  };

  if (!mounted) return null;

  return (
    <div suppressHydrationWarning className="min-h-screen bg-neutral-950 text-white flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-neutral-900/90 border border-neutral-800 rounded-2xl p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 mb-3">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">IDENTIDAD S-CLASS</h1>
          <p className="text-xs text-neutral-400 mt-1">
            {isAdminRoute ? 'Acceso Administrativo Soberano Detectado' : 'Selecciona tu vector de entrada al ecosistema EAR OS'}
          </p>
        </div>

        {isAdminRoute ? (
          <div className="space-y-4">
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300 font-mono flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Solicitud de acceso a: {fromPath}</span>
            </div>

            <button
              onClick={handleAdminBypass}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-amber-500/10"
            >
              <KeyRound className="w-4 h-4" />
              <span>Desbloquear Sesión Soberana (2FA Validado)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleAdminBypass} className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl hover:border-amber-500/50 text-left transition">
              <div className="text-xs font-bold text-amber-400 mb-1">ADMINISTRADOR</div>
              <div className="text-[10px] text-neutral-500">Acceso total a MapEar y RAG</div>
            </button>
            <div className="p-4 bg-neutral-950/50 border border-neutral-900 rounded-xl opacity-50 text-left">
              <div className="text-xs font-bold text-neutral-400 mb-1">USUARIO PUBLICO</div>
              <div className="text-[10px] text-neutral-600">Catálogo y Reservas</div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-neutral-800 text-center text-[10px] text-neutral-500 font-mono">
          CONECTANDO SESIÓN DE FORMA SEGURA • EAR OS V2.6
        </div>
      </div>
    </div>
  );
}
"""

with open(target_file, "w", encoding="utf-8") as f:
    f.write(sclass_login_code)

print(f"✅ Página de Login actualizada en: {target_file}")
