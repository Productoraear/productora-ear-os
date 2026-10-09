#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Verifica la integridad JSON y el censo del repositorio canónico de proveedores.

Uso:
    py scripts/check_providers_census.py <ruta_json> [censo_minimo]

Exit Code 0: JSON parseable y censo >= minimo (o sin minimo).
Exit Code 1: archivo inexistente, JSON corrupto o censo por debajo del minimo.
"""
import json
import sys

def main() -> int:
    if len(sys.argv) < 2:
        print("Uso: check_providers_census.py <ruta_json> [censo_minimo]")
        return 1

    path = sys.argv[1]
    min_records = None
    if len(sys.argv) >= 3:
        try:
            min_records = int(sys.argv[2])
        except ValueError:
            print(f"Censo minimo invalido: {sys.argv[2]}")
            return 1

    try:
        with open(path, "r", encoding="utf-8-sig", errors="ignore") as f:
            data = json.load(f)
    except FileNotFoundError:
        print(f"NO_EXISTE: {path}")
        return 1
    except Exception as e:
        print(f"JSON_CORRUPTO: {path} -> {e.__class__.__name__}: {e}")
        return 1

    if isinstance(data, list):
        n = len(data)
    elif isinstance(data, dict):
        n = len(data.get("providers", data.get("Providers", data.get("vendors", []))))
    else:
        n = 0

    print(f"JSON_OK")
    print(f"REGISTROS={n}")

    if min_records is not None and n < min_records:
        print(f"REGRESION_CENSO: {n} < {min_records}")
        return 1

    return 0

if __name__ == "__main__":
    sys.exit(main())