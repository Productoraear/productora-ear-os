#!/usr/bin/env python3
"""
🏛️ EAR OS OMEGA — VELOCITY MEDIA ORACLE 24H (CONSULTORA ESTRATÉGICA)
S-Class Advisory Engine powered by Velocity Media Vault Knowledge.
"""

import sys
import os
import json
import re
from pathlib import Path

# Paths
KNOWLEDGE_ROOT = Path(r"H:\EAR_VAULT_VELOCITY_KNOWLEDGE")
CATALOG_PATH = Path("reports/velocity_media_master_catalog.json")

def search_velocity_knowledge(query: str):
    """Searches through all markdown notes in Knowledge Vault for relevant frameworks."""
    query_tokens = [t.lower() for t in query.split() if len(t) > 2]
    results = []

    if not KNOWLEDGE_ROOT.exists():
        return results

    for root, dirs, files in os.walk(KNOWLEDGE_ROOT):
        for f in files:
            if f.endswith(".md") and not f.startswith("00_INDICE"):
                note_path = Path(root) / f
                try:
                    content = note_path.read_text(encoding="utf-8")
                    score = 0
                    matched_tokens = []
                    
                    # Score by title and content
                    f_lower = f.lower()
                    c_lower = content.lower()
                    
                    for token in query_tokens:
                        if token in f_lower:
                            score += 5
                            matched_tokens.append(token)
                        elif token in c_lower:
                            score += 1
                            matched_tokens.append(token)
                    
                    if score > 0:
                        # Extract course name from path
                        course_name = note_path.parent.name
                        cat_name = note_path.parent.parent.name
                        
                        # Extract local video link
                        video_match = re.search(r'\[▶ ABRIR CLASE EN DISCO D\]\(([^\)]+)\)', content)
                        video_url = video_match.group(1) if video_match else None
                        
                        results.append({
                            "title": f.replace(".md", ""),
                            "course": course_name,
                            "category": cat_name,
                            "score": score,
                            "matched_tokens": list(set(matched_tokens)),
                            "note_path": str(note_path),
                            "video_url": video_url
                        })
                except Exception:
                    pass

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:8]

def consult_oracle(question: str):
    print("="*80)
    print(f"🧠 [VELOCITY ORACLE 24H] CONSULTA ESTRATÉGICA")
    print(f"❓ Pregunta: \"{question}\"")
    print("="*80)

    matches = search_velocity_knowledge(question)
    
    if not matches:
        print("\n⚠️ No se encontraron clases específicas con coincidencia exacta para estos términos.")
        print("Buscando en el catálogo maestro general...")
        return

    print(f"\n🔍 {len(matches)} Clases y Principios Relevantes encontrados en tu Bóveda:")
    for i, m in enumerate(matches, 1):
        print(f"\n[{i}] 🎯 {m['title']}")
        print(f"    📁 Programa: {m['course']} ({m['category']})")
        if m['video_url']:
            print(f"    ▶ Video Local: {m['video_url']}")

    print("\n" + "—"*80)
    print("💎 SÍNTESIS ESTRATÉGICA (DOCTRINA VELOCITY MEDIA APLICADA):")
    print("—"*80)
    
    # Generate strategic advice structure
    primary = matches[0]
    print(f"""
1. 🛑 EL ERROR COMÚN (EL DIAGNÓSTICO):
   La mayoría falla por intentar presionar la venta o dispersar el mensaje en lugar de
   construir la atención y el marco mental previo (ver: {primary['title']}).

2. ⚡ EL MARCO MENTAL INNEGOCIABLE (FRAMEWORK VELOCITY):
   - La atención no se pide, se secuestra con un gancho (Hook) relevante en los primeros 3 segundos.
   - El cliente no compra tu esfuerzo técnico ni tus herramientas; compra la certeza de transformación.
   - Todo funnel debe responder a una ecuación económica validada antes de escalar tráfico.

3. 🛠️ PLAN DE ACCIÓN TÁCTICO INMEDIATO (3 PASOS):
   • Paso 1: Reformular la propuesta con el principio de '{primary['title']}'.
   • Paso 2: Auditar el canal de comunicación eliminando la fricción y las palabras débiles.
   • Paso 3: Ejecutar una oferta irresistible con garantía de reversión de riesgo.

🔗 Clase Recomendada para Estudiar Hoy:
   👉 {primary['title']} ({primary['course']})
   📂 Archivo Local: {primary.get('video_url', 'D:/00_VELOCITY_MEDIA_VAULT')}
""")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_query = " ".join(sys.argv[1:])
    else:
        user_query = "como crear una oferta irresistible y captar atencion con copy"
    consult_oracle(user_query)
