/**
 * 💰 MULTIPRICER S-CLASS - COST ARCHITECTURE & LEAD GENERATION
 * Purpose: Interactive pricing engine with public lead conversion funnel.
 */

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Cpu, Layout, Boxes, Zap, ArrowRight, Loader2, 
  Monitor, Video, Users, Activity, Heart, Mail, User, 
  MapPin, Calendar, FileText 
} from 'lucide-react';
import { useSovereignRole } from '@/shared/hooks/useSovereignRole';
import { createDossierFromLead } from '@/app/actions/dossierActions';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';

const SERVICES = {
  'SERVICIOS DE AUTOR': [
    { id: 'web', name: 'Diseño Web Completo', price: 4500, icon: <Monitor size={20} />, desc: 'Arquitectura digital S-Class.' },
    { id: 'video', name: 'Producción Video Cine', price: 3500, icon: <Video size={20} />, desc: 'Narrativa cinematográfica 4K.' },
    { id: 'event-corp', name: 'Gestión Evento Corp.', price: 7500, icon: <Users size={20} />, desc: 'Logística táctica empresarial.' },
    { id: 'consulting', name: 'Consultoría Estratégica', price: 2500, icon: <Shield size={20} />, desc: 'Diseño de planos y viabilidad.' }
  ],
  'LOGÍSTICA TÁCTICA': [
    { id: 'sound', name: 'Sonorización L-Acoustics', price: 5500, icon: <Activity size={20} />, desc: 'Presión sonora certificada.' },
    { id: 'light', name: 'Iluminación Robótica', price: 3500, icon: <Zap size={20} />, desc: 'Diseño lumínico inmersivo.' },
    { id: 'stage', name: 'Estructuras y Rigging', price: 4500, icon: <Boxes size={20} />, desc: 'Infraestructura de carga pesada.' },
    { id: 'streaming', name: 'Enlace Satelital / Stream', price: 2800, icon: <Layout size={20} />, desc: 'Conectividad global sin latencia.' }
  ],
  'EDWIN AGUDELO (S-CLASS)': [
    { id: 'edwin-solista', name: 'Edwin Agudelo - Solista', price: 1500, icon: <Shield size={20} />, desc: 'Voz & Piano/Base de alta fidelidad.' },
    { id: 'mariachi-gala', name: 'Mariachis (Mín. 6 Integrantes)', price: 2800, icon: <Users size={20} />, desc: 'Formación de gala, impacto total.' },
    { id: 'ritual-mariachi', name: 'Ritual Mariachi VIP', price: 4500, icon: <Shield size={20} />, desc: 'Protocolo de impacto con 12 músicos.' },
    { id: 'banda-monumental', name: 'Banda Monumental', price: 9500, icon: <Activity size={20} />, desc: '24 músicos, estruendo vanguardista.' }
  ]
};

const MultiPricerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { role } = useSovereignRole();
  const isB2G = role === 'ROLE_B2G';

  const [activeCategory, setActiveCategory] = useState('SERVICIOS DE AUTOR');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Form State
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    occasion: 'Gala Corporativa',
    province: 'Madrid'
  });

  // 📥 AUTO-LOAD FROM URL
  useEffect(() => {
    const items = searchParams.get('items');
    if (items) {
      const ids = items.split(',');
      setSelectedServices(ids);
      // Mover a la categoría del primer ítem si aplica
      const firstId = ids[0];
      for (const [cat, svcs] of Object.entries(SERVICES)) {
        if (svcs.some(s => s.id === firstId)) {
          setActiveCategory(cat);
          break;
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let currentTotal = 0;
    Object.values(SERVICES).flat().forEach(s => {
      if (selectedServices.includes(s.id)) {
        currentTotal += s.price;
      }
    });
    setTotal(currentTotal);
  }, [selectedServices]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedNames = Object.values(SERVICES).flat()
        .filter(s => selectedServices.includes(s.id))
        .map(s => s.name);

      const result = await createDossierFromLead({
        contactName: leadData.name,
        contactEmail: leadData.email,
        occasion: leadData.occasion,
        selectedAssets: selectedNames
      });

      if (result.success && result.dossierId) {
        marketplaceFeedback.track('lead_started', {
          metadata: { status: 'dossier_created', dossierId: result.dossierId }
        });
        router.push(`/dossier/${result.dossierId}`);
      } else {
        alert(result.error || "Fallo técnico en la generación del dossier.");
      }
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 relative">
      {/* 🚀 FORM OVERLAY (S-CLASS UX) */}
      <AnimatePresence>
        {showLeadForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-3xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 40 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-xl bg-[#0a0a0a] border border-[#d4a855]/30 rounded-[3rem] p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setShowLeadForm(false)}
                className="absolute top-8 right-8 text-white/20 hover:text-white"
              >
                Cerrar
              </button>

              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-8">
                Validar <span className="text-[#d4a855]">Identidad</span>
              </h3>

              <form onSubmit={handleSubmitLead} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Nombre / Organización</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a855]" size={18} />
                    <input 
                      required
                      type="text" 
                      value={leadData.name}
                      onChange={e => setLeadData({...leadData, name: e.target.value})}
                      placeholder="Ej. Ayuntamiento de Madrid"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 text-white focus:border-[#d4a855] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Email Corporativo / Institucional</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a855]" size={18} />
                    <input 
                      required
                      type="email" 
                      value={leadData.email}
                      onChange={e => setLeadData({...leadData, email: e.target.value})}
                      placeholder="nombre@organizacion.es"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl pl-12 pr-6 text-white focus:border-[#d4a855] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Ocasión</label>
                    <select 
                      value={leadData.occasion}
                      onChange={e => setLeadData({...leadData, occasion: e.target.value})}
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#d4a855] outline-none"
                    >
                      <option className="bg-black">Gala Corporativa</option>
                      <option className="bg-black">Evento Municipal</option>
                      <option className="bg-black">Producción Privada Élite</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Territorio</label>
                    <input 
                      type="text" 
                      value={leadData.province}
                      onChange={e => setLeadData({...leadData, province: e.target.value})}
                      placeholder="Madrid"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:border-[#d4a855] outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-16 bg-[#d4a855] text-black font-black uppercase tracking-widest rounded-2xl mt-8 flex items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl shadow-[#d4a855]/20"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>GENERAR PROPUESTA TÉCNICA <FileText size={18} /></>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-20">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/20 text-[#d4a855] text-[9px] font-black uppercase tracking-[0.4em] mb-6">
          <Shield size={12} /> GARANTÍA TÉCNICA EAR
        </span>
        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.8] mb-8">
          Cotizador <span className="text-[#d4a855]">Premium</span>
        </h2>
        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest max-w-md mx-auto leading-relaxed">
          Arquitectura de costes de alta fidelidad. Selecciona tus activos y genera tu dossier institucional.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Selector Left */}
        <div className="lg:col-span-8 glass-panel p-8 lg:p-12 rounded-[3rem] border-white/5 bg-white/[0.01]">
          <div className="flex gap-4 mb-12 overflow-x-auto pb-4 scrollbar-hide">
            {Object.keys(SERVICES).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  activeCategory === cat 
                    ? 'bg-[#d4a855] text-black shadow-[0_10px_30px_rgba(212,168,85,0.3)]' 
                    : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="col-span-full grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {SERVICES[activeCategory as keyof typeof SERVICES].map(service => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`group relative p-8 rounded-[2.5rem] border transition-all duration-500 flex flex-col items-start text-left ${
                        isSelected 
                          ? 'bg-[#d4a855]/10 border-[#d4a855] shadow-[0_0_40px_rgba(212,168,85,0.1)]' 
                          : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 transition-all ${
                        isSelected ? 'bg-[#d4a855] text-black' : 'bg-white/5 text-white/30 group-hover:text-white'
                      }`}>
                        {service.icon}
                      </div>
                      <h4 className={`text-xl font-black uppercase tracking-tighter mb-2 ${isSelected ? 'text-[#d4a855]' : 'text-white'}`}>
                        {service.name}
                      </h4>
                      <p className="text-white/20 text-[9px] font-bold uppercase tracking-widest mb-6">{service.desc}</p>
                      <span className={`text-lg font-black italic ${isSelected ? 'text-white' : 'text-white/40'}`}>
                        DESDE {service.price}€
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Summary Right */}
        <div className="lg:col-span-4 sticky top-32">
          <div className="bg-white rounded-[3rem] p-10 lg:p-12 text-black shadow-2xl overflow-hidden relative">
            <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-12 border-b border-black/5 pb-8">
              Resumen <span className="text-[#d4a855]">Técnico</span>
            </h3>

            <div className="space-y-6 mb-12 min-h-[150px]">
              {selectedServices.length === 0 ? (
                <p className="text-black/30 text-[10px] font-bold uppercase tracking-[0.2em] italic">
                  Selecciona servicios para iniciar la arquitectura de costes.
                </p>
              ) : (
                Object.values(SERVICES).flat().filter(s => selectedServices.includes(s.id)).map(s => (
                  <div key={s.id} className="flex justify-between items-center group">
                    <span className="text-[10px] font-black uppercase tracking-widest text-black/60 group-hover:text-black transition-colors">{s.name}</span>
                    <span className="text-[11px] font-black italic">{s.price}€</span>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-black/5 pt-8 mb-12">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 block mb-2">Inversión Estimada</span>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black tracking-tighter italic">{total}</span>
                <span className="text-2xl font-black">€</span>
              </div>
            </div>

            <button
              onClick={() => setShowLeadForm(true)}
              disabled={total === 0 || loading}
              className={`w-full py-6 rounded-2xl font-black text-[11px] tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 ${
                total === 0 || loading
                  ? 'bg-black/5 text-black/20 cursor-not-allowed'
                  : 'bg-black text-white hover:bg-[#d4a855] hover:shadow-[0_20px_40px_rgba(212,168,85,0.3)] active:scale-95'
              }`}
            >
              VALIDAR & RESERVAR <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiPricer = () => (
  <Suspense fallback={<div className="p-20 text-center text-white/20">Cargando Motor Financiero...</div>}>
    <MultiPricerContent />
  </Suspense>
);
