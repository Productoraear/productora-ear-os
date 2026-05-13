"use client";

import React, { Suspense } from 'react';
import { useTripwire } from '@/hooks/useTripwire';
import { useRouter } from 'next/navigation';
import { Shield, Zap, ArrowRight, Download, Play, Sparkles } from 'lucide-react';
import { BespokePricer } from '@/features/finance/ui/BespokePricer';
import { PredatorNav } from '@/widgets/navigation/PredatorNav';
import { NeuralFilters } from '@/features/search/NeuralFilters';
import { useSovereignContext } from '@/shared/context/SovereignContext';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getTemplateForProvince, getTemplateConfig } from '@/shared/utils/templateEngine';
import { SpinningText } from './SpinningText';
import { MediaShowcase } from './MediaShowcase';
import Image from 'next/image';
import { Star, Trophy, Music, Award, History, Mic2, Heart } from 'lucide-react';
import Link from 'next/link';

interface BespokeTemplateProps {
  title: string;
  description: string;
  location: string;
  serviceId: string;
  keywords: string[];
  isApex?: boolean;
}

export const BespokeTemplate: React.FC<BespokeTemplateProps> = ({
  title,
  description,
  location,
  serviceId,
  keywords,
}) => {
  const { igniteTripwire } = useTripwire();
  const { signal, isMounted } = useSovereignContext();
  const router = useRouter();
  const pathname = usePathname();
  const capitalizedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  // Multivariate Engine Activation
  const templateId = getTemplateForProvince(location.toLowerCase());
  const config = getTemplateConfig(templateId, capitalizedLocation);

  const handleAction = (action: string) => {
    igniteTripwire('bespoke_action', { action, serviceId, location });
    if (action === 'reserve') {
        router.push('/cotizador');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#d4a855]/30">
      <PredatorNav />
      
      {/* 2050 Hero: Minimalist & Deep */}
      <section className="relative pt-48 pb-40 px-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b ${config.gradient} to-transparent blur-[120px]`} />
        </div>

        {/* AUTHORITY SEAL: Gladiadores 2021 */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="fixed top-32 right-8 z-[100] hidden lg:flex flex-col items-center gap-2"
        >
          <div className="glass-panel p-4 rounded-full border-[#d4a855]/30 bg-[#d4a855]/10 backdrop-blur-xl flex items-center justify-center relative group">
            <Trophy size={24} className="text-[#d4a855] group-hover:scale-125 transition-transform duration-500" />
            <div className="absolute -inset-2 rounded-full border border-[#d4a855]/20 animate-pulse" />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-[#d4a855]">Gladiador 2021</span>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-white/40">+20 Años de Élite</span>
          </div>
        </motion.div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#d4a855]/50" />
                <span className="text-[10px] font-black tracking-[0.6em] uppercase transition-colors" style={{ color: config.accentColor }}>
                  {config.tagline} • {capitalizedLocation}
                </span>
              </div>
              <SpinningText 
                text="EDWIN AGUDELO • S-CLASS ARTIST • " 
                radius={30} 
                fontSize="6px" 
                className="flex md:hidden"
              />
              <SpinningText 
                text="EDWIN AGUDELO • S-CLASS ARTIST • " 
                radius={40} 
                fontSize="7px" 
                className="hidden md:flex"
              />
            </div>

            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase max-w-5xl">
              {title} <br />
              <span className="text-white/10 italic">{capitalizedLocation}</span>
            </h1>

            <div className="flex flex-col md:flex-row justify-between items-end gap-12">
              <div className="flex flex-col gap-6 max-w-xl">
                <p className="text-lg text-white/40 leading-relaxed font-medium uppercase tracking-tight">
                  {config.copy}
                </p>
                <div className="flex flex-wrap gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-[#d4a855]/60">
                  <span className="flex items-center gap-2"><Music size={10} /> Mariachi</span>
                  <span className="flex items-center gap-2"><Heart size={10} /> Bolero</span>
                  <span className="flex items-center gap-2"><Mic2 size={10} /> Balada</span>
                  <span className="flex items-center gap-2"><Zap size={10} /> Popular</span>
                  <span className="flex items-center gap-2"><Star size={10} /> Ecuestre</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleAction('reserve')}
                  className="btn-sclass btn-sclass-primary rounded-[2rem]"
                >
                  <span className="flex items-center gap-3">Contratar <Zap size={14} /></span>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/servicios/innovacion-social')}
                  className="btn-sclass btn-sclass-outline rounded-[2rem] border-pink-500/30 text-pink-500"
                >
                  VIMUME Social
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Neural Interface Section */}
      <section className="px-4 md:px-8 -mt-20 relative z-50">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel p-1 rounded-[2rem] md:rounded-[3rem]">
            <Suspense fallback={<div className="w-full h-32 animate-pulse" />}>
              <NeuralFilters />
            </Suspense>
          </div>
        </div>
      </section>

      {/* VAMPIRIZED DOSSIER: Legado y Trayectoria */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <div className="flex items-center gap-4">
                <History className="text-[#d4a855]" size={20} />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Legado Certificado</span>
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
                Edwin Agudelo: <br />
                <span className="text-white/20">La Autoridad S-Class</span>
              </h2>
              
              <p className="text-lg text-white/60 font-medium leading-relaxed">
                Nacido el 28 de octubre de 1975 en Amagá-Antioquia y formado en las exigentes ligas de Medellín, Edwin Agudelo inició su ascenso a los 16 años con "Tropical Mix". Tras emigrar a España a los 22 años, dominó la industria como director de salas, orquestando 37 conciertos internacionales antes de consolidarse como el Master Artist S-Class que hoy define la excelencia del Mariachi y la Balada en Europa. Bajo su sello "Sin Igual", lidera una revolución musical con enfoque de igualdad y soberanía emocional.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: Trophy, label: "Hito", text: "+37 Conciertos Int." },
                  { icon: Award, label: "Portada", text: "Reflejo Latino" },
                  { icon: Music, label: "Proyecto", text: "Sello Sin Igual" },
                  { icon: Mic2, label: "Impacto", text: "Iberoamérica TV" }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-2 p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:bg-white/[0.05] transition-all">
                    <item.icon size={18} className="text-[#d4a855] mb-2" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/20">{item.label}</span>
                    <span className="text-sm font-bold text-white uppercase">{item.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-video lg:aspect-square glass-panel p-2 rounded-[3rem] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <Image 
                src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=1000" 
                alt="Edwin Agudelo Performance" 
                fill
                className="object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000"
              />
              <div className="absolute bottom-10 left-10 z-20">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#d4a855]">Snapshot de Dominancia</span>
                <p className="text-2xl font-black text-white uppercase tracking-tighter mt-2">Gala de Excelencia 2024</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* MEDIA SHOWCASE: Videos & Images */}
      <section className="relative">
        <MediaShowcase />
        
        {/* YOUTUBE IGNITION LOOP (Directiva V163) */}
        <div className="absolute bottom-10 left-10 z-30">
          <motion.a 
            href="https://www.youtube.com/@EdwinAgudelo?sub_confirmation=1" 
            target="_blank" 
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, x: 10 }}
            className="glass-panel p-6 rounded-2xl flex items-center gap-4 border-red-500/30 bg-red-500/5 backdrop-blur-2xl group/yt shadow-[0_0_50px_rgba(239,68,68,0.1)]"
          >
            <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-600/20">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-[12px] border-l-white border-b-8 border-b-transparent ml-1" />
            </div>
            <div>
              <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-red-500 mb-1 group-hover/yt:text-white transition-colors">Súmate a la visión</span>
              <span className="block text-sm font-black uppercase text-white tracking-tighter italic">Suscríbete al Canal Oficial</span>
            </div>
          </motion.a>
        </div>
      </section>

      {/* Feature Architecture */}
      <section className="py-48 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">
          
          <div className="lg:col-span-4 sticky top-32">
            <BespokePricer 
              category={title} 
              basePrice={serviceId.includes('solista') ? 1500 : (serviceId.includes('mariachi') ? 2800 : 3500)} 
              metadata={{ ui_template: templateId, provincia: location }}
            />
          </div>

          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keywords.map((kw, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-panel p-10 rounded-[3rem] group"
                >
                  <div className="flex justify-between items-start mb-12">
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[#d4a855] text-[10px] font-black">
                      0{i + 1}
                    </div>
                    <Sparkles size={16} className="text-white/10 group-hover:text-[#d4a855] transition-colors" />
                  </div>
                  <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{kw}</h3>
                  <p className="text-[11px] text-white/30 font-medium leading-relaxed uppercase tracking-widest">
                    Protocolo de excelencia validado para {capitalizedLocation}.
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* IMPACTO SOCIAL: VIMUME Anchor */}
      <section className="py-32 px-8 bg-gradient-to-b from-transparent to-pink-900/10 border-y border-white/5 relative overflow-hidden group">
        <div className="absolute inset-0 bg-pink-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-4">
              <Heart className="text-pink-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-pink-500/60">Ancla de Propósito</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
              Tu evento en {capitalizedLocation} <br />
              <span className="text-pink-500">Financia la Memoria</span>
            </h2>
            <p className="text-lg text-white/50 font-medium leading-relaxed italic">
              Al contratar este protocolo S-Class, una parte del CommissionLedger se destina automáticamente al programa VIMUME, activando sesiones de musicoterapia para los mayores de la provincia de {capitalizedLocation}.
            </p>
          </div>
          <Link href="/vimume" className="btn-sclass border-pink-500/30 text-pink-500 hover:bg-pink-500 hover:text-white px-12 py-6 rounded-full flex items-center gap-4 group/social transition-all">
            <span className="text-xs font-black uppercase tracking-widest">Saber más de VIMUME</span>
            <ArrowRight size={16} className="group-hover/social:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>

      <section className="py-40 border-t border-white/5 bg-[#080808] relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8">
          <div className="flex flex-col items-center text-center mb-24">
            <Shield className="text-[#d4a855] mb-6" size={48} />
            <span className="text-[#d4a855] text-[10px] font-black uppercase tracking-[0.5em] mb-4">El Oráculo S-Class</span>
            <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">Claridad <span className="text-white/40">Operativa</span></h2>
          </div>
          
          <div className="space-y-6">
            {[
              {
                q: "¿Por qué este precio?",
                a: "No vendemos músicos por horas. Contrata una infraestructura completa: ingeniería de sonido S-Class, logística redundante, puntualidad militar y un artista con +20 años de dominio escénico. El precio asegura que nada falle."
              },
              {
                q: "¿Cómo ayuda esto a mi municipio o empresa?",
                a: "Al contratar a Edwin Agudelo, un porcentaje de la operación (El CommissionLedger) se destina automáticamente al fondo VIMUME, financiando musicoterapia para mayores en su área. Reciprocidad y estatus."
              },
              {
                q: "¿Qué pasa con la logística y el repertorio?",
                a: "Vampirizamos y dominamos la historia del mariachi y la balada. Desde 'Acompáñame' hasta clásicos vernáculos. Llevamos equipos propios de Alta Fidelidad. Usted solo debe disfrutar de la dominancia del evento."
              }
            ].map((faq, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 border border-white/5 rounded-2xl bg-white/[0.01]"
              >
                <h4 className="text-sm font-black uppercase tracking-widest mb-3 text-[#d4a855]">{faq.q}</h4>
                <p className="text-xs text-white/50 leading-relaxed font-bold uppercase">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sovereign Quote Section */}
      <section className="py-40 border-t border-white/5 relative">
        <div className="max-w-5xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="space-y-12"
          >
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-none">
              Orquestación <span className="text-[#d4a855]">Sovereign</span>
            </h2>
            <p className="text-xl md:text-2xl text-white/40 leading-relaxed font-medium italic">
              "En Productora EAR no alquilamos equipos; desplegamos infraestructuras de dominancia emocional certificadas para el más alto nivel B2G."
            </p>
            <div className="flex justify-center gap-16 pt-12">
              {[
                { label: "SLA", val: "100%" },
                { label: "Provincias", val: "52" },
                { label: "Estatus", val: "GOLD" }
              ].map((s, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-4xl font-black text-white">{s.val}</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#d4a855]/50">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-24 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8">
          
          <div className="flex flex-col items-center justify-center p-8 bg-green-500/5 border border-green-500/20 rounded-2xl mb-16 text-center">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-green-500" size={24} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-green-500">Sello de Transparencia EAR GOLD</span>
            </div>
            <p className="text-[10px] text-white/60 uppercase font-black tracking-widest max-w-2xl">
              Este sistema opera bajo datos reales. Cero reseñas ficticias. Cero métricas infladas. Soberanía garantizada.
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col gap-4">
              <span className="text-xl font-black tracking-tighter uppercase">Productora<span className="text-[#d4a855]">EAR</span></span>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em] max-w-sm">
                Edwin Agudelo: Compromiso con el Arte de Calidad y la Memoria Social.
              </p>
            </div>
            <div className="flex gap-8">
              <Link href="/servicios/innovacion-social" className="text-[9px] font-black uppercase tracking-widest text-[#d4a855] hover:text-white transition-colors">Innovación Social VIMUME</Link>
              <span className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">© 2026 S-Class Infrastructure</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

