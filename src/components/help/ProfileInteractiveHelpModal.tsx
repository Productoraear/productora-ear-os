"use client";

import React, { useState, useEffect } from "react";
import {
  HelpCircle,
  X,
  Copy,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  FileCheck,
  Zap,
  Volume2,
  Camera,
  Award,
  ExternalLink,
} from "lucide-react";
import {
  TARIFA_BASE_SOLISTA_EUR,
  DEPOSITO_STRIPE_EUR,
  LIMITE_SPL_DB,
  WATTS_PER_PAX,
  CENTRALITA_EAR_OS,
} from "../../lib/constants/ear-os-ssot";

export interface SClassProfileField {
  key: string;
  label: string;
  required: boolean;
  present: boolean;
  value?: unknown;
}

export interface ProfileCompletenessReport {
  totalFields: number;
  completedFields: number;
  percentage: number;
  isSClassCertified: boolean;
  missingFields: string[];
  fields: SClassProfileField[];
}

export interface CertifiedSClassProfileData {
  id: string;
  legalName: string;
  tradeName: string;
  nif: string;
  verifiedPhone: string;
  officialWhatsApp: string;
  bioSClass: string;
  baseTariffEur: number;
  depositAcceptedEur: number;
  audioRider: {
    brand: string;
    wattsPerPax: number;
    maxSplDb: number;
  };
  powerConnection: "CETAC_32A" | "CETAC_16A" | "SCHUKO_16A";
  hubLocation: {
    address: string;
    municipio: string;
    provincia: string;
    kmFromMentrida: number;
  };
  gallery4kUrls: string[];
  liveVideoUrls: string[];
  civilLiabilityInsuranceEur: number;
  split80_10_10Accepted: boolean;
  faqs?: Array<{ question: string; answer: string }>;
}

/**
 * Pure evaluator for S-Class 10-point completeness criteria.
 */
export function evaluateProfileCompleteness(
  profile: Partial<CertifiedSClassProfileData>
): ProfileCompletenessReport {
  const requiredChecks: Array<{
    key: keyof CertifiedSClassProfileData;
    label: string;
    validator: (val: unknown) => boolean;
  }> = [
    {
      key: "verifiedPhone",
      label: "Teléfono Verificado 24/7",
      validator: (v) => typeof v === "string" && v.trim().length >= 9,
    },
    {
      key: "officialWhatsApp",
      label: "Canal Oficial WhatsApp",
      validator: (v) => typeof v === "string" && v.startsWith("+"),
    },
    {
      key: "bioSClass",
      label: "Biografía Homologada S-Class",
      validator: (v) => typeof v === "string" && v.length >= 50,
    },
    {
      key: "baseTariffEur",
      label: "Tarifa Base Oficial (≥ 350 €)",
      validator: (v) => typeof v === "number" && v >= 350,
    },
    {
      key: "depositAcceptedEur",
      label: "Depósito Price-Lock (100 €)",
      validator: (v) => v === 100,
    },
    {
      key: "audioRider",
      label: "Rider Acústico Certificado (12 W/pax, ≤ 75 dB)",
      validator: (v) =>
        typeof v === "object" &&
        v !== null &&
        (v as { maxSplDb: number }).maxSplDb <= 75,
    },
    {
      key: "powerConnection",
      label: "Acometida Eléctrica CETAC/Schuko",
      validator: (v) =>
        typeof v === "string" &&
        ["CETAC_32A", "CETAC_16A", "SCHUKO_16A"].includes(v),
    },
    {
      key: "hubLocation",
      label: "Ubicación GPS y Km desde Méntrida",
      validator: (v) => typeof v === "object" && v !== null,
    },
    {
      key: "gallery4kUrls",
      label: "Galería Fotográfica 4K en Fincas",
      validator: (v) => Array.isArray(v) && v.length >= 3,
    },
    {
      key: "civilLiabilityInsuranceEur",
      label: "Póliza de Responsabilidad Civil (≥ 300.000 €)",
      validator: (v) => typeof v === "number" && v >= 300000,
    },
  ];

  const missingFields: string[] = [];
  const fields: SClassProfileField[] = [];
  let completedCount = 0;

  for (const c of requiredChecks) {
    const val = profile[c.key];
    const isPresent = c.validator(val);
    if (isPresent) {
      completedCount++;
    } else {
      missingFields.push(c.label);
    }
    fields.push({
      key: String(c.key),
      label: c.label,
      required: true,
      present: isPresent,
      value: val,
    });
  }

  const percentage = Math.round((completedCount / requiredChecks.length) * 100);
  const isSClassCertified = percentage === 100;

  return {
    totalFields: requiredChecks.length,
    completedFields: completedCount,
    percentage,
    isSClassCertified,
    missingFields,
    fields,
  };
}

/**
 * Generates canonical S-Class Certified Data ready to take any profile to 100%.
 */
export function generateCertifiedSClassProfile(
  entityId: string = "artist:edwin-agudelo"
): CertifiedSClassProfileData {
  return {
    id: entityId,
    legalName: "Edwin Agudelo Soler • Productora EAR",
    tradeName: "Edwin Agudelo Tenor Solista",
    nif: "03123456K",
    verifiedPhone: CENTRALITA_EAR_OS,
    officialWhatsApp: "+34693693048",
    bioSClass:
      "Tenor lírico solista y director artístico de Productora EAR. Especialista en galas de ópera, canción lírica, mariachi sinfónico de gala y protocolos acústicos VIMUME 40 Hz para bodas exclusivas y fincas de élite.",
    baseTariffEur: TARIFA_BASE_SOLISTA_EUR,
    depositAcceptedEur: DEPOSITO_STRIPE_EUR,
    audioRider: {
      brand: "Bose F1 Model 812 + Subwoofer",
      wattsPerPax: WATTS_PER_PAX,
      maxSplDb: LIMITE_SPL_DB,
    },
    powerConnection: "CETAC_32A",
    hubLocation: {
      address: "Hub Operativo Central Méntrida",
      municipio: "Méntrida",
      provincia: "Toledo",
      kmFromMentrida: 0,
    },
    gallery4kUrls: [
      "https://productoraear.com/media/edwin-agudelo-villa-escorial-4k.webp",
      "https://productoraear.com/media/edwin-agudelo-ezkertza-gala-4k.webp",
      "https://productoraear.com/media/edwin-agudelo-bose-f1-rider-4k.webp",
    ],
    liveVideoUrls: [
      "https://productoraear.com/media/edwin-agudelo-el-rey-directo-acustico.mp4",
      "https://productoraear.com/media/edwin-agudelo-nessun-dorma-gala.mp4",
    ],
    civilLiabilityInsuranceEur: 600000,
    split80_10_10Accepted: true,
    faqs: [
      {
        question: "¿Cómo se formaliza el bloqueo de fecha?",
        answer:
          "Mediante depósito de 100,00 € procesado con Stripe Price-Lock SHA-256, 100% deducible de la liquidación final del evento.",
      },
      {
        question: "¿Cumple el equipo con la normativa de ruido de fincas históricas?",
        answer:
          "Sí, todo el equipamiento Bose opera calibrado por debajo de 75 dB SPL con 12 W/pax y limitador telemático homologado Cesva según Ley 37/2003.",
      },
      {
        question: "¿Cuál es el punto de partida para el cálculo de kilometraje?",
        answer:
          "Sede logística Méntrida (Toledo). Los primeros 50 km están exentos; posteriormente aplica la tarifa canónica de 1,50 €/km.",
      },
    ],
  };
}

export interface ProfileInteractiveHelpModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  currentProfile?: Partial<CertifiedSClassProfileData>;
  onAutoComplete?: (completedData: CertifiedSClassProfileData) => void;
  showTriggerButton?: boolean;
  triggerClassName?: string;
  entityId?: string;
  entityName?: string;
}

export function ProfileInteractiveHelpModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  currentProfile,
  onAutoComplete,
  showTriggerButton = true,
  triggerClassName = "",
  entityId = "artist:edwin-agudelo",
  entityName = "Escaparate S-Class Pro",
}: ProfileInteractiveHelpModalProps) {
  // Modal open/close state
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen ?? internalIsOpen;

  const handleOpen = () => {
    setInternalIsOpen(true);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    controlledOnClose?.();
  };

  // Profile data & completeness evaluation
  const [activeProfile, setActiveProfile] = useState<Partial<CertifiedSClassProfileData>>(() => {
    // Default draft profile at 80% if not provided
    if (currentProfile && Object.keys(currentProfile).length > 0) {
      return currentProfile;
    }
    return {
      verifiedPhone: CENTRALITA_EAR_OS,
      officialWhatsApp: "+34693693048",
      bioSClass:
        "Música en directo de alta fidelidad para bodas exclusivas y fincas de élite en Madrid y Toledo.",
      baseTariffEur: 350,
      depositAcceptedEur: 100,
      audioRider: {
        brand: "Bose F1 Model 812",
        wattsPerPax: 12,
        maxSplDb: 75,
      },
      powerConnection: "CETAC_32A",
      hubLocation: {
        address: "Camino de Méntrida a Aldea del Fresno",
        municipio: "Méntrida",
        provincia: "Toledo",
        kmFromMentrida: 0,
      },
      // Missing 4K gallery & RC insurance initially (80%)
    };
  });

  // Keep in sync when parent passes updated currentProfile
  useEffect(() => {
    if (currentProfile && Object.keys(currentProfile).length > 0) {
      setActiveProfile(currentProfile);
    }
  }, [currentProfile]);

  const report = evaluateProfileCompleteness(activeProfile);

  // Copy feedback
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const [autoCompleteSuccess, setAutoCompleteSuccess] = useState(false);

  // 1-Click Action: Copy Canonical Template
  const handleCopyTemplate = () => {
    const template = generateCertifiedSClassProfile(entityId);
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(template, null, 2));
      setCopiedTemplate(true);
      setTimeout(() => setCopiedTemplate(false), 2500);
    }
  };

  // 1-Click Action: Auto-complete profile to 100% and save
  const handleAutoCompleteAndSave = () => {
    setIsAutoCompleting(true);
    const certified = generateCertifiedSClassProfile(entityId);
    const merged: CertifiedSClassProfileData = {
      ...activeProfile,
      ...certified,
      id: entityId,
    };

    // Update internal state
    setActiveProfile(merged);
    setAutoCompleteSuccess(true);
    setIsAutoCompleting(false);

    // Emit to parent component
    onAutoComplete?.(merged);

    // Persist to local storage
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`ear_sclass_profile_${entityId}`, JSON.stringify(merged));
        localStorage.setItem("ear_sclass_escaparate_completed", "true");
      } catch {
        // Safe fallback
      }
    }

    setTimeout(() => {
      setAutoCompleteSuccess(false);
    }, 3500);
  };

  return (
    <>
      {/* Prominent '?' Trigger Button with Amber Glow */}
      {showTriggerButton && (
        <button
          type="button"
          onClick={handleOpen}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-label="Abrir Guía de Acreditación S-Class y Ayuda Interactiva"
          title="Guía de Acreditación S-Class Gold Master y Ayuda Interactiva"
          className={`relative group inline-flex items-center justify-center w-10 h-10 min-h-[40px] min-w-[40px] rounded-xl bg-[#ecb613]/10 hover:bg-[#ecb613]/20 border border-[#ecb613]/40 text-[#ecb613] hover:text-white transition shadow-[0_0_15px_rgba(236,182,19,0.25)] hover:shadow-[0_0_25px_rgba(236,182,19,0.45)] ${triggerClassName}`}
        >
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ecb613] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ecb613]" />
          <HelpCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      )}

      {/* Modal Backdrop & Dialog */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-sclass-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[#ecb613]/40 bg-[#060609] text-white shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Amber Glow Bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ecb613] to-transparent" />

            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 border-b border-zinc-800/80 bg-[#08080c]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 flex items-center justify-center text-[#ecb613] shadow-inner shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2
                      id="modal-sclass-title"
                      className="text-lg font-bold font-['Syne'] text-white tracking-tight"
                    >
                      Guía de Acreditación S-Class Gold Master
                    </h2>
                    {report.isSClassCertified && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold uppercase tracking-wider">
                        CERTIFICADO 100%
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-['Inter'] mt-0.5">
                    Requisitos técnicos y checklist de homologación para {entityName}.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Cerrar modal de ayuda"
                className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-700/60 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
              {/* Progress & Certification Status Bar */}
              <div className="p-4 rounded-xl border border-zinc-800 bg-[#030305] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-zinc-400 uppercase tracking-wider">
                      Estado de Homologación:
                    </span>
                    <strong
                      className={`font-mono text-sm ${
                        report.isSClassCertified ? "text-emerald-400" : "text-[#ecb613]"
                      }`}
                    >
                      {report.percentage}% Completado
                    </strong>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {report.completedFields} de {report.totalFields} criterios S-Class
                  </span>
                </div>

                <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      report.isSClassCertified
                        ? "bg-gradient-to-r from-[#ecb613] via-emerald-400 to-emerald-300"
                        : "bg-gradient-to-r from-amber-500 to-[#ecb613]"
                    }`}
                    style={{ width: `${report.percentage}%` }}
                  />
                </div>

                {report.isSClassCertified ? (
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 flex items-center gap-2.5 text-xs text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>S_CLASS_GOLD_MASTER Desbloqueado:</strong> Tu perfil cumple el 100% de los estándares canónicos de Productora EAR.
                    </span>
                  </div>
                ) : (
                  <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-between">
                    <span>Faltan {report.missingFields.length} campos obligatorios para el 100%</span>
                    <span className="text-amber-400">Objetivo: 100% S-Class</span>
                  </div>
                )}
              </div>

              {/* S-Class Accreditation Guide: 5 Mandatory Technical Specs */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
                  <FileCheck className="w-3.5 h-3.5 text-[#ecb613]" />
                  Especificaciones Técnicas Obligatorias (Normativa S-Class)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <ShieldCheck className="w-4 h-4 text-[#ecb613]" />
                      Póliza de Responsabilidad Civil
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Cobertura mínima obligatoria ≥ 300.000 € en vigor para cubrir cualquier imprevisto en recinto o finca.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <Volume2 className="w-4 h-4 text-emerald-400" />
                      Sonometría Legal Ley 37/2003
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Límite de salud pública &lt; 75 dB SPL con limitador telemático Cesva y 12 W/pax sin fatiga auditiva.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <Zap className="w-4 h-4 text-[#00E5FF]" />
                      Acometida CETAC 32A / 16A
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Conexión eléctrica trifásica normalizada o monofásica Schuko protegida con tierra de baja impedancia.
                    </p>
                  </div>

                  <div className="p-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 space-y-1">
                    <div className="flex items-center gap-2 text-zinc-200 font-semibold">
                      <Camera className="w-4 h-4 text-purple-400" />
                      Galería Fotográfica 4K
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">
                      Mínimo 3 fotografías reales en alta resolución en fincas colaboradoras y directos acústicos sin autotune.
                    </p>
                  </div>
                </div>
              </div>

              {/* Missing Fields Checklist */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center justify-between">
                  <span>Auditoría de Campos del Perfil (10 Requisitos)</span>
                  <span className="text-[10px] text-zinc-400">
                    {report.missingFields.length === 0 ? "Todo completado" : `${report.missingFields.length} pendientes`}
                  </span>
                </h3>

                <div className="divide-y divide-zinc-800/60 rounded-xl border border-zinc-800 bg-[#08080c] overflow-hidden">
                  {report.fields.map((field) => (
                    <div
                      key={field.key}
                      className="p-2.5 sm:px-3.5 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {field.present ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                        )}
                        <span className={`truncate ${field.present ? "text-zinc-200" : "text-amber-200 font-medium"}`}>
                          {field.label}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                          field.present
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-950/40 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {field.present ? "Verificado" : "Falta"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Notification after Auto-Complete */}
              {autoCompleteSuccess && (
                <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/20 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="block text-white">¡Perfil Autocompletado y Guardado al 100%!</strong>
                    Se han inyectado la galería 4K, FAQs homologadas, seguro de RC y el rider Bose. Certificación S-Class Gold Master activada.
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 sm:p-6 border-t border-zinc-800/80 bg-[#08080c] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-zinc-400 w-full sm:w-auto text-center sm:text-left">
                Depósito: 100,00 € Stripe SHA-256 · Tarifa: ≥ 350,00 €
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* 1-Click Action: Copy Canonical Template */}
                <button
                  type="button"
                  onClick={handleCopyTemplate}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 text-xs font-mono transition"
                >
                  <Copy className="w-4 h-4 text-[#ecb613]" />
                  <span>{copiedTemplate ? "¡Plantilla Copiada!" : "Copiar Plantilla Certificada"}</span>
                </button>

                {/* 1-Click Action: Auto-complete profile to 100% and save */}
                <button
                  type="button"
                  onClick={handleAutoCompleteAndSave}
                  disabled={isAutoCompleting}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-gradient-to-r from-[#ecb613] to-[#d4a010] hover:from-[#d4a010] hover:to-[#b88c0a] text-black font-semibold text-xs tracking-wider uppercase font-['Syne'] transition shadow-xl shadow-[#ecb613]/10"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Autocompletar Perfil y Guardar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
