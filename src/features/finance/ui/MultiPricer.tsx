/**
 * 💰 MULTIPRICER S-CLASS - ADVANCED COST ARCHITECTURE & VALUE-FIRST QUOTATION ENGINE
 * Basado en el Framework de Reencuadre de Valor de la Incubadora Despegue / Midas & UX Tipo Airbnb:
 * Jerarquía: [1. Calculadora Interactiva de Ocasión & Ensamble] -> [2. Túnel Neural / Filtros Ultra-Detallados Airbnb] -> [3. Sidebar Inversión & Depósito Stripe] -> [4. Diagnóstico de Riesgo Técnico & Blindaje S-Class].
 */

"use client";

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Zap, Boxes, ArrowRight, Loader2, Users, Activity, 
  Mail, User, MapPin, Calendar, FileText, CheckCircle2, XCircle,
  Sparkles, CreditCard, Clock, Truck, Award, Phone, MessageCircle,
  AlertTriangle, Check, Volume2, Lock, ShieldAlert, HeartHandshake,
  Heart, Building2, PartyPopper, Flame, ChevronDown, SlidersHorizontal,
  Camera, Gamepad2, Tv
} from 'lucide-react';
import { PRICING_CATALOG } from '@/lib/constants/pricing-catalog';
import { SClassPricingEngine, SClassQuote } from '@/lib/pricing-engine';
import { PriceLockBadge } from '@/features/finance/ui/PriceLockBadge';
import { createDossierFromLead } from '@/app/actions/dossierActions';
import { CENTRALITA } from '@/lib/phone-constants';
import { generateWhatsAppLink } from '@/lib/whatsapp';
import { SClassUltraFilters, DEFAULT_ULTRA_FILTERS, calculateFilterSurcharges } from '@/features/finance/types/filters';
import { AirbnbUltraFiltersModal } from '@/features/finance/ui/AirbnbUltraFiltersModal';

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
  'ARSENAL & EQUIPAMIENTO AUDIOVISUAL (STOCK MADRID)': [
    { id: 'arsenal-fotomaton-360', name: 'Fotomatón 360º Vídeo Slow-Motion (3h)', price: 390, icon: <Camera size={20} />, desc: 'Plataforma motorizada, iPad Pro, descarga instantánea QR y atrezo.', category: 'ARSENAL' },
    { id: 'arsenal-fotomaton-vintage', name: 'Fotomatón Clásico Tótem Impresión Ilimitada', price: 350, icon: <Camera size={20} />, desc: 'Cámara réflex DSLR, tiras personalizadas y libro de firmas.', category: 'ARSENAL' },
    { id: 'arsenal-monitor-98', name: 'Monitor Gran Formato 98" 4K HDR + Peana', price: 450, icon: <Tv size={20} />, desc: 'Pantalla gigante profesional 24/7 antirreflejos para galas y ferias.', category: 'ARSENAL' },
    { id: 'arsenal-monitor-85', name: 'Monitor Profesional 85" 4K Ultra Slim', price: 320, icon: <Tv size={20} />, desc: 'Pantalla 4K con peana regulable de diseño y conexión wireless.', category: 'ARSENAL' },
    { id: 'arsenal-pantalla-tactil', name: 'Tótem / Monitor Táctil Interactivo 65"', price: 220, icon: <Tv size={20} />, desc: 'Pantalla táctil 20 puntos con Windows 11 / Android para stands.', category: 'ARSENAL' },
    { id: 'arsenal-muro-led', name: 'Muro Pantalla LED Interior P2.6 (Módulo)', price: 120, icon: <Boxes size={20} />, desc: 'Resolución ultra alta y brillo calibrado para escenarios y congresos.', category: 'ARSENAL' },
    { id: 'arsenal-simulador-f1', name: 'Simulador Conducción F1 / Rally Fanatec', price: 380, icon: <Gamepad2 size={20} />, desc: 'Cockpit con baquet deportivo, volante Force Feedback y pantalla curva.', category: 'ARSENAL' },
    { id: 'arsenal-gafas-vr', name: 'Puesto Realidad Virtual VR Meta Quest 3', price: 190, icon: <Gamepad2 size={20} />, desc: 'Gafas VR sin cables con pantalla réplica externa para el público.', category: 'ARSENAL' },
    { id: 'arsenal-videoconsolas', name: 'Puesto Gaming PS5 / Nintendo Switch + TV 4K', price: 140, icon: <Gamepad2 size={20} />, desc: 'Consola, 4 mandos inalámbricos, TV 55" y catálogo de juegos.', category: 'ARSENAL' },
    { id: 'arsenal-karaoke', name: 'Karaoke Profesional 50.000 Temas + Micros', price: 195, icon: <Sparkles size={20} />, desc: 'Sistema de karaoke con pantalla para letras y 2 micros inalámbricos.', category: 'ARSENAL' },
    { id: 'arsenal-humo-chispas', name: 'Efectos: Humo Bajo (Nube) + Chispas Frías', price: 120, icon: <Sparkles size={20} />, desc: 'Efectos homologados seguros para interior (baile nupcial / galas).', category: 'ARSENAL' },
    { id: 'arsenal-streaming', name: 'Kit Streaming Broadcast 4K + ATEM Mini', price: 320, icon: <Tv size={20} />, desc: 'Cámaras Blackmagic 4K, switcher y set de realización en vivo.', category: 'ARSENAL' }
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

// 🏨 MATRIZ RELACIONAL & GRUPOS DE OCASIÓN TIPO AIRBNB
interface OccasionItem {
  id: string;
  name: string;
  badge?: string;
  description: string;
  defaultEnsemble?: string;
}

interface OccasionCategory {
  id: string;
  label: string;
  icon: string;
  items: OccasionItem[];
}

const OCCASIONS_CATEGORIES: OccasionCategory[] = [
  {
    id: 'familia',
    label: 'Familia & Emocional',
    icon: '💖',
    items: [
      { id: 'cumpleanos-madre', name: 'Cumpleaños Madre / Mamá', badge: 'MÁS POPULAR', description: 'Serenata sorpresa con violines y ramo de flores.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'cumpleanos-padre', name: 'Cumpleaños Padre / Papá', description: 'Brindis charro con trompetas y canciones de honor.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'cumpleanos-abuelos', name: 'Cumpleaños Abuela / Abuelo', description: 'Calibración acústica suave y música dorada.', defaultEnsemble: 'clasico-esencial' },
      { id: 'boda-oro-plata', name: 'Bodas de Oro / Plata (25 y 50 Años)', badge: 'GALA', description: 'Homenaje a una vida entera juntos con ensamble imperial.', defaultEnsemble: 'quinteto-honor' },
      { id: 'bautizo-comunion', name: 'Bautizo / Primera Comunión VIP', description: 'Música alegre y distinguida para reunión familiar.', defaultEnsemble: 'clasico-esencial' }
    ]
  },
  {
    id: 'bodas',
    label: 'Bodas & Parejas',
    icon: '💍',
    items: [
      { id: 'boda-nupcial', name: 'Boda VIP / Entrada Nupcial & Banquete', badge: 'PREMIUM', description: 'Entrada solemne de novios, cóctel y fiesta de gala.', defaultEnsemble: 'quinteto-honor' },
      { id: 'pedida-mano', name: 'Pedida de Mano / Anillo Sorpresa', badge: 'ROMÁNTICO', description: 'Aparición íntima con el tenor Edwin Agudelo.', defaultEnsemble: 'clasico-esencial' },
      { id: 'aniversario-pareja', name: 'Aniversario de Pareja / Esposa', description: 'Serenata nocturna de alta distinción.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'reconciliacion-pareja', name: 'Reconciliación & Detalle de Amor', description: 'Música del corazón para tender puentes inolvidables.', defaultEnsemble: 'clasico-esencial' }
    ]
  },
  {
    id: 'amigos',
    label: 'Amigos & Hitos',
    icon: '🎉',
    items: [
      { id: 'cumpleanos-amigo', name: 'Cumpleaños Amiga / Amigo VIP', description: 'Fiesta charra de pura diversión y alegría grupal.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'jubilacion-homenaje', name: 'Jubilación & Despedida de Honor', badge: 'HOMENAJE', description: 'Reconocimiento a una gran trayectoria vital y laboral.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'graduacion-hijo', name: 'Graduación & Éxito Académico', description: 'Celebración de fin de grado y metas cumplidas.', defaultEnsemble: 'clasico-esencial' },
      { id: 'despedida-soltero', name: 'Despedida de Soltera / Soltero', description: 'Show festivo de alta energía y diversión.', defaultEnsemble: 'premium-gala' }
    ]
  },
  {
    id: 'b2b',
    label: 'Corporativo & Empresa',
    icon: '🏢',
    items: [
      { id: 'gala-empresa', name: 'Cena de Gala / Convención Anual', badge: 'B2B ÉLITE', description: 'Sonorización 12 W/pax y show musical corporativo de impacto.', defaultEnsemble: 'octeto-magistral' },
      { id: 'entrega-premios', name: 'Entrega de Premios & Gala de Honor', description: 'Protocolo de etiqueta con dirección musical y fanfarrias.', defaultEnsemble: 'sinfonico-royal' },
      { id: 'lanzamiento-producto', name: 'Lanzamiento de Marca / Cóctel VIP', description: 'Música en vivo sincronizada con iluminación espectacular.', defaultEnsemble: 'quinteto-honor' }
    ]
  },
  {
    id: 'b2g',
    label: 'Ayuntamientos & B2G',
    icon: '🏛️',
    items: [
      { id: 'fiestas-patronales', name: 'Fiestas Patronales & Semanas Culturales', badge: 'ART. 118 LCSP', description: 'Pliegos técnicos homologados y facturación FacturaE (DIR3).', defaultEnsemble: 'banda-monumental' },
      { id: 'circuito-vimume-senior', name: 'Ciclo Musical Tercera Edad (Plan VIMUME)', badge: 'ODS 2030', description: 'Estimulación neuroacústica y bienestar emocional para mayores.', defaultEnsemble: 'cuarteto-imperial' },
      { id: 'gala-navidad-reyes', name: 'Concierto de Navidad / Reyes Magos', description: 'Repertorio solemne y festivo para plazas y auditorios.', defaultEnsemble: 'sinfonico-royal' }
    ]
  }
];

const MultiPricerContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados de Configuración
  const [activeOccasionCategory, setActiveOccasionCategory] = useState<string>('familia');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Cumpleaños Madre / Mamá');
  const [activeCategory, setActiveCategory] = useState<string>('BOOKING ARTÍSTICO DE GALA');
  const [selectedServices, setSelectedServices] = useState<string[]>(['cuarteto-imperial']);
  const [selectedProvince, setSelectedProvince] = useState<string>('Madrid');
  const [urgencyLevel, setUrgencyLevel] = useState<'ESTANDAR' | 'PRIORITARIA' | 'EXPRESS'>('ESTANDAR');
  const [pax, setPax] = useState<number>(150);
  const [quote, setQuote] = useState<SClassQuote | null>(null);
  
  // 🎛️ ESTADO DE FILTROS ULTRA-DETALLADOS AIRBNB STYLE
  const [ultraFilters, setUltraFilters] = useState<SClassUltraFilters>(DEFAULT_ULTRA_FILTERS);
  const [showUltraFiltersModal, setShowUltraFiltersModal] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [showLeadForm, setShowLeadForm] = useState<boolean>(false);

  // Form State
  const [leadData, setLeadData] = useState({
    name: '',
    email: '',
    phone: '',
    occasion: 'Cumpleaños Madre / Mamá',
    eventDate: ''
  });

  const [artistTarget, setArtistTarget] = useState<string | null>(null);

  // Cálculo de Métricas de Filtros
  const filterMetrics = useMemo(() => calculateFilterSurcharges(ultraFilters), [ultraFilters]);

  // Total Ajustado con Suplementos Técnicos
  const adjustedFinalTotal = useMemo(() => {
    return (quote?.finalTotal || 0) + filterMetrics.surchargeAmount;
  }, [quote, filterMetrics]);

  // Especificaciones Técnicas Combinadas
  const combinedSpecs = useMemo(() => {
    return [
      ...(quote?.technicalSpecs || []),
      ...filterMetrics.riderSpecs
    ];
  }, [quote, filterMetrics]);

  // 📥 AUTO-LOAD FROM URL PARAMS (ITEMS, OCASIÓN & ARTISTA TARGET)
  useEffect(() => {
    const artista = searchParams.get('artista') || searchParams.get('artist');
    if (artista && (artista.toLowerCase().includes('edwin') || artista.toLowerCase().includes('agudelo'))) {
      setArtistTarget('Edwin Agudelo (Tenor Lírico / Mariachi Imperial)');
      setSelectedServices(['cuarteto-imperial']);
      setActiveCategory('BOOKING ARTÍSTICO DE GALA');
      setSelectedProvince('Madrid');
    }

    const oc = searchParams.get('ocasion') || searchParams.get('occasion');
    if (oc) {
      setSelectedOccasion(oc);
      setLeadData(prev => ({ ...prev, occasion: oc }));
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

  // Actualizar leadData.occasion cuando cambia selectedOccasion
  useEffect(() => {
    setLeadData(prev => ({ ...prev, occasion: selectedOccasion }));
  }, [selectedOccasion]);

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

  const handleSelectOccasion = (item: OccasionItem) => {
    setSelectedOccasion(item.name);
    if (item.defaultEnsemble && PRICING_CATALOG[item.defaultEnsemble]) {
      setSelectedServices(prev => [item.defaultEnsemble!, ...prev.filter(s => s !== item.defaultEnsemble && !Object.keys(PRICING_CATALOG).includes(s))]);
    }
  };

  const handleInstantStripeDeposit = async () => {
    setLoading(true);
    try {
      const serviceObj = Object.values(SERVICES_CATALOG).flat().find(s => s.id === selectedServices[0]);
      const serviceName = serviceObj?.name || 'Mariachi Cuarteto Imperial';
      const depositVal = quote?.depositAmount ?? 0.50;

      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: depositVal,
          concept: `Depósito Garantía S-Class (${quote?.sha256Token || '72H-LOCK'})`,
          metadata: {
            productName: `Reserva & Bloqueo de Fecha S-Class (${depositVal} €)`,
            serviceName: serviceName,
            description: `${serviceName} (${adjustedFinalTotal} €) • ${selectedOccasion} | ${pax} PAX | ${selectedProvince} | Hash: ${quote?.sha256Token || '72H-LOCK'}`,
            sha256Token: quote?.sha256Token || '',
            formatId: selectedServices[0] || 'clasico-esencial',
            pax: pax,
            province: selectedProvince,
            occasion: selectedOccasion,
            finalTotal: adjustedFinalTotal,
            deposit: depositVal,
            ultraFiltersCount: filterMetrics.activeCount
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

      const combinedAssets = [
        ...selectedNames,
        ...filterMetrics.riderSpecs.slice(0, 3)
      ];

      const result = await createDossierFromLead({
        contactName: leadData.name,
        contactEmail: leadData.email,
        occasion: `${selectedOccasion} [${selectedProvince}] (${filterMetrics.activeCount} filtros técnicos) - Total: ${adjustedFinalTotal}€`,
        selectedAssets: combinedAssets
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative text-white space-y-10 pb-36 lg:pb-16 font-sans">
      
      {/* 🏛️ ENCABEZADO DE ENTRADA DIRECTA (FIRST VIEWPORT) */}
      <div className="text-center max-w-3xl mx-auto py-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight font-syne leading-tight text-white">
          Configura tu evento en vivo y congela tu tarifa con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white">garantía oficial.</span>
        </h1>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 🌟 PASO 1: SELECTOR DE OCASIÓN & EVENTO TIPO AIRBNB (FIRST VIEWPORT) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#09090d] border border-[#ecb613]/25 shadow-[0_20px_60px_rgba(0,0,0,0.85)] space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#ecb613] text-black font-black text-xs flex items-center justify-center font-mono">
              1
            </span>
            <div>
              <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] tracking-widest block">
                Propósito del Evento
              </span>
              <h2 className="text-lg font-black uppercase text-white font-syne">
                ¿Qué Ocasión o Celebración Vamos a Blindar?
              </h2>
            </div>
          </div>
          <div className="text-[11px] font-mono text-white/50 bg-white/5 px-3 py-1 rounded-xl border border-white/10">
            Seleccionado: <span className="text-[#ecb613] font-bold">{selectedOccasion}</span>
          </div>
        </div>

        {/* Categorías Tipo Airbnb (Tabs Principales) */}
        <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-none border-b border-white/5">
          {OCCASIONS_CATEGORIES.map(cat => {
            const isActive = activeOccasionCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveOccasionCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-gradient-to-r from-[#ecb613] to-amber-400 text-black shadow-lg shadow-[#ecb613]/25 scale-105' 
                    : 'bg-white/5 text-white/60 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tarjetas / Chips de Ocasión Activa */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-2">
          {OCCASIONS_CATEGORIES.find(c => c.id === activeOccasionCategory)?.items.map(item => {
            const isSelected = selectedOccasion === item.name;
            return (
              <div
                key={item.id}
                onClick={() => handleSelectOccasion(item)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-[#ecb613]/15 border-[#ecb613] shadow-md shadow-[#ecb613]/10 scale-[1.02]' 
                    : 'bg-black/40 border-white/5 hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {item.badge && (
                  <span className="absolute top-2.5 right-2.5 text-[8px] font-mono font-black uppercase px-2 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30">
                    {item.badge}
                  </span>
                )}
                <div>
                  <h4 className="text-xs font-black uppercase text-white font-syne group-hover:text-[#ecb613] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-white/50 leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 text-[10px] font-mono border-t border-white/5">
                  <span className="text-white/40">Elegir</span>
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] ${
                    isSelected ? 'bg-[#ecb613] text-black font-bold' : 'border border-white/20 text-transparent'
                  }`}>
                    ✓
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 🎛️ TÚNEL NEURAL: BOTÓN MODAL ESPECIFICACIONES TÉCNICAS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="p-5 sm:p-6 rounded-[2rem] bg-gradient-to-r from-black via-[#0d0d14] to-black border border-[#ecb613]/35 shadow-[0_10px_40px_rgba(236,182,19,0.08)] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/15 border border-[#ecb613]/40 flex items-center justify-center text-[#ecb613] shrink-0">
            <SlidersHorizontal size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] tracking-widest">
                Túnel Neural de Especificaciones
              </span>
              <span className="text-[8px] font-mono px-2.5 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30 font-black">
                {filterMetrics.activeCount} Filtros Activos
              </span>
            </div>
            <p className="text-white font-bold text-xs sm:text-sm">
              ¿Tu recinto tiene escaleras, limitador acústico OPCAT, o requiere grupo electrógeno?
            </p>
            <p className="text-white/50 text-[11px]">
              Personaliza acústica, microfonía, estructuras truss, momentos del show y protocolo de contratación.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowUltraFiltersModal(true)}
          className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#ecb613] to-amber-400 hover:brightness-110 text-black font-black uppercase text-xs tracking-wider rounded-2xl flex items-center justify-center gap-2.5 shadow-xl shadow-[#ecb613]/25 transition-all active:scale-95 whitespace-nowrap shrink-0"
        >
          <SlidersHorizontal size={15} />
          <span>Especificaciones del Recinto y Protocolo</span>
          {filterMetrics.surchargeAmount > 0 && (
            <span className="bg-black text-[#ecb613] text-[9px] px-2 py-0.5 rounded-full font-mono font-black">
              +{filterMetrics.surchargeAmount}€
            </span>
          )}
        </button>
      </div>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 🌟 PASO 2: CALCULADORA DE SERVICIOS & PARÁMETROS + SIDEBAR */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Columna Izquierda: Catálogo Interactivo */}
        <div className="lg:col-span-8 space-y-6">
          
          <div className="flex items-center gap-2.5 border-b border-white/5 pb-3">
            <span className="w-6 h-6 rounded-full bg-[#ecb613] text-black font-black text-xs flex items-center justify-center font-mono">
              2
            </span>
            <h2 className="text-base sm:text-lg font-black uppercase text-white font-syne">
              Selección de Ensamble Artístico & Producción Técnica
            </h2>
          </div>

          {/* Selector de Categorías de Servicio */}
          <div className="flex flex-wrap gap-2">
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

          {/* Grid de Ítems de Servicio */}
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
          <div className="p-6 rounded-2xl bg-[#09090d] border border-white/10 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <span className="w-5 h-5 rounded-full bg-[#ecb613] text-black font-black text-[10px] flex items-center justify-center font-mono">
                3
              </span>
              <h3 className="text-xs font-black uppercase text-white font-syne tracking-wider">
                Parámetros Logísticos & Aforo
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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

              <div className="space-y-1.5">
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
        </div>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {/* SIDEBAR: INVERSIÓN, DESGLOSE DE TRANQUILIDAD & STRIPE ESCROW */}
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

            {quote ? (
              <div className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-white/5 pb-3">
                  <span className="text-xs text-white/50 uppercase font-mono">Inversión Estimada:</span>
                  <div className="text-right">
                    <span className="text-3xl font-black text-white italic tracking-tight font-mono">
                      {adjustedFinalTotal} €
                    </span>
                    <span className="text-[10px] text-white/40 block font-mono">
                      {filterMetrics.surchargeAmount > 0 ? `(Inc. +${filterMetrics.surchargeAmount}€ filtros)` : 'IVA excluido'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 bg-black/40 p-3.5 rounded-2xl border border-white/5 text-xs font-mono">
                  <div className="flex justify-between text-white/60">
                    <span>Ocasión:</span>
                    <span className="text-[#ecb613] font-bold truncate max-w-[170px]">{selectedOccasion}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Aforo & Ubicación:</span>
                    <span className="text-white">{pax} PAX • {selectedProvince}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Filtros Técnicos:</span>
                    <span className="text-emerald-400 font-bold">{filterMetrics.activeCount} Especificaciones</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Depósito Garantía:</span>
                    <span className="text-emerald-400 font-bold">{quote.depositAmount ?? 100} €</span>
                  </div>
                </div>

                {/* Especificaciones Técnicas */}
                <div className="space-y-1 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="text-[10px] font-mono text-white/40 uppercase font-bold mb-1">
                    Blindaje Incluido & Rider:
                  </div>
                  {combinedSpecs.slice(0, 5).map((spec, i) => (
                    <div key={i} className="flex items-start gap-2 text-white/70 text-[11px]">
                      <span className="text-[#ecb613]">&gt;</span>
                      <span>{spec}</span>
                    </div>
                  ))}
                </div>

                <PriceLockBadge 
                  hash={quote.sha256Token} 
                  total={adjustedFinalTotal} 
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
                href={artistTarget ? `https://wa.me/34693693048?text=${encodeURIComponent(`Hola Edwin, quiero consultar disponibilidad para mi evento (${selectedOccasion}) en ${selectedProvince} con ${filterMetrics.activeCount} especificaciones técnicas a través de Productora EAR.`)}` : generateWhatsAppLink({
                  profile: 'cotizador',
                  service: `Presupuesto Personalizado - ${selectedOccasion}`,
                  location: selectedProvince,
                  intent: `solicito viabilidad para ${selectedOccasion} con presupuesto total estimado de ${adjustedFinalTotal}€ y ${filterMetrics.activeCount} especificaciones de recinto`,
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

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 🌟 BLOQUE DE REFUERZO DE VALOR (REUBICADO ABAJO DE LA CALCULADORA) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      
      {/* FASE 1: DIAGNÓSTICO DE RIESGO TÉCNICO & BLINDAJE 12 W/PAX */}
      <div className="p-6 sm:p-8 rounded-[2.5rem] bg-[#09090d] border border-white/10 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-[9px] font-mono font-bold uppercase text-[#ecb613] tracking-widest block">
              Garantía Técnica Inmutable
            </span>
            <h2 className="text-xl font-black uppercase text-white font-syne">
              ¿Por Qué Contratar el Estándar S-Class de Productora EAR?
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

      {/* FASE 2: TABLA COMPARATIVA RIESGO AMATEUR VS. ESTÁNDAR S-CLASS */}
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

      {/* 🚀 MODAL ULTRA-FILTROS AIRBNB STYLE */}
      <AirbnbUltraFiltersModal
        isOpen={showUltraFiltersModal}
        onClose={() => setShowUltraFiltersModal(false)}
        filters={ultraFilters}
        onChange={setUltraFilters}
      />

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
                      placeholder="Ej. Carmen & Alejandro / Ayuntamiento"
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

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Teléfono (WhatsApp)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ecb613]" size={16} />
                    <input 
                      type="tel" 
                      value={leadData.phone}
                      onChange={e => setLeadData({...leadData, phone: e.target.value})}
                      placeholder="+34 600 000 000"
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 text-white focus:border-[#ecb613] outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-white/60">Ocasión Seleccionada</label>
                    <input 
                      type="text" 
                      readOnly
                      value={selectedOccasion}
                      className="w-full h-12 bg-black/60 border border-white/10 rounded-xl px-3 text-[#ecb613] font-bold outline-none"
                    />
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
                  <span>Generar y Enviar Dossier Oficial</span>
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
            <span className="text-[9px] uppercase font-mono tracking-widest text-white/40 block truncate max-w-[140px]">
              {selectedOccasion}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-white italic font-mono">{adjustedFinalTotal}€</span>
              <span className="text-[10px] text-[#ecb613] font-mono">(Garantía: {quote?.depositAmount ?? 100}€)</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUltraFiltersModal(true)}
              className="px-2.5 py-2.5 bg-white/10 text-[#ecb613] rounded-xl text-[10px] font-black uppercase tracking-wider min-h-[44px] flex items-center gap-1 active:scale-95 transition-all border border-[#ecb613]/30"
            >
              <SlidersHorizontal size={14} />
            </button>
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
