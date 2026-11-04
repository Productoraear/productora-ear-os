'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  ShieldCheck,
  Brain,
  Building2,
  Users,
  Briefcase,
  BookOpen,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  MessageCircle,
  FileText,
  Send,
  Loader2,
  Landmark
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { VimumeBovedaEvidencia } from '@/components/vimume/VimumeBovedaEvidencia';
import type {
  DonorType,
  RscChannel,
  VimumeProgramPreset,
  VimumeRscCatalogue,
  VimumeRscCertificate
} from '@/lib/vimume/b2g-tender-engine';

type StakeholderRole = 'terapeuta' | 'director' | 'familia' | 'empresa' | 'investigador';

/** Formateador monetario único del componente. NO calcula: sólo presenta. */
const EUR_FORMATTER = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

function formatMoney(value: number): string {
  return EUR_FORMATTER.format(value);
}

interface CertificateFormState {
  entityName: string;
  department: string;
  cif: string;
  dir3Code: string;
  pliegoRef: string;
  programPreset: VimumeProgramPreset;
  customBudget: string;
  targetCentresCount: string;
  asistentesPorSesion: string;
  donorType: DonorType;
  recurring: boolean;
  splDbPropuesto: string;
  contactEmail: string;
}

const INITIAL_FORM: CertificateFormState = {
  entityName: '',
  department: '',
  cif: '',
  dir3Code: '',
  pliegoRef: '',
  programPreset: 'PILOTO_TRIMESTRAL',
  customBudget: '',
  targetCentresCount: '',
  asistentesPorSesion: '',
  donorType: 'PERSONA_JURIDICA',
  recurring: false,
  splDbPropuesto: '',
  contactEmail: ''
};

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}

/** Campo accesible: etiqueta asociada, ayuda y foco visible (WCAG AA). */
function VimumeField({ id, label, hint, required = false, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[11px] font-mono font-bold uppercase tracking-wide text-zinc-300">
        {label}
        {required ? <span className="text-[#00E5FF]"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="text-[10px] leading-relaxed text-zinc-500">{hint}</p> : null}
    </div>
  );
}

const INPUT_CLASS =
  'w-full rounded-xl bg-[#030305] border border-white/10 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 ' +
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] focus-visible:border-[#00E5FF]/60 transition-all duration-300 ease-out';

export default function VimumePortalPage() {
  const [selectedRole, setSelectedRole] = useState<StakeholderRole>('director');
  const [selectedCause, setSelectedCause] = useState<string>('pabellon');

  // ── Certificado de impacto 40 Hz + mecenazgo Ley 49/2002 ──────────────────
  const [catalogue, setCatalogue] = useState<VimumeRscCatalogue | null>(null);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);
  const [channel, setChannel] = useState<RscChannel>('B2G');
  const [form, setForm] = useState<CertificateFormState>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [certificate, setCertificate] = useState<VimumeRscCertificate | null>(null);
  const lastPayload = useRef<Record<string, unknown> | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadCatalogue = async () => {
      try {
        const response = await fetch('/api/vimume/rsc-certificate', {
          headers: { Accept: 'application/json' }
        });
        const body: unknown = await response.json();

        if (cancelled) {
          return;
        }
        if (!response.ok) {
          setCatalogueError('El motor de certificados no está disponible ahora mismo.');
          return;
        }

        const parsed = body as { ok?: boolean; data?: VimumeRscCatalogue };

        if (parsed.ok === true && parsed.data !== undefined) {
          setCatalogue(parsed.data);
          setCatalogueError(null);
        } else {
          setCatalogueError('El catálogo respondió sin datos verificables.');
        }
      } catch {
        if (!cancelled) {
          setCatalogueError(
            'Sin conexión con el motor de certificados. Recarga la página o escríbenos por WhatsApp.'
          );
        }
      }
    };

    void loadCatalogue();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = <K extends keyof CertificateFormState>(
    key: K,
    value: CertificateFormState[K]
  ): void => {
    setForm((previous) => ({ ...previous, [key]: value }) as CertificateFormState);
  };

  /** Construye el cuerpo exacto del POST. Sin aritmética: sólo transporte. */
  const buildPayload = (): Record<string, unknown> => {
    const payload: Record<string, unknown> = {
      channel,
      entityName: form.entityName.trim(),
      programPreset: form.programPreset
    };

    if (form.department.trim().length > 0) payload.department = form.department.trim();
    if (form.cif.trim().length > 0) payload.cif = form.cif.trim();
    if (form.contactEmail.trim().length > 0) payload.contactEmail = form.contactEmail.trim();
    if (form.targetCentresCount.trim().length > 0) payload.targetCentresCount = Number(form.targetCentresCount);
    if (form.asistentesPorSesion.trim().length > 0) payload.asistentesPorSesion = Number(form.asistentesPorSesion);
    if (form.splDbPropuesto.trim().length > 0) payload.splDbPropuesto = Number(form.splDbPropuesto);
    if (form.customBudget.trim().length > 0) payload.customBudget = Number(form.customBudget);

    if (channel === 'B2G') {
      if (form.dir3Code.trim().length > 0) payload.dir3Code = form.dir3Code.trim();
      if (form.pliegoRef.trim().length > 0) payload.pliegoRef = form.pliegoRef.trim();
    } else {
      payload.donorType = form.donorType;
      payload.recurring = form.recurring;
    }

    return payload;
  };

  const submitCertificate = async (payload: Record<string, unknown>): Promise<void> => {
    setSubmitting(true);
    setFormError(null);

    try {
      const response = await fetch('/api/vimume/rsc-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const body = (await response.json()) as {
        ok?: boolean;
        error?: string;
        data?: VimumeRscCertificate;
      };

      if (body.ok === true && body.data !== undefined) {
        setCertificate(body.data);
      } else {
        setFormError(body.error ?? 'El motor no devolvió certificado.');
      }
    } catch {
      setFormError('Error de red: no se pudo contactar con el motor de certificados.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const payload = buildPayload();
    lastPayload.current = payload;
    await submitCertificate(payload);
  };

  /** Reenvía EXACTAMENTE el mismo cuerpo: demuestra la idempotencia en vivo. */
  const handleRepeat = async (): Promise<void> => {
    if (submitting || lastPayload.current === null) {
      return;
    }
    await submitCertificate(lastPayload.current);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-[#00E5FF] selection:text-black pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* CABECERA VIMUME CON IDENTIDAD SOCIAL */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-4 text-xs font-mono font-medium border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
            <Brain size={13} />
            <span>VIAJE MUSICAL POR LA MEMORIA · NEUROACÚSTICA NO FARMACOLÓGICA</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-serif mb-4 leading-tight">
            Música con Propósito Clínico y Social.{' '}
            <span className="text-[#00E5FF] [text-shadow:0_0_28px_rgba(0,229,255,0.35)]">
              Estimulación 40 Hz y Serenidad para Mayores.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
            El 10% de cada evento producido por Productora EAR financia sesiones de estimulación neuroacústica en residencias de mayores y personas con deterioro cognitivo.
          </p>

          {/* MANIFIESTO DE RIGOR ÉTICO Y TRANSPARENCIA (CERO VENTA DE HUMO) */}
          <div className="p-5 rounded-2xl bg-zinc-950/80 border border-cyan-500/30 text-left max-w-3xl mx-auto mb-10 shadow-lg">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 mb-2">
              <ShieldCheck size={16} />
              <span>MANIFIESTO ÉTICO VIMUME // RIGOR CIENTÍFICO SIN ENGAÑOS</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              En EAR OS y VIMUME <strong>no vendemos milagros ni prometemos curaciones</strong>. La estimulación neuroacústica de 40 Hz es una <strong>línea de investigación no farmacológica</strong> orientada al bienestar emocional, la reducción de agitación y la reconexión de recuerdos mediante la música. Cualquier previsión clínica es una hipótesis de trabajo guiada por profesionales, jamás una promesa médica garantizada.
            </p>
          </div>

          {/* Vídeo Oficial de Edwin Agudelo (De Artista a Empresario Social) */}
          <div className="max-w-3xl mx-auto rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,229,255,0.15)] bg-black/80 aspect-video mb-12">
            <iframe
              src="https://www.youtube-nocookie.com/embed/qHvmCs0j0OQ?rel=0&modestbranding=1"
              title="De Artista a Empresario con Propósito Social · Edwin Agudelo VIMUME"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full border-0"
            ></iframe>
          </div>
        </div>

        {/* 🔬 BÓVEDA DE EVIDENCIA CLÍNICA, MOTOR 40 HZ Y LABORATORIO ACÚSTICO */}
        <section className="mb-20">
          <VimumeBovedaEvidencia />
        </section>

        {/* SELECTOR MULTICANAL DE ROLES (ADAPTACIÓN DINÁMICA) */}
        <div className="mb-12">
          <div className="text-center text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">
            ¿Cómo deseas participar o colaborar con VIMUME?
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-8">
            {[
              { id: 'director', label: 'Directores de Centro', icon: Building2 },
              { id: 'terapeuta', label: 'Terapeutas & Sanitarios', icon: Brain },
              { id: 'familia', label: 'Familias & Domicilio', icon: Users },
              { id: 'empresa', label: 'Empresas & Donantes', icon: Briefcase },
              { id: 'investigador', label: 'Medios & Wiki Científica', icon: BookOpen }
            ].map((tab) => {
              const IconComp = tab.icon;
              const isSelected = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRole(tab.id as StakeholderRole)}
                  className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.25)] scale-105'
                      : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:bg-zinc-800'
                  }`}
                >
                  <IconComp size={18} className={isSelected ? 'text-cyan-400' : 'opacity-60'} />
                  <span className="text-xs font-bold leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENIDO ADAPTADO POR ROL */}
          <div className="p-6 sm:p-10 rounded-3xl bg-[#09090d]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
            {/* ROL 1: DIRECTOR DE CENTRO */}
            {selectedRole === 'director' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Directores, Gerentes y Gestores de Residencias
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Diferenciación Asistencial y Responsabilidad Social
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Ofrece a las familias de tus residentes un servicio pionero que aporta serenidad y bienestar demostrable. Las sesiones de neuroacústica están <strong>subvencionadas por el split del 10% de EAR OS</strong> y permiten deducción fiscal del hasta 80% en IRPF o 40%-50% en Impuesto sobre Sociedades (Modelo 182 AEAT).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Retorno Social:</span>
                    <span className="font-bold text-cyan-400">SROI 4.85x</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Deducción Fiscal:</span>
                    <span className="font-bold text-cyan-400">Hasta 80% Modelo 182</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="block text-zinc-400 text-[10px]">Sesión Piloto:</span>
                    <span className="font-bold text-cyan-400">Financiada al 100%</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy director de centro y deseo solicitar información para una sesión piloto VIMUME subvencionada.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <Sparkles size={14} />
                  <span>Solicitar Sesión Piloto para Residencia</span>
                </a>
              </div>
            )}

            {/* ROL 2: TERAPEUTA */}
            {selectedRole === 'terapeuta' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Terapeutas Ocupacionales, Psicólogos y Musicoterapeutas
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Tu Socio Estratégico en el Acompañamiento Diario
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  VIMUME no sustituye tu criterio profesional: es una herramienta amigable que facilita tu trabajo diario. Ponemos a tu disposición frecuencias isocrónicas de 40 Hz no invasivas calibradas para momentos de agitación vespertina (Sundowning) y reconexión emocional.
                </p>

                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Guías prácticas de intervención sensorial no invasiva.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Registro observacional de respuesta emocional del residente.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-cyan-400" />
                    <span>Formación y acompañamiento técnico sin barreras de entrada.</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy terapeuta y deseo conocer las herramientas y guías clínicas de VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Conectar como Terapeuta Colaborador</span>
                </a>
              </div>
            )}

            {/* ROL 3: FAMILIA */}
            {selectedRole === 'familia' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Para Familias y Cuidadores en Domicilio o Residencia
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Lleva la Música que Amaron a su Corazón
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Si tienes a tu padre, madre o abuelo en casa o en una residencia y deseas regalarle una sesión personalizada de música evocadora, VIMUME te acompaña para que experimente momentos de paz, sonrisas y complicidad.
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, deseo consultar cómo llevar una sesión VIMUME para mi familiar.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Consultar Sesión para un Familiar</span>
                </a>
              </div>
            )}

            {/* ROL 4: EMPRESA */}
            {selectedRole === 'empresa' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Responsabilidad Social Corporativa (RSC) &amp; Donaciones
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Financia Sesiones para Pabellones de Bajos Recursos
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Tu empresa puede patrocinar sesiones completas para centros sin recursos económicos o pabellones con pacientes de deterioro severo. Certificado oficial de mecenazgo y reporte de impacto social garantizado.
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, represento a una empresa interesada en patrocinar sesiones sociales VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Patrocinar Sesiones Corporativas</span>
                </a>
              </div>
            )}

            {/* ROL 5: INVESTIGADOR / WIKI */}
            {selectedRole === 'investigador' && (
              <div className="space-y-6">
                <div className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Repositorio Científico &amp; Medios de Comunicación
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-serif">
                  Evidencia y Literatura en Estimulación Neuroacústica
                </h2>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Acceso a las bases bibliográficas internacionales sobre frecuencias Gamma (40 Hz), protocolos de estimulación auditiva y estudios clínicos de bienestar en demencia (OMS ICOPE y literatura indexada).
                </p>
                <a
                  href={`https://wa.me/34693693048?text=${encodeURIComponent(
                    'Hola Edwin, soy investigador / periodista y deseo consultar el dossier científico de VIMUME.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono font-bold text-xs transition-all shadow-lg hover:scale-105"
                >
                  <span>Solicitar Dossier Científico</span>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ═══ CERTIFICADO 40 Hz + MECENAZGO LEY 49/2002 (ESCRITURA REAL) ═══ */}
        <section className="mb-16" aria-labelledby="certificado-rsc-title">
          <div className="p-6 sm:p-10 rounded-3xl bg-[#09090d]/90 border border-[#00E5FF]/25 backdrop-blur-xl shadow-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-[11px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25 mb-4">
              <FileText size={13} />
              <span>DOSSIER 40 Hz + CERTIFICADO RSC · ESCRITURA REAL, NO MAQUETA</span>
            </div>

            <h2 id="certificado-rsc-title" className="text-2xl sm:text-3xl font-bold font-serif mb-2">
              Genera el dossier neuroacústico y el certificado de mecenazgo
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed mb-6 max-w-3xl">
              Los importes, el reparto 80/10/10, la deducción de la Ley 49/2002 y el techo del
              Art. 118 LCSP se calculan <strong>en el servidor</strong> desde la fuente única de verdad.
              El expediente se entrega al webhook de n8n con reintentos y cola de muertos visible: si
              la entrega falla, no se finge éxito y el evento queda a la vista para reintentarlo.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6" role="group" aria-label="Canal del expediente">
              {[
                { id: 'B2G' as RscChannel, icon: Landmark },
                { id: 'RSC' as RscChannel, icon: Heart }
              ].map((option) => {
                const meta = catalogue?.channels.find((candidate) => candidate.id === option.id);
                const Icon = option.icon;
                const active = channel === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setChannel(option.id);
                      setCertificate(null);
                      setFormError(null);
                    }}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] ${
                      active
                        ? 'bg-[#00E5FF]/10 border-[#00E5FF]/60 text-white'
                        : 'bg-[#030305] border-white/10 text-zinc-300 hover:border-white/25'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-xs font-bold font-mono">
                      <Icon size={14} className={active ? 'text-[#00E5FF]' : 'opacity-60'} />
                      <span>{meta?.label ?? option.id}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-zinc-400">
                      {meta?.description ?? 'Catálogo no disponible: recarga la página.'}
                    </p>
                  </button>
                );
              })}
            </div>

            {catalogueError !== null && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2 p-3.5 rounded-xl bg-[#FF2B44]/10 border border-[#FF2B44]/30 text-[11px] text-[#FF2B44]"
              >
                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                <span>{catalogueError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* ════ IDENTIDAD ════ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VimumeField
                  id="rsc-entity"
                  label="Entidad solicitante"
                  required
                  hint="Ayuntamiento, residencia o empresa patrocinadora."
                >
                  <input
                    id="rsc-entity"
                    type="text"
                    required
                    minLength={3}
                    maxLength={160}
                    autoComplete="organization"
                    value={form.entityName}
                    onChange={(event) => updateField('entityName', event.target.value)}
                    placeholder="Ayuntamiento de Méntrida"
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                <VimumeField id="rsc-department" label="Departamento / Concejalía">
                  <input
                    id="rsc-department"
                    type="text"
                    maxLength={160}
                    value={form.department}
                    onChange={(event) => updateField('department', event.target.value)}
                    placeholder="Concejalía de Asuntos Sociales"
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                <VimumeField id="rsc-cif" label="CIF de la entidad">
                  <input
                    id="rsc-cif"
                    type="text"
                    maxLength={20}
                    value={form.cif}
                    onChange={(event) => updateField('cif', event.target.value)}
                    placeholder="P4500000A"
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                <VimumeField
                  id="rsc-email"
                  label="Email de contacto (opcional)"
                  hint="No se almacena: se convierte en huella SHA-256 antes de salir del servidor."
                >
                  <input
                    id="rsc-email"
                    type="email"
                    maxLength={160}
                    autoComplete="email"
                    value={form.contactEmail}
                    onChange={(event) => updateField('contactEmail', event.target.value)}
                    placeholder="rsc@empresa.es"
                    className={INPUT_CLASS}
                  />
                </VimumeField>
              </div>

              {/* ════ CANAL: B2G O RSC ════ */}
              {channel === 'B2G' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#030305] border border-white/10">
                  <VimumeField
                    id="rsc-dir3"
                    label="Código DIR3 del órgano contratante"
                    required
                    hint="9 caracteres alfanuméricos. Obligatorio para la factura electrónica vía FACe."
                  >
                    <input
                      id="rsc-dir3"
                      type="text"
                      maxLength={20}
                      value={form.dir3Code}
                      onChange={(event) => updateField('dir3Code', event.target.value)}
                      placeholder="L01180734"
                      className={INPUT_CLASS}
                    />
                  </VimumeField>

                  <VimumeField
                    id="rsc-pliego"
                    label="Referencia del pliego o memoria del gasto"
                    required
                    hint="Sin documento de origen el motor no emite oferta: no inventa condiciones."
                  >
                    <input
                      id="rsc-pliego"
                      type="text"
                      maxLength={120}
                      value={form.pliegoRef}
                      onChange={(event) => updateField('pliegoRef', event.target.value)}
                      placeholder="EXP-SOCIAL-2026/014"
                      className={INPUT_CLASS}
                    />
                  </VimumeField>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#030305] border border-white/10">
                  <VimumeField
                    id="rsc-donor"
                    label="Tipo de donante"
                    required
                    hint="Determina los tipos del art. 20 de la Ley 49/2002."
                  >
                    <select
                      id="rsc-donor"
                      value={form.donorType}
                      onChange={(event) => updateField('donorType', event.target.value as DonorType)}
                      className={INPUT_CLASS}
                    >
                      <option value="PERSONA_JURIDICA">Persona jurídica (Impuesto sobre Sociedades)</option>
                      <option value="PERSONA_FISICA">Persona física (IRPF)</option>
                    </select>
                  </VimumeField>

                  <VimumeField
                    id="rsc-recurring"
                    label="Donante recurrente (≥ 3 años)"
                    hint="Activa el tipo incrementado: 45 % en IRPF o 50 % en IS."
                  >
                    <label htmlFor="rsc-recurring" className="flex items-center gap-2 text-xs text-zinc-300 mt-1">
                      <input
                        id="rsc-recurring"
                        type="checkbox"
                        checked={form.recurring}
                        onChange={(event) => updateField('recurring', event.target.checked)}
                        className="h-4 w-4 rounded border-white/20 bg-[#030305] text-[#00E5FF] focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                      />
                      <span>Sí, misma entidad al menos 3 años</span>
                    </label>
                  </VimumeField>
                </div>
              )}

              {/* ════ PROGRAMA Y RIDER ACÚSTICO ════ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <VimumeField
                  id="rsc-program"
                  label="Programa de intervención"
                  required
                  hint={
                    catalogue?.presets.find((preset) => preset.id === form.programPreset)?.pricingRule ??
                    'Cargando catálogo de programas…'
                  }
                >
                  <select
                    id="rsc-program"
                    value={form.programPreset}
                    disabled={catalogue === null}
                    onChange={(event) =>
                      updateField('programPreset', event.target.value as VimumeProgramPreset)
                    }
                    className={INPUT_CLASS}
                  >
                    {(catalogue?.presets ?? []).map((preset) => (
                      <option key={preset.id} value={preset.id}>
                        {preset.name} — {formatMoney(preset.basePrice)}
                      </option>
                    ))}
                    {catalogue === null ? (
                      <option value={form.programPreset}>Cargando programas…</option>
                    ) : null}
                  </select>
                </VimumeField>

                <VimumeField
                  id="rsc-budget"
                  label="Importe (€, IVA excluido)"
                  hint={
                    catalogue === null
                      ? 'Cargando techo legal…'
                      : `Vacío = importe del programa. Techo preventivo ${formatMoney(catalogue.lcsp.techoPreventivoEur)} (Art. 118.1 LCSP).`
                  }
                >
                  <input
                    id="rsc-budget"
                    type="number"
                    min={1}
                    step="0.01"
                    inputMode="decimal"
                    value={form.customBudget}
                    onChange={(event) => updateField('customBudget', event.target.value)}
                    placeholder="Sin definir"
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                <VimumeField
                  id="rsc-centres"
                  label="Centros del despliegue"
                  hint="Número de residencias o centros municipales implicados."
                >
                  <input
                    id="rsc-centres"
                    type="number"
                    min={1}
                    max={200}
                    step={1}
                    inputMode="numeric"
                    value={form.targetCentresCount}
                    onChange={(event) => updateField('targetCentresCount', event.target.value)}
                    placeholder="Centros del programa"
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                {/* ════ RIDER ACÚSTICO ════ */}
                <VimumeField
                  id="rsc-pax"
                  label="Asistentes por sesión"
                  hint="Determina la potencia electroacústica exigida (W por persona)."
                >
                  <input
                    id="rsc-pax"
                    type="number"
                    min={1}
                    max={5000}
                    step={1}
                    inputMode="numeric"
                    value={form.asistentesPorSesion}
                    onChange={(event) => updateField('asistentesPorSesion', event.target.value)}
                    placeholder={catalogue ? String(catalogue.defaults.asistentesPorSesion) : 'Aforo'}
                    className={INPUT_CLASS}
                  />
                </VimumeField>

                <VimumeField
                  id="rsc-spl"
                  label="Presión sonora prevista (dB SPL)"
                  hint={
                    catalogue === null
                      ? 'Cargando banda acústica…'
                      : `Banda de confort ${catalogue.acoustic.rangoConfortDb.min}-${catalogue.acoustic.rangoConfortDb.max} dBA. Por encima de ${catalogue.acoustic.limiteSplDb} dB no se homologa.`
                  }
                >
                  <input
                    id="rsc-spl"
                    type="number"
                    min={40}
                    max={120}
                    step="0.1"
                    inputMode="decimal"
                    value={form.splDbPropuesto}
                    onChange={(event) => updateField('splDbPropuesto', event.target.value)}
                    placeholder={catalogue ? String(catalogue.defaults.splDbPropuesto) : 'dB SPL'}
                    className={INPUT_CLASS}
                  />
                </VimumeField>
              </div>

              <div aria-live="polite" className="min-h-[1.25rem] text-[11px] leading-relaxed text-[#FF2B44]">
                {formError !== null ? formError : ''}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting || catalogue === null}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#00E5FF] text-black font-mono font-bold text-xs transition-all duration-300 ease-out hover:bg-[#4df0ff] hover:scale-[1.02] shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  <span>
                    {submitting ? 'Calculando y entregando…' : 'Emitir certificado y despachar a n8n'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => void handleRepeat()}
                  disabled={submitting || certificate === null}
                  aria-label="Reenviar el mismo expediente para comprobar la idempotencia"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/15 text-zinc-300 font-mono font-bold text-xs transition-all duration-300 ease-out hover:border-[#00E5FF]/60 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 size={14} />
                  <span>Reenviar igual (probar idempotencia)</span>
                </button>
              </div>

            </form>

            {/* ════ RESULTADO: LO QUE SE ESCRIBIÓ DE VERDAD ════ */}
            {certificate !== null && (
              <div className="mt-8 space-y-5" aria-live="polite">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/25">
                    <CheckCircle2 size={12} />
                    EXPEDIENTE EMITIDO
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold border ${
                      certificate.delivery.delivered
                        ? 'bg-[#00E5FF]/10 text-[#00E5FF] border-[#00E5FF]/25'
                        : 'bg-[#FF2B44]/10 text-[#FF2B44] border-[#FF2B44]/30'
                    }`}
                  >
                    {certificate.delivery.delivered ? 'WEBHOOK ENTREGADO' : 'EN COLA DE MUERTOS (VISIBLE)'}
                  </span>
                  {certificate.idempotentReplay ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold bg-white/5 text-zinc-300 border border-white/15">
                      IDEMPOTENTE · MISMA FILA, NO DUPLICADA
                    </span>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-[11px] font-mono">
                  <div className="p-3 rounded-xl bg-[#030305] border border-white/10">
                    <span className="block text-zinc-500 text-[10px]">EXPEDIENTE</span>
                    <span className="text-white break-all">{certificate.expedienteId}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030305] border border-white/10">
                    <span className="block text-zinc-500 text-[10px]">SHA-256 DEL PAYLOAD</span>
                    <span className="text-white break-all" title={certificate.payloadSha256}>
                      {certificate.payloadSha256.slice(0, 24)}…
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030305] border border-white/10">
                    <span className="block text-zinc-500 text-[10px]">INTENTOS DE ENTREGA</span>
                    <span className="text-white">{certificate.delivery.attempts}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#030305] border border-white/10">
                    <span className="block text-zinc-500 text-[10px]">ESTADO n8n</span>
                    <span
                      className={
                        certificate.delivery.delivered ? 'text-[#00E5FF]' : 'text-[#FF2B44]'
                      }
                    >
                      {certificate.delivery.delivered
                        ? `OK ${certificate.delivery.status ?? ''}`
                        : certificate.delivery.lastError ?? 'pendiente'}
                    </span>
                  </div>
                </div>

                {/* ════ DESGLOSE ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                    <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                      {certificate.channel === 'B2G' ? 'Presupuesto del contrato menor' : 'Donativo y régimen fiscal'}
                    </h3>
                    <dl className="space-y-2 text-xs">
                      {certificate.financials !== null ? (
                        <>
                          <div className="flex justify-between gap-3">
                            <dt className="text-zinc-400">Base (IVA excluido)</dt>
                            <dd className="text-white font-mono">{formatMoney(certificate.financials.baseBudget)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-zinc-400">IVA</dt>
                            <dd className="text-white font-mono">{formatMoney(certificate.financials.vatAmount)}</dd>
                          </div>
                          <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
                            <dt className="text-zinc-300 font-bold">Total factura</dt>
                            <dd className="text-[#00E5FF] font-mono font-bold">{formatMoney(certificate.financials.totalBudget)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-zinc-400">Art. 118.1 LCSP</dt>
                            <dd className={certificate.financials.isLCSPCompliant ? 'text-[#00E5FF] font-mono' : 'text-[#FF2B44] font-mono'}>
                              {certificate.financials.isLCSPCompliant ? 'CONFORME' : 'FUERA DE TECHO'}
                            </dd>
                          </div>
                        </>
                      ) : certificate.donation !== null ? (
                        <>
                          <div className="flex justify-between gap-3">
                            <dt className="text-zinc-400">Donativo aportado</dt>
                            <dd className="text-[#00E5FF] font-mono font-bold">{formatMoney(certificate.donation.importeEur)}</dd>
                          </div>
                          <div className="flex justify-between gap-3">
                            <dt className="text-zinc-400">IVA</dt>
                            <dd className="text-white font-mono">No aplicable</dd>
                          </div>
                        </>
                      ) : null}
                    </dl>
                    <p className="mt-3 text-[10px] leading-relaxed text-zinc-500">
                      {certificate.donation !== null
                        ? certificate.donation.nota
                        : certificate.financials?.baseLegalTecho ?? ''}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                    <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                      Reparto del split (calculado en servidor)
                    </h3>
                    <dl className="space-y-2 text-xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">
                          Artista ({Math.round(certificate.split.ratios.artista * 100)} %)
                        </dt>
                        <dd className="text-white font-mono">{formatMoney(certificate.split.artista)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">
                          Infraestructura EAR OS ({Math.round(certificate.split.ratios.earOs * 100)} %)
                        </dt>
                        <dd className="text-white font-mono">{formatMoney(certificate.split.earOs)}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">
                          Fondo VIMUME ({Math.round(certificate.split.ratios.vimume * 100)} %)
                        </dt>
                        <dd className="text-white font-mono">{formatMoney(certificate.split.vimume)}</dd>
                      </div>
                      <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
                        <dt className="text-zinc-300 font-bold">Base del reparto</dt>
                        <dd className="text-[#00E5FF] font-mono font-bold">{formatMoney(certificate.split.base)}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-[10px] text-zinc-500 font-mono break-all">
                      SHA-256 del split: {certificate.split.sha256Hash.slice(0, 32)}…
                    </p>
                  </div>
                </div>

                {/* ════ FISCAL Y ACÚSTICA ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {certificate.fiscal !== null ? (
                    <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                      <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                        Deducción Ley 49/2002 · Modelo {certificate.fiscal.modeloAeat} AEAT
                      </h3>
                      <table className="w-full text-[11px] font-mono">
                        <thead>
                          <tr className="text-zinc-500 text-[10px] uppercase">
                            <th scope="col" className="text-left font-normal pb-1">Tramo</th>
                            <th scope="col" className="text-right font-normal pb-1">Base</th>
                            <th scope="col" className="text-right font-normal pb-1">Tipo</th>
                            <th scope="col" className="text-right font-normal pb-1">Deducción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {certificate.fiscal.tramos.map((tramo) => (
                            <tr key={tramo.concepto} className="border-t border-white/5">
                              <td className="py-1.5 pr-2 text-zinc-300">{tramo.concepto}</td>
                              <td className="py-1.5 text-right text-white">{formatMoney(tramo.base)}</td>
                              <td className="py-1.5 text-right text-white">{Math.round(tramo.tipo * 100)} %</td>
                              <td className="py-1.5 text-right text-[#00E5FF]">{formatMoney(tramo.deduccion)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="mt-3 flex items-center justify-between text-xs border-t border-white/10 pt-2">
                        <span className="text-zinc-300 font-bold">Deducción total estimada</span>
                        <span className="text-[#00E5FF] font-mono font-bold">
                          {formatMoney(certificate.fiscal.deduccionTotal)}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5 text-[10px] leading-relaxed text-zinc-500 list-disc pl-4">
                        {certificate.fiscal.advertencias.map((advertencia) => (
                          <li key={advertencia}>{advertencia}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                      <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                        Régimen del contrato menor
                      </h3>
                      <p className="text-[11px] leading-relaxed text-zinc-400">
                        El órgano contratante no es donante: la Ley 49/2002 no genera deducción en esta vía.
                        La factura se presenta por FACe con el DIR3 declarado y el IVA aplicado es el del SSOT.
                      </p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                    <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                      Rider acústico 40 Hz homologado
                    </h3>
                    <dl className="space-y-2 text-xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">Presión sonora</dt>
                        <dd className="text-white font-mono">{certificate.acoustic.splDb} dB SPL</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">Banda de confort</dt>
                        <dd className="text-white font-mono">
                          {certificate.acoustic.rangoConfortDb.min}-{certificate.acoustic.rangoConfortDb.max} dBA
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-zinc-400">Potencia (W/pax → total)</dt>
                        <dd className="text-white font-mono">
                          {certificate.acoustic.wattsPorPax} → {certificate.acoustic.potenciaRequeridaW} W
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3 border-t border-white/10 pt-2">
                        <dt className="text-zinc-300 font-bold">Veredicto</dt>
                        <dd className="text-[#00E5FF] font-mono">{certificate.acoustic.veredicto}</dd>
                      </div>
                    </dl>
                    <p className="mt-3 text-[10px] leading-relaxed text-zinc-500">
                      {certificate.acoustic.baseTecnica}
                    </p>
                  </div>
                </div>

                {/* ════ DOCUMENTACIÓN Y DOSSIER ════ */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                    <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                      Documentación exigida antes de presentar
                    </h3>
                    <ul className="space-y-1.5 text-[11px] leading-relaxed text-zinc-400">
                      {certificate.documentacionRequerida.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-[#00E5FF]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                    <h3 className="text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide mb-3">
                      Entrega y trazabilidad
                    </h3>
                    <ul className="space-y-2 text-[11px] leading-relaxed text-zinc-400">
                      <li>
                        Referencia de contacto:{' '}
                        <span className="font-mono text-white">
                          {certificate.contact.contactRef ?? 'no declarada'}
                        </span>
                      </li>
                      <li>
                        Alcance del ledger:{' '}
                        <span className="font-mono text-white">{certificate.scope.ledger}</span>
                      </li>
                      <li>
                        Envíos realizados a n8n:{' '}
                        <span className="font-mono text-white">{certificate.dispatches}</span>
                      </li>
                      <li className="font-mono text-[10px] text-zinc-500 break-all">
                        Telemetría y cola de muertos: {certificate.delivery.dlqVisibleAt}
                      </li>
                    </ul>

                    <a
                      href={`https://wa.me/${CENTRALITA_EAR_OS.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hola Edwin, hemos emitido el expediente ${certificate.expedienteId} en VIMUME. Adjunto el dossier neuroacústico para revisión.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Enviar el expediente ${certificate.expedienteId} por WhatsApp`}
                      className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#00E5FF]/40 text-[#00E5FF] font-mono font-bold text-[11px] transition-all duration-300 ease-out hover:bg-[#00E5FF]/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]"
                    >
                      <MessageCircle size={13} />
                      <span>Enviar el expediente por WhatsApp</span>
                    </a>
                  </div>
                </div>

                <details className="p-4 rounded-2xl bg-[#030305] border border-white/10">
                  <summary className="cursor-pointer rounded text-[11px] font-mono font-bold text-[#00E5FF] uppercase tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00E5FF]">
                    Ver el dossier completo (Markdown · {certificate.dossierMarkdown.length} caracteres)
                  </summary>
                  <pre className="mt-3 max-h-96 overflow-auto whitespace-pre-wrap break-words font-mono text-[10px] leading-relaxed text-zinc-300">
                    {certificate.dossierMarkdown}
                  </pre>
                </details>

              </div>
            )}
          </div>
        </section>

        {/* SELECTOR DE CAUSA BENÉFICA DEL 10% SOCIAL */}
        <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950/80 border border-cyan-500/30">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold mb-2">
            <Heart size={14} />
            <span>DESTINO SOBERANO DEL SPLIT BENÉFICO (10% VIMUME)</span>
          </div>
          <h3 className="text-lg font-bold font-serif mb-2">
            ¿A qué causa prefieres destinar el 10% social de tu evento?
          </h3>
          <p className="text-xs text-zinc-400 mb-6">
            Cada cliente que contrata en EAR OS elige a qué área se canaliza su dividendo social.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'pabellon', title: 'Pabellones de Deterioro Severo', desc: 'Centros con pacientes en fases avanzadas que no reciben visitas.' },
              { id: 'domicilio', title: 'Familias con Bajos Recursos', desc: 'Mayores atendidos en hogares particulares sin capacidad económica.' },
              { id: 'rural', title: 'Expansión de Red Rural', desc: 'Llevar sesiones y equipamiento a residencias en pueblos pequeños.' }
            ].map((cause) => (
              <button
                key={cause.id}
                onClick={() => setSelectedCause(cause.id)}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedCause === cause.id
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-md'
                    : 'bg-zinc-900/50 border-white/5 text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div className="text-xs font-bold mb-1">{cause.title}</div>
                <div className="text-[11px] text-zinc-400 leading-relaxed">{cause.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
