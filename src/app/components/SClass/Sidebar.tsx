'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Activity, 
  Target, 
  Users, 
  Truck, 
  Sparkles, 
  Megaphone, 
  Settings, 
  ShieldCheck, 
  LogOut,
  Smartphone,
  Menu,
  X,
  Lightbulb,
  ChevronDown,
  ChevronRight,
  Search,
  Building2,
  GraduationCap,
  FileText,
  DollarSign,
  Radio,
  Music,
  Compass,
  Cpu
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

interface SubNavItem {
  name: string;
  path: string;
  badge?: string;
  badgeColor?: string;
  icon?: any;
}

interface NavCategory {
  id: string;
  categoryName: string;
  icon: any;
  items: SubNavItem[];
}

const HIERARCHICAL_NAV: NavCategory[] = [
  {
    id: 'operaciones',
    categoryName: '1. Operaciones & Flota',
    icon: Truck,
    items: [
      { name: 'Cockpit Ejecutivo', path: '/admin', badge: 'En Vivo', icon: LayoutDashboard },
      { name: 'Control de Flota', path: '/admin/flota', badge: 'Méntrida', icon: Truck },
      { name: 'Mapeo Territorial pSEO', path: '/admin/rutas', badge: '8.120 URLs', icon: Compass },
    ]
  },
  {
    id: 'ecosistema',
    categoryName: '2. Ecosistema & Proveedores',
    icon: Users,
    items: [
      { name: 'Artistas & Solistas', path: '/admin/crm', badge: 'Split 80/10/10', icon: Music },
      { name: '11.690 Fincas (Hunter)', path: '/admin/hunter', badge: 'Scraping', icon: Target },
      { name: 'Campus LMS Artistas', path: '/admin/academia', badge: 'Riders', icon: GraduationCap },
    ]
  },
  {
    id: 'institucional',
    categoryName: '3. Institucional & B2G (FITUR)',
    icon: Building2,
    items: [
      { name: 'FITUR 2026 & Despachos', path: '/admin/flota?tab=fitur2026', badge: '217 Embajadas', icon: Building2 },
      { name: 'Licitaciones Art. 118 LCSP', path: '/admin/flota?tab=b2g', badge: '< 14.250 €', icon: FileText },
      { name: 'Alumbrado Navideño B2G', path: '/admin/iluminacion', badge: 'Festejos', icon: Lightbulb },
    ]
  },
  {
    id: 'conversion',
    categoryName: '4. Conversión & Clientes',
    icon: Sparkles,
    items: [
      { name: 'Oráculo ASTRA', path: '/admin/oraculo', badge: 'Astra v4.1', icon: Sparkles },
      { name: 'Mobile Studio OLED', path: '/admin/mobile-studio', badge: 'Edge Engine', icon: Smartphone },
      { name: 'Arsenal Hardware S-Class', path: '/arsenal', badge: 'Novastar 4K', icon: Megaphone },
      { name: 'Reactor VIMUME', path: '/admin/vimume', badge: 'Social <75dB', icon: Activity },
    ]
  },
  {
    id: 'gobernanza',
    categoryName: '5. Finanzas & Auditoría',
    icon: ShieldCheck,
    items: [
      { name: 'Configurador & Tarifas', path: '/admin/configurador', badge: 'Stripe 100€', icon: DollarSign },
      { name: 'Red de Afiliados', path: '/admin/afiliados', badge: 'Payouts', icon: Radio },
      { name: 'Estado Táctico (Health)', path: '/admin/estado', badge: 'TRL-8', icon: ShieldCheck },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    operaciones: true,
    ecosistema: true,
    institucional: true,
    conversion: true,
    gobernanza: true
  });

  // Expandir automáticamente la categoría que contenga la ruta activa
  useEffect(() => {
    HIERARCHICAL_NAV.forEach(cat => {
      const hasActive = cat.items.some(item => pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path)));
      if (hasActive) {
        setOpenCategories(prev => ({ ...prev, [cat.id]: true }));
      }
    });
  }, [pathname]);

  const toggleCategory = (catId: string) => {
    setOpenCategories(prev => ({ ...prev, [catId]: !prev[catId] }));
  };

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch (error) {
      console.warn('Fallback logout cleanup:', error);
    }
    try {
      localStorage.removeItem('ear_admin_auth');
      localStorage.removeItem('ear_user_role');
      document.cookie = 'ear_session=; path=/; max-age=0';
      document.cookie = 'ear_admin_token=; path=/; max-age=0';
      sessionStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  // Filtrado reactivo por término de búsqueda
  const filteredCategories = HIERARCHICAL_NAV.map(cat => {
    if (!searchFilter.trim()) return cat;
    const matchedItems = cat.items.filter(item => 
      item.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      cat.categoryName.toLowerCase().includes(searchFilter.toLowerCase())
    );
    return {
      ...cat,
      items: matchedItems
    };
  }).filter(cat => cat.items.length > 0);

  const navContent = (
    <div className="flex flex-col h-full bg-[#08080c] border-r border-white/10 select-none">
      
      {/* HEADER LOGO S-CLASS */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent flex items-center justify-between">
        <Link 
          href="/admin" 
          onClick={() => setMobileOpen(false)} 
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ecb613] to-amber-300 flex items-center justify-center text-black font-black font-syne text-xs shadow-[0_0_15px_rgba(236,182,19,0.4)] group-hover:scale-105 transition-transform">
            Ω
          </div>
          <div>
            <div className="font-syne font-black text-sm tracking-wider text-white group-hover:text-[#ecb613] transition-colors flex items-center gap-1.5">
              <span>S-CLASS OS</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#ecb613]/20 text-[#ecb613] font-mono font-bold">
                ENTERPRISE
              </span>
            </div>
            <div className="font-mono uppercase text-[9px] tracking-widest text-zinc-400">
              Consola Central · v4.2
            </div>
          </div>
        </Link>
        
        {/* BOTÓN CERRAR EN MÓVIL */}
        <button
          onClick={() => setMobileOpen(false)}
          className="md:hidden p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 cursor-pointer"
          aria-label="Cerrar navegación"
        >
          <X size={18} />
        </button>
      </div>

      {/* QUICK COMMAND FILTER (BUSCADOR INTERNO DE SUBPESTAÑAS) */}
      <div className="p-3 border-b border-white/5">
        <div className="relative flex items-center">
          <Search size={13} className="absolute left-3 text-zinc-500" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filtrar pestañas (ej. flota, artistas, b2g)..."
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-white placeholder:text-zinc-600 text-[11px] font-mono focus:outline-none focus:border-[#ecb613] transition-colors"
          />
          {searchFilter && (
            <button 
              onClick={() => setSearchFilter('')}
              className="absolute right-2.5 text-zinc-500 hover:text-white text-xs font-mono"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* ÁRBOL DE CATEGORÍAS Y SUBPESTAÑAS CLICABLES */}
      <nav className="flex-1 p-2 space-y-1.5 overflow-y-auto no-scrollbar">
        {filteredCategories.map((cat) => {
          const isOpen = searchFilter.trim() ? true : !!openCategories[cat.id];
          const hasActiveChild = cat.items.some(it => pathname === it.path || (it.path !== '/admin' && pathname?.startsWith(it.path)));
          const CatIcon = cat.icon;

          return (
            <div key={cat.id} className="rounded-2xl overflow-hidden border border-white/[0.04] bg-white/[0.01]">
              
              {/* CABECERA DE CATEGORÍA (CLICABLE PARA COLAPSAR/EXPANDIR) */}
              <button
                onClick={() => toggleCategory(cat.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                  hasActiveChild ? 'text-[#ecb613] bg-[#ecb613]/5' : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <CatIcon size={14} className={hasActiveChild ? 'text-[#ecb613]' : 'text-zinc-500'} />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                    {cat.categoryName}
                  </span>
                </div>
                <div className="text-zinc-500">
                  {isOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </div>
              </button>

              {/* LISTA DE SUBPESTAÑAS HIJAS */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="px-1.5 pb-1.5 space-y-0.5"
                  >
                    {cat.items.map((item) => {
                      const isActive = pathname === item.path || (item.path !== '/admin' && pathname?.startsWith(item.path));
                      const ItemIcon = item.icon || ChevronRight;

                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          onClick={() => setMobileOpen(false)}
                          className={`
                            group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer block text-left
                            ${isActive 
                              ? 'bg-[#ecb613] text-black font-bold shadow-[0_0_15px_rgba(236,182,19,0.3)]' 
                              : 'text-zinc-400 hover:text-white hover:bg-white/[0.06]'}
                          `}
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <ItemIcon size={13} className={isActive ? 'text-black' : 'text-zinc-500 group-hover:text-[#ecb613] transition-colors'} />
                            <span className="text-[11px] font-mono font-medium truncate">
                              {item.name}
                            </span>
                          </div>

                          {item.badge && (
                            <span className={`text-[8px] font-mono uppercase px-1.5 py-0.5 rounded-full shrink-0 font-bold ${
                              isActive 
                                ? 'bg-black/20 text-black border border-black/20' 
                                : 'bg-white/5 text-zinc-500 group-hover:text-zinc-300 border border-white/10'
                            }`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* FOOTER CORPORATIVO CON TELEMETRÍA Y LOGOUT */}
      <div className="p-3 border-t border-white/10 bg-[#050508] space-y-2.5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Consola Segura</span>
          </div>
          <span className="text-[9px] font-mono text-zinc-500">TRL-8 Cert</span>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 hover:text-red-300 font-mono text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <LogOut size={13} />
          <span>Cerrar Sesión</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* BOTÓN DISPARADOR MÓVIL */}
      <div className="md:hidden fixed top-3 left-3 z-[80]">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2.5 rounded-2xl bg-[#0a0a10]/95 backdrop-blur-md border border-[#ecb613]/40 text-[#ecb613] hover:text-white shadow-2xl flex items-center gap-2 text-xs font-mono font-bold cursor-pointer"
          aria-label="Abrir Menú de Administración"
        >
          <Menu size={18} />
          <span className="text-[10px] tracking-wider uppercase font-bold">Navegación</span>
        </button>
      </div>

      {/* SIDEBAR DESKTOP PERSISTENTE */}
      <aside className="hidden md:flex w-72 h-screen bg-[#08080c] border-r border-white/10 flex-col sticky top-0 overflow-hidden z-[60] shrink-0 pointer-events-auto shadow-[10px_0_40px_rgba(0,0,0,0.8)]">
        {navContent}
      </aside>

      {/* DRAWER MÓVIL SLIDE-OVER */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-[85]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="md:hidden fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] z-[90] shadow-2xl"
            >
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Sidebar;
