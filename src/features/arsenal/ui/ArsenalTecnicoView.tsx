"use client";

import React, { useState } from 'react';
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
  FileSpreadsheet, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Box, 
  Send,
  HelpCircle
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

export interface ArsenalItem {
  id: string;
  name: string;
  category: 'Pantallas LED' | 'Monitores & TV' | 'Sonido Profesional' | 'Iluminación' | 'Vídeo & IT' | 'Escenarios';
  description: string;
  priceDisplay: string;
  priceNumeric: number;
  unitType: 'm²' | 'unidad' | 'metro';
  canonicalUrl: string;
  image: string;
  specs: string[];
}

export const ARSENAL_CATALOG: ArsenalItem[] = [
  // Pantallas LED
  {
    id: 'muro-led-p26',
    name: 'Muro LED Interior P2.6 High-Refresh',
    category: 'Pantallas LED',
    description: 'Resolución cristalina para distancias cortas. Ideal para congresos e IFEMA.',
    priceDisplay: '120€ / m²',
    priceNumeric: 120,
    unitType: 'm²',
    canonicalUrl: '/alquiler-pantalla-led/pantalla-led-interior',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    specs: ['Pitch P2.6mm', 'Refresh Rate 3840Hz', 'Brillo 1000 nits', 'Chasis de aluminio fundido']
  },
  {
    id: 'lienzo-led-exterior-ip65',
    name: 'Lienzo LED Exterior IP65 High-Brightness',
    category: 'Pantallas LED',
    description: 'Visibilidad total bajo luz solar directa. Estructura reforzada para festivales.',
    priceDisplay: '150€ / m²',
    priceNumeric: 150,
    unitType: 'm²',
    canonicalUrl: '/alquiler-pantalla-led/pantallas-led-exterior',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop',
    specs: ['Protección IP65', 'Brillo 5500 nits', 'Resistencia viento 20m/s', 'Montaje rápido curvable']
  },
  {
    id: 'suelo-led-interactivo',
    name: 'Suelo LED Interactivo Reforzado',
    category: 'Pantallas LED',
    description: 'Soporta peso de vehículos. Sensores capacitivos para stands de automoción y galas.',
    priceDisplay: '200€ / m²',
    priceNumeric: 200,
    unitType: 'm²',
    canonicalUrl: '/alquiler-pantalla-led/pantalla-led-suelo',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    specs: ['Carga 2.000 kg/m²', 'Vidrio templado antideslizante', 'Tracking reactivo en vivo']
  },
  {
    id: 'pantalla-led-curva-flexible',
    name: 'Pantalla LED Curva / Flexible',
    category: 'Pantallas LED',
    description: 'Arquitectura visual orgánica para escenarios de autor y diseños envolventes.',
    priceDisplay: '180€ / m²',
    priceNumeric: 180,
    unitType: 'm²',
    canonicalUrl: '/alquiler-pantalla-led/pantallas-led-curva-flexibles',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    specs: ['Curvatura convexa/cóncava ±15°', 'Grosor ultra delgado', 'Modulación magnética']
  },

  // Monitores & TV
  {
    id: 'monitor-98-4k',
    name: 'Monitor Gran Formato 98" 4K Ultra-Thin',
    category: 'Monitores & TV',
    description: 'Sustituye la proyección con máxima nitidez. Panel profesional 24/7 sin reflejos.',
    priceDisplay: '450€',
    priceNumeric: 450,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-tv-monitor-led-madrid/alquiler-monitores-98',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=800&auto=format&fit=crop',
    specs: ['Resolución 3840x2160', 'Operación 24/7', 'Soporte peana o pared incluido']
  },
  {
    id: 'monitor-85-4k',
    name: 'Monitor 85" 4K Smart HDR',
    category: 'Monitores & TV',
    description: 'Equilibrio perfecto entre tamaño e impacto visual para salas VIP y conferencias.',
    priceDisplay: '320€',
    priceNumeric: 320,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-tv-monitor-led-madrid/alquiler-monitores-85',
    image: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=800&auto=format&fit=crop',
    specs: ['HDR10+ Pro', 'Conectividad HDMI/Wireless', 'Marco ultradelgado']
  },
  {
    id: 'pantalla-tactil-65',
    name: 'Pantalla Táctil Interactiva 65"',
    category: 'Monitores & TV',
    description: 'Navegación fluida para catálogos digitales, apps interactivas y ferias comerciales.',
    priceDisplay: '180€',
    priceNumeric: 180,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-tv-monitor-led-madrid/alquiler-pantallas-tactiles',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop',
    specs: ['20 puntos táctiles', 'Vidrio antirreflejo 4mm', 'Windows/Android dual']
  },

  // Sonido Profesional
  {
    id: 'line-array-vtx-a8',
    name: 'Sistema Line Array VTX A8',
    category: 'Sonido Profesional',
    description: 'Presión sonora controlada para eventos de alta gama con dispersión milimétrica.',
    priceDisplay: '850€',
    priceNumeric: 850,
    unitType: 'unidad',
    canonicalUrl: '/alquilar-equipos-de-sonido-en-madrid/alquiler-altavoces',
    image: 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800&auto=format&fit=crop',
    specs: ['Directividad 110°', 'Etapas Crown I-Tech HD', 'Presión 12 W/pax certificada']
  },
  {
    id: 'microfonia-shure-axient',
    name: 'Microfonía Digital Shure Axient',
    category: 'Sonido Profesional',
    description: 'Blindaje contra interferencias de espectro para ponentes VIP y directos críticos.',
    priceDisplay: '95€',
    priceNumeric: 95,
    unitType: 'unidad',
    canonicalUrl: '/alquilar-equipos-de-sonido-en-madrid/microfonos',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=800&auto=format&fit=crop',
    specs: ['Frecuencia Diversity', 'Cápsulas KSM9 / Beta 58', 'Monitoreo RF en tiempo real']
  },
  {
    id: 'traduccion-simultanea',
    name: 'Sistema de Traducción Simultánea',
    category: 'Sonido Profesional',
    description: 'Sistemas infrarrojos Bosch para cumbres internacionales y cabinas bilingües.',
    priceDisplay: '450€',
    priceNumeric: 450,
    unitType: 'unidad',
    canonicalUrl: '/alquilar-equipos-de-sonido-en-madrid/alquiler-traduccion-simultanea',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop',
    specs: ['Hasta 32 canales de idioma', 'Receptores digitales ergonómicos', 'Infrarrojo inmune a luces']
  },

  // Iluminación
  {
    id: 'cabeza-movil-15r',
    name: 'Cabeza Móvil Beam/Spot 15R Pro',
    category: 'Iluminación',
    description: 'Efectos aéreos definidos, gobos y prismas rotativos para galas y directos.',
    priceDisplay: '75€',
    priceNumeric: 75,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-iluminacion-eventos/alquiler-cabezas-moviles',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=800&auto=format&fit=crop',
    specs: ['Lámpara 15R 300W', 'Prisma 8+16 caras', 'Control DMX512 / Wireless']
  },
  {
    id: 'laser-rgb-10w',
    name: 'Sistema Láser RGB 10W',
    category: 'Iluminación',
    description: 'Geometría lumínica de precisión para branding corporativo y shows de impacto.',
    priceDisplay: '180€',
    priceNumeric: 180,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-iluminacion-eventos/iluminacion-laser',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop',
    specs: ['Potencia 10.000mW', 'Escáner 40 kpps', 'Control Pangolin Beyond']
  },

  // Vídeo & IT
  {
    id: 'camara-blackmagic-ursa',
    name: 'Cámara Blackmagic URSA Broadcast',
    category: 'Vídeo & IT',
    description: 'Calidad televisiva 4K para streaming profesional, realización y grabaciones.',
    priceDisplay: '350€',
    priceNumeric: 350,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-camaras-profesionales/alquiler-blackmagic-ursa',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop',
    specs: ['Sensor 4K HDR', 'Montura B4 / EF', 'Conectividad SDI 12G']
  },
  {
    id: 'laptop-edicion-pro',
    name: 'Estación de Edición / Laptop Pro',
    category: 'Vídeo & IT',
    description: 'Equipos informáticos de alta gama configurados para control y streaming sin cortes.',
    priceDisplay: '120€',
    priceNumeric: 120,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-equipos-informaticos',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop',
    specs: ['GPU RTX 4080 / Apple M3 Max', '64GB RAM', 'Licencias vMix / Resolume']
  },

  // Escenarios
  {
    id: 'tarima-rosco-2x1',
    name: 'Tarima Rosco 2x1m Reforzada',
    category: 'Escenarios',
    description: 'Certificación oficial de carga pesada. Superficie antideslizante con patas regulables.',
    priceDisplay: '25€',
    priceNumeric: 25,
    unitType: 'unidad',
    canonicalUrl: '/alquiler-escenarios/alquiler-tarima',
    image: 'https://images.unsplash.com/photo-1464375117522-1311d6a5b81f?q=80&w=800&auto=format&fit=crop',
    specs: ['Carga 750 kg/m²', 'Madera abedul 22mm', 'Altura de 20cm a 140cm']
  },
  {
    id: 'truss-global-sq4112',
    name: 'Estructura Truss Global SQ-4112',
    category: 'Escenarios',
    description: 'Soporte modular de aluminio estructural para rigging de iluminación y pantallas.',
    priceDisplay: '15€ / metro',
    priceNumeric: 15,
    unitType: 'metro',
    canonicalUrl: '/alquiler-estructuras-truss',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop',
    specs: ['Aleación EN-AW 6082 T6', 'Cuadrado 29x29cm', 'Homologación TÜV']
  }
];

export const ArsenalTecnicoView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [planoTecnico, setPlanoTecnico] = useState<{ item: ArsenalItem; quantity: number }[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const categories = [
    'Todos',
    'Pantallas LED',
    'Monitores & TV',
    'Sonido Profesional',
    'Iluminación',
    'Vídeo & IT',
    'Escenarios'
  ];

  const filteredItems = selectedCategory === 'Todos'
    ? ARSENAL_CATALOG
    : ARSENAL_CATALOG.filter(item => item.category === selectedCategory);

  const handleAddToPlano = (item: ArsenalItem) => {
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
      .map(p => `• ${p.quantity}x ${p.item.name} (${p.item.priceDisplay})`)
      .join('%0A');
    return `https://wa.me/34693693048?text=Hola%20Edwin,%20quiero%20cotizar%20este%20Plano%20T%C3%A9cnico%20de%20Arsenal%20EAR:%0A${itemsList}%0A%0APresupuesto%20Base%20Estimado:%20${totalEstimatedBudget}€`;
  };

  return (
    <div className="w-full bg-[#050505] text-white selection:bg-[#ecb613]/30 font-sans pb-24">
      
      {/* 1. HERO SECTION: EL ARSENAL TÉCNICO */}
      <section className="relative pt-10 pb-12 px-4 md:px-8 max-w-7xl mx-auto space-y-6 text-center">
        
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
          <Box size={14} className="animate-spin" />
          <span>Infraestructura de Contexto 360</span>
        </div>

        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black uppercase tracking-tight text-white font-syne leading-none">
          El Arsenal <span className="text-[#ecb613]">Técnico</span>
        </h1>

        <p className="text-white/70 text-sm sm:text-lg max-w-3xl mx-auto leading-relaxed">
          Hemos absorbido las mejores capacidades técnicas para ofrecerte un despliegue sin fisuras bajo el dominio <strong>productoraear.com</strong>. No alquilamos equipos, <strong>construimos el entorno de tu éxito</strong>.
        </p>

        {/* 2. CATEGORY PILLS BAR & PLANO TÉCNICO TRIGGER */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-8 border-t border-white/5">
          
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                    : 'bg-[#0e0e14] text-white/60 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Trigger Botón Plano Técnico */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-[#0e0e14] border border-[#ecb613]/30 hover:border-[#ecb613] text-white transition-all cursor-pointer"
          >
            <div className="p-1.5 rounded-lg bg-[#ecb613]/10 text-[#ecb613]">
              <Layers size={16} />
            </div>
            <div className="text-left font-mono">
              <span className="text-[10px] text-white/50 uppercase tracking-widest block">Plano Técnico</span>
              <span className="text-xs font-black text-[#ecb613]">
                {planoTecnico.length} {planoTecnico.length === 1 ? 'Módulo' : 'Módulos'} ({totalEstimatedBudget}€)
              </span>
            </div>
          </button>

        </div>

      </section>

      {/* 3. CATALOG GRID */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => {
            const inPlano = planoTecnico.find(p => p.item.id === item.id);
            return (
              <div
                key={item.id}
                className="rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all flex flex-col justify-between overflow-hidden group shadow-xl"
              >
                <div>
                  {/* Image Preview */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/60">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/20" />
                    
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md text-[#ecb613] text-[9px] font-black uppercase tracking-wider font-mono border border-white/10">
                      {item.category}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-3">
                    <h3 className="text-base font-black uppercase tracking-tight text-white font-syne group-hover:text-[#ecb613] transition-colors leading-tight">
                      {item.name}
                    </h3>
                    
                    <p className="text-xs text-white/60 leading-relaxed line-clamp-2">
                      {item.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">Inversión Base</span>
                      <span className="text-base font-black text-[#ecb613] font-mono">{item.priceDisplay}</span>
                    </div>

                    {/* Specs Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.specs.slice(0, 2).map((spec, i) => (
                        <span key={i} className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => handleAddToPlano(item)}
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      inPlano
                        ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 hover:bg-[#ecb613] hover:text-black text-white'
                    }`}
                  >
                    {inPlano ? (
                      <>
                        <Check size={14} /> Añadido ({inPlano.quantity}x)
                      </>
                    ) : (
                      <>
                        <Plus size={14} /> Añadir al Plano Técnico
                      </>
                    )}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 4. PLANO TÉCNICO SLIDE-OVER DRAWER */}
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
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0a0a0f] border-l border-white/10 z-50 p-6 md:p-8 flex flex-col justify-between shadow-2xl overflow-y-auto"
            >
              <div className="space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[#ecb613]/10 text-[#ecb613]">
                      <Layers size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase text-white font-syne">Plano Técnico</h3>
                      <p className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                        Despliegue de Infraestructura Crítica
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                {/* Items List */}
                {planoTecnico.length === 0 ? (
                  <div className="py-16 text-center space-y-3">
                    <Box size={40} className="text-white/20 mx-auto" />
                    <p className="text-sm font-mono text-white/40 uppercase tracking-wider">
                      Plano en Blanco
                    </p>
                    <p className="text-xs text-white/30 max-w-xs mx-auto">
                      Selecciona pantallas, audio o iluminación del arsenal para modular tu despliegue técnico.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {planoTecnico.map(({ item, quantity }) => (
                      <div 
                        key={item.id}
                        className="p-4 rounded-2xl bg-[#0e0e14] border border-white/5 flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-white uppercase leading-tight">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-mono text-[#ecb613] block">
                            {item.priceDisplay} ({item.priceNumeric * quantity}€)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center bg-black/60 border border-white/10 rounded-lg p-1">
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
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-xs uppercase tracking-widest text-white/50">Total Estimado Base</span>
                    <span className="text-2xl font-black text-[#ecb613] font-syne">{totalEstimatedBudget}€</span>
                  </div>

                  <a
                    href={generateWhatsAppMessage()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4.5 bg-[#25D366] hover:bg-emerald-400 text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl flex items-center justify-center gap-3 transition-all shadow-xl cursor-pointer"
                  >
                    <Send size={16} />
                    <span>Transmitir Plano a Centralita</span>
                  </a>

                  <p className="text-[10px] text-center text-white/40 font-mono">
                    Incluye supervisión técnica y transporte en Madrid y Toledo.
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
