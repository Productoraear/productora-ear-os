"use client";

import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { ArrowLeft, ArrowRight, Radio } from 'lucide-react';
import {
  ACG_INITIAL_STATE,
  acgReducer,
  DECISION_STEPS,
  ACG_ARTIST_OFFERS,
  type DecisionStepId,
} from '@/lib/acg/acgDecisionEngine';
import { SCLASS_12_FINCAS_HOMOLOGADAS } from '@/lib/constants/fincas-catalog';

const StageSkeleton = () => (
  <div
    className="w-full min-h-[320px] rounded-2xl border border-white/10 bg-white/[0.02] animate-pulse"
    role="status"
    aria-live="polite"
    aria-label="Cargando etapa"
  />
);

const UberRouteRadar = dynamic(() => import('./UberRouteRadar'), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

const TinderEventMatcher = dynamic(() => import('./TinderEventMatcher'), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

const AirbnbPriceLockEscrow = dynamic(() => import('./AirbnbPriceLockEscrow'), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

const BodasPlanPlanner = dynamic(() => import('./BodasPlanPlanner'), {
  ssr: false,
  loading: () => <StageSkeleton />,
});

const STEP_IDS: readonly DecisionStepId[] = ['ruta', 'match', 'espacio', 'plan'];

export default function DecisionBelt() {
  const searchParams = useSearchParams();
  const hydratedRef = useRef(false);
  const [state, dispatch] = useReducer(acgReducer, ACG_INITIAL_STATE);
  const activeStep = DECISION_STEPS[state.currentStepIndex];

  const goNext = useCallback(() => dispatch({ type: 'GO_NEXT' }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);
  const goToStep = useCallback((index: number) => dispatch({ type: 'GO_TO_STEP', payload: index }), []);

  // Hidratación funcional de deep-links del grafo semántico:
  //   /acg?finca=<id>&step=ruta|match|espacio|plan&artist=<id>
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    const fincaId = searchParams.get('finca');
    const stepParam = searchParams.get('step') as DecisionStepId | null;
    const artistId = searchParams.get('artist');

    if (fincaId) {
      const finca = SCLASS_12_FINCAS_HOMOLOGADAS.find(
        (f) => f.id === fincaId || f.slug === fincaId,
      );
      if (finca) {
        dispatch({
          type: 'SELECT_FINCA',
          payload: {
            fincaId: finca.id,
            province: finca.provincia,
            distanceKm: finca.distanciaHubMentridaKm,
          },
        });
      }
    }

    if (artistId && ACG_ARTIST_OFFERS.some((a) => a.id === artistId)) {
      dispatch({ type: 'SELECT_ARTIST', payload: artistId });
    }

    if (stepParam && STEP_IDS.includes(stepParam)) {
      const stepIndex = STEP_IDS.indexOf(stepParam);
      dispatch({ type: 'GO_TO_STEP', payload: stepIndex });
    }
  }, [searchParams]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement) {
        return;
      }
      if (event.key === 'ArrowRight') {
        goNext();
      } else if (event.key === 'ArrowLeft') {
        goBack();
      } else if (event.key === ' ') {
        event.preventDefault();
        if (state.currentStepIndex < DECISION_STEPS.length - 1) goNext();
      } else if (['1', '2', '3', '4'].includes(event.key)) {
        goToStep(Number(event.key) - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goNext, goBack, goToStep, state.currentStepIndex]);

  const renderActiveStage = () => {
    switch (activeStep.id) {
      case 'ruta':
        return <UberRouteRadar state={state} dispatch={dispatch} />;
      case 'match':
        return <TinderEventMatcher state={state} dispatch={dispatch} />;
      case 'espacio':
        return <AirbnbPriceLockEscrow state={state} dispatch={dispatch} />;
      case 'plan':
        return <BodasPlanPlanner state={state} />;
      default:
        return null;
    }
  };

  const isFirstStep = state.currentStepIndex === 0;
  const isLastStep = state.currentStepIndex === DECISION_STEPS.length - 1;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Cabecera telemetría */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-[#ecb613] animate-pulse" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Autonomous Commerce Grid · Cinta de Decisión</span>
          </div>
          <h1 className="font-syne text-3xl md:text-5xl font-black tracking-tighter text-white mt-2">
            Reserva directa en <span style={{ color: activeStep.accent }}>60 segundos</span>.
          </h1>
        </div>
        <div
          className="flex items-center gap-3 font-mono text-[10px] text-white/40 uppercase tracking-widest"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
            Paso {state.currentStepIndex + 1}/{DECISION_STEPS.length}
          </span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: activeStep.accent }}>
            {activeStep.nickname} Layer
          </span>
        </div>
      </div>

      {/* Barra de progreso interactiva */}
      <nav
        role="navigation"
        aria-label="Progreso de la reserva"
        className="flex items-center gap-2 mb-10"
      >
        {DECISION_STEPS.map((step) => {
          const isActive = step.id === activeStep.id;
          const isCompleted = step.index < state.currentStepIndex;
          const stepStatus = isCompleted ? 'completada' : isActive ? 'actual' : 'pendiente';
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(step.index)}
              className="flex-1 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305] rounded-lg"
              aria-label={`Ir a etapa ${step.label} (${stepStatus})`}
              aria-current={isActive ? 'step' : undefined}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black transition-all"
                  style={{
                    backgroundColor: isActive || isCompleted ? step.accent : 'rgba(255,255,255,0.05)',
                    color: isActive || isCompleted ? '#030305' : 'rgba(255,255,255,0.45)',
                  }}
                  aria-hidden="true"
                >
                  {isCompleted ? '✓' : step.index + 1}
                </span>
                <span
                  className="font-mono text-[10px] uppercase tracking-widest transition-colors"
                  style={{ color: isActive ? step.accent : 'rgba(255,255,255,0.45)' }}
                >
                  {step.label}
                </span>
              </div>
              <div
                className="h-1 rounded-full bg-white/10 overflow-hidden"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={isCompleted ? 100 : isActive ? 60 : 0}
                aria-label={`Progreso etapa ${step.label}`}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: isCompleted ? '100%' : isActive ? '60%' : '0%',
                    backgroundColor: step.accent,
                  }}
                />
              </div>
            </button>
          );
        })}
      </nav>

      {/* Etapa activa */}
      <section
        className="mb-8"
        aria-label={`Etapa activa: ${activeStep.label}`}
        aria-live="polite"
      >
        {renderActiveStage()}
      </section>

      {/* Navegación inferior */}
      <div
        className="flex items-center justify-between border-t border-white/10 pt-6"
        role="group"
        aria-label="Navegación entre etapas"
      >
        <button
          type="button"
          onClick={goBack}
          disabled={isFirstStep}
          aria-label="Ir a la etapa anterior"
          aria-disabled={isFirstStep}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2 font-mono text-xs uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
        >
          <ArrowLeft size={14} aria-hidden="true" /> Anterior
        </button>

        <p className="hidden md:block font-mono text-[10px] text-white/30 uppercase tracking-widest" aria-hidden="true">
          Teclado: ← → · 1–4 · Espacio
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={isLastStep}
          aria-label="Ir a la siguiente etapa"
          aria-disabled={isLastStep}
          className="px-5 py-3 rounded-xl text-black font-mono text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#030305]"
          style={{ backgroundColor: activeStep.accent }}
        >
          Siguiente <ArrowRight size={14} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}