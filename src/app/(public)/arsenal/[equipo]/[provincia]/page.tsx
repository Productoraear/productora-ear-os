import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Cpu, 
  Zap, 
  PhoneCall, 
  CheckCircle2, 
  Volume2, 
  Tv, 
  Layers, 
  Radio, 
  Truck, 
  Award,
  ArrowRight,
  Sliders
} from 'lucide-react';
import { CENTRALITA } from '@/lib/phone-constants';

interface PageProps {
  params: Promise<{
    equipo: string;
    provincia: string;
  }>;
}

function formatText(slug: string): string {
  if (!slug) return '';
  return slug
    .split('-')
    .filter(Boolean)
    .map(word => {
      const w = word.toLowerCase();
      if (w === 'led') return 'LED';
      if (w === 'p29' || w === 'p2.9') return 'P2.9';
      if (w === 'p26' || w === 'p2.6') return 'P2.6';
      if (w === 'p39' || w === 'p3.9') return 'P3.9';
      if (w === 'tv') return 'TV';
      if (w === 'pa') return 'PA';
      if (w === 'hd') return 'HD';
      if (w === '4k') return '4K';
      if (w === 'dmx') return 'DMX';
      if (w === 'rf') return 'RF';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

function formatProvincia(slug: string): string {
  if (!slug) return 'Madrid';
  return slug.charAt(0).toUpperCase() + slug.slice(1).toLowerCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { equipo, provincia } = await params;
  const equipoFormatted = formatText(equipo);
  const provinciaFormatted = formatProvincia(provincia);

  return {
    title: `Alquiler de ${equipoFormatted} en ${provinciaFormatted} | El Arsenal Técnico EAR`,
    description: `Alquiler profesional de ${equipoFormatted} en ${provinciaFormatted}. Infraestructura técnica audiovisual S-Class, transporte homologado, montaje y técnico in-situ con garantía 0 Fallos.`,
    alternates: {
      canonical: `https://www.productoraear.com/arsenal/${equipo}/${provincia}`,
    },
    openGraph: {
      title: `Alquiler de ${equipoFormatted} en ${provinciaFormatted} - Productora EAR`,
      description: `Infraestructura técnica para eventos corporativos, galas y producciones de alta exigencia en ${provinciaFormatted}.`,
    }
  };
}

export default async function ArsenalEquipoProvinciaPage({ params }: PageProps) {
  const { equipo, provincia } = await params;
  const equipoFormatted = formatText(equipo);
  const provinciaFormatted = formatProvincia(provincia);

  const isScreen = /pantalla|led|monitor|tv|video|proyector|display/.test(equipo.toLowerCase());
  const isSound = /sonido|audio|line-array|bose|altavoz|microfono|shure|xr18|mesa/.test(equipo.toLowerCase());
  const isLighting = /luz|luces|iluminacion|foco|cabeza|beam|wash|dmx/.test(equipo.toLowerCase());

  const whatsappMessage = encodeURIComponent(
    `Hola Productora EAR, quiero verificar disponibilidad técnica para ${equipoFormatted} en ${provinciaFormatted}.`
  );
  const whatsappUrl = `https://wa.me/34693693048?text=${whatsappMessage}`;

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ecb613] selection:text-black font-sans">
      
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          1. HERO HEADER S-CLASS HARDWARE
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-96 bg-gradient-to-b from-[#ecb613]/10 to-transparent blur-3xl pointer-events-none" />

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400 mb-6">
          <Link href="/" className="hover:text-white transition-colors">EAR OS</Link>
          <span>/</span>
          <Link href="/arsenal" className="hover:text-white transition-colors">Arsenal</Link>
          <span>/</span>
          <span className="text-[#ecb613]">{equipoFormatted}</span>
          <span>/</span>
          <span className="text-white/60">{provinciaFormatted}</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-[#ecb613]/30 bg-[#ecb613]/5 text-[#ecb613] text-xs font-mono font-bold uppercase tracking-widest mb-6">
          <span className="w-2 h-2 rounded-full bg-[#ecb613] animate-pulse" />
          Infraestructura Técnica Audiovisual S-Class B2B
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white font-syne mb-6 leading-[0.95]">
          Alquiler de <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-[#ecb613] to-amber-500">
            {equipoFormatted}
          </span> en {provinciaFormatted}
        </h1>

        <p className="text-base sm:text-xl text-neutral-400 max-w-3xl mb-10 leading-relaxed font-light">
          Suministro, transporte asegurado y montaje técnico directo con garantía de <strong className="text-white font-semibold">Cero Fallos</strong>. 
          Riders de alta gama para eventos corporativos, congresos, festivales y galas de alta distinción en {provinciaFormatted}.
        </p>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-black text-black bg-gradient-to-r from-amber-300 via-[#ecb613] to-amber-500 hover:brightness-110 transition-all shadow-xl shadow-[#ecb613]/20 text-sm sm:text-base uppercase tracking-wider font-mono cursor-pointer active:scale-95"
          >
            <PhoneCall size={18} />
            <span>Verificar Disponibilidad VIP en WhatsApp</span>
          </a>

          <Link 
            href="/cotizador" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 transition-all text-sm sm:text-base font-mono"
          >
            <Sliders size={16} />
            <span>Cotizador Dinámico en Vivo</span>
          </Link>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          2. FICHA TÉCNICA Y PROTOCOLO S-CLASS
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-neutral-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono text-[#ecb613] uppercase tracking-widest block">Estándar de Producción</span>
            <h2 className="text-2xl sm:text-3xl font-black uppercase text-white font-syne mt-1">
              Especificaciones de Ingeniería & Rider Homologado
            </h2>
          </div>
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs flex items-center gap-2">
            <CheckCircle2 size={16} /> Cobertura In-Situ: {provinciaFormatted}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Processing / Resolution */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all duration-300 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              {isScreen ? <Tv size={24} /> : isSound ? <Volume2 size={24} /> : <Cpu size={24} />}
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-syne">
              {isScreen ? 'Procesamiento 4K & Refresh' : isSound ? 'Fidelidad Acústica & SPL' : 'Control Digital DMX'}
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              {isScreen
                ? 'Controladores Novastar UHD con escalado de baja latencia, tasa de refresco ultra-alta (>3840Hz) óptima para grabación multicámara y calibración de color HDR.'
                : isSound
                ? 'Presión sonora garantizada de 12 W/pax. Arreglos Bose F1 Flex Array y sistemas de subgraves con respuesta plana libre de distorsión armónica.'
                : 'Módulos de iluminación inteligente con direccionamiento DMX/RDM, fuentes LED de alto CRI (>95) y ópticas de precisión para cobertura uniforme.'}
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-neutral-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Homologación CE & Certificados de Carga</li>
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Conectores PowerCON True1 de Grado Militar</li>
            </ul>
          </div>

          {/* Card 2: Logistics & Insurance */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all duration-300 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <Truck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-syne">
              Logística Directa en {provinciaFormatted}
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Flota vehicular propia para entrega puntual en cualquier municipio de {provinciaFormatted}. Sin intermediarios ni costes inflados de agencias externas.
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-neutral-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Seguro de Responsabilidad Civil de 1.000.000 €</li>
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Estructuras Truss y Tarimas Homologadas</li>
            </ul>
          </div>

          {/* Card 3: Dedicated Technician */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0a0a0f] border border-white/10 hover:border-[#ecb613]/40 transition-all duration-300 space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613]">
              <ShieldCheck size={24} />
            </div>
            <h3 className="text-xl font-bold text-white uppercase font-syne">
              Técnico Especialista In-Situ
            </h3>
            <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed">
              Asistencia y operación presencial durante todo el desarrollo del evento. Pruebas de sonido/vídeo previas para asegurar cero interrupciones en momentos clave.
            </p>
            <ul className="space-y-1.5 font-mono text-xs text-neutral-300 pt-2 border-t border-white/5">
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Equipo de Backup de Emergencia (Redundancia N+1)</li>
              <li className="flex items-center gap-2"><span className="text-[#ecb613]">✓</span> Facturación Oficial FACe para Ayuntamientos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          3. BANNER TRANSACCIONAL DE DISPONIBILIDAD INMEDIATA
         ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-amber-950/40 via-[#0e0e0e] to-black border border-[#ecb613]/40 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ecb613]">Bloqueo de Agenda 2026</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white font-syne">
              ¿Tienes una fecha para {equipoFormatted} en {provinciaFormatted}?
            </h2>
            <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
              Coordina el montaje técnico, fechas y cotización exacta directamente con nuestra dirección de despacho.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-black text-black bg-[#ecb613] hover:bg-amber-400 transition-all text-sm sm:text-base uppercase tracking-wider font-mono shadow-lg shadow-[#ecb613]/20"
            >
              <PhoneCall size={18} />
              <span>Consultar Disponibilidad de {equipoFormatted} ({CENTRALITA.display})</span>
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
