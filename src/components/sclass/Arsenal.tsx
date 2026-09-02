"use client";

import React, { useState, useTransition, useEffect } from "react";
import { 
  fetchFincasAction, 
  fetchProvidersAction, 
  fetchArsenalEnrichedAction 
} from "@/app/actions/backupActions";
import { 
  Search, 
  Building2, 
  Phone, 
  CheckCircle, 
  MapPin, 
  Star, 
  ChevronRight,
  Boxes,
  Compass,
  ArrowUpDown
} from "lucide-react";
import { motion } from "framer-motion";

interface Finca {
  id: string;
  name: string;
  category: string;
  uicategory: string;
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

interface LegacyProvider {
  id: string;
  nombre: string;
  categoria: string;
  ubicacion: string;
  rating?: string;
  imagenes?: string[];
}

export default function Arsenal() {
  const [fincas, setFincas] = useState<Finca[]>([]);
  const [providers, setProviders] = useState<LegacyProvider[]>([]);
  const [activeSource, setActiveSource] = useState<'fincas' | 'providers'>('fincas');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvincia, setSelectedProvincia] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSearch = () => {
    startTransition(async () => {
      if (activeSource === 'fincas') {
        const results = await fetchFincasAction(searchQuery, selectedProvincia);
        setFincas(results as Finca[]);
      } else {
        const results = await fetchProvidersAction(searchQuery, selectedProvincia);
        setProviders(results as LegacyProvider[]);
      }
    });
  };

  useEffect(() => {
    handleSearch();
  }, [activeSource, selectedProvincia]);

  const uniqueProvincias = [
    "Madrid", "Barcelona", "Toledo", "Segovia", "Ávila", 
    "Guadalajara", "Sevilla", "Valencia", "Málaga"
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#d4a855]/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      <header className="max-w-7xl mx-auto mb-12 relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/20 text-[#d4a855] text-[9px] font-black uppercase tracking-[0.3em]">
          <Boxes size={12} className="animate-pulse" /> Infraestructura EAR OS v5.0
        </div>
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none italic text-white">
          ARSENAL <span className="text-[#d4a855]">TÉCNICO</span>
        </h1>
        <p className="text-white/40 text-xs md:text-sm max-w-2xl leading-relaxed font-bold uppercase tracking-wider">
          Gobernanza de recursos, fincas de eventos, proveedores y material técnico de Edwin Agudelo. Catálogo unificado y normalizado.
        </p>
      </header>

      <section className="max-w-7xl mx-auto mb-12 bg-white/[0.01] border border-white/5 p-8 rounded-[3.5rem] relative z-10 backdrop-blur-3xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex gap-2 bg-black/40 border border-white/10 rounded-xl p-1">
            <button 
              onClick={() => setActiveSource('fincas')}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors ${activeSource === 'fincas' ? 'bg-[#d4a855] text-black' : 'hover:bg-white/5 text-white/60'}`}
            >
              Fincas Verificadas
            </button>
            <button 
              onClick={() => setActiveSource('providers')}
              className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-lg transition-colors ${activeSource === 'providers' ? 'bg-[#d4a855] text-black' : 'hover:bg-white/5 text-white/60'}`}
            >
              Proveedores Legacy
            </button>
          </div>

          <div className="relative flex items-center">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              type="text" 
              className="w-full bg-black/40 border border-white/10 p-4 pl-12 text-white rounded-xl focus:border-[#d4a855]/50 outline-none transition-all font-bold text-xs" 
              placeholder="Buscar por nombre, tags, ubicación..." 
            />
            <Search className="absolute left-4 text-white/30" size={16} />
          </div>

          <div className="flex gap-2">
            <select 
              value={selectedProvincia}
              onChange={(e) => setSelectedProvincia(e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 p-4 text-white rounded-xl focus:border-[#d4a855]/50 outline-none transition-all font-bold text-xs"
            >
              <option value="">Provincia (Todas)</option>
              {uniqueProvincias.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <button 
              onClick={handleSearch}
              className="px-6 bg-[#d4a855] text-black font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-colors text-[10px]"
            >
              {isPending ? 'Filtrando...' : 'Aplicar'}
            </button>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeSource === 'fincas' ? (
            fincas.map((f) => (
              <motion.div 
                key={f.id}
                whileHover={{ y: -6 }}
                className="group bg-white/[0.01] border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between h-full hover:bg-white/[0.02] hover:border-[#d4a855]/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#d4a855] group-hover:bg-[#d4a855]/10 group-hover:border-[#d4a855]/30 transition-colors">
                      <Building2 size={20} />
                    </div>
                    <span className="flex items-center gap-1.5 text-[8px] font-black text-[#d4a855] border border-[#d4a855]/30 px-2.5 py-0.5 rounded uppercase">
                      <CheckCircle size={10} /> {f.nivel_perfil}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#d4a855] transition-colors">{f.name}</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#d4a855]" /> {f.provincia}
                    </p>
                  </div>

                  <p className="text-white/40 text-xs leading-relaxed font-bold">
                    {f.description || `Ubicación Premium y características exclusivas preparadas para el soporte de eventos EAR.`}
                  </p>
                </div>

                <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="text-[#d4a855]" size={14} />
                    <span className="text-xs font-black text-white">{f.rating}</span>
                    <span className="text-[9px] text-white/20">({f.reviews})</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-white/30 uppercase font-black block tracking-widest">Capacidad</span>
                    <span className="text-xs font-black text-white">{f.capacidad_min}-{f.capacidad_max} PAX</span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            providers.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -6 }}
                className="group bg-white/[0.01] border border-white/5 rounded-[3rem] p-8 flex flex-col justify-between h-full hover:bg-white/[0.02] hover:border-[#d4a855]/30 transition-all duration-300 relative overflow-hidden"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-[#d4a855] group-hover:bg-[#d4a855]/10 group-hover:border-[#d4a855]/30 transition-colors">
                      <Compass size={20} />
                    </div>
                    <span className="text-[8px] font-black text-white/40 border border-white/10 px-2.5 py-0.5 rounded uppercase">
                      {p.categoria}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-black uppercase tracking-tight text-white group-hover:text-[#d4a855] transition-colors">{p.nombre}</h3>
                    <p className="text-[10px] text-white/30 uppercase font-black tracking-widest flex items-center gap-1.5">
                      <MapPin size={12} className="text-[#d4a855]" /> {p.ubicacion}
                    </p>
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mt-8 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="text-[#d4a855]" size={14} />
                    <span className="text-xs font-black text-white">{p.rating || "5.0"}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#d4a855] text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Ficha Técnica <ChevronRight size={12} />
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
