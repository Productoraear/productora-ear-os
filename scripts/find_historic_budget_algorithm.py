import os
import re
from pathlib import Path

vault = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS")
keywords = ["deslizador", "slider", "bloquear", "lock", "presupuesto inverso", "wedding planner", "atmósfera", "atmosfera", "match", "12 servicios", "carro de la compra"]

results = []
if vault.exists():
    for f in vault.glob("*.md"):
        try:
            text = f.read_text(encoding="utf-8", errors="ignore")
            # Look for co-occurrence of slider/deslizador and presupuesto/lock
            score = 0
            matches = []
            for kw in ["deslizador", "slider", "bloquear", "lock", "presupuesto", "wedding", "atmosfera", "atmósfera"]:
                if kw in text.lower():
                    score += 1
                    matches.append(kw)
            if score >= 4:
                # Find matching snippets
                snippets = []
                for line in text.split("\n"):
                    if any(k in line.lower() for k in ["deslizador", "slider", "bloquear", "candado", "lock", "match"]):
                        snippets.append(line.strip())
                results.append((f.name, score, matches, snippets[:5]))
        except Exception as e:
            pass

results.sort(key=lambda x: x[1], reverse=True)
print(f"Encontrados {len(results)} archivos relevantes con coincidencia múltiple:")
for name, score, matches, snips in results[:10]:
    print(f"\n--- {name} (Score {score}, Matches: {matches}) ---")
    for s in snips[:3]:
        print(f"  > {s[:120]}")
