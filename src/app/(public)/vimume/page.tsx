"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Shield, Activity, Users, Star, ArrowRight, 
  Music, Zap, Brain, Anchor, Radio, Volume2, 
  CheckCircle2, ChevronRight, BarChart3, Lock, Sun,
  Diamond, Target, Calendar, Play, Video, Smartphone,
  FileText, Code, Database, Palette, Search, Quote
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSharedContext } from '@/app/context/SharedContext';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import Link from 'next/link';

export default function VimumePage() {
  const [activeTab, setActiveTab] = useState('Proyecto');

  const tabs = [
    'Proyecto', 'CÓDIGO ÉTICO', 'Estrategia', 'INVERSIÓN (Funding)', 'Campañas', 'Cronograma'
  ];

  return (
    <main className="bg-[#050505] min-h-screen text-white font-inter selection:bg-[#ecb613]/30">
      <PredatorNav />
      {/* 🏛️ HERO SECTION - BUQUE INSIGNIA */}
      <section className="relative h-[80vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60 z-10" />
          <img 
            src="/images/vimume/hero_bg.png" 
            alt="Majestic Theater" 
            className="w-full h-full object-cover grayscale-[0.3] brightness-75 scale-105"
          />
        </div>

        <div className="relative z-20 max-w-5xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-400 text-[10px] font-black tracking-[0.3em] uppercase mb-8 backdrop-blur-md"
          >
            <Heart size={12} fill="currentColor" /> PROYECTO BUQUE INSIGNIA
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-6xl md:text-8xl font-serif font-bold tracking-tight mb-8 leading-[0.9]"
          >
            VIAJE MUSICAL <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-white/70">
              POR LA MEMORIA
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/60 text-lg md:text-xl max-w-3xl mx-auto font-light leading-relaxed"
          >
            Reconectando vidas a través de la música. Una iniciativa terapéutica para devolver la identidad y la emoción a nuestros mayores.
          </motion.p>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/20"
        >
          <ArrowRight className="rotate-90" size={24} />
        </motion.div>
      </section>

      {/* 🛰️ NAVIGATION TABS */}
      <section className="sticky top-0 z-50 bg-[#050505]/80 backdrop-blur-3xl border-b border-white/5 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-2 md:gap-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2.5 rounded-full text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap",
                activeTab === tab 
                  ? "bg-pink-600 text-white shadow-[0_0_20px_rgba(219,39,119,0.4)]" 
                  : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      <AnimatePresence mode="wait">
        {activeTab === 'Proyecto' && (
          <motion.div
            key="proyecto"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-0"
          >
            {/* 🧠 SECTION: EL PODER DE LA REMINISCENCIA */}
            <section id="ciencia" className="py-32 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-10">
                  <div className="p-4 bg-pink-600/10 border border-pink-500/20 rounded-2xl inline-block">
                    <Brain className="text-pink-500" size={32} />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-serif font-bold tracking-tight uppercase">
                    EL PODER DE LA <br />
                    <span className="text-pink-500">REMINISCENCIA</span>
                  </h2>
                  <p className="text-white/50 text-lg leading-relaxed font-light italic">
                    Utilizamos la música como llave maestra para acceder a recuerdos que parecían perdidos. Nuestro enfoque científico y humano busca mejorar la calidad de vida de personas con Alzheimer y demencia, reduciendo la ansiedad y fomentando la conexión con sus seres queridos.
                  </p>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                      <h3 className="text-4xl font-black mb-2">150+</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Familias Impactadas</p>
                    </div>
                    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center">
                      <h3 className="text-4xl font-black mb-2">90%</h3>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Mejora Emocional</p>
                    </div>
                  </div>
                </div>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-pink-600/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                    <img src="/images/vimume/hands.png" alt="Healing touch" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute bottom-10 left-10 right-10 p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl text-center">
                      <p className="text-white/90 text-lg font-serif italic">"La música es lo último que se olvida."</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ⚓ SECTION: PATRIMONIO SONORO VITAL */}
            <section id="fondos" className="py-32 px-6 bg-gradient-to-b from-transparent to-pink-900/5">
              <div className="max-w-7xl mx-auto text-center mb-24 space-y-6">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-[0.5em]">Especialización Cultural</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter uppercase">
                  PATRIMONIO SONORO <span className="text-[#ecb613]">VITAL</span>
                </h2>
                <p className="text-white/40 text-lg max-w-3xl mx-auto font-light leading-relaxed">
                  Rechazamos las playlists genéricas. Para la generación que construyó este país, una Copla no es entretenimiento; es un <span className="text-white font-medium">ancla emocional</span> a su identidad antes del olvido.
                </p>
              </div>
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                <VerticalCard 
                  icon={<Anchor size={20} />}
                  title="La Copla & Posguerra"
                  tag="PILAR DE RESILIENCIA"
                  description="Música de supervivencia. Conectamos con emociones de fortaleza y superación. Reactivamos la dignidad y la 'raíz' del paciente."
                />
                <VerticalCard 
                  icon={<Zap size={20} />}
                  title="El Ye-yé & Apertura"
                  tag="PILAR DE VITALIDAD"
                  description="Alegría y activación motora. La herramienta para cambiar el estado de ánimo de pasivo a activo. Nadie puede estar triste escuchando 'Tómbola'."
                />
                <VerticalCard 
                  icon={<Users size={20} />}
                  title="Verbena & Folclore"
                  tag="PILAR DE COMUNIDAD"
                  description="Pasodobles y Zarzuelas. Sonidos que significan 'familia'. Un himno colectivo que combate el aislamiento y une a la sala."
                />
              </div>
            </section>

            {/* 🎯 SECTION: MAPA DE TIRO */}
            <section id="casos" className="py-32 px-6 max-w-7xl mx-auto space-y-20">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                  <Target size={24} />
                </div>
                <h2 className="text-4xl font-serif font-bold uppercase tracking-tight">MAPA DE TIRO: <span className="text-green-500">LOS 3 VERTICALES</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <VerticalTargetCard 
                  icon={<Anchor className="text-green-500" />}
                  title="Longevidad Digna"
                  sector="BANCA & SEGUROS"
                  hook="Eficiencia sociosanitaria."
                  description="Nuestra arquitectura reduce la ansiedad en centros y mejora la calidad de vida sin fármacos."
                  targets="Fundación 'la Caixa', Mapfre, BBVA."
                />
                <VerticalTargetCard 
                  icon={<Database className="text-blue-500" />}
                  title="Conexión Humana"
                  sector="TECH & TELCO"
                  hook="Reconexión real."
                  description="En un mundo hiperconectado, nuestros mayores están aislados. Usamos tecnología de audio para reconectar neuronas."
                  targets="Fundación Telefónica, Vodafone."
                />
                <VerticalTargetCard 
                  icon={<Activity className="text-pink-500" />}
                  title="Terapia Complementaria"
                  sector="SANITARIA"
                  hook="Humanización de marca."
                  description="Somos el complemento emocional a su tratamiento clínico. Ustedes cuidan el cuerpo; nosotros la identidad."
                  targets="Cinfa, Sanitas, Laboratorios."
                />
              </div>
            </section>

            {/* ⚓ SECTION: EL LINCHPIN DEL FUNDADOR */}
            <section className="py-32 px-6 max-w-5xl mx-auto">
              <div className="p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-20 opacity-[0.03] pointer-events-none">
                  <Star size={200} />
                </div>
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                  <Link href="/artistas/edwin-agudelo" className="md:col-span-4 text-center space-y-4 group cursor-pointer">
                    <div className="w-32 h-32 mx-auto rounded-full border-2 border-[#ecb613] p-1 group-hover:scale-110 transition-transform duration-500">
                      <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" alt="Edwin Agudelo" className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold group-hover:text-[#ecb613] transition-colors">El Master Interpreter</h4>
                      <p className="text-[10px] font-black text-[#ecb613] uppercase tracking-widest">Edwin Agudelo</p>
                      <span className="text-[8px] text-white/30 uppercase tracking-widest block mt-2">Ver Dossier de Autoridad</span>
                    </div>
                  </Link>
                  <div className="md:col-span-8 space-y-8">
                    <h3 className="text-2xl font-serif font-bold uppercase">¿Por qué confiar sin métricas históricas?</h3>
                    <ul className="space-y-6">
                      <FounderReason 
                        icon={<Shield size={16} className="text-[#ecb613]" />}
                        title="Foso Moral (Honestidad Radical)"
                        text="No tenemos la burocracia de las grandes ONGs. Cada euro va directo a la intervención. Somos la fuerza de ataque rápido contra la soledad."
                      />
                      <FounderReason 
                        icon={<Anchor size={16} className="text-[#ecb613]" />}
                        title="Autoridad Artística"
                        text="He emocionado a auditorios de miles; ahora uso esa capacidad técnica de élite para emocionar a quien más lo necesita. Es una transferencia de competencia."
                      />
                      <FounderReason 
                        icon={<Activity size={16} className="text-[#ecb613]" />}
                        title="Metodología, no Evento"
                        text="No hacemos 'conciertos'. Aplicamos el protocolo Vimume (Diagnóstico, Intervención, Evaluación). Un sistema escalable y medible."
                      />
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'CÓDIGO ÉTICO' && (
          <motion.div
            key="etico"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-32 px-6 max-w-7xl mx-auto space-y-32"
          >
            <div className="text-center space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-black tracking-widest uppercase bg-[#ecb613]/5">
                <Shield size={14} /> MANIFIESTO DE VERDAD
              </div>
              <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight">EL PACTO DE CUIDADO</h2>
              <p className="text-white/50 text-xl md:text-2xl max-w-4xl mx-auto font-light leading-relaxed italic">
                En un sector lleno de buenas intenciones pero a veces falto de rigor, nosotros operamos bajo un protocolo de Humanidad Radical. <span className="text-white font-medium">No gestionamos "pacientes"; honramos historias de vida.</span>
              </p>
            </div>

            <div className="space-y-16">
              <h3 className="text-3xl font-serif font-bold flex items-center gap-4 uppercase tracking-tight">
                <Users className="text-pink-500" /> 1. El Ecosistema de Respeto
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <EthicCard 
                  title="Dignidad Absoluta"
                  subtitle="LOS PARTICIPANTES"
                  icon={<Heart className="text-pink-500" size={20} />}
                  description="Rechazamos el lenguaje infantilizador. Nos dirigimos a ellos con el respeto jerárquico que merecen sus años hasta que la confianza permita cercanía."
                  quote="No son sujetos de terapia; son los guías de su propio viaje."
                  color="pink"
                />
                <EthicCard 
                  title="Transparencia Emocional"
                  subtitle="FAMILIAS & CUIDADORES"
                  icon={<Users className="text-blue-500" size={20} />}
                  description="Sabemos que necesitáis certeza, no solo esperanza. Ofrecemos canales directos para actualizaciones reales, no automatizadas."
                  quote="No endulzamos la realidad, la acompañamos."
                  color="blue"
                />
                <EthicCard 
                  title="Rigor Científico"
                  subtitle="ALIADOS CLÍNICOS"
                  icon={<Activity className="text-green-500" size={20} />}
                  description="No competimos con la medicina; nos integramos en ella. Entregamos informes basados en evidencia y coordinamos nuestra intervención."
                  quote="Musicoterapia no es entretenimiento. Es clínica."
                  color="green"
                />
                <EthicCard 
                  title="Rendición de Cuentas"
                  subtitle="SOCIOS DE IMPACTO"
                  icon={<BarChart3 className="text-[#ecb613]" size={20} />}
                  description="Si algo no funciona, lo decimos. Si algo funciona, lo probamos con datos. El uso de los fondos es sagrado."
                  quote="Resultados medibles. Cero humo."
                  color="gold"
                />
              </div>
            </div>

            <div className="space-y-16">
              <h3 className="text-3xl font-serif font-bold flex items-center gap-4 uppercase tracking-tight">
                <Zap className="text-[#ecb613]" /> 2. Nuestra "Tecnología" de Comunicación
              </h3>
              <div className="space-y-4">
                <CommunicationItem 
                  title="Adaptación Sensorial Radical"
                  icon={<Volume2 className="text-pink-500" size={20} />}
                  description="No gritamos; articulamos. Controlamos el entorno para eliminar el ruido de fondo que aísla. Cuidamos la iluminación para que la lectura de labios y las señales visuales sean claras para quienes han perdido audición."
                />
                <CommunicationItem 
                  title="Arquitectura Cognitiva"
                  icon={<Brain className="text-blue-500" size={20} />}
                  description="Diseñamos sesiones que respetan los ritmos de procesamiento. No saturamos; seleccionamos estímulos que disparan la red neuronal de la memoria a largo plazo."
                />
                <CommunicationItem 
                  title="El Poder de lo No Verbal"
                  icon={<Activity className="text-[#ecb613]" size={20} />}
                  description="Donde las palabras fallan, el tacto y el contacto visual lideran. Nuestro personal está formado en psicología de la comunicación gestual para personas con deterioro cognitivo."
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'INVERSIÓN (Funding)' && (
          <motion.div
            key="inversion"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-32 px-6 max-w-7xl mx-auto space-y-32"
          >
             <div className="text-center space-y-8">
              <span className="text-[#ecb613] text-[10px] font-black tracking-[0.5em] uppercase">Filosofía de Financiación</span>
              <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tight uppercase leading-[0.9]">
                DE LA CARIDAD A LA <br />
                <span className="text-[#ecb613]">INVERSIÓN EN LEGADO</span>
              </h2>
              <p className="text-white/50 text-xl max-w-3xl mx-auto font-light leading-relaxed">
                No buscamos donaciones para sobrevivir. Buscamos Socios Fundadores que quieran asociar su marca a la innovación en la <span className="text-white font-medium">"Silver Economy"</span> y la <span className="text-white font-medium">Restauración Cognitiva</span>.
              </p>
            </div>

            <div className="relative p-16 bg-white/[0.02] border border-white/5 rounded-[4rem] overflow-hidden group">
              <div className="absolute top-10 left-10 flex items-center gap-3 px-4 py-1.5 rounded-full bg-pink-600/20 border border-pink-500/30 text-pink-500 text-[8px] font-black uppercase tracking-widest">
                 <div className="w-1.5 h-1.5 bg-pink-500 rounded-full animate-pulse" /> EL PITCH DE 50 PALABRAS
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-10">
                <div className="lg:col-span-8">
                  <blockquote className="text-2xl md:text-4xl font-serif font-bold italic leading-tight text-white border-l-4 border-[#ecb613] pl-10">
                    "EL ALZHEIMER BORRA QUIÉN ERES. PERO LA MÚSICA SE ALOJA EN UNA PARTE DEL CEREBRO QUE LA ENFERMEDAD NO TOCA. NOSOTROS USAMOS ESA 'PUERTA TRASERA' NEUROLÓGICA PARA QUE ANTONIO, QUE NO RECUERDA A SU HIJA, VUELVA A CANTARLE LA NANA DE SU INFANCIA. <span className="text-[#ecb613]">RECUPERAMOS A LA PERSONA, NOTA A NOTA.</span>"
                  </blockquote>
                </div>
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-[#ecb613] shadow-[0_0_50px_rgba(236,182,19,0.1)] group-hover:scale-110 transition-transform">
                    <Sun size={40} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Efecto Visualización Inmediata</p>
                </div>
              </div>
            </div>

            <div className="space-y-16">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#ecb613]/10 rounded-xl text-[#ecb613]">
                  <Diamond size={24} />
                </div>
                <h2 className="text-4xl font-serif font-bold uppercase tracking-tight">PRODUCTOS DE <span className="text-[#ecb613]">PATROCINIO (LEGADO)</span></h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <PatrocinioCard 
                  title="ADOPTA UN CENTRO"
                  subtitle="NIVEL 1"
                  price="3.000€ - 5.000€"
                  features={[
                    "Intervención completa (3 meses) en una residencia.",
                    "Reporte de Impacto Emocional (Video + Datos).",
                    "Visita corporativa de voluntariado."
                  ]}
                  cta="SOLICITAR DOSSIER"
                  color="pink"
                />
                <PatrocinioCard 
                  title="ARQUITECTO DE MEMORIA"
                  subtitle="EXCLUSIVO"
                  price="Partner Único"
                  features={[
                    "Apadrinamiento total del lanzamiento Fase Piloto.",
                    "Branding exclusivo en toda la comunicación.",
                    "Documental dedicado a la marca."
                  ]}
                  cta="AGENDAR REUNIÓN"
                  color="gold"
                  highlight
                />
                <PatrocinioCard 
                  title="SOCIO TECNOLÓGICO"
                  subtitle="EN ESPECIE"
                  price="Equipamiento"
                  features={[
                    "Donación de auriculares (JBL/Shure) o Tablets.",
                    "'Powered by [Tu Marca]' en cada sesión.",
                    "Contenido para RRSS de la marca."
                  ]}
                  cta="OFRECER TECNOLOGÍA"
                  color="blue"
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'Campañas' && (
          <motion.div
            key="campanas"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-32 px-6 max-w-7xl mx-auto space-y-20"
          >
            <div className="text-center space-y-4">
              <h2 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tighter">Narrativas de <span className="text-pink-500">Impacto</span></h2>
              <p className="text-white/40 text-lg font-light uppercase tracking-widest">Despliegue mediático para la concienciación social.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <CampaignCard 
                label="EN PRODUCCIÓN"
                title='GUION 7: "LA AUSENCIA DEL ABUELO"'
                description="Cortometraje narrativo que explora el vacío silencioso en una cena familiar y cómo una vieja canción de radio trae de vuelta, por un instante, al patriarca."
                icon={<FileText size={40} className="text-white/10" />}
                tags={['Narrativa Emocional', 'Legado']}
                color="gold"
              />
              <CampaignCard 
                label="SERIE DOCUMENTAL"
                title='"ECOS DE VIDA"'
                description="Testimonios reales de cuidadores y musicoterapeutas. Un vistazo crudo y esperanzador a las sesiones de terapia."
                icon={<Video size={40} className="text-white/10" />}
                cta="Ver Teaser"
                color="blue"
              />
              <CampaignCard 
                label="CAMPAÑA VISUAL"
                title="HISTORIAS DE LEGADO"
                description="Cápsulas de video de 1 minuto para Reels/TikTok celebrando las contribuciones vitales de nuestros mayores a la sociedad."
                icon={<Heart size={40} className="text-white/10" />}
                progress={45}
                progressLabel="Lanzamiento: Noviembre"
                color="pink"
              />
            </div>
          </motion.div>
        )}

        {activeTab === 'Cronograma' && (
          <motion.div
            key="cronograma"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="py-32 px-6 max-w-5xl mx-auto space-y-20"
          >
            <div className="text-center space-y-8">
              <div className="p-4 bg-[#ecb613]/10 border border-[#ecb613]/20 rounded-full w-fit mx-auto text-[#ecb613]">
                <Calendar size={32} />
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold uppercase tracking-tight">CRONOGRAMA DE EJECUCIÓN: <span className="text-pink-500">VIMUME</span></h2>
              <p className="text-white/40 text-lg max-w-2xl mx-auto font-light">Planificación estratégica de 3 meses para el lanzamiento del proyecto "Viaje Musical por la Memoria".</p>
            </div>
            <div className="relative space-y-12">
              <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-white/5" />
              <TimelineItem 
                month="MES 1"
                title="Desarrollo & Contenido"
                icon={<Code size={20} />}
                color="blue"
                items={[
                  { label: "Plataforma Web", text: "Arquitectura, diseño UX/UI y desarrollo funcional." },
                  { label: "Contenido Semilla", text: "Producción de los primeros videos testimoniales y guías." },
                  { label: "Base de Datos", text: "Estructuración de perfiles para centros y terapeutas." },
                  { label: "Identidad Visual", text: "Finalización de branding para redes sociales." }
                ]}
              />
              <TimelineItem 
                month="MES 2"
                title="Testeo & Feedback"
                icon={<Users size={20} />}
                color="pink"
                items={[
                  { label: "Beta Testing", text: "Prueba piloto con 3 centros seleccionados." },
                  { label: "Ajustes Técnicos", text: "Refinamiento de la interfaz basado en usuarios reales." },
                  { label: "Feedback Loop", text: "Recopilación de datos de uso y satisfacción." },
                  { label: "Pre-Campaña", text: "Teasers en redes sociales para generar expectativa." }
                ]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🚀 FOOTER S-CLASS */}
      <footer className="py-24 px-10 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <h3 className="text-2xl font-black tracking-tighter">PRODUCTORA<span className="text-[#ecb613]">EAR</span></h3>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Construyendo la infraestructura invisible de los eventos más memorables. Autoridad indiscutible en producción técnica y gestión artística.
            </p>
            <div className="flex gap-4">
              {['instagram', 'facebook', 'twitter', 'linkedin'].map(social => (
                <div key={social} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-pink-500 transition-colors cursor-pointer">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full" />
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-10">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#ecb613] uppercase tracking-widest">Explorar</h4>
              <ul className="space-y-4 text-white/50 text-[10px] font-black uppercase tracking-widest">
                <li className="hover:text-white transition-colors cursor-pointer">Quiénes Somos</li>
                <li className="hover:text-white transition-colors cursor-pointer">Servicios Globales</li>
                <li className="hover:text-white transition-colors cursor-pointer">Reservas & Citas</li>
                <li className="hover:text-white transition-colors cursor-pointer">Blog & Noticias</li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="text-[10px] font-black text-[#ecb613] uppercase tracking-widest">Contacto</h4>
              <ul className="space-y-4 text-white/50 text-[10px] font-black uppercase tracking-widest">
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-pink-500 rounded-full" /> +34 693 693 048</li>
                <li className="flex items-center gap-2"><div className="w-1 h-1 bg-pink-500 rounded-full" /> hola@productoraear.com</li>
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-[10px] font-black text-[#ecb613] uppercase tracking-widest">Sede Central</h4>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-relaxed">
              Calle de la Tórtola, 5,<br />
              45930 Méntrida, Toledo.<br />
              <span className="text-white/10">(Oficina Móstoles con Cita Previa)</span>
            </p>
          </div>
        </div>
        <div className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/10 text-[8px] font-black uppercase tracking-[0.4em]">© 2026 Productora EAR. Todos los derechos reservados.</p>
          <div className="flex gap-8 text-white/10 text-[8px] font-black uppercase tracking-[0.4em]">
            <span className="hover:text-white transition-colors cursor-pointer">Política de Privacidad</span>
            <span className="hover:text-white transition-colors cursor-pointer">Términos de Servicio</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function VerticalCard({ icon, title, tag, description }: any) {
  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-pink-500/30 transition-all group">
      <div className="p-3 bg-pink-600/10 border border-pink-500/20 rounded-xl w-fit mb-8 text-pink-500 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-2xl font-black uppercase tracking-tight mb-2 group-hover:text-pink-500 transition-colors">{title}</h3>
      <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-6">{tag}</p>
      <p className="text-white/40 text-xs leading-relaxed group-hover:text-white/70 transition-colors">
        {description}
      </p>
    </div>
  );
}

function EthicCard({ title, subtitle, icon, description, quote, color }: any) {
  const colorMap: any = {
    pink: "border-pink-500/30 bg-pink-600/5 text-pink-500",
    blue: "border-blue-500/30 bg-blue-600/5 text-blue-500",
    green: "border-green-500/30 bg-green-600/5 text-green-500",
    gold: "border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613]"
  };
  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-10">
        <div className={cn("p-4 rounded-2xl", colorMap[color])}>
          {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">{subtitle}</span>
      </div>
      <h4 className="text-2xl font-serif font-bold mb-4 uppercase tracking-tight">{title}</h4>
      <p className="text-white/40 text-xs leading-relaxed mb-8 font-light">{description}</p>
      <div className="h-[1px] w-full bg-white/5 mb-8" />
      <p className={cn("text-[10px] font-black uppercase tracking-widest italic", colorMap[color].split(' ')[2])}>"{quote}"</p>
    </div>
  );
}

function CommunicationItem({ title, icon, description }: any) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-3xl overflow-hidden bg-white/[0.01]">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 flex items-center justify-between group hover:bg-white/[0.02] transition-all"
      >
        <div className="flex items-center gap-6">
          <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform">{icon}</div>
          <span className="text-xl font-serif font-bold uppercase tracking-tight">{title}</span>
        </div>
        <ChevronRight className={cn("text-white/20 transition-transform duration-500", isOpen ? "rotate-90" : "")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-8 pt-0 pl-24 border-t border-white/5">
              <p className="text-white/40 text-sm leading-relaxed font-light italic">{description}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PatrocinioCard({ title, subtitle, price, features, cta, color, highlight = false }: any) {
  const { setIsPricerOpen, setPricerData } = useSharedContext();
  const colors: any = {
    pink: "border-pink-500/20 bg-pink-600/5 text-pink-500",
    gold: "border-[#ecb613]/50 bg-[#ecb613]/10 text-[#ecb613]",
    blue: "border-blue-500/20 bg-blue-600/5 text-blue-500"
  };

  const handleAction = () => {
    setPricerData({
      category: `VIMUME: ${title}`,
      basePrice: title.includes('ADOPTA') ? 3000 : title.includes('ARQUITECTO') ? 15000 : 0
    });
    setIsPricerOpen(true);
  };

  return (
    <div className={cn(
      "p-10 rounded-[2.5rem] border relative overflow-hidden transition-all group",
      highlight ? "border-[#ecb613] shadow-[0_0_50px_rgba(236,182,19,0.1)] scale-105 z-10" : "border-white/5 bg-white/[0.01]"
    )}>
      {highlight && <div className="absolute top-0 right-0 bg-[#ecb613] text-black text-[8px] font-black px-4 py-1 uppercase tracking-widest">Exclusivo</div>}
      <div className="flex justify-between items-start mb-8">
        <h4 className="text-2xl font-serif font-bold uppercase leading-none">{title}</h4>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-40">{subtitle}</span>
      </div>
      <div className="text-xl font-black text-[#ecb613] mb-8 uppercase tracking-widest">{price}</div>
      <ul className="space-y-4 mb-10">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex gap-3 text-xs text-white/40 font-light">
            <CheckCircle2 size={14} className={highlight ? "text-[#ecb613]" : "text-white/20"} /> {f}
          </li>
        ))}
      </ul>
      <button 
        onClick={handleAction}
        className={cn(
        "w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
        highlight ? "bg-[#ecb613] text-black hover:scale-[1.02]" : "border border-white/10 text-white/60 hover:bg-white/5"
      )}>{cta}</button>
    </div>
  );
}

function VerticalTargetCard({ icon, title, sector, hook, description, targets }: any) {
  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-10">
        <div className="p-4 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        <span className="text-[8px] font-black uppercase tracking-widest opacity-20">{sector}</span>
      </div>
      <h4 className="text-2xl font-serif font-bold mb-4 uppercase">{title}</h4>
      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-2">El gancho: <span className="text-white/40">{hook}</span></p>
      <p className="text-xs text-white/40 leading-relaxed italic mb-8 font-light">"{description}"</p>
      <div className="space-y-2">
        <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">Objetivos:</span>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{targets}</p>
      </div>
    </div>
  );
}

function FounderReason({ icon, title, text }: any) {
  return (
    <li className="flex gap-4 items-start">
      <div className="mt-1">{icon}</div>
      <div>
        <h5 className="text-[10px] font-black uppercase tracking-widest text-white/90">{title}</h5>
        <p className="text-[10px] text-white/40 leading-relaxed font-light">{text}</p>
      </div>
    </li>
  );
}

function CampaignCard({ label, title, description, icon, tags, cta, progress, progressLabel, color }: any) {
  return (
    <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] space-y-8 relative overflow-hidden group hover:border-white/10 transition-all">
      <div className="absolute top-0 right-0 p-8 opacity-[0.05] group-hover:opacity-10 transition-all">{icon}</div>
      <div className="space-y-2">
        <span className={cn("text-[8px] font-black uppercase tracking-widest", color === 'gold' ? "text-[#ecb613]" : color === 'blue' ? "text-blue-500" : "text-pink-500")}>{label}</span>
        <h4 className="text-2xl font-serif font-bold uppercase leading-tight">{title}</h4>
      </div>
      <p className="text-xs text-white/40 leading-relaxed font-light">{description}</p>
      {tags && <div className="flex gap-2">{tags.map((t: string) => <span key={t} className="px-3 py-1 bg-white/5 rounded-full text-[8px] font-black uppercase tracking-widest text-white/40">{t}</span>)}</div>}
      {cta && <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#ecb613] hover:gap-4 transition-all">{cta} <ChevronRight size={14} /></button>}
      {progress && (
        <div className="space-y-2">
          <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[8px] font-black text-white/20 uppercase tracking-widest text-right">{progressLabel}</p>
        </div>
      )}
    </div>
  );
}

function TimelineItem({ month, title, icon, color, items }: any) {
  const colorClass = color === 'blue' ? "text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] border-blue-500" : "text-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)] border-pink-500";
  return (
    <div className="relative pl-20 group">
      <div className={cn("absolute left-0 w-20 h-20 rounded-full border-2 bg-black z-10 flex items-center justify-center", colorClass)}>
        {icon}
      </div>
      <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] group-hover:border-white/10 transition-all">
        <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
            <span className={cn("text-[10px] font-black uppercase tracking-widest", color === 'blue' ? "text-blue-500" : "text-pink-500")}>{month}</span>
            <h4 className="text-3xl font-serif font-bold uppercase">{title}</h4>
          </div>
          <div className="p-4 opacity-[0.05]">{icon}</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item: any, i: number) => (
            <div key={i} className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={12} className={color === 'blue' ? "text-blue-500" : "text-pink-500"} />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/80">{item.label}:</span>
              </div>
              <p className="text-[10px] text-white/40 leading-relaxed font-light">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
