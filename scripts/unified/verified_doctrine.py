#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS — DOCTRINA DEL DATO VERIFICADO (SINGLE SOURCE OF TRUTH)
================================================================
Bug raíz sellado: ningún sincronizador/daemon puede re-hardcodear `verified:true`.
Regla inmutable (AGENTS.md §8 / .clinerules §4bis):
  - `verified:true` SOLO con teléfono real verificable.
  - Centralita +34 693 693 048, placeholder o vacío => `verified:false`.

Este módulo es el UNICO punto autorizado para decidir `verified`.
Los validadores espejo (Node) son:
  scripts/audit_placeholder_phones.cjs
  scripts/prune_placeholder_verified.cjs
"""

import re

# Centralita oficial CEO (no es teléfono de un proveedor externo).
PLACEHOLDER_PHONE = "+34 693 693 048"

# Dígitos normalizados que representan la centralita / placeholders conocidos.
_PLACEHOLDER_DIGITS = {
    "34693693048",  # +34 693 693 048
    "693693048",    # 693 693 048 nacional
    "34693048",     # variante accidental sin un 69
    "93693048",     # 9 dígitos falso
    "693048",       # cola
}


def placeholder_digits() -> set:
    """Devuelve una copia del conjunto de dígitos placeholder/centralita."""
    return set(_PLACEHOLDER_DIGITS)


def _digits(p) -> str:
    if p is None:
        return ""
    return re.sub(r"\D", "", str(p))


def is_placeholder(p) -> bool:
    d = _digits(p)
    if not d:
        return True
    if d in _PLACEHOLDER_DIGITS:
        return True
    # Cualquier teléfono que normalice a solo la centralita oficial.
    if d == "34693693048" or d == "693693048":
        return True
    return False


def is_real_phone(p) -> bool:
    """True SOLO si el teléfono es un número español real verificable.

    Acepta:
      - 9 dígitos nacionales que empiecen por 6/7 (móvil) u 8/9 (fijo geográfico).
      - 11 dígitos con prefijo 34 + 9 nacionales válidos.
    Descarta: vacío, centralita oficial, 90x premium (901/902/905...),
    8xx tarificación especial, 99x reservado y longitudes anómalas.
    """
    d = _digits(p)
    if not d:
        return False
    if d in _PLACEHOLDER_DIGITS:
        return False

    if d == "34693693048" or d == "693693048":
        return False

    if len(d) == 9:
        if d[0] in ("6", "7"):
            return True
        if d[0] == "9" and d[1] in ("1", "2", "3", "4", "5", "6", "7", "8"):
            return True
        if d[0] == "8" and d[1] not in ("0", "1", "2", "3", "4", "5", "6", "7", "8", "9"):
            # 8xx son tarificación especial / no verificables.
            return False
        return False

    if len(d) == 11 and d.startswith("34"):
        nd = d[2:]
        if nd[0] in ("6", "7"):
            return True
        if nd[0] == "9" and nd[1] in ("1", "2", "3", "4", "5", "6", "7", "8"):
            return True
        return False

    return False


def resolve_phone_with_doctrine(candidate, fallback=PLACEHOLDER_PHONE):
    """Normaliza un teléfono manteniendo `verified` coherente.

    Devuelve (phone, verified).
    Si el candidato es real, se publica el teléfono y `verified:true`.
    Si es placeholder/vacío, se publica la centralita como fallback NO verificado
    y `verified:false`.
    """
    cand = candidate or ""
    cand = str(cand).strip()
    if cand.lower() in ("", "none", "null"):
        return fallback, False
    di = _digits(cand)
    if di in _PLACEHOLDER_DIGITS or di == "34693693048" or di == "693693048":
        return fallback, False
    if is_real_phone(cand):
        return cand, True
    # No es un teléfono español real verificable => centralita NO verificada.
    return fallback, False