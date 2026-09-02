'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { 
  Car, Shield, Clock, MapPin, CheckCircle2, PhoneCall, Sparkles, 
  ChevronRight, Calendar, Users, Briefcase, Award, Zap, Fuel,
  Lock, ArrowRight, Loader2, CreditCard, Star, FileText
} from 'lucide-react';
import { VIP_SERVICES, QUALITY_VIP_PROVIDER_INFO } from '@/data/quality-vip-solutions';
import { createVipChauffeurCheckout } from '@/app/actions/vipCheckoutActions';

interface Props {
  location?: string;
}

export default function ChauffeurVipView({ location = 'Madrid' }: Props) {
  const [selectedVehicle, setSelectedVehicle] = useState<'clase-s' | 'clase-v' | 'clase-e' | 'maybach-suv'>('clase-s');
  const [selectedService, setSelectedService] = useState<'transfer_barajas' | 'disposicion_4h' | 'disposicion_8h' | 'boda_gala' | 'interurbano'>('transfer_barajas');
  const [eventDate, setEventDate] = useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Matriz de Tarifas Oficiales y Multiplicadores de Flota
  const PRICING_MATRIX = {
    'clase-s': {
      name: 'Mercedes-Benz Clase S Lujo',
      pax: '1-3 Pasajeros',
      luggage: '3 Maletas Grandes',
      rates: {
        transfer_barajas: 140,
        disposicion_4h: 360,
        disposicion_8h: 650,
        boda_gala: 500,
        interurbano: 450
      },
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=800&auto=format&fit=crop'
    },
    'clase-v': {
      name: 'Mercedes-Benz Clase V Extra Larga',
      pax: '4-7 Pasajeros',
      luggage: '7 Maletas Grandes',
      rates: {
        transfer_barajas: 130,
        disposicion_4h: 340,
        disposicion_8h: 600,
        boda_gala: 480,
        interurbano: 420
      },
      image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop'
    },
    'clase-e': {
      name: 'Mercedes-Benz Clase E Business',
      pax: '1-3 Pasajeros',
      luggage: '2 Maletas Grandes',
      rates: {
        transfer_barajas: 95,
        disposicion_4h: 260,
        disposicion_8h: 480,
        boda_gala: 380,
        interurbano: 320
      },
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop'
    },
    'maybach-suv': {
      name: 'Mercedes-Maybach & SUV Premium',
      pax: '1-4 Pasajeros',
      luggage: '4 Maletas Grandes',
      rates: {
        transfer_barajas: 220,
        disposicion_4h: 550,
        disposicion_8h: 950,
        boda_gala: 750,
        interurbano: 680
      },
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop'
    }
  };

  const currentVehicle = PRICING_MATRIX[selectedVehicle];
  const calculatedTotal = currentVehicle.rates[selectedService];
  const deposit30 = Math.round(calculatedTotal * 0.3);

  const handleCheckout = (mode: 'LOCK_10EUR' | 'DEPOSIT_30_PERCENT' | 'FULL_PAYMENT') => {
    setErrorMessage(null);
    startTransition(async () => {
      try {
        const result = await createVipChauffeurCheckout({
          vehicleId: selectedVehicle,
          vehicleName: currentVehicle.name,
          serviceType: selectedService,
          location,
          eventDate: eventDate || undefined,
          priceLockMode: mode,
          calculatedTotal
        });

        if (result?.url) {
          window.location.href = result.url;
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error al conectar con la pasarela de pagos.');
      }
    });
  };

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
        'Climatización independiente plazas traseras',
        'Gran maletero ideal para comitivas, instrumentos y compras',
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
      luggage: '2 Maletas Grandes',
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
      subtitle: 'Exclusividad superlativa para dignatarios y celebridades',
      pax: '1-4 Pasajeros',
      luggage: '4 Maletas Grandes',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop',
      features: [
        'Acabado First-Class Maybach',
        'Tracción integral 4MATIC y cristales blindados acústicos',
        'Sistema de sonido envolvente Burmester High-End',
        'Atención de máxima discreción y seguridad privada',
        'Acceso directo a terminales FBO aviación ejecutiva'
      ],
      idealFor: 'Artistas Internacionales, Embajadas y Clientes Ultra-High-Net-Worth.',
      priceFrom: 'Desde 220 € / Transfer'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO S-CLASS: ALQUILER DE VEHÍCULOS CON CONDUCTOR
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#ecb613]/10 blur-[130px] rounded-full pointer-events-none" />

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

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a
              href="#calculadora-reserva"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-base hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/20 flex items-center gap-2"
            >
              <Lock className="w-5 h-5" /> Bloquear Tarifa (10 € / 72h)
            </a>
            <a
              href="https://wa.me/34682141077?text=Hola%2C%20solicito%20reserva%20de%20veh%C3%ADculo%20con%20ch%C3%B3fer%20VIP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/15 text-white font-semibold text-base hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5 text-[#ecb613]" /> Concierge 24/7 (+34 682 141 077)
            </a>
          </div>

          {/* Badges */}
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
              <p className="text-xs text-neutral-400">Facturación oficial: QUALITY VIP SOLUTIONS, SL (B87910311).</p>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. MOTOR DE RESERVA & STRIPE PRICE-LOCK
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="calculadora-reserva" className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-b from-[#111] to-[#0a0a0a] border border-[#ecb613]/40 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Lock className="w-48 h-48 text-[#ecb613]" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#ecb613] mb-2">
              <CreditCard className="w-4 h-4" />
              <span>Pasarela Transaccional Stripe Price-Lock 72h</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Configura tu Servicio y Bloquea la Tarifa en {location}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mb-8">
              Garantiza la disponibilidad inmediata de la unidad seleccionada con un depósito simbólico de 10 € compensable en factura.
            </p>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-300 text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Selector de Vehículo */}
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase font-mono block mb-2">
                  1. Modelo de Vehículo
                </label>
                <div className="space-y-2">
                  {(['clase-s', 'clase-v', 'clase-e', 'maybach-suv'] as const).map((vKey) => {
                    const car = PRICING_MATRIX[vKey];
                    const isSelected = selectedVehicle === vKey;
                    return (
                      <button
                        key={vKey}
                        onClick={() => setSelectedVehicle(vKey)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ecb613]/10 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Car className={`w-4 h-4 ${isSelected ? 'text-[#ecb613]' : 'text-neutral-500'}`} />
                          <div>
                            <div className="text-xs font-bold text-white">{car.name}</div>
                            <div className="text-[10px] text-neutral-500">{car.pax} · {car.luggage}</div>
                          </div>
                        </div>
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#ecb613]' : 'text-neutral-400'}`}>
                          {car.rates[selectedService]} €
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Tipo de Servicio */}
              <div>
                <label className="text-xs font-bold text-neutral-300 uppercase font-mono block mb-2">
                  2. Tipo de Itinerario / Disposición
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'transfer_barajas', label: 'Transfer Aeropuerto Barajas / FBO (1 Trayecto)', desc: 'Incluye 60 min espera y peajes' },
                    { id: 'disposicion_4h', label: 'Disposición Ejecutiva (4 Horas)', desc: 'Chófer a disposición en ciudad' },
                    { id: 'disposicion_8h', label: 'Disposición Jornada Completa (8 Horas)', desc: 'Ideal cumbres, roadshows y compras' },
                    { id: 'boda_gala', label: 'Pack Boda de Gala (4-5 Horas)', desc: 'Recogida novios, ceremonia y sesión fotográfica' },
                    { id: 'interurbano', label: 'Transfer Interurbano (Madrid - Ciudad)', desc: 'Trayecto de larga distancia punto a punto' }
                  ].map((srv) => {
                    const isSelected = selectedService === srv.id;
                    return (
                      <button
                        key={srv.id}
                        onClick={() => setSelectedService(srv.id as any)}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ecb613]/10 border-[#ecb613] text-white shadow-md'
                            : 'bg-white/[0.02] border-white/10 text-neutral-400 hover:border-white/20'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-white">{srv.label}</div>
                          <div className="text-[10px] text-neutral-500">{srv.desc}</div>
                        </div>
                        <span className={`text-xs font-mono font-bold ${isSelected ? 'text-[#ecb613]' : 'text-neutral-400'}`}>
                          {currentVehicle.rates[srv.id as keyof typeof currentVehicle.rates]} €
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Resumen y Botones de Pago Stripe */}
            <div className="p-6 rounded-2xl bg-black/60 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-[11px] text-neutral-400 font-mono uppercase block">Tarifa Oficial Calculada</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#ecb613] font-mono">{calculatedTotal} €</span>
                  <span className="text-xs text-neutral-400">(IVA e impuestos incluidos)</span>
                </div>
                <span className="text-[11px] text-neutral-500 mt-1 block">
                  {currentVehicle.name} · {selectedService.replace(/_/g, ' ')} en {location}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  disabled={isPending}
                  onClick={() => handleCheckout('LOCK_10EUR')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4af37] text-black font-bold text-xs hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#ecb613]/20 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                  Bloquear Vehículo (10€ / 72h)
                </button>

                <button
                  disabled={isPending}
                  onClick={() => handleCheckout('DEPOSIT_30_PERCENT')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 border border-white/15 disabled:opacity-50"
                >
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  Reserva Formal (30% · {deposit30} €)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. CATÁLOGO VISUAL DE LA FLOTA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="flota" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest">Modelos Disponibles</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mt-2">
            Flota de Representación Mercedes-Benz & Maybach
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {fleetCards.map((car) => (
            <div 
              key={car.id}
              className="bg-[#0d0d0d] border border-white/10 rounded-3xl overflow-hidden hover:border-[#ecb613]/50 transition-all flex flex-col justify-between group"
            >
              <div>
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

              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-2">
                <a
                  href="#calculadora-reserva"
                  onClick={() => setSelectedVehicle(car.id as any)}
                  className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-[#ecb613] hover:text-black text-white font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/10 hover:border-[#ecb613]"
                >
                  <Lock className="w-4 h-4" /> Configurar y Bloquear Tarifa (10 €)
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
