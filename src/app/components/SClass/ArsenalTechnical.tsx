"use client";

import React, { useState, useEffect, useTransition } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Smartphone, 
  Cpu, 
  Radio, 
  SlidersHorizontal,
  ChevronRight,
  TrendingUp,
  Tag,
  Boxes
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  fetchFincasAction, 
  fetchProvidersAction, 
  fetchArsenalEnrichedAction, 
  fetchArsenalCompletoAction 
} from '@/app/actions/backupActions';

interface Finca {
  id: string;
  name: string;
  category: string;
  provincia: string;
  capacidad_min: number;
  capacidad_max: number;
  precio_desde: number | null;
  verificado: boolean;
  nivel_perfil: string;
  rating: number;
  reviews: number;
  image: string;
  tags?: string[];
  description?: string;
  phone?: string;
  email?: string;
}

interface Provider {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  gps?: { lat: number; lng: number };
  rating?: string;
  imagenes?: string[];
}

interface ArsenalEnriched {
  id: string;
  name: string;
  image: string;
  phone: string;
  hash: number;
}

interface ArsenalCompleto {
  id: string;
  name: string;
  category?: string;
  description?: string;
  specifications?: Record<string, any>;
  image?: string;
}

type TabType = 'fincas' | 'providers' | 'enriched' | 'completo';

export default function ArsenalTechnical() {
  const [activeTab, setActiveTab] = useState<TabType>('fincas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProvincia, setSelectedProvincia] = useState('');
  const [isPending, startTransition] = useTransition();

  // Data States
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [enriched, setEnriched] = useState<ArsenalEnriched[]>([]);
  const [completo, setCompleto] = useState<ArsenalCompleto[]>([]);

  // Pagination
  const [visibleCount, setVisibleCount] = useState(12);

  // Load Initial Datasets
  useEffect(() => {
    startTransition(async () => {
      const [f, p, e, c] = await Promise.all([
        fetchFincasAction(),
        fetchProvidersAction(),
        fetchArsenalEnrichedAction(),
        fetchArsenalCompletoAction()
      ]);
      setFincas(f as Finca[]);
      setProviders(p as Provider[]);
      setEnriched(e as ArsenalEnriched[]);
      setCompleto(c as ArsenalCompleto[]);
    });
  }, []);

  // Handle Search & Filter locally or trigger Server Actions on query change
  useEffect(() => {
    setVisibleCount(12);
  }, [searchQuery, selectedProvincia, activeTab]);

  const cleanQuery = searchQuery.toLowerCase().trim();

  // Filtered Lists
  const filteredFincas = fincas.filter(f => {
    const matchesQuery = !cleanQuery || 
      f.name.toLowerCase().includes(cleanQuery) || 
      (f.description && f.description.toLowerCase().includes(cleanQuery)) ||
      (f.tags && f.tags.some(t => t.toLowerCase().includes(cleanQuery)));
    const matchesProvincia = !selectedProvincia || f.provincia.toLowerCase() === selectedProvincia.toLowerCase();
    return matchesQuery && matchesProvincia;
  });

  const filteredProviders = providers.filter(p => {
    const matchesQuery = !cleanQuery || 
      p.nombre.toLowerCase().includes(cleanQuery) || 
      p.categoria.toLowerCase().includes(cleanQuery) ||
      p.ubicacion.toLowerCase().includes(cleanQuery);
    return matchesQuery;
  });

  const filteredEnriched = enriched.filter(e => {
    const matchesQuery = !cleanQuery || e.name.toLowerCase().includes(cleanQuery);
    return matchesQuery;
  });

  const filteredCompleto = completo.filter(c => {
    const matchesQuery = !cleanQuery || 
      c.name.toLowerCase().includes(cleanQuery) ||
      (c.category && c.category.toLowerCase().includes(cleanQuery));
    return matchesQuery;
  });

  // Extract unique provinces for filter dropdown
  const provincias = Array.from(new Set(fincas.map(f => f.provincia).filter(Boolean)));

  const showMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden selection:bg-[#ecb613]/30">
      {/* Visual background layers */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#ecb613]/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ecb613]/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        
        {/* HEADER DYNAMIC */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/5 pb-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 bg-[#ecb613] rounded-full animate-ping" />
              <p className="text-[#ecb613] text-[9px] uppercase tracking-[0.5em] font-black">Infraestructura Crítica de Datos</p>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none text-white">
              ARSENAL <span className="text-[#ecb613] text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-[#ffd471]">TÉCNICO</span>
            </h1>
            <p className="text-white/40 text-xs font-bold uppercase tracking-wider max-w-xl">
              Acceso unificado al catálogo normalizado del ecosistema local, fincas de eventos, proveedores y material técnico de Edwin Agudelo.
            </p>
          </div>
          
          <div className="flex gap-4">
            <div className="bg-white/[0.01] border border-white/5 rounded-2xl px-6 py-3 text-right">
              <p className="text-[8px] text-white/40 uppercase font-black tracking-widest">Activos Totales</p>
              <p className="text-xl font-black text-[#ecb613] flex items-center justify-end gap-2 mt-1">
                <Boxes size={16} /> {fincas.length + providers.length + completo.length}
              </p>
            </div>
          </div>
        </header>

        {/* TABS SELECTOR */}
        <div className="flex flex-wrap gap-3 border-b border-white/5 pb-6">
          {[
            { id: 'fincas', label: 'Fincas para Eventos', count: filteredFincas.length },
            { id: 'providers', label: 'Proveedores Legacy', count: filteredProviders.length },
            { id: 'enriched', label: 'Arsenal Enriquecido', count: filteredEnriched.length },
            { id: 'completo', label: 'Arsenal Técnico', count: filteredCompleto.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 border flex items-center gap-3 ${activeTab === tab.id ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-[0_0_25px_rgba(236,182,19,0.25)]' : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white hover:bg-white/5'}`}
            >
              {tab.label}
              <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-black text-[#ecb613]' : 'bg-white/10 text-white/40'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* SEARCH AND FILTER BAR */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-white/[0.01] border border-white/5 rounded-[2rem] p-6">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input
              type="text"
              placeholder="Buscar por nombre, etiquetas, categoría o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl pl-12 pr-6 py-4 text-sm font-bold text-white focus:border-[#ecb613]/40 outline-none transition-all"
            />
          </div>

          {activeTab === 'fincas' && (
            <div className="w-full md:w-64">
              <select
                value={selectedProvincia}
                onChange={(e) => setSelectedProvincia(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-sm font-black uppercase tracking-widest text-white/70 focus:border-[#ecb613]/40 outline-none transition-all cursor-pointer"
              >
                <option value="">Provincia: Todas</option>
                {provincias.map((prov) => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* MAIN GRID */}
        {isPending ? (
          <div className="py-24 text-center">
            <div className="w-12 h-12 border-4 border-[#ecb613]/10 border-t-[#ecb613] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Sincronizando Base de Datos...</p>
          </div>
        ) : (
          <div className="space-y-12">
            <AnimatePresence mode="wait">
              {activeTab === 'fincas' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  key="fincas-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredFincas.slice(0, visibleCount).map((f) => (
                    <div key={f.id} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 hover:border-[#ecb613]/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        {/* Image banner */}
                        {f.image && (
                          <div className="h-44 w-full rounded-[1.8rem] overflow-hidden mb-6 relative">
                            <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {f.nivel_perfil === 'PREMIUM' && (
                              <span className="absolute top-4 left-4 bg-gradient-to-r from-[#ecb613] to-[#ffd471] text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                                PREMIUM
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-3 gap-2">
                          <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors leading-tight line-clamp-2">
                            {f.name}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <span className="flex items-center text-[10px] font-bold text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                            <MapPin size={10} className="mr-1 text-[#ecb613]" /> {f.provincia}
                          </span>
                          {f.rating && (
                            <span className="flex items-center text-[10px] font-bold text-[#ecb613]">
                              <Star size={10} className="fill-[#ecb613] mr-1" /> {f.rating} ({f.reviews})
                            </span>
                          )}
                        </div>

                        {f.description && (
                          <p className="text-xs text-white/40 leading-relaxed font-bold mb-6 line-clamp-3">
                            {f.description}
                          </p>
                        )}

                        {f.tags && f.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-6">
                            {f.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-[8px] font-black uppercase tracking-widest text-[#ecb613]/70 bg-[#ecb613]/5 border border-[#ecb613]/10 px-2 py-0.5 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-auto">
                        <div>
                          <p className="text-[8px] uppercase tracking-wider text-white/20">Capacidad</p>
                          <p className="text-[10px] font-black text-white/80">
                            {f.capacidad_min > 0 ? `${f.capacidad_min} - ${f.capacidad_max} Pax` : 'Bespoke Scale'}
                          </p>
                        </div>
                        <button className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Verificar <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'providers' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  key="providers-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredProviders.slice(0, visibleCount).map((p) => (
                    <div key={p.id} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 hover:border-[#ecb613]/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        {p.imagenes && p.imagenes.length > 0 && (
                          <div className="h-44 w-full rounded-[1.8rem] overflow-hidden mb-6 relative">
                            <img src={p.imagenes[0]} alt={p.nombre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          <span className="text-[8px] font-black tracking-widest text-[#ecb613] uppercase bg-[#ecb613]/5 border border-[#ecb613]/10 px-2.5 py-1 rounded-full w-fit block">
                            {p.categoria}
                          </span>
                          <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors leading-tight line-clamp-2">
                            {p.nombre}
                          </h3>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <span className="flex items-center text-[10px] font-bold text-white/50 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
                            <MapPin size={10} className="mr-1 text-[#ecb613]" /> {p.ubicacion}
                          </span>
                          {p.rating && (
                            <span className="flex items-center text-[10px] font-bold text-[#ecb613]">
                              <Star size={10} className="fill-[#ecb613] mr-1" /> {p.rating}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-auto">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Legacy Record</span>
                        <button className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Ver Ficha <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'enriched' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  key="enriched-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                  {filteredEnriched.slice(0, visibleCount).map((e) => (
                    <div key={e.id} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 hover:border-[#ecb613]/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        {e.image && (
                          <div className="h-40 w-full rounded-[1.8rem] overflow-hidden mb-6 relative">
                            <img src={e.image} alt={e.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}
                        
                        <h3 className="text-sm font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors leading-tight line-clamp-2 mb-4">
                          {e.name}
                        </h3>

                        <div className="space-y-2 font-mono text-[9px] text-white/40">
                          <p className="flex items-center gap-2">
                            <Smartphone size={10} className="text-[#ecb613]" /> {e.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Cpu size={10} /> HASH: <span className="text-[#ecb613]">{e.hash}</span>
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-6">
                        <span className="text-[8px] font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-1">
                          <CheckCircle2 size={10} /> VERIFICADO
                        </span>
                        <button className="text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors">
                          Reservar
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === 'completo' && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  key="completo-grid"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredCompleto.slice(0, visibleCount).map((c) => (
                    <div key={c.id} className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] p-6 hover:border-[#ecb613]/30 hover:bg-white/[0.02] transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#ecb613]/5 blur-3xl rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div>
                        {c.image && (
                          <div className="h-44 w-full rounded-[1.8rem] overflow-hidden mb-6 relative">
                            <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </div>
                        )}
                        
                        <div className="space-y-2 mb-4">
                          {c.category && (
                            <span className="text-[8px] font-black tracking-widest text-[#ecb613] uppercase bg-[#ecb613]/5 border border-[#ecb613]/10 px-2.5 py-1 rounded-full w-fit block">
                              {c.category}
                            </span>
                          )}
                          <h3 className="text-base font-black uppercase tracking-tight text-white group-hover:text-[#ecb613] transition-colors leading-tight line-clamp-2">
                            {c.name}
                          </h3>
                        </div>

                        {c.description && (
                          <p className="text-xs text-white/40 leading-relaxed font-bold mb-6 line-clamp-3">
                            {c.description}
                          </p>
                        )}

                        {c.specifications && Object.keys(c.specifications).length > 0 && (
                          <div className="space-y-2 mb-6 font-mono text-[9px] text-white/40 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                            {Object.entries(c.specifications).slice(0, 3).map(([key, val]) => (
                              <div key={key} className="flex justify-between">
                                <span className="uppercase text-white/20">{key.replace(/_/g, ' ')}:</span>
                                <span className="font-bold text-white/80">{String(val)}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-white/5 pt-6 flex justify-between items-center mt-auto">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/20 italic">Technical Catalog</span>
                        <button className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
                          Detalles <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* SHOW MORE BUTTON */}
            {((activeTab === 'fincas' && filteredFincas.length > visibleCount) ||
              (activeTab === 'providers' && filteredProviders.length > visibleCount) ||
              (activeTab === 'enriched' && filteredEnriched.length > visibleCount) ||
              (activeTab === 'completo' && filteredCompleto.length > visibleCount)) && (
              <div className="text-center pt-8">
                <button
                  onClick={showMore}
                  className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#ecb613] hover:text-black hover:border-[#ecb613] transition-all duration-300 shadow-xl"
                >
                  Cargar Más Activos
                </button>
              </div>
            )}
            
            {/* ZERO STATE */}
            {((activeTab === 'fincas' && filteredFincas.length === 0) ||
              (activeTab === 'providers' && filteredProviders.length === 0) ||
              (activeTab === 'enriched' && filteredEnriched.length === 0) ||
              (activeTab === 'completo' && filteredCompleto.length === 0)) && (
              <div className="py-24 text-center border border-white/5 rounded-[3rem] bg-white/[0.01]">
                <Boxes className="mx-auto mb-4 text-white/10" size={48} />
                <p className="text-sm font-black uppercase tracking-widest text-white/30">Ningún activo coincide con la búsqueda</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedProvincia(''); }} 
                  className="mt-6 text-xs font-black uppercase tracking-widest text-[#ecb613] hover:underline"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
