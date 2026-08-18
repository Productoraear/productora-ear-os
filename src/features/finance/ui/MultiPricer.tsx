/**
 * 💰 MULTIPRICER S-CLASS - ADVANCED COST ARCHITECTURE & VALUE-FIRST QUOTATION ENGINE
 * Basado en el Framework de Reencuadre de Valor de la Incubadora Despegue / Midas:
 * Secuencia: [1. Costo del Problema & Riesgo Evitado] -> [2. Transformación & Blindaje 12 W/pax] -> [3. Inversión & Reserva Stripe].
 */

"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Boxes, ArrowRight, Loader2, Users, Activity, 
  Mail, User, MapPin, Calendar, FileText, CheckCircle2, XCircle,
  Sparkles, CreditCard, Clock, Truck, Award, Phone, MessageCircle,
  AlertTriangle, Check, Volume2, Lock, ShieldAlert, HeartHandshake
} from 'lucide-react';
import { PRICING_CATALOG } from '@/lib/constants/pricing-catalog';
import { SClassPricingEngine, SClassQuote } from '@/lib/pricing-engine';
import { PriceLockBadge } from '@/features/finance/ui/PriceLockBadge';
import { createDossierFromLead } from '@/app/actions/dossierActions';
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
    { id: 'pa-lacoustics', name: 'Sonorización L-Acoustics / Bose F1', price: 1800, icon: <Activity size={20} />, desc: 'Presión acústica cristalina calibrada a 12 W/pax sin distorsión.', category: 'PRODUCCION' },
    { id: 'light-dmx', name: 'Iluminación Robótica & Cabezas Móviles', price: 1200, icon: <Zap size={20} />, desc: 'Show lumínico sincronizado Beam / Wash de alta potencia.', category: 'PRODUCCION' },
    { id: 'trussing-stage', name: 'Tarima & Estructuras Trussing Homologadas', price: 1500, icon: <Boxes size={20} />, desc: 'Infraestructura de carga y rigging visada por técnico.', category: 'PRODUCCION' },
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
  'Albacete': { multiplier: 1.10, label: 'Castilla-La Mancha (+10%)' },
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
  const [selectedServices, setSelectedServices] = useState<string[]>(['cuarteto-imperial']);
  const [selectedProvince, setSelectedProvince] = useState<string>('Madrid');
  const [urgencyLevel, setUrgencyLevel] = useState<'ESTANDAR' | 'PRIORITARIA' | 'EXPRESS'>('ESTANDAR');
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
                          selectedProvince === 'Toledo' ? 70 :
                          selectedProvince === 'Albacete' ? 250 :
                          selectedProvince === 'Valencia' ? 350 :
                          selectedProvince === 'Barcelona' ? 620 :
                          selectedProvince === 'Sevilla' ? 530 : 100;
        
        const mappedUrgency = urgencyLevel === 'ESTANDAR' ? 'STANDARD' :
                              urgencyLevel === 'PRIORITARIA' ? 'PRIORITY' : 'EXPRESS';

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
      const depositVal = quote?.depositAmount ?? 100.00;
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
        alert(data.error || 'Iniciando pasarela de reserva segura Stripe Live...');
      }
    } catch (err) {
      console.error(err);
      alert('Conectando con la pasarela de reserva segura...');
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 relative text-white space-y-10 pb-36 lg:pb-16 font-sans">
      
      {/* 🏛️ ENCABEZADO DE ARQUITECTURA DE VALOR S-CLASS */}
      <div className="text-center space-y-4 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/10 text-[#ecb613] text-[10px] font-black tracking-[0.4em] uppercase font-mono">
          <Shield size={14} /> Ingeniería de Precios & Reencuadre de Valor
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic uppercase tracking-tighter font-syne leading-tight">
          Cotizador de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">Tranquilidad & Éxito</span>
        </h1>
        <p className="text-white/70 text-sm sm:text-base leading-relaxed">
          No compres horas de sonido o música sin garantías. Cotiza el blindaje acústico, la solvencia legal y el impacto emocional de tu evento con el estándar S-Class de Productora EAR.
        </p>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BLOQUE 1: DIAGNÓSTICO DE RIESGO EVITADO (COSTO DEL PROBLEMA) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-rose-400 tracking-widest block">
              Fase 1: Diagnóstico de Riesgo Técnico
            </span>
            <h2 className="text-xl font-black uppercase text-white font-syne">
              ¿Qué Riesgos Evitas Contratando Productora EAR?
            </h2>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
            Blindaje 100% Certificado
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Volume2 size={18} />
            </div>
            <h3 className="text-xs font-black uppercase text-white">Acústica 12 W/Pax</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Cero zonas sordas o volumen hiriente. Cobertura homogénea Bose F1 sin fatiga auditiva.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <ShieldAlert size={18} />
            </div>
            <h3 className="text-xs font-black uppercase text-white">Normativa Local (OPCAT)</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Cero multas o precintos policiales por sobrepasar los límites de dB del ayuntamiento.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Shield size={18} />
            </div>
            <h3 className="text-xs font-black uppercase text-white">Póliza RC 1.000.000 €</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Cobertura legal e indemnizatoria completa requerida por fincas y recintos protegidos.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Zap size={18} />
            </div>
            <h3 className="text-xs font-black uppercase text-white">Shure Axient Anti-Acoples</h3>
            <p className="text-[11px] text-white/60 leading-relaxed">
              Microfonía digital con escaneo de frecuencias. Cero pitidos ni cortes en momentos clave.
            </p>
          </div>
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BLOQUE 2: EL ANTES VS. EL DESPUÉS (THE SHIFT / TRANSFORMACIÓN) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* LA OPCIÓN CONVENCIONAL / AMATEUR */}
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-rose-950/10 border border-rose-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <XCircle size={18} />
            </div>
            <h3 className="text-base font-black uppercase text-rose-400 font-syne">
              Riesgo de Contratación Amateur
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span>Músicos sin rider homologado ni ensayo técnico previo.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span>Riesgo de acoples y micrófonos que fallan durante los votos o discursos.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span>Volumen descontrolado que obliga a los invitados a gritar para conversar.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-400 font-mono">✕</span>
              <span>Posible corte de luz o salto de limitador acústico con sanción municipal.</span>
            </li>
          </ul>
        </div>

        {/* EL ESTÁNDAR EAR OS S-CLASS */}
        <div className="p-6 sm:p-8 rounded-[2.5rem] bg-emerald-950/10 border border-emerald-500/20 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 size={18} />
            </div>
            <h3 className="text-base font-black uppercase text-emerald-400 font-syne">
              Estándar Productora EAR (S-Class)
            </h3>
          </div>
          <ul className="space-y-2.5 text-xs text-white/70">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Tenor lírico de gala (Edwin Agudelo) con vestuario bordado y botonadura de plata.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Sonorización calibrada a 12 W/pax con sistemas Bose F1 y DSP digital.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>Puntualidad garantizada con llegada T-120 min antes del inicio del evento.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-mono">✓</span>
              <span>95% de satisfacción auditada y custodia de depósito en Stripe Live.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* BLOQUE 3: CONFIGURADOR DE SERVICIOS & PARÁMETROS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Catálogo Interactivo */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Selector de Categorías */}
          <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
            {Object.keys(SERVICES_CATALOG).map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  activeCategory === cat 
                    ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/20' 
                    : 'bg-white/5 text-white/60 hover:text-white border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Ítems */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES_CATALOG[activeCategory].map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected 
                      ? 'bg-[#ecb613]/10 border-[#ecb613] shadow-lg shadow-[#ecb613]/10' 
                      : 'bg-[#09090d] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-[#ecb613] text-black' : 'bg-white/5 text-white/60'}`}>
                        {service.icon}
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-[#ecb613] border-[#ecb613] text-black font-bold' : 'border-white/20 text-transparent'
                      }`}>
                        ✓
                      </div>
                    </div>
                    <h4 className="text-sm font-black uppercase text-white font-syne">{service.name}</h4>
                    <p className="text-[11px] text-white/50 leading-relaxed">{service.desc}</p>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs font-mono">
                    <span className="text-white/40 uppercase text-[10px]">Tarifa Base</span>
                    <span className="font-bold text-white text-sm">{service.price} €</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ajustes de Aforo, Ubicación y Plazo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] flex items-center gap-1.5">
                <Users size={14} /> Asistentes (PAX)
              </label>
              <input
                type="number"
                min="10"
                max="10000"
                value={pax}
                onChange={e => setPax(parseInt(e.target.value) || 0)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-bold font-mono text-sm outline-none focus:border-[#ecb613]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] flex items-center gap-1.5">
                <MapPin size={14} /> Provincia
              </label>
              <select
                value={selectedProvince}
                onChange={e => setSelectedProvince(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-bold font-mono text-xs outline-none focus:border-[#ecb613]"
              >
                {Object.entries(PROVINCE_RATES).map(([prov, rate]) => (
                  <option key={prov} value={prov} className="bg-black">
                    {prov} — {rate.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-4 rounded-2xl bg-[#09090d] border border-white/10 space-y-2">
              <label className="text-[10px] font-mono font-bold uppercase text-[#ecb613] flex items-center gap-1.5">
                <Clock size={14} /> Plazo de Activación
              </label>
              <select
                value={urgencyLevel}
                onChange={e => setUrgencyLevel(e.target.value as any)}
                className="w-full bg-black/50 border border-white/10 rounded-xl p-2.5 text-white font-bold font-mono text-xs outline-none focus:border-[#ecb613]"
              >
                <option value="ESTANDAR" className="bg-black">Estándar (&gt; 30 días)</option>
                <option value="PRIORITARIA" className="bg-black">Prioritaria (&lt; 15 días / +10%)</option>
                <option value="EXPRESS" className="bg-black">Express Inmediata (&lt; 72h / +25%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* BLOQUE 4: INVERSIÓN, DESGLOSE DE TRANQUILIDAD & STRIPE ESCROW */}
        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <div className="lg:col-span-4 sticky top-28 space-y-6">
          <div className="bg-[#09090d] border border-white/10 rounded-[2.5rem] p-6 lg:p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] block">
                  Garantía de Inversión
                </span>
                <h3 className="text-lg font-black uppercase text-white font-syne">
                  Presupuesto S-Class
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-white/60">
                {selectedServices.length} Conceptos
              </span>
            </div>

            {/* Lista de Ítems Seleccionados */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 text-xs">
              {Object.values(SERVICES_CATALOG).flat()
                .filter(s => selectedServices.includes(s.id))
                .map(s => (
                  <div key={s.id} className="flex justify-between items-center text-white/70 py-1 border-b border-white/5">
                    <span className="truncate pr-2">{s.name}</span>
                    <span className="font-mono font-bold text-white shrink-0">{s.price} €</span>
                  </div>
                ))}
            </div>

            {/* S-Class Pricing Engine Output */}
            {quote ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 font-mono text-xs">
                  <div className="text-[#ecb613] text-[10px] font-black uppercase tracking-wider">
                    Parámetros Acústicos & Logísticos:
                  </div>
                  {quote.technicalSpecs.map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-white/70 text-[11px]">
                      <span className="text-[#ecb613]">&gt;</span>
                      <span>{spec}</span>
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
              <div className="p-6 text-center text-white/30 font-mono text-xs">
                Calculando físicas acústicas...
              </div>
            )}

            {/* Botones de Acción */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleInstantStripeDeposit}
                disabled={loading}
                className="w-full py-4 bg-[#ecb613] hover:bg-amber-300 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#ecb613]/20 active:scale-95"
              >
                <CreditCard size={16} /> Bloquear Fecha con Depósito ({quote?.depositAmount ?? 100}€)
              </button>

              <button
                onClick={() => setShowLeadForm(true)}
                className="w-full py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold uppercase text-xs tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2 border border-white/10"
              >
                <FileText size={16} /> Emitir Dossier Oficial PDF
              </button>
            </div>
            
            {/* Click-to-call & WhatsApp */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <a 
                href={CENTRALITA.tel}
                className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-3 rounded-2xl font-bold transition-colors uppercase text-xs tracking-wider border border-white/10"
              >
                <Phone className="w-4 h-4 text-[#ecb613]" />
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
                className="flex items-center justify-center gap-2 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 py-3 rounded-2xl font-bold transition-colors uppercase text-xs tracking-wider"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

          </div>
        </div>

      </div>

      {/* 🚀 FORM OVERLAY (DOSSIER & PROCESAMIENTO LEAD) */}
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
              className="w-full max-w-xl bg-[#0e0e0e] border border-[#ecb613]/30 rounded-[2.5rem] p-6 sm:p-10 relative overflow-y-auto max-h-[90vh] shadow-2xl space-y-5"
            >
              <button 
                onClick={() => setShowLeadForm(false)}
                className="absolute top-6 right-6 text-white/40 hover:text-white font-mono text-xs uppercase p-2"
              >
                Cerrar ✕
              </button>

              <div>
                <span className="text-[9px] font-mono text-[#ecb613] uppercase tracking-widest block">
                  Propuesta Formal & Dossier RAG
                </span>
                <h3 className="text-2xl font-black uppercase italic tracking-tight text-white mt-1 font-syne">
                  Emitir Presupuesto Oficial
                </h3>
              </div>

              <form onSubmit={handleSubmitLead} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Organización / Nombre Completo</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb613]" size={16} />
                    <input 
                      required
                      type="text" 
                      value={leadData.name}
                      onChange={e => setLeadData({...leadData, name: e.target.value})}
                      placeholder="Ej. Boda Carmen & Alejandro / Ayuntamiento"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Email de Contacto</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb613]" size={16} />
                    <input 
                      required
                      type="email" 
                      value={leadData.email}
                      onChange={e => setLeadData({...leadData, email: e.target.value})}
                      placeholder="contacto@organizacion.es"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Tipo de Evento</label>
                    <select 
                      value={leadData.occasion}
                      onChange={e => setLeadData({...leadData, occasion: e.target.value})}
                      className="w-full h-12 bg-black border border-white/10 rounded-xl px-3 text-white focus:border-[#ecb613] outline-none"
                    >
                      <option>Boda VIP / Particular</option>
                      <option>Gala Corporativa / Empresa</option>
                      <option>Fiestas Patronales / B2G</option>
                      <option>Homenaje Familiar / Serenata</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Fecha Estimada</label>
                    <input 
                      type="date" 
                      value={leadData.eventDate}
                      onChange={e => setLeadData({...leadData, eventDate: e.target.value})}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-3 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl bg-[#ecb613] text-black font-black uppercase tracking-wider text-xs hover:bg-amber-300 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                  <span>Generar y Descargar Dossier</span>
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📱 MOBILE STICKY BAR (< lg screens) */}
      <div className="lg:hidden fixed bottom-16 inset-x-0 z-[80] bg-[#121212]/95 backdrop-blur-xl border-t border-[#ecb613]/30 px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-[9px] uppercase font-mono tracking-widest text-white/40 block">
              Inversión ({selectedServices.length} ítems)
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white italic font-mono">{quote?.finalTotal || 0}€</span>
              <span className="text-[10px] text-[#ecb613] font-mono">(Garantía: {quote?.depositAmount ?? 100}€)</span>
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
              className="px-4 py-2.5 bg-[#ecb613] text-black rounded-xl text-[11px] font-black uppercase tracking-wider min-h-[44px] flex items-center gap-1.5 shadow-lg shadow-[#ecb613]/20 active:scale-95 transition-all"
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
  <Suspense fallback={<div className="p-20 text-center text-white/20 font-mono text-xs">Cargando Cotizador S-Class...</div>}>
    <MultiPricerContent />
  </Suspense>
);

export default MultiPricer;
