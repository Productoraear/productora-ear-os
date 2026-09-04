"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Star, Music, Check, ArrowRight, Heart, Crown, 
  Mic2, Users, ShoppingCart, Trophy, Sparkles, Activity, 
  Download, Globe, Award, Calendar, BookOpen, Volume2, Phone, Mail
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CENTRALITA } from '@/lib/phone-constants';
import { ManifestoSection } from './ManifestoSection';
import { TruthNuggets } from '@/features/telemetry/TruthNuggets';
import { ArtistBookingFlow } from '@/app/components/artists/ArtistBookingFlow';
import { EdwinLegacyPlayer } from './EdwinLegacyPlayer';
import { EdwinVaultGalleryGrid } from './EdwinVaultGalleryGrid';
import { EdwinServicesGrid } from './EdwinServicesGrid';
import { EdwinPressAndMetrics } from './EdwinPressAndMetrics';
import { EdwinMariachiCulture } from './EdwinMariachiCulture';
import { EdwinCouponBanner } from './EdwinCouponBanner';

export const EdwinArtistVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BIO' | 'HITOS' | 'VIMUME'>('BIO');

  return (
    <div className="bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30 font-sans">
      
      {/* 1. HERO SECTION: ATMOSPHERIC & MAJESTIC S-CLASS */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-28 pb-16">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-[#050505] z-10" />
          <div className="absolute inset-0 bg-[#050505] z-0" />
          {/* Resplandor radial Oro Imperial */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#ecb613]/10 via-transparent to-transparent blur-[140px] opacity-70 animate-pulse" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black tracking-[0.5em] uppercase mb-2 font-mono">
              <Crown size={14} /> Master Artist & Tenor de Gala
            </div>
            
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-[0.85] mb-6 font-syne">
              Edwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">Agudelo</span>
            </h1>
            
            <p className="text-lg md:text-2xl font-light text-white/80 max-w-4xl mx-auto leading-relaxed italic">
              "Cuando me enfundo el traje de charro, no solo represento mi nombre; represento un patrimonio de la humanidad, con el respeto, rigor y la grandeza que exige la música tradicional."
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#ecb613]/90 pt-4 font-mono">
              <span className="border-r border-white/15 pr-6">Origen: Cátedra del Escenario</span>
              <span className="border-r border-white/15 pr-6">37 Conciertos Internacionales</span>
              <span className="border-r border-white/15 pr-6">Gladiador Extranjero 2021</span>
              <span>Consulado de Colombia Certificado</span>
            </div>
          </motion.div>
        </div>

        {/* RECOGNITION SEAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-28 right-8 z-[50] hidden xl:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-5 rounded-full border-[#ecb613]/30 bg-[#ecb613]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={28} className="text-[#ecb613] group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-1 rounded-full border border-[#ecb613]/20 animate-ping" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#ecb613]">Gladiador Extranjero</span>
            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/40">Máximo Galardón 2021</span>
          </div>
        </motion.div>
      </section>

      {/* 2. CENTRALITA DIRECTA & CONTACTO OFICIAL */}
      <section className="relative py-6 px-6 bg-[#08080c] border-y border-white/5">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Phone size={22} />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#ecb613] block">
                Centralita de Contratación Directa
              </span>
              <span className="text-lg font-black text-white font-mono">
                {CENTRALITA.display} • hola@productoraear.com
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <a
              href={CENTRALITA.tel}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-[#ecb613] text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform flex items-center justify-center gap-2"
            >
              <Phone size={16} />
              <span>Llamar Ahora</span>
            </a>
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-xl bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-xs uppercase tracking-wider hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
            >
              <Heart size={16} />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 3. BÓVEDA MULTIMEDIA: REPRODUCTOR DUAL S-CLASS & GALERÍA DE 6 CAPAS */}
      <section id="legacy-player-section" className="py-20 px-6 max-w-7xl mx-auto space-y-20">
        <EdwinLegacyPlayer />
        <EdwinVaultGalleryGrid />
      </section>

      {/* 4. TRAYECTORIA TRIDIMENSIONAL & HITOS */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-3">
              <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.3em] block font-mono">Soberanía de Contenido</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">Trayectoria Tridimensional</h2>
            </div>
            
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setActiveTab('BIO')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'BIO' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Orígenes y Garra
              </button>
              <button
                onClick={() => setActiveTab('HITOS')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'HITOS' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Hitos y Autoridad
              </button>
              <button
                onClick={() => setActiveTab('VIMUME')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'VIMUME' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                VIMUME Neuroacústica
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8">
              {activeTab === 'BIO' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">La Forja del Artista Soberano</h3>
                  <p className="text-white/80 leading-relaxed text-sm">
                    La maestría escénica corrió por las venas de Edwin Agudelo desde sus inicios. Impulsado por la fuerza de los clásicos, comprendió rápidamente que el verdadero arte requería una estructura técnica infranqueable.
                    Dio sus primeros pasos profesionales como cantante en agrupaciones de alto rendimiento. Con la visión clara de forjar su propio destino, cruzó el Atlántico para elevar el estándar de producción.
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#ecb613] pl-6 py-2">
                    "Empezar no es fácil. Desde la trinchera del escenario diseñé y coordiné la producción técnica de 37 grandes conciertos internacionales. Fue en esos escenarios donde comprendí el inmenso poder del mariachi al cantar junto a agrupaciones de primer nivel."
                  </p>
                </motion.div>
              )}

              {activeTab === 'HITOS' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">El Respaldo de Grandes Escenarios</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    La carrera de Edwin Agudelo en España está blindada por hitos de autoridad incuestionables. Ha aportado el marco musical y coordinado giras masivas de leyendas de la música:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Star className="text-[#ecb613]" size={20} />
                      <h4 className="text-sm font-black uppercase">Soporte en Grandes Giras Internacionales</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Aportó la orquestación y el ensamble musical para la gran diva mexicana en <strong>La Cubierta de Leganés (Madrid)</strong> y en la <strong>Plaza de Toros de Valencia</strong>.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Award className="text-[#ecb613]" size={20} />
                      <h4 className="text-sm font-black uppercase">Consulado & Teatro La Latina</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Presentó su primera producción profesional "Mi propia realidad" en el Teatro La Latina ante 1,000+ personas, recibiendo diploma de honor del <strong>Consulado de Colombia</strong>.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Globe className="text-[#ecb613]" size={20} />
                      <h4 className="text-sm font-black uppercase">Fitur & Escenario Global</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Representación musical en <strong>FITUR Madrid</strong> (2018-2020) y en el 70º Aniversario de Radio Internacional de España como embajador musical.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Heart className="text-[#ecb613]" size={20} />
                      <h4 className="text-sm font-black uppercase">Premios y Galardones</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Ganador de los premios "Más Latinos" y el máximo honor de la gala <strong>Gladiadores en el extranjero</strong> (2021) en la capital española.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'VIMUME' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">Estimulación Sensorial y Memoria Afectiva</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Edwin Agudelo es el pilar transaccional y humano de <strong>VIMUME</strong>, la innovadora plataforma de estimulación sensorial y reminiscencia a través de la música tradicional para la Silver Economy.
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    Las interpretaciones de Edwin, calibradas acústicamente con frecuencias estimulantes, son utilizadas en centros de día y residencias para promover el envejecimiento activo, estimular la memoria afectiva y fomentar el bienestar integral mediante terapias no farmacológicas.
                  </p>
                </motion.div>
              )}
            </div>

            <div className="lg:col-span-5 relative aspect-square">
              <div className="absolute -inset-4 bg-[#ecb613]/10 blur-[90px] opacity-40 rounded-full pointer-events-none" />
              <div className="rounded-[3rem] border border-white/10 relative z-10 bg-white/5 overflow-hidden w-full h-full flex flex-col justify-between p-0 group hover:border-[#ecb613]/40 transition-all duration-700">
                <div className="absolute inset-0 z-0">
                  <Image 
                    src="/images/mariachi.png" 
                    alt="Edwin Agudelo vestido de Charro de Gala" 
                    fill
                    className="object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />
                </div>
                
                <div className="relative z-20 p-10 flex flex-col justify-between h-full">
                  <div className="flex justify-between items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#ecb613] flex items-center justify-center text-black font-black">
                      <Mic2 size={24} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#ecb613] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#ecb613]/20">
                      S-Class Elite
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-4xl font-black text-white leading-none font-syne uppercase tracking-tighter drop-shadow-lg">
                      Edwin Agudelo <br />
                      <span className="text-[#ecb613]">Cantautor Charro</span>
                    </div>
                    <p className="text-white/90 text-xs font-bold leading-relaxed uppercase tracking-wider drop-shadow-md">
                      "Tenor lírico con botonadura de plata y un repertorio de esperanza."
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80 drop-shadow-lg">Garantía Productora EAR</span>
                    <Shield size={18} className="text-[#ecb613]" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. LOS 6 SERVICIOS HISTÓRICOS & PROPUESTA DE VALOR */}
      <EdwinServicesGrid />

      {/* 6. BONO DE 150€ EN COMPLEMENTOS */}
      <EdwinCouponBanner />

      {/* 7. PRENSA, RECONOCIMIENTOS Y MÉTRICAS DE SATISFACCIÓN */}
      <EdwinPressAndMetrics />

      {/* 8. EL MUNDO DEL MARIACHI (DIVULGACIÓN CULTURAL) */}
      <EdwinMariachiCulture />

      {/* 9. MANIFIESTO ÉTICO */}
      <ManifestoSection />

      {/* 10. EMBUDO DE RESERVA ÉTICO */}
      <section id="booking-funnel" className="py-32 px-6 relative bg-gradient-to-b from-[#050505] to-[#0d0d0d] border-t border-white/5">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <span className="text-[#ecb613] text-xs font-black uppercase tracking-[0.4em] block font-mono">Embudo Ético de Atracción</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] font-syne">
              Reserva tu Fecha <br /> Sin <span className="text-[#ecb613]">Presiones</span>
            </h2>
            <p className="text-white/60 text-base leading-relaxed">
              En Productora EAR creemos en la <strong>Soberanía del Cliente</strong> y la excelencia operativa. Bloquea tu fecha preferente en el calendario de Edwin Agudelo con un depósito de garantía reembolsable de <strong>100€</strong> procesado vía Stripe Live.
            </p>
            <p className="text-white/40 text-xs font-bold leading-relaxed uppercase border-l-2 border-[#ecb613] pl-6 py-2">
              Si tras la llamada técnica decides no formalizar, el depósito de 100€ se te reembolsa de forma 100% automática a tu tarjeta en menos de 24 horas. Sin preguntas ni trabas.
            </p>
          </div>

          <div className="lg:col-span-6">
            <ArtistBookingFlow city="Madrid / España" eventType="Mariachi de Gala" />
          </div>

        </div>
      </section>

      {/* 11. EVIDENCIA OPERATIVA & CERTIFICACIÓN */}
      <section className="py-24 px-8 border-t border-white/5 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Shield className="text-[#ecb613] mx-auto mb-6" size={36} />
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block font-mono">Ecosistema Auditado</span>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-syne">Evidencia Operativa Certificada</h2>
          </div>
          <TruthNuggets />
        </div>
      </section>

    </div>
  );
};
