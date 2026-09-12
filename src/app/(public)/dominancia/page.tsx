'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Zap, AlertTriangle, CheckCircle2, 
  Users, DollarSign, ArrowRight, Phone, MessageSquare, 
  Building, Copy, Check, Flame, Crown, Volume2, 
  Scale, FileText, Compass, Sparkles, Sliders, ChevronRight, Lock, HelpCircle
} from 'lucide-react';
import { MeshGradientBackground } from '@/components/sclass/MeshGradientBackground';

// ── CONSTANTES CANÓNICAS INMUTABLES (SSOT S-CLASS) ───────────────────────────
const EDWIN_BASE_FEE = 350.0;
const RATE_PER_KM = 1.50;
const FREE_KM_THRESHOLD = 50;
const HOTEL_SURCHARGE = 120.0;
const DEPOSIT_AMOUNT = 100.0;
const B2G_CEILING = 14250.0;
const SPL_MAX_DB = 75;

export default function DominanciaPage() {
  const [activeTab, setActiveTab] = useState<'forensic' | 'journey' | 'tariffs' | 'fincas' | 'vendors' | 'scripts' | 'roadmap' | 'simulator'>('forensic');
  
  // Simulador de Presupuestos y Cierre
  const [simService, setSimService] = useState<'edwin' | 'mariachi_trio' | 'mariachi_poker' | 'sound_150' | 'b2g_small'>('edwin');
  const [simKm, setSimKm] = useState<number>(45);
  const [simLateNight, setSimLateNight] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);
  const [activeObjection, setActiveObjection] = useState<number>(0);

  // Cálculos del Simulador
  const simCalculations = useMemo(() => {
    let base = 350;
    let label = 'Edwin Agudelo (Solista Flagship)';
    if (simService === 'mariachi_trio') { base = 490; label = 'Mariachi Trío Acústico'; }
    if (simService === 'mariachi_poker') { base = 650; label = 'Mariachi Cuarteto Clásico'; }
    if (simService === 'sound_150') { base = 450; label = 'Pack Sonido Bose F1 (150 pax / 12W)'; }
    if (simService === 'b2g_small') { base = 3200; label = 'Gala Municipal VIMUME Menor'; }

    const billableKm = Math.max(0, simKm - FREE_KM_THRESHOLD);
    const logistics = billableKm * RATE_PER_KM;
    const hotel = (simLateNight || simKm > 200) ? HOTEL_SURCHARGE : 0;
    const totalLogistics = logistics + hotel;

    const subtotal = base + totalLogistics;
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    // Split 80/10/10 sobre la base del servicio
    const artistCut = base * 0.80;
    const earOsCut = base * 0.10;
    const vimumeCut = base * 0.10;

    return {
      label,
      base,
      logistics,
      hotel,
      totalLogistics,
      subtotal,
      iva,
      total,
      artistCut,
      earOsCut,
      vimumeCut,
      deposit: DEPOSIT_AMOUNT,
      pendingOnSite: total - DEPOSIT_AMOUNT
    };
  }, [simService, simKm, simLateNight]);

  // Generador de Guion de Cierre Automático
  const generatedClosingScript = useMemo(() => {
    return `Hola! Te envío la propuesta oficial y blindada de Productora EAR para ${simCalculations.label}:

• Servicio Base: ${simCalculations.base.toFixed(2)} € (Rider Bose F1 812 / Shure Beta 87A certificado).
• Logística Méntrida (${simKm} km): ${simCalculations.totalLogistics.toFixed(2)} €${simCalculations.hotel > 0 ? ' (incluye suplemento hotel fin de fiesta)' : ''}.
• Subtotal: ${simCalculations.subtotal.toFixed(2)} € (+21% IVA).
• Total Oficial: ${simCalculations.total.toFixed(2)} €.

🔒 GARANTÍA S-CLASS:
1. Sin ruidos, pitidos ni fallos (12 W/pax homologado por contrato).
2. Bloqueo atómico de fecha con fianza oficial de 100,00 € en Stripe (Price-Lock SHA-256).
3. Resto de ${simCalculations.pendingOnSite.toFixed(2)} € se abona en el evento tras prueba de sonido exitosa.

Puedes bloquear tu fecha ahora mismo aquí:
https://productoraear.com/checkout?amount=100`;
  }, [simCalculations, simKm]);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedClosingScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const objectionsData = [
    {
      q: '¿Por qué contratar con EAR OS si Bodas.net tiene 60.000 proveedores?',
      pain: 'Bodas.net cobra 150-400 €/mes a cualquiera por anunciarse sin probar su equipo. El 98% de proveedores son perfiles estáticos sin verificación acústica.',
      rebuttal: 'En Bodas.net de cada 4.300 impresiones solo 11 consiguen teléfono (0.25%). En EAR OS no cobramos cuotas a proveedores: solo admitimos equipos certificados a 12 W/pax (Bose/Shure). Tu evento está blindado matemáticamente y tu fianza de 100 € bloquea la fecha en tiempo real.'
    },
    {
      q: 'Un solista o DJ me cobra 150 € en otro portal, ¿por qué Edwin Agudelo cuesta 350 €?',
      pain: 'El "Pánico Acústico": contratistas de 150 € que van con altavoces de plástico domésticos, saturan la sala y provocan acoples en el discurso del novio o el padrino.',
      rebuttal: 'La tarifa de 350 € de Edwin Agudelo es un estándar de concierto en vivo con microfonía Shure Beta 87A y sistema Bose F1. Incluye seguro de contingencia, prueba de sonido acústica y garantía legal de 0 cortes. Lo barato en sonido arruina el recuerdo de toda la boda.'
    },
    {
      q: 'Fincas: "Nosotros ya tenemos exclusividad con nuestros proveedores."',
      pain: 'Las fincas sufren cortes de luz por equipos sin homologación y multas municipales por superar los 75-85 dB en exteriores.',
      rebuttal: 'No pedimos exclusividad: ofrecemos una auditoría acústica preventiva GRATUITA. Si homologan su espacio como Finca S-Class, limitamos la presión a <85 dB para evitar multas, certificamos la potencia eléctrica y los novios reservan directamente sin que la finca gaste un solo euro.'
    },
    {
      q: 'Proveedores: "¿Por qué un Split 80/10/10 en lugar de pagar una cuota mensual?"',
      pain: 'Bodas.net te cobra 3.000 € al año aunque no cierres ni una sola boda. Si dejas de pagar, hunden tu perfil un 98.5% como castigo algorítmico.',
      rebuttal: 'Con el Split Soberano no arriesgas capital: 0 € cuota fija. Si hay bolo, el 80% íntegro es para ti (pago asegurado), el 10% financia la plataforma y el 10% apoya musicoterapia geriátrica (VIMUME). Solo ganas cuando tú ganas.'
    },
    {
      q: '¿Por qué es obligatorio pagar una fianza de 100 € en Stripe para cerrar?',
      pain: 'Las solicitudes informales por WhatsApp o email se caen el 60% de las veces, dejando fechas bloqueadas en falso y provocando cancelaciones de última hora.',
      rebuttal: 'La fianza de 100 € con Price-Lock SHA-256 sella el compromiso legal mutuo: la fecha queda matemáticamente bloqueada en nuestro motor transaccional y el artista no puede aceptar otra oferta. El cliente se asegura la fecha y el artista la actuación.'
    }
  ];

  return (
    <MeshGradientBackground intensity="stage">
      <main className="min-h-screen pt-28 sm:pt-32 pb-36 px-4 md:px-8 text-white font-sans selection:bg-[#ecb613] selection:text-black w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* ── CABECERA PRINCIPAL S-CLASS ── */}
          <div className="text-center space-y-4 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-[0.3em] shadow-[0_0_35px_rgba(236,182,19,0.2)]">
              <Crown size={14} className="animate-pulse text-[#ecb613]" />
              ESTRATEGIA MAESTRA S-CLASS // WAR ROOM
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight font-syne leading-[0.95]">
              MANIFIESTO DE DOMINANCIA: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-amber-200 to-white italic">
                JUBILANDO A BODAS.NET
              </span>
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 font-light max-w-3xl mx-auto leading-relaxed">
              Disección atómica del marketplace legacy, manual táctico de negociación, tarifas inmutables, 
              propuestas blindadas para fincas y proveedores, y hoja de ruta para la dominancia absoluta del mercado español.
            </p>

            {/* Telemetría Digital Canónica */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 pt-4 text-[11px] font-mono">
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Split Canónico</span>
                <span className="text-[#ecb613] font-bold text-sm">80 / 10 / 10</span>
              </div>
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Solista Flagship</span>
                <span className="text-white font-bold text-sm">350,00 €</span>
              </div>
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Acústica S-Class</span>
                <span className="text-[#00E5FF] font-bold text-sm">12 W / pax</span>
              </div>
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Fianza Stripe</span>
                <span className="text-emerald-400 font-bold text-sm">100,00 € Lock</span>
              </div>
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Km Logística</span>
                <span className="text-amber-300 font-bold text-sm">1,50 € / km</span>
              </div>
              <div className="p-3 bg-[#0a0a0e] border border-zinc-800 rounded-xl">
                <span className="text-zinc-500 block text-[9px] uppercase">Techo B2G LCSP</span>
                <span className="text-[#FF2B44] font-bold text-sm">&lt; 14.250 €</span>
              </div>
            </div>
          </div>

          {/* ── BARRA DE PESTAÑAS NAVEGABLE ── */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-zinc-800/80">
            {[
              { id: 'forensic', label: '1. Disección Dinosaurio', icon: AlertTriangle },
              { id: 'journey', label: '2. Funnel & 7 Etapas (ZTM)', icon: Sparkles },
              { id: 'tariffs', label: '3. Matriz Tarifas & Split', icon: DollarSign },
              { id: 'fincas', label: '4. Alianzas Fincas', icon: Building },
              { id: 'vendors', label: '5. Gremio Proveedores', icon: Users },
              { id: 'scripts', label: '6. Negociación & Objeciones', icon: MessageSquare },
              { id: 'roadmap', label: '7. Hoja de Ruta Paso a Paso', icon: Compass },
              { id: 'simulator', label: '8. Simulador Cierre en Vivo', icon: Sliders },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isActive 
                      ? 'bg-[#ecb613] text-black shadow-lg shadow-[#ecb613]/25 scale-105' 
                      : 'bg-zinc-900/60 text-zinc-400 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── CONTENIDO DINÁMICO DE PESTAÑAS ── */}
          <div className="bg-[#08080c] border border-zinc-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
            
            <AnimatePresence mode="wait">
              {/* ── PESTAÑA 1: DISECCIÓN FORENSE BODAS.NET ── */}
              {activeTab === 'forensic' && (
                <motion.div
                  key="forensic"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/60 pb-6">
                    <div>
                      <div className="text-[11px] font-mono text-[#FF2B44] uppercase tracking-widest flex items-center gap-1.5">
                        <Flame size={14} /> AUDITORÍA FORENSE DE LA CUENTA PRODUCTORA EAR EN BODAS.NET
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                        El Modelo Extractor de Rentas al Descubierto
                      </h2>
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-red-950/40 border border-red-500/30 text-red-400 text-xs font-mono font-bold">
                      Estrangulamiento: 98,5%
                    </span>
                  </div>

                  {/* Números Reales de Productora EAR desclasificados */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                      <span className="text-xs font-mono text-zinc-400 uppercase">1. Embudo Histórico Total</span>
                      <div className="text-3xl font-black text-white font-syne">4.336 <span className="text-xs text-zinc-500 font-normal">Impresiones</span></div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Generó 226 solicitudes (5,21% conversión), pero <strong className="text-red-400">solo 11 clics en teléfono (0,25%)</strong>. Bodas.net secuestra el contacto directo para evitar que cierres fuera del peaje.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-red-950/20 border border-red-900/40 space-y-2">
                      <span className="text-xs font-mono text-red-400 uppercase">2. El Castigo por Tarjeta Inactiva</span>
                      <div className="text-3xl font-black text-red-500 font-syne">62 <span className="text-xs text-red-300 font-normal">Impresiones / año</span></div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Al expirar el método de pago, el algoritmo hunde el tráfico de 4.336 a 62 vistas (-98,5%) y a 1 sola solicitud. <strong className="text-white">Si no pagas la cuota mensual de 150-400€, te borran del mapa.</strong>
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                      <span className="text-xs font-mono text-amber-400 uppercase">3. Activo Social Inmovilizado</span>
                      <div className="text-3xl font-black text-[#ecb613] font-syne">5.0 / 5.0 <span className="text-xs text-amber-300 font-normal">Valoración</span></div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Reseñas de oro (Sergio & Adriana, Yanet Cecilia, etc.) trabajan para el SEO de Bodas.net y no para tu dominio. La solución es absorberlas en tu Bóveda Soberana.
                      </p>
                    </div>
                  </div>

                  {/* Tabla Cara a Cara: Bodas.net vs EAR OS */}
                  <div className="overflow-x-auto rounded-2xl border border-zinc-800">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-[10px] tracking-wider border-b border-zinc-800">
                        <tr>
                          <th className="p-4">Dimensión Operativa</th>
                          <th className="p-4 text-red-400">Modelo Legacy (Bodas.net / The Knot)</th>
                          <th className="p-4 text-[#ecb613]">Modelo Soberano (EAR OS V2)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/60 bg-[#060608]">
                        <tr>
                          <td className="p-4 font-bold text-white">Modelo de Cobro a Proveedores</td>
                          <td className="p-4 text-zinc-400">Cuota mensual fija (150 € a 500 €/mes) haya o no bodas.</td>
                          <td className="p-4 text-emerald-400 font-bold">0 € cuota fija. Split 80/10/10 solo sobre contratos cobrados.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Acceso al Teléfono / Contacto</td>
                          <td className="p-4 text-zinc-400">Bloqueado en buzón ciego. 0.25% tasa de acceso real.</td>
                          <td className="p-4 text-emerald-400 font-bold">Teléfono y WhatsApp directo 1-clic tras fianza o solicitud.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Filtro de Calidad Acústica</td>
                          <td className="p-4 text-zinc-400">Cero. Cualquiera con altavoz doméstico y tarjeta paga visibilidad.</td>
                          <td className="p-4 text-[#00E5FF] font-bold">12 W/pax obligatorio. Bose F1 / Shure Beta 87A certificado.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Cierre Transaccional</td>
                          <td className="p-4 text-zinc-400">"Pide presupuesto". Correos infinitos y llamadas tardías.</td>
                          <td className="p-4 text-[#ecb613] font-bold">Depósito 100 € Stripe con Price-Lock SHA-256 en 3 clics.</td>
                        </tr>
                        <tr>
                          <td className="p-4 font-bold text-white">Propiedad del Lead</td>
                          <td className="p-4 text-zinc-400">Propiedad del portal. Te cortan el acceso si dejas de pagar.</td>
                          <td className="p-4 text-white font-bold">Propiedad 100% de Productora EAR en Base de Datos PostgreSQL.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 2: FUNNEL & CUSTOMER JOURNEY (ZTM INTEL) ── */}
              {activeTab === 'journey' && (
                <motion.div
                  key="journey"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles size={14} /> EXTRACTO ZTM DE 26 DOCUMENTOS CONFIDENCIALES DE BODAS.NET PRO
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Las 4 Fases del Funnel & El Journey de 7 Etapas
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-3xl font-light">
                      Disección de la psicología de las parejas a lo largo de 12 meses de planificación y cómo EAR OS 
                      acorta drásticamente el ciclo de cierre con transparencia y fianza inmediata de 100 €.
                    </p>
                  </div>

                  {/* 3 Métricas Duras del Sector Nupcial (Informe ZTM) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Resiliencia Presupuestaria</span>
                      <div className="text-3xl font-black font-syne text-[#ecb613]">86%</div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        De las parejas mantiene o <strong className="text-white">aumenta su presupuesto</strong> durante la planificación. El dinero está disponible; lo que falta es confianza técnica.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Cero Cancelaciones</span>
                      <div className="text-3xl font-black font-syne text-emerald-400">91%</div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        De las parejas <strong className="text-white">jamás cancela su celebración</strong>. Es un mercado inmune a recesiones si ofreces certeza de fecha y profesionalidad.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 space-y-1.5">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase">Prioridad de Sonido & Fiesta</span>
                      <div className="text-3xl font-black font-syne text-[#00E5FF]">72,9%</div>
                      <p className="text-xs text-zinc-400 font-light leading-relaxed">
                        De los novios considera la música y el sonido el recuerdo más emotivo y duradero, por encima de flores o papelería.
                      </p>
                    </div>
                  </div>

                  {/* Las 4 Fases del Embudo: Dinosaurio vs Asalto EAR OS */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-base font-bold font-syne uppercase text-white tracking-wider">
                      Las 4 Fases de la Venta Nupcial: Bodas.net vs EAR OS
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                      <div className="p-4 rounded-xl bg-[#0b0b10] border border-zinc-800 space-y-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[9px] uppercase font-bold">
                          Fase 1: Investigación (Meses 12-9)
                        </span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong className="text-red-400">Bodas.net:</strong> Los ahoga en 500 fichas estáticas sin tarifas claras, forzando formularios ciegos.<br />
                          <strong className="text-emerald-400">EAR OS:</strong> Cotizador transparente instantáneo y filtro acústico 12 W/pax en 3 clics.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b0b10] border border-zinc-800 space-y-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[9px] uppercase font-bold">
                          Fase 2: Interés (Meses 8-5)
                        </span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong className="text-red-400">Bodas.net:</strong> Buzón cerrado que prohíbe pasar teléfonos o enlaces directos.<br />
                          <strong className="text-emerald-400">EAR OS:</strong> Teléfono directo y WhatsApp con el artista tras el primer contacto sin fricción.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b0b10] border border-zinc-800 space-y-2">
                        <span className="px-2 py-0.5 bg-[#ecb613]/20 text-[#ecb613] rounded text-[9px] uppercase font-bold">
                          Fase 3: Contratación (Meses 4-2)
                        </span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong className="text-red-400">Bodas.net:</strong> Semanas de intercambio de emails sin pasarela de pago nativa.<br />
                          <strong className="text-emerald-400">EAR OS:</strong> Cierre en 60 segundos con depósito de 100 € en Stripe (Price-Lock SHA-256).
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-[#0b0b10] border border-zinc-800 space-y-2">
                        <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[9px] uppercase font-bold">
                          Fase 4: Posventa (+1 Mes)
                        </span>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          <strong className="text-red-400">Bodas.net:</strong> Captura la reseña para su propio SEO y no te entrega el dato.<br />
                          <strong className="text-emerald-400">EAR OS:</strong> Solicitud automática de opinión a la "Semana Después" y "Mes Después" en Google propio.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Las 7 Etapas del Customer Journey */}
                  <div className="p-6 rounded-2xl bg-[#06060a] border border-zinc-800 space-y-4">
                    <h3 className="text-base font-bold font-syne uppercase text-white tracking-wider flex items-center gap-2">
                      <Crown size={16} className="text-[#ecb613]" />
                      El Recorrido Integral de 7 Etapas (Cronograma 12 Meses)
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5 text-xs font-mono">
                      {[
                        { num: '01', title: 'Consulta', desc: 'Descubrimiento del rider Bose F1 y cotización transparente.' },
                        { num: '02', title: 'Preselección', desc: 'Comparativa sin trampa: fincas homologadas vs tradicionales.' },
                        { num: '03', title: 'Cierre 100€', desc: 'Fianza Stripe atómica: fecha blindada legalmente en calendario.' },
                        { num: '04', title: 'Preparación', desc: 'Acuerdo de repertorio, timing de discursos y prueba acústica.' },
                        { num: '05', title: 'Día D en Vivo', desc: '12 W/pax, Shure Beta 87A, 0 acoples y 0 cortes de luz.' },
                        { num: '06', title: 'Semana +1', desc: 'Mensaje de agradecimiento y validación de satisfacción.' },
                        { num: '07', title: 'Mes +1', desc: 'Captura de reseña 5.0 y recomendación a futuras parejas.' },
                      ].map((step, idx) => (
                        <div key={idx} className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl space-y-1">
                          <span className="text-[#ecb613] font-bold text-[10px] block">{step.num} // {step.title}</span>
                          <p className="text-[11px] text-zinc-400 font-light leading-tight">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 3: MATRIZ DE TARIFAS & SPLIT ── */}
              {activeTab === 'tariffs' && (
                <motion.div
                  key="tariffs"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest">
                      TARIFAS INMUTABLES & ARQUITECTURA DE REPARTO
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Split Soberano 80 / 10 / 10 & Catálogo Canónico
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      El reparto inmutable que garantiza la lealtad de los mejores artistas de España mientras financia 
                      la infraestructura de EAR OS y la labor neuroacústica de VIMUME.
                    </p>
                  </div>

                  {/* Tarjetas de Desglose del Split */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-[#ecb613]/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#ecb613]/10 rounded-full blur-2xl pointer-events-none" />
                      <span className="px-3 py-1 bg-[#ecb613]/20 text-[#ecb613] text-[10px] font-mono font-bold rounded-full uppercase">
                        80% Artista Titular
                      </span>
                      <div className="text-3xl font-black font-syne text-white mt-4">280,00 € <span className="text-xs text-zinc-400 font-normal">por bolo de 350€</span></div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        Pago inmediato garantizado. El artista no persigue a nadie para cobrar ni paga cuotas mensuales. 
                        Dignidad salarial máxima en el sector musical.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-[#00E5FF]/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-[#00E5FF]/10 rounded-full blur-2xl pointer-events-none" />
                      <span className="px-3 py-1 bg-[#00E5FF]/20 text-[#00E5FF] text-[10px] font-mono font-bold rounded-full uppercase">
                        10% Productora EAR OS
                      </span>
                      <div className="text-3xl font-black font-syne text-white mt-4">35,00 € <span className="text-xs text-zinc-400 font-normal">por bolo de 350€</span></div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        Mantenimiento del motor agéntico, soporte en vivo, Stripe Connect, infraestructura en la nube y 
                        telemetría de despacho logístico.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold rounded-full uppercase">
                        10% Fundación VIMUME
                      </span>
                      <div className="text-3xl font-black font-syne text-white mt-4">35,00 € <span className="text-xs text-zinc-400 font-normal">por bolo de 350€</span></div>
                      <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                        Destinado a sesiones de musicoterapia y estimulación cognitiva a 40 Hz para residencias geriátricas 
                        públicas y privadas en España.
                      </p>
                    </div>
                  </div>

                  {/* Tabla de Servicios y Tarifas Base */}
                  <div className="space-y-4 pt-2">
                    <h3 className="text-lg font-bold font-syne uppercase tracking-wider text-white">
                      Tarifario Canónico de Salida al Mercado
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-[#ecb613] font-bold block">Edwin Agudelo (Solista)</span>
                        <span className="text-xl font-black text-white font-syne">350,00 €</span>
                        <p className="text-zinc-500 text-[11px]">1h directo (2 pases de 30 min) + Bose F1 + Shure Beta 87A.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-white font-bold block">Mariachi Trío Acústico</span>
                        <span className="text-xl font-black text-white font-syne">490,00 €</span>
                        <p className="text-zinc-500 text-[11px]">3 músicos en vivo (Guitarrón, Vihuela, Trompeta). Repertorio clásico.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-white font-bold block">Mariachi Cuarteto Completo</span>
                        <span className="text-xl font-black text-white font-syne">650,00 €</span>
                        <p className="text-zinc-500 text-[11px]">4 músicos (Violín, Trompeta, Guitarrón, Voz). Sonido de gala.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-[#00E5FF] font-bold block">Sonorización 150 pax (12 W/pax)</span>
                        <span className="text-xl font-black text-white font-syne">450,00 €</span>
                        <p className="text-zinc-500 text-[11px]">Bose F1 812 + Subwoofer 1.000W + Iluminación LED ambiental.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-amber-300 font-bold block">Logística Fuera de Méntrida</span>
                        <span className="text-xl font-black text-white font-syne">1,50 € / km</span>
                        <p className="text-zinc-500 text-[11px]">Primeros 50 km sin cargo. +120 € hotel si fin &ge; 3:00 AM o &gt; 200 km.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#0d0d12] border border-zinc-800 space-y-1">
                        <span className="text-[#FF2B44] font-bold block">Licitación B2G Art. 118 LCSP</span>
                        <span className="text-xl font-black text-white font-syne">&lt; 14.250 €</span>
                        <p className="text-zinc-500 text-[11px]">Memoria técnica municipal con limitador acústico &lt;75 dB SPL.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 3: PROPUESTA PARA FINCAS ── */}
              {activeTab === 'fincas' && (
                <motion.div
                  key="fincas"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-rose-400 uppercase tracking-widest">
                      EL CABALLO DE TROYA B2B
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Propuesta Irresistible para Fincas & Espacios
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      Las fincas están hartas de multas municipales por decibelios, quejas de vecinos y cuadros eléctricos 
                      reventados por DJs aficionados. EAR OS les ofrece paz mental absoluta sin coste.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-zinc-800 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                          <Volume2 size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold font-syne text-white">El Dolor Oculto de la Finca</h4>
                          <span className="text-[11px] font-mono text-zinc-500">Multas, cortes de luz y quejas</span>
                        </div>
                      </div>
                      <ul className="space-y-2.5 text-xs text-zinc-400 font-light">
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Policía local midiendo decibelios en el linde de la finca por DJs sin limitador.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Novios descontentos porque la ceremonia no se escuchó en las filas traseras.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-red-400 font-bold">•</span>
                          <span>Pagar cuotas mensuales de escaparate en portales para que los novios pidan presupuesto a ciegas.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0a0a0f] border border-emerald-500/30 space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <h4 className="text-base font-bold font-syne text-white">La Solución "Finca Blindada S-Class"</h4>
                          <span className="text-[11px] font-mono text-emerald-400">Certificación Acústica Gratuita</span>
                        </div>
                      </div>
                      <ul className="space-y-2.5 text-xs text-zinc-300 font-light">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Certificado de Potencia Homologada:</strong> Instalación de 12 W/pax con limitador &lt;85 dB garantizado por contrato.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Ficha 3D en fincasparaboda.com:</strong> Escaparate prémium sin cuotas mensuales ni comisiones fijas.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                          <span><strong>Tranquilidad Eléctrica y Legal:</strong> Equipos Bose y Shure con bajo consumo y seguro de responsabilidad civil.</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* El Script de Presentación a Fincas */}
                  <div className="p-6 rounded-2xl bg-zinc-900/50 border border-[#ecb613]/20 space-y-3">
                    <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">
                      EL GUION MAESTRO PARA EL DIRECTOR DE FINCA
                    </span>
                    <p className="text-xs text-zinc-300 italic font-mono leading-relaxed bg-[#050508] p-4 rounded-xl border border-zinc-800">
                      "Estimado [Nombre del Director], no venimos a venderle publicidad ni a cobrarle cuotas como Bodas.net. 
                      Venimos a certificar su espacio como 'Finca Acústicamente Blindada S-Class'. Le instalamos y gestionamos 
                      el sonido de ceremonias y cócteles con microfonía Shure y equipos Bose de dispersión controlada, 
                      garantizando por contrato que la música jamás superará los límites de decibelios municipales y que el 
                      100% de los invitados escuchará con nitidez absoluta. Para la finca el coste es 0 €; ustedes ganan 
                      prestigio, eliminan problemas vecinales y sus novios cuentan con un servicio de élite garantizado."
                    </p>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 4: PROPUESTA PARA PROVEEDORES ── */}
              {activeTab === 'vendors' && (
                <motion.div
                  key="vendors"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-[#00E5FF] uppercase tracking-widest">
                      EL PACTO DE LA SOBERANÍA
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Propuesta de Alianza para Proveedores Quemados
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      Los mejores músicos, floristas, fotógrafos y montadores están frustrados pagando cientos de euros al mes 
                      en marketplaces que luego les envían novias sin presupuesto o contactos fantasmas.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                      <div className="text-[#ecb613] font-bold text-sm font-syne flex items-center gap-2">
                        <DollarSign size={16} /> 0 € Cuotas Mensuales
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Basta de pagar 200 € al mes en invierno cuando no hay bodas. En EAR OS los proveedores se registran 
                        gratis y solo aportan el 10% cuando hay una boda real con depósito cobrado.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                      <div className="text-emerald-400 font-bold text-sm font-syne flex items-center gap-2">
                        <Lock size={16} /> Depósito 100 € Garantizado
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        No enviamos "peticiones de presupuesto frías". Cuando te entra una reserva por EAR OS, el cliente ya 
                        ha depositado 100,00 € en Stripe con bloqueo atómico de fecha. El cliente va en serio.
                      </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
                      <div className="text-[#00E5FF] font-bold text-sm font-syne flex items-center gap-2">
                        <Compass size={16} /> Logística Méntrida Transparente
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed">
                        Tarifa de 1,50 €/km calculada automáticamente con GPS real y suplemento de hotel de 120 € si el evento 
                        termina a las 3:00 AM o supera los 200 km. Todo previsto antes de salir.
                      </p>
                    </div>
                  </div>

                  {/* Cómo abordar al proveedor en 3 preguntas */}
                  <div className="p-6 rounded-2xl bg-[#0b0b10] border border-zinc-800 space-y-4">
                    <h4 className="text-sm font-bold font-syne uppercase text-white tracking-wider">
                      Cómo Desarmar a un Proveedor en 3 Preguntas Clave:
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-3.5 bg-black/50 border border-zinc-800/80 rounded-xl space-y-1">
                        <span className="text-[#ecb613] font-bold">1. Pregunta de Coste Real:</span>
                        <p className="text-zinc-400">"¿Cuánto dinero pagaste en cuotas fijas a Bodas.net durante los últimos 12 meses?" (Suelen ser 1.800 € - 3.600 €).</p>
                      </div>
                      <div className="p-3.5 bg-black/50 border border-zinc-800/80 rounded-xl space-y-1">
                        <span className="text-rose-400 font-bold">2. Pregunta de Fricción:</span>
                        <p className="text-zinc-400">"¿Cuántos de esos mensajes que recibes son novios que solo preguntan precio y nunca vuelven a contestar?" (Más del 80%).</p>
                      </div>
                      <div className="p-3.5 bg-black/50 border border-zinc-800/80 rounded-xl space-y-1">
                        <span className="text-emerald-400 font-bold">3. La Oferta de Cierre:</span>
                        <p className="text-zinc-400">"Nosotros te damos la ficha gratis. Si te enviamos una boda con 100 € ya pagados en fianza, ¿te parecería justo quedarte el 80% íntegro?"</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 5: NEGOCIACIÓN & OBJECIONES ── */}
              {activeTab === 'scripts' && (
                <motion.div
                  key="scripts"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-amber-400 uppercase tracking-widest">
                      ARSENAL DE COMBATE PSICOLÓGICO Y CIERRE
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Resolución Táctica de Objeciones
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      Selecciona cualquier objeción para desplegar el dolor subyacente y la respuesta letal que neutraliza 
                      la resistencia del cliente, la finca o el proveedor.
                    </p>
                  </div>

                  {/* Selector Interactivo de Objeciones */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-5 space-y-2">
                      {objectionsData.map((obj, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveObjection(idx)}
                          className={`w-full p-4 rounded-xl text-left text-xs transition-all border flex items-center justify-between gap-3 cursor-pointer ${
                            activeObjection === idx
                              ? 'bg-[#ecb613]/10 border-[#ecb613] text-white shadow-md'
                              : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                          }`}
                        >
                          <span className="font-syne font-bold leading-tight">{obj.q}</span>
                          <ChevronRight size={16} className={`shrink-0 ${activeObjection === idx ? 'text-[#ecb613]' : 'text-zinc-600'}`} />
                        </button>
                      ))}
                    </div>

                    <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0b0b10] border border-zinc-800 space-y-5">
                      <div>
                        <span className="text-[10px] font-mono text-red-400 uppercase font-bold tracking-wider">
                          EL DOLOR OCULTO O TRAMPA DE LA OBJECIÓN:
                        </span>
                        <p className="text-xs text-zinc-400 mt-1 font-light leading-relaxed">
                          {objectionsData[activeObjection].pain}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-zinc-900/80 border border-emerald-500/30 space-y-2">
                        <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                          <Zap size={13} /> RESPUESTA LETAL S-CLASS:
                        </span>
                        <p className="text-xs text-white font-mono leading-relaxed">
                          "{objectionsData[activeObjection].rebuttal}"
                        </p>
                      </div>

                      <div className="pt-2 text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                        <HelpCircle size={14} /> Tip: Nunca discutas sobre precio. Desvía la conversación al Pánico Acústico y la certeza de la fianza.
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 6: HOJA DE RUTA PASO A PASO ── */}
              {activeTab === 'roadmap' && (
                <motion.div
                  key="roadmap"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest">
                      PLAN DE CONQUISTA CRONOLÓGICO
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Hoja de Ruta de Dominancia Territorial
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      La secuencia inalterable para ejecutar la conquista sin quemar capital y asegurando facturación desde la semana 1.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      {
                        step: 'Fase 01',
                        title: 'Despliegue del Embudo Hostinger Edge (Opción A)',
                        desc: 'Publicación de los 3 Edge Shells PHP 8.3 JIT con compresión LiteSpeed en viajemusicalporlamemoria.com, fincasparaboda.com y artistaseuropa.com con checkout directo Stripe (100 €).',
                        status: 'INMEDIATO'
                      },
                      {
                        step: 'Fase 02',
                        title: 'Conquista de Fincas Llave en la Zona Cero (Méntrida / Toledo / Madrid Sur)',
                        desc: 'Visita y certificación acústica gratuita a las 10 fincas principales de la zona. Se les ofrece la homologación <85 dB y la ficha prémium sin cuotas en fincasparaboda.com.',
                        status: 'SEMANAS 1-2'
                      },
                      {
                        step: 'Fase 03',
                        title: 'Despliegue del Radar B2G Licitaciones (<14.250 € Art. 118 LCSP)',
                        desc: 'Generación con 1-clic de pliegos y memorias técnicas para ayuntamientos objetivo (Toledo, Torrijos, Illescas, etc.) con SROI 4.85x y acústica garantizada a <75 dB.',
                        status: 'EN PARALELO'
                      },
                      {
                        step: 'Fase 04',
                        title: 'Activación del Roster de Élite (30 Artistas Certificados)',
                        desc: 'Firma de pacto 80/10/10 con solistas de élite, mariachis y DJs con limitador, asignándoles fichas auditadas sin cuota mensual.',
                        status: 'MES 1'
                      },
                      {
                        step: 'Fase 05',
                        title: 'Campaña Masiva de Reclamación de Ficha (Claim Token)',
                        desc: 'Liberación de los 60.000 proveedores con token criptográfico único para que reclamen su perfil sin coste y activen la recepción de bodas.',
                        status: 'POST-ESTRATEGIA'
                      },
                    ].map((phase, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-[#0a0a0f] border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-[#ecb613] uppercase font-bold tracking-widest">
                            {phase.step} // {phase.status}
                          </span>
                          <h4 className="text-base font-bold font-syne text-white">{phase.title}</h4>
                          <p className="text-xs text-zinc-400 font-light max-w-3xl leading-relaxed">{phase.desc}</p>
                        </div>
                        <span className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-mono text-xs font-bold shrink-0 self-start md:self-auto">
                          Prioridad Alta
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── PESTAÑA 7: SIMULADOR INTERACTIVO DE CIERRE ── */}
              {activeTab === 'simulator' && (
                <motion.div
                  key="simulator"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="space-y-8"
                >
                  <div className="border-b border-zinc-800/60 pb-6">
                    <div className="text-[11px] font-mono text-[#ecb613] uppercase tracking-widest">
                      SIMULADOR TÁCTICO & GENERADOR DE CIERRE
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black font-syne uppercase mt-1">
                      Calculadora de Cotización y Cierre 1-Clic
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 max-w-2xl font-light">
                      Modela el servicio, distancia kilométrica desde Méntrida y genera el presupuesto oficial 
                      junto con el guion exacto de cierre para WhatsApp o Email.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Controles de Entrada */}
                    <div className="lg:col-span-5 space-y-5 bg-[#0a0a0f] p-6 rounded-2xl border border-zinc-800">
                      <div>
                        <label className="text-xs font-mono text-zinc-400 block mb-2 uppercase">
                          1. Selección de Servicio
                        </label>
                        <select
                          value={simService}
                          onChange={(e) => setSimService(e.target.value as any)}
                          className="w-full bg-zinc-900 border border-zinc-700 text-white text-xs font-mono rounded-xl p-3.5 focus:border-[#ecb613] outline-none"
                        >
                          <option value="edwin">Edwin Agudelo Solista (350,00 €)</option>
                          <option value="mariachi_trio">Mariachi Trío Acústico (490,00 €)</option>
                          <option value="mariachi_poker">Mariachi Cuarteto Clásico (650,00 €)</option>
                          <option value="sound_150">Sonorización Bose F1 150 pax (450,00 €)</option>
                          <option value="b2g_small">Gala Municipal VIMUME Menor (3.200,00 €)</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-zinc-400 mb-1">
                          <span>2. Distancia desde Méntrida</span>
                          <span className="text-[#ecb613] font-bold">{simKm} km</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="350"
                          value={simKm}
                          onChange={(e) => setSimKm(Number(e.target.value))}
                          className="w-full accent-[#ecb613] cursor-pointer"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-zinc-600 mt-1">
                          <span>0 km (Méntrida)</span>
                          <span>50 km (Gratis)</span>
                          <span>350 km</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          id="lateNight"
                          checked={simLateNight}
                          onChange={(e) => setSimLateNight(e.target.checked)}
                          className="w-4 h-4 rounded bg-zinc-900 border-zinc-700 accent-[#ecb613] cursor-pointer"
                        />
                        <label htmlFor="lateNight" className="text-xs font-mono text-zinc-300 cursor-pointer">
                          Evento finaliza &ge; 3:00 AM (+120 € Hotel)
                        </label>
                      </div>

                      {/* Desglose Económico */}
                      <div className="border-t border-zinc-800 pt-4 space-y-2 text-xs font-mono">
                        <div className="flex justify-between text-zinc-400">
                          <span>Base Servicio:</span>
                          <span className="text-white">{simCalculations.base.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Kilometraje ({Math.max(0, simKm - FREE_KM_THRESHOLD)} km x 1,50€):</span>
                          <span className="text-white">{simCalculations.logistics.toFixed(2)} €</span>
                        </div>
                        {simCalculations.hotel > 0 && (
                          <div className="flex justify-between text-amber-300">
                            <span>Suplemento Hotel:</span>
                            <span>{simCalculations.hotel.toFixed(2)} €</span>
                          </div>
                        )}
                        <div className="flex justify-between text-zinc-400">
                          <span>IVA (21%):</span>
                          <span className="text-white">{simCalculations.iva.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-base font-bold text-[#ecb613] pt-2 border-t border-zinc-800">
                          <span>TOTAL OFICIAL:</span>
                          <span>{simCalculations.total.toFixed(2)} €</span>
                        </div>

                        {/* Split 80/10/10 */}
                        <div className="p-3 bg-black/40 rounded-xl border border-zinc-800/80 mt-3 space-y-1 text-[11px]">
                          <div className="text-zinc-500 font-bold uppercase text-[9px]">Reparto Split 80/10/10:</div>
                          <div className="flex justify-between text-emerald-400">
                            <span>80% Artista / Proveedor:</span>
                            <span>{simCalculations.artistCut.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>10% EAR OS Tecnología:</span>
                            <span>{simCalculations.earOsCut.toFixed(2)} €</span>
                          </div>
                          <div className="flex justify-between text-amber-300">
                            <span>10% Fondo Social VIMUME:</span>
                            <span>{simCalculations.vimumeCut.toFixed(2)} €</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generador de Guion de Cierre */}
                    <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-[#ecb613] uppercase font-bold tracking-wider">
                            Guion de Cierre Automático para WhatsApp / Email:
                          </span>
                          <button
                            onClick={handleCopyScript}
                            className="px-3.5 py-1.5 rounded-lg bg-[#ecb613] text-black font-syne text-xs font-bold flex items-center gap-1.5 hover:bg-amber-300 transition-all cursor-pointer shadow-md"
                          >
                            {copiedScript ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedScript ? 'Copiado al Portapapeles!' : 'Copiar Guion'}</span>
                          </button>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#060608] border border-zinc-800 font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
                          {generatedClosingScript}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-3">
                        <Sparkles size={18} className="shrink-0 text-[#ecb613]" />
                        <span>Este guion elimina dudas, fija el estándar de calidad acústica y exige la fianza de 100€ de Stripe para bloquear fecha inmediatamente.</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* ── FOOTER CALL TO ACTION ── */}
          <div className="text-center py-6 border-t border-zinc-800/60">
            <p className="text-xs font-mono text-zinc-500">
              EAR OS V2 // SISTEMA DE DOMINANCIA TERRITORIAL S-CLASS · DISECCIÓN ATÓMICA DE MERCADO
            </p>
          </div>

        </div>
      </main>
    </MeshGradientBackground>
  );
}
