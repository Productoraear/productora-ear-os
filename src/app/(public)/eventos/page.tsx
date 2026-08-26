'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, Building2, Landmark, Music, Zap, ShieldCheck, ArrowRight, Sparkles, Filter } from 'lucide-react';

interface EventCard {
  id: string;
  category: 'bodas' | 'corporativo' | 'patronales' | 'vip';
  title: string;
  subtitle: string;
  description: string;
  price: string;
  power: string;
  features: string[];
  href: string;
}

const EVENT_CATALOG: EventCard[] = [
  {
    id: '1',
    category: 'bodas',
    title: 'The VIP Wedding Gala',
    subtitle: 'Producción Nupcial S-Class 360°',
    description: 'Ceremonia lírica con Tenor Solista, cóctel con agrupación musical y fiesta con sonorización Bose F1 calibrada a 12 W/pax.',
    price: 'Desde 1.250€',
    power: '12 W/pax Calibrado',
    features: ['Tenor Lírico & Mariachi', 'Sonorización Bose F1', 'Iluminación Warm Gala', 'Póliza RC 1M€'],
    href: '/bodas'
  },
  {
    id: '2',
    category: 'bodas',
    title: 'Catering de Brasas & Live Fire',
    subtitle: 'Gastronomía Ancestral de Gala',
    description: 'Showcooking en vivo con cortes nobles ibéricos sobre brasas de carbón vegetal y leña de encina.',
    price: 'Desde 45€ / Pax',
    power: 'Parrilleros Titulados',
    features: ['Cortes Ibéricos Curados', 'Sonorización Ambiental', 'Registro Sanitario RGSAA', 'Montaje Rustik-VIP'],
    href: '/catering-brasas'
  },
  {
    id: '3',
    category: 'corporativo',
    title: 'Convención & Gala Corporativa',
    subtitle: 'Infraestructura Audiovisual B2B',
    description: 'Pantallas LED P2.9 de alta resolución, microfonía de grado emisión Shure Axient y realización en directo.',
    price: 'Desde 1.800€',
    power: 'Pantallas LED P2.9',
    features: ['Escenario Modular', 'Streaming HD', 'Técnico DMX Dedicado', 'Certificación CEE'],
    href: '/alquiler-equipos-sonido-audiovisuales'
  },
  {
    id: '4',
    category: 'patronales',
    title: 'Fiestas Patronales & Escenario Móvil',
    subtitle: 'Producción B2G LCSP (Art. 118)',
    description: 'Montaje de gran formato para Ayuntamientos con Orquesta Patronal, Mariachi Imperial y pantallas gigantes LED.',
    price: 'Desde 3.500€',
    power: 'Sistema L-Acoustics K2',
    features: ['Facturación en FACe', 'Pactado con VIMUME 3ª Edad', 'Pliegos Técnicos PDF', 'Seguridad Social al Día'],
    href: '/ocasiones/ayuntamientos'
  },
  {
    id: '5',
    category: 'vip',
    title: 'VIMUME Neuroacústica 40Hz',
    subtitle: 'Terapia Musical Social',
    description: 'Protocolo de estimulación cognitiva en directo para centros de mayores y residencias municipales.',
    price: 'Bonificado / Subvencionado',
    power: 'Acústica Médica <75 dB',
    features: ['Edwin Agudelo Solista', 'Memoria de Impacto Social', 'Subvencionable IRPF', 'Formato Clínico'],
    href: '/vimume'
  }
];

export default function EventosPage() {
  const [activeTab, setActiveTab] = useState<'todos' | 'bodas' | 'corporativo' | 'patronales' | 'vip'>('todos');

  const filteredEvents = activeTab === 'todos' 
    ? EVENT_CATALOG 
    : EVENT_CATALOG.filter(e => e.category === activeTab);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-28 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA DE LA ARQUITECTURA */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 border border-[#ecb613]/30 bg-[#ecb613]/10 px-3 py-1 rounded-full text-xs font-mono text-[#ecb613] uppercase">
            <Sparkles size={14} /> Sistema Operativo de Eventos S-Class
          </div>
          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white tracking-tight">
            Arquitectura de Eventos &amp; Coberturas
          </h1>
          <p className="text-white/60 font-montserrat text-sm md:text-base max-w-2xl">
            Catálogo unificado de producciones nupciales, corporativas, patronales y soluciones de ingeniería acústica.
          </p>
        </div>

        {/* CONTROLES DE FILTRADO (TABS) */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          {[
            { id: 'todos', label: 'Todos los Servicios' },
            { id: 'bodas', label: 'Bodas & Galas' },
            { id: 'corporativo', label: 'Corporativo & B2B' },
            { id: 'patronales', label: 'Patronales & B2G' },
            { id: 'vip', label: 'VIMUME Salud' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase transition-all ${
                activeTab === tab.id
                  ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20'
                  : 'bg-white/5 border border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRID DE SERVICIOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <div 
              key={event.id}
              className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-[#ecb613]/50 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono uppercase bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-[#ecb613]">
                    {event.power}
                  </span>
                  <span className="text-sm font-fraunces font-bold text-white">
                    {event.price}
                  </span>
                </div>

                <div>
                  <h3 className="text-2xl font-fraunces font-black text-white group-hover:text-[#ecb613] transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-xs font-mono text-white/40 mt-1">{event.subtitle}</p>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-montserrat">
                  {event.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/5">
                  {event.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/70">
                      <Zap size={12} className="text-[#ecb613]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10">
                <Link
                  href={event.href}
                  className="w-full py-3 bg-white/5 hover:bg-[#ecb613] hover:text-black border border-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <span>Ver Especificaciones</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
