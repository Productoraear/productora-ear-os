'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Flame, CheckCircle2, Star, ShieldCheck, Sparkles, 
  MessageCircle, Lock, ArrowRight, ChevronRight, Check,
  Clock, MapPin, Users, Heart, Award, UtensilsCrossed,
  Truck, Shield, Volume2, PhoneCall, HelpCircle, FileText
} from 'lucide-react';

interface ArrozDish {
  id: string;
  title: string;
  subtitle: string;
  pricePerPax: number;
  category: 'MARISCO' | 'CARNE' | 'TRADICIONAL' | 'VEGANO';
  badge: string;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  ingredients: string[];
  socarratLevel: 'Crujiente Caramelizado' | 'Punto Óptimo' | 'Meloso' | 'Puntas Erguidas Crujientes';
  pairing: string;
}

const ARROCES_CATALOG: ArrozDish[] = [
  {
    id: 'senyoret-lonja',
    title: 'Arroz del Senyoret & Sepia de Lonja',
    subtitle: 'El clásico comodín para bodas y fincas donde nadie se mancha',
    pricePerPax: 16.50,
    category: 'MARISCO',
    badge: 'TOP VENTAS EVENTOS',
    rating: 5.0,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    description: 'Todo el marisco pelado a mano. Fondo de pescado de roca y cangrejo azul con sofrito lento de ñoras, sepia fresca de lonja y gambón rojo.',
    ingredients: ['Sepia de bahía', 'Gambón pelado', 'Fondo de roca 14h', 'Azafrán en hebra D.O.'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Albariño sobre lías o Verdejo D.O. Rueda'
  },
  {
    id: 'carabinero-xl',
    title: 'Arroz Monumental de Carabinero XL',
    subtitle: 'La cúspide gastronómica para bodas y recepciones VIP',
    pricePerPax: 24.50,
    category: 'MARISCO',
    badge: 'MÁXIMO LUJO VIP',
    rating: 5.0,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80',
    description: 'Carabineros salvajes de gran calibre abiertos en canal sobre el arroz. Coral emulsionado en la salmorreta aportando un sabor marino profundo e inolvidable.',
    ingredients: ['Carabinero salvaje XL', 'Salmorreta alicantina', 'Fondo de galeras y cangrejo', 'Arroz bomba selecto'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Champagne Brut Nature o Godello envejecido'
  },
  {
    id: 'gamba-roja-denia',
    title: 'Arroz de Gamba Roja & Ajetes Tiernos',
    subtitle: 'Elegancia mediterránea con reducción de cabezas en vivo',
    pricePerPax: 23.00,
    category: 'MARISCO',
    badge: 'SELECCIÓN GOURMET',
    rating: 4.98,
    reviews: 38,
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
    description: 'Gamba roja de subasta tratada con precisión milimétrica. Fondo translúcido pero intenso, con el jugo yodado de las cabezas marcando cada grano.',
    ingredients: ['Gamba roja fresca', 'Ajos tiernos del campo', 'Fumet de pescado blanco', 'Pimentón de la Vera ahumado'],
    socarratLevel: 'Punto Óptimo',
    pairing: 'Cava Reserva o Rosado provenzal'
  },
  {
    id: 'rabo-toro-glaseado',
    title: 'Arroz Meloso de Rabo de Toro & Trufa',
    subtitle: 'Potencia cárnica desmigada tras 12h de cocción a fuego lento',
    pricePerPax: 19.50,
    category: 'CARNE',
    badge: 'OTOÑO-INVIERNO SIGNATURE',
    rating: 4.99,
    reviews: 51,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    description: 'Rabo de toro estofado al vino tinto de Madrid y desmigado a mano. Caldo denso y gelatinoso que envuelve el arroz en una textura aterciopelada y perfumada de trufa.',
    ingredients: ['Rabo de toro meloso', 'Vino tinto D.O. Vinos de Madrid', 'Láminas de trufa negra', 'Chalotas caramelizadas'],
    socarratLevel: 'Meloso',
    pairing: 'Ribera del Duero Crianza o Tinto de Toro'
  },
  {
    id: 'secreto-iberico-piquillo',
    title: 'Arroz de Secreto Ibérico & Pimiento de Cristal',
    subtitle: 'Equilibrio maestro de grasa noble y dulzor vegetal',
    pricePerPax: 18.00,
    category: 'CARNE',
    badge: 'POPULAR EN FINCAS',
    rating: 4.96,
    reviews: 47,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    description: 'Secreto ibérico de bellota dorado a fuego vivo para mantener los jugos, acompañado de pimientos de cristal confitados y fondo de jamón curado.',
    ingredients: ['Secreto ibérico de bellota', 'Pimientos de cristal', 'Fondo de jamón y hueso', 'Romero fresco de monte'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Rioja Reserva o Garnacha de Gredos'
  },
  {
    id: 'costilla-duroc-alcachofa',
    title: 'Arroz de Costilla Duroc & Alcachofa de Tudela',
    subtitle: 'La armonía campestre de huerta y carne confitada',
    pricePerPax: 16.90,
    category: 'CARNE',
    badge: 'TEMPORADA DE HUERTA',
    rating: 4.95,
    reviews: 33,
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80',
    description: 'Costilla de cerdo Duroc marinada y glaseada, corazones de alcachofa fritos en el momento y judía bobby plana de proximidad.',
    ingredients: ['Costilla Duroc deshuesada', 'Alcachofa de Tudela', 'Judía verde bobby', 'Fondo cárnico concentrado'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Mencía del Bierzo o Somontano'
  },
  {
    id: 'arroz-negro-potera',
    title: 'Arroz Negro de Calamar de Potera & All-i-Oli',
    subtitle: 'Color azabache puro y contraste crocante con emulsión de ajo asado',
    pricePerPax: 15.50,
    category: 'MARISCO',
    badge: 'CONTRASTE VISUAL',
    rating: 4.97,
    reviews: 40,
    image: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    description: 'Tinta natural de calamar fresco, sepionet picado a dados pequeños y all-i-oli suave de mortero preparado en directo durante el showcooking.',
    ingredients: ['Calamar de potera', 'Tinta natural fresca', 'Fondo oscuro de crustáceos', 'All-i-oli de mortero'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Chardonnay fermentado en barrica'
  },
  {
    id: 'paella-valenciana-tradicional',
    title: 'Paella Valenciana Tradicional al Fuego de Leña',
    subtitle: 'El canon indiscutible: pollo, conejo, garrofó y aroma de romero',
    pricePerPax: 16.00,
    category: 'TRADICIONAL',
    badge: 'CANON TRADICIONAL',
    rating: 5.0,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    description: 'Elaborada según la receta canónica con fuego de sarmiento y leña de naranjo. Pollo campero, conejo de granja, bajoqueta, garrofó valenciano y brizna de romero silvestre.',
    ingredients: ['Pollo campero', 'Conejo de granja', 'Garrofó auténtico', 'Romero silvestre alicantino'],
    socarratLevel: 'Crujiente Caramelizado',
    pairing: 'Tinto joven frutal o Cerveza artesana tostada'
  },
  {
    id: 'huerta-mediterranea-vegano',
    title: 'Arroz Huerta Mediterránea 100% Vegano',
    subtitle: 'Máxima frescura botánica sin un solo gramo de proteína animal',
    pricePerPax: 15.00,
    category: 'VEGANO',
    badge: '100% PLANT BASED',
    rating: 4.94,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    description: 'Corazones de alcachofa, espárragos trigueros, boletus edulis, pimientos asados a la leña y fondo 100% vegetal reducido durante 8 horas.',
    ingredients: ['Espárrago triguero', 'Boletus edulis', 'Alcachofa fresca', 'Fondo vegetal concentrado'],
    socarratLevel: 'Punto Óptimo',
    pairing: 'Sauvignon Blanc o Vino Naranja ecológico'
  },
  {
    id: 'fideua-gandiense',
    title: 'Fideuà Gandiense de Fideo Cabellín Nº 0',
    subtitle: 'Fideos finos tostados y erguidos con marisco de bahía',
    pricePerPax: 16.50,
    category: 'TRADICIONAL',
    badge: 'CRUJIENTE DE HORNO',
    rating: 4.96,
    reviews: 35,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80',
    description: 'Fideo cabellín frito previamente para que quede de punta tras el golpe de calor. Sepia melosa, gamba arrocera y fondo marinero con all-i-oli de ajo negro.',
    ingredients: ['Fideo nº 0 cabellín', 'Sepia de lonja', 'Gamba arrocera', 'All-i-oli de ajo negro'],
    socarratLevel: 'Puntas Erguidas Crujientes',
    pairing: 'Blanco Malvasía o Cava Brut'
  }
];

export default function ArrocesSotaPage() {
  const [selectedDish, setSelectedDish] = useState<ArrozDish>(ARROCES_CATALOG[0]);
  const [pax, setPax] = useState<number>(60);
  const [mode, setMode] = useState<'SHOWCOOKING' | 'DELIVERY'>('SHOWCOOKING');
  const [distanceKm, setDistanceKm] = useState<number>(35);
  const [addJamon, setAddJamon] = useState<boolean>(false);
  const [addAllioliBar, setAddAllioliBar] = useState<boolean>(true);
  const [addWineBar, setAddWineBar] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);

  // Cálculos de presupuesto en tiempo real
  const baseFoodTotal = selectedDish.pricePerPax * pax;
  const showcookingFee = mode === 'SHOWCOOKING' ? 180 : 0; // Coste de montaje y puesta en escena
  const logisticsDistance = Math.max(0, distanceKm - 50);
  const logisticsTotal = logisticsDistance * 1.50; // 1,50 €/km después de 50km
  const hotelSupplement = (distanceKm > 200) ? 120 : 0;
  
  const jamonTotal = addJamon ? 350 : 0;
  const allioliTotal = addAllioliBar ? pax * 1.50 : 0;
  const wineTotal = addWineBar ? pax * 6.50 : 0;

  const grandTotal = Math.round(
    baseFoodTotal + 
    showcookingFee + 
    logisticsTotal + 
    hotelSupplement + 
    jamonTotal + 
    allioliTotal + 
    wineTotal
  );

  const estimatedPricePerPax = (grandTotal / pax).toFixed(2);

  // WhatsApp Payload preconfigurado
  const whatsappText = encodeURIComponent(
    `Hola Productora EAR, deseo cotizar SHOWCOOKING DE ARROCES S-CLASS:\n\n` +
    `🍲 Arroz: ${selectedDish.title}\n` +
    `👥 Comensales: ${pax} pax\n` +
    `🍳 Modalidad: ${mode === 'SHOWCOOKING' ? 'Showcooking en Directo con Leña/Gas' : 'Delivery en Paellera Caliente'}\n` +
    `📍 Ubicación: Aprox. ${distanceKm} km desde Méntrida\n` +
    `🧀 Extras: ${[addJamon ? 'Cortador Jamón' : null, addAllioliBar ? 'Barra All-i-Oli' : null, addWineBar ? 'Bodega D.O. Madrid' : null].filter(Boolean).join(', ') || 'Ninguno'}\n` +
    `💰 Presupuesto Estimado: ${grandTotal} € (${estimatedPricePerPax} €/pax)\n` +
    `🔒 Deseo verificar disponibilidad de fecha con depósito de 100€ Price-Lock.`
  );

  return (
    <main className="min-h-screen bg-[#030305] text-white font-sans selection:bg-[#ecb613] selection:text-black pb-28 pt-24">
      {/* Background Glow */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#ecb613]/12 to-transparent blur-[160px] pointer-events-none rounded-full" />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. HERO SECTION SOTA: VAMPIRIZACIÓN DE 120GRAMOS ELEVADA A S-CLASS */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto text-center relative z-10 mb-16">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0d0d12] border border-[#ecb613]/40 shadow-[0_0_35px_rgba(236,182,19,0.2)] mb-5">
          <Flame size={15} className="text-[#ecb613] animate-pulse" />
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] uppercase text-zinc-300">
            MAESTROS ARROCEROS // SHOWCOOKING DE AUTOR S-CLASS
          </span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight uppercase font-syne max-w-5xl mx-auto leading-[1.05] mb-6">
          Arroces Monumentales & <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ecb613] via-[#ffcf4d] to-[#ecb613]">
            Paellas Gigantes en Directo
          </span>
        </h1>

        <p className="text-zinc-400 text-base sm:text-lg max-w-3xl mx-auto font-light leading-relaxed mb-8">
          La evolución definitiva del servicio de arroces en Madrid y Zona Centro. Desde showcooking monumental a leña de sarmiento 
          en fincas exclusivas hasta delivery caliente en paellera tradicional con recogida posterior sin fianza.
        </p>

        {/* Telemetría y Sellos de Garantía */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto mb-10">
          <div className="p-3.5 rounded-2xl bg-[#09090d] border border-white/5 text-left">
            <div className="flex items-center gap-2 text-[#ecb613] text-xs font-mono font-bold mb-1">
              <UtensilsCrossed size={14} /> CAPACIDAD REAL
            </div>
            <div className="text-xl font-black text-white">30 a 2.000 pax</div>
            <div className="text-[11px] text-zinc-500">Paellas hasta 2.5m Ø</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#09090d] border border-white/5 text-left">
            <div className="flex items-center gap-2 text-[#AAD6CD] text-xs font-mono font-bold mb-1">
              <Volume2 size={14} /> SONIDO BOSE
            </div>
            <div className="text-xl font-black text-white">&lt; 75 dB SPL</div>
            <div className="text-[11px] text-zinc-500">Música ambiental cortesía</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#09090d] border border-white/5 text-left">
            <div className="flex items-center gap-2 text-[#258DCD] text-xs font-mono font-bold mb-1">
              <ShieldCheck size={14} /> HIGIENE Y REGISTRO
            </div>
            <div className="text-xl font-black text-white">RGSEAA APPCC</div>
            <div className="text-[11px] text-zinc-500">RC 600.000 € cubierto</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-[#09090d] border border-white/5 text-left">
            <div className="flex items-center gap-2 text-[#FF455B] text-xs font-mono font-bold mb-1">
              <Lock size={14} /> PRICE-LOCK 72H
            </div>
            <div className="text-xl font-black text-white">100,00 € Stripe</div>
            <div className="text-[11px] text-zinc-500">Bloqueo estricto de fecha</div>
          </div>
        </div>

        {/* Quick CTA buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#cotizador"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#ecb613] to-[#ffcf4d] text-black font-black text-xs uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_30px_rgba(236,182,19,0.3)] flex items-center gap-2"
          >
            <span>Configurar y Cotizar en Directo</span>
            <ArrowRight size={14} />
          </a>
          <a
            href="https://buy.stripe.com/5kQ5kF2Ryh03fCT3Et4Vy0f"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 rounded-xl bg-[#0e0e14] border border-white/10 hover:border-[#ecb613]/50 text-white font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2"
          >
            <Lock size={14} className="text-[#ecb613]" />
            <span>Bloqueo Fecha 100€ Stripe</span>
          </a>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. DOS MODALIDADES OPERATIVAS (SUPERIORIDAD FRENTE A 120GRAMOS) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-20">
        <div className="text-center mb-10">
          <div className="text-xs font-mono text-[#ecb613] tracking-widest uppercase mb-2">
            ARQUITECTURA DE SERVICIO SOBERANO
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase font-syne">
            Elige Cómo Quieres Que Llegue el Arroz a tu Evento
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Modalidad A: Showcooking en Directo */}
          <div 
            onClick={() => setMode('SHOWCOOKING')}
            className={`cursor-pointer p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
              mode === 'SHOWCOOKING' 
                ? 'bg-gradient-to-b from-[#121008] to-[#08080c] border-[#ecb613] shadow-[0_0_40px_rgba(236,182,19,0.15)]' 
                : 'bg-[#08080c] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] text-[10px] font-mono font-bold tracking-wider uppercase">
                MODALIDAD A // MÁXIMA EXPERIENCIA
              </span>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                mode === 'SHOWCOOKING' ? 'border-[#ecb613] bg-[#ecb613] text-black' : 'border-white/20'
              }`}>
                {mode === 'SHOWCOOKING' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase font-syne mb-2">
              Showcooking en Vivo a Fuego & Leña
            </h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Montamos el puesto gastronómico completo en tu finca o jardín. Paelleras monumentales cocinadas delante de tus invitados 
              con leña de sarmiento o quemadores profesionales. Olor a campo, espectáculo visual y ambiente vibrante.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
                <span>Maestros arroceros uniformados con protocolo de emplatado continuo</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
                <span>Sonorización acústica ambiental Bose S1 Pro / F1 incluida (&lt; 75 dB)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
                <span>Desde 30 hasta 2.000 comensales sin retrasos ni esperas</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
                <span>Punto de socarrat caramelizado controlado comensal a comensal</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Puesta en escena:</span>
              <span className="text-sm font-mono font-bold text-[#ecb613]">+180 € montaje total</span>
            </div>
          </div>

          {/* Modalidad B: Delivery Monumental */}
          <div 
            onClick={() => setMode('DELIVERY')}
            className={`cursor-pointer p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden ${
              mode === 'DELIVERY' 
                ? 'bg-gradient-to-b from-[#121008] to-[#08080c] border-[#ecb613] shadow-[0_0_40px_rgba(236,182,19,0.15)]' 
                : 'bg-[#08080c] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-[#258DCD] text-[10px] font-mono font-bold tracking-wider uppercase">
                MODALIDAD B // ENTREGA CALIENTE
              </span>
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                mode === 'DELIVERY' ? 'border-[#ecb613] bg-[#ecb613] text-black' : 'border-white/20'
              }`}>
                {mode === 'DELIVERY' && <Check size={14} strokeWidth={3} />}
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase font-syne mb-2">
              Delivery Caliente en Paellera Tradicional
            </h3>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              El formato perfeccionado: te llevamos la paella caliente y en el minuto exacto de reposo directamente a tu finca o domicilio. 
              Disfrutas de la comida con tus invitados y nosotros recogemos la paellera sucia más tarde sin fianza ni trabajo para ti.
            </p>

            <ul className="space-y-2.5 text-xs text-zinc-300 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#258DCD] shrink-0" />
                <span>Arroz recién terminado transportado en funda térmica aislante</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#258DCD] shrink-0" />
                <span>Sin fianzas bancarias ni retenciones molestas en tarjeta</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#258DCD] shrink-0" />
                <span>Recogida del recipiente entre las 16:00 y las 18:00 (o al día siguiente)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#258DCD] shrink-0" />
                <span>Ideal para celebraciones familiares íntimas o bodas second-day</span>
              </li>
            </ul>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <span className="text-xs text-zinc-400">Puesta en escena:</span>
              <span className="text-sm font-mono font-bold text-[#258DCD]">0 € (Sin coste de montaje)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. CARTA DE LOS 10 ARROCES SOTA (VAMPIRIZADA Y ELEVADA) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs font-mono text-[#ecb613] tracking-widest uppercase mb-2">
              CATÁLOGO GASTRONÓMICO S-CLASS
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-syne">
              Los 10 Arroces Maestros de Productora EAR
            </h2>
          </div>
          <p className="text-xs text-zinc-400 max-w-md">
            Todos los arroces se elaboran con grano bomba seleccionado de la Albufera, fondos de cocción lenta (mínimo 10h) 
            y productos frescos de lonja o dehesa con trazabilidad certificada.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ARROCES_CATALOG.map((dish) => {
            const isSelected = selectedDish.id === dish.id;
            return (
              <div 
                key={dish.id}
                onClick={() => setSelectedDish(dish)}
                className={`cursor-pointer rounded-3xl border transition-all duration-300 flex flex-col justify-between p-6 ${
                  isSelected 
                    ? 'bg-[#121008] border-[#ecb613] shadow-[0_0_35px_rgba(236,182,19,0.2)] ring-1 ring-[#ecb613]' 
                    : 'bg-[#09090e] border-white/5 hover:border-white/20'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#ecb613]/20 text-[#ecb613] border border-[#ecb613]/30">
                      {dish.badge}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <Star size={12} className="text-[#ecb613] fill-[#ecb613]" />
                      <span>{dish.rating} ({dish.reviews})</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold uppercase font-syne mb-1 text-white">
                    {dish.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    {dish.description}
                  </p>

                  <div className="space-y-1.5 mb-4">
                    <div className="text-[11px] text-zinc-500 font-mono">INGREDIENTES CLAVE:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {dish.ingredients.map((ing, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-zinc-300">
                          {ing}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-[11px] text-zinc-400 mb-4">
                    <span className="text-zinc-500 font-mono">Socarrat: </span>
                    <span className="text-[#AAD6CD] font-medium">{dish.socarratLevel}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500 uppercase font-mono">Precio Ración</div>
                    <div className="text-2xl font-black font-mono text-[#ecb613]">
                      {dish.pricePerPax.toFixed(2)} €
                    </div>
                  </div>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      isSelected 
                        ? 'bg-[#ecb613] text-black shadow-[0_0_15px_rgba(236,182,19,0.4)]' 
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isSelected ? 'Seleccionado' : 'Elegir'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. COTIZADOR Y SIMULADOR REACTIVO S-CLASS (ID: cotizador) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="cotizador" className="px-4 sm:px-6 max-w-7xl mx-auto mb-20 scroll-mt-28">
        <div className="bg-[#09090d] border border-[#ecb613]/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          {/* Subtle gold watermark */}
          <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#ecb613]/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-3xl mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613] text-[10px] font-mono font-bold tracking-widest uppercase mb-3">
              SIMULADOR DE PRESUPUESTO EN TIEMPO REAL
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase font-syne">
              Configura tu Evento Gastronómico
            </h2>
            <p className="text-sm text-zinc-400 mt-2 font-light">
              Transparencia absoluta. Sin presupuestos opacos ni cadenas de WhatsApp sin precio cerrado. 
              Calcula la logística exacta, comensales y extras con tarifa oficial S-Class.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Controles del Cotizador (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Arroz Seleccionado */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="text-xs text-zinc-400 font-mono mb-1">PLATO SELECCIONADO:</div>
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-white font-syne">{selectedDish.title}</div>
                  <div className="text-base font-mono font-black text-[#ecb613]">{selectedDish.pricePerPax.toFixed(2)} €/pax</div>
                </div>
              </div>

              {/* Slider de Comensales */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-mono">NÚMERO DE COMENSALES:</span>
                  <span className="text-xl font-mono font-black text-white">{pax} pax</span>
                </div>
                <input 
                  type="range" 
                  min="20" 
                  max="500" 
                  step="5"
                  value={pax}
                  onChange={(e) => setPax(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#ecb613]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>20 pax (Íntimo)</span>
                  <span>100 pax (Boda media)</span>
                  <span>250 pax (Gran evento)</span>
                  <span>500+ pax</span>
                </div>
              </div>

              {/* Selector de Distancia Logística desde Méntrida */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-zinc-400 font-mono">DISTANCIA DESDE HUB MÉNTRIDA (TOLEDO):</span>
                  <span className="text-base font-mono font-bold text-[#AAD6CD]">{distanceKm} km</span>
                </div>
                <input 
                  type="range" 
                  min="5" 
                  max="250" 
                  step="5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#AAD6CD]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mt-1">
                  <span>Méntrida / Navalcarnero (0 km)</span>
                  <span>Madrid Capital (50 km - Incluido)</span>
                  <span>Toledo / Guadalajara</span>
                  <span>&gt; 200 km (Hotel)</span>
                </div>
              </div>

              {/* Módulos Adicionales de Alta Gama */}
              <div className="space-y-3">
                <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">
                  SERVICIOS Y EXTRAS COMPLEMENTARIOS:
                </div>

                {/* Extra 1: Jamón */}
                <div 
                  onClick={() => setAddJamon(!addJamon)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    addJamon ? 'bg-[#121008] border-[#ecb613]' : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      addJamon ? 'bg-[#ecb613] border-[#ecb613] text-black' : 'border-zinc-700'
                    }`}>
                      {addJamon && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Cortador Profesional de Jamón Ibérico de Bellota</div>
                      <div className="text-[11px] text-zinc-400">Pieza 100% Bellota D.O. Guijuelo / Jabugo + Maestro Cortador 2h</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#ecb613]">+350 €</div>
                </div>

                {/* Extra 2: Barra All-i-Oli */}
                <div 
                  onClick={() => setAddAllioliBar(!addAllioliBar)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    addAllioliBar ? 'bg-[#121008] border-[#ecb613]' : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      addAllioliBar ? 'bg-[#ecb613] border-[#ecb613] text-black' : 'border-zinc-700'
                    }`}>
                      {addAllioliBar && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Barra Degustación de All-i-Olis de Autor</div>
                      <div className="text-[11px] text-zinc-400">All-i-oli tradicional de mortero, Ajo negro fermentado y Trufa</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#ecb613]">+1,50 €/pax</div>
                </div>

                {/* Extra 3: Bodega */}
                <div 
                  onClick={() => setAddWineBar(!addWineBar)}
                  className={`p-3.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                    addWineBar ? 'bg-[#121008] border-[#ecb613]' : 'bg-black/30 border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-lg border flex items-center justify-center ${
                      addWineBar ? 'bg-[#ecb613] border-[#ecb613] text-black' : 'border-zinc-700'
                    }`}>
                      {addWineBar && <Check size={12} strokeWidth={3} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Estación de Bodega D.O. Madrid & Cava Reserva</div>
                      <div className="text-[11px] text-zinc-400">Blanco Malvar, Tinto Garnacha de San Martín y Cava Brut Nature</div>
                    </div>
                  </div>
                  <div className="text-xs font-mono font-bold text-[#ecb613]">+6,50 €/pax</div>
                </div>
              </div>
            </div>

            {/* Resumen y Cierre Transaccional (5 cols) */}
            <div className="lg:col-span-5 bg-[#0e0e14] border border-white/10 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                  <span className="text-xs font-mono text-zinc-400 uppercase">LIQUIDACIÓN DE PRESUPUESTO</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                    PRECIO CERRADO S-CLASS
                  </span>
                </div>

                <div className="space-y-3 text-xs text-zinc-300 mb-6">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Arroz ({pax} pax × {selectedDish.pricePerPax.toFixed(2)} €):</span>
                    <span className="font-mono font-bold text-white">{baseFoodTotal.toFixed(2)} €</span>
                  </div>

                  {mode === 'SHOWCOOKING' && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Showcooking en directo (Puesto + Leña/Gas):</span>
                      <span className="font-mono font-bold text-[#ecb613]">180,00 €</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-zinc-400">Logística ({distanceKm} km desde Méntrida):</span>
                    <span className="font-mono font-bold text-white">
                      {logisticsTotal === 0 ? '0,00 € (Primeros 50 km gratis)' : `${logisticsTotal.toFixed(2)} €`}
                    </span>
                  </div>

                  {hotelSupplement > 0 && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Suplemento Hotel (&gt; 200 km):</span>
                      <span className="font-mono font-bold text-[#FF455B]">120,00 €</span>
                    </div>
                  )}

                  {addJamon && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Cortador de Jamón Ibérico:</span>
                      <span className="font-mono font-bold text-white">350,00 €</span>
                    </div>
                  )}

                  {addAllioliBar && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Barra All-i-Oli de Autor:</span>
                      <span className="font-mono font-bold text-white">{allioliTotal.toFixed(2)} €</span>
                    </div>
                  )}

                  {addWineBar && (
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Estación Bodega & Cava:</span>
                      <span className="font-mono font-bold text-white">{wineTotal.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="flex justify-between text-emerald-400">
                    <span>Sonorización Bose F1 / S1 Pro:</span>
                    <span className="font-mono font-bold">INCLUIDO (0 €)</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mb-6">
                  <div className="text-xs text-zinc-400 uppercase font-mono mb-1">TOTAL PRESUPUESTO ESTIMADO:</div>
                  <div className="flex items-baseline justify-between">
                    <div className="text-4xl font-black font-mono text-[#ecb613]">
                      {grandTotal} <span className="text-2xl">€</span>
                    </div>
                    <div className="text-xs font-mono text-zinc-400">
                      ≈ {estimatedPricePerPax} € / comensal
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <a
                  href="https://buy.stripe.com/5kQ5kF2Ryh03fCT3Et4Vy0f"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ecb613] via-[#ffcf4d] to-[#ecb613] text-black font-black text-xs uppercase tracking-widest text-center hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(236,182,19,0.35)]"
                >
                  <Lock size={14} />
                  <span>Bloquear Fecha con Depósito (100,00 €)</span>
                </a>

                <a
                  href={`https://wa.me/34693693048?text=${whatsappText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 rounded-xl bg-[#092215] border border-emerald-500/40 text-emerald-400 font-bold text-xs uppercase tracking-wider text-center hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={14} />
                  <span>Enviar Cotización a WhatsApp Directo</span>
                </a>

                <div className="text-center">
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Teléfono oficial retención: <a href="tel:+34693693048" className="text-zinc-400 underline">+34 693 693 048</a>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. SECCIÓN TÉCNICA B2B / B2G & BLINDAJE SANITARIO */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="bg-[#08080c] border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-xs font-mono text-[#AAD6CD] tracking-widest uppercase mb-2">
              COMPLIANCE Y SEGURIDAD ALIMENTARIA
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase font-syne">
              ¿Por Qué Productora EAR Es la Opción Homologada?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-2xl bg-[#0d0d14] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 text-[#ecb613] flex items-center justify-center mb-4">
                <Shield size={20} />
              </div>
              <h3 className="text-base font-bold uppercase font-syne mb-2">
                Registro Sanitario RGSEAA
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Trazabilidad total de partida de cada ingrediente. Plan APPCC auditado, manipulación de alimentos certificada 
                y fichas técnicas de los 14 alérgenos de obligada declaración según Reglamento UE 1169/2011.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0d14] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#258DCD]/10 text-[#258DCD] flex items-center justify-center mb-4">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold uppercase font-syne mb-2">
                Seguro de RC 600.000 €
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cobertura completa de responsabilidad civil y daños ante cualquier imprevisto en fincas privadas o instalaciones 
                municipales. Trabajamos con permisos oficiales de fuegos y sistemas de combustión estandarizados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0d0d14] border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-[#AAD6CD]/10 text-[#AAD6CD] flex items-center justify-center mb-4">
                <Volume2 size={20} />
              </div>
              <h3 className="text-base font-bold uppercase font-syne mb-2">
                Presión Sonora &lt; 75 dB SPL
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                En eventos institucionales y carpas residenciales garantizamos el respeto escrupuloso de los límites acústicos 
                con monitoreo activo y equipos de dispersión ultra-limpia Bose F1 y S1 Pro.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
