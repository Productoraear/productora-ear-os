'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutGrid, Users, Star, Music, Briefcase, 
  Heart, Mic2, Disc, Activity, Stethoscope, 
  ChevronRight, Sparkles 
} from 'lucide-react';

import { useSharedContext } from '@/app/context/SharedContext';

/**
 * 🏛️ EAR OS GOLD - DISCOVERY ENGINE (BODAS.NET KILLER)
 * Navegación de Categorías de Alta Densidad para V1, V2 y V3.
 * Implementa la lógica de Descubrimiento Multiversal.
 */

interface Category {
  id: string;
  name: string;
  path: string;
  icon: React.ReactNode;
  description: string;
}

const EVENT_CATEGORIES: Category[] = [
  { id: 'corp', name: 'Corporativos', path: '/eventos/corporativos', icon: <Briefcase size={20} />, description: 'Sistemas de impacto para marcas líderes.' },
  { id: 'luxury', name: 'Bodas de Lujo', path: '/eventos/bodas', icon: <Heart size={20} />, description: 'Arquitectura emocional de excelencia.' },
  { id: 'galas', name: 'Galas', path: '/eventos/galas', icon: <Star size={20} />, description: 'Eventos de etiqueta con rigor militar.' },
  { id: 'fest', name: 'Festivales', path: '/eventos/festivales', icon: <Music size={20} />, description: 'Infraestructura masiva sin fallos.' },
];

const ARTIST_CATEGORIES: Category[] = [
  { id: 'orch', name: 'Orquestas S-Class', path: '/artistas/orquestas', icon: <Users size={20} />, description: 'El legado de la Academia Diamante Rojo.' },
  { id: 'solo', name: 'Solistas', path: '/artistas/solistas', icon: <Mic2 size={20} />, description: 'Talento puro con arquitectura de carrera.' },
  { id: 'impact', name: 'Shows de Impacto', path: '/artistas/shows', icon: <LayoutGrid size={20} />, description: 'Performance visual y sonora disruptiva.' },
  { id: 'djs', name: 'Djs & Electronic', path: '/artistas/djs', icon: <Disc size={20} />, description: 'Ingeniería rítmica para eventos exclusivos.' },
];

const VIMUME_CATEGORIES: Category[] = [
  { id: 'neuro', name: 'Neuro-Conexión', path: '/vimume/neuro', icon: <Activity size={20} />, description: 'Reactivación de memoria mediante tecnología S-Class.' },
  { id: 'clinic', name: 'Soberanía B2G', path: '/vimume/clinica', icon: <Stethoscope size={20} />, description: 'Arquitectura clínica para la Comisión Europea.' },
];

interface CategoryRouterProps {
  type: 'V1' | 'V2' | 'V3' | 'ALL';
}

const CategoryRouter: React.FC<CategoryRouterProps> = ({ type }) => {
  const { setIsPricerOpen, setPricerData } = useSharedContext();

  const handlePricerAction = (e: React.MouseEvent, cat: Category) => {
    e.preventDefault();
    e.stopPropagation();
    
    let basePrice = 1200;
    if (type === 'V2') basePrice = 800;
    if (type === 'V3') basePrice = 2500;
    
    setPricerData({
      category: cat.name,
      basePrice
    });
    setIsPricerOpen(true);
  };

  const getCategories = () => {
    switch (type) {
      case 'V1': return EVENT_CATEGORIES;
      case 'V2': return ARTIST_CATEGORIES;
      case 'V3': return VIMUME_CATEGORIES;
      default: return [...EVENT_CATEGORIES, ...ARTIST_CATEGORIES, ...VIMUME_CATEGORIES];
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'V1': return 'Arquitectura de Eventos';
      case 'V2': return 'Ingeniería de Talento';
      case 'V3': return 'VIMUME Clinical';
      default: return 'Discovery Multiversal';
    }
  };

  const categories = getCategories();
  const title = getTitle();

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header Forense */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[#ecb613] animate-pulse" />
            <span className="text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase">Ecosistema Soberano</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
            {title} <span className="text-white/10 block md:inline">S-Class</span>
          </h2>
        </div>
        <div className="max-w-xs">
          <p className="text-white/40 text-xs md:text-sm font-medium leading-relaxed italic border-l border-[#ecb613]/20 pl-4">
            "La inteligencia del Nexo EAR OS deriva el tráfico hacia la categoría de mayor impacto operativo."
          </p>
        </div>
      </div>

      {/* Grid de Alta Densidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.path} className="group perspective-1000">
            <div className="h-full bg-gradient-to-br from-[#0d0d0d] to-[#050505] border border-white/5 p-8 rounded-[2rem] group-hover:border-[#ecb613]/30 transition-all duration-500 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              
              {/* Efecto de Profundidad */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#ecb613]/5 blur-[60px] rounded-full group-hover:bg-[#ecb613]/10 transition-all duration-700" />
              
              <div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 group-hover:bg-[#ecb613] group-hover:text-black group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-transparent group-hover:shadow-[0_0_30px_rgba(236,182,19,0.3)]">
                    {cat.icon}
                  </div>
                  <button 
                    onClick={(e) => handlePricerAction(e, cat)}
                    className="p-2 rounded-lg bg-white/5 text-white/20 hover:bg-[#ecb613]/20 hover:text-[#ecb613] transition-all text-[8px] font-black uppercase tracking-widest border border-white/5"
                  >
                    Cotizar
                  </button>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-3 uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">{cat.name}</h3>
                <p className="text-white/30 text-xs md:text-sm leading-relaxed group-hover:text-white/70 transition-colors font-medium">
                  {cat.description}
                </p>
              </div>
              
              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ecb613] opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0 duration-500">
                  Explorar Sector
                </span>
                <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#ecb613]/20 group-hover:text-[#ecb613] transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Navegación Circular (Cross-Sell Multiversal) */}
      {type !== 'ALL' && (
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-wrap gap-4 items-center justify-center">
          <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mr-4">Transicionar a:</span>
          {['V1', 'V2', 'V3'].filter(t => t !== type).map(t => (
            <button 
              key={t}
              onClick={() => window.location.href = `/${t === 'V1' ? 'eventos' : t === 'V2' ? 'artistas' : 'vimume'}`}
              className="px-6 py-3 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60 hover:bg-[#ecb613] hover:text-black hover:border-transparent transition-all active:scale-95"
            >
              {t === 'V1' ? 'Eventos' : t === 'V2' ? 'Artistas' : 'Vimume'}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default CategoryRouter;
