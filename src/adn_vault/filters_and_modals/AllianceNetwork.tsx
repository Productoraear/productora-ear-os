"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Handshake, 
  MapPin, 
  Star, 
  TrendingUp, 
  ShieldCheck, 
  Briefcase, 
  MessageSquare,
  ArrowUpRight,
  Filter,
  Plus
} from 'lucide-react';

// --- TIPOS ---
interface Aliado {
  id: string;
  name: string;
  type: 'Finca' | 'Planner' | 'Catering' | 'Partner';
  location: string;
  rating: number;
  leadsProvided: number;
  revenueGenerated: string;
  status: 'active' | 'pending' | 'premium';
}

// --- COMPONENTE PRINCIPAL ---
export const AllianceNetwork = () => {
  const [filter, setFilter] = useState<string>('todos');
  const [aliados] = useState<Aliado[]>([
    { id: '1', name: 'Finca La Esmeralda', type: 'Finca', location: 'Madrid', rating: 4.9, leadsProvided: 12, revenueGenerated: '€84.000', status: 'premium' },
    { id: '2', name: 'Elite Wedding Events', type: 'Planner', location: 'Barcelona', rating: 4.8, leadsProvided: 8, revenueGenerated: '€42.500', status: 'active' },
    { id: '3', name: 'Gourmet Master Catering', type: 'Catering', location: 'Marbella', rating: 5.0, leadsProvided: 15, revenueGenerated: '€112.000', status: 'premium' },
    { id: '4', name: 'Palacio de Cristal', type: 'Finca', location: 'Valencia', rating: 4.7, leadsProvided: 5, revenueGenerated: '€28.000', status: 'active' },
  ]);

  const mapFiltro = (f: string) => {
    if (f === 'todos') return 'all';
    return f;
  };

  const filtrados = filter === 'todos' ? aliados : aliados.filter(a => a.type.toLowerCase() === filter);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-pane p-8 relative overflow-hidden"
    >
      {/* DECORACIÓN RESPLANDOR */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="flex flex-col gap-8">
        {/* CABECERA & CONTROLES */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/20 rounded-lg border border-blue-500/30 shadow-lg shadow-blue-500/10">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">RED DE ALIANZAS</h2>
                <p className="text-[10px] text-white/40 tracking-[0.3em] uppercase font-bold">Nivel 8: Alianzas Tácticas</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 flex-1 md:flex-none">
              {['todos', 'finca', 'planner', 'catering'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-4 py-2 rounded-lg text-[10px] uppercase font-black tracking-widest transition-all ${
                    filter === t ? 'bg-white/10 text-white shadow-lg' : 'text-white/40 hover:text-white/60'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <Plus className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>

        {/* FILA DE MÉTRICAS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-pane p-4 bg-white/[0.02]">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Socios Totales</span>
            <p className="text-2xl font-black text-white mt-1 tracking-tighter">142</p>
          </div>
          <div className="glass-pane p-4 bg-white/[0.02]">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Ingresos Referidos</span>
            <p className="text-2xl font-black text-blue-400 mt-1 tracking-tighter">€412k</p>
          </div>
          <div className="glass-pane p-4 bg-white/[0.02]">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Tasa de Conversión</span>
            <p className="text-2xl font-black text-[#4ade80] mt-1 tracking-tighter">32%</p>
          </div>
          <div className="glass-pane p-4 bg-white/[0.02]">
            <span className="text-[9px] uppercase tracking-widest text-white/30 font-black">Misiones Activas</span>
            <p className="text-2xl font-black text-[#d4a855] mt-1 tracking-tighter">18</p>
          </div>
        </div>

        {/* REJILLA DE ALIADOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AnimatePresence mode='popLayout'>
            {filtrados.map((ally, idx) => (
              <motion.div
                key={ally.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-pane p-5 border-white/5 hover:border-blue-500/30 transition-all group cursor-pointer relative"
              >
                {ally.status === 'premium' && (
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] text-blue-400 uppercase tracking-tighter font-black">
                    <Star className="w-2 h-2 fill-current" />
                    Socio Premium
                  </div>
                )}

                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {ally.type === 'Finca' ? <MapPin className="w-8 h-8 text-white/20" /> : 
                     ally.type === 'Planner' ? <Briefcase className="w-8 h-8 text-white/20" /> : 
                     <Star className="w-8 h-8 text-white/20" />}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-black uppercase text-white group-hover:text-blue-400 transition-colors tracking-tight">{ally.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-white/20" />
                        <span className="text-[10px] text-white/40 uppercase font-bold">{ally.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Handshake className="w-3 h-3 text-blue-400/40" />
                        <span className="text-[10px] text-white/40 uppercase font-bold">{ally.leadsProvided} Soberanos</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3 text-[#4ade80]/40" />
                        <span className="text-[10px] text-[#4ade80] font-mono font-black">{ally.revenueGenerated}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-blue-500 hover:text-white transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-6 h-6 rounded-full bg-white/10 border border-black/40" />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-black/40 flex items-center justify-center text-[8px] text-blue-400 font-black">
                      +{ally.leadsProvided}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white transition-colors font-black">Detalles</button>
                    <button className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[9px] uppercase tracking-widest text-white/60 hover:bg-white/10 font-black">Enviar Misión</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* BANNER DE RECLUTAMIENTO */}
        <div className="glass-pane bg-blue-600/10 border-blue-500/20 p-6 flex flex-col md:flex-row justify-between items-center gap-6 border-dashed">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h4 className="text-white font-black uppercase tracking-wide">Protocolo de Reclutamiento Activo</h4>
              <p className="text-xs text-white/40 mt-1 uppercase tracking-widest font-bold">Astra IA está analizando 24 nuevos candidatos en la zona de Levante.</p>
            </div>
          </div>
          <button className="px-6 py-3 bg-blue-500 text-white rounded-xl font-black text-[10px] tracking-widest uppercase hover:bg-blue-400 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] border-none">
            ABRIR CONVOCATORIA
          </button>
        </div>
      </div>
    </motion.div>
  );
};
