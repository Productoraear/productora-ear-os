'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Heart, Building2, Landmark, Music, Zap, ShieldCheck, 
  ArrowRight, Sparkles, Utensils, Flame, Users, Sliders,
  CheckCircle2, ChevronRight, Award, Volume2
} from 'lucide-react';
import { useEcosystemFilterStore } from '@/store/useEcosystemFilterStore';

interface ServiceNode {
  id: string;
  category: 'bodas' | 'corporativo' | 'patronales' | 'salud';
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
  price: string;
  powerSpec: string;
  targetUrl: string;
  storeCategory: string;
}

const SERVICE_NODES: ServiceNode[] = [
  {
    id: '1',
    category: 'bodas',
    tag: 'MÁS SOLICITADO // B2C ÉLITE',
    title: 'The VIP Wedding Gala 360°',
    subtitle: 'Edwin Agudelo Tenor & Mariachi de Gala',
    description: 'Ceremonia lírica con piano de cola, cóctel romántico con serenata de autor y fiesta de gala con sonorización calibrada a 12 W/pax y microfonía Shure Axient Digital.',
    specs: ['Tenor Lírico & Mariachi Imperial', 'Rider Bose F1 Certificado', 'Sesión Fotográfica Charra Incluida', 'Garantía Escrow Reemplazo 100%'],
    price: 'Desde 650€',
    powerSpec: 'Calibración 12 W/pax',
    targetUrl: '/artistas/edwin-agudelo',
    storeCategory: 'musica'
  },
  {
    id: '2',
    category: 'bodas',
    tag: 'SHOWCOOKING // CATERING',
    title: 'Catering de Brasas Vivas & Fuego',
    subtitle: 'Ritual Ibérico de Alta Selección',
    description: 'Secreto, pluma, presa y panceta ibérica curada sobre brasas de carbón vegetal y leña de encina. Asado argentino a la cruz y smoker low & slow.',
    specs: ['Parrilleros Titulados & Showcooking', 'Registro Sanitario RGSAA', 'Sonorización Bose F1 de Cortesía', 'Estructura Monumental de Hierro'],
    price: 'Desde 45€ / Comensal',
    powerSpec: 'Capacidad 50 - 800 Pax',
    targetUrl: '/catering-brasas',
    storeCategory: 'catering'
  },
  {
    id: '3',
    category: 'corporativo',
    tag: 'B2B // AUDIOVISUALES P2.9',
    title: 'Alquiler de Pantallas LED & Sonorización',
    subtitle: 'Infraestructura Escénica para Eventos',
    description: 'Montaje de pantallas LED P2.9 de alta definición para exterior/interior, estructuras de aluminio Truss, iluminación robótica DMX y streaming en directo.',
    specs: ['Resolución 4K HDR P2.9', 'Técnico Realizador Dedicado', 'Certificación de Seguridad CEE', 'Montaje & Desmontaje Expres'],
    price: 'Desde 1.200€',
    powerSpec: 'Brillo >4500 Nits Outdoor',
    targetUrl: '/alquiler-equipos-sonido-audiovisuales',
    storeCategory: 'espacios'
  },
  {
    id: '4',
    category: 'patronales',
    tag: 'B2G // CONTRATO MENOR ART. 118',
    title: 'Fiestas Patronales & Orquestas de Gala',
    subtitle: 'Infraestructura para Ayuntamientos (+8.000 Pueblos)',
    description: 'Producción 360° para Festejos Municipales. Escenarios móviles, Grandes Orquestas, Mariachi de Honor y espectáculos variados con facturación en portal FACe.',
    specs: ['Adjudicación Directa <15k€ + IVA', 'Póliza RC 1.000.000€ Incluida', 'Facturación DIR3 / FACe', 'Pacto Exclusivo VIMUME 3ª Edad'],
    price: 'Desde 3.500€',
    powerSpec: 'L-Acoustics K2 / 20kW RMS',
    targetUrl: '/ocasiones/ayuntamientos',
    storeCategory: 'musica'
  },
  {
    id: '5',
    category: 'patronales',
    tag: 'ILUMINACIÓN FESTIVA // NAVIDAD',
    title: 'Luces de Navidad & Arcos Festivos',
    subtitle: 'Alquiler & Montaje Festivo Municipal',
    description: 'Diseño e instalación de alumbrado navideño LED de bajo consumo para plazas mayores, fachadas de consistorios y calles comerciales.',
    specs: ['Tecnología LED Eco-Efficiency', 'Montaje Homologado por Electricistas', 'Proyectos Personalizados a Medida', 'Mantenimiento 24/7 en Campaña'],
    price: 'Desde 2.800€',
    powerSpec: 'Ahorro Energético 85%',
    targetUrl: '/ocasiones/ayuntamientos',
    storeCategory: 'espacios'
  },
  {
    id: '6',
    category: 'salud',
    tag: 'IMPACTO SOCIAL // NEUROACÚSTICA',
    title: 'Proyecto VIMUME (Viaje Musical por la Memoria)',
    subtitle: 'Estimulación Cognitive 40Hz para Mayores',
    description: 'Protocolo clínico no invasivo mediante estimulación neuroacústica y canciones del recuerdo en directo. Diseñado para Residencias y Centros de Día.',
    specs: ['Edwin Agudelo Solista en Vivo', 'Memoria de Impacto Social', 'Subvencionable 100% por IRPF/Social', 'Acústica Médica Calibrada <75 dB'],
    price: 'Bonificado / Subvencionado',
    powerSpec: 'Frecuencia Gamma 40Hz',
    targetUrl: '/vimume',
    storeCategory: 'musica'
  },
  {
    id: '7',
    category: 'bodas',
    tag: 'SERENATAS & CUMPLEAÑOS VIP',
    title: 'Serenata Mariachi Imperial Domicilio',
    subtitle: 'Emoción Directa & Show de Gala',
    description: 'Sorpresa inolvidable para aniversarios, bodas de oro y cumpleaños VIP. Repertorio ranchero clásico y lírico interpretado a escasos metros.',
    specs: ['Formato 1 a 8 Músicos', 'Sombrero Charro para Fotos', 'Ramo de Flores de Regalo', 'Puntualidad & Protocolo Impecable'],
    price: 'Desde 350€',
    powerSpec: 'Acústica Natural / Portátil',
    targetUrl: '/artistas/edwin-agudelo',
    storeCategory: 'musica'
  },
  {
    id: '8',
    category: 'corporativo',
    tag: 'B2B PARTNERS // WEDDING PLANNERS',
    title: 'Alianzas Estratégicas & Coordinación',
    subtitle: 'Socio Técnico para Fincas y Planners',
    description: 'Acuerdos de colaboración con comisión B2B del 10% para Wedding Planners y Fincas. Asesoramiento en acústica, licencias y logística de artistas.',
    specs: ['Comisión B2B Transparent Split', 'Plan B de Emergencia por Clima', 'Atención Directa Dirección Técnica', 'Contrato Mercantil Homologado'],
    price: 'Acuerdo Partner 10%',
    powerSpec: 'Soporte Prioritario 24/7',
    targetUrl: '/alquiler-equipos-sonido-audiovisuales',
    storeCategory: 'espacios'
  }
];

export default function EventosPage() {
  const [activeTab, setActiveTab] = useState<'todos' | 'bodas' | 'corporativo' | 'patronales' | 'salud'>('todos');
  const { setCategory } = useEcosystemFilterStore();
  const router = useRouter();

  const filteredNodes = activeTab === 'todos' 
    ? SERVICE_NODES 
    : SERVICE_NODES.filter(n => n.category === activeTab);

  const handleNeuralTunnel = (storeCat: string, targetUrl: string) => {
    setCategory(storeCat);
    router.push(targetUrl);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-28 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* CABECERA CON VISIÓN DE ALTA DENSIDAD */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 border border-[#ecb613]/40 bg-[#ecb613]/10 px-3.5 py-1.5 rounded-full text-xs font-mono text-[#ecb613] uppercase tracking-wider font-bold">
            <Sparkles size={14} /> Ecosistema de Servicios S-Class // Multi-Nodo Accesible
          </div>
          <h1 className="text-4xl md:text-6xl font-fraunces font-black text-white tracking-tight leading-tight">
            Arquitectura de Eventos, Fuego &amp; Música de Gala
          </h1>
          <p className="text-white/70 font-montserrat text-sm md:text-base max-w-3xl leading-relaxed">
            Seleccione el nodo de producción requerido. Todos los servicios cuentan con cotización transparente, especificaciones técnicas de ingeniería acústica y enlace directo al motor de reserva.
          </p>
        </div>

        {/* NAVEGACIÓN POR CATEGORÍAS (SELECTOR DE TÚNEL NEURAL) */}
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: 'todos', label: 'Todos los Servicios (8)' },
            { id: 'bodas', label: 'Bodas & Galas VIP' },
            { id: 'corporativo', label: 'Corporativo & Audiovisuales' },
            { id: 'patronales', label: 'Ayuntamientos & B2G' },
            { id: 'salud', label: 'VIMUME Salud' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 rounded-2xl text-xs font-mono font-bold uppercase transition-all duration-200 border ${
                activeTab === tab.id
                  ? 'bg-[#ecb613] text-black border-[#ecb613] shadow-lg shadow-[#ecb613]/25 font-black'
                  : 'bg-[#0a0a0f] border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRID DE MATRIZ DENSE: CADA TARJETA ES UN CLIC DIRECTO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredNodes.map(node => (
            <div 
              key={node.id}
              className="bg-[#0a0a0f] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between hover:border-[#ecb613]/60 transition-all duration-300 shadow-2xl relative overflow-hidden group"
            >
              <div className="space-y-5">
                
                {/* CABECERA DE LA TARJETA */}
                <div className="flex flex-wrap justify-between items-start gap-2 border-b border-white/5 pb-4">
                  <span className="text-[10px] font-mono text-[#ecb613] font-bold tracking-widest uppercase bg-[#ecb613]/10 border border-[#ecb613]/30 px-3 py-1 rounded-full">
                    {node.tag}
                  </span>
                  <div className="text-right">
                    <span className="text-2xl font-black font-fraunces text-white block">
                      {node.price}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 block font-bold">
                      {node.powerSpec}
                    </span>
                  </div>
                </div>

                {/* TÍTULO Y DESCRIPCIÓN RICA (ABSORCIÓN TOTAL) */}
                <div>
                  <h3 className="text-2xl md:text-3xl font-fraunces font-black text-white group-hover:text-[#ecb613] transition-colors leading-tight">
                    {node.title}
                  </h3>
                  <h4 className="text-xs font-mono text-white/50 mt-1 font-bold">
                    {node.subtitle}
                  </h4>
                  <p className="text-xs md:text-sm text-white/70 leading-relaxed font-montserrat mt-3">
                    {node.description}
                  </p>
                </div>

                {/* LISTA DE ESPECIFICACIONES TÉCNICAS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {node.specs.map((spec, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-white/80 font-montserrat">
                      <CheckCircle2 size={14} className="text-[#ecb613] shrink-0" />
                      <span className="truncate">{spec}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* BOTONES DE ACCIÓN MÚLTIPLE (CLICS AL SERVICIO Y TÚNEL NEURAL) */}
              <div className="pt-6 mt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  href={node.targetUrl}
                  className="w-full py-3.5 bg-white/5 hover:bg-white/15 border border-white/10 rounded-xl text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center justify-center gap-2 transition-all"
                >
                  <span>Ver Ficha Completa</span>
                  <ChevronRight size={14} />
                </Link>

                <button
                  onClick={() => handleNeuralTunnel(node.storeCategory, node.targetUrl)}
                  className="w-full py-3.5 bg-[#ecb613] hover:bg-yellow-400 text-black rounded-xl text-xs font-mono font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-[#ecb613]/20 transition-all active:scale-95"
                >
                  <Zap size={14} />
                  <span>Cotizar en Vivo</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* ACCESO DIRECTO AL MOTOR DE FILTROS EN EL BOTTOM */}
        <div className="bg-gradient-to-r from-black via-[#0a0a0f] to-black border border-white/15 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <h3 className="text-2xl font-fraunces font-black text-white uppercase">
            ¿Busca una solución combinada o un presupuesto a medida?
          </h3>
          <p className="text-white/60 text-xs md:text-sm max-w-2xl mx-auto font-montserrat">
            Nuestro motor calcula presión acústica en W/pax, distancia de desplazamiento desde Madrid y complementos VIP en tiempo real.
          </p>
          <Link
            href="/checkout/presupuesto"
            className="inline-flex items-center gap-2 bg-[#ecb613] hover:bg-yellow-400 text-black font-black uppercase text-xs px-8 py-4 rounded-xl shadow-xl shadow-[#ecb613]/20 transition-all hover:scale-105"
          >
            <Sliders size={16} /> Abrir Calculadora de Presupuesto 360°
          </Link>
        </div>

      </div>
    </div>
  );
}
