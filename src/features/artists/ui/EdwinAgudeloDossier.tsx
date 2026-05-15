'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Shield, Zap, Star, Music, Check, ArrowRight, Heart, Crown, Mic2, Users, ShoppingCart, Trophy, Sparkles, Activity } from 'lucide-react';
import Link from 'next/link';
import { ROUTES } from '@/lib/routes';
import { ManifestoSection } from './ManifestoSection';
import { TruthNuggets } from '@/features/telemetry/TruthNuggets';

const products = [
  {
    id: 'edwin-solista',
    title: 'Edwin Agudelo - Solista',
    subtitle: 'Actuación Profesional / Alta Fidelidad',
    price: 1500,
    icon: <Crown size={32} />,
    description: 'La esencia de Edwin Agudelo. Un formato versátil y potente para recepciones institucionales y eventos corporativos.',
    includes: [
      'Presentación de 60-90 minutos',
      'Ingeniería de sonido EAR',
      'Repertorio tradicional y contemporáneo',
      'Gestión de protocolo y tiempos'
    ],
    conditions: 'Sujeto a disponibilidad de agenda. Gastos de desplazamiento no incluidos fuera de Madrid.'
  },
  {
    id: 'edwin-mariachi-6',
    title: 'Ensamble de Mariachis (Mín. 6)',
    subtitle: 'El Estándar de Gala Mariachi',
    price: 2800,
    icon: <Users size={32} />,
    description: 'La formación clásica que garantiza la sonoridad y el impacto necesarios para un evento institucional.',
    includes: [
      '6 Músicos Profesionales (Uniforme de Gala)',
      'Protocolo de Bienvenida',
      'Ecualización previa',
      'Coordinación de tiempos',
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
    description: 'Espectáculo ecuestre dirigido por la dirección técnica que fusiona la doma clásica con el mariachi tradicional. Ideal para recintos amplios y ferias.',
    includes: [
      'Edwin Agudelo + Mariachi de Gala',
      'Caballos de Alta Escuela',
      'Dirección Técnica Ecuestre',
      'Logística de transporte especializada',
      'Protocolo para Plazas y Recintos Masivos'
    ],
    conditions: 'Requiere validación técnica del terreno y permisos locales.'
  },
  {
    id: 'edwin-banda',
    title: 'Pack "Ensamble Monumental"',
    subtitle: 'Infraestructura Sonora para Grandes Aforos',
    price: 9500,
    icon: <Zap size={32} />,
    description: 'El despliegue máximo. Un ensamble de más de 12 músicos con soporte técnico de alta gama, diseñado para eventos masivos y corporativos de gran escala.',
    includes: [
      'Ensamble Completo (12+ integrantes)',
      'Ingeniería de sonido avanzada',
      'Diseño de iluminación profesional',
      'Coordinación de protocolo institucional',
      'Show de 120 minutos de alta fidelidad'
    ],
    conditions: 'Reserva mínima de 60 días. Requiere acometida eléctrica trifásica.'
  }
];

export const EdwinAgudeloDossier: React.FC = () => {
  return (
    <div className="bg-[#050505] text-white overflow-hidden">
      {/* HERO SECTION - ATMOSPHERIC CSS ONLY */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-10" />
          <div className="absolute inset-0 bg-[#050505] z-0" />
          {/* Procedural Atmosphere instead of heavy image */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#ecb613]/5 via-transparent to-transparent blur-[120px] opacity-50" />
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
        </div>

        <div className="relative z-10 text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-6 py-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-[10px] font-black tracking-[0.5em] uppercase mb-8">
              Artista Institucional
            </span>
            <h1 className="text-6xl md:text-[10rem] font-black italic tracking-tighter uppercase leading-[0.8] mb-12">
              Edwin <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] to-white">Agudelo</span>
            </h1>
            <p className="text-xl md:text-3xl font-light text-white/60 max-w-4xl mx-auto leading-tight italic mb-8">
              "Preservando la esencia de la música tradicional a través de la calidad sonora y el rigor profesional."
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-[10px] font-black uppercase tracking-widest text-[#ecb613]/60">
              <Link href="/servicios/eventos-institucionales" className="hover:text-[#ecb613] transition-colors">Eventos Institucionales</Link> • 
              <Link href="/servicios/galas-corporativas" className="hover:text-[#ecb613] transition-colors">Galas Corporativas</Link> • 
              <Link href="/servicios/patrimonio-musical" className="hover:text-[#ecb613] transition-colors">Patrimonio Musical</Link>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-40">
          <span className="text-[9px] font-black uppercase tracking-widest">Explorar Trayectoria</span>
          <div className="w-[1px] h-20 bg-gradient-to-b from-[#ecb613] to-transparent" />
        </div>

        {/* AUTHORITY SEAL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-10 right-10 z-[100] hidden lg:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-6 rounded-full border-[#ecb613]/30 bg-[#ecb613]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={32} className="text-[#ecb613] group-hover:rotate-12 transition-transform duration-500" />
            <div className="absolute -inset-2 rounded-full border border-[#ecb613]/20 animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613]">Reconocimiento Artístico</span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">+20 Años de Trayectoria</span>
          </div>
        </motion.div>
      </section>

      {/* DISPONIBILIDAD */}
      <section className="py-32 px-8 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">Disponibilidad: Sujeta a Calendario</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8]">
                Agenda <br />
                <span className="text-[#ecb613]">Profesional</span>
              </h2>
              <p className="text-white/40 text-[11px] font-bold uppercase tracking-widest leading-relaxed max-w-md">
                La gestión de fechas de Edwin Agudelo se realiza bajo criterios de rigor y planificación técnica. Recomendamos solicitar información con antelación para asegurar la viabilidad de su evento.
              </p>
            </div>

            <div className="glass-panel p-12 rounded-[3rem] border-[#ecb613]/20 bg-[#ecb613]/5">
              <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 italic">Solicitud de Disponibilidad</h3>
              <div className="space-y-6">
                {[
                  { label: 'Ubicación del Evento', placeholder: 'Ej: Madrid, Marbella...' },
                  { label: 'Fecha Estimada', placeholder: 'DD/MM/AAAA' },
                  { label: 'Tipo de Servicio', placeholder: 'Solista / Ensamble / Gala VIP' }
                ].map((f, i) => (
                  <div key={i} className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/30">{f.label}</label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      className="w-full bg-black/40 border border-white/5 p-4 rounded-xl text-[10px] uppercase font-black tracking-widest focus:border-[#ecb613] transition-all outline-none"
                    />
                  </div>
                ))}
                <Link
                  href={ROUTES.contacto}
                  className="w-full py-6 bg-[#ecb613] text-black font-black text-[11px] uppercase tracking-[0.3em] rounded-2xl hover:bg-white transition-all flex items-center justify-center"
                >
                  Consultar Calendario
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAYECTORIA & FILOSOFÍA */}
      <section className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] mb-12">
                Tradición y <span className="text-[#ecb613]">Autoridad</span> <br />Artística
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-12">
                Contar con Edwin Agudelo es integrar un referente de respeto y maestría musical en su evento.
                Nacido en Amagá, Antioquia, y forjado en la vibrante escena musical de Medellín desde los 16 años, su carrera de más de dos décadas está marcada por el compromiso con la calidad y la conexión humana.
                Su himno "Acompáñame" define su trayectoria como "Cantante en Positivo", transformando cada actuación en un momento de rigor profesional y distinción.
              </p>

              <div className="space-y-8">
                {[
                  { title: 'Protocolo Artístico', desc: 'Desarrollo escénico de alto nivel con enfoque en la narrativa institucional.', icon: <Heart size={20} /> },
                  { title: 'Calidad Técnica', desc: 'Garantía de sonoridad impecable y presencia profesional certificada.', icon: <Shield size={20} /> },
                  { title: 'Gestión de Repertorio', desc: 'Selección musical optimizada para la solemnidad y objetivos del evento.', icon: <Zap size={20} /> }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-[#ecb613]/10 flex items-center justify-center text-[#ecb613]">
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

            <div className="relative group aspect-square">
              <div className="absolute -inset-4 bg-[#ecb613]/10 blur-[100px] opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="rounded-[3rem] border border-white/5 shadow-2xl relative z-10 bg-white/5 overflow-hidden w-full h-full">
                {/* Optimized image placeholder with next/image logic */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#ecb613]/10 to-black/40 mix-blend-overlay z-10" />
                <div className="w-full h-full bg-neutral-900 flex items-center justify-center relative">
                  <Music size={64} className="text-[#ecb613]/20" />
                  {/* 
                     Nota: Sustituido img nativa por placeholder estilizado para LCP. 
                     En producción se usaría: <Image src="..." fill className="object-cover" />
                   */}
                </div>
              </div>
              <div className="absolute top-10 right-10 z-20 glass-panel p-8 rounded-3xl border-white/10 backdrop-blur-3xl">
                <div className="text-4xl font-black text-[#ecb613] mb-2">100%</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-white/40">Compromiso con la Calidad</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MANIFESTO SECTION */}
      <ManifestoSection />

      {/* PRINCIPIOS */}
      <section className="py-40 px-8 border-y border-white/5 bg-[#080808]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Valores Profesionales</span>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">Pilares de <span className="text-[#ecb613]">Autoridad</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                pilar: 'Resiliencia',
                h3: 'Cantar en Positivo',
                desc: 'Inspirado en la capacidad de transformar la emoción en motor de cambio. La música como herramienta de conexión humana.',
                cta: 'Explorar Metodología',
                href: ROUTES.protocolo
              },
              {
                pilar: 'Compromiso',
                h3: 'Impacto Social',
                desc: 'Apoyo directo a iniciativas de salud mental y bienestar social a través de programas como VIMUME.',
                cta: 'Ver Nodo VIMUME',
                href: ROUTES.vimume
              },
              {
                pilar: 'Rigor',
                h3: 'Excelencia Técnica',
                desc: 'Metodología profesional aplicada al arte. Garantizamos responsabilidad y calidad en cada proyecto.',
                cta: 'Consultar Servicios',
                href: ROUTES.servicios
              }
            ].map((p, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-12 rounded-[3rem] border-white/5 flex flex-col gap-8 group"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#ecb613]">{p.pilar}</span>
                <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-[#ecb613] transition-colors">{p.h3}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-medium italic">"{p.desc}"</p>
                <Link href={p.href} className="mt-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white hover:text-[#ecb613] transition-colors">
                  {p.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EVIDENCIA */}
      <section className="py-32 px-8 bg-black border-y border-white/5 relative">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <Shield className="text-amber-500 mx-auto mb-6" size={32} />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em] mb-4 block">Garantía de Calidad Certificada</span>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">Resultados <span className="text-white/40">Auditados</span></h2>
          </div>
          <TruthNuggets />
        </div>
      </section>

      {/* REPERTORIO */}
      <section className="py-40 bg-[#080808] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-32">
            <span className="text-[#ecb613] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Catálogo de Servicios Profesionales</span>
            <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
              Repertorio de <span className="text-[#ecb613]">Impacto</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {products.map((p) => (
              <div key={p.id} className="glass-panel p-10 rounded-[3rem] border-white/5 bg-white/[0.01] flex flex-col hover:border-[#ecb613]/30 transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#ecb613] mb-10 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{p.title}</h3>
                <p className="text-[#ecb613] text-[10px] font-black uppercase tracking-widest mb-6">{p.subtitle}</p>

                <div className="text-5xl font-black text-white mb-10">
                  {p.price.toLocaleString('de-DE')}€ <span className="text-xs text-white/30 tracking-tighter font-medium uppercase italic">/ Tarifa Profesional</span>
                </div>

                <div className="space-y-4 mb-12 flex-1">
                  <p className="text-white/50 text-xs italic font-medium leading-relaxed mb-6">"{p.description}"</p>
                  <div className="space-y-3">
                    {p.includes.map((inc, i) => (
                      <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <Check size={12} className="text-[#ecb613]" /> {inc}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-white/5 mb-10">
                  <h5 className="text-[9px] font-black uppercase tracking-widest text-white/20 mb-2">Condiciones Logísticas</h5>
                  <p className="text-[9px] text-white/30 font-medium leading-tight">{p.conditions}</p>
                </div>

                <Link href={`/contacto`} className="w-full py-6 bg-[#ecb613] text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-2xl hover:bg-white transition-all shadow-[0_20px_40px_rgba(236,182,19,0.1)] flex items-center justify-center gap-2">
                  SOLICITAR INFORMACIÓN <ShoppingCart size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-60 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#ecb613]/5 blur-[200px]" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] mb-12">
            Calidad Artística <br /> <span className="text-[#ecb613]">Certificada</span>
          </h2>
          <p className="text-white/40 text-xl font-light mb-16 max-w-2xl mx-auto">
            Proyectos que exigen un alto compromiso con la excelencia y la tradición musical. Estamos a su disposición para elevar la calidad de su próximo evento.
          </p>
          <div className="flex flex-col md:flex-row gap-8 justify-center mb-32">
            <Link href={ROUTES.contacto} className="px-16 py-8 bg-white text-black font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-[#ecb613] transition-all">
              SOLICITAR DOSSIER TÉCNICO
            </Link>
            <Link href={ROUTES.servicios} className="px-16 py-8 border border-white/10 text-white font-black uppercase tracking-[0.4em] text-[11px] rounded-full hover:bg-white/5 transition-all">
              EXPLORAR OTROS FORMATOS
            </Link>
          </div>

          <div className="flex flex-col items-center justify-center p-8 bg-[#ecb613]/5 border border-[#ecb613]/20 rounded-2xl text-center max-w-2xl mx-auto">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[#ecb613]" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ecb613]">Garantía de Calidad • PRODUCTORAEAR</span>
            </div>
            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">
              Nuestros procesos operativos aseguran el cumplimiento de los más altos estándares institucionales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
