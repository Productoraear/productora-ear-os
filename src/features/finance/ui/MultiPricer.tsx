/**
 * 💰 MULTIPRICER S-CLASS - ADVANCED COST ARCHITECTURE & QUOTATION ENGINE (2026 EDITION)
 * Purged of generic web services. 100% focused on Artistic Booking, S-Class Acoustics & Institutional Event Production.
 */

"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Boxes, ArrowRight, Loader2, Users, Activity, 
  Mail, User, MapPin, Calendar, FileText, CheckCircle2, 
  Sparkles, CreditCard, Clock, Truck, Award, Phone, MessageCircle
} from 'lucide-react';
import { PRICING_CATALOG } from '@/lib/constants/pricing-catalog';
import { SClassPricingEngine, SClassQuote } from '@/lib/pricing-engine';
import { PriceLockBadge } from '@/features/finance/ui/PriceLockBadge';
import { createDossierFromLead } from '@/app/actions/dossierActions';
import { createEliteCheckout } from '@/app/actions/checkoutActions';
import { marketplaceFeedback } from '@/services/marketplace/MarketplaceFeedbackService';
import { CENTRALITA } from '@/lib/phone-constants';
import { generateWhatsAppLink } from '@/lib/whatsapp';

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  icon: React.ReactNode;
  desc: string;
  category: string;
}

const SERVICES_CATALOG: Record<string, ServiceItem[]> = {
  'BOOKING ARTÍSTICO DE GALA': [
    { id: PRICING_CATALOG['clasico-esencial'].id, name: PRICING_CATALOG['clasico-esencial'].name, price: PRICING_CATALOG['clasico-esencial'].basePrice, icon: <Sparkles size={20} />, desc: PRICING_CATALOG['clasico-esencial'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['premium-gala'].id, name: PRICING_CATALOG['premium-gala'].name, price: PRICING_CATALOG['premium-gala'].basePrice, icon: <Users size={20} />, desc: PRICING_CATALOG['premium-gala'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['cuarteto-imperial'].id, name: PRICING_CATALOG['cuarteto-imperial'].name, price: PRICING_CATALOG['cuarteto-imperial'].basePrice, icon: <Award size={20} />, desc: PRICING_CATALOG['cuarteto-imperial'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['quinteto-honor'].id, name: PRICING_CATALOG['quinteto-honor'].name, price: PRICING_CATALOG['quinteto-honor'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['quinteto-honor'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['sinfonico-royal'].id, name: PRICING_CATALOG['sinfonico-royal'].name, price: PRICING_CATALOG['sinfonico-royal'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['sinfonico-royal'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['octeto-magistral'].id, name: PRICING_CATALOG['octeto-magistral'].name, price: PRICING_CATALOG['octeto-magistral'].basePrice, icon: <Activity size={20} />, desc: PRICING_CATALOG['octeto-magistral'].description, category: 'BOOKING' },
    { id: PRICING_CATALOG['banda-monumental'].id, name: PRICING_CATALOG['banda-monumental'].name, price: PRICING_CATALOG['banda-monumental'].basePrice, icon: <Boxes size={20} />, desc: PRICING_CATALOG['banda-monumental'].description, category: 'BOOKING' }
  ],
  'PRODUCCIÓN & SONORIZACIÓN S-CLASS': [
    { id: 'pa-lacoustics', name: 'Sonorización L-Acoustics K2 / Kara', price: 1800, icon: <Activity size={20} />, desc: 'Presión acústica cristalina sin distorsión certificada.', category: 'PRODUCCION' },
    { id: 'light-dmx', name: 'Iluminación Robótica & Cabezas Móviles', price: 1200, icon: <Zap size={20} />, desc: 'Show lumínico sincronizado Beam / Wash de alta potencia.', category: 'PRODUCCION' },
    { id: 'trussing-stage', name: 'Tarima & Estructuras Trussing Homologadas', price: 1500, icon: <Boxes size={20} />, desc: 'Infraestructura de carga y rigging para gran formato.', category: 'PRODUCCION' },
    { id: 'wireless-axient', name: 'Microfonía Shure Axient Digital', price: 650, icon: <Shield size={20} />, desc: 'Zero interferencias con escaneo de frecuencias UHF.', category: 'PRODUCCION' }
  ],
  'LOGÍSTICA & DIRECCIÓN INSTITUCIONAL': [
    { id: 'musical-direction', name: 'Dirección Musical & Arreglos de Autor', price: 850, icon: <Sparkles size={20} />, desc: 'Partituras y adaptación de repertorio a medida del cliente.', category: 'LOGISTICA' },
    { id: 'tactical-fleet', name: 'Flota Táctica & Desplazamiento Seguro', price: 350, icon: <Truck size={20} />, desc: 'Transporte de instrumentos de alta gama y artistas con puntualidad militar.', category: 'LOGISTICA' },
    { id: 'civil-insurance', name: 'Póliza RC 1.000.000€ & Alta Seguridad Social', price: 250, icon: <Shield size={20} />, desc: 'Cumplimiento legal estricto para recintos protegidos y galas.', category: 'LOGISTICA' },
    { id: 'b2g-tender', name: 'Pliegos Técnicos & Licitación B2G', price: 950, icon: <FileText size={20} />, desc: 'Documentación homologada para Ayuntamientos y Sector Público.', category: 'LOGISTICA' }
  ]
};

const PROVINCE_RATES: Record<string, { multiplier: number, label: string }> = {
  'Madrid': { multiplier: 1.0, label: 'Sede Central (0€ Desplazamiento extra)' },
  'Toledo': { multiplier: 1.05, label: 'Zona Centro (+5%)' },
  'Guadalajara': { multiplier: 1.05, label: 'Zona Centro (+5%)' },
  'Segovia': { multiplier: 1.08, label: 'Castilla y León (+8%)' },
  'Valencia': { multiplier: 1.15, label: 'Levante (+15%)' },
  'Barcelona': { multiplier: 1.20, label: 'Cataluña (+20%)' },
  'Sevilla': { multiplier: 1.20, label: 'Andalucía (+20%)' },
  'Resto España': { multiplier: 1.25, label: 'Nacional (+25%)' }
};

const MultiPricerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeCategory, setActiveCategory] = useState<string>('BOOKING ARTÍSTICO DE GALA');
  const [selectedServices, setSelectedServices] = useState<string[]>(['cuarteto-gala']);
  const [selectedProvince, setSelectedProvince] = useState<string>('Madrid');
  const [urgencyLevel, setUrgencyLevel] = useState<'ESTANDAR' | 'PRIORITARIA' | 'EXPRESS'>('ESTANDAR');
  const [includeVAT, setIncludeVAT] = useState<boolean>(true);
  const [pax, setPax] = useState<number>(150);
  const [quote, setQuote] = useState<SClassQuote | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);

  // Form State
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: 'Gala de Empresa / Boda VIP',
    eventDate: ''
  });

  const [artistTarget, setArtistTarget] = useState<string | null>(null);

  // 📥 AUTO-LOAD FROM URL PARAMS (ITEMS & ARTISTA TARGET)
  useEffect(() => {
    const artista = searchParams.get('artista') || searchParams.get('artist');
    if (artista && (artista.toLowerCase().includes('edwin') || artista.toLowerCase().includes('agudelo'))) {
      setArtistTarget('Edwin Agudelo (Tenor Lírico / Mariachi Imperial)');
      setSelectedServices(['cuarteto-imperial']);
      setActiveCategory('BOOKING ARTÍSTICO DE GALA');
      setSelectedProvince('Madrid');
    }

    const items = searchParams.get('items');
    if (items) {
      const ids = items.split(',');
      setSelectedServices(ids);
      const firstId = ids[0];
      for (const [cat, svcs] of Object.entries(SERVICES_CATALOG)) {
        if (svcs.some(s => s.id === firstId)) {
          setActiveCategory(cat);
          break;
        }
      }
    }
  }, [searchParams]);

  // --- ADVANCED FORMULA ENGINE (S-CLASS) ---
  useEffect(() => {
    let isActive = true;

    const fetchQuote = async () => {
      try {
        const distanceKm = selectedProvince === 'Madrid' ? 0 : 
                          selectedProvince === 'Valencia' ? 350 :
                          selectedProvince === 'Barcelona' ? 620 :
                          selectedProvince === 'Sevilla' ? 530 : 100;
        
        const mappedUrgency = urgencyLevel === 'ESTANDAR' ? 'STANDARD' :
                              urgencyLevel === 'PRIORITARIA' ? 'PRIORITY' : 'EXPRESS';

        // Usamos el primer ID seleccionado como base para el engine
        // Si no se encuentra (ej: son servicios logísticos puros), usamos clasico-esencial como base técnica
        const formatId = PRICING_CATALOG[selectedServices[0]] ? selectedServices[0] : 'clasico-esencial';

        const q = await SClassPricingEngine.generateQuote({
          formatId,
          pax,
          distanceKm,
          urgency: mappedUrgency
        });
        
        if (isActive) {
          setQuote(q);
        }
      } catch (err) {
        console.error("Error generating quote:", err);
      }
    };

    fetchQuote();

    return () => { isActive = false; };
  }, [selectedServices, selectedProvince, urgencyLevel, pax]);

  const toggleService = (id: string) => {
    setSelectedServices(prev => 
      prev.includes(id) ? (prev.length > 1 ? prev.filter(s => s !== id) : prev) : [...prev, id]
    );
  };

  const handleInstantStripeDeposit = async () => {
    setLoading(true);
    try {
      const depositVal = quote?.depositAmount ?? 0.50;
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositVal,
          concept: `Depósito Garantía S-Class (${quote?.sha256Token || '72H-LOCK'})`,
          metadata: {
            sha256Token: quote?.sha256Token || '',
            formatId: selectedServices[0] || 'clasico-esencial',
            pax: pax,
            province: selectedProvince,
            finalTotal: quote?.finalTotal || 0,
            deposit: depositVal
          }
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Error al conectar con la pasarela Stripe');
      }
    } catch (err) {
      console.error(err);
      alert('Iniciando pasarela de reserva segura...');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const allServices = Object.values(SERVICES_CATALOG).flat();
      const selectedNames = allServices
        .filter(s => selectedServices.includes(s.id))
        .map(s => s.name);

      const result = await createDossierFromLead({
        contactName: leadData.name,
        contactEmail: leadData.email,
        occasion: `${leadData.occasion} [${selectedProvince}] (Total: ${quote?.finalTotal || 0}€)`,
        selectedAssets: selectedNames
      });

      if (result.success && result.dossierId) {
        marketplaceFeedback.track('lead_started', {
          metadata: { status: 'dossier_created', dossierId: result.dossierId, total: quote?.finalTotal || 0 }
        });
        router.push(`/dossier/${result.dossierId}`);
      } else {
        alert(result.error || "Generación de propuesta técnica en curso.");
      }
    } catch (err) {
      console.error("Lead submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative text-white space-y-8 sm:space-y-12 pb-36 lg:pb-12">
      {/* 🚀 FORM OVERLAY (DOSSIER & FORMAL TENDER) */}
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
              className="w-full max-w-xl bg-[#0e0e0e] border border-[#d4a855]/30 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 relative overflow-y-auto max-h-[90vh] shadow-2xl space-y-5"
            >
              <button 
                onClick={() => setShowLeadForm(false)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-white font-mono text-xs uppercase p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                Cerrar ✕
              </button>

              <div>
                <span className="text-[9px] font-mono text-[#d4a855] uppercase tracking-widest block">
                  Propuesta Formal & Dossier RAG
                </span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mt-1">
                  Emitir Presupuesto Oficial
                </h3>
              </div>

              <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Organización / Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a855]" size={16} />
                    <input 
                      required
                      type="text" 
                      value={leadData.name}
                      onChange={e => setLeadData({...leadData, name: e.target.value})}
                      placeholder="Ej. Gala Nupcial o Ayuntamiento de Toledo"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#d4a855] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Email de Contacto</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a855]" size={16} />
                    <input 
                      required
                      type="email" 
                      value={leadData.email}
                      onChange={e => setLeadData({...leadData, email: e.target.value})}
                      placeholder="contacto@organizacion.es"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#d4a855] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Tipo de Evento</label>
                    <select 
                      value={leadData.occasion}
                      onChange={e => setLeadData({...leadData, occasion: e.target.value})}
                      className="w-full h-12 bg-black border border-white/10 rounded-xl px-3 text-white focus:border-[#d4a855] outline-none"
                    >
                      <option>Boda VIP / Particular</option>
                      <option>Gala de Empresa / B2B</option>
                      <option>Festejos / Licitación B2G</option>
                      <option>Concierto en Auditorio</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Fecha Estimada</label>
                    <input 
                      type="date" 
                      value={leadData.eventDate}
                      onChange={e => setLeadData({...leadData, eventDate: e.target.value})}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-white focus:border-[#d4a855] outline-none"
                    />
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-400">Presupuesto Estimado con Desglose:</span>
                  <span className="text-lg font-black text-[#d4a855]">{quote?.finalTotal || 0}€</span>
                </div>

                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#d4a855] hover:bg-[#e0b666] text-black font-black uppercase tracking-widest rounded-2xl mt-4 flex items-center justify-center gap-3 shadow-xl shadow-[#d4a855]/20 active:scale-95 transition-all"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>GENERAR DOSSIER TÉCNICO <FileText size={16} /></>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Title */}
      <div className="text-center space-y-4">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4a855]/10 border border-[#d4a855]/20 text-[#d4a855] text-[10px] font-black uppercase tracking-[0.4em]">
          <Shield size={12} /> ARQUITECTURA DE COSTES S-CLASS
        </span>
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase text-white">
          Cotizador <span className="text-[#d4a855]">Integral</span>
        </h1>
        <p className="text-zinc-400 text-xs md:text-sm max-w-xl mx-auto font-light">
          Configurador de alta fidelidad para contratación de artistas, rider técnico L-Acoustics y cobertura logística oficial.
        </p>
      </div>

      {/* Main Grid: Catalog Left / Breakdown Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Category Tabs & Service Grid */}
        <div className="lg:col-span-8 space-y-8 bg-[#121212] border border-white/10 rounded-3xl p-6 lg:p-10 shadow-2xl">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-white/5">
            {Object.keys(SERVICES_CATALOG).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap min-h-[44px] flex items-center ${
                  activeCategory === cat 
                    ? 'bg-[#d4a855] text-black shadow-lg shadow-[#d4a855]/20' 
                    : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES_CATALOG[activeCategory]?.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-6 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected 
                      ? 'bg-[#d4a855]/10 border-[#d4a855] shadow-lg shadow-[#d4a855]/10' 
                      : 'bg-black/50 border-white/5 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-[#d4a855] text-black' : 'bg-white/5 text-zinc-400'
                    }`}>
                      {service.icon}
                    </div>
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? 'bg-[#d4a855] border-[#d4a855] text-black' : 'border-white/20 text-transparent'
                    }`}>
                      <CheckCircle2 size={14} />
                    </div>
                  </div>

                  <div>
                    <h4 className={`text-base font-black uppercase tracking-tight ${isSelected ? 'text-[#d4a855]' : 'text-white'}`}>
                      {service.name}
                    </h4>
                    <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs">
                    <span className="text-[10px] text-zinc-500 font-mono uppercase">Tarifa Base</span>
                    <span className="font-black text-white text-base">{service.price}€</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Location & Urgency Adjusters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5 text-xs">
            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d4a855] flex items-center gap-1.5">
                <Users size={14} /> Aforo Asistentes (PAX)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={pax}
                onChange={e => setPax(parseInt(e.target.value) || 0)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none focus:border-[#d4a855]"
              />
            </div>

            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d4a855] flex items-center gap-1.5">
                <MapPin size={14} /> Ubicación
              </label>
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none focus:border-[#d4a855]"
              >
                {Object.entries(PROVINCE_RATES).map(([prov, rate]) => (
                  <option key={prov} value={prov} className="bg-black">
                    {prov} — {rate.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2 bg-black/40 p-4 rounded-2xl border border-white/5">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#d4a855] flex items-center gap-1.5">
                <Clock size={14} /> Plazo de Activación
              </label>
              <select
                value={urgencyLevel}
                onChange={e => setUrgencyLevel(e.target.value as any)}
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-white font-bold outline-none focus:border-[#d4a855]"
              >
                <option value="ESTANDAR" className="bg-black">Estándar (&gt; 30 días de antelación)</option>
                <option value="PRIORITARIA" className="bg-black">Prioritaria (&lt; 15 días / +10%)</option>
                <option value="EXPRESS" className="bg-black">Express Inmediata (&lt; 72 horas / +25%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Right Column: Live S-Class Receipt & Checkout Arena */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-black italic uppercase tracking-tight text-white flex items-center gap-2">
                <FileText size={18} className="text-[#d4a855]" /> Desglose Técnico
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 text-zinc-400">
                {selectedServices.length} Conceptos
              </span>
            </div>

            {/* Selected Items List */}
            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1 text-xs">
              {Object.values(SERVICES_CATALOG).flat()
                .filter(s => selectedServices.includes(s.id))
                .map(s => (
                  <div key={s.id} className="flex justify-between items-center text-zinc-300">
                    <span className="truncate pr-2 font-medium">{s.name}</span>
                    <span className="font-mono font-bold text-white shrink-0">{s.price}€</span>
                  </div>
                ))}
            </div>

            {/* S-Class Pricing Engine Output */}
            {quote ? (
              <div className="space-y-4">
                <div className="space-y-2 text-xs text-zinc-400 font-mono bg-black/40 p-4 rounded-2xl border border-white/5">
                  <div className="text-[#ecb613] mb-2 font-black uppercase">Especificaciones del Motor S-Class:</div>
                  {quote.technicalSpecs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#ecb613]">&gt;</span>
                      <span className="text-white">{spec}</span>
                    </div>
                  ))}
                </div>

                <PriceLockBadge 
                  hash={quote.sha256Token} 
                  total={quote.finalTotal} 
                  split={quote.split} 
                />
              </div>
            ) : (
              <div className="p-8 text-center text-white/30 font-mono text-xs">Calculando físicas de acústica...</div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleInstantStripeDeposit}
                disabled={loading}
                className="w-full py-4 bg-[#d4a855] hover:bg-[#e0b666] text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#d4a855]/20 active:scale-95"
              >
                <CreditCard size={16} /> Bloquear Fecha con Depósito ({quote?.depositAmount ?? 0.50}€)
              </button>

              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <FileText size={16} /> Solicitar Dossier Oficial PDF
              </button>
            </div>
            
            {/* Click-to-call / WhatsApp Handoff */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <a 
                href={CENTRALITA.tel}
                className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded-2xl font-bold transition-colors uppercase text-xs tracking-widest border border-white/10"
              >
                <Phone className="w-4 h-4 text-[#d4a855]" />
                Llamar
              </a>
              <a 
                href={artistTarget ? `https://wa.me/34693693048?text=${encodeURIComponent("Hola Edwin, quiero consultar disponibilidad para mi evento a través de Productora EAR.")}` : generateWhatsAppLink({
                  profile: 'cotizador',
                  service: `Presupuesto Personalizado - ${selectedServices.length} conceptos`,
                  location: selectedProvince,
                  intent: `solicito viabilidad con presupuesto total estimado de ${quote?.finalTotal || 0}€`,
                  slug: 'presupuesto'
                }).url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 py-3 rounded-2xl font-bold transition-colors uppercase text-xs tracking-widest min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 📱 MOBILE STICKY SUMMARY & CLOSING BAR (< lg screens) */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-[80] bg-[#121212]/95 backdrop-blur-xl border-t border-[#d4a855]/30 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest text-zinc-400 block">
              Total ({selectedServices.length} ítems)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white italic">{quote?.finalTotal || 0}€</span>
              <span className="text-[10px] text-[#d4a855] font-mono">(Garantía: {quote?.depositAmount ?? 0.50}€)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeadForm(true)}
              className="px-3 py-2.5 bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-wider min-h-[44px] flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <FileText size={14} /> PDF
            </button>
            <button
              onClick={handleInstantStripeDeposit}
              disabled={loading}
              className="px-4 py-2.5 bg-[#d4a855] text-black rounded-xl text-[11px] font-black uppercase tracking-wider min-h-[44px] flex items-center gap-1.5 shadow-lg shadow-[#d4a855]/20 active:scale-95 transition-all"
            >
              <CreditCard size={14} /> Reservar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiPricer = () => (
  <Suspense fallback={<div className="p-20 text-center text-white/20">Cargando Cotizador S-Class...</div>}>
    <MultiPricerContent />
  </Suspense>
);
