#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PURGA ATÓMICA DE DESIGN.md (DALA) DE STAGING
=============================================================================
Elimina de forma permanente el archivo src/data/staging/DESIGN.md del PC
conforme a la decisión de gobernanza de descartar la identidad de Dala.
"""
import os
import sys

target = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src", "data", "staging", "DESIGN.md"))

if os.path.exists(target):
    try:
        os.remove(target)
        print(f"[+] PURGA EXITOSA: {target} eliminado permanentemente del PC.")
        sys.exit(0)
    except Exception as e:
        print(f"[!] ERROR al eliminar {target}: {e}")
        sys.exit(1)
else:
    print(f"[*] AVISO: {target} ya no existe en el disco.")
    sys.exit(0)
