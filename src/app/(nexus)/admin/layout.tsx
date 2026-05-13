import React from 'react';
import { Sidebar } from '@/components/SClass/Sidebar';
import { TacticalTracker } from '@/components/SClass/TacticalTracker';
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#050505]">
        {/* NAVEGACIÓN PERSISTENTE */}
        <Sidebar />
        
        {/* CONTENIDO DINÁMICO */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8 relative">
            {/* Fondo de Grano y Gradientes Aura Onyx */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4a855]/10 blur-[150px] rounded-full" />
              <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#d4a855]/5 blur-[100px] rounded-full" />
            </div>
            
            <div className="relative z-10">
              {children}
            </div>
          </div>

          {/* TELEMETRÍA INFERIOR PERSISTENTE */}
          <div className="border-t border-white/5 bg-black/80 backdrop-blur-md p-4">
            <TacticalTracker />
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
