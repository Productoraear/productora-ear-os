"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Sparkles, HeartHandshake, CheckCircle2 } from "lucide-react";

export interface StoryPayload {
  protagonists: string;
  howTheyMet: string;
  anecdote: string;
  promise: string;
  eventDate: string;
  dedication: string;
}

interface StoryFormProps {
  onSubmit: (payload: StoryPayload) => void;
}

interface StepDefinition {
  id: keyof StoryPayload;
  label: string;
  eyebrow: string;
  placeholder: string;
  hint: string;
  inputType: "textarea" | "input" | "date";
}

const STEPS: StepDefinition[] = [
  {
    id: "protagonists",
    label: "¿Quiénes son los protagonistas?",
    eyebrow: "PASO 01",
    placeholder: "Ej: Lucía y Daniel",
    hint: "Los nombres que brillarán en la letra y la dedicatoria.",
    inputType: "input",
  },
  {
    id: "howTheyMet",
    label: "¿Dónde y cómo se conocieron?",
    eyebrow: "PASO 02",
    placeholder: "Ej: En una feria de Méntrida, una tarde de agosto…",
    hint: "El origen exacto de vuestra historia.",
    inputType: "textarea",
  },
  {
    id: "anecdote",
    label: "Su anécdota más divertida o especial",
    eyebrow: "PASO 03",
    placeholder: "Ej: El día que se perdió el ramo y acabó en el olivo del patio…",
    hint: "Ese momento que nadie olvida y todos celebran.",
    inputType: "textarea",
  },
  {
    id: "promise",
    label: "La frase o promesa que jamás olvidan",
    eyebrow: "PASO 04",
    placeholder: "Ej: Siempre bailar bajo la lluvia.",
    hint: "La promesa que se convierte en estribillo.",
    inputType: "input",
  },
  {
    id: "eventDate",
    label: "Fecha del evento y dedicatoria",
    eyebrow: "PASO 05",
    placeholder: "Fecha del evento",
    hint: "El día exacto en que la canción sonará en directo.",
    inputType: "date",
  },
];

export default function StoryForm({ onSubmit }: StoryFormProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState<StoryPayload>({
    protagonists: "",
    howTheyMet: "",
    anecdote: "",
    promise: "",
    eventDate: "",
    dedication: "",
  });
  const [error, setError] = useState<string | null>(null);

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const totalSteps = STEPS.length;
  const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

  const updateField = (id: keyof StoryPayload, value: string) => {
    setForm((prev) => ({ ...prev, [id]: value }));
    if (error) setError(null);
  };

  const validateCurrentField = (): boolean => {
    const value = form[currentStep.id].trim();
    if (!value) {
      setError("Este campo es imprescindible para tejer vuestra historia.");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentField()) return;
    setDirection(1);

    if (isLastStep) {
      if (!form.dedication.trim()) {
        setError("Añade una dedicatoria final antes de continuar.");
        return;
      }
      onSubmit({
        ...form,
        protagonists: form.protagonists.trim(),
        howTheyMet: form.howTheyMet.trim(),
        anecdote: form.anecdote.trim(),
        promise: form.promise.trim(),
        eventDate: form.eventDate,
        dedication: form.dedication.trim(),
      });
      return;
    }

    setStepIndex((prev) => Math.min(prev + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setDirection(-1);
    setError(null);
    setStepIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && currentStep.inputType !== "textarea") {
      event.preventDefault();
      handleNext();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Barra de progreso superior */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase tracking-wider text-[#ecb613]">
            {currentStep.eyebrow} / 05
          </span>
          <span className="text-xs font-mono text-zinc-500">{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#1A1A24] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#ecb613] to-[#d9a40e] rounded-full"
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Pasos animados */}
      <div className="relative min-h-[320px]">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={stepIndex}
            custom={direction}
            initial={{ opacity: 0, x: direction * 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -32 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="p-6 sm:p-8 rounded-2xl border border-[#1A1A24] bg-[#09090F]"
          >
            <div className="flex items-start gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30">
                {isLastStep ? (
                  <HeartHandshake className="w-5 h-5 text-[#ecb613]" />
                ) : (
                  <Sparkles className="w-5 h-5 text-[#ecb613]" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white leading-tight">{currentStep.label}</h2>
                <p className="text-sm text-zinc-400 mt-1">{currentStep.hint}</p>
              </div>
            </div>

            {stepIndex === STEPS.length - 1 ? (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Fecha del evento
                  </label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => updateField("eventDate", e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white focus:outline-none focus:border-[#ecb613] [color-scheme:dark]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                    Dedicatoria final
                  </label>
                  <textarea
                    rows={4}
                    value={form.dedication}
                    onChange={(e) => updateField("dedication", e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ej: Para los que hicieron de una casualidad un destino…"
                    className="w-full px-4 py-3 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] resize-none"
                  />
                </div>
              </div>
            ) : currentStep.inputType === "textarea" ? (
              <textarea
                rows={5}
                value={form[currentStep.id]}
                onChange={(e) => updateField(currentStep.id, e.target.value)}
                placeholder={currentStep.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613] resize-none"
              />
            ) : (
              <input
                type="text"
                value={form[currentStep.id]}
                onChange={(e) => updateField(currentStep.id, e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={currentStep.placeholder}
                className="w-full px-4 py-3 rounded-lg border border-[#262638] bg-[#050507] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#ecb613]"
              />
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 text-sm text-[#FF2B44] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {error}
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegación */}
      <div className="flex items-center justify-between mt-6 gap-4">
        <button
          type="button"
          onClick={handleBack}
          disabled={stepIndex === 0}
          className="px-5 py-3 rounded-lg border border-[#262638] bg-[#09090F] text-sm font-medium text-zinc-300 hover:border-zinc-500 transition-all flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4" />
          Atrás
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#ecb613] to-[#d9a40e] text-[#050507] font-bold text-sm tracking-wide transition-all shadow-lg shadow-[#ecb613]/20 hover:opacity-95 flex items-center gap-2"
        >
          {isLastStep ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Generar mi canción
            </>
          ) : (
            <>
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}