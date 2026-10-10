'use client';

import React, { useCallback, useId, useMemo, useState } from 'react';

/**
 * DiviTransmuter — EAR OS v2
 * Componente de transmutación visual OLED (#030305).
 * S-Class: sin imports muertos, tipos estrictos, cero `any`.
 * A11Y: aria-labels, roles ARIA, live regions y estados accesibles.
 */

type TransmuterMode = 'idle' | 'transmuting' | 'sealed';

interface DiviTransmuterProps {
  readonly initialValue?: string;
  readonly label?: string;
  readonly onTransmute?: (value: string) => void;
  readonly className?: string;
}

const OLED_BG = '#030305' as const;
const OLED_BORDER = 'rgba(255,255,255,0.08)' as const;
const OLED_TEXT = '#E6E6E6' as const;
const OLED_ACCENT = '#7CFFB2' as const;

export default function DiviTransmuter({
  initialValue = '',
  label = 'DiviTransmuter',
  onTransmute,
  className,
}: DiviTransmuterProps): React.ReactElement {
  const [value, setValue] = useState<string>(initialValue);
  const [mode, setMode] = useState<TransmuterMode>('idle');

  const isSealed = mode === 'sealed';
  const isTransmuting = mode === 'transmuting';
  const isEmpty = value.trim().length === 0;
  const isTransmuteDisabled = isEmpty || isTransmuting;

  const reactId = useId();
  const inputId = useMemo<string>(
    () => `divi-transmuter-input-${reactId}`,
    [reactId],
  );
  const statusId = useMemo<string>(
    () => `divi-transmuter-status-${reactId}`,
    [reactId],
  );
  const labelId = useMemo<string>(
    () => `divi-transmuter-label-${reactId}`,
    [reactId],
  );
  const toolbarId = useMemo<string>(
    () => `divi-transmuter-toolbar-${reactId}`,
    [reactId],
  );

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      setValue(event.target.value);
      if (mode !== 'idle') setMode('idle');
    },
    [mode],
  );

  const handleTransmute = useCallback((): void => {
    if (value.trim().length === 0) return;
    setMode('transmuting');
    onTransmute?.(value);
    setMode('sealed');
  }, [value, onTransmute]);

  const handleReset = useCallback((): void => {
    setValue('');
    setMode('idle');
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>): void => {
      if (event.key === 'Enter' && !isTransmuteDisabled) {
        event.preventDefault();
        handleTransmute();
      }
    },
    [handleTransmute, isTransmuteDisabled],
  );

  const statusLabel = useMemo<string>(() => {
    switch (mode) {
      case 'transmuting':
        return 'TRANSMUTING…';
      case 'sealed':
        return 'SEALED';
      case 'idle':
      default:
        return 'IDLE';
    }
  }, [mode]);

  const statusAriaLabel = useMemo<string>(() => {
    switch (mode) {
      case 'transmuting':
        return `${label}: transmutando`;
      case 'sealed':
        return `${label}: sellado`;
      case 'idle':
      default:
        return `${label}: inactivo`;
    }
  }, [mode, label]);

  return (
    <div
      className={className}
      role="group"
      aria-label={`${label} — panel de transmutación`}
      aria-labelledby={labelId}
      style={{
        background: OLED_BG,
        border: `1px solid ${OLED_BORDER}`,
        borderRadius: 12,
        padding: 16,
        color: OLED_TEXT,
        fontFamily:
          'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          opacity: 0.85,
        }}
      >
        <span id={labelId}>{label}</span>
        <span
          id={statusId}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          aria-label={statusAriaLabel}
          style={{ color: isSealed ? OLED_ACCENT : OLED_TEXT }}
        >
          {statusLabel}
        </span>
      </header>

      <input
        id={inputId}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="input payload…"
        aria-label={`${label} input`}
        aria-labelledby={`${labelId} ${inputId}`}
        aria-describedby={statusId}
        aria-invalid={false}
        aria-required={false}
        autoComplete="off"
        spellCheck={false}
        disabled={isTransmuting}
        style={{
          background: 'transparent',
          border: `1px solid ${OLED_BORDER}`,
          borderRadius: 8,
          padding: '10px 12px',
          color: OLED_TEXT,
          outline: 'none',
          fontSize: 14,
        }}
      />

      <div
        id={toolbarId}
        role="toolbar"
        aria-label={`${label} — acciones`}
        aria-orientation="horizontal"
        style={{ display: 'flex', gap: 8 }}
      >
        <button
          type="button"
          onClick={handleTransmute}
          disabled={isTransmuteDisabled}
          aria-label={`Transmutar valor de ${label}`}
          aria-disabled={isTransmuteDisabled}
          aria-busy={isTransmuting}
          aria-describedby={statusId}
          aria-controls={inputId}
          style={{
            flex: 1,
            background: 'transparent',
            border: `1px solid ${OLED_ACCENT}`,
            color: OLED_ACCENT,
            borderRadius: 8,
            padding: '8px 12px',
            cursor: isTransmuteDisabled ? 'not-allowed' : 'pointer',
            opacity: isTransmuteDisabled ? 0.4 : 1,
            fontSize: 12,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Transmute
        </button>
        <button
          type="button"
          onClick={handleReset}
          aria-label={`Reiniciar ${label}`}
          aria-disabled={false}
          aria-controls={inputId}
          style={{
            background: 'transparent',
            border: `1px solid ${OLED_BORDER}`,
            color: OLED_TEXT,
            borderRadius: 8,
            padding: '8px 12px',
            cursor: 'pointer',
            fontSize: 12,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}