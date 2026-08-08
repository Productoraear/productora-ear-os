'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Shield, Zap, Star, Music, Check, ArrowRight, Heart, Crown, 
  Mic2, Users, ShoppingCart, Trophy, Sparkles, Activity, 
  Download, Globe, Award, Calendar, BookOpen, Volume2, Phone
} from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { CENTRALITA } from '@/lib/phone-constants';
import { ManifestoSection } from './ManifestoSection';
import { TruthNuggets } from '@/features/telemetry/TruthNuggets';
import { ArtistBookingFlow } from '@/app/components/artists/ArtistBookingFlow';

const products = [
  {
    id: 'edwin-solista',
    title: 'Edwin Agudelo - Solista Premium',
    subtitle: 'Cantautor de Gala / Alta Fidelidad',
    price: 1500,
    icon: <Crown size={32} />,
    description: 'La esencia pura del tenor lírico. Un formato versátil de alto impacto sónico con sistemas auto-amplificados Bose, diseñado para recepciones diplomáticas, corporativos selectos e hitos familiares exclusivos.',
    includes: [
      'Show de 60 a 90 minutos de gala',
      'Ingeniería sónica EAR dedicada',
      'Repertorio en Positivo & Tradicional',
      'Protocolo diplomático e institucional'
    ],
    conditions: 'Reserva mínima de 15 días. Desplazamiento bonificado en Comunidad de Madrid.'
  },
  {
    id: 'edwin-mariachi-6',
    title: 'Ensamble de Gala Mariachi (6+)',
    subtitle: 'El Estándar de Oro de la Música Charra',
    price: 2800,
    icon: <Users size={32} />,
    description: 'Formación clásica de gala con trajes bordados a mano, sombreros de charro de alta escuela, violines, trompetas y guitarrón. Sonoridad acústica inigualable de gran impacto emocional.',
    includes: [
      'Mínimo 6 músicos profesionales coordinados',
      'Entrada sorpresa del homenajeado',
      'Ecualización y microfonía inalámbrica profesional',
      'Peticiones ilimitadas del cancionero clásico'
    ],
    conditions: 'Sujeto a disponibilidad. Se aconseja reservar con 30 días de antelación.'
  },
  {
    id: 'edwin-caballo',
    title: 'Show "Cantando a Caballo"',
    subtitle: 'Alta Escuela Ecuestre & Tradición',
    price: 5500,
    icon: <Sparkles size={32} />,
    description: 'Espectáculo ecuestre único en España. Edwin Agudelo fusiona la doma clásica de alta escuela con el mariachi tradicional sobre majestuosos caballos, coordinando música y jinete.',
    includes: [
      'Edwin Agudelo a lomos de caballo de alta escuela',
      'Ensamble de Mariachi de Gala en pista',
      'Seguro de responsabilidad civil ecuestre completo',
      'Logística de transporte especializada de caballos',
      'Protocolo diseñado para plazas y recintos feriales'
    ],
    conditions: 'Requiere validación técnica del terreno, picadero o plaza y permisos locales.'
  },
  {
    id: 'edwin-banda',
    title: 'Banda Monumental EAR',
    subtitle: 'Infraestructura Sónica para Grandes Aforos',
    price: 9500,
    icon: <Zap size={32} />,
    description: 'El despliegue transaccional definitivo. Un ensamble de más de 12 músicos en escena respaldados por ingeniería sónica y lumínica avanzada de Productora EAR. Diseñado para festivales, ferias y licitaciones B2G.',
    includes: [
      'Orquestación masiva (12+ músicos en escena)',
      'Ingeniería acústica de alta gama homologada',
      'Diseño de iluminación inmersiva espectacular',
      'Coordinación directa de protocolo B2G / B2B',
      'Show de 120 minutos en dos pases'
    ],
    conditions: 'Reserva mínima de 60 días. Requiere acometida eléctrica trifásica en recinto.'
  }
];

export const EdwinAgudeloDossier: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'BIO' | 'HITOS' | 'VIMUME'>('BIO');

  return (
    <div className="bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30">
      
      {/* 1. HERO SECTION: ATMOSPHERIC & MAJESTIC */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-[#050505] z-0" />
          {/* Radial glow representing Aura Onyx */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#d4a855]/10 via-transparent to-transparent blur-[120px] opacity-60 animate-pulse" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-block px-6 py-2 rounded-full border border-[#d4a855]/30 bg-[#d4a855]/5 text-[#d4a855] text-[10px] font-black tracking-[0.5em] uppercase mb-4">
              Master Artist & Tenor de Gala
            </span>
            <h1 className="text-6xl md:text-[8rem] font-black italic tracking-tighter uppercase leading-[0.8] mb-6 font-syne">
              Edwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a855] to-white">Agudelo</span>
            </h1>
            <p className="text-xl md:text-2xl font-light text-white/70 max-w-4xl mx-auto leading-relaxed italic">
              "Cuando me enfundo el traje de charro, no solo represento mi nombre; represento un patrimonio de la humanidad, con el respeto, rigor y la grandeza que exige la música tradicional."
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#d4a855]/80 pt-6">
              <span className="border-r border-white/15 pr-6">Amagá, Colombia (1975)</span>
              <span className="border-r border-white/15 pr-6">37 Conciertos Internacionales</span>
              <span className="border-r border-white/15 pr-6">Sello de Calidad VIMUME</span>
              <span>Consulado de Colombia Certificado</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-50">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#d4a855]">Explorar Legado</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-[#d4a855] to-transparent animate-bounce" />
        </div>

        {/* RECOGNITION SEAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-24 right-10 z-[100] hidden lg:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-5 rounded-full border-[#d4a855]/30 bg-[#d4a855]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={28} className="text-[#d4a855] group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-1 rounded-full border border-[#d4a855]/20 animate-ping" />
          </div>
          <div className="flex flex-col items-center text-center">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#d4a855]">Gladiador Extranjero</span>
            <span className="text-[8px] font-black uppercase tracking-[0.1em] text-white/40">Máximo Galardón 2021</span>
          </div>
        </motion.div>
      </section>

      {/* 1.5 CENTRALITA CTA — CLICK-TO-CALL DOMINANT BLOCK */}
      <section className="relative py-8 px-6 bg-gradient-to-b from-[#050505] to-[#080808] border-b border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-stretch gap-4">
            {/* Primary: Call */}
            <a
              href={CENTRALITA.tel}
              className="flex-1 flex items-center justify-center gap-3 bg-[#ecb613] text-black font-black text-base uppercase tracking-wider rounded-2xl py-5 px-8 transition-all hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(236,182,19,0.4)] active:scale-95"
              aria-label={`Llamar al ${CENTRALITA.display}`}
            >
              <Phone size={22} strokeWidth={2.5} />
              <span>Llamar: {CENTRALITA.display}</span>
            </a>

            {/* Secondary: WhatsApp */}
            <a
              href={CENTRALITA.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] font-black text-sm uppercase tracking-wider rounded-2xl py-5 px-8 transition-all hover:bg-[#25D366]/20 active:scale-95"
            >
              <Heart size={18} />
              <span>WhatsApp Directo</span>
            </a>

            {/* Tertiary: Scroll to booking */}
            <a
              href="#booking-funnel"
              className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-white/70 font-black text-sm uppercase tracking-wider rounded-2xl py-5 px-8 transition-all hover:bg-white/10 hover:text-white active:scale-95"
            >
              <Calendar size={18} />
              <span>Reservar Fecha</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. THREE-DIMENSIONAL COGNITIVE BENTO: CHOOSE THE PATH */}
      <section className="py-24 px-6 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
            <div className="space-y-4">
              <span className="text-[#d4a855] text-xs font-black uppercase tracking-[0.3em] block">Soberanía de Contenido</span>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter font-syne">Trayectoria Tridimensional</h2>
            </div>
            
            {/* Tab navigation for attraction marketing */}
            <div className="flex bg-white/5 border border-white/10 rounded-2xl p-1 shrink-0">
              <button
                onClick={() => setActiveTab('BIO')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'BIO' ? 'bg-[#d4a855] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Orígenes y Garra
              </button>
              <button
                onClick={() => setActiveTab('HITOS')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'HITOS' ? 'bg-[#d4a855] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                Hitos y Autoridad
              </button>
              <button
                onClick={() => setActiveTab('VIMUME')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === 'VIMUME' ? 'bg-[#d4a855] text-black font-black' : 'text-white/60 hover:text-white'
                }`}
              >
                VIMUME Neuroacústica
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT DETAILS COLUMN */}
            <div className="lg:col-span-7 space-y-8">
              {activeTab === 'BIO' && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <h3 className="text-3xl font-black uppercase text-[#d4a855] font-syne">De Amagá a la Conquista de España</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Nacido en Amagá, Antioquia, el 28 de octubre de 1975, y criado en la efervescente cuna artística de Medellín, la ranchera corrió por las venas de Edwin Agudelo desde su infancia, cautivado por Vicente Fernández, Javier Solís y Jorge Negrete. 
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    A los 16 años dio sus primeros pasos profesionales como cantante en <strong>"Tropical Mix"</strong>, la prestigiosa cantera del Combo de las Estrellas de Medellín. Sin embargo, a los 22 años, decide emigrar a España buscando forjar su propio destino. 
                  </p>
                  <p className="text-white/60 text-sm leading-relaxed italic border-l-2 border-[#d4a855] pl-6 py-2">
                    "Empezar no es fácil. Trabajé en aluminio, en motos, conduje mi propio taxi, y fui encargado de grandes discotecas en España. Desde allí diseñé y coordiné la producción técnica de 37 grandes conciertos internacionales. Fue en esos escenarios donde comprendí el inmenso poder del mariachi al cantar junto a agrupaciones como Águilas de Plata."
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
                  <h3 className="text-3xl font-black uppercase text-[#d4a855] font-syne font-black">La Respaldo de Grandes Escenarios</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    La carrera de Edwin Agudelo en España está blindada por hitos de autoridad incuestionables. Ha aportado el marco musical y coordinado giras masivas de leyendas de la música:
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Star className="text-[#d4a855]" size={20} />
                      <h4 className="text-sm font-black uppercase">Soporte a Gira de Ana Gabriel</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Aportó la orquestación y el ensamble musical para la gran diva mexicana en <strong>La Cubierta de Leganés (Madrid)</strong> y en la <strong>Plaza de Toros de Valencia</strong>.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Award className="text-[#d4a855]" size={20} />
                      <h4 className="text-sm font-black uppercase">Consulado & Teatro La Latina</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Presentó su primera producción profesional "Mi propia realidad" en el Teatro La Latina ante 1,000+ personas, recibiendo diploma de honor del <strong>Consulado de Colombia</strong>.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Globe className="text-[#d4a855]" size={20} />
                      <h4 className="text-sm font-black uppercase">Fitur & Escenario Global</h4>
                      <p className="text-white/40 text-xs leading-relaxed uppercase">
                        Representación musical en <strong>FITUR Madrid</strong> (2018-2020) y en el 70º Aniversario de Radio Internacional de España como embajador musical.
                      </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-2">
                      <Heart className="text-[#d4a855]" size={20} />
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
                  <h3 className="text-3xl font-black uppercase text-[#d4a855] font-syne">Estimulación Sensorial y Memoria Afectiva</h3>
                  <p className="text-white/70 text-base leading-relaxed">
                    Edwin Agudelo no es solo un artista de gala; es el pilar transaccional de <strong>VIMUME</strong>, la innovadora plataforma de estimulación sensorial y reminiscencia a través de la música para la Silver Economy.
                  </p>
                  <p className="text-white/70 text-base leading-relaxed">
                    Las interpretaciones de Edwin, calibradas acústicamente con frecuencias estimulantes (incluyendo pulsos gamma de 40Hz en los intermedios), son utilizadas en residencias de la España Vaciada (Soria, Teruel, Guadalajara) para promover el envejecimiento activo, estimular la memoria afectiva y fomentar el bienestar general de las personas mayores mediante terapias no farmacológicas.
                  </p>
                  
                  <div className="bg-[#d4a855]/10 border border-[#d4a855]/20 rounded-2xl p-6 flex gap-4 items-start">
                    <Activity className="text-[#d4a855] shrink-0 mt-1" size={24} />
                    <div className="space-y-1">
                      <h4 className="text-xs font-black uppercase text-white tracking-widest">Protocolo de Reminiscencia Musical</h4>
                      <p className="text-[11px] text-white/50 leading-relaxed uppercase font-bold">
                        Un espectáculo estructurado bajo criterios de profesionales clínicos que fusiona el arraigo emocional de las canciones tradicionales con protocolos no farmacológicos de estimulación cognitiva.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* RIGHT VISUAL BENTO CARD */}
            <div className="lg:col-span-5 relative aspect-square">
              <div className="absolute -inset-4 bg-[#d4a855]/10 blur-[90px] opacity-40 rounded-full pointer-events-none" />
              <div className="rounded-[3rem] border border-white/10 relative z-10 bg-white/5 overflow-hidden w-full h-full flex flex-col justify-between p-12 group hover:border-[#d4a855]/40 transition-all duration-700">
                
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4a855] group-hover:scale-110 transition-transform duration-500">
                    <Mic2 size={32} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-[#d4a855] bg-[#d4a855]/10 px-3 py-1.5 rounded-lg border border-[#d4a855]/20">
                    S-Class Authority
                  </span>
                </div>

                <div className="space-y-6">
                  <div className="text-5xl font-black text-white leading-none font-syne uppercase tracking-tighter">
                    El Mariachi <br />
                    <span className="text-[#d4a855]">Más Respetado</span>
                  </div>
                  <p className="text-white/40 text-xs font-bold leading-relaxed uppercase tracking-wider">
                    "Un directo impecable, sonido sin distorsión calibrado en cada recinto, trajes de botonadura de plata y un repertorio de esperanza."
                  </p>
                </div>

                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Garantía Productora EAR</span>
                  <Shield size={18} className="text-[#d4a855]" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. DISCOGRAPHY & PATHWAY IN POSITIVE */}
      <section className="py-32 px-6 relative overflow-hidden bg-black">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
            <span className="text-[#d4a855] text-xs font-black uppercase tracking-[0.5em] block">Soberanía Autoral</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase font-syne">Discografía en Positivo</h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto uppercase font-bold leading-relaxed">
              18 canciones escritas para dar luz y esperanza. Arreglos y producciones profesionales grabadas en los mejores estudios de España.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:border-[#d4a855]/20 transition-all flex flex-col justify-between min-h-[360px]">
              <div className="space-y-6">
                <span className="text-5xl font-black text-white/10 font-mono">01</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Mi Propia Realidad</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">Lanzamiento: Teatro La Latina (7 Oct 2014)</p>
                <p className="text-white/50 text-sm leading-relaxed italic">
                  "Presentada ante mil personas y el cuerpo diplomático de Colombia en Madrid. Mi propia realidad es un testimonio de resiliencia y el punto de partida de la metodología de EAR."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-[#d4a855] uppercase tracking-widest">
                <span>1,000+ Asistentes</span>
                <Volume2 size={16} />
              </div>
            </div>

            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:border-[#d4a855]/20 transition-all flex flex-col justify-between min-h-[360px]">
              <div className="space-y-6">
                <span className="text-5xl font-black text-white/10 font-mono">02</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-white">Algún Día Mamá</h3>
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">Lanzamiento: La Cubierta de Leganés (2016)</p>
                <p className="text-white/50 text-sm leading-relaxed italic">
                  "El emotivo homenaje escrito y dedicado a las madres. Presentado en el gran aforo de la Plaza de Toros de Leganés como parte de la gala anual del día de las madres."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-[#d4a855] uppercase tracking-widest">
                <span>Homenaje Nupcial & Familiar</span>
                <Volume2 size={16} />
              </div>
            </div>

            <div className="glass-panel p-10 rounded-[2.5rem] border-white/5 bg-white/[0.01] hover:border-[#d4a855]/20 transition-all flex flex-col justify-between min-h-[360px]">
              <div className="space-y-6">
                <span className="text-5xl font-black text-[#d4a855]/20 font-mono">03</span>
                <h3 className="text-2xl font-black uppercase tracking-tight text-[#d4a855] flex items-center gap-2">
                  Acompáñame <Sparkles size={16} />
                </h3>
                <p className="text-white/40 text-xs uppercase tracking-widest font-bold font-mono">El Himno S-Class de Esperanza</p>
                <p className="text-white/50 text-sm leading-relaxed italic">
                  "Inspirada en el concierto 'Por Ellas' de Cadena 100 y reescrita en pandemia. Una canción producida por Silvio Ocaña con arreglos del trompetista Over Vásquez y dirección de Ángeles Cepero, dedicada a los héroes esenciales."
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-[#d4a855] uppercase tracking-widest">
                <span>+500K Reproducciones Sociales</span>
                <Volume2 size={16} className="animate-pulse" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. MANIFESTO SECTION */}
      <ManifestoSection />

      {/* 5. PORTFOLIO AND PRICING SCHEMES */}
      <section className="py-32 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-24">
          <div className="text-center space-y-4">
            <span className="text-[#d4a855] text-xs font-black uppercase tracking-[0.5em] block">Catálogo de Servicios y Formaciones</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase font-syne leading-none">
              Formatos y <span className="text-[#d4a855]">Tarifas de Gala</span>
            </h2>
            <p className="text-white/40 text-sm max-w-xl mx-auto uppercase font-bold leading-relaxed">
              Estructura transparente y sin intermediarios. Aseguramos la máxima calidad acústica y logística en cada formato.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {products.map((p) => (
              <div 
                key={p.id} 
                className="glass-panel p-10 rounded-[3rem] border-white/5 bg-white/[0.01] flex flex-col hover:border-[#d4a855]/30 transition-all group justify-between"
              >
                <div className="space-y-8">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4a855] group-hover:scale-110 transition-transform">
                      {p.icon}
                    </div>
                    <span className="text-3xl font-black text-white font-mono">
                      {p.price.toLocaleString('de-DE')}€
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black uppercase tracking-tight">{p.title}</h3>
                    <p className="text-[#d4a855] text-[10px] font-black uppercase tracking-widest">{p.subtitle}</p>
                  </div>

                  <p className="text-white/50 text-xs italic font-medium leading-relaxed">"{p.description}"</p>

                  <div className="space-y-3 pt-6 border-t border-white/5">
                    {p.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Check size={12} className="text-[#d4a855]" /> {inc}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6 pt-8">
                  <div className="bg-white/5 p-4 rounded-xl">
                    <h5 className="text-[8px] font-black uppercase tracking-widest text-white/30 mb-1">Condiciones Logísticas</h5>
                    <p className="text-[9px] text-white/40 font-bold uppercase leading-tight">{p.conditions}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ETHICAL ATTRACTION BOOKING FUNNEL (DEPOSIT MECHANICS) */}
      <section id="booking-funnel" className="py-32 px-6 relative bg-gradient-to-b from-[#050505] to-[#0d0d0d] border-t border-white/5">
        <div className="absolute inset-0 bg-[#d4a855]/5 blur-[200px]" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-8">
            <span className="text-[#d4a855] text-xs font-black uppercase tracking-[0.4em] block">Embudo Ético de Atracción</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] font-syne">
              Reserva tu Fecha <br /> Sin <span className="text-[#d4a855]">Presiones</span>
            </h2>
            <p className="text-white/50 text-base leading-relaxed">
              En Productora EAR no perseguimos clientes ni enviamos correos acosadores. Creemos en la <strong>Soberanía del Cliente</strong> y la excelencia operativa. 
            </p>
            <p className="text-white/50 text-base leading-relaxed">
              Puedes bloquear hoy mismo de forma provisional tu fecha preferente en el calendario de Edwin Agudelo. Para ello, procesamos un depósito de garantía reembolsable de <strong>100€</strong> a través de nuestra pasarela segura integrada con Stripe. 
            </p>
            <p className="text-white/40 text-xs font-bold leading-relaxed uppercase border-l-2 border-[#d4a855] pl-6 py-2">
              Si tras la llamada de coordinación técnica o por falta de viabilidad decides no formalizar, el depósito de 100€ se te reembolsa de forma automática a tu tarjeta en menos de 24 horas. Sin preguntas ni trabas.
            </p>
          </div>

          <div className="lg:col-span-6">
            <ArtistBookingFlow city="Madrid / España" eventType="Mariachi de Gala" />
          </div>

        </div>
      </section>

      {/* 7. COMPLIANCE & PROOF OF QUALITY */}
      <section className="py-24 px-8 border-t border-white/5 bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Shield className="text-[#d4a855] mx-auto mb-6" size={36} />
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Ecosistema Auditado</span>
            <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter uppercase font-syne">Evidencia Operativa Certificada</h2>
          </div>
          <TruthNuggets />
        </div>
      </section>

    </div>
  );
};
