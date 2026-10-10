'use client';

import { useState, useMemo, useCallback, useId } from 'react';
import type { ChangeEvent, ReactElement } from 'react';

/**
 * BookingCalculator — S-Class Component
 * Wave 5 · COMPONENT-AUDIT · W05-036
 * Wave 7 · A11Y · W07-036
 *
 * Calculadora de reservas con estética OLED (#030305).
 * Sin imports muertos. Tipado estricto. Cero `any`.
 * A11Y: aria-labels, roles ARIA, live regions y descripciones accesibles.
 */

const OLED_BG = '#030305' as const;
const OLED_SURFACE = '#0a0a0f' as const;
const OLED_BORDER = '#1a1a24' as const;
const OLED_TEXT = '#e8e8f0' as const;
const OLED_MUTED = '#6b6b7a' as const;
const OLED_ACCENT = '#00e5ff' as const;

export interface BookingCalculatorProps {
  /** Precio base por noche en MXN. */
  basePricePerNight: number;
  /** Número mínimo de noches permitidas. */
  minNights?: number;
  /** Número máximo de noches permitidas. */
  maxNights?: number;
  /** Descuento porcentual aplicado a partir de `discountThresholdNights`. */
  discountPercent?: number;
  /** Umbral de noches para aplicar descuento. */
  discountThresholdNights?: number;
  /** Callback invocado al confirmar la reserva. */
  onConfirm?: (payload: BookingPayload) => void;
  /** Moneda mostrada (default MXN). */
  currency?: string;
}

export interface BookingPayload {
  nights: number;
  guests: number;
  subtotal: number;
  discount: number;
  total: number;
  currency: string;
}

const DEFAULT_MIN_NIGHTS = 1;
const DEFAULT_MAX_NIGHTS = 30;
const DEFAULT_DISCOUNT_PERCENT = 10;
const DEFAULT_DISCOUNT_THRESHOLD = 7;
const DEFAULT_CURRENCY = 'MXN';

function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

export default function BookingCalculator({
  basePricePerNight,
  minNights = DEFAULT_MIN_NIGHTS,
  maxNights = DEFAULT_MAX_NIGHTS,
  discountPercent = DEFAULT_DISCOUNT_PERCENT,
  discountThresholdNights = DEFAULT_DISCOUNT_THRESHOLD,
  onConfirm,
  currency = DEFAULT_CURRENCY,
}: BookingCalculatorProps): ReactElement {
  const [nights, setNights] = useState<number>(minNights);
  const [guests, setGuests] = useState<number>(1);

  const nightsInputId = useId();
  const guestsInputId = useId();
  const nightsHelpId = useId();
  const guestsHelpId = useId();
  const summaryId = useId();
  const totalId = useId();

  const clampNights = useCallback(
    (value: number): number => {
      if (Number.isNaN(value)) return minNights;
      return Math.min(Math.max(value, minNights), maxNights);
    },
    [minNights, maxNights],
  );

  const clampGuests = useCallback((value: number): number => {
    if (Number.isNaN(value)) return 1;
    return Math.min(Math.max(value, 1), 20);
  }, []);

  const handleNightsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setNights(clampNights(Number(event.target.value)));
    },
    [clampNights],
  );

  const handleGuestsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setGuests(clampGuests(Number(event.target.value)));
    },
    [clampGuests],
  );

  const breakdown = useMemo<BookingPayload>(() => {
    const subtotal = basePricePerNight * nights;
    const discount =
      nights >= discountThresholdNights
        ? (subtotal * discountPercent) / 100
        : 0;
    const total = subtotal - discount;
    return {
      nights,
      guests,
      subtotal,
      discount,
      total,
      currency,
    };
  }, [
    basePricePerNight,
    nights,
    guests,
    discountPercent,
    discountThresholdNights,
    currency,
  ]);

  const handleConfirm = useCallback((): void => {
    onConfirm?.(breakdown);
  }, [onConfirm, breakdown]);

  const nightsHelpText = `Entre ${minNights} y ${maxNights} noches.`;
  const guestsHelpText = 'Entre 1 y 20 huéspedes.';
  const discountLabel =
    breakdown.discount > 0
      ? `Descuento aplicado del ${discountPercent} por ciento`
      : 'Sin descuento aplicado';

  return (
    <section
      aria-label="Calculadora de reserva"
      role="region"
      style={{
        backgroundColor: OLED_BG,
        color: OLED_TEXT,
        border: `1px solid ${OLED_BORDER}`,
        borderRadius: 12,
        padding: 24,
        maxWidth: 420,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <h2
          id={`${summaryId}-title`}
          style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 0.2,
          }}
        >
          Calculadora de reserva
        </h2>
        <p
          style={{ margin: '4px 0 0', fontSize: 12, color: OLED_MUTED }}
          aria-label={`Precio base por noche: ${formatCurrency(
            basePricePerNight,
            currency,
          )}`}
        >
          {formatCurrency(basePricePerNight, currency)} / noche
        </p>
      </header>

      <div
        role="group"
        aria-label="Parámetros de la reserva"
        style={{ display: 'grid', gap: 16 }}
      >
        <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          <label
            htmlFor={nightsInputId}
            style={{ color: OLED_MUTED }}
          >
            Noches
          </label>
          <input
            id={nightsInputId}
            type="number"
            inputMode="numeric"
            min={minNights}
            max={maxNights}
            value={nights}
            onChange={handleNightsChange}
            aria-label="Número de noches"
            aria-describedby={nightsHelpId}
            aria-valuemin={minNights}
            aria-valuemax={maxNights}
            aria-valuenow={nights}
            style={{
              backgroundColor: OLED_SURFACE,
              color: OLED_TEXT,
              border: `1px solid ${OLED_BORDER}`,
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <span
            id={nightsHelpId}
            style={{ fontSize: 11, color: OLED_MUTED }}
          >
            {nightsHelpText}
          </span>
        </div>

        <div style={{ display: 'grid', gap: 6, fontSize: 13 }}>
          <label
            htmlFor={guestsInputId}
            style={{ color: OLED_MUTED }}
          >
            Huéspedes
          </label>
          <input
            id={guestsInputId}
            type="number"
            inputMode="numeric"
            min={1}
            max={20}
            value={guests}
            onChange={handleGuestsChange}
            aria-label="Número de huéspedes"
            aria-describedby={guestsHelpId}
            aria-valuemin={1}
            aria-valuemax={20}
            aria-valuenow={guests}
            style={{
              backgroundColor: OLED_SURFACE,
              color: OLED_TEXT,
              border: `1px solid ${OLED_BORDER}`,
              borderRadius: 8,
              padding: '10px 12px',
              fontSize: 14,
              outline: 'none',
            }}
          />
          <span
            id={guestsHelpId}
            style={{ fontSize: 11, color: OLED_MUTED }}
          >
            {guestsHelpText}
          </span>
        </div>
      </div>

      <dl
        id={summaryId}
        aria-label="Desglose del precio de la reserva"
        aria-live="polite"
        aria-atomic="true"
        style={{
          marginTop: 20,
          paddingTop: 16,
          borderTop: `1px solid ${OLED_BORDER}`,
          display: 'grid',
          gap: 8,
          fontSize: 13,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <dt style={{ color: OLED_MUTED }}>Subtotal</dt>
          <dd
            style={{ margin: 0 }}
            aria-label={`Subtotal: ${formatCurrency(
              breakdown.subtotal,
              currency,
            )}`}
          >
            {formatCurrency(breakdown.subtotal, currency)}
          </dd>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <dt style={{ color: OLED_MUTED }}>
            Descuento
            {breakdown.discount > 0 ? ` (${discountPercent}%)` : ''}
          </dt>
          <dd
            style={{
              margin: 0,
              color: breakdown.discount > 0 ? OLED_ACCENT : OLED_TEXT,
            }}
            aria-label={`${discountLabel}: menos ${formatCurrency(
              breakdown.discount,
              currency,
            )}`}
          >
            −{formatCurrency(breakdown.discount, currency)}
          </dd>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            paddingTop: 8,
            borderTop: `1px solid ${OLED_BORDER}`,
            fontSize: 15,
            fontWeight: 600,
          }}
        >
          <dt id={totalId}>Total</dt>
          <dd
            style={{ margin: 0, color: OLED_ACCENT }}
            aria-labelledby={totalId}
            aria-label={`Total a pagar: ${formatCurrency(
              breakdown.total,
              currency,
            )}`}
          >
            {formatCurrency(breakdown.total, currency)}
          </dd>
        </div>
      </dl>

      <button
        type="button"
        onClick={handleConfirm}
        aria-label={`Confirmar reserva por ${nights} ${
          nights === 1 ? 'noche' : 'noches'
        } y ${guests} ${guests === 1 ? 'huésped' : 'huéspedes'}, total ${formatCurrency(
          breakdown.total,
          currency,
        )}`}
        aria-describedby={summaryId}
        style={{
          marginTop: 20,
          width: '100%',
          padding: '12px 16px',
          backgroundColor: OLED_ACCENT,
          color: OLED_BG,
          border: 'none',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          letterSpacing: 0.3,
        }}
      >
        Confirmar reserva
      </button>
    </section>
  );
}