# -*- coding: utf-8 -*-
import os
import re

file_path = os.path.join("src", "app", "actions", "commandCenterActions.ts")

if os.path.exists(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        code = f.read()

    # Normalizar asignación de tipos nulos a string en el mapeo de waybills
    code = re.sub(r'originLabel:\s*w\.originLabel,?', 'originLabel: w.originLabel ?? "",', code)
    code = re.sub(r'destinationLabel:\s*w\.destinationLabel,?', 'destinationLabel: w.destinationLabel ?? "",', code)
    code = re.sub(r'distanceMeters:\s*w\.distanceMeters,?', 'distanceMeters: w.distanceMeters ?? 0,', code)
    code = re.sub(r'notes:\s*w\.notes,?', 'notes: w.notes ?? "",', code)
    code = re.sub(r'artistName:\s*w\.artistName,?', 'artistName: w.artistName ?? "",', code)
    code = re.sub(r'providerName:\s*w\.providerName,?', 'providerName: w.providerName ?? "",', code)
    code = re.sub(r'clientName:\s*w\.clientName,?', 'clientName: w.clientName ?? "",', code)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(code)

    print("✅ Asignaciones de WaybillData sanitizadas a string no-nulo.")
