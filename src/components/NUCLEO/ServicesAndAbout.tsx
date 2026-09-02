"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Globe, 
  Info, 
  FileText,
  Video,
  Music,
  Tv,
  Presentation,
  Share2,
  Lock,
  Search,
  Layout,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Zap,
  Smartphone
} from 'lucide-react';

export const ServicesAndAbout: React.FC = () => {
  const videoServices = [
    { title: "Videos Corporativos", icon: Presentation, desc: "Comunicación de alto impacto para empresas S-Class." },
    { title: "Videoclips Cinematográficos", icon: Music, desc: "Producciones de nivel god-tier para artistas." },
    { title: "Videos Institucionales", icon: FileText, desc: "Claridad y profesionalismo en cada frame." },
    { title: "Videos Promocionales", icon: Zap, desc: "Captación de leads mediante narrativa visual." },
    { title: "Presentación de Productos", icon: Video, desc: "Lanzamientos de productos con estética premium." },
    { title: "Comunicación Interna", icon: Tv, desc: "Alineación de equipos mediante video táctico." }
  ];

  return (
    <div className="space-y-32 py-20 px-4 md:px-0">
      
      {/* SECTION: QUIENES SOMOS */}
      <section id="quienes-somos" className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 border border-gold-500/20 rounded-full">
              <ShieldCheck size={14} className="text-gold-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold-500">Misión & Visión // S-Class</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase">
              Edwin Agudelo <span className="text-gold-500">Realizaciones</span>
            </h2>
            <p className="text-xl text-white/50 leading-relaxed font-medium">
              Arquitectura visual y producción de legado. Bajo la dirección estratégica de Edwin Agudelo, 
              fusionamos ingeniería de marketing con estética cinematográfica para crear activos digitales que no solo 
              se ven bien, sino que dominan el mercado de eventos S-Class.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                <h4 className="text-white font-black uppercase text-[12px] mb-2 tracking-widest">Responsable</h4>
                <p className="text-white/40 text-sm">Edwin Agudelo (CEO)</p>
              </div>
              <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                <h4 className="text-white font-black uppercase text-[12px] mb-2 tracking-widest">Ubicación</h4>
                <p className="text-white/40 text-sm">Operaciones Globales // HEADQUARTERS</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
             <div className="absolute inset-0 bg-gold-500/5 group-hover:bg-transparent transition-all duration-700"></div>
             <div className="flex items-center justify-center h-full text-white/10 italic text-[12px] uppercase">
                [MEDIA ASSET: CORPORATE_REEL_001]
             </div>
          </div>
        </div>
      </section>

      {/* SECTION: SERVICIOS DETALLADOS */}
      <section id="servicios" className="space-y-16">
        <div className="text-center space-y-4">
          <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">Portafolio de Soluciones</h3>
          <p className="text-white/40 uppercase tracking-[0.3em] text-[10px] font-black underline decoration-gold-500 underline-offset-8">Despliegue Técnico Audiovisual</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videoServices.map((s, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-10 bg-white/[0.02] border border-white/5 rounded-[40px] hover:border-gold-500/30 transition-all group"
            >
              <div className="mb-6 p-4 bg-gold-500/20 w-fit rounded-2xl group-hover:bg-gold-500 transition-colors">
                <s.icon size={24} className="text-gold-500 group-hover:text-black transition-colors" />
              </div>
              <h4 className="text-xl font-black text-white uppercase mb-4 tracking-tight">{s.title}</h4>
              <p className="text-sm text-white/40 leading-relaxed font-medium">{s.desc}</p>
            </motion.div>
          ))}
          
          {/* SERVICIOS ADICIONALES */}
          <div className="p-10 bg-gold-500 border border-gold-500/30 rounded-[40px] flex flex-col justify-between">
            <h4 className="text-3xl font-black text-black uppercase leading-none tracking-tighter">Asesoramiento & Alquiler</h4>
            <p className="text-black/60 font-bold uppercase text-[10px] tracking-widest leading-relaxed mt-4">
              Soporte técnico militar y asesoramiento estratégico para eventos de alto nivel.
            </p>
            <button className="mt-8 bg-black text-white py-4 px-8 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
              Consultar Disponibilidad
            </button>
          </div>
        </div>
      </section>

      {/* SECTION: STACK TÉCNICO & SEGURIDAD */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-y border-white/5 py-16">
        <div className="flex items-center gap-6">
          <Lock className="text-gold-500" size={32} />
          <div>
            <h5 className="text-white font-black uppercase text-[11px] tracking-widest">Seguridad Militar</h5>
            <p className="text-white/30 text-[9px] uppercase font-bold">Anti-malware & Spam Defense</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Search className="text-gold-500" size={32} />
          <div>
            <h5 className="text-white font-black uppercase text-[11px] tracking-widest">SEO Dominance</h5>
            <p className="text-white/30 text-[9px] uppercase font-bold">Search Console & GA4 Index</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Layout className="text-gold-500" size={32} />
          <div>
            <h5 className="text-white font-black uppercase text-[11px] tracking-widest">Diseño Responsive</h5>
            <p className="text-white/30 text-[9px] uppercase font-bold">Optimized for All Devices</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Smartphone className="text-gold-500" size={32} />
          <div>
            <h5 className="text-white font-black uppercase text-[11px] tracking-widest">App Integration</h5>
            <p className="text-white/30 text-[9px] uppercase font-bold">WhatsApp & Chatbot Ready</p>
          </div>
        </div>
      </section>

      {/* SECTION: CONTACTO & MAPA */}
      <section id="contacto" className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
           <h3 className="text-4xl font-black text-white uppercase tracking-tighter">War Room Contact</h3>
           <div className="space-y-6">
              <div className="flex items-center gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                 <Phone className="text-gold-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Tele-Enlace Directo</p>
                    <p className="text-white font-bold">Solicitar Acceso Vía WhatsApp</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                 <Globe className="text-gold-500" size={20} />
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Canal Oficial Web</p>
                    <p className="text-white font-bold">www.productoraear.com</p>
                  </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white/[0.03] border border-white/5 rounded-3xl">
                 <MapPin className="text-gold-500" size={20} />
                 <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Dirección Operativa</p>
                    <p className="text-white font-bold">HQ // Operativo Caracas - Global</p>
                 </div>
              </div>
           </div>
           {/* REDES SOCIALES */}
           <div className="flex gap-4 pt-6">
              <button className="p-4 bg-white/5 hover:bg-gold-500 hover:text-black text-white rounded-2xl transition-all">
                <Instagram size={20} />
              </button>
              <button className="p-4 bg-white/5 hover:bg-gold-500 hover:text-black text-white rounded-2xl transition-all">
                <Facebook size={20} />
              </button>
              <button className="p-4 bg-white/5 hover:bg-gold-500 hover:text-black text-white rounded-2xl transition-all">
                <Twitter size={20} />
              </button>
              <button className="p-4 bg-white/5 hover:bg-gold-500 hover:text-black text-white rounded-2xl transition-all">
                <Linkedin size={20} />
              </button>
              <button className="p-4 bg-white/5 hover:bg-gold-500 hover:text-black text-white rounded-2xl transition-all">
                <Share2 size={20} />
              </button>
           </div>
        </div>

        <div className="relative h-[500px] bg-white/[0.03] border border-white/10 rounded-[40px] overflow-hidden group">
           <div className="absolute inset-0 grayscale contrast-150 opacity-30 group-hover:opacity-100 transition-all duration-1000">
             {/* SIMULACIÓN DE MAPA GOOGLE */}
             <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white/20 uppercase font-black text-[10px] tracking-[1em]">
                GOOGLE_MAPS_INTEGRATION_ONLINE
             </div>
           </div>
           <div className="absolute bottom-10 left-10 p-6 bg-black/80 backdrop-blur-xl border border-gold-500/20 rounded-2xl">
              <p className="text-gold-500 font-black uppercase text-[10px] mb-2 tracking-widest">Punto de Extracción</p>
              <p className="text-white text-xs font-bold leading-relaxed">Ubicación Estratégica Autorizada.<br/>Solicite acreditación para visita presencial.</p>
           </div>
        </div>
      </section>

    </div>
  );
};
