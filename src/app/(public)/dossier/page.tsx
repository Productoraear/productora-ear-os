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
import { SovereignNav } from '@/widgets/navigation/SovereignNav';
import EarBottomNav from '@/components/SClassScreens/EarBottomNav';
import Link from 'next/link';

export default function DossierHub() {
  const stats = [
    { label: 'Impacto en Dossier', value: '500+', icon: <Zap size={20} /> },
    { label: 'Clientes VIP', value: '120+', icon: <Users size={20} /> },
    { label: 'SLA Operativo', value: '99.9%', icon: <ShieldCheck size={20} /> },
    { label: 'ROI Promedio', value: '+240%', icon: <TrendingUp size={20} /> },
  ];

  const services = [
    { 
      title: 'Sonorización de Eventos', 
      desc: 'Ingeniería acústica de precisión para eventos de alto nivel.', 
      href: '/servicios/sonorizacion',
      icon: <Mic2 className="text-[#D4AF37]" />
    },
    { 
      title: 'Innovación Social & VIMUME', 
      desc: 'Proyectos de impacto social y economía plateada liderados por EAR.', 
      href: '/vimume',
      icon: <Globe className="text-[#D4AF37]" />
    },
    { 
      title: 'Iluminación Espectacular', 
      desc: 'Diseño lumínico inmersivo y tecnología LED de última generación.', 
      href: '/servicios/iluminacion',
      icon: <Lightbulb className="text-[#D4AF37]" />
    },
    { 
      title: 'Producción Audiovisual', 
      desc: 'Cobertura integral y streaming de alta definición para corporativos.', 
      href: '/servicios/produccion-audiovisual',
      icon: <Camera className="text-[#D4AF37]" />
    },
    { 
      title: 'DJ Premium y Animación', 
      desc: 'Curaduría musical exclusiva para audiencias exigentes con sistemas S-Class.', 
      href: '/servicios/dj-premium',
      icon: <Music className="text-[#D4AF37]" />
    },
    { 
      title: 'Configurador Bespoke', 
      desc: 'Presupuestos en tiempo real con nuestra IA de ingeniería sónica.', 
      href: '/cotizador',
      icon: <Settings className="text-[#D4AF37]" />
    },
  ];

  const artistServices = [
    {
      title: 'Edwin Agudelo - Solista Premium',
      desc: 'Gladiador en el Extranjero 2021. La voz más versátil para eventos de alta gama.',
      href: '/artistas/edwin-agudelo'
    },
    {
      title: 'Edwin Agudelo con Mariachis (6+)',
      desc: 'Formación de gala. El protocolo original de Edwin Agudelo para bodas.',
      href: '/artistas/edwin-agudelo#mariachi'
    },
    {
      title: 'Show Cantando a Caballo',
      desc: 'Espectáculo ecuestre único. Edwin Agudelo fusiona doma clásica con mariachi.',
      href: '/artistas/edwin-agudelo#caballo'
    },
    {
      title: 'Banda Monumental EAR',
      desc: 'Potencia musical masiva para festivales, ferias y eventos de gran escala.',
      href: '/artistas/edwin-agudelo#banda'
    }
  ];

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#D4AF37] selection:text-black pb-32">
      <SovereignNav />
      
      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D4AF37]/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37] border-l-2 border-[#D4AF37] pl-4">
              Soberanía Territorial • Dossier Hub
            </span>
            <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-[0.8] italic">
              DOMINANCIA<br />
              <span className="text-[#D4AF37]">ESTRATÉGICA</span>
            </h1>
            <p className="text-white/40 max-w-2xl text-xl uppercase font-bold tracking-widest italic leading-relaxed">
              "No gestionamos eventos en Dossier. Garantizamos el éxito corporativo mediante el despliegue de activos tecnológicos de élite."
            </p>
            
            <div className="flex gap-4 pt-8">
              <Link href="/cotizador" className="px-10 py-5 bg-[#D4AF37] text-black font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-white transition-all shadow-[0_20px_40px_rgba(212,175,55,0.3)]">
                RESERVAR PROYECTO
              </Link>
              <Link href="/servicios" className="px-10 py-5 border border-white/10 text-white font-black uppercase tracking-widest text-[11px] rounded-full hover:bg-white/5 transition-all">
                CATÁLOGO LOCAL
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
                <div className="text-[#D4AF37] mb-4 opacity-50">{stat.icon}</div>
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
            <h2 className="text-5xl font-black uppercase tracking-tighter">Servicios <span className="text-[#D4AF37]">Disponibles</span></h2>
            <Link href="/servicios" className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#D4AF37] transition-colors flex items-center gap-2 mb-2">
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
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-[#D4AF37]/10 transition-all">
                  {service.icon}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black uppercase tracking-tight">{service.title}</h3>
                  <p className="text-white/40 text-sm uppercase font-bold tracking-widest leading-relaxed">
                    {service.desc}
                  </p>
                </div>
                <Link href={service.href} className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37] flex items-center gap-2 mt-auto">
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
                  className="p-10 border border-white/5 rounded-[2rem] hover:border-[#D4AF37]/30 transition-all flex justify-between items-center group bg-gradient-to-r from-transparent to-white/[0.01]"
                >
                  <div className="space-y-2">
                    <h4 className="text-2xl font-black uppercase tracking-tight group-hover:text-[#D4AF37] transition-colors">{service.title}</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{service.desc}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-[#D4AF37] group-hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MOTOR DE DEMANDA */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#D4AF37]">Matriz de Demanda Autónoma</span>
              <h2 className="text-6xl font-black uppercase tracking-tighter">MOTOR DE <span className="text-[#D4AF37]">DEMANDA</span></h2>
              <p className="text-white/40 uppercase font-bold tracking-widest text-sm leading-relaxed">
                Nivel 7: Marketing Autónomo. El sistema genera, optimiza y despliega embudos de conversión de alta fidelidad utilizando datos de la red de vampirización y AEO para dominancia absoluta en IAs.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 rounded-[2rem] space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">CAC Real</span>
                  <span className="text-red-500 text-[10px] font-bold">-12%</span>
                </div>
                <div className="text-3xl font-black">€42.30</div>
              </div>
              <div className="p-8 bg-white/5 rounded-[2rem] space-y-2 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Tasa de Conversión</span>
                  <span className="text-green-500 text-[10px] font-bold">+2.1%</span>
                </div>
                <div className="text-3xl font-black">8.4%</div>
              </div>
            </div>

            <button className="w-full py-6 bg-white/5 border border-white/10 hover:border-[#D4AF37] text-white font-black uppercase tracking-[0.5em] text-[11px] rounded-2xl transition-all">
              INICIAR CAMPAÑA AUTÓNOMA
            </button>
          </div>

          <div className="glass-panel p-12 rounded-[3rem] border-white/5 bg-white/[0.02] space-y-12">
            <h5 className="text-[10px] font-black uppercase tracking-widest text-[#D4AF37]">Landings Dinámicas Activas • AEO EN VIVO</h5>
            
            {[
              { label: 'Bodas de Lujo Madrid', path: '/servicios/dj-premium/madrid', audience: 'Novia de Alto Ticket', perf: '94%' },
              { label: 'Gala Corporativa Élite', path: '/servicios/produccion-audiovisual/barcelona', audience: 'CEO de Tech/SaaS', perf: '88%' },
              { label: 'Experiencia Finca Bespoke', path: '/servicios/configurador-bespoke/toledo', audience: 'Planner Premium', perf: '91%' },
            ].map((node, i) => (
              <div key={i} className="flex justify-between items-center group cursor-pointer border-b border-white/5 pb-8 last:border-0 last:pb-0">
                <div className="space-y-2">
                  <h6 className="text-lg font-black uppercase group-hover:text-[#D4AF37] transition-colors">{node.label}</h6>
                  <div className="flex gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                    <span className="text-[#D4AF37]">{node.path}</span>
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
               <h6 className="text-[10px] font-black uppercase tracking-widest text-white/40">Radar de Visibilidad AEO (Gemini / Claude / SearchGPT)</h6>
               <div className="flex justify-between gap-4">
                  <div className="flex-1 p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-xs font-black">98%</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Knowledge Sync</div>
                  </div>
                  <div className="flex-1 p-4 bg-white/5 rounded-xl text-center">
                    <div className="text-xs font-black">ÉLITE</div>
                    <div className="text-[8px] font-bold text-white/20 uppercase tracking-widest mt-1">Semantic Authority</div>
                  </div>
                  <div className="flex-1 p-4 bg-[#D4AF37]/10 rounded-xl text-center">
                    <div className="text-xs font-black text-[#D4AF37]">CRÍTICA</div>
                    <div className="text-[8px] font-bold text-[#D4AF37]/50 uppercase tracking-widest mt-1">Answer Prob.</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-40 bg-[#D4AF37]/5">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <h2 className="text-7xl font-black uppercase tracking-tighter leading-none italic">
            ¿SU PROYECTO EXIGE UN<br />
            <span className="text-[#D4AF37]">ESTÁNDAR INALCANZABLE?</span>
          </h2>
          <Link href="/cotizador" className="inline-block px-16 py-8 bg-[#D4AF37] text-black font-black uppercase tracking-[0.5em] text-[13px] rounded-full hover:scale-105 transition-all shadow-[0_30px_60px_rgba(212,175,55,0.4)]">
            ACTIVAR PROYECTO
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
