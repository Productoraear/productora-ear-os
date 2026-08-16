'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Music, Truck, Users, Building2, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

type Archetype = 'ARTISTA' | 'PROVEEDOR' | 'AFILIADO' | 'INSTITUCIONAL' | null;

function SovereignLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedRole, setSelectedRole] = useState<Archetype>(null);
  const [isHydrating, setIsHydrating] = useState(true);

  // Parámetros de Dominancia Orgánica
  const fromPath = searchParams.get('from') || '/nexus';
  const affiliateRef = searchParams.get('ref');

  useEffect(() => {
    const roleParam = searchParams.get('role');

    // Si es un cliente accediendo a servicios, conectar sesión y redirigir inmediatamente
    if (roleParam === 'cliente' || fromPath.startsWith('/servicios')) {
      if (typeof document !== 'undefined') {
        document.cookie = `ear_os_role=cliente; path=/; max-age=86400; samesite=lax`;
        document.cookie = `ear_os_auth_token=true; path=/; max-age=86400; samesite=lax`;
      }
      router.push(fromPath || '/servicios');
      return;
    }

    // 1. Ingesta de Identidad y Auto-Focus (Reducción de Carga Cognitiva)
    if (fromPath.includes('/blog/b2g') || fromPath.includes('institucional') || fromPath.includes('/vimume')) {
      setSelectedRole('INSTITUCIONAL');
    } else if (fromPath.includes('/artistas') || fromPath.includes('/academia')) {
      setSelectedRole('ARTISTA');
    } else if (fromPath.includes('/proveedores') || fromPath.includes('/admin/flota')) {
      setSelectedRole('PROVEEDOR');
    } else if (affiliateRef || fromPath.includes('afiliado')) {
      setSelectedRole('AFILIADO');
    }

    // 2. Preservación del Contexto de Venta (Anti-Rebote)
    try {
      const activeDraft = typeof window !== 'undefined' ? sessionStorage.getItem('ear_booking_draft') : null;
      if (activeDraft) {
        console.log('⚡ [S-CLASS GATEWAY] Draft orgánico detectado. Listo para rehidratar post-login.');
      }
    } catch (e) {
      // Ignorar errores de storage en entornos restringidos
    }
    
    setIsHydrating(false);
  }, [fromPath, affiliateRef]);

  const handleArchetypeSelection = (role: Archetype) => {
    setSelectedRole(role);
    // Establecer cookies de sesión rápida para persistencia Edge
    if (typeof document !== 'undefined') {
      document.cookie = `ear_os_role=${role?.toLowerCase() || 'guest'}; path=/; max-age=86400; samesite=lax`;
      document.cookie = `ear_os_auth_token=true; path=/; max-age=86400; samesite=lax`;
    }

    setTimeout(() => {
      router.push(fromPath);
    }, 500);
  };

  if (isHydrating) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ecb613] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden selection:bg-[#ecb613] selection:text-black">
      
      {/* Fondo Aura Onyx */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ecb613]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl text-center space-y-10">
        
        {/* Cabecera Estratégica */}
        <div className="space-y-4">
          <div className="w-16 h-16 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(236,182,19,0.2)]">
            <Lock className="w-8 h-8 text-[#ecb613]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            IDENTIDAD <span className="text-[#ecb613]">VIMUME</span>
          </h1>
          <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
            No buscamos clientes, buscamos socios estratégicos. Seré tu cómplice en cada fase de la producción, garantizando cero fricción técnica y ejecución impecable. Selecciona tu vector de entrada.
          </p>
        </div>

        {/* Matriz de Arquetipos Adaptativa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-2xl mx-auto">
          <ArchetypeCard 
            title="ARTISTA" 
            subtitle="Gestión de Talento & Academia"
            icon={<Music className="w-6 h-6" />} 
            isSelected={selectedRole === 'ARTISTA'}
            onClick={() => handleArchetypeSelection('ARTISTA')}
          />
          <ArchetypeCard 
            title="PROVEEDOR" 
            subtitle="Logística GPS & Flota"
            icon={<Truck className="w-6 h-6" />} 
            isSelected={selectedRole === 'PROVEEDOR'}
            onClick={() => handleArchetypeSelection('PROVEEDOR')}
          />
          <ArchetypeCard 
            title="AFILIADO" 
            subtitle="Red de Valor (10% Ledger)"
            icon={<Users className="w-6 h-6" />} 
            isSelected={selectedRole === 'AFILIADO'}
            onClick={() => handleArchetypeSelection('AFILIADO')}
          />
          <ArchetypeCard 
            title="INSTITUCIONAL" 
            subtitle="Gobernanza B2G & ODS"
            icon={<Building2 className="w-6 h-6" />} 
            isSelected={selectedRole === 'INSTITUCIONAL'}
            onClick={() => handleArchetypeSelection('INSTITUCIONAL')}
          />
        </div>

        {/* Muelle Flotante (Dynamic Context Indicator) */}
        {fromPath !== '/nexus' && (
          <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-xs text-slate-300 animate-pulse mt-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Conectando sesión de forma segura para continuar hacia <strong className="text-white ml-1">{fromPath}</strong>
          </div>
        )}
      </div>

      <footer className="absolute bottom-6 text-center text-[10px] text-white/20 tracking-[0.4em] uppercase font-mono">
        Sovereign Gateway · Neural Guard v5.2 · Productora EAR
      </footer>
    </div>
  );
}

// Subcomponente de UI S-Class
function ArchetypeCard({ 
  title, 
  subtitle, 
  icon, 
  isSelected, 
  onClick 
}: { 
  title: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  return (
    <button 
      onClick={onClick}
      className={`relative group p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden cursor-pointer ${
        isSelected 
          ? 'bg-[#ecb613]/10 border-[#ecb613]/50 shadow-[0_0_40px_rgba(236,182,19,0.15)] scale-105' 
          : 'bg-[#0a0a0c] border-white/5 hover:border-white/20 hover:bg-white/5'
      }`}
    >
      <div className={`absolute top-0 left-0 w-1 h-full transition-colors duration-300 ${isSelected ? 'bg-[#ecb613]' : 'bg-transparent group-hover:bg-white/20'}`} />
      <div className="flex justify-between items-center">
        <div className={`p-3 rounded-xl ${isSelected ? 'bg-[#ecb613]/20 text-[#ecb613]' : 'bg-white/5 text-slate-400'}`}>
          {icon}
        </div>
        {isSelected && <ArrowRight className="w-5 h-5 text-[#ecb613]" />}
      </div>
      <h3 className={`text-lg font-extrabold mt-6 tracking-wide ${isSelected ? 'text-white' : 'text-slate-300'}`}>
        {title}
      </h3>
      <p className="text-xs text-slate-500 mt-1 font-mono uppercase tracking-wider">{subtitle}</p>
    </button>
  );
}

export default function SovereignLogin() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#ecb613] animate-spin" />
      </div>
    }>
      <SovereignLoginContent />
    </Suspense>
  );
}
