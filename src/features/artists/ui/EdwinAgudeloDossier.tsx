'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Star, Music, Check, ArrowRight, Heart, Crown, Mic2, Users, ShoppingCart, Trophy, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ManifestoSection } from './ManifestoSection';
import { TruthNuggets } from '@/features/telemetry/TruthNuggets';

const products = [
  {
    id: 'edwin-solista',
    title: 'Edwin Agudelo - Solista Premium',
    subtitle: 'Actuación de Autor / Alta Fidelidad',
    price: 1500,
    icon: <Crown size={32} />,
    description: 'La esencia pura de Edwin Agudelo. Un show íntimo pero potente para recepciones VIP y eventos exclusivos.',
    includes: [
      'Show de 60-90 minutos',
      'Ingeniería de sonido compacta EAR',
      'Repertorio de autor y clásicos',
      'Gestión de protocolo y tiempos'
    ],
    conditions: 'Sujeto a disponibilidad de agenda. Gastos de desplazamiento no incluidos fuera de Madrid.'
  },
  {
    id: 'edwin-mariachi-6',
    title: 'Mariachis (Mín. 6 Integrantes)',
    subtitle: 'El Estándar de Gala Mariachi',
    price: 2800,
    icon: <Users size={32} />,
    description: 'La formación clásica que garantiza el estruendo y la armonía necesarios para un evento de impacto.',
    includes: [
      '6 Músicos Profesionales (Gala)',
      'Ritual del Ramo (Cortesía)',
      'Prueba de sonido previa',
      'Protocolo de entrada y salida',
      'Repertorio interactivo'
    ],
    conditions: 'Reserva con 30 días de antelación recomendada.'
  },
  {
    id: 'edwin-caballo',
    title: 'Show "Cantando a Caballo"',
    subtitle: 'Alta Escuela & Mariachi Ecuestre',
    price: 5500,
    icon: <Sparkles size={32} />,
    description: 'El espectáculo definitivo. Un ballet ecuestre dirigido por Daniel que fusiona la doma clásica con el alma de México. Éxito rotundo en Plazas de Toros y Ferias.',
    includes: [
      'Edwin Agudelo + Mariachi de Gala',
      'Caballos de Alta Escuela (Doma)',
      'Dirección Ecuestre por Daniel',
      'Logística de transporte especializada',
      'Protocolo para Plazas y Recintos Masivos'
    ],
    conditions: 'Requiere validación técnica del terreno y permisos locales.'
  },
  {
    id: 'edwin-banda',
    title: 'Pack "Banda Monumental"',
    subtitle: 'Infraestructura Sonora de Máximo Impacto',
    price: 9500,
    icon: <Zap size={32} />,
    description: 'El despliegue total. Un ensamble de más de 12 músicos con rider técnico de festival, diseñado para capturar la atención de audiencias masivas en ferias y eventos B2G.',
    includes: [
      'Banda Completa (12+ integrantes)',
      'Ingeniería de sonido S-Class (FBT/Shure)',
      'Diseño de iluminación cinética',
      'Coordinación de protocolo institucional',
      'Show de 120 minutos de dominancia'
    ],
    conditions: 'Reserva mínima de 60 días. Requiere acometida eléctrica trifásica.'
  }
];

export const EdwinAgudeloDossier: React.FC = () => {
  return (
    <div className="bg-[#050505] text-white overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514525253361-b83f859b73c0?q=80&w=1924&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-30 grayscale"
            alt="Edwin Agudelo"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 rounded-full border border-[#d4a855]/30 bg-[#d4a855]/5 text-[#d4a855] text-[10px] font-black tracking-[0.5em] uppercase mb-8">
              The Master Artist
            </span>
            <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.8] mb-12">
              Edwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4a855] to-white">Agudelo</span>
            </h1>
            <p className="text-xl md:text-3xl font-light text-white/60 max-w-4xl mx-auto leading-tight italic mb-8">
              "Redefiniendo el alma de México a través de la arquitectura sonora del Mariachi, Bolero, Balada y Música Popular."
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#d4a855]/60">
              <span>Ferias Reales</span> • <span>Consulados</span> • <span>Eventos Institucionales</span>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="text-[9px] font-black uppercase tracking-widest">Explorar el Arsenal</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#d4a855] to-transparent" />
        </div>

        {/* AUTHORITY SEAL: Gladiadores 2021 */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-10 right-10 z-[100] hidden lg:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-6 rounded-full border-[#d4a855]/30 bg-[#d4a855]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={32} className="text-[#d4a855] group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-2 rounded-full border border-[#d4a855]/20 animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]">Gladiador 2021</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">+20 Años de Élite</span>
          </div>
        </motion.div>
      </section>

      {/* SCARCITY ENGINE */}
      <section className="py-32 px-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500">Estado de Disponibilidad: Crítico</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Solo 2 slots <br />
                <span className="text-[#d4a855]">Disponibles</span>
              </h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-md">
                La agenda 2026/2027 de Edwin Agudelo se gestiona bajo estricto calendario de exclusividad. Solo se aceptan 2 proyectos adicionales para el mes de Mayo en la zona centro.
              </p>
            </div>
            
            <div className="glass-panel p-12 rounded-[3rem] border-[#d4a855]/20 bg-[#d4a855]/5">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Petición de Capacidad</h3>
              <div className="space-y-6">
                {[
                  { label: 'Ubicación del Evento', placeholder: 'Ej: Madrid, Marbella...' },
                  { label: 'Fecha Estimada', placeholder: 'DD/MM/AAAA' },
                  { label: 'Tipo de Protocolo', placeholder: 'Solista / Mariachi 6+ / Ritual VIP' }
                ].map((f, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">{f.label}</label>
                    <input 
                      type="text" 
                      placeholder={f.placeholder}
                      className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-[10px] uppercase font-black tracking-widest focus:border-[#d4a855] transition-all outline-none"
                    />
                  </div>
                ))}
                <button className="w-full py-6 bg-[#d4a855] text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all">
                  Consultar Disponibilidad Real
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RITUAL & PHILOSOPHY */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-12">
                Más allá del <span className="text-[#d4a855]">Folklore</span>, <br/>Puramente Vanguardia
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-12">
                Contratar a Edwin Agudelo no es simplemente añadir música a un evento; es orquestar un ritual de autoridad. 
                Nacido en Amagá-Antioquia y forjado en escenarios internacionales, su trayectoria de más de 20 años incluye hitos como el premio "Gladiador en el Extranjero 2021".
                Su himno de resiliencia "Acompáñame" define su filosofía como "Cantante en Positivo", transformando cada evento en un acto de dominancia emocional.
              </p>
              
              <div className="space-y-8">
                {[
                  { title: 'El Ritual del Ramo', desc: 'Protocolo exclusivo de impacto visual y emocional ante los invitados.', icon: <Heart size={20} /> },
                  { title: 'Soberanía Logística', desc: 'Llegada anticipada, prueba de sonido redundante y uniformidad impecable.', icon: <Shield size={20} /> },
                  { title: 'Curación Artística', desc: 'Repertorio diseñado matemáticamente para maximizar el clímax del evento.', icon: <Zap size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#d4a855]/10 flex items-center justify-center text-[#d4a855]">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-xs text-white/30 leading-relaxed uppercase font-bold">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-4 bg-[#d4a855]/20 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity" />
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop" 
                className="rounded-[3rem] border border-white/5 shadow-2xl relative z-10 grayscale hover:grayscale-0 transition-all duration-1000"
                alt="Studio Session"
              />
              <div className="absolute top-10 right-10 z-20 glass-panel p-8 rounded-3xl border-white/10 backdrop-blur-3xl">
                <div className="text-4xl font-black text-[#d4a855] mb-2">99.8%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Índice de Satisfacción VIP</div>
              </div>
              
              {/* BUCLE DE SUSCRIPCIÓN - YOUTUBE */}
              <div className="absolute bottom-10 left-10 z-20">
                <a href="https://www.youtube.com/@EdwinAgudelo?sub_confirmation=1" target="_blank" rel="noopener noreferrer" className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:border-red-500/50 transition-all group/yt">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-black uppercase tracking-widest text-red-500 mb-1 group-hover/yt:text-white transition-colors">Súmate a la visión</span>
                    <span className="block text-sm font-black uppercase text-white">Suscríbete al Canal</span>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <ManifestoSection />

      {/* EL CÓDIGO AGUDELO: Pillares Ideológicos */}
      <section className="py-40 px-8 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">El ADN de la Visión</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">El Código <span className="text-[#d4a855]">Agudelo</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                pilar: 'La Resiliencia', 
                h3: 'Cantar en Positivo', 
                desc: 'Inspirado en el himno "Acompáñame", transformamos el dolor en motor de avance. La música no es un escape; es un arma de superación.', 
                cta: 'Escuchar Himno',
                href: 'https://youtu.be/...'
              },
              { 
                pilar: 'La Empatía', 
                h3: 'Vínculo Social', 
                desc: 'Nuestra arquitectura sonora financia el Protocolo VIMUME. Cada show es una semilla de bienestar para nuestros mayores.', 
                cta: 'Impacto Social',
                href: '/servicios/innovacion-social'
              },
              { 
                pilar: 'La Soberanía', 
                h3: 'Dignidad Artística', 
                desc: 'Rigor, puntualidad y excelencia corporativa aplicada al arte. No somos bohemia; somos ingeniería emocional certificada.', 
                cta: 'Protocolo S-Class',
                href: '/servicios'
              }
            ].map((p, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-12 rounded-[3rem] border-white/5 flex flex-col gap-8 group"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d4a855]">{p.pilar}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-[#d4a855] transition-colors">{p.h3}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-medium italic">"{p.desc}"</p>
                <Link href={p.href} className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-[#d4a855] transition-colors">
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EVIDENCIA - THE TRUTH ENGINE */}
      <section className="py-32 px-8 bg-black border-y border-white/5 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Shield className="text-green-500 mx-auto mb-6" size={32} />
            <span className="text-green-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Proof of Work (Auditable)</span>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Evidencia <span className="text-white/40">Innegable</span></h2>
          </div>
          <TruthNuggets />
        </div>
      </section>

      {/* MARKETPLACE - THE ARSENAL (ACCIÓN) */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Artistas del Género / Marketplace</span>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
              Arsenal de <span className="text-[#d4a855]">Impacto</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((p) => (
              <div key={p.id} className="glass-panel p-10 rounded-[3rem] border-white/5 bg-white/[0.01] flex flex-col hover:border-[#d4a855]/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#d4a855] mb-10 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{p.title}</h3>
                <p className="text-[#d4a855] text-[10px] font-black uppercase tracking-widest mb-6">{p.subtitle}</p>
                
                <div className="text-5xl font-black text-white mb-10">
                  {p.price.toLocaleString('de-DE')}€ <span className="text-xs text-white/30 tracking-tighter font-medium uppercase italic">/ Evento S-Class</span>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  <p className="text-white/50 text-xs italic font-medium leading-relaxed mb-6">"{p.description}"</p>
                  <div className="space-y-3">
                    {p.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Check size={12} className="text-[#d4a855]" /> {inc}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mb-10">
                  <h5 className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Condiciones Operativas</h5>
                  <p className="text-[9px] text-white/30 font-medium leading-tight">{p.conditions}</p>
                </div>

                <Link href={`/checkout?item=${p.id}`} className="w-full py-6 bg-[#d4a855] text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(212,168,85,0.1)] flex items-center justify-center gap-2">
                  CONTRATAR AHORA <ShoppingCart size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#d4a855]/5 blur-[200px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-12">
            ¿Buscas la <span className="text-[#d4a855]">Inmortalidad</span> Artística?
          </h2>
          <p className="text-white/40 text-xl font-light mb-16 max-w-2xl mx-auto">
            Edwin Agudelo solo acepta proyectos que desafíen el statu quo del entretenimiento. Si tu visión está a la altura, nosotros ponemos la música.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-32">
            <Link href="/cotizador" className="px-16 py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-[#d4a855] transition-all">
              DISEÑAR PROYECTO A MEDIDA
            </Link>
            <Link href="/servicios" className="px-16 py-8 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-white/5 transition-all">
              VER OTROS ARTISTAS
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-green-500/5 border border-green-500/20 rounded-2xl text-center max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-green-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Sello de Transparencia EAR GOLD</span>
            </div>
            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">
              Este sistema opera bajo datos reales. Cero reseñas ficticias. Cero métricas infladas. Soberanía garantizada.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
