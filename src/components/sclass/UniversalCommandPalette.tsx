"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Command,
  Sparkles,
  ShieldCheck,
  Phone,
  FileText,
  Music,
  Users,
  Building2,
  Briefcase,
  X,
  ArrowRight,
  Zap,
  Terminal,
  Crown
} from 'lucide-react';
import { useTenantRole, TenantRole, ROLE_METADATA_MAP } from '@/contexts/TenantRoleContext';
import { CENTRALITA } from '@/lib/phone-constants';

interface ActionItem {
  id: string;
  category: 'NAVEGACION' | 'HERRAMIENTAS_ASTRA' | 'EXPEDIENTES_B2G' | 'COTIZADOR' | 'ROLES' | 'RAG_RESULT';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  badge?: string;
  action: () => void;
}

export const UniversalCommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [searchingRag, setSearchingRag] = useState(false);
  const router = useRouter();
  const { role, setRole } = useTenantRole();

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Dynamic live search on RAG API when query is 3+ chars
  useEffect(() => {
    if (query.trim().length >= 3) {
      setSearchingRag(true);
      const timer = setTimeout(async () => {
        try {
          const res = await fetch('/api/rag/query', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: query.trim(), limit: 5 })
          });
          const data = await res.json();
          if (data.success && Array.isArray(data.results)) {
            setRagResults(data.results);
          } else {
            setRagResults([]);
          }
        } catch {
          setRagResults([]);
        } finally {
          setSearchingRag(false);
        }
      }, 250);
      return () => clearTimeout(timer);
    } else {
      setRagResults([]);
      setSearchingRag(false);
    }
  }, [query]);

  const STATIC_ACTIONS: ActionItem[] = useMemo(() => [
    {
      id: 'act-astra-suite',
      category: 'HERRAMIENTAS_ASTRA',
      title: 'Abrir Suite Estratégica Astra OS',
      subtitle: '8 Motores de Decisión, Consejo de Mentes y Simulador',
      icon: <Terminal className="text-[#ecb613]" size={16} />,
      badge: '8 Motores',
      action: () => { router.push('/admin/astra'); setIsOpen(false); }
    },
    {
      id: 'act-bodas',
      category: 'COTIZADOR',
      title: 'Túnel Nupcial & Cotizador Bespoke',
      subtitle: 'Show Solista 350€, Bose 2.000W y Price-Lock 72h',
      icon: <Music className="text-[#ecb613]" size={16} />,
      badge: '5.0★ Bodas.net',
      action: () => { router.push('/bodas'); setIsOpen(false); }
    },
    {
      id: 'act-b2g-pozuelo',
      category: 'EXPEDIENTES_B2G',
      title: 'Expediente Pozuelo de Alarcón (13.775 €)',
      subtitle: 'Contratación Menor Art. 118.1 LCSP & Estimulación 40Hz',
      icon: <Building2 className="text-[#3b82f6]" size={16} />,
      badge: 'PLACSP Menor',
      action: () => { router.push('/vimume'); setIsOpen(false); }
    },
    {
      id: 'act-edwin-vault',
      category: 'NAVEGACION',
      title: 'Dossier y Bóveda de Artista — Edwin Agudelo',
      subtitle: 'Tenor lírico, archivo histórico y prensa',
      icon: <Crown className="text-[#ecb613]" size={16} />,
      badge: 'Tenor',
      action: () => { router.push('/artistas/edwin-agudelo'); setIsOpen(false); }
    },
    {
      id: 'act-empresarios',
      category: 'NAVEGACION',
      title: 'Acompañamiento Empresarial B2B',
      subtitle: 'Planes 1.000€ y 3.000€/mes con garantía de ROI',
      icon: <Briefcase className="text-[#10b981]" size={16} />,
      badge: 'ROI B2B',
      action: () => { router.push('/empresarios'); setIsOpen(false); }
    },
    {
      id: 'act-arsenal',
      category: 'NAVEGACION',
      title: 'Arsenal Técnico & Line Array Bose',
      subtitle: 'Microfonía Shure Axient Digital y 12 W/pax',
      icon: <Zap className="text-[#ecb613]" size={16} />,
      badge: 'Rider S-Class',
      action: () => { router.push('/arsenal'); setIsOpen(false); }
    },
    {
      id: 'act-whatsapp',
      category: 'COTIZADOR',
      title: 'Centralita de WhatsApp en Directo',
      subtitle: '+34 693 693 048 (Atención Inmediata)',
      icon: <Phone className="text-[#10b981]" size={16} />,
      badge: 'WhatsApp',
      action: () => { window.open(CENTRALITA.whatsapp, '_blank'); setIsOpen(false); }
    },
    {
      id: 'act-role-b2c',
      category: 'ROLES',
      title: 'Conmutar a: Novios & Bodas (B2C)',
      subtitle: 'Reconfigurar la interfaz hacia bodas y celebraciones',
      icon: <Users className="text-[#ecb613]" size={16} />,
      badge: role === 'B2C_NOVIOS' ? 'ACTIVO' : 'Switch',
      action: () => { setRole('B2C_NOVIOS'); router.push('/bodas'); setIsOpen(false); }
    },
    {
      id: 'act-role-b2g',
      category: 'ROLES',
      title: 'Conmutar a: Administración Pública (B2G)',
      subtitle: 'Reconfigurar la interfaz hacia contratos menores y LCSP',
      icon: <Building2 className="text-[#3b82f6]" size={16} />,
      badge: role === 'B2G_AYUNTAMIENTOS' ? 'ACTIVO' : 'Switch',
      action: () => { setRole('B2G_AYUNTAMIENTOS'); router.push('/vimume'); setIsOpen(false); }
    },
    {
      id: 'act-role-b2b',
      category: 'ROLES',
      title: 'Conmutar a: Transformación B2B',
      subtitle: 'Reconfigurar la interfaz hacia planes de empresa',
      icon: <Briefcase className="text-[#10b981]" size={16} />,
      badge: role === 'B2B_EMPRESARIOS' ? 'ACTIVO' : 'Switch',
      action: () => { setRole('B2B_EMPRESARIOS'); router.push('/empresarios'); setIsOpen(false); }
    },
    {
      id: 'act-role-artist',
      category: 'ROLES',
      title: 'Conmutar a: Artista The Signal',
      subtitle: 'Reconfigurar la interfaz hacia soberanía 80/10/10',
      icon: <Crown className="text-[#a855f7]" size={16} />,
      badge: role === 'ARTISTA_THE_SIGNAL' ? 'ACTIVO' : 'Switch',
      action: () => { setRole('ARTISTA_THE_SIGNAL'); router.push('/artistas/edwin-agudelo'); setIsOpen(false); }
    }
  ], [router, role, setRole]);

  const filteredStatic = useMemo(() => {
    if (!query.trim()) return STATIC_ACTIONS;
    const q = query.toLowerCase();
    return STATIC_ACTIONS.filter(
      a => a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
    );
  }, [STATIC_ACTIONS, query]);

  return (
    <>
      {/* Floating Trigger Badge for Mobile / No-Keyboard users */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Paleta de Comandos Global (Ctrl+K)"
        className="fixed bottom-6 left-6 z-40 px-3.5 py-2 rounded-2xl bg-[#09090d]/90 hover:bg-[#ecb613] hover:text-black border border-white/10 hover:border-[#ecb613] backdrop-blur-xl text-white/70 hover:text-black text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-2 shadow-2xl transition-all group cursor-pointer"
      >
        <Command size={13} className="text-[#ecb613] group-hover:text-black transition-colors" />
        <span>Comandos</span>
        <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-mono text-white/50 group-hover:text-black group-hover:bg-black/10">Ctrl+K</kbd>
      </button>

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              className="w-full max-w-2xl bg-[#0a0a0f] border border-[#ecb613]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              {/* Input Header */}
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center gap-3 bg-black/50">
                <Search size={18} className="text-[#ecb613] shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Escribe un comando, ruta o consulta en los 9.569 nodos RAG..."
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm sm:text-base text-white placeholder-white/40 outline-none font-mono"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 custom-scrollbar">
                
                {/* RAG Results (Live search) */}
                {ragResults.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <Sparkles size={11} />
                      <span>Resultados de la Bóveda RAG ({ragResults.length})</span>
                    </div>
                    {ragResults.map((res, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          if (res.path && res.path.startsWith('/')) router.push(res.path);
                          setIsOpen(false);
                        }}
                        className="p-3 rounded-2xl bg-emerald-950/20 hover:bg-emerald-900/40 border border-emerald-500/20 hover:border-emerald-500/50 cursor-pointer transition-all space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>{res.title}</span>
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Score: {res.adjustedScore}
                          </span>
                        </div>
                        <p className="text-[11px] text-white/70 line-clamp-2 leading-relaxed">
                          {res.snippet}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {searchingRag && (
                  <div className="p-3 text-center text-xs font-mono text-[#ecb613] animate-pulse flex items-center justify-center gap-2">
                    <Sparkles size={14} />
                    <span>Consultando 9.569 nodos cognitivos en milisegundos...</span>
                  </div>
                )}

                {/* Static Commands */}
                <div className="space-y-1.5">
                  <div className="px-3 text-[10px] font-mono font-bold uppercase tracking-widest text-white/40">
                    Comandos del Sistema ({filteredStatic.length})
                  </div>
                  {filteredStatic.map(action => (
                    <div
                      key={action.id}
                      onClick={action.action}
                      className="p-3 rounded-2xl bg-white/5 hover:bg-[#ecb613]/10 border border-white/5 hover:border-[#ecb613]/40 cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-black/60 border border-white/10 group-hover:border-[#ecb613]/40 transition-colors">
                          {action.icon}
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-white group-hover:text-[#ecb613] transition-colors font-syne">
                            {action.title}
                          </div>
                          <div className="text-[11px] text-white/50 font-mono">
                            {action.subtitle}
                          </div>
                        </div>
                      </div>

                      {action.badge && (
                        <span className="text-[9px] font-mono text-[#ecb613] bg-[#ecb613]/10 border border-[#ecb613]/20 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                          {action.badge}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

              </div>

              {/* Footer / Shortcuts reminder */}
              <div className="p-3 bg-black/80 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 px-4">
                <span>Rol Activo: <strong className="text-[#ecb613]">{ROLE_METADATA_MAP[role].title}</strong></span>
                <span className="flex items-center gap-2">
                  <kbd className="px-1 py-0.5 rounded bg-white/10 text-white/60">ESC</kbd> para cerrar
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default UniversalCommandPalette;
