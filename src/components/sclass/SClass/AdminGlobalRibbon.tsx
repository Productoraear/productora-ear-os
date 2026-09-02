'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Truck, 
  Users, 
  Building2, 
  Sparkles, 
  ShieldCheck,
  ChevronRight,
  Zap,
  PhoneCall
} from 'lucide-react';

interface PillarTab {
  id: string;
  name: string;
  mainPath: string;
  icon: any;
  badge: string;
  subRoutes: { name: string; path: string }[];
}

const PILLAR_TABS: PillarTab[] = [
  {
    id: 'operaciones',
    name: 'Operaciones & Flota',
    mainPath: '/admin',
    icon: Truck,
    badge: 'Méntrida Hub',
    subRoutes: [
      { name: 'Cockpit Omega', path: '/admin' },
      { name: 'Flota & Rutas', path: '/admin/flota' },
      { name: 'Red 8.120 pSEO', path: '/admin/rutas' },
    ]
  },
  {
    id: 'ecosistema',
    name: 'Ecosistema & Proveedores',
    mainPath: '/admin/crm',
    icon: Users,
    badge: 'Split 80/10/10',
    subRoutes: [
      { name: 'Roster Artistas', path: '/admin/crm' },
      { name: '11.690 Fincas', path: '/admin/hunter' },
      { name: 'Campus LMS', path: '/admin/academia' },
    ]
  },
  {
    id: 'institucional',
    name: 'Institucional & B2G (FITUR)',
    mainPath: '/admin/flota?tab=fitur2026',
    icon: Building2,
    badge: '217 Embajadas',
    subRoutes: [
      { name: 'FITUR 2026', path: '/admin/flota?tab=fitur2026' },
      { name: 'Art. 118 LCSP', path: '/admin/flota?tab=b2g' },
      { name: 'Alumbrado Navideño', path: '/admin/iluminacion' },
    ]
  },
  {
    id: 'conversion',
    name: 'Conversión & Clientes',
    mainPath: '/admin/oraculo',
    icon: Sparkles,
    badge: 'Astra v4.1',
    subRoutes: [
      { name: 'Oráculo ASTRA', path: '/admin/oraculo' },
      { name: 'Mobile Studio OLED', path: '/admin/mobile-studio' },
      { name: 'Arsenal Hardware', path: '/arsenal' },
      { name: 'Reactor VIMUME', path: '/admin/vimume' },
    ]
  },
  {
    id: 'gobernanza',
    name: 'Gobernanza & Finanzas',
    mainPath: '/admin/configurador',
    icon: ShieldCheck,
    badge: 'Stripe 100€',
    subRoutes: [
      { name: 'Tarifas & Split', path: '/admin/configurador' },
      { name: 'Afiliados', path: '/admin/afiliados' },
      { name: 'Estado Táctico', path: '/admin/estado' },
    ]
  }
];

export function AdminGlobalRibbon() {
  const pathname = usePathname();

  // Determinar el pilar activo
  const activePillar = PILLAR_TABS.find(pillar => 
    pillar.subRoutes.some(sub => pathname === sub.path || (sub.path !== '/admin' && pathname?.startsWith(sub.path)))
  ) || PILLAR_TABS[0];

  return (
    <div className="w-full bg-[#08080c]/90 border-b border-white/10 backdrop-blur-xl sticky top-0 z-40 px-4 py-2.5 space-y-2">
      
      {/* 1. FILA DE PILARES MAESTROS (GRANDES CATEGORÍAS) */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 shrink-0">
          {PILLAR_TABS.map((pillar) => {
            const isPillarActive = activePillar.id === pillar.id;
            const PillarIcon = pillar.icon;
            return (
              <Link
                key={pillar.id}
                href={pillar.mainPath}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs transition-all cursor-pointer whitespace-nowrap ${
                  isPillarActive
                    ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_15px_rgba(236,182,19,0.3)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                <PillarIcon size={13} className={isPillarActive ? 'text-black' : 'text-zinc-400'} />
                <span>{pillar.name.split(' ')[0]} {pillar.name.split(' ')[1]}</span>
                {isPillarActive && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-black font-bold">
                    {pillar.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* ACCESO RÁPIDO RETENCIÓN TELEFÓNICA */}
        <div className="hidden lg:flex items-center gap-2 shrink-0 text-[10px] font-mono text-zinc-400 border-l border-white/10 pl-3">
          <PhoneCall size={12} className="text-emerald-400" />
          <span className="text-zinc-300 font-bold">+34 693 693 048</span>
          <span className="text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold">
            SLA 99.9%
          </span>
        </div>
      </div>

      {/* 2. FILA DE SUBPESTAÑAS DEL PILAR ACTIVO */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-white/5">
        <span className="text-[10px] font-mono text-[#ecb613] uppercase font-bold tracking-wider shrink-0 flex items-center gap-1">
          <span>{activePillar.name}</span>
          <ChevronRight size={11} className="text-zinc-500" />
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {activePillar.subRoutes.map((sub) => {
            const isSubActive = pathname === sub.path || (sub.path !== '/admin' && pathname?.startsWith(sub.path));
            return (
              <Link
                key={sub.path}
                href={sub.path}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer whitespace-nowrap ${
                  isSubActive
                    ? 'bg-white/15 text-white font-bold border border-white/20 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {sub.name}
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default AdminGlobalRibbon;
