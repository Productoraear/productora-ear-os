'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShieldCheck, 
  Sparkles, 
  PhoneCall, 
  MessageCircle, 
  Truck, 
  Volume2, 
  Tv, 
  Sliders, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight, 
  MapPin, 
  FileText, 
  Zap, 
  ChevronDown,
  Layers,
  Award
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';
import { ArsenalPoblacionProfile, LayoutBlockId, LocalizedArsenalItem } from '@/lib/seo/arsenalPoblacionesEngine';

interface ArsenalPoblacionLandingProps {
  profile: ArsenalPoblacionProfile;
}

export const ArsenalPoblacionLanding: React.FC<ArsenalPoblacionLandingProps> = ({ profile }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [selectedItemForModal, setSelectedItemForModal] = useState<LocalizedArsenalItem | null>(null);

  const whatsappMessage = encodeURIComponent(
    `Hola Productora EAR, deseo consultar disponibilidad y presupuesto del Arsenal Audiovisual para un evento en ${profile.poblacionName} (${profile.provinceName}).`
  );
  const whatsappUrl = `https://wa.me/34693693048?text=${whatsappMessage}`;

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 1: HERO TÉCNICO HIPERLOCAL
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderHero = () => (
    <header key="block-hero" className="relative pt-24 md:pt-32 pb-16 px-4 max-w-7xl mx-auto overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[850px] h-[340px] bg-gradient-to-b from-[#ecb613]/15 via-transparent to-transparent blur-[140px] pointer-events-none rounded-full" />

      {/* Breadcrumbs de navegación */}
      <nav aria-label="Migas de pan" className="flex items-center gap-2 font-mono text-[11px] text-white/50 mb-6">
        <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
        <span>/</span>
        <Link href="/alquiler" className="hover:text-white transition-colors">Alquiler</Link>
        <span>/</span>
        <span className="text-[#ecb613] font-bold uppercase">{profile.poblacionName}</span>
      </nav>

      <div className="space-y-6 max-w-5xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest">
          <Sparkles size={14} /> {profile.heroBadge}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight font-syne leading-[1.1]">
          {profile.h1}
        </h1>

        <p className="text-[#ecb613] font-mono text-sm sm:text-base font-semibold max-w-3xl leading-relaxed">
          {profile.h2Subtitle}
        </p>

        <div className="text-neutral-300 text-sm sm:text-base font-light leading-relaxed space-y-4 max-w-4xl border-l-2 border-[#ecb613]/40 pl-5 bg-white/[0.02] py-3 rounded-r-xl">
          <p>{profile.leadParagraph}</p>
          <p className="text-neutral-400 text-xs sm:text-sm">{profile.secondaryParagraph}</p>
        </div>

        {/* Telemetría rápida */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
          <div className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 flex flex-col">
            <span className="text-white/40 text-[10px] uppercase">Distancia Hub</span>
            <span className="text-white font-bold text-sm mt-0.5">{profile.distanceKm} km desde Méntrida</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 flex flex-col">
            <span className="text-white/40 text-[10px] uppercase">Tránsito Estimado</span>
            <span className="text-[#ecb613] font-bold text-sm mt-0.5">~{profile.transitMinutes} min vía {profile.mainAccessHighway.split(' ')[0]}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 flex flex-col">
            <span className="text-white/40 text-[10px] uppercase">Límite Acústico</span>
            <span className="text-emerald-400 font-bold text-sm mt-0.5">&lt; {profile.maxDbLimit} dB SPL</span>
          </div>
          <div className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 flex flex-col">
            <span className="text-white/40 text-[10px] uppercase">Garantía S-Class</span>
            <span className="text-cyan-400 font-bold text-sm mt-0.5">RC 1.000.000 €</span>
          </div>
        </div>

        {/* CTAs Principales */}
        <div className="flex flex-wrap items-center gap-3 pt-4 font-mono text-xs">
          <Link
            href="/cotizador"
            className="px-6 py-3.5 rounded-xl bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#ecb613]/20 transition-all hover:scale-[1.02]"
          >
            <span>Calcular Presupuesto en {profile.poblacionName}</span>
            <ArrowRight size={14} />
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/40 font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <MessageCircle size={15} /> WhatsApp Técnico
          </a>
          <a
            href={`tel:${CENTRALITA.display.replace(/\s+/g, '')}`}
            className="px-5 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            <PhoneCall size={14} /> {CENTRALITA.display}
          </a>
        </div>
      </div>
    </header>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 2: ACOUSTIC SPATIAL & 12 W/PAX SIMULATOR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderAcousticMatcher = () => (
    <section key="block-acoustic" className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-[#0c0a06] via-[#08080c] to-[#0c0a06] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-10 space-y-6 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Volume2 size={13} /> Calibración Acústica Territorial • {profile.poblacionName}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-syne tracking-tight">
              Ingeniería Acústica 12 W/pax y Preservación de Recinto
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm font-light leading-relaxed">
              En {profile.poblacionName} calculamos matemáticamente la potencia necesaria según el aforo y la arquitectura del recinto. Aplicamos limitadores de corte suave para respetar el límite de {profile.maxDbLimit} dB SPL, garantizando que el discurso, la música en vivo y el baile suenen con nitidez cristalina y pegada sin riesgo de sanciones municipales.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 text-right font-mono space-y-2 shrink-0 md:min-w-[260px]">
            <span className="text-[10px] text-white/50 uppercase block">Rider Acústico Oficial</span>
            <p className="text-2xl font-black text-[#ecb613]">12 W RMS / pax</p>
            <p className="text-xs text-neutral-400">Bose F1 812 / JBL VTX A8</p>
            <div className="pt-2 border-t border-white/10 flex items-center justify-end gap-1.5 text-[11px] text-emerald-400">
              <ShieldCheck size={13} /> Certificado de Calibración
            </div>
          </div>
        </div>

        {/* Tarjetas de Presión Acústica */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">1. Eventos Intimos (50 - 120 pax)</span>
            <p className="text-white font-bold text-sm">600W - 1.440W RMS</p>
            <p className="text-neutral-500 text-[11px]">2x Bose S1 Pro+ o Columnas L-Acoustics Syva. Ideal bodas íntimas en {profile.poblacionName}.</p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">2. Galas & Fincas (150 - 300 pax)</span>
            <p className="text-[#ecb613] font-bold text-sm">1.800W - 3.600W RMS</p>
            <p className="text-neutral-500 text-[11px]">Sistema Bose F1 Model 812 con subwoofers duales. Cobertura uniforme en jardines y carpas.</p>
          </div>
          <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
            <span className="text-neutral-400 text-[10px] uppercase font-bold">3. Grandes Recintos (&gt; 400 pax)</span>
            <p className="text-cyan-400 font-bold text-sm">4.800W - 12.000W RMS</p>
            <p className="text-neutral-500 text-[11px]">Line Array colgado d&b / JBL VTX con procesado Dante. Presión sonora contundente y certificada.</p>
          </div>
        </div>
      </div>
    </section>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 3: REJILLA DEL ARSENAL (CATÁLOGO DE HARDWARE)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderHardwareGrid = () => (
    <section key="block-hardware" className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-semibold block">
            Equipamiento Homologado S-Class
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-syne tracking-tight">
            Arsenal Audiovisual Recomendado para {profile.poblacionName}
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-light">
            Hardware propio en stock permanente, con transporte homologado, seguro de RC y técnico in-situ.
          </p>
        </div>

        <Link
          href="/arsenal"
          className="text-xs font-mono text-[#ecb613] hover:underline flex items-center gap-1 shrink-0"
        >
          <span>Ver catálogo completo de 60+ equipos</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {profile.items.map((item) => (
          <div 
            key={item.id}
            className="group bg-[#08080c] border border-white/10 hover:border-[#ecb613]/50 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/80 border border-white/10 text-[10px] font-mono text-[#ecb613] font-bold uppercase">
                  {item.badge}
                </div>
                <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-[#ecb613] text-black text-[10px] font-mono font-black uppercase">
                  {item.priceDisplay}
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-neutral-400 uppercase">{item.category}</span>
                  <h3 className="text-base font-bold text-white font-syne group-hover:text-[#ecb613] transition-colors leading-snug">
                    {item.name}
                  </h3>
                </div>

                <p className="text-neutral-400 text-xs font-light leading-relaxed line-clamp-2">
                  {item.tagline}
                </p>

                <div className="space-y-1.5 pt-2 border-t border-white/5 font-mono text-[11px] text-neutral-300">
                  {item.specs.slice(0, 3).map((spec, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-[#ecb613] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex items-center gap-2 font-mono text-xs">
              <Link
                href="/cotizador"
                className="flex-1 py-2.5 rounded-xl bg-white/5 hover:bg-[#ecb613] hover:text-black text-white text-center font-bold transition-all border border-white/10 flex items-center justify-center gap-1.5"
              >
                <span>Reservar</span>
                <Lock size={12} />
              </Link>
              <a
                href={`https://wa.me/34693693048?text=${encodeURIComponent(`Hola Productora EAR, deseo cotizar el equipo: ${item.name} para un evento en ${profile.poblacionName}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-white/5 hover:bg-[#25D366]/20 text-neutral-400 hover:text-[#25D366] border border-white/10 transition-colors"
                title="Consultar por WhatsApp"
              >
                <MessageCircle size={15} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 4: TELEMETRÍA LOGÍSTICA MÉNTRIDA
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderLogistics = () => (
    <section key="block-logistics" className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-semibold flex items-center gap-1.5">
              <Truck size={13} /> Despliegue de Flota y Telemetría • Hub Central Méntrida
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-syne tracking-tight">
              Ruta Logística Dedicada a {profile.poblacionName}
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm font-light">
              Despliegue operativo directo desde nuestra central en Méntrida (Toledo) y base de apoyo en Plaza Elíptica (Madrid).
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-black/60 border border-white/10 text-neutral-300">
              {profile.isZonaCeroMentrida ? '📍 Zona Cero Sin Recargo' : `🛣️ ${profile.distanceKm} km`}
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] font-bold">
              ⏱️ T-120 min de Montaje
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-white/40 text-[10px] uppercase font-bold">Corredor Vial Asignado</span>
            <p className="text-base font-bold text-white">{profile.mainAccessHighway}</p>
            <p className="text-neutral-400 text-[11px] font-sans font-light leading-relaxed">
              Tránsito fluido con acceso directo al término de {profile.poblacionName}, evitando zonas de retención y facilitando el acceso de carga.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-white/40 text-[10px] uppercase font-bold">Vehículo de Dotación</span>
            <p className="text-base font-bold text-[#ecb613]">{profile.recommendedVehicle.split('(')[0]}</p>
            <p className="text-neutral-400 text-[11px] font-sans font-light leading-relaxed">
              Equipado con trampilla elevadora, suelo acolchado y baúles flightcase estancos para la máxima protección del material.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
            <span className="text-white/40 text-[10px] uppercase font-bold">Garantía de Relevo Uber 0%</span>
            <p className="text-base font-bold text-emerald-400">0% Cancelaciones</p>
            <p className="text-neutral-400 text-[11px] font-sans font-light leading-relaxed">
              Si se produce una incidencia mecánica o ampliación de horas extra, activamos de inmediato unidad nodriza de relevo sin interrumpir el show.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-neutral-300 text-xs font-light leading-relaxed">
          {profile.tertiaryParagraph}
        </div>
      </div>
    </section>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 5: VALUE STACK & COMPLIANCE B2G
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderValueStack = () => (
    <section key="block-valueStack" className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-b from-[#100d04] via-[#08080c] to-[#08080c] border border-[#ecb613]/40 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
            Value Stack de Ingeniería & Protección Legal
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white uppercase font-syne tracking-tight">
            {profile.technicalPackName}
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-light">
            {profile.technicalPackSummary}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-sm font-bold text-white font-syne">Póliza RC 1.000.000 €</h3>
            <p className="text-neutral-400 text-[11px] font-sans font-light">
              Cobertura civil total en recintos históricos, hoteles y fincas privadas de {profile.poblacionName}.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Lock size={20} />
            </div>
            <h3 className="text-sm font-bold text-white font-syne">Price-Lock SHA-256</h3>
            <p className="text-neutral-400 text-[11px] font-sans font-light">
              Fianza de 100,00 € con bloqueo de tarifa y stock nominal durante 72 horas para tu fecha.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <FileText size={20} />
            </div>
            <h3 className="text-sm font-bold text-white font-syne">Compliance Art. 118 LCSP</h3>
            <p className="text-neutral-400 text-[11px] font-sans font-light">
              Contratos menores para ayuntamientos y comisiones de festejos (&lt; 14.250 €) con factura electrónica.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-black/60 border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Award size={20} />
            </div>
            <h3 className="text-sm font-bold text-white font-syne">Técnico In-Situ</h3>
            <p className="text-neutral-400 text-[11px] font-sans font-light">
              Especialista de sonido y vídeo en la cabina técnica durante toda la duración del show en {profile.poblacionName}.
            </p>
          </div>
        </div>
      </div>
    </section>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // BLOQUE 6: FAQS HIPERLOCALES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const renderFaqs = () => (
    <section key="block-faqs" className="max-w-5xl mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-semibold">
          Respuestas a Dudas Técnicas Frecuentes
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white uppercase font-syne tracking-tight">
          Preguntas Frecuentes sobre el Alquiler en {profile.poblacionName}
        </h2>
      </div>

      <div className="space-y-3 pt-4">
        {profile.faqs.map((faq, index) => {
          const isOpen = openFaq === index;
          return (
            <div 
              key={index}
              className="bg-[#08080c] border border-white/10 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(isOpen ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:text-[#ecb613] transition-colors"
              >
                <span className="font-syne font-bold text-sm sm:text-base text-white">
                  {faq.question}
                </span>
                <ChevronDown 
                  size={18} 
                  className={`text-[#ecb613] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-neutral-300 text-xs sm:text-sm font-light leading-relaxed border-t border-white/5 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RENDERIZADO DETERMINISTA SEGÚN PERMUTACIÓN DE LAYOUT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  const blockRenderers: Record<LayoutBlockId, () => React.ReactNode> = {
    hero: renderHero,
    acoustic: renderAcousticMatcher,
    hardware: renderHardwareGrid,
    logistics: renderLogistics,
    valueStack: renderValueStack,
    faqs: renderFaqs,
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#ecb613] selection:text-black w-full overflow-x-hidden">
      {/* Inyección Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Service',
            serviceType: `Alquiler de Sonido, Pantallas LED e Iluminación en ${profile.poblacionName}`,
            provider: {
              '@type': 'LocalBusiness',
              name: 'Productora EAR',
              telephone: '+34693693048',
              url: profile.canonicalUrl,
              address: {
                '@type': 'PostalAddress',
                addressLocality: profile.poblacionName,
                addressRegion: profile.provinceName,
                addressCountry: 'ES'
              }
            },
            areaServed: {
              '@type': 'AdministrativeArea',
              name: `${profile.poblacionName}, ${profile.provinceName}`
            },
            offers: {
              '@type': 'Offer',
              price: '100.00',
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: profile.canonicalUrl
            }
          })
        }}
      />

      {/* Renderizado de bloques ordenados por la permutación determinista */}
      {profile.layoutOrder.map((blockId) => blockRenderers[blockId]())}

      {/* CTA FLOTANTE INFERIOR */}
      <aside aria-label="Reserva directa de material" className="border-t border-neutral-900 bg-[#050507] py-12 px-4 text-center space-y-4">
        <p className="font-mono text-xs text-neutral-400 uppercase tracking-widest">
          ¿Necesitas asesoramiento técnico para tu evento en {profile.poblacionName}?
        </p>
        <div className="flex flex-wrap justify-center gap-4 font-mono text-xs">
          <Link
            href="/cotizador"
            className="px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-[#ecb613]/90 text-black font-bold uppercase tracking-wider transition-colors"
          >
            Configurar en el Cotizador S-Class
          </Link>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
          >
            <MessageCircle size={14} className="text-[#25D366]" /> Chat con Ingeniero de Sonido
          </a>
        </div>
      </aside>
    </div>
  );
};
