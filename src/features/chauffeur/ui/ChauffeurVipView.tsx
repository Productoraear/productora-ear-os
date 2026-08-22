'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Car, Shield, Clock, MapPin, CheckCircle2, PhoneCall, Sparkles, 
  ChevronRight, Calendar, Users, Briefcase, Award, Zap, Fuel,
  Compass, ArrowRight, Star, HeartHandshake, FileText
} from 'lucide-react';
import { VIP_SERVICES, QUALITY_VIP_PROVIDER_INFO, VipServiceProduct } from '@/data/quality-vip-solutions';

export default function ChauffeurVipView({ location = 'Madrid' }: { location?: string }) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('all');

  const fleetCards = [
    {
      id: 'clase-s',
      name: 'Mercedes-Benz Clase S Lujo',
      subtitle: 'El pináculo del confort y la representación institucional',
      pax: '1-3 Pasajeros',
      luggage: '3 Maletas Grandes',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop',
      features: [
        'Asientos de cuero nappa calefactados y ventilados',
        'Suspensión neumática Airmatic para absorción total',
        'Lunas tintadas y cortinillas de privacidad eléctricas',
        'Wi-Fi 5G de alta velocidad & Minibar de cortesía',
        'Chófer uniformado de etiqueta con protocolo diplomático'
      ],
      idealFor: 'Directores Generales, Cumbres Diplomáticas, Bodas de Gala y Novios.',
      priceFrom: 'Desde 140 € / Transfer'
    },
    {
      id: 'clase-v',
      name: 'Mercedes-Benz Clase V Extra Larga',
      subtitle: 'Salón ejecutivo rodante y máxima capacidad de equipaje',
      pax: '4-7 Pasajeros',
      luggage: '7 Maletas Grandes + Equipaje de Mano',
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop',
      features: [
        'Configuración de asientos vis-à-vis (Salón de Reuniones)',
        'Mesas plegables y tomas eléctricas 230V / Puertos USB',
        'Climatización independiente Thermotronic plazas traseras',
        'Gran maletero ideal para giras, instrumentos y compras',
        'Doble puerta lateral eléctrica corredera'
      ],
      idealFor: 'Giras de Artistas, Comitivas de Boda, Roadshows y Familias VIP.',
      priceFrom: 'Desde 130 € / Transfer'
    },
    {
      id: 'clase-e',
      name: 'Mercedes-Benz Clase E Business',
      subtitle: 'Eficiencia y elegancia ejecutiva para eventos corporativos',
      pax: '1-3 Pasajeros',
      luggage: '2 Maletas Grandes + 2 de Mano',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop',
      features: [
        'Acabado Avantgarde de alta distinción',
        'Insonorización acústica de cabina reforzada',
        'Conexión Bluetooth y cargadores inalámbricos',
        'Conducción suave y máxima puntualidad',
        'Seguimiento GPS telemático de ruta'
      ],
      idealFor: 'Transfers Aeropuerto IFEMA, Congresos y Citas de Negocios.',
      priceFrom: 'Desde 95 € / Transfer'
    },
    {
      id: 'maybach-suv',
      name: 'Mercedes-Maybach & SUV Premium',
      subtitle: 'Exclusividad absoluta, blindaje y alta escolta bajo demanda',
      pax: '1-4 Pasajeros',
      luggage: '4 Maletas Grandes',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
      features: [
        'Sonido Burmester High-End 3D Surround',
        'Asientos Executive con función de masaje activo',
        'Servicio de escolta y conductor de seguridad armada/desarmada',
        'Nevera integrada y copas de champán',
        'Discreción y confidencialidad absoluta (NDA)'
      ],
      idealFor: 'Celebridades internacionales, Jefes de Estado y Bodas de Élite.',
      priceFrom: 'Bajo Cotización Especial'
    }
  ];

  const categories = [
    { id: 'all', label: 'Todos los Servicios' },
    { id: 'Disposiciones por Horas', label: 'Disposiciones por Horas' },
    { id: 'Transfers Aeropuerto', label: 'Transfers Barajas & FBO' },
    { id: 'Transfers Interurbanos', label: 'Transfers Ciudad a Ciudad' },
    { id: 'Bodas & Eventos Sociales', label: 'Coches de Boda' },
    { id: 'Producción & Backstage', label: 'Logística de Artistas' },
    { id: 'Concierge & Lifestyle', label: 'Personal Shopper & Concierge' }
  ];

  const filteredServices = selectedCategory === 'all' 
    ? VIP_SERVICES 
    : VIP_SERVICES.filter(s => s.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO S-CLASS: ALQUILER DE VEHÍCULOS DE LUJO CON CONDUCTOR
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        {/* Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#ecb613]/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-xs font-semibold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Flota Oficial Homologada · Quality VIP Solutions & Productora EAR
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Alquiler de Vehículos de Lujo con Conductor & <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffd471] to-[#ecb613]">
              Servicio de Chófer VIP
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-400 font-light leading-relaxed mb-10">
            Transporte de representación S-Class en {location}, Ibiza, Marbella y toda España. Flota Mercedes-Benz Clase S, Clase V Extra Larga y Maybach con chóferes de estricto protocolo, lunas de alta privacidad y monitorización de vuelos en tiempo real.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20reserva%20de%20veh%C3%ADculo%20con%20ch%C3%B3fer%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/20 flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" /> Reservar Chófer 24/7 (+34 682 141 077)
            </a>
            <a
              href="#flota"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-base hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Car className="w-5 h-5 text-[#ecb613]" /> Explorar la Flota
            </a>
          </div>

          {/* Trust Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-5xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <Shield className="w-6 h-6 text-[#ecb613] mb-2" />
              <h4 className="text-sm font-bold text-white">Chóferes de Etiqueta</h4>
              <p className="text-xs text-neutral-400">Uniforme, bilingües y formación en protocolo y seguridad.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <Clock className="w-6 h-6 text-[#ecb613] mb-2" />
              <h4 className="text-sm font-bold text-white">60 Minutos de Cortesía</h4>
              <p className="text-xs text-neutral-400">En recogidas de aeropuerto Barajas T1-T4 y Terminal FBO.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <Zap className="w-6 h-6 text-[#ecb613] mb-2" />
              <h4 className="text-sm font-bold text-white">Wi-Fi 5G & Minibar</h4>
              <p className="text-xs text-neutral-400">Agua mineral, toallitas refrescantes y tomas 230V a bordo.</p>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <FileText className="w-6 h-6 text-[#ecb613] mb-2" />
              <h4 className="text-sm font-bold text-white">Garantía Mercantil NIF</h4>
              <p className="text-xs text-neutral-400">Factura oficial con NIF: QUALITY VIP SOLUTIONS, SL.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FLOTA DE VEHÍCULOS S-CLASS (DETALLE VISUAL)
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="flota" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Gama de Vehículos</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Flota de Representación Mercedes-Benz & Maybach
          </h2>
          <p className="text-sm text-neutral-400 mt-3 max-w-2xl mx-auto">
            Vehículos rigurosamente mantenidos, desinfectados tras cada servicio y equipados con los más altos estándares de insonorización y confort.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {fleetCards.map((car) => (
            <div 
              key={car.id}
              className="bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Container */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-neutral-900">
                  <img 
                    src={car.image} 
                    alt={car.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-black/30" />
                  
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#ecb613]" /> {car.pax}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-white flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-[#ecb613]" /> {car.luggage}
                    </span>
                  </div>

                  <div className="absolute bottom-4 right-4">
                    <span className="px-3 py-1.5 rounded-xl bg-[#ecb613] text-black text-xs font-bold shadow-lg">
                      {car.priceFrom}
                    </span>
                  </div>
                </div>

                {/* Car Content */}
                <div className="p-6 sm:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{car.name}</h3>
                  <p className="text-xs text-neutral-400 mb-6">{car.subtitle}</p>

                  <div className="space-y-2 mb-6">
                    {car.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-[#ecb613] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-neutral-400">
                    <span className="text-[#ecb613] font-semibold">Uso recomendado: </span>
                    {car.idealFor}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                <a
                  href={`https://wa.me/34682141077?text=Hola%2C%20deseo%20consultar%20disponibilidad%20para%20${encodeURIComponent(car.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-[#ecb613]"
                >
                  <Calendar className="w-4 h-4" /> Solicitar Disponibilidad de Fecha
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            3. CATÁLOGO DE SERVICIOS & TARIFAS CERRADAS
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="border-t border-white/10 pt-16">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Tarifario Transparente</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Servicios & Paquetes VIP</h2>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#ecb613] text-black shadow-md shadow-[#ecb613]/20'
                      : 'bg-white/5 text-neutral-400 hover:text-white border border-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:border-[#ecb613]/40 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-mono text-[#ecb613]">
                      {service.category}
                    </span>
                    <span>{service.capacityPax}</span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{service.name}</h3>
                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed">{service.description}</p>

                  <div className="space-y-1.5 mb-6 text-xs text-neutral-300">
                    {service.specs.slice(0, 3).map((spec, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#ecb613]" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block uppercase">Tarifa Cerrada</span>
                    <span className="text-xl font-black text-[#ecb613]">{service.priceDisplay}</span>
                  </div>
                  <a
                    href={`https://wa.me/34682141077?text=Hola%2C%20solicito%20reserva%20para%20${encodeURIComponent(service.name)}%20(${encodeURIComponent(service.priceDisplay)})`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs hover:bg-[#ecb613] transition-colors flex items-center gap-1.5"
                  >
                    Contratar <ChevronRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            4. INFORMACIÓN CORPORATIVA & DATOS LEGALES DEL PROVEEDOR
           ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="mt-20 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#111] to-[#080808] border border-[#ecb613]/30">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono text-[#ecb613] uppercase tracking-wider mb-3">
                <Shield className="w-4 h-4" /> Proveedor Homologado por Productora EAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {QUALITY_VIP_PROVIDER_INFO.name}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6">
                Entidad legalmente registrada con CIF <span className="text-white font-mono">{QUALITY_VIP_PROVIDER_INFO.cif}</span> y sede central en <span className="text-white">{QUALITY_VIP_PROVIDER_INFO.address}</span>. Operativa continua con bases en {QUALITY_VIP_PROVIDER_INFO.bases.join(', ')}.
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-neutral-300">
                <div>
                  <span className="text-neutral-500 block">Central Reservas:</span>
                  <a href={`tel:${QUALITY_VIP_PROVIDER_INFO.phoneCentral}`} className="text-white hover:text-[#ecb613] font-mono">
                    {QUALITY_VIP_PROVIDER_INFO.phoneCentral}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block">WhatsApp 24 Horas:</span>
                  <a href={`https://wa.me/${QUALITY_VIP_PROVIDER_INFO.phoneMobile.replace(/[^0-9]/g, '')}`} className="text-[#ecb613] font-mono font-bold">
                    {QUALITY_VIP_PROVIDER_INFO.phoneMobile}
                  </a>
                </div>
                <div>
                  <span className="text-neutral-500 block">Email Corporativo:</span>
                  <a href={`mailto:${QUALITY_VIP_PROVIDER_INFO.email}`} className="text-white hover:text-[#ecb613] font-mono">
                    {QUALITY_VIP_PROVIDER_INFO.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 text-center lg:text-right">
              <h4 className="text-lg font-bold text-white mb-2">¿Necesitas un Roadshow o Presupuesto Multidía?</h4>
              <p className="text-xs text-neutral-400 mb-6 max-w-md ml-auto">
                Diseñamos planes de transporte a medida para giras musicales, traslados de alta dirección y eventos de gran formato con conductores dedicados.
              </p>
              <a
                href="https://wa.me/34682141077?text=Hola%2C%20solicito%20presupuesto%20para%20un%20servicio%20corporativo%20multid%C3%ADa"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#ecb613] text-black font-bold text-sm hover:brightness-110 transition-all shadow-lg"
              >
                <PhoneCall className="w-4 h-4" /> Hablar con Jefe de Operaciones
              </a>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
}
