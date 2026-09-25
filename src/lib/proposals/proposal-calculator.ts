/**
 * ⚡ EAR OS V2 — MOTOR DE CÁLCULO FINANCIERO Y SPLIT SOBERANO
 * ------------------------------------------------------------------
 * Cálculo determinista en céntimos enteros.
 * Invariante SSOT: Split 80% Artista / 10% EAR OS / 10% VIMUME.
 * Ningún componente o cliente recalcula importes por su cuenta.
 */

import type { ProposalBudgetTotals, ProposalLineItem, SovereignSplitBreakdown } from './proposal-types';

/**
 * Calcula los totales con IVA y el Split Soberano a partir de las líneas activas.
 */
export function calcularTotalesPropuesta(
  lineas: ProposalLineItem[],
  ivaPct: number = 21,
  descuentoPct: number = 0
): ProposalBudgetTotals {
  // Solo se suman las líneas que NO son opcionales O aquellas opcionales marcadas como seleccionadas
  const lineasActivas = lineas.filter(l => !l.esOpcional || l.seleccionada);

  // Suma de base imponible en céntimos
  let baseBrutaCéntimos = lineasActivas.reduce((acc, l) => acc + (l.totalCéntimos || 0), 0);

  // Aplicar descuento porcentual si existe
  if (descuentoPct > 0) {
    const factorDescuento = Math.min(100, Math.max(0, descuentoPct)) / 100;
    baseBrutaCéntimos = Math.round(baseBrutaCéntimos * (1 - factorDescuento));
  }

  // IVA calculado en céntimos
  const ivaImporteCéntimos = Math.round(baseBrutaCéntimos * (ivaPct / 100));
  const totalCéntimos = baseBrutaCéntimos + ivaImporteCéntimos;

  // Split Soberano 80/10/10 sobre el total neto base
  const artistaCéntimos = Math.round(baseBrutaCéntimos * 0.80);
  const earOsCéntimos = Math.round(baseBrutaCéntimos * 0.10);
  // Ajuste por redondeo para que sume exactamente la base
  const vimumeCéntimos = baseBrutaCéntimos - (artistaCéntimos + earOsCéntimos);

  const split: SovereignSplitBreakdown = {
    artistaCéntimos,
    earOsCéntimos,
    vimumeCéntimos,
    totalCéntimos: baseBrutaCéntimos,
  };

  return {
    baseCéntimos: baseBrutaCéntimos,
    ivaPct,
    ivaImporteCéntimos,
    totalCéntimos,
    depositoStripeCéntimos: 10000, // 100,00 € inmutables
    split,
  };
}

/**
 * Formateador de moneda en euros para castellano (es-ES).
 * Recibe céntimos y devuelve formato legible (ej. 25000 -> "250,00 €").
 */
export function formatoEuros(céntimos: number): string {
  const euros = céntimos / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

/**
 * Formateador corto (ej. 25000 -> "250 €").
 */
export function formatoEurosCorto(céntimos: number): string {
  const euros = Math.round(céntimos / 100);
  return `${euros.toLocaleString('es-ES')} €`;
}
