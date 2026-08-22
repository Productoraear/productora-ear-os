'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldCheck, Zap, Mic2, Volume2, Lock, ArrowRight } from 'lucide-react';
import AnticipationWidget from './AnticipationWidget';

interface SemanticBlockRendererProps {
  vertical: string;
  intent: string;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RAG Semántico — Mapa de Contenido Dinámico Anti-Duplicidad
// Cada vertical produce un DOM orgánicamente único (>60% unicidad).
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface VerticalContent {
  hero: string;
  sub: string;
  gear: string;
  gearDetail: string;
  priceBase: number;
  priceMax: number;
  guaranteeBadge: string;
  painPoints: string[];
  solutions: string[];
  faq: Array<{ q: string; a: string }>;
}

const VERTICAL_CONTENT_MAP: Record<string, VerticalContent> = {
  bodas: {
    hero: 'Tu Boda, Sin Margen de Error Acústico',
    sub: 'Sonorización S-Class y diseño acústico milimétrico para el día más importante de tu vida. Protocolo de presión 12 W/pax con cero silencios incómodos.',
    gear: 'Line Array Bose F1 Model 812 + Shure Beta 87A',
    gearDetail: 'Behringer XR18 Digital Mixer, In-Ears inalámbricos y plan de redundancia completo.',
    priceBase: 350,
    priceMax: 1800,
    guaranteeBadge: 'Garantía 0 Fallos',
    painPoints: [
      'Un micrófono que acopla durante los votos destruye el recuerdo más emotivo.',
      'La pista de baile vacía porque el DJ no lee a la audiencia.',
      'Músicos informales que llegan tarde y rompen la planificación del wedding planner.',
    ],
    solutions: [
      'Microfonía digital Shure Axient con frecuencia RF dinámica: cero cortes en ceremonia.',
      'Edwin Agudelo con repertorio a la carta (12-14 temas/hora) y lectura emocional en vivo.',
      'Llegada sincronizada por GPS, montaje 2h previas al inicio del evento.',
    ],
    faq: [
      { q: '¿Cuánto cuesta contratar música en directo para una boda?', a: 'La tarifa base solista (Edwin Agudelo) es de 350€ para 45-60 min. El dúo/trío desde 550€ y el Gran Show completo (6-8 músicos) desde 1.800€.' },
      { q: '¿Cómo funciona la sonorización en una finca al aire libre?', a: 'Nuestro rider incluye Line Array Bose F1 que cubre hasta 300 invitados sin distorsión. Calibramos in-situ con medición SPL para garantizar 12 W/pax.' },
      { q: '¿Se puede elegir el repertorio?', a: 'Absolutamente. En el formulario de reserva incluimos un paso para "Canciones Imprescindibles" donde personalizas tu setlist completo.' },
    ],
  },
  corporativo: {
    hero: 'Impacto Corporativo Inmaculado',
    sub: 'Nitidez vocal absoluta para presentaciones de alto nivel, juntas directivas y galas empresariales. Factura con NIF inmediata y SLA S-Class.',
    gear: 'Consola Digital Behringer XR18 + Shure Axient Dual Channel',
    gearDetail: 'Línea de retraso acústico calibrada, streaming multi-sala redundante y técnico FOH dedicado.',
    priceBase: 500,
    priceMax: 6000,
    guaranteeBadge: 'SLA Corporativo S-Class',
    painPoints: [
      'Un fallo acústico en el atril arruina la imagen de marca ante inversores y prensa.',
      'Falta de coordinación entre música, visuales y el momento de la revelación del producto.',
      'Proveedores audiovisuales sin documentación fiscal adecuada para contabilidad corporativa.',
    ],
    solutions: [
      'Redundancia de señal dual: si un canal cae, el backup conmuta en <50ms sin corte audible.',
      'Sincronización Timecode SMPTE para que la iluminación, el sonido y los visuales disparen al unísono.',
      'Factura electrónica con NIF, desglose IVA y certificado de prestación de servicios inmediato.',
    ],
    faq: [
      { q: '¿Pueden emitir factura con desglose IVA para la empresa?', a: 'Sí. Productora EAR emite factura electrónica con NIF, desglose de IVA y certificado de prestación de servicios antes de 24h.' },
      { q: '¿Qué pasa si falla el sonido durante una presentación?', a: 'Nuestro SLA S-Class incluye equipos de backup in-situ y técnico FOH dedicado. El sistema de redundancia conmuta en <50ms.' },
      { q: '¿Cuál es el plazo mínimo de contratación?', a: 'Eventos urgentes (<14 días) activan el Conserje de Emergencia con confirmación en <2 horas.' },
    ],
  },
  quinceaneras: {
    hero: 'La Fiesta de 15 que Rompe Internet',
    sub: 'Setlist urbano actualizado cada 2 semanas, luces robóticas DMX sincronizadas y vals de ensueño con ensamble mariachi.',
    gear: 'Subwoofers Activos + Cabina LED DMX + PA 2.000W',
    gearDetail: 'Iluminación robótica Beam/Wash sincronizada por DMX con controlador dedicado.',
    priceBase: 450,
    priceMax: 1400,
    guaranteeBadge: 'Repertorio Actualizado',
    painPoints: [
      'DJs con música desactualizada que no conectan con la generación actual.',
      'Vals improvisado sin ensayo previo ni coordinación con el fotógrafo.',
      'Sonido insuficiente para llenar el salón y crear ambiente de fiesta.',
    ],
    solutions: [
      'Curaduría musical híbrida: bloque mariachi clásico + set urbano Spotify Top 50 actualizado.',
      'Protocolo de vals con Edwin Agudelo: ensayo previo, coreografía y coordinación con fotógrafo.',
      'PA de 2.000W con subwoofers activos: graves contundentes que se sienten en el pecho.',
    ],
    faq: [
      { q: '¿Puedo mezclar mariachi con reguetón/urbano?', a: 'Es nuestra especialidad. Diseñamos un set híbrido: ceremonia del vals con ensamble mariachi y fiesta posterior con DJ + cabina LED.' },
      { q: '¿Incluyen iluminación en el paquete?', a: 'Los paquetes Premium y S-Class incluyen cabina LED DMX, luces robóticas y humo atmosférico sincronizado.' },
    ],
  },
  vimume: {
    hero: 'Musicoterapia que Despierta Recuerdos',
    sub: 'Estimulación neurocognitiva certificada VIMUME para centros de mayores y pacientes de Alzheimer. Frecuencias armónicas controladas (<75 dB).',
    gear: 'Monitores de Campo Cercano de Respuesta Plana',
    gearDetail: 'Equipo acústico adaptado a audífonos con control de presión sonora <75 dB.',
    priceBase: 290,
    priceMax: 900,
    guaranteeBadge: 'Validado en 5 Centros',
    painPoints: [
      'Apatía y desconexión afectiva en personas con deterioro neurodegenerativo.',
      'Actividades recreativas sin base científica ni medición de impacto terapéutico.',
    ],
    solutions: [
      'Metodología VIMUME: Cancionero biográfico en directo con frecuencias armónicas no invasivas.',
      'Telemetría de respuesta emocional y cognitiva con informes mensuales para el equipo clínico.',
    ],
    faq: [
      { q: '¿Qué evidencia científica respalda la musicoterapia?', a: 'VIMUME opera un piloto en 5 centros con custodia estricta de telemetría clínica bajo regulaciones europeas de protección de datos.' },
      { q: '¿Es seguro para pacientes con audífonos?', a: 'Absolutamente. Nuestro equipo no supera los 75 dB (norma OMS) y está calibrado para compatibilidad con prótesis auditivas.' },
    ],
  },
  ayuntamientos: {
    hero: 'Sonorización Institucional sin Riesgos',
    sub: 'Conciertos y Fiestas Patronales bajo marco LCSP (<15.000€) con expediente cerrado, memoria técnica y seguro RC 600.000€.',
    gear: 'Ground-Stack 12.000W dB Technologies + Escenografía',
    gearDetail: 'Sistema PA profesional con certificado de solidez y pliego técnico listo para contrato menor.',
    priceBase: 2500,
    priceMax: 8500,
    guaranteeBadge: 'LCSP Compliance',
    painPoints: [
      'Documentación técnica incompleta que bloquea la aprobación del pleno municipal.',
      'Sobrecostes ocultos por desplazamiento de equipos pesados a plazas sin acceso.',
    ],
    solutions: [
      'Expediente cerrado bajo contrato menor LCSP: memoria técnica, certificado de solidez y seguro RC 600.000€.',
      'Logística de montaje con estudio previo de accesos y carga eléctrica del recinto municipal.',
    ],
    faq: [
      { q: '¿El presupuesto incluye montaje y desmontaje?', a: 'Sí. El presupuesto es cerrado e incluye transporte, montaje, técnico de sala, desmontaje y seguro RC.' },
      { q: '¿Pueden adaptarse a contratos menores?', a: 'Todos nuestros paquetes B2G están diseñados para encajar en el marco LCSP de contrato menor (<15.000€).' },
    ],
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export default function SemanticBlockRenderer({ vertical, intent }: SemanticBlockRendererProps) {
  const data = VERTICAL_CONTENT_MAP[vertical] || VERTICAL_CONTENT_MAP.bodas;
  const formattedIntent = intent.replace(/-/g, ' ');

  return (
    <div className="relative min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-[#ecb613]/30">
      {/* 2036 CSS Mesh Gradient Background (Zero Video Bandwidth) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: ['-20%', '25%', '-15%', '-20%'], y: ['-10%', '35%', '5%', '-10%'], scale: [1, 1.2, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/15 blur-[130px] rounded-full"
        />
        <motion.div
          animate={{ x: ['10%', '-15%', '20%', '10%'], y: ['20%', '-15%', '25%', '20%'], scale: [1.1, 0.85, 1.15, 1.1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] bg-[#ecb613]/8 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{ x: ['-5%', '10%', '-15%', '-5%'], y: ['10%', '-20%', '15%', '10%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] bg-blue-900/12 blur-[120px] rounded-full"
        />
        {/* Film Noise Grid */}
        <div
          className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
          style={{ backgroundImage: `radial-gradient(#ecb613 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/80 via-transparent to-[#050505]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 sm:py-32 lg:px-8 space-y-20">

        {/* ━━━ Block 1: HeroIntentBlock ━━━ */}
        <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ecb613]/10 border border-[#ecb613]/20 text-[#ecb613] text-xs font-mono uppercase tracking-widest mb-8">
            <Zap className="w-3 h-3" />
            <span>Intención: {formattedIntent}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-500 font-syne">
            {data.hero}
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 leading-relaxed">
            {data.sub}
          </p>
        </motion.div>

        {/* ━━━ Block 2: Pain Points & Solutions (Diagnostic View) ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Pain Points */}
          <div className="bg-rose-950/15 backdrop-blur-xl border border-rose-500/20 rounded-3xl p-8 space-y-5">
            <h3 className="text-lg font-bold text-rose-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Puntos de Fricción que Eliminamos
            </h3>
            <ul className="space-y-4">
              {data.painPoints.map((pain, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                  <span className="text-rose-400 font-mono font-bold mt-0.5">0{i + 1}</span>
                  <span>{pain}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div className="bg-emerald-950/15 backdrop-blur-xl border border-emerald-500/20 rounded-3xl p-8 space-y-5">
            <h3 className="text-lg font-bold text-emerald-300 font-mono uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Solución Técnica Blindada (12 W/pax)
            </h3>
            <ul className="space-y-4">
              {data.solutions.map((sol, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-neutral-300 leading-relaxed">
                  <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{sol}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* ━━━ Block 3: RealPriceLockBlock & Tech Rider ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Tech Rider */}
          <div className="bg-[#09090d]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-3 mb-6">
              <Mic2 className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-bold font-syne">Rider Técnico Asegurado</h2>
            </div>
            <ul className="space-y-4 text-neutral-300">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <span>Configuración: <strong className="text-white">{data.gear}</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <span>{data.gearDetail}</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <span>Presión Acústica S-Class: garantía matemática de <strong className="text-white">12 W/pax</strong>.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#10b981] shrink-0 mt-0.5" />
                <span>Plan de Redundancia: equipos de backup in-situ (Cero Fallos).</span>
              </li>
            </ul>
          </div>

          {/* Price Lock */}
          <div className="bg-gradient-to-br from-[#09090d] to-[#ecb613]/5 border border-[#ecb613]/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Lock className="w-8 h-8 text-[#ecb613]/30 group-hover:text-[#ecb613] transition-colors" />
            </div>
            <div className="space-y-1 mb-2">
              <span className="text-[10px] font-mono text-[#ecb613] font-bold uppercase tracking-widest">{data.guaranteeBadge}</span>
              <h2 className="text-xl font-bold text-neutral-400">Inversión Transparente</h2>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-white font-syne">{data.priceBase} €</span>
              <span className="text-neutral-500 text-sm">/ tarifa base</span>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Hasta {data.priceMax.toLocaleString('es-ES')} € (ensamble completo). Desplazamiento: radio 50km incluido, fuera: +0.35€/km.
            </p>
            <a
              href="https://wa.me/34693693048?text=Quiero%20reservar%20para%20mi%20evento"
              target="_blank"
              rel="noreferrer"
              className="w-full py-4 rounded-xl bg-[#ecb613] hover:bg-[#d4a311] text-black font-bold tracking-wide transition-all shadow-[0_0_40px_-10px_#ecb613] flex items-center justify-center gap-2"
            >
              <span>Bloquear Fecha (Depósito 30%)</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* ━━━ Block 4: AlsoAskedDisclosureFaq ━━━ */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto space-y-6"
        >
          <div className="text-center">
            <span className="text-[10px] font-mono text-[#ecb613] uppercase tracking-widest font-bold">Preguntas Frecuentes — AlsoAsked</span>
            <h2 className="text-2xl font-bold font-syne text-white mt-1">Lo que la Gente Pregunta en Google</h2>
          </div>

          <div className="space-y-4">
            {data.faq.map((item, i) => (
              <details
                key={i}
                className="group bg-[#09090d]/80 backdrop-blur-xl border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
              >
                <summary className="px-6 py-4 cursor-pointer list-none flex items-center justify-between text-white font-medium text-sm">
                  <span>{item.q}</span>
                  <span className="text-neutral-500 group-open:rotate-45 transition-transform text-lg">+</span>
                </summary>
                <div className="px-6 pb-5 text-sm text-neutral-400 leading-relaxed border-t border-white/5 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Block 5: Anticipation Widget (Proactive Neuromarketing Bubble) */}
      <AnticipationWidget vertical={vertical} />
    </div>
  );
}
