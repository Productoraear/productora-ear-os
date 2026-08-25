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
import { EdwinEcosystemHero } from './EdwinEcosystemHero';

export const EdwinArtistVault: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BIO' | 'EL_SILENCIO' | 'HITOS' | 'VIMUME'>('BIO');

  return (
    <div className="bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30 font-sans">
      
      {/* 1. ECOSYSTEM S-CLASS HERO: EDWIN AGUDELO */}
      <EdwinEcosystemHero />

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
            
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0 overflow-x-auto max-w-full">
              <button
                onClick={() => setActiveTab('BIO')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'BIO' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Orígenes y Garra
              </button>
              <button
                onClick={() => setActiveTab('EL_SILENCIO')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'EL_SILENCIO' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                El Silencio Justificado
              </button>
              <button
                onClick={() => setActiveTab('HITOS')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'HITOS' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Hitos y Autoridad
              </button>
              <button
                onClick={() => setActiveTab('VIMUME')}
                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeTab === 'VIMUME' ? 'bg-[#ecb613] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                VIMUME Neuroacústica
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-8 min-h-[350px]">
              {activeTab === 'BIO' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">De Amagá a la Conquista de España</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Nacido en Amagá, Antioquia, el 28 de octubre de 1975, y criado en la efervescente cuna artística de Medellín, la ranchera corrió por las venas de Edwin Agudelo desde su infancia, cautivado por Vicente Fernández, Javier Solís y Jorge Negrete. 
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    A los 16 años dio sus primeros pasos profesionales como cantante en <strong>"Tropical Mix"</strong>, la prestigiosa cantera del Combo de las Estrellas de Medellín. Sin embargo, a los 22 años, decide emigrar a España buscando forjar su propio destino. 
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#ecb613] pl-6 py-2">
                    "Empezar no es fácil. Trabajé en aluminio, en motos, conduje mi propio taxi, y fui encargado de grandes discotecas en España. Desde allí diseñé y coordiné la producción técnica de 37 grandes conciertos internacionales. Fue en esos escenarios donde comprendí el inmenso poder del mariachi al cantar junto a agrupaciones como Águilas de Plata."
                  </p>
                </motion.div>
              )}

              {activeTab === 'EL_SILENCIO' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">¿Por qué he estado callado 2 años?</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Un artista no debe ser solo una voz; debe ser el arquitecto de su propia comunidad. Después de décadas en los escenarios, sentí que la música debía trascender el aplauso fugaz. Durante más de 2 años no hubo redes sociales, ni lanzamientos estridentes. 
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    <strong>No estaba descansando. Estaba construyendo.</strong>
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    Codifiqué desde cero <strong>EAR OS</strong>, una infraestructura soberana para proteger el valor de mi arte sin depender de intermediarios. Paralelamente, desarrollé <strong>VIMUME</strong> (Viaje Musical por la Memoria), un protocolo neuroacústico para llevar dignidad y estimulación a las personas mayores en residencias.
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#ecb613] pl-6 py-2">
                    "Mi silencio fue estratégico. Ser parte de mi comunidad hoy significa apoyar a un cantautor-empresario que no compite por precio, sino que utiliza el 10% de cada reserva para financiar musicoterapia para quienes han olvidado todo, menos la música de su juventud. Esto es arte con propósito real."
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
                      <h4 className="text-sm font-black uppercase">Soporte a Gira de Ana Gabriel</h4>
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
                  <h3 className="text-3xl font-black uppercase text-[#ecb613] font-syne">Ciencia y Legado: Viaje Musical por la Memoria</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Como CEO y arquitecto de <strong>VIMUME</strong>, he transformado la música tradicional en una herramienta terapéutica de alto impacto para luchar contra la soledad no deseada en la Silver Economy.
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    Mis interpretaciones están calibradas neuroacústicamente por debajo de 75 dB para proteger a nuestros mayores. Trabajamos en alianza con la <strong>Academia</strong> (estudiantes de Musicoterapia, Gerontología y Terapia Ocupacional) y bajo la estricta validación de médicos y familiares para recopilar métricas clínicas frente al Alzheimer.
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#ecb613] pl-6 py-2">
                    "Este proyecto trasciende mi propia voz. Con miras a escalar hacia el IMSERSO y Fondos Europeos, al contratar mi espectáculo de gala, el 10% del beneficio se destina automáticamente a financiar musicoterapia para quienes sostienen nuestra historia. Tú celebras; ellos recuerdan."
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
