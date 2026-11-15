'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  ArrowRight,
  FileText,
  CreditCard,
  Lock,
  Sparkles,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import {
  ProviderProfileCategoryEnum,
  type ProviderProfileCategory,
} from '@/lib/providers/trojan-horse-schema';
import {
  TrojanOnboardingFormSchema,
  type TrojanOnboardingFormData,
} from '@/lib/providers/trojan-onboarding-validator';
import { SovereignWhatsAppButton } from '@/components/shared/SovereignWhatsAppButton';

const CATEGORY_NAMES: Record<ProviderProfileCategory, string> = {
  FINCA_ALQUILER: 'Fincas & Espacios para Eventos',
  RESTAURANTE_BODA: 'Restaurantes para Banquetes',
  CATERING_BODA: 'Catering & Gastronomía Móvil',
  MUSICA_DIRECTO: 'Música en Directo & Artistas',
  FOTOGRAFIA_VIDEO: 'Fotografía & Cinematografía',
  FLORISTERIA_DECORACION: 'Floristería & Ambientación',
  WEDDING_PLANNER: 'Wedding Planner & Protocolo',
  SERVICIOS_COMPLEMENTARIOS: 'Animación, Sonido & Auxiliares',
};

interface TrojanOnboardingModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onRegistered: (slug: string, name: string, category: ProviderProfileCategory) => void;
}

export function TrojanOnboardingModal({
  isOpen,
  onClose,
  onRegistered,
}: TrojanOnboardingModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<TrojanOnboardingFormData>>({
    membershipTier: 'CLAIMED_PRO',
    category: 'FINCA_ALQUILER',
    acceptsAntiFraudPolicy: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleNextStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.businessName?.trim()) newErrors.businessName = 'Indica el nombre de tu marca o empresa';
    if (!formData.providerSlug?.trim()) {
      newErrors.providerSlug = 'Define el identificador único';
    } else if (!/^[a-z0-9-]+$/.test(formData.providerSlug)) {
      newErrors.providerSlug = 'Solo letras minúsculas, números y guiones';
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  };

  const handleNextStep2 = () => {
    const parseResult = TrojanOnboardingFormSchema.safeParse({
      ...formData,
      acceptsAntiFraudPolicy: true,
    });

    if (!parseResult.success) {
      const errMap: Record<string, string> = {};
      parseResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[String(issue.path[0])] = issue.message;
      });
      setErrors(errMap);
      return;
    }
    setErrors({});
    setStep(3);
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Éxito de validación canónica: se notifica al cockpit
      onRegistered(
        formData.providerSlug || 'nuevo-proveedor',
        formData.businessName || 'Proveedor Homologado',
        formData.category || 'FINCA_ALQUILER',
      );
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#09090d] border border-[#ecb613]/30 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
        
        {/* Cabecera del Onboarding */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ecb613]/10 border border-[#ecb613]/30 rounded-full text-[#ecb613] text-[10px] font-mono uppercase tracking-widest font-bold mb-2">
              <Sparkles size={12} />
              Caballo de Troya · Absorbedor de Fichas
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-syne uppercase">
              Alta e Ingesta de Proveedor S-Class
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Paso {step} de 3 · Equivalencia de campos de Bodas.net y blindaje de liquidaciones.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-lg font-mono p-1"
          >
            ✕
          </button>
        </div>

        {/* PASO 1: IDENTIDAD Y GREMIO */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                1. Gremio / Especialidad de Catálogo
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as ProviderProfileCategory })
                }
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white font-mono focus:border-[#ecb613] outline-none"
              >
                {(Object.keys(CATEGORY_NAMES) as ProviderProfileCategory[]).map((cat) => (
                  <option key={cat} value={cat}>
                    {CATEGORY_NAMES[cat]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                2. Nombre Comercial del Proveedor o Finca
              </label>
              <input
                type="text"
                placeholder="Ej. Restaurante Otzarreta, Cuarteto Sonata..."
                value={formData.businessName || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const autoSlug = val
                    .toLowerCase()
                    .normalize('NFD')
                    .replace(/[\u0300-\u036f]/g, '')
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)+/g, '');
                  setFormData({ ...formData, businessName: val, providerSlug: autoSlug });
                }}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
              />
              {errors.businessName && <p className="text-[11px] text-[#FF2B44] mt-1">{errors.businessName}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                3. Identificador de URL Soberana (Slug)
              </label>
              <div className="flex items-center bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-zinc-500">
                <span>productoraear.com/proveedores/</span>
                <input
                  type="text"
                  value={formData.providerSlug || ''}
                  onChange={(e) => setFormData({ ...formData, providerSlug: e.target.value.toLowerCase() })}
                  className="bg-transparent text-white focus:outline-none flex-1 ml-1"
                />
              </div>
              {errors.providerSlug && <p className="text-[11px] text-[#FF2B44] mt-1">{errors.providerSlug}</p>}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <SovereignWhatsAppButton
                category="Asistencia Onboarding Proveedores"
                message="Hola centralita EAR OS, soy un proveedor y necesito que el Call Center vuelque mi ficha de Bodas.net por mí."
                className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300"
              >
                <span>¿No tienes tiempo? Volcado por Call Center</span>
              </SovereignWhatsAppButton>

              <button
                type="button"
                onClick={handleNextStep1}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
              >
                <span>Siguiente: Datos Fiscales</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* PASO 2: BLINDAJE FISCAL Y BANCARIO (MÓDULO 23 + MÓDULO 97) */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs leading-relaxed flex items-center gap-3">
              <ShieldCheck size={20} className="shrink-0 text-amber-400" />
              <span>
                Validación matemática estricta: DNI/CIF comprobado por <strong>Módulo 23</strong> y cuenta de abono por <strong>ISO 13616 Módulo 97 BigInt</strong> para impedir retenciones de pasarela.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  CIF / NIF de Facturación (AEAT)
                </label>
                <input
                  type="text"
                  placeholder="Ej. B45168005 o 03876543A"
                  value={formData.cifNif || ''}
                  onChange={(e) => setFormData({ ...formData, cifNif: e.target.value.toUpperCase() })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono uppercase"
                />
                {errors.cifNif && <p className="text-[11px] text-[#FF2B44] mt-1">{errors.cifNif}</p>}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Teléfono de Coordinación (Contact-Gate)
                </label>
                <input
                  type="text"
                  placeholder="+34600112233"
                  value={formData.contactPhone || ''}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono"
                />
                {errors.contactPhone && <p className="text-[11px] text-[#FF2B44] mt-1">{errors.contactPhone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                IBAN Bancario de Liquidación Directa
              </label>
              <input
                type="text"
                placeholder="ES00 0000 0000 0000 0000 0000"
                value={formData.billingIban || ''}
                onChange={(e) => setFormData({ ...formData, billingIban: e.target.value.toUpperCase() })}
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:border-[#ecb613] outline-none font-mono uppercase"
              />
              {errors.billingIban && <p className="text-[11px] text-[#FF2B44] mt-1">{errors.billingIban}</p>}
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                ← Volver al paso 1
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-bold text-xs font-mono uppercase tracking-wider transition-all"
              >
                <span>Siguiente: Modelo Comercial</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {/* PASO 3: MODELO COMERCIAL (SPLIT 80/10/10 vs 100% NETO SOCIO) */}
        {step === 3 && (
          <div className="space-y-6">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400">
              Seleccionar Modalidad de Liquidación
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Opción 1: Open Free */}
              <div
                onClick={() => setFormData({ ...formData, membershipTier: 'CLAIMED_PRO' })}
                className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                  formData.membershipTier === 'CLAIMED_PRO'
                    ? 'border-[#00E5FF] bg-[#00E5FF]/10 ring-1 ring-[#00E5FF]/40'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#00E5FF]">Modalidad Abierta</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white">0 € Cuota</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">Split Soberano 80/10/10</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  80% neto directo para ti en cada contratación, 10% para la plataforma EAR OS y 10% destinado al retorno social VIMUME (desgravable).
                </p>
              </div>

              {/* Opción 2: Socio Fundador */}
              <div
                onClick={() => setFormData({ ...formData, membershipTier: 'SOVEREIGN_FOUNDER' })}
                className={`cursor-pointer rounded-2xl p-5 border transition-all ${
                  formData.membershipTier === 'SOVEREIGN_FOUNDER'
                    ? 'border-[#ecb613] bg-[#ecb613]/10 ring-1 ring-[#ecb613]/40'
                    : 'border-white/10 bg-black/40 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono uppercase font-bold text-[#ecb613]">Socio Fundador VIP</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#ecb613]/20 text-[#ecb613]">100% Neto</span>
                </div>
                <h4 className="text-base font-bold text-white mb-2">0% Comisión de Intermediación</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Cuota anual fija de suscripción equiparada a Bodas.net. Cero comisiones: el 100% del importe liquidado va íntegro a tu cuenta bancaria.
                </p>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
              <input
                type="checkbox"
                id="anti-fraud-check"
                checked={!!formData.acceptsAntiFraudPolicy}
                onChange={(e) => setFormData({ ...formData, acceptsAntiFraudPolicy: e.target.checked as true })}
                className="mt-1 rounded border-zinc-700 text-[#ecb613] focus:ring-0"
              />
              <label htmlFor="anti-fraud-check" className="text-xs text-zinc-300 leading-relaxed cursor-pointer">
                Declaro bajo mi responsabilidad que los datos introducidos corresponden al titular legítimo de la actividad y acepto el protocolo de depósito vinculante de 100 € regulado por el Art. 1255 del Código Civil.
              </label>
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                ← Volver a datos fiscales
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting || !formData.acceptsAntiFraudPolicy}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#ecb613] hover:bg-[#ffd24d] text-black font-extrabold text-xs font-mono uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(236,182,19,0.35)] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Verificando con Hacienda...' : 'Activar Centro de Mando'}</span>
                <CheckCircle2 size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
