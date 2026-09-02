"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Heart, Share2, Shield, Info, ArrowRight, Zap, CheckCircle2, Music2, ShieldCheck, Music } from 'lucide-react';

interface ServiceGeneratorProps {
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  priceRange: string;
  location: string;
  highlights: string[];
}

export default function ServiceGenerator({
  title = "Producción Musical de Élite para Bodas",
  subtitle = "Experiencia S-Class // Curada por Kamal",
  description = "Transformamos el día más importante de su vida en una obra de arte sonora. Desde la ceremonia civil hasta la pista de baile más vibrante, nuestro equipo de ingenieros y artistas garantiza un despliegue impecable bajo el estándar EAR OS.",
  images = [
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800"
  ],
  priceRange = "Desde €2.500",
  location = "España // Internacional",
  highlights = [
    "Sistema de Sonido HK Audio de Alta Fidelidad",
    "DJ Performance con Selección Curada 360",
    "Producción Técnica e Iluminación S-Class",
    "Garantía de Despliegue Táctico EAR OS"
  ]
}: Partial<ServiceGeneratorProps>) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37] selection:text-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* Header HUD Style */}
        <div className="flex flex-col lg:flex-row justify-between items-end mb-8 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-[#d4af37] font-mono tracking-widest text-[10px] font-black uppercase">
              <Zap className="w-4 h-4 fill-[#d4af37]" />
              <span>Generador de Servicios (Service Generator) // Tipo_S-Class</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black font-display tracking-tighter leading-none uppercase">{title}</h1>
            <p className="text-xl text-zinc-500 font-medium italic underline underline-offset-8 decoration-[#d4af37]/30">{subtitle}</p>
          </div>
          <div className="flex gap-4 pb-2">
            <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all"><Share2 className="w-5 h-5" /></button>
            <button className="w-12 h-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-all text-[#d4af37]"><Heart className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Gallery Grid (Airbnb Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[500px] mb-12 rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group">
          <div className="lg:col-span-2 relative overflow-hidden">
            <img src={images[0]} alt="Imagen Principal" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          <div className="grid grid-rows-2 gap-4 lg:col-span-1">
            <div className="relative overflow-hidden">
              <img src={images[1]} alt="Imagen Interior 1" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
            </div>
            <div className="relative overflow-hidden">
              <img src={images[2]} alt="Imagen Interior 2" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3s]" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
            </div>
          </div>
          <div className="lg:col-span-1 relative overflow-hidden bg-zinc-900 flex items-center justify-center p-8 group-hover:bg-zinc-800 transition-all">
             <div className="text-center space-y-4">
                <div className="text-[#d4af37] font-black text-4xl font-mono tracking-tighter">15+</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Años de Dominancia</div>
                <button className="mt-4 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest hover:border-[#d4af37] transition-all">Ver Galería Full</button>
             </div>
          </div>
        </div>

        {/* Content Layout (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
          
          {/* Left: Storytelling */}
          <div className="lg:col-span-8 space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight uppercase border-b border-white/5 pb-6">Descripción de la Misión</h2>
              <div className="prose prose-invert prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed max-w-none">
                <p>{description}</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                   <div className="flex flex-col gap-2 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <Music className="w-8 h-8 text-[#d4af37]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">Audio HQ</span>
                      <p className="text-[10px] text-zinc-600">Presión sonora controlada.</p>
                   </div>
                   <div className="flex flex-col gap-2 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <Shield className="w-8 h-8 text-[#d4af37]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">Secure Booking</span>
                      <p className="text-[10px] text-zinc-600">Protocolo de contrato digital.</p>
                   </div>
                   <div className="flex flex-col gap-2 p-6 bg-zinc-900/50 rounded-2xl border border-white/5">
                      <Star className="w-8 h-8 text-[#d4af37]" />
                      <span className="text-xs font-black uppercase tracking-widest text-[#d4af37]">VIP Care</span>
                      <p className="text-[10px] text-zinc-600">Atención personalizada 24/7.</p>
                   </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-3xl font-black tracking-tight uppercase border-b border-white/5 pb-6">Aspectos Destacados</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-4 bg-zinc-900/30 p-6 rounded-3xl border border-white/5 hover:border-[#d4af37]/30 transition-all">
                    <CheckCircle2 className="w-6 h-6 text-[#d4af37] shrink-0" />
                    <span className="text-sm font-bold text-zinc-300">{h}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="bg-zinc-900/50 p-12 rounded-[3.5rem] border border-white/5 flex flex-col items-center text-center space-y-6">
               <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center border border-[#d4af37]/20 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <ShieldCheck className="w-10 h-10 text-[#d4af37]" />
               </div>
               <h4 className="text-2xl font-black tracking-tighter uppercase">Compromiso Kamal S-Class</h4>
               <p className="max-w-md text-zinc-500 text-sm italic">"Cada evento es una huella estratégica. No nos limitamos a poner música; diseñamos el paisaje emocional de su boda."</p>
               <div className="flex items-center gap-2 pt-4">
                  <div className="h-0.5 w-12 bg-[#d4af37]/20" />
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-[#d4af37]">DIRECTIVA NÚCLEO EAR 03 (EAR CORE DIRECTIVE 03)</span>
                  <div className="h-0.5 w-12 bg-[#d4af37]/20" />
               </div>
            </section>
          </div>

          {/* Right: Sticky Sidebar (Uber/Airbnb Style) */}
          <div className="lg:col-span-4 h-fit sticky top-32">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-8 shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
              
              <div className="flex justify-between items-end mb-4">
                <div className="flex flex-col">
                  <span className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mb-1">Valor de Impacto (Impact Value)</span>
                  <div className="text-4xl font-black font-mono tracking-tighter text-[#d4af37]">{priceRange}</div>
                </div>
                <div className="flex items-center gap-1 text-[#d4af37] border border-[#d4af37]/30 px-2 py-1 rounded bg-[#d4af37]/5">
                  <Star className="w-3 h-3 fill-[#d4af37]" />
                  <span className="text-xs font-black">5.0</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative group">
                   <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-hover:text-[#d4af37] transition-all">
                      <Calendar className="w-4 h-4" />
                   </div>
                   <div className="w-full bg-black border border-white/10 rounded-2xl h-14 pl-12 pr-4 flex items-center text-xs font-bold text-zinc-400">
                      Seleccionar Fecha del Evento
                   </div>
                </div>
                <div className="relative group text-left">
                   <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-hover:text-[#d4af37] transition-all">
                      <MapPin className="w-4 h-4" />
                   </div>
                   <div className="w-full bg-black border border-white/10 rounded-2xl h-14 pl-12 pr-4 flex items-center text-xs font-bold text-zinc-400">
                      {location}
                   </div>
                </div>
              </div>

              <button className="w-full bg-[#d4af37] text-black h-16 rounded-full text-sm font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 hover:bg-[#f0c541] hover:scale-105 transition-all shadow-[0_0_30px_rgba(212,175,55,0.2)]">
                SOLICITAR DESPLIEGUE <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                 <p className="text-[9px] text-zinc-700 uppercase tracking-[0.2em] font-black">Ningún cargo se aplicará hasta la fase de validación</p>
              </div>

              <div className="pt-8 border-t border-white/5 space-y-4">
                 <div className="flex justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                    <span>Cargos de Producción</span>
                    <span className="text-zinc-500">Incluido</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-medium text-zinc-400 uppercase tracking-widest">
                    <span>Logística EAR OS</span>
                    <span className="text-zinc-500">Incluido</span>
                 </div>
                 <div className="flex justify-between text-[11px] font-black text-white uppercase tracking-[0.2em] pt-4 border-t border-white/5">
                    <span>Total Estimado</span>
                    <span className="text-[#d4af37]">{priceRange}</span>
                 </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-[#d4af37]/30 transition-all cursor-pointer">
                 <Info className="w-5 h-5 text-zinc-500 group-hover:text-[#d4af37]" />
                 <span className="text-[9px] text-zinc-500 uppercase font-black leading-tight tracking-widest">¿Necesitas algo más complejo? Contacta con el equipo de despliegue táctico.</span>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Sub-components as icons helpers
// Handled via main imports at the top

