'use client';

import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Euro,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  User,
  Users,
  X,
} from 'lucide-react';
import { CENTRALITA_EAR_OS } from '@/lib/constants/ear-os-ssot';
import { createIntakeKey, submitFormToAgents } from '@/lib/agents/formIntakeClient';
import type { FormIntakeResult } from '@/lib/agents/formIntakeTypes';
import { AgentIntakeReceipt } from '@/components/agents/AgentIntakeReceipt';

// ─── Tipos (cero `any` implícito) ─────────────────────────────────────────────

export interface RequestToBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  providerId: string;
  providerName: string;
  category: string;
  defaultBudget?: number;
  location?: string;
}

interface FormState {
  eventDate: string;
  eventLocation: string;
  guests: string;
  budgetEur: string;
  clientName: string;
  clientPhone: string;
  notes: string;
}

interface BookingRequestPayload {
  providerId: string;
  providerName: string;
  category: string;
  eventDate: string;
  eventLocation: string;
  guests: number;
  budgetEur: number;
  clientName: string;
  clientPhone: string;
  notes?: string;
}

interface BookingRequestSuccess {
  requestId: string;
  status: 'PENDING_PROVIDER';
  acceptWindowHours: number;
  message: string;
}

interface BookingRequestErrorBody {
  error?: string;
  invalidFields?: string[];
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

// ─── Constantes de negocio (reglas del modal) ────────────────────────────────

const API_ENDPOINT = '/api/booking/request';
const MIN_GUESTS = 10;
const MAX_GUESTS = 1500;
const PHONE_REGEX = /^\+?\d{9,15}$/;
const WHATSAPP_E164 = CENTRALITA_EAR_OS.replace(/\D/g, '');

const FORM_FIELDS: readonly (keyof FormState)[] = [
  'eventDate',
  'eventLocation',
  'guests',
  'budgetEur',
  'clientName',
  'clientPhone',
  'notes',
] as const;

const FIELD_ERROR_MESSAGES: Record<string, string> = {
  providerId: 'No se pudo identificar al proveedor.',
  providerName: 'El nombre del proveedor no es válido.',
  category: 'La categoría del servicio no es válida.',
  eventDate: 'La fecha del evento no es válida o no es futura.',
  eventLocation: 'La ubicación del evento es obligatoria.',
  guests: `El aforo debe estar entre ${MIN_GUESTS} y ${MAX_GUESTS} invitados.`,
  budgetEur: 'El presupuesto debe ser un importe mayor que 0.',
  clientName: 'El nombre del cliente es obligatorio.',
  clientPhone: 'El teléfono debe tener entre 9 y 15 dígitos (opcional +).',
  notes: 'Las notas contienen caracteres no permitidos.',
};

// ─── Utilidades puras ─────────────────────────────────────────────────────────

function toDateInputValue(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getMinEventDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return toDateInputValue(tomorrow);
}

function buildInitialForm(defaultBudget?: number, location?: string): FormState {
  return {
    eventDate: '',
    eventLocation: location ?? '',
    guests: '',
    budgetEur: defaultBudget !== undefined ? String(defaultBudget) : '',
    clientName: '',
    clientPhone: '',
    notes: '',
  };
}

function isFormField(field: string): field is keyof FormState {
  return (FORM_FIELDS as readonly string[]).includes(field);
}

function hasAngleBrackets(value: string): boolean {
  return value.includes('<') || value.includes('>');
}

function validateForm(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  const minDate = getMinEventDate();

  if (!form.eventDate) {
    errors.eventDate = 'Selecciona la fecha del evento.';
  } else if (form.eventDate < minDate) {
    errors.eventDate = 'La fecha debe ser mañana o posterior.';
  }

  if (!form.eventLocation.trim()) {
    errors.eventLocation = 'Indica la ubicación del evento.';
  }

  const guests = Number(form.guests);
  if (!Number.isInteger(guests) || guests < MIN_GUESTS || guests > MAX_GUESTS) {
    errors.guests = `El aforo debe estar entre ${MIN_GUESTS} y ${MAX_GUESTS} invitados.`;
  }

  const budget = Number(form.budgetEur);
  if (!Number.isFinite(budget) || budget <= 0) {
    errors.budgetEur = 'Indica un presupuesto mayor que 0.';
  }

  if (!form.clientName.trim()) {
    errors.clientName = 'Escribe tu nombre.';
  } else if (hasAngleBrackets(form.clientName)) {
    errors.clientName = 'El nombre contiene caracteres no permitidos.';
  }

  const compactPhone = form.clientPhone.replace(/\s+/g, '');
  if (!PHONE_REGEX.test(compactPhone)) {
    errors.clientPhone = 'El teléfono debe tener entre 9 y 15 dígitos (opcional +).';
  }

  if (form.notes && hasAngleBrackets(form.notes)) {
    errors.notes = 'Las notas contienen caracteres no permitidos.';
  }

  return errors;
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => !el.hasAttribute('aria-hidden') && (el.offsetWidth > 0 || el.offsetHeight > 0)
  );
}

function inputClass(hasError: boolean): string {
  return [
    'w-full px-4 py-3 bg-[#12121a] border rounded-xl text-white text-sm font-sans placeholder:text-white/25',
    hasError ? 'border-[#FF2B44]' : 'border-white/10 focus:border-[#ecb613]',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d] transition-colors duration-300',
  ].join(' ');
}

function trapFocusInDialog(event: KeyboardEvent, dialog: HTMLElement): void {
  const focusable = getFocusableElements(dialog);
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  const active = document.activeElement;
  const activeInDialog = active instanceof HTMLElement && dialog.contains(active);
  if (event.shiftKey) {
    if (!activeInDialog || active === first) {
      event.preventDefault();
      last.focus();
    }
  } else if (!activeInDialog || active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function RequestToBookModal({
  isOpen,
  onClose,
  providerId,
  providerName,
  category,
  defaultBudget,
  location,
}: RequestToBookModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(defaultBudget, location));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<BookingRequestSuccess | null>(null);
  // Puente con la flota Ω: recibo real del pipeline (cotización + rider + compliance).
  const [agentReceipt, setAgentReceipt] = useState<FormIntakeResult | null>(null);
  const [agentPending, setAgentPending] = useState(false);
  const intakeKeyRef = useRef<string>('');

  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Reset del formulario al abrir.
  useEffect(() => {
    if (isOpen) {
      setForm(buildInitialForm(defaultBudget, location));
      setFieldErrors({});
      setServerError(null);
      setConfirmation(null);
      setAgentReceipt(null);
      setAgentPending(false);
      intakeKeyRef.current = createIntakeKey();
      setLoading(false);
    }
  }, [isOpen, defaultBudget, location]);

  // Focus trap + tecla Escape + bloqueo de scroll del body.
  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const dialog = dialogRef.current;
    if (dialog) {
      const focusable = getFocusableElements(dialog);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        dialog.setAttribute('tabindex', '-1');
        dialog.focus();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === 'Tab' && dialogRef.current) {
        trapFocusInDialog(event, dialogRef.current);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minDate = getMinEventDate();

  const updateField = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setServerError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;

    const errors = validateForm(form);
    setFieldErrors(errors);
    setServerError(null);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);

    const payload: BookingRequestPayload = {
      providerId,
      providerName,
      category,
      eventDate: new Date(`${form.eventDate}T12:00:00`).toISOString(),
      eventLocation: form.eventLocation.trim(),
      guests: Number(form.guests),
      budgetEur: Number(form.budgetEur),
      clientName: form.clientName.trim(),
      clientPhone: form.clientPhone.replace(/\s+/g, ''),
      notes: form.notes.trim() || undefined,
    };

    try {
      const res = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 202) {
        const data = (await res.json()) as BookingRequestSuccess;
        if (!data.requestId || data.status !== 'PENDING_PROVIDER') {
          setServerError('Respuesta inesperada del servidor. Inténtalo de nuevo.');
          return;
        }
        setConfirmation(data);
        const receiptKey: string = intakeKeyRef.current || createIntakeKey();
        intakeKeyRef.current = receiptKey;
        setAgentPending(true);
        void submitFormToAgents(
          'booking_request',
          {
            clientName: payload.clientName,
            clientPhone: payload.clientPhone,
            eventDate: payload.eventDate.slice(0, 10),
            eventLocation: payload.eventLocation,
            pax: payload.guests,
            budgetEur: payload.budgetEur,
            providerId: payload.providerId,
            providerName: payload.providerName,
            category: payload.category,
            message: payload.notes,
            sourcePath: '/reservar',
          },
          { idempotencyKey: receiptKey },
        )
          .then((receipt: FormIntakeResult | null) => {
            setAgentReceipt(receipt);
          })
          .finally(() => {
            setAgentPending(false);
          });
        return;
      }

      if (res.status === 422) {
        let data: BookingRequestErrorBody = {};
        try {
          data = (await res.json()) as BookingRequestErrorBody;
        } catch {
          data = {};
        }

        const mapped: FieldErrors = {};
        const general: string[] = [];
        if (Array.isArray(data.invalidFields)) {
          for (const field of data.invalidFields) {
            if (isFormField(field)) {
              mapped[field] = FIELD_ERROR_MESSAGES[field] ?? 'Campo no válido.';
            } else {
              general.push(FIELD_ERROR_MESSAGES[field] ?? `Campo inválido: ${field}.`);
            }
          }
        }

        if (general.length > 0) setServerError(general.join(' '));
        if (Object.keys(mapped).length > 0) setFieldErrors(mapped);
        if (general.length === 0 && Object.keys(mapped).length === 0) {
          setServerError(data.error ?? 'Revisa los campos marcados e inténtalo de nuevo.');
        }
        return;
      }

      setServerError('No pudimos enviar la solicitud. Inténtalo de nuevo.');
    } catch {
      setServerError('Error de red. Comprueba tu conexión e inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="request-to-book-title"
        aria-describedby="request-to-book-description"
        className="relative w-full max-w-xl bg-[#09090d]/95 border border-white/10 rounded-3xl shadow-2xl max-h-[92vh] overflow-y-auto my-auto"
      >
        {/* Cabecera */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 p-6 border-b border-white/10 bg-[#09090d]/95 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              aria-hidden="true"
              className="p-2.5 rounded-xl bg-[#ecb613]/10 border border-[#ecb613]/30 text-[#ecb613]"
            >
              <Calendar size={20} />
            </div>
            <div>
              <h2
                id="request-to-book-title"
                className="text-lg font-bold text-white font-syne uppercase tracking-wider"
              >
                {confirmation ? 'Solicitud Enviada' : 'Solicitar Reserva'}
              </h2>
              <p className="text-[11px] font-mono text-white/40">{providerName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar el diálogo de solicitud de reserva"
            className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {confirmation ? (
          <div className="p-6 space-y-5">
            <p id="request-to-book-description" className="sr-only">
              Solicitud enviada correctamente, pendiente de confirmación por el proveedor.
            </p>

            <div role="status" aria-live="polite" className="space-y-5">
              <div className="flex flex-col items-center text-center gap-3">
                <div className="w-16 h-16 rounded-full bg-[#ecb613]/10 border-2 border-[#ecb613] flex items-center justify-center text-[#ecb613] shadow-[0_0_40px_rgba(236,182,19,0.25)]">
                  <CheckCircle2 size={32} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase text-white font-syne">Solicitud Enviada</h3>
                  <p className="text-sm text-white/60 mt-1">
                    {providerName} ha recibido tu solicitud en exclusiva.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/40 uppercase tracking-wider">Código</span>
                  <span className="text-[#ecb613] font-bold break-all">{confirmation.requestId}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/40 uppercase tracking-wider">Estado</span>
                  <span className="text-white font-bold">{confirmation.status}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-white/40 uppercase tracking-wider">Proveedor</span>
                  <span className="text-white font-bold text-right">{providerName}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#ecb613]/5 border border-[#ecb613]/20">
                <Clock size={18} className="text-[#ecb613] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-white/70">
                  Exclusividad garantizada: el proveedor dispone de{' '}
                  <strong className="text-white">{confirmation.acceptWindowHours} horas</strong> para
                  confirmar tu fecha antes de liberarla.
                </p>
              </div>

              {agentReceipt ? (
                <AgentIntakeReceipt result={agentReceipt} />
              ) : agentPending ? (
                <div className="min-h-[220px] w-full rounded-3xl bg-[#09090d]/80 border border-white/10 backdrop-blur-md p-5 flex items-center gap-3">
                  <Loader2 size={18} className="animate-spin text-[#ecb613]" aria-hidden="true" />
                  <p className="text-xs text-white/50">
                    La flota Ω está calculando tarifa SSOT, rider acústico y compliance…
                  </p>
                </div>
              ) : null}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
                    `Hola, quiero agilizar mi solicitud de reserva ${confirmation.requestId} con ${providerName} (${category}).`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Agilizar la solicitud por WhatsApp directo"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#25D366]/10 border border-[#25D366]/40 hover:bg-[#25D366]/20 text-[#25D366] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Agilizar por WhatsApp
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-5 py-3.5 bg-[#ecb613] hover:bg-[#f5c538] text-black font-black uppercase text-xs tracking-wider rounded-xl transition-colors shadow-lg shadow-[#ecb613]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        ) : (
<form onSubmit={handleSubmit} noValidate className="p-6 space-y-4">
            <p id="request-to-book-description" className="text-xs text-white/50">
              Completa los datos para solicitar disponibilidad en exclusiva. Sin coste ni cargo
              hasta la aceptación del proveedor.
            </p>

            {serverError && (
              <div role="alert" className="p-3 rounded-xl bg-[#FF2B44]/10 border border-[#FF2B44]/40 text-[#FF6B7D] text-xs">
                {serverError}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-event-date" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <Calendar size={13} className="text-[#ecb613]" aria-hidden="true" /> Fecha del Evento
                </label>
                <input
                  id="booking-event-date"
                  type="date"
                  min={minDate}
                  value={form.eventDate}
                  onChange={(e) => updateField('eventDate', e.target.value)}
                  aria-label="Fecha del evento"
                  aria-invalid={Boolean(fieldErrors.eventDate)}
                  aria-describedby={fieldErrors.eventDate ? 'booking-event-date-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.eventDate))}
                />
                {fieldErrors.eventDate && (
                  <p id="booking-event-date-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.eventDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-event-location" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <MapPin size={13} className="text-[#ecb613]" aria-hidden="true" /> Ubicación
                </label>
                <input
                  id="booking-event-location"
                  type="text"
                  value={form.eventLocation}
                  onChange={(e) => updateField('eventLocation', e.target.value)}
                  placeholder="Ciudad o finca del evento"
                  aria-label="Ubicación del evento"
                  aria-invalid={Boolean(fieldErrors.eventLocation)}
                  aria-describedby={fieldErrors.eventLocation ? 'booking-event-location-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.eventLocation))}
                />
                {fieldErrors.eventLocation && (
                  <p id="booking-event-location-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.eventLocation}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-guests" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <Users size={13} className="text-[#ecb613]" aria-hidden="true" /> Aforo (Invitados)
                </label>
                <input
                  id="booking-guests"
                  type="number"
                  inputMode="numeric"
                  min={MIN_GUESTS}
                  max={MAX_GUESTS}
                  step={1}
                  value={form.guests}
                  onChange={(e) => updateField('guests', e.target.value)}
                  placeholder={`${MIN_GUESTS}–${MAX_GUESTS}`}
                  aria-label="Aforo de invitados"
                  aria-invalid={Boolean(fieldErrors.guests)}
                  aria-describedby={fieldErrors.guests ? 'booking-guests-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.guests))}
                />
                {fieldErrors.guests && (
                  <p id="booking-guests-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.guests}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-budget" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <Euro size={13} className="text-[#ecb613]" aria-hidden="true" /> Presupuesto (€)
                </label>
                <input
                  id="booking-budget"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="any"
                  value={form.budgetEur}
                  onChange={(e) => updateField('budgetEur', e.target.value)}
                  placeholder="Ej. 1200"
                  aria-label="Presupuesto estimado en euros"
                  aria-invalid={Boolean(fieldErrors.budgetEur)}
                  aria-describedby={fieldErrors.budgetEur ? 'booking-budget-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.budgetEur))}
                />
                {fieldErrors.budgetEur && (
                  <p id="booking-budget-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.budgetEur}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-client-name" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <User size={13} className="text-[#ecb613]" aria-hidden="true" /> Tu Nombre
                </label>
                <input
                  id="booking-client-name"
                  type="text"
                  autoComplete="name"
                  value={form.clientName}
                  onChange={(e) => updateField('clientName', e.target.value)}
                  placeholder="Nombre y apellidos"
                  aria-label="Tu nombre"
                  aria-invalid={Boolean(fieldErrors.clientName)}
                  aria-describedby={fieldErrors.clientName ? 'booking-client-name-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.clientName))}
                />
                {fieldErrors.clientName && (
                  <p id="booking-client-name-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.clientName}</p>
                )}
              </div>

              <div>
                <label htmlFor="booking-client-phone" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                  <Phone size={13} className="text-[#ecb613]" aria-hidden="true" /> Tu Teléfono
                </label>
                <input
                  id="booking-client-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  value={form.clientPhone}
                  onChange={(e) => updateField('clientPhone', e.target.value)}
                  placeholder="+34 600 000 000"
                  aria-label="Tu teléfono"
                  aria-invalid={Boolean(fieldErrors.clientPhone)}
                  aria-describedby={fieldErrors.clientPhone ? 'booking-client-phone-error' : undefined}
                  className={inputClass(Boolean(fieldErrors.clientPhone))}
                />
                {fieldErrors.clientPhone && (
                  <p id="booking-client-phone-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.clientPhone}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="booking-notes" className="flex items-center gap-2 text-xs font-mono uppercase text-white/60 mb-1.5">
                <Send size={13} className="text-[#ecb613]" aria-hidden="true" /> Notas (Opcional)
              </label>
              <textarea
                id="booking-notes"
                rows={2}
                value={form.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Detalles sobre rider acústico, horario o peticiones especiales..."
                aria-label="Notas adicionales"
                aria-invalid={Boolean(fieldErrors.notes)}
                aria-describedby={fieldErrors.notes ? 'booking-notes-error' : undefined}
                className={inputClass(Boolean(fieldErrors.notes))}
              />
              {fieldErrors.notes && (
                <p id="booking-notes-error" className="mt-1.5 text-[11px] text-[#FF6B7D]">{fieldErrors.notes}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 text-white/70 text-xs font-mono rounded-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#ecb613] hover:bg-[#f5c538] disabled:opacity-60 disabled:cursor-not-allowed text-black font-black uppercase text-xs tracking-wider rounded-xl transition-colors shadow-lg shadow-[#ecb613]/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ecb613] focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090d]"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Send size={15} aria-hidden="true" />
                    Enviar Solicitud
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RequestToBookModal;
