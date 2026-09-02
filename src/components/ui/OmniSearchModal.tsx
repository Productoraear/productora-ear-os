'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, X, Sparkles, Briefcase, Car, Zap, Music, Building2, 
  Activity, ArrowRight, CornerDownLeft, Lock, PhoneCall, ExternalLink,
  Loader2, Bot, Layers
} from 'lucide-react';
import { useSharedContext } from '@/app/context/SharedContext';
import { GLOBAL_SEARCH_INDEX, SEARCH_CATEGORY_PILLS, SearchIndexItem } from '@/data/global-search-index';

export default function OmniSearchModal() {
  const { isSearchOpen, setIsSearchOpen } = useSharedContext();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [ragAnswer, setRagAnswer] = useState<string | null>(null);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setRagAnswer(null);
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K and ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(!isSearchOpen);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  // Filter items based on query and category
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return GLOBAL_SEARCH_INDEX.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      if (!q) return true;

      const titleMatch = item.title.toLowerCase().includes(q);
      const subMatch = item.subtitle.toLowerCase().includes(q);
      const catMatch = item.categoryLabel.toLowerCase().includes(q);
      const keywordMatch = item.keywords.some((k) => k.toLowerCase().includes(q));

      return titleMatch || subMatch || catMatch || keywordMatch;
    });
  }, [query, selectedCategory]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredItems, selectedCategory]);

  // Handle Keyboard Navigation (Up / Down / Enter)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredItems[selectedIndex];
      if (selected) {
        handleNavigate(selected.url);
      }
    }
  };

  const handleNavigate = (url: string) => {
    setIsSearchOpen(false);
    router.push(url);
  };

  // Consult RAG Neural Intelligence
  const handleQueryRag = async () => {
    if (!query.trim()) return;
    setIsSearchingRag(true);
    setRagAnswer(null);

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      const data = await res.json();
      if (data?.response) {
        setRagAnswer(data.response);
      } else if (data?.results?.[0]?.content) {
        setRagAnswer(data.results[0].content);
      } else {
        setRagAnswer('El Oráculo de EAR OS procesó la consulta. Por favor contacta con el Concierge Técnico para una resolución inmediata.');
      }
    } catch {
      setRagAnswer('No se pudo conectar con el motor RAG en este instante. Por favor utiliza los resultados directos.');
    } finally {
      setIsSearchingRag(false);
    }
  };

  const renderCategoryIcon = (category: string) => {
    switch (category) {
      case 'servicios':
        return <Briefcase className="w-4 h-4 text-emerald-400" />;
      case 'flota':
        return <Car className="w-4 h-4 text-[#ecb613]" />;
      case 'arsenal':
        return <Zap className="w-4 h-4 text-amber-400" />;
      case 'artistas':
        return <Music className="w-4 h-4 text-purple-400" />;
      case 'b2g':
        return <Building2 className="w-4 h-4 text-blue-400" />;
      case 'vimume':
        return <Activity className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#ecb613]" />;
    }
  };

  if (!isSearchOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/85 backdrop-blur-xl">
        {/* Backdrop click to close */}
        <div 
          className="fixed inset-0" 
          onClick={() => setIsSearchOpen(false)} 
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -15 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-[#090909] border border-[#ecb613]/40 rounded-3xl shadow-[0_0_60px_rgba(236,182,19,0.15)] overflow-hidden flex flex-col max-h-[85vh] z-10"
        >
          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              1. INPUT SEARCH BAR CON GLOW S-CLASS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-black/50">
            <Search className="w-5 h-5 text-[#ecb613] shrink-0" />
            
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setRagAnswer(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Buscar bodas, chófer VIP, luces de navidad, artistas, licitaciones..."
              className="flex-1 bg-transparent text-white text-base sm:text-lg placeholder-neutral-500 focus:outline-none font-medium"
            />

            {query && (
              <button
                onClick={() => {
                  setQuery('');
                  setRagAnswer(null);
                  inputRef.current?.focus();
                }}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setIsSearchOpen(false)}
              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-neutral-400 hover:text-white text-xs font-mono transition-colors"
            >
              ESC
            </button>
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              2. SMART CATEGORY PILLS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-black/30 border-b border-white/5 overflow-x-auto scrollbar-none">
            {SEARCH_CATEGORY_PILLS.map((pill) => {
              const isSelected = selectedCategory === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setSelectedCategory(pill.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ecb613] text-black font-bold shadow-md shadow-[#ecb613]/20'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              3. RESULTADOS DE BÚSQUEDA / SUGERENCIAS
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div 
            ref={resultsContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-2 max-h-[50vh]"
          >
            {/* RAG Answer Display if Generated */}
            {ragAnswer && (
              <div className="p-4 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-xs text-neutral-200 mb-4 animate-in fade-in">
                <div className="flex items-center gap-2 text-[#ecb613] font-bold font-mono uppercase tracking-wider mb-2">
                  <Bot className="w-4 h-4" /> Respuesta del Oráculo EAR RAG
                </div>
                <p className="leading-relaxed whitespace-pre-line">{ragAnswer}</p>
              </div>
            )}

            {/* List of matching search items */}
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.url)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`p-3.5 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-4 border ${
                      isSelected
                        ? 'bg-gradient-to-r from-white/[0.08] to-white/[0.03] border-[#ecb613]/60 shadow-lg'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      {/* Item Thumbnail or Category Icon */}
                      <div className="w-11 h-11 rounded-xl bg-black border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          renderCategoryIcon(item.category)
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#ecb613]">
                            {item.categoryLabel}
                          </span>
                          {item.badge && (
                            <span className="px-1.5 py-0.2 rounded bg-white/10 text-[9px] font-mono text-neutral-300">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#ecb613] transition-colors">
                          {item.title}
                        </h4>

                        <p className="text-xs text-neutral-400 truncate max-w-lg">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {item.price && (
                        <span className="px-2.5 py-1 rounded-lg bg-black/60 border border-white/10 text-xs font-mono font-bold text-[#ecb613]">
                          {item.price}
                        </span>
                      )}
                      
                      <div className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-[#ecb613] text-black' : 'text-neutral-500'}`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              /* Zero Results Fallback with RAG option */
              <div className="text-center py-10 px-4">
                <p className="text-sm text-neutral-400 mb-4">
                  No se encontraron resultados directos para &quot;<span className="text-white font-semibold">{query}</span>&quot;.
                </p>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={handleQueryRag}
                    disabled={isSearchingRag}
                    className="px-5 py-2.5 rounded-xl bg-[#ecb613] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 disabled:opacity-50"
                  >
                    {isSearchingRag ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bot className="w-4 h-4" />}
                    Consultar con Oráculo Neural EAR
                  </button>

                  <a
                    href={`https://wa.me/34682141077?text=Hola%2C%20estoy%20buscando%20informaci%C3%B3n%20sobre%20${encodeURIComponent(query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs transition-all flex items-center gap-2 border border-white/10"
                  >
                    <PhoneCall className="w-4 h-4 text-[#ecb613]" /> Concierge 24/7 WhatsApp
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
              4. FOOTER CON ATAJOS Y CONEXIÓN RAG
             ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <div className="px-5 py-3 border-t border-white/10 bg-black/60 flex flex-wrap items-center justify-between text-[11px] text-neutral-400 font-mono gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">↑↓</kbd> Navegar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">↵</kbd> Seleccionar
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-white">ESC</kbd> Cerrar
              </span>
            </div>

            {query.trim().length > 2 && (
              <button
                onClick={handleQueryRag}
                disabled={isSearchingRag}
                className="text-[#ecb613] hover:underline flex items-center gap-1 font-semibold"
              >
                {isSearchingRag ? <Loader2 className="w-3 h-3 animate-spin" /> : <Bot className="w-3 h-3" />}
                <span>Preguntar a la IA</span>
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}