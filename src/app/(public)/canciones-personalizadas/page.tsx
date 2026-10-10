'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Music,
  Heart,
  Sparkles,
  Users,
  Briefcase,
  Calendar,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Upload,
  FileSpreadsheet,
  Phone,
  MessageCircle,
  Video,
  Layers,
  Award
} from 'lucide-react';
import { CENTRALITA_EAR_OS, TARIFA_BASE_SOLISTA_EUR } from '@/lib/constants/ear-os-ssot';

const ROLES_CATEGORIES = {
  familiaCercana: [
    'Madre', 'Padre', 'Hija', 'Hijo', 'Hermana', 'Hermano', 'Esposa', 'Esposo', 'Abuela', 'Abuelo', 'Nieta', 'Nieto'
  ],
  familiaExtendida: [
    'Tía', 'Tío', 'Sobrina', 'Sobrino', 'Prima', 'Primo', 'Suegra', 'Suegro', 'Cuñada', 'Cuñado', 'Nuera', 'Yerno', 'Madrina', 'Padrino'
  ],
  amorYAmistad: [
    'Amiga Íntima', 'Amigo del Alma', 'Pareja / Prometida', 'Prometido', 'Compañera de Vida', 'Amigo de la Infancia', 'Mejor Amiga', 'Mejor Amigo'
  ],
  empresaYTrabajo: [
    'Jefa / Directora', 'Jefe / Fundador', 'Empleada Ejemplar', 'Empleado del Año', 'Socia Fundadora', 'Socio Estratégico', 'Colaboradora', 'Compañero de Equipo', 'Mentora', 'Líder de Proyecto'
  ]
};

const OCCASIONS = [
  'Día de la Madre',
  'Día del Padre',
  'Cumpleaños Especial',
  'Bodas de Oro (50 años)',
  'Bodas de Plata (25 años)',
  'Aniversario de Pareja',
  'San Valentín',
  'Navidad y Fin de Año',
  'Jubilación y Retiro Digno',
  'Despedida Emotiva',
  'Bienvenida / Nacimiento',
  'Agradecimiento Vital',
  'Aniversario de Empresa',
  'Hito Corporativo / Logro'
];

const INSTRUMENT_TIERS = [
  { id: 'acustico', name: 'Acústico Íntimo (Voz + Guitarra o Piano)', extraEur: 0, desc: 'Grabación de estudio pura, íntima y emotiva.' },
  { id: 'duo', name: 'Dúo Armónico (Piano + Cuerda acústica)', extraEur: 50, desc: 'Mayor profundidad sonora con contrapuntos líricos.' },
  { id: 'cuarteto', name: 'Trío / Cuarteto Acústico de Gala', extraEur: 120, desc: 'Elegancia clásica con guitarrón, violines o trompeta lírica.' },
  { id: 'sinfonico', name: 'Arreglo Orquestal / Sinfónico Completo', extraEur: 250, desc: 'Gran producción musical con cuerdas orquestales de estudio.' },
  { id: 'corporativo', name: 'Himno Corporativo e Identidad Sonora', extraEur: 450, desc: 'Composición de marca con derechos de uso comercial incluidos.' }
];

export default function CancionesPersonalizadasPage() {
  const [step, setStep] = useState<number>(1);
  const [selectedRoleCategory, setSelectedRoleCategory] = useState<keyof typeof ROLES_CATEGORIES>('familiaCercana');
  const [selectedRole, setSelectedRole] = useState<string>('Madre');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('Día de la Madre');
  const [recipientName, setRecipientName] = useState<string>('');
  const [senderName, setSenderName] = useState<string>('');
  const [storyNotes, setStoryNotes] = useState<string>('');
  const [instrumentTierId, setInstrumentTierId] = useState<string>('acustico');
  const [videoFormat, setVideoFormat] = useState<'vertical' | 'horizontal' | 'ambos'>('vertical');
  const [isCompanyMode, setIsCompanyMode] = useState<boolean>(false);

  const basePriceEur = 99; // Precio base Stripe
  const selectedInstrument = INSTRUMENT_TIERS.find((t) => t.id === instrumentTierId) || INSTRUMENT_TIERS[0];
  const formatExtraEur = videoFormat === 'ambos' ? 30 : 0;
  const subtotalEur = basePriceEur + selectedInstrument.extraEur + formatExtraEur;
  const finalPriceEur = isCompanyMode ? Math.round(subtotalEur * 0.8) : subtotalEur; // 20% descuento para empresas

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#ecb613] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* CABECERA CON VÍDEO OFICIAL DE MUESTRA (aZ_AqeKO_QY) */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border border-amber-500/20 bg-amber-500/10 text-amber-400">
            <Sparkles size={13} />
            <span>OBRA DE ARTE ÚNICA · CANCIONES A MEDIDA CON EDWIN AGUDELO</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
            Una canción irrepetible para quien más quieres.{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
              Compuesta y cantada en exclusiva.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            No es una plantilla. Es una canción con tu historia, nombres reales y anécdotas inolvidables, interpretada por la voz de <strong>Edwin Agudelo</strong> con revisión de letra previa.
          </p>

          {/* Vídeo Oficial de Muestra de Canción Personalizada */}
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(236,182,19,0.15)] bg-black/80 aspect-video mb-10">
            <iframe
              src="https://www.youtube-nocookie.com/embed/aZ_AqeKO_QY?rel=0&modestbranding=1"
              title="Muestra de Canción Personalizada Oficial · Edwin Agudelo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* MODO EMPRESA O PARTICULAR */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <button
            onClick={() => setIsCompanyMode(false)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${
              !isCompanyMode
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg'
                : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            Regalo Particular / Familiar
          </button>
          <button
            onClick={() => setIsCompanyMode(true)}
            className={`px-4 py-2 rounded-full text-xs font-mono transition-all border ${
              isCompanyMode
                ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-lg'
                : 'bg-zinc-900/60 text-zinc-400 border-white/10 hover:text-white'
            }`}
          >
            Empresas &amp; Equipos (20% Dto. &gt;10 unidades)
          </button>
        </div>

        {/* SECCIÓN EMPRESAS: DRAG & DROP Y PLANTILLA CSV */}
        {isCompanyMode && (
          <div className="mb-10 p-6 rounded-3xl bg-zinc-900/60 border border-amber-500/30 backdrop-blur-xl">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
                <FileSpreadsheet size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold font-serif mb-1">
                  Pedidos Corporativos Masivos (Navidad, Aniversarios y Despedidas)
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Encarga canciones exclusivas para tus empleados o clientes con un 20% de descuento automático a partir de 10 unidades. Descarga la plantilla oficial, rellena los datos y súbela aquí.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href="https://wa.me/34693693048?text=Hola%20Edwin,%20deseo%20solicitar%20la%20plantilla%20de%20canciones%20personalizadas%20para%20empresas."
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 transition-colors"
                  >
                    <Upload size={14} />
                    <span>Descargar Plantilla Excel / CSV</span>
                  </a>
                  <span className="text-[11px] text-amber-500 font-mono">
                    * Descuento del 20% aplicado automáticamente en factura oficial.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ASISTENTE WIZARD EN 5 PASOS */}
        <div className="rounded-3xl border border-white/10 bg-[#09090d]/90 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
          {/* Barra de Progreso */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-xs font-mono">
            <span className="text-amber-500 font-bold">Paso {step} de 5</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 w-8 rounded-full transition-all ${
                    s <= step ? 'bg-amber-500' : 'bg-zinc-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* PASO 1: PARA QUIÉN ES (100 ROLES) */}
          {step === 1 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">1. ¿Para quién es la canción?</h2>
              <p className="text-xs text-zinc-400 mb-6">Selecciona el vínculo o rol de la persona homenajeada.</p>

              {/* Pestañas de Roles */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(Object.keys(ROLES_CATEGORIES) as Array<keyof typeof ROLES_CATEGORIES>).map((key) => {
                  const labels: Record<string, string> = {
                    familiaCercana: 'Familia Cercana',
                    familiaExtendida: 'Familia Extendida',
                    amorYAmistad: 'Amor & Pareja',
                    empresaYTrabajo: 'Empresa & Trabajo'
                  };
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedRoleCategory(key)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-colors border ${
                        selectedRoleCategory === key
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/50'
                          : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:text-white'
                      }`}
                    >
                      {labels[key]}
                    </button>
                  );
                })}
              </div>

              {/* Grid de Roles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
                {ROLES_CATEGORIES[selectedRoleCategory].map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`p-3 rounded-xl border text-xs font-medium text-center transition-all ${
                      selectedRole === r
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-md scale-[1.02]'
                        : 'bg-zinc-900/50 text-zinc-300 border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
                >
                  <span>Continuar a Ocasión</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 2: OCASIÓN & CELEBRACIÓN */}
          {step === 2 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">2. ¿Qué motivo u ocasión celebramos?</h2>
              <p className="text-xs text-zinc-400 mb-6">Escoge el motivo especial para definir el tono de la letra.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => setSelectedOccasion(occ)}
                    className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                      selectedOccasion === occ
                        ? 'bg-amber-500 text-black font-bold border-amber-400 shadow-md'
                        : 'bg-zinc-900/50 text-zinc-300 border-white/5 hover:bg-zinc-800'
                    }`}
                  >
                    {occ}
                  </button>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
                >
                  <span>Continuar a Tu Historia</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 3: NOMBRES Y ANÉCDOTAS DE LA HISTORIA */}
          {step === 3 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">3. Tu historia, anécdotas y detalles</h2>
              <p className="text-xs text-zinc-400 mb-6">
                Edwin Agudelo rimará estos recuerdos en la letra de forma poética y emotiva.
              </p>

              <div className="space-y-4 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">
                      Nombre de la persona homenajeada:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Carmen Martínez"
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">
                      De parte de quién / nombres de quienes regalan:
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Tus hijos David y Laura"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">
                    Anécdotas, recuerdos clave y frases que deben sonar en la canción:
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Cuéntanos cómo es, recuerdos de infancia, lugares especiales, frases típicas, por qué la admiráis..."
                    value={storyNotes}
                    onChange={(e) => setStoryNotes(e.target.value)}
                    className="w-full p-3 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs outline-none focus:border-amber-400"
                  ></textarea>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    * Recibirás la letra por WhatsApp antes de ser cantada para validar cada detalle.
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
                >
                  <span>Continuar a Instrumentación</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 4: FORMATO E INSTRUMENTACIÓN */}
          {step === 4 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">4. Instrumentación y Formato</h2>
              <p className="text-xs text-zinc-400 mb-6">Elige el acabado instrumental y la orientación de vídeo.</p>

              {/* Escala Instrumental */}
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-mono text-zinc-300 mb-2">
                  Acabado de Producción en Estudio:
                </label>
                {INSTRUMENT_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setInstrumentTierId(tier.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      instrumentTierId === tier.id
                        ? 'bg-amber-500/15 border-amber-400 text-white shadow-md'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-300 hover:bg-zinc-900'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{tier.name}</div>
                      <div className="text-[11px] text-zinc-400">{tier.desc}</div>
                    </div>
                    <div className="text-xs font-mono font-bold text-amber-400">
                      {tier.extraEur > 0 ? `+${tier.extraEur} €` : 'Incluido'}
                    </div>
                  </button>
                ))}
              </div>

              {/* Elección de Formato de Vídeo */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 mb-8">
                <label className="block text-xs font-mono text-zinc-300 mb-2">
                  Formato de Entrega de Vídeo Saludo Cantado:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setVideoFormat('vertical')}
                    className={`p-3 rounded-xl border text-xs text-center transition-all ${
                      videoFormat === 'vertical'
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'bg-zinc-900/60 text-zinc-300 border-white/5'
                    }`}
                  >
                    Vertical (9:16)
                    <span className="block text-[10px] font-normal opacity-75">Móvil &amp; WhatsApp</span>
                  </button>
                  <button
                    onClick={() => setVideoFormat('horizontal')}
                    className={`p-3 rounded-xl border text-xs text-center transition-all ${
                      videoFormat === 'horizontal'
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'bg-zinc-900/60 text-zinc-300 border-white/5'
                    }`}
                  >
                    Horizontal (16:9)
                    <span className="block text-[10px] font-normal opacity-75">TV &amp; Pantalla</span>
                  </button>
                  <button
                    onClick={() => setVideoFormat('ambos')}
                    className={`p-3 rounded-xl border text-xs text-center transition-all ${
                      videoFormat === 'ambos'
                        ? 'bg-amber-500 text-black font-bold border-amber-400'
                        : 'bg-zinc-900/60 text-zinc-300 border-white/5'
                    }`}
                  >
                    Ambos Formatos (+30 €)
                    <span className="block text-[10px] font-normal opacity-75">Multi-dispositivo</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep(3)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Volver
                </button>
                <button
                  onClick={() => setStep(5)}
                  className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-lg"
                >
                  <span>Revisar Resumen</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* PASO 5: REVISIÓN Y CHECKOUT STRIPE */}
          {step === 5 && (
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mb-2">5. Resumen y Confirmación</h2>
              <p className="text-xs text-zinc-400 mb-6">Revisa tu encargo antes de pasar a la pasarela protegida.</p>

              <div className="p-5 rounded-2xl bg-zinc-900/80 border border-white/10 mb-6 space-y-3 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 font-mono">Homenajeado / Rol:</span>
                  <span className="font-bold text-white">{recipientName || 'Sin especificar'} ({selectedRole})</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 font-mono">Ocasión:</span>
                  <span className="font-bold text-white">{selectedOccasion}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 font-mono">Instrumentación:</span>
                  <span className="font-bold text-white">{selectedInstrument.name}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-zinc-400 font-mono">Formato de vídeo:</span>
                  <span className="font-bold text-white">{videoFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between pt-1 text-sm font-bold">
                  <span className="text-zinc-300 font-mono">Total a liquidar:</span>
                  <span className="text-xl font-mono text-amber-400">{finalPriceEur} €</span>
                </div>
              </div>

              {/* Garantías Oficiales */}
              <div className="space-y-1.5 text-xs text-zinc-400 mb-8 font-mono">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Revisión previa de letra por WhatsApp incluida.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Entrega en audio MP3 de alta fidelidad directo al móvil.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500" />
                  <span>Garantía de autor: 80% Artista / 10% EAR OS / 10% VIMUME Social.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => setStep(4)}
                  className="text-xs font-mono text-zinc-400 hover:text-white"
                >
                  Modificar datos
                </button>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    `Hola Edwin, quiero encargar una Canción Personalizada para ${recipientName || 'mi ' + selectedRole} (${selectedOccasion}). Instrumentación: ${selectedInstrument.name}. Formato: ${videoFormat}. Presupuesto: ${finalPriceEur} €.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)] hover:scale-105 cursor-pointer"
                >
                  <Sparkles size={14} />
                  <span>Confirmar Encargo ({finalPriceEur} €) por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* TARJETA DESTACADA: ¿QUIERES QUE EDWIN CANTE EN TU BODA O EVENTO? */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-[#ecb613]/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              Contratación en Directo
            </span>
            <h3 className="text-xl sm:text-2xl font-bold font-serif">
              ¿Quieres que Edwin Agudelo cante en tu Boda o Evento?
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
              Disfruta de la voz solista de gala en directo con tarifa base oficial de <strong>{TARIFA_BASE_SOLISTA_EUR} €</strong> y equipo de sonido Bose incluido.
            </p>
          </div>
          <Link
            href="/reservar/solista"
            className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs transition-all shadow-md hover:scale-105 whitespace-nowrap"
          >
            Ver Disponibilidad en Calendario
          </Link>
        </div>
      </div>
    </div>
  );
}
