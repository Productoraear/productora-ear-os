"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Users,
  Layers,
  Landmark,
  Music,
  ShieldCheck,
  ChevronDown,
  Sparkles
} from "lucide-react";

interface SubItem {
  name: string;
  path: string;
  badge?: string;
  badgeColor?: string;
}

interface NavCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  items: SubItem[];
}

export default function AdminNasaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navCategories: NavCategory[] = [
    {
      id: "core",
      title: "Centro de Mando",
      icon: LayoutGrid,
      items: [
        { name: "Dashboard Central", path: "/admin", badge: "ACTIVO", badgeColor: "text-amber-400 bg-amber-950/40 border-amber-800" },
      ],
    },
    {
      id: "hunter",
      title: "Flota & Directorio",
      icon: Users,
      items: [
        { name: "Directorio de Proveedores (27K)", path: "/admin/directorio", badge: "27.079" },
        { name: "Cazador Fantasma", path: "/admin/hunter", badge: "BACKGROUND" },
      ],
    },
    {
      id: "sourcing",
      title: "Presupuestos & Producción",
      icon: Layers,
      items: [
        { name: "Cabina Sourcing 265K", path: "/admin/sourcing", badge: "S-CLASS", badgeColor: "text-emerald-400 bg-emerald-950/40 border-emerald-800" },
      ],
    },
    {
      id: "b2g",
      title: "Contratación B2G",
      icon: Landmark,
      items: [
        { name: "Expedientes Menores (Art. 118)", path: "/admin/cockpit", badge: "<14.250€" },
        { name: "Proyecto VIMUME", path: "/admin/vimume", badge: "MAYORES" },
      ],
    },
    {
      id: "commerce",
      title: "Monetización Digital",
      icon: Music,
      items: [
        { name: "Canciones de Autor (Stripe)", path: "/admin/digital-products", badge: "100€ LOCK" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070709] text-neutral-100 flex font-sans antialiased selection:bg-amber-500/30 selection:text-amber-200">
      <aside className="w-72 bg-[#0c0c0e] border-r border-neutral-800/80 flex flex-col h-screen sticky top-0 shrink-0 select-none z-30">
        <div className="p-5 border-b border-neutral-800/80 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold tracking-widest text-white uppercase block">
                EAR OS <span className="text-amber-400">V2.4</span>
              </span>
              <span className="text-[10px] font-mono text-neutral-500 block uppercase">
                Sovereign Control
              </span>
            </div>
          </Link>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-800/50">
            ONLINE
          </span>
        </div>

        <nav className="flex-1 p-3 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {navCategories.map((cat) => {
            const Icon = cat.icon;
            const isClosed = collapsed[cat.id];
            return (
              <div key={cat.id} className="space-y-1">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-900/60 font-mono text-[11px] font-bold tracking-wider transition-colors"
                >
                  <span className="flex items-center gap-2 uppercase">
                    <Icon className="w-3.5 h-3.5 text-amber-400/80" />
                    {cat.title}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isClosed ? "-rotate-90 text-neutral-600" : "text-neutral-400"}`} />
                </button>

                {!isClosed && (
                  <div className="space-y-0.5 pl-2">
                    {cat.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <Link
                          key={item.path}
                          href={item.path}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg font-medium transition-all ${
                            isActive
                              ? "bg-amber-400/10 text-amber-300 font-bold border border-amber-400/30 shadow-sm"
                              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/40"
                          }`}
                        >
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${item.badgeColor || "text-neutral-400 bg-neutral-900 border-neutral-800"}`}>
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-neutral-800/80 bg-neutral-950/40">
          <div className="flex items-center justify-between p-2 rounded-lg bg-neutral-900/60 border border-neutral-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-amber-400 text-neutral-950 font-bold flex items-center justify-center text-xs shrink-0 font-mono">
                EA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">Edwin Agudelo</p>
                <p className="text-[10px] font-mono text-neutral-500 truncate">Méntrida · S-Class</p>
              </div>
            </div>
            <span className="text-amber-400/80">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-y-auto bg-[#070709] p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
