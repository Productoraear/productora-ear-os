import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isFeatureEnabled } from '@/features/admin/api/FeatureFlagService';
import React from 'react';

/**
 * 🏛️ EAR OS GOLD - NEXUS LAYOUT (OS CORE)
 * Frontera Soberana con Validación SSR y Feature Flagging.
 */
export default async function NexusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  
  // 1. VALIDACIÓN SSR DE SESIÓN (Soberanía de Acceso)
  const userId = cookieStore.get('ear_os_user_id')?.value;
  const isAuth = userId || cookieStore.has('ear_os_auth_token') || cookieStore.has('sb-access-token');
  
  if (!isAuth) {
    console.warn(`🛡️ [SSR_NEXUS_SHIELD] Bloqueo de ruta privada. Redirigiendo a /login.`);
    redirect('/login?from=nexus');
  }

  // 2. VERIFICACIÓN DE RBAC PERSISTIDO (Soberanía de Rango)
  if (userId) {
    const { UserService } = await import('@/lib/services/UserService');
    const hasAccess = await UserService.hasRole(userId, 'ARQUITECTO');
    
    if (!hasAccess) {
      console.warn(`🚫 [RBAC_SHIELD] Usuario ${userId} sin privilegios de ARQUITECTO. Acceso denegado.`);
      redirect('/?error=INSUFFICIENT_RANK');
    }
  }

  // 2. VERIFICACIÓN DE MOTOR DE MÓDULOS (Feature Flag)
  const isNexusActive = await isFeatureEnabled('NEXUS_CORE');
  
  if (!isNexusActive) {
    console.warn(`🛑 [MODULE_SHIELD] El núcleo NEXUS está desactivado globalmente.`);
    // Si el núcleo está apagado, mostramos una UI de mantenimiento o redirigimos.
    // Para esta fase, redirigimos a una página de estado o home con mensaje.
    redirect('/?error=NEXUS_OFFLINE');
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      {/* Sidebar de Control Maestro (Placeholder para Fase 5) */}
      <aside className="w-64 border-r border-white/5 p-6 hidden md:block bg-black/40 backdrop-blur-xl">
        <div className="mb-10">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613]">Nexus OS</span>
          <h2 className="text-xl font-bold font-syne uppercase tracking-tighter">Command Center</h2>
        </div>
        <nav className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/40">
           <div className="hover:text-white transition-colors cursor-pointer">Dashboard</div>
           <div className="hover:text-white transition-colors cursor-pointer">Feature Flags</div>
           <div className="hover:text-white transition-colors cursor-pointer">Financial Ledger</div>
           <div className="hover:text-white transition-colors cursor-pointer">System Logs</div>
        </nav>
      </aside>

      <main className="flex-grow p-8 md:p-12 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
