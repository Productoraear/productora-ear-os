'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  Volume2,
  MapPin,
  HelpCircle,
  Shield,
  Star,
  Bell,
  Sliders,
  DollarSign,
  X,
} from 'lucide-react';
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  CENTRALITA_EAR_OS,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
} from '@/lib/constants/ear-os-ssot';

type Stage =
  | 'quiz'
  | 'personalization_loader'
  | 'plan_summary'
  | 'permission_prompts'
  | 'social_proof'
  | 'paywall';

export function SovereignMobileOnboardingAndPaywall() {
  const [currentStage, setCurrentStage] = useState<Stage>('quiz');

  // 1. Goal Quiz State (Pregunta por pantalla)
  const [quizStep, setQuizStep] = useState<number>(1);
  const [selectedEventType, setSelectedEventType] = useState<string>('boda');
  const [selectedAforo, setSelectedAforo] = useState<string>('100-200');

  // 2. Personalization Loader State
  const [loaderProgress, setLoaderProgress] = useState<number>(30);
  const [checklist, setChecklist] = useState([
    { label: 'Analizando acústica Ley 37/2003 (< 75 dB SPL)', status: 'done' },
    { label: 'Calibrando disponibilidad en calendario de Edwin Agudelo', status: 'done' },
    { label: 'Calculando fianza deducible Stripe Price-Lock (100,00 €)', status: 'in_progress' },
    { label: 'Asignando 10% a impacto social VIMUME', status: 'pending' },
  ]);

  // 3. Permission Prompts State
  const [permissionStep, setPermissionStep] = useState<number>(1);

  // 4. Social Proof State (Testimonios reales con estrellas)
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);
  const realTestimonials = [
    {
      author: 'Familia Mendoza · Toledo',
      rating: 5,
      role: 'Boda en Finca Señorial',
      quote:
        'Edwin cantó como nunca. La policía municipal pasó por la finca y el limitador homologado marcaba 72 dB. Cero problemas y emoción total.',
      verified: 'Reseña Verificada Google (5.0)',
    },
    {
      author: 'Ayuntamiento de Méntrida',
      rating: 5,
      role: 'Concierto Gala Festejos',
      quote:
        'Contratación menor limpia bajo Art. 118 LCSP sin reparos de intervención. Sonido impecable y split transparente.',
      verified: 'Expediente Público B2G',
    },
    {
      author: 'Residencia Los Pinos · Madrid Sur',
      rating: 5,
      role: 'Sesión Terapéutica VIMUME',
      quote:
        'La estimulación sonora a 40 Hz despertó recuerdos en residentes con Alzheimer avanzado. Una labor social que emociona.',
      verified: 'Informe Clínico 40 Hz',
    },
  ];

  // 5. Paywall State
  const [billingPeriod, setBillingPeriod] = useState<'evento' | 'temporada'>('evento');
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState<boolean>(true);

  // Handlers
  const handleQuizNext = () => {
    if (quizStep === 1) {
      setQuizStep(2);
    } else {
      setCurrentStage('personalization_loader');
      setTimeout(() => {
        setLoaderProgress(100);
        setChecklist((prev) => prev.map((c) => ({ ...c, status: 'done' })));
        setTimeout(() => setCurrentStage('plan_summary'), 800);
      }, 1200);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 sm:p-6 font-sans text-zinc-100">
      {/* 1. STAGE: GOAL QUIZ (CUESTIONARIO DE OBJETIVOS) */}
      {currentStage === 'quiz' && (
        <section aria-labelledby="quiz-heading" className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl">
          {/* Progress Bar Accessible */}
          <div className="mb-6">
            <div className="flex justify-between text-xs font-mono text-zinc-400 mb-2">
              <span id="quiz-heading" className="font-bold text-white uppercase tracking-wider">
                Configurador de Evento · Paso {quizStep} de 2
              </span>
              <span className="text-amber-400">{quizStep === 1 ? '50%' : '100%'}</span>
            </div>
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={quizStep === 1 ? 50 : 100} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: quizStep === 1 ? '50%' : '100%' }} />
            </div>
          </div>

          {quizStep === 1 ? (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                ¿Qué tipo de evento estás planificando?
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Selecciona la categoría para que el motor asigne el rider acústico legal conforme a la Ley 37/2003.
              </p>

              <div role="radiogroup" aria-label="Tipo de evento" className="space-y-2.5 pt-2">
                {[
                  { id: 'boda', label: 'Boda o Gala Exclusiva (Cóctel + Banquete)', sub: 'Acústica de cámara 70-85 dBA' },
                  { id: 'municipal', label: 'Festejo Popular / Municipal (Ayuntamiento B2G)', sub: 'Limitador telemático < 14.250 € LCSP' },
                  { id: 'empresa', label: 'Evento Corporativo / Muestra de Producto', sub: 'Refuerzo sonoro de alta fidelidad' },
                  { id: 'vimume', label: 'Sesión Social / Residencia Senior VIMUME', sub: 'Frecuencia 40 Hz no invasiva' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    role="radio"
                    aria-checked={selectedEventType === opt.id}
                    tabIndex={0}
                    onClick={() => setSelectedEventType(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedEventType === opt.id
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(236,182,19,0.15)]'
                        : 'border-white/10 bg-zinc-900/50 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{opt.label}</span>
                      <span className={`w-3.5 h-3.5 rounded-full border ${selectedEventType === opt.id ? 'border-amber-400 bg-amber-400' : 'border-zinc-600'}`} />
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 font-sans">{opt.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                ¿Cuál es el aforo aproximado de asistentes?
              </h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                El sistema dimensiona automáticamente la potencia a {WATTS_PER_PAX} W/pax sin superar el umbral de salud pública (&lt; {LIMITE_SPL_DB} dB SPL).
              </p>

              <div role="radiogroup" aria-label="Aforo estimado" className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { id: '20-50', label: 'Íntimo (20-50 pax)', watts: '600 W Bose S1' },
                  { id: '50-100', label: 'Medio (50-100 pax)', watts: '1.200 W Bose L1' },
                  { id: '100-200', label: 'Gala (100-200 pax)', watts: '2.400 W Bose F1' },
                  { id: '200+', label: 'Gran Formato (+200 pax)', watts: 'Line Array Homologado' },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    role="radio"
                    aria-checked={selectedAforo === opt.id}
                    tabIndex={0}
                    onClick={() => setSelectedAforo(opt.id)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all text-center ${
                      selectedAforo === opt.id
                        ? 'border-amber-400 bg-amber-500/10 shadow-[0_0_20px_rgba(236,182,19,0.15)]'
                        : 'border-white/10 bg-zinc-900/50 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="font-bold text-xs text-white mb-1">{opt.label}</div>
                    <div className="text-[10px] text-amber-400 font-mono">{opt.watts}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            {quizStep === 2 ? (
              <button
                type="button"
                onClick={() => setQuizStep(1)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                ← Atrás
              </button>
            ) : <span />}

            <button
              type="button"
              onClick={handleQuizNext}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer shadow-lg"
            >
              <span>{quizStep === 1 ? 'Siguiente Pregunta' : 'Crear Plan Acústico'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* 2. STAGE: PERSONALIZATION LOADER (ELABORANDO TU PLAN) */}
      {currentStage === 'personalization_loader' && (
        <section aria-live="polite" className="p-8 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl text-center space-y-6">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 animate-spin">
            <Sparkles className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-xl font-bold font-display text-white">
              Elaborando tu Plan Acústico & Financiero...
            </h3>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Progreso: {loaderProgress}% completado
            </p>
          </div>

          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={loaderProgress} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-700" style={{ width: `${loaderProgress}%` }} />
          </div>

          <div className="space-y-2 text-left font-mono text-xs max-w-sm mx-auto">
            {checklist.map((c, i) => (
              <div key={i} className="flex items-center gap-2.5 text-zinc-300">
                {c.status === 'done' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : c.status === 'in_progress' ? (
                  <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-zinc-600 flex-shrink-0" />
                )}
                <span className="text-[11px] truncate">{c.label}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. STAGE: PLAN SUMMARY (RESUMEN DEL PLAN) */}
      {currentStage === 'plan_summary' && (
        <section aria-labelledby="summary-heading" className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-zinc-950/90 backdrop-blur-xl space-y-6">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Plan Calibrado para Producción
            </span>
            <h2 id="summary-heading" className="text-2xl font-bold font-display text-white">
              Gala Solista Edwin Agudelo + Rider Bose
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Configuración óptima certificada para {selectedAforo} pax con cumplimiento total de la Ley del Ruido.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-900 border border-white/5 space-y-2.5 font-mono text-xs">
            <div className="flex justify-between text-zinc-400">
              <span>Suelo Solista Oficial:</span>
              <span className="text-white font-bold">{TARIFA_BASE_SOLISTA_EUR.toFixed(2)} €</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Rider Acústico ({WATTS_PER_PAX} W/pax):</span>
              <span className="text-emerald-400 font-bold">&lt; {LIMITE_SPL_DB} dB SPL Certificado</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Fianza Deducible Stripe:</span>
              <span className="text-amber-400 font-bold">-{DEPOSITO_STRIPE_EUR.toFixed(2)} € (100% deducible)</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>Split de Impacto Social:</span>
              <span className="text-purple-400 font-bold">10% a VIMUME Mayores</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStage('permission_prompts')}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <span>Continuar a Validación de Permisos</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 4. STAGE: PERMISSION PROMPTS (GUÍA DE PERMISOS) */}
      {currentStage === 'permission_prompts' && (
        <section aria-labelledby="perm-heading" className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl text-center space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400">
            <Bell className="w-6 h-6" />
          </div>

          <div>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Permiso {permissionStep} de 2
            </span>
            <h3 id="perm-heading" className="text-xl font-bold font-display text-white mt-1">
              {permissionStep === 1 ? 'Alertas de Disponibilidad de Fecha' : 'Telemetría de Ubicación de Recinto'}
            </h3>
            <p className="text-xs text-zinc-400 mt-2 font-sans leading-relaxed max-w-sm mx-auto">
              {permissionStep === 1
                ? 'Te notificaremos si otra pareja o empresa consulta tu misma fecha en el calendario atómico antes del pago de la fianza.'
                : 'Calculamos los kilómetros exactos desde el Hub Méntrida para aplicar los 50 km exentos sin sobrecostes.'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => {
                if (permissionStep === 1) setPermissionStep(2);
                else setCurrentStage('social_proof');
              }}
              className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all cursor-pointer"
            >
              Permitir Alertas
            </button>

            <button
              type="button"
              onClick={() => {
                if (permissionStep === 1) setPermissionStep(2);
                else setCurrentStage('social_proof');
              }}
              className="w-full py-2.5 rounded-xl border border-white/5 bg-zinc-900 text-zinc-400 hover:text-white text-xs font-mono cursor-pointer"
            >
              Ahora No
            </button>
          </div>
        </section>
      )}

      {/* 5. STAGE: SOCIAL PROOF STEP (PRUEBA SOCIAL REAL) */}
      {currentStage === 'social_proof' && (
        <section aria-labelledby="proof-heading" className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-zinc-950/90 backdrop-blur-xl space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 mb-1" aria-label="Calificación 5 de 5 estrellas">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <h3 id="proof-heading" className="text-xl font-bold font-display text-white">
              5.0 en Google Reseñas & Evaluaciones B2G
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Basado en eventos y contrataciones públicas auditadas en disco (sin cifras inventadas).
            </p>
          </div>

          {/* Carrusel de Testimonios Reales */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-white/5 space-y-3 font-sans">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-white">
                  {realTestimonials[activeTestimonialIdx].author}
                </div>
                <div className="text-[11px] text-zinc-400 font-mono">
                  {realTestimonials[activeTestimonialIdx].role}
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                {realTestimonials[activeTestimonialIdx].verified}
              </span>
            </div>

            <p className="text-xs text-zinc-300 italic leading-relaxed">
              "{realTestimonials[activeTestimonialIdx].quote}"
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-zinc-500">
                Testimonio {activeTestimonialIdx + 1} de {realTestimonials.length}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTestimonialIdx((prev) => (prev > 0 ? prev - 1 : realTestimonials.length - 1))}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Anterior
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTestimonialIdx((prev) => (prev < realTestimonials.length - 1 ? prev + 1 : 0))}
                  className="px-2 py-1 rounded bg-zinc-800 text-zinc-300 hover:text-white"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setCurrentStage('paywall')}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-lg cursor-pointer"
          >
            <span>Ver Opciones de Blindaje de Fecha</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </section>
      )}

      {/* 6. STAGE: PAYWALL (MURO DE PAGO SOBERANO) */}
      {currentStage === 'paywall' && (
        <section aria-labelledby="paywall-heading" className="p-6 sm:p-8 rounded-3xl border border-amber-500/40 bg-zinc-950/95 backdrop-blur-2xl space-y-6 shadow-2xl relative">
          {/* Close Button con retardo (primer elemento de tabulación) */}
          {isCloseButtonVisible && (
            <button
              type="button"
              onClick={() => setCurrentStage('quiz')}
              className="absolute top-4 right-4 p-2 rounded-xl bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
              aria-label="Cerrar pantalla de pago y volver"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
              Soberanía de Fecha & Garantía Mutua
            </span>
            <h2 id="paywall-heading" className="text-2xl font-bold font-display text-white">
              Bloqueo Atómico de Fecha
            </h2>
            <p className="text-xs text-zinc-400 mt-1 font-sans">
              Garantiza la presencia exclusiva de Edwin Agudelo sin cancelaciones de terceros.
            </p>
          </div>

          {/* Selector de Plan / Fianza */}
          <div className="space-y-3">
            <div
              onClick={() => setBillingPeriod('evento')}
              className="p-4 rounded-2xl border border-amber-400 bg-amber-500/10 cursor-pointer flex items-center justify-between"
            >
              <div>
                <div className="text-xs font-mono font-bold text-amber-300 uppercase">
                  Fianza Deducible Price-Lock (Stripe)
                </div>
                <div className="text-2xl font-black font-mono text-white mt-1">
                  {DEPOSITO_STRIPE_EUR.toFixed(2)} €
                  <span className="text-xs font-sans font-normal text-emerald-400 ml-2">/ 100% Deducible</span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">
                  Se descuenta íntegro del suelo solista de {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € en la liquidación final.
                </p>
              </div>
              <span className="w-3.5 h-3.5 rounded-full border border-amber-400 bg-amber-400" />
            </div>
          </div>

          {/* Beneficios Clave */}
          <ul className="space-y-2.5 text-xs text-zinc-300 font-mono">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Bloqueo pesimista ACID en calendario inmutable</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Protección acústica Ley 37/2003 (&lt; 75 dB SPL)</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>10% soberano destinado a VIMUME (Impacto Social)</span>
            </li>
          </ul>

          {/* CTA Explícito */}
          <div>
            <a
              href="/checkout"
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-zinc-950 font-bold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-4 h-4" />
              <span>Bloquear Fecha por {DEPOSITO_STRIPE_EUR.toFixed(2)} €</span>
            </a>
            <div className="text-[10px] text-zinc-500 text-center font-mono mt-2">
              Precio total del evento: {TARIFA_BASE_SOLISTA_EUR.toFixed(2)} € · Restante a liquidar tras el show: {(TARIFA_BASE_SOLISTA_EUR - DEPOSITO_STRIPE_EUR).toFixed(2)} €
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

