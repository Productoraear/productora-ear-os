"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Tv, 
  Volume2, 
  Lightbulb, 
  Video, 
  Layers, 
  Plus, 
  Check, 
  Trash2, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Box, 
  Send,
  HelpCircle,
  Search,
  Camera,
  Gamepad2,
  Sliders,
  CheckCircle2,
  Clock,
  Truck,
  Wrench,
  Info
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import MADRID_CATALOG from '@/data/madridalquiler_catalog.json';

export interface ArsenalItem {
  id: string;
  name: string;
  category: 'Pantallas LED' | 'Monitores & TV' | 'Sonido Profesional' | 'Iluminación' | 'Fotomatón & Photocall' | 'Entretenimiento & Gaming' | 'Vídeo & IT' | 'Escenarios';
  description: string;
  priceDisplay: string;
  priceNumeric: number;
  unitType: 'm²' | 'unidad' | 'metro' | 'evento';
  canonicalUrl: string;
  image: string;
  specs: string[];
  availability?: string;
  provider?: string;
}

export const ARSENAL_CATALOG: ArsenalItem[] = MADRID_CATALOG as ArsenalItem[];

export const ArsenalTecnicoView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [planoTecnico, setPlanoTecnico] = useState<{ item: ArsenalItem; quantity: number }[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeItemModal, setActiveItemModal] = useState<ArsenalItem | null>(null);

  const categories = [
    'Todos',
    'Pantallas LED',
    'Monitores & TV',
    'Sonido Profesional',
    'Iluminación',
    'Fotomatón & Photocall',
    'Entretenimiento & Gaming',
    'Vídeo & IT',
    'Escenarios'
  ];

  const filteredItems = useMemo(() => {
    return ARSENAL_CATALOG.filter(item => {
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) || 
        item.specs.some(s => s.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleAddToPlano = (item: ArsenalItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlanoTecnico(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { item, quantity: 1 }];
    });
    setIsDrawerOpen(true);
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setPlanoTecnico(prev => {
      return prev
        .map(p => {
          if (p.item.id === id) {
            const newQ = p.quantity + delta;
            return newQ > 0 ? { ...p, quantity: newQ } : null;
          }
          return p;
        })
        .filter(Boolean) as { item: ArsenalItem; quantity: number }[];
    });
  };

  const handleRemoveFromPlano = (id: string) => {
    setPlanoTecnico(prev => prev.filter(p => p.item.id !== id));
  };

  const totalEstimatedBudget = planoTecnico.reduce((acc, curr) => {
    return acc + (curr.item.priceNumeric * curr.quantity);
  }, 0);

  const generateWhatsAppMessage = () => {
    const itemsList = planoTecnico
      .map((p, idx) => `${idx + 1}. *${p.quantity}x ${p.item.name}* — ${p.item.priceDisplay} (${p.item.priceNumeric * p.quantity} €)`)
      .join('\n');

    const messageLines = [
      `⚡ *PLANO TÉCNICO & ARSENAL RESERVADO — EAR OS*`,
      `─────────────────────────────`,
      `📍 *Destino / Evento:* Cobertura Central Madrid & Nacional`,
      `💰 *Inversión Base Estimada:* ${totalEstimatedBudget} €`,
      ``,
      `📋 *EQUIPAMIENTO & ACTIVOS SELECCIONADOS:*`,
      itemsList,
      ``,
      `🛡️ *CONDICIONES & GARANTÍAS S-CLASS:*`,
      `• Montaje Certificado y Cableado Oculto`,
      `• Asistencia Técnica In Situ / Sustitución en <60 min`,
      `• Póliza de Responsabilidad Civil de 1.000.000 €`,
      `─────────────────────────────`,
      `💬 *Mensaje:* "Hola Edwin, solicito confirmación de disponibilidad inmediata de stock y bloqueo formal de fecha para este despliegue."`
    ];

    return `https://wa.me/34693693048?text=${encodeURIComponent(messageLines.join('\n'))}`;
  };

  return (
    <div className="w-full bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans pb-28">
      
      {/* 1. HERO SECTION: EL ARSENAL TÉCNICO */}
      <section className="relative pt-12 pb-10 px-4 md:px-8 max-w-7xl mx-auto space-y-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
          <Box size={14} className="animate-spin" />
          <span>Infraestructura Audiovisual Integral & Hub Madrid</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white font-syne leading-none">
          El Arsenal <span className="text-[#ecb613]">Técnico</span>
        </h1>

        <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
          Catálogo integral de <strong>Pantallas LED, Sonido Profesional, Monitores 4K, Iluminación, Fotomatón 360º, Simuladores y Gaming</strong>. Stock central inmediato en Madrid con montaje, asistencia y cobertura para eventos corporativos, congresos, ferias, bodas y fiestas privadas.
        </p>

        {/* 2. SEARCH & CONTROLS */}
        <div className="max-w-2xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-[#AAD6CD]/60" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar altavoces, pantallas 85, simuladores F1, fotomatón 360, proyectores..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#081226] border border-[#AAD6CD]/20 text-white placeholder-white/40 text-sm focus:outline-none focus:border-[#258DCD] focus:ring-1 focus:ring-[#258DCD] transition-all font-mono shadow-[0_4px_20px_rgba(8,18,38,0.6)]"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 text-xs text-[#AAD6CD]/70 hover:text-white"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* 3. CATEGORY PILLS BAR & PLANO TÉCNICO TRIGGER */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#258DCD] text-white shadow-[0_0_20px_rgba(37,141,205,0.4)] border border-[#258DCD]'
                    : 'bg-[#081226] text-white/70 hover:text-[#AAD6CD] hover:bg-[#0c1a36] border border-[#AAD6CD]/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trigger Botón Plano Técnico */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#081226] border border-[#AAD6CD]/30 hover:border-[#258DCD] hover:shadow-[0_0_20px_rgba(37,141,205,0.25)] text-white transition-all cursor-pointer shrink-0"
          >
            <div className="p-1.5 rounded-lg bg-[#258DCD]/15 text-[#258DCD]">
              <Layers size={16} />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block">Plano Técnico</span>
              <span className="text-xs font-black text-[#AAD6CD]">
                {planoTecnico.length} {planoTecnico.length === 1 ? 'Módulo' : 'Módulos'} ({totalEstimatedBudget}€)
              </span>
            </div>
          </button>

        </div>

      </section>

      {/* 4. CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <Box size={48} className="text-[#AAD6CD]/20 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase font-syne">No se encontraron equipos</h3>
            <p className="text-sm text-white/40 max-w-md mx-auto">
              No hay coincidencias para &quot;{searchQuery}&quot;. Prueba con otro término o consulta disponibilidad personalizada con nuestra centralita técnica.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const inPlano = planoTecnico.find(p => p.item.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveItemModal(item)}
                  className="rounded-3xl bg-[#081226] border border-[#AAD6CD]/20 hover:border-[#AAD6CD]/60 hover:shadow-[0_10px_40px_-10px_rgba(8,18,38,0.9),0_0_25px_-5px_rgba(37,141,205,0.3)] transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer"
                >
                  <div>
                    {/* Image Preview */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#081226] via-transparent to-black/20" />
                      
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#081226]/90 backdrop-blur-md text-[#AAD6CD] text-[9px] font-black uppercase tracking-wider font-mono border border-[#AAD6CD]/30 shadow-sm">
                        {item.category}
                      </span>

                      <span className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#081226]/90 border border-[#AAD6CD]/40 text-[#AAD6CD] text-[9px] font-mono font-semibold backdrop-blur-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#AAD6CD] animate-pulse" />
                        Stock Madrid
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="text-sm font-black uppercase tracking-tight text-white font-syne group-hover:text-[#AAD6CD] transition-colors leading-snug">
                        {item.name}
                      </h3>
                      
                      <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      <div className="pt-2 border-t border-[#AAD6CD]/10 flex items-baseline justify-between">
                        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Inversión Base</span>
                        <span className="text-base font-black text-[#AAD6CD] font-mono">{item.priceDisplay}</span>
                      </div>

                      {/* Specs Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {item.specs.slice(0, 2).map((spec, i) => (
                          <span key={i} className="text-[9px] font-mono text-[#AAD6CD]/80 bg-[#040914] px-2 py-0.5 rounded border border-[#AAD6CD]/15">
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-5 pt-0 flex gap-2">
                    <button
                      onClick={(e) => handleAddToPlano(item, e)}
                      className={`flex-1 py-3 px-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        inPlano
                          ? 'bg-[#AAD6CD]/15 border border-[#AAD6CD]/50 text-[#AAD6CD] shadow-[0_0_15px_rgba(170,214,205,0.2)]'
                          : 'bg-[#258DCD] hover:bg-[#1e7ebd] text-white shadow-[0_0_20px_rgba(37,141,205,0.35)]'
                      }`}
                    >
                      {inPlano ? (
                        <>
                          <Check size={14} /> En Plano ({inPlano.quantity})
                        </>
                      ) : (
                        <>
                          <Plus size={14} /> Añadir al Plano
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItemModal(item);
                      }}
                      className="p-3 rounded-xl bg-[#040914] hover:bg-[#0c1a36] text-[#AAD6CD] hover:text-white border border-[#AAD6CD]/20 cursor-pointer"
                      title="Ver Ficha y Condiciones"
                    >
                      <Info size={14} />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. CONDICIONES DE CONTRATACIÓN & GARANTÍA S-CLASS */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-20">
        <div className="p-8 sm:p-12 rounded-[2.5rem] bg-gradient-to-b from-[#0e0e14] to-[#08080c] border border-white/10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-[0.3em] font-bold block mb-1">
                Garantía Operativa & SLA
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase text-white font-syne">
                Condiciones de Contratación & <span className="text-[#ecb613]">Despliegue</span>
              </h2>
            </div>
            <a
              href="https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20consultar%20condiciones%20especiales%20de%20alquiler%20audiovisual."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 text-xs font-black uppercase tracking-wider transition-all font-mono self-start md:self-auto"
            >
              <Phone size={14} />
              <span>Contactar con Centralita</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
                <Truck size={20} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-syne">Logística 24/7 en Madrid</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Entrega, descarga y recogida puntual en la Comunidad de Madrid, IFEMA, fincas de Toledo, Guadalajara, Segovia y ámbito nacional.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Wrench size={20} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-syne">Montaje Certificado</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Técnicos especialistas en sonido, iluminación y vídeo. Cableado oculto, pruebas acústicas y configuración de red/streaming.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Clock size={20} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-syne">Sustitución en &lt;60 min</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Compromiso de redundancia y guardia técnica. Repuesto inmediato y asistencia in situ para garantizar 0 fallos durante tu evento.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-black/40 border border-white/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-syne">Póliza RC 1.000.000€</h3>
              <p className="text-xs text-white/60 leading-relaxed">
                Todos los equipos y operativas cuentan con seguro de responsabilidad civil integral y homologaciones CE/TÜV para recintos públicos.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 6. MODAL FICHA TÉCNICA DETALLADA */}
      <AnimatePresence>
        {activeItemModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveItemModal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 p-4 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl bg-gradient-to-b from-[#081226] to-[#040914] border border-[#AAD6CD]/30 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(8,18,38,0.95)] space-y-6 p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#AAD6CD]/15 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-[#AAD6CD] uppercase tracking-widest font-bold">
                      {activeItemModal.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-white font-syne">
                      {activeItemModal.name}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveItemModal(null)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-[#0c1a36] text-[#AAD6CD] hover:text-white border border-[#AAD6CD]/20"
                  >
                    ✕
                  </button>
                </div>

                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-black/60 relative border border-[#AAD6CD]/15">
                  <img 
                    src={activeItemModal.image} 
                    alt={activeItemModal.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[#081226]/90 backdrop-blur-md font-mono text-sm font-black text-[#AAD6CD] border border-[#AAD6CD]/30">
                    {activeItemModal.priceDisplay}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#AAD6CD]/60 tracking-wider mb-1">Descripción del Activo</h4>
                    <p className="text-sm text-white/80 leading-relaxed">
                      {activeItemModal.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase text-[#AAD6CD]/60 tracking-wider mb-2">Especificaciones Técnicas</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeItemModal.specs.map((spec, i) => (
                        <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-[#040914] border border-[#AAD6CD]/15 text-xs text-white/70">
                          <CheckCircle2 size={14} className="text-[#AAD6CD] shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#040914] border border-[#AAD6CD]/15 space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-[#AAD6CD]">
                      <ShieldCheck size={14} />
                      <span className="font-bold">Condiciones de Servicio Incluidas</span>
                    </div>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Revisión técnica previa, cables de conexión, soporte técnico de guardia y seguro de RC profesional.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[#AAD6CD]/15">
                  <button
                    onClick={() => {
                      handleAddToPlano(activeItemModal);
                      setActiveItemModal(null);
                    }}
                    className="flex-1 py-3.5 bg-[#258DCD] hover:bg-[#1e7ebd] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer font-syne shadow-[0_0_20px_rgba(37,141,205,0.4)]"
                  >
                    <Plus size={16} />
                    <span>Añadir a mi Plano Técnico</span>
                  </button>
                  <button
                    onClick={() => setActiveItemModal(null)}
                    className="px-6 py-3.5 bg-[#040914] hover:bg-[#0c1a36] text-[#AAD6CD] font-mono text-xs uppercase tracking-wider rounded-xl transition-all border border-[#AAD6CD]/20"
                  >
                    Cerrar
                  </button>
                </div>

              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 7. PLANO TÉCNICO SLIDE-OVER DRAWER */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-gradient-to-b from-[#081226] via-[#081226] to-[#040914] border-l border-[#AAD6CD]/25 z-50 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#AAD6CD]/15 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#258DCD]/15 text-[#258DCD]">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-white font-syne">Plano Técnico</h3>
                      <p className="text-[10px] font-mono text-[#AAD6CD]/70 uppercase tracking-widest">
                        Despliegue de Infraestructura Crítica
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-[#040914] hover:bg-[#0c1a36] text-[#AAD6CD] hover:text-white border border-[#AAD6CD]/20 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Items List */}
                {planoTecnico.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <Box size={40} className="text-[#AAD6CD]/20 mx-auto" />
                    <p className="text-sm font-mono text-[#AAD6CD]/50 uppercase tracking-wider">
                      Plano en Blanco
                    </p>
                    <p className="text-xs text-white/30 max-w-xs mx-auto">
                      Selecciona pantallas, audio, iluminación, fotomatón o gaming del arsenal para modular tu despliegue técnico.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {planoTecnico.map(({ item, quantity }) => (
                      <div 
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#040914] border border-[#AAD6CD]/15 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white uppercase leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#AAD6CD] block">
                            {item.priceDisplay} ({item.priceNumeric * quantity}€)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-[#081226] border border-[#AAD6CD]/20 rounded-lg p-1">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, -1)}
                              className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-mono font-bold text-white">
                              {quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, 1)}
                              className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveFromPlano(item.id)}
                            className="p-1.5 text-red-400 hover:bg-red-950/40 rounded-lg"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>

              {/* Total & Action Footer */}
              {planoTecnico.length > 0 && (
                <div className="space-y-4 pt-6 border-t border-[#AAD6CD]/15">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-xs uppercase tracking-widest text-white/50">Total Estimado Base</span>
                    <span className="text-2xl font-black text-[#AAD6CD] font-syne">{totalEstimatedBudget}€</span>
                  </div>

                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 bg-[#25D366] hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Transmitir Plano a Centralita</span>
                  </a>

                  <p className="text-[10px] text-center text-white/40 font-mono">
                    Incluye supervisión técnica, montaje y transporte en Madrid y península.
                  </p>
                </div>
              )}

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ArsenalTecnicoView;
