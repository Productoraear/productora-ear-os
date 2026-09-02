'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Users, 
  Globe, 
  Settings, 
  Music, 
  Lightbulb, 
  Camera, 
  Mic2,
  ChevronRight,
  Database,
  BarChart3,
  Cpu
} from 'lucide-react';
import PublicNavbar from '@/app/components/public/PublicNavbar';
import EarBottomNav from '@/components/SClassScreens/EarBottomNav';
import { ROUTES } from '@/lib/routes';
import Link from 'next/link';

export default function DossierHub() {
  const stats = [
    { label: 'Proyectos Entregados', value: '500+', icon: <Zap size={20} /> },
    { label: 'Socios Institucionales', value: '120+', icon: <Users size={20} /> },
    { label: 'Disponibilidad Técnica', value: '99.9%', icon: <ShieldCheck size={20} /> },
    { label: 'Impacto Social', value: 'Auditado', icon: <TrendingUp size={20} /> },
  ];

  const services = [
    { 
      title: 'Sonorización Profesional', 
      desc: 'Ingeniería acústica de alta fidelidad para proyectos de gran escala.', 
      href: '/servicios/sonorizacion',
      icon: <Mic2 className="text-[#ecb613]" />
    },
    { 
      title: 'VIMUME • Innovación Social', 
      desc: 'Programas de intervención terapéutica y recuperación de identidad.', 
      href: '/vimume',
      icon: <Globe className="text-[#ecb613]" />
    },
    { 
      title: 'Iluminación Arquitectónica', 
      desc: 'Diseño lumínico profesional para entornos institucionales.', 
      href: '/servicios/iluminacion',
      icon: <Lightbulb className="text-[#ecb613]" />
    },
    { 
      title: 'Producción Audiovisual', 
      desc: 'Cobertura multicámara y streaming para actos oficiales.', 
      href: '/servicios/produccion-audiovisual',
      icon: <Camera className="text-[#ecb613]" />
    },
    { 
      title: 'Curaduría Musical', 
      desc: 'Selección artística bajo estándares de calidad institucional.', 
      href: '/servicios/dj-premium',
      icon: <Music className="text-[#ecb613]" />
    },
    { 
      title: 'Configurador Técnico', 
      desc: 'Asistente para la planificación técnica de su próximo evento.', 
      href: '/contacto',
      icon: <Settings className="text-[#ecb613]" />
    },
  ];

  const artistServices = [
    {
      title: 'Edwin Agudelo - Solista',
      desc: 'Trayectoria internacional y calidad vocal certificada.',
      href: '/artistas/edwin-agudelo'
    },
    {
      title: 'Ensamble de Mariachis (6+)',
      desc: 'Formación de gala bajo protocolo profesional.',
      href: '/artistas/edwin-agudelo#mariachi'
    },
    {
      title: 'Espectáculo Ecuestre',
      desc: 'Doma clásica y tradición musical en un formato único.',
      href: '/artistas/edwin-agudelo#caballo'
    },
    {
      title: 'Ensamble Monumental',
      desc: 'Infraestructura sonora masiva para grandes audiencias.',
      href: '/artistas/edwin-agudelo#banda'
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#ecb613] selection:text-black pb-32">
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ecb613]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ecb613] border-l-2 border-[#ecb613] pl-4">
              Calidad Institucional • Dossier de Trayectoria
            </span>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
              INFRAESTRUCTURA<br />
              <span className="text-[#ecb613]">DE IMPACTO</span>
            </h1>
            <p className="text-white/40 max-w-2xl text-xl uppercase font-bold tracking-widest italic leading-relaxed">
              "Garantizamos el éxito mediante el despliegue de infraestructura técnica y narrativa profesional."
            </p>
            
            <div className="flex gap-4 pt-8">
              <Link href={ROUTES.contacto} className="px-10 py-5 bg-[#ecb613] text-black font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-white transition-all shadow-[0_20px_40px_rgba(236,182,19,0.3)]">
                SOLICITAR PROPUESTA
              </Link>
              <Link href="/servicios" className="px-10 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-white/5 transition-all">
                CATÁLOGO DE SERVICIOS
              </Link>
            </div>
          </motion.div>

          {/* STATS GRID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 border-t border-white/5 pt-20">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="space-y-2"
              >
                <div className="text-[#ecb613] mb-4 opacity-50">{stat.icon}</div>
                <div className="text-4xl font-black italic">{stat.value}</div>
                <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICIOS DISPONIBLES */}
      <section className="py-32 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-black uppercase tracking-tighter">Servicios <span className="text-[#ecb613]">Institucionales</span></h2>
            <Link href="/servicios" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#ecb613] transition-colors flex items-center gap-2 mb-2">
              VER TODO <ChevronRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="glass-panel p-10 rounded-[2.5rem] border border-white/5 flex flex-col gap-8 group"
              >
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#ecb613]/10 transition-all">
                  {service.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">{service.title}</h3>
                  <p className="text-white/40 text-sm uppercase font-bold tracking-widest leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <Link href={service.href} className="text-[10px] font-black uppercase tracking-widest text-[#ecb613] flex items-center gap-2 mt-auto">
                  VER DETALLES <ChevronRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* EDWIN AGUDELO SERVICES */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {artistServices.map((service, i) => (
              <Link href={service.href} key={i}>
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="p-10 border border-white/5 rounded-[2rem] hover:border-[#ecb613]/30 transition-all flex justify-between items-center group bg-gradient-to-r from-transparent to-white/[0.01]"
                >
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black uppercase tracking-tight group-hover:text-[#ecb613] transition-colors">{service.title}</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{service.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#ecb613] group-hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* GESTIÓN DE PROYECTOS */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#ecb613]">Estructura de Ejecución Eficiente</span>
              <h2 className="text-6xl font-black uppercase tracking-tighter">GESTIÓN DE <span className="text-[#ecb613]">PROYECTOS</span></h2>
              <p className="text-white/40 uppercase font-bold tracking-widest text-sm leading-relaxed">
                Nuestra arquitectura optimiza cada fase del evento, desde la planificación logística hasta el cierre institucional, asegurando un retorno de valor medible y una ejecución sin fricciones.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 rounded-[2rem] space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Ahorro Logístico</span>
                  <span className="text-green-500 text-[10px] font-bold">-15%</span>
                </div>
                <div className="text-3xl font-black">Certificado</div>
              </div>
              <div className="p-8 bg-white/5 rounded-[2rem] space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Satisfacción</span>
                  <span className="text-green-500 text-[10px] font-bold">+9.8</span>
                </div>
                <div className="text-3xl font-black">Élite</div>
              </div>
            </div>

            <button className="w-full py-6 bg-white/5 border border-white/10 hover:border-[#ecb613] text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl transition-all">
              SOLICITAR AUDITORÍA TÉCNICA
            </button>
          </div>

          <div className="glass-panel p-12 rounded-[3rem] border-white/5 bg-white/[0.02] space-y-12">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#ecb613]">Nodos de Intervención • Casos de Éxito</h5>
            
            {[
              { label: 'Gala Institucional Madrid', path: '/servicios/institucional', audience: 'Sector Público', perf: '98%' },
              { label: 'Congreso Corporativo Élite', path: '/servicios/corporativo', audience: 'Empresa Ibex 35', perf: '95%' },
              { label: 'Evento de Patrimonio Cultural', path: '/servicios/patrimonio', audience: 'Fundaciones', perf: '97%' },
            ].map((node, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-8 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <h6 className="text-lg font-black uppercase group-hover:text-[#ecb613] transition-colors">{node.label}</h6>
                  <div className="flex gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <span className="text-[#ecb613]">{node.path}</span>
                    <span>{node.audience}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black">{node.perf}</div>
                  <div className="text-[8px] font-black text-green-500 uppercase tracking-widest">Rendimiento</div>
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-white/5 flex flex-col gap-6">
               <h6 className="text-[10px] font-black uppercase tracking-widest text-white/40">Radar de Excelencia Operativa</h6>
               <div className="flex justify-between gap-4">
                  <div className="flex-1 p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-xs font-black">MÁXIMA</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Calidad Técnica</div>
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-xs font-black">ÉLITE</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Autoridad Moral</div>
                  </div>
                  <div className="flex-1 p-4 bg-[#ecb613]/10 rounded-xl text-center">
                    <div className="text-xs font-black text-[#ecb613]">TOTAL</div>
                    <div className="text-[8px] font-bold text-[#ecb613]/50 uppercase tracking-widest mt-1">Trazabilidad</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-[#ecb613]/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
            ¿SU PROYECTO EXIGE UN<br />
            <span className="text-[#ecb613]">ESTÁNDAR PROFESIONAL?</span>
          </h2>
          <Link href={ROUTES.contacto} className="inline-block px-16 py-8 bg-[#ecb613] text-black font-black uppercase tracking-[0.5em] text-[13px] rounded-full hover:scale-105 transition-all shadow-[0_30px_60px_rgba(236,182,19,0.4)]">
            ACTIVAR CONTACTO
          </Link>
          <div className="pt-20 opacity-20">
            <h3 className="text-4xl font-black uppercase tracking-[1em] text-white">PRODUCTORAEAR</h3>
          </div>
        </div>
      </section>

      {/* NAVEGACIÓN INFERIOR */}
      <EarBottomNav />
    </div>
  );
}
