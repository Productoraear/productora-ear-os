"use client";

import React, { useReducer, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Radio } from 'lucide-react';
import {
  ACG_INITIAL_STATE,
  acgReducer,
  DECISION_STEPS,
} from '@/lib/acg/acgDecisionEngine';
import UberRouteRadar from './UberRouteRadar';
import TinderEventMatcher from './TinderEventMatcher';
import AirbnbPriceLockEscrow from './AirbnbPriceLockEscrow';
import BodasPlanPlanner from './BodasPlanPlanner';

export default function DecisionBelt() {
  const [state, dispatch] = useReducer(acgReducer, ACG_INITIAL_STATE);
  const activeStep = DECISION_STEPS[state.currentStepIndex];

  const goNext = useCallback(() => dispatch({ type: 'GO_NEXT' }), []);
  const goBack = useCallback(() => dispatch({ type: 'GO_BACK' }), []);
  const goToStep = useCallback((index: number) => dispatch({ type: 'GO_TO_STEP', payload: index }), []);

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

  return (
    <div className="w-full overflow-x-hidden">
      {/* Cabecera telemetría */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Radio size={15} className="text-[#ecb613] animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">Autonomous Commerce Grid · Cinta de Decisión</span>
          </div>
          <h1 className="font-syne text-3xl md:text-5xl font-black tracking-tighter text-white mt-2">
            Reserva directa en <span style={{ color: activeStep.accent }}>60 segundos</span>.
          </h1>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10px] text-white/40 uppercase tracking-widest">
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">Paso {state.currentStepIndex + 1}/{DECISION_STEPS.length}</span>
          <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10" style={{ color: activeStep.accent }}>
            {activeStep.nickname} Layer
          </span>
        </div>
      </div>

      {/* Barra de progreso interactiva */}
      <div className="flex items-center gap-2 mb-10">
        {DECISION_STEPS.map((step) => {
          const isActive = step.id === activeStep.id;
          const isCompleted = step.index < state.currentStepIndex;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => goToStep(step.index)}
              className="flex-1 text-left group"
              aria-label={`Ir a etapa ${step.label}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-mono text-xs font-black transition-all"
                  style={{
                    backgroundColor: isActive || isCompleted ? step.accent : 'rgba(255,255,255,0.05)',
                    color: isActive || isCompleted ? '#030305' : 'rgba(255,255,255,0.45)',
                  }}
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
              <div className="h-1 rounded-full bg-white/10 overflow-hidden">
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
      </div>

      {/* Etapa activa */}
      <div className="mb-8">{renderActiveStage()}</div>

      {/* Navegación inferior */}
      <div className="flex items-center justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={goBack}
          disabled={state.currentStepIndex === 0}
          className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 disabled:opacity-30 flex items-center gap-2 font-mono text-xs uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Anterior
        </button>

        <p className="hidden md:block font-mono text-[10px] text-white/30 uppercase tracking-widest">
          Teclado: ← → · 1–4 · Espacio
        </p>

        <button
          type="button"
          onClick={goNext}
          disabled={state.currentStepIndex === DECISION_STEPS.length - 1}
          className="px-5 py-3 rounded-xl text-black font-mono text-xs uppercase tracking-widest flex items-center gap-2 disabled:opacity-30"
          style={{ backgroundColor: activeStep.accent }}
        >
          Siguiente <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}