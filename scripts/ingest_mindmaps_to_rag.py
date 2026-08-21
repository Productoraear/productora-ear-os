#!/usr/bin/env python3
"""
🚀 PIPELINE S-CLASS: INGESTA Y SÍNTESIS DE MINDMAPS, ESTRATEGIAS Y TRANSCRIPCIONES A BÓVEDA RAG
Procesa los archivos estratégicos de 'H:/incubadora despegue' y de la infraestructura local
para alimentar la base cognitiva (src/data/ear-rag-database.json) de forma 100% aditiva.
"""

import os
import sys
import re
import json
import glob
import hashlib

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')
if hasattr(sys.stderr, 'reconfigure'):
    sys.stderr.reconfigure(encoding='utf-8')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAG_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'ear-rag-database.json')

INCUBADORA_BASE = 'H:/incubadora despegue'
DIRECTORIES_TO_PROCESS = [
    {
        "path": os.path.join(INCUBADORA_BASE, 'ESTRATEGIAS_Y_FRAMEWORKS'),
        "category": "ESTRATEGIAS_Y_FRAMEWORKS",
        "default_tags": ["Estrategia", "Framework", "Incubadora Despegue", "Metodología", "Cierre"]
    },
    {
        "path": os.path.join(INCUBADORA_BASE, 'INFLUENCE'),
        "category": "INFLUENCIA_Y_PERSUASION",
        "default_tags": ["Influencia", "Persuasión", "Psicología de Ventas", "Storytelling", "Conversión"]
    },
    {
        "path": os.path.join(INCUBADORA_BASE, 'TRANSCRIPCIONES_WHISPER'),
        "category": "TRANSCRIPCIONES_Y_VOZ_REAL",
        "default_tags": ["Transcripción Whisper", "Voz Real", "Objeciones Reales", "Copywriting", "Storyselling"]
    },
    {
        "path": os.path.join(INCUBADORA_BASE, 'VELOCITY'),
        "category": "VELOCITY_EJECUCION_RAPIDA",
        "default_tags": ["Velocity", "Productividad", "Ejecución 10X", "Escalabilidad"]
    },
    {
        "path": os.path.join(INCUBADORA_BASE, 'MOMENTUM'),
        "category": "MOMENTUM_DESPEGUE",
        "default_tags": ["Momentum", "Despegue", "Tracción", "Comercialización"]
    }
]

def clean_text(text):
    text = re.sub(r'[\r\n]+', '\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    return text.strip()

def extract_title_and_summary(file_name, content):
    base_name = os.path.splitext(file_name)[0]
    # Limpiar prefijos numéricos y timestamps
    clean_title = re.sub(r'^\d+_\d+_\d+_\d+_[a-f0-9]*_?', '', base_name)
    clean_title = re.sub(r'^\[.*?\]\s*', '', clean_title)
    clean_title = clean_title.replace('_', ' ').strip()
    if len(clean_title) < 5:
        clean_title = base_name.replace('_', ' ')

    lines = [l.strip() for l in content.split('\n') if l.strip()]
    first_meaningful_lines = [l for l in lines if not l.startswith('#') and len(l) > 20][:4]
    summary = " ".join(first_meaningful_lines)[:350]
    if not summary and lines:
        summary = lines[0][:250]

    return clean_title, summary

def process_file(file_path, category, default_tags):
    file_name = os.path.basename(file_path)
    content = ""
    for enc in ['utf-8', 'latin-1', 'cp1252']:
        try:
            with open(file_path, 'r', encoding=enc, errors='ignore') as f:
                content = f.read()
            break
        except:
            continue

    if not content or len(content.strip()) < 50:
        return None

    # Filtrar notas triviales vacías
    cleaned = clean_text(content)
    if len(cleaned) < 80:
        return None

    title, summary = extract_title_and_summary(file_name, cleaned)

    # Generar ID determinista basado en el contenido y la ruta
    node_id_hash = hashlib.md5((category + file_name).encode('utf-8')).hexdigest()[:10]
    node_id = f"RAG-INCUBADORA-{category[:12]}-{node_id_hash}".upper()

    # Truncar contenido para mantener alta densidad de señal cognitiva
    condensed_content = cleaned[:3000]

    tags = list(set(default_tags + [category, "Incubadora EAR"]))

    return {
        "id": node_id,
        "title": title,
        "category": category,
        "summary": summary,
        "content": condensed_content,
        "tags": tags,
        "source_file": file_name
    }

def main():
    print("=" * 70)
    print("🧠 PIPELINE S-CLASS: INGESTA DE MINDMAPS & ESTRATEGIAS A BÓVEDA RAG")
    print("=" * 70)

    # 1. Cargar base de datos RAG actual
    if not os.path.exists(RAG_DB_PATH):
        print(f"[-] No se encontró base de datos RAG en: {RAG_DB_PATH}")
        return

    with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
        rag_db = json.load(f)

    initial_count = len(rag_db)
    print(f"[*] Nodos RAG actuales en la base: {initial_count}")

    existing_ids = {node.get("id") for node in rag_db}
    existing_titles = {node.get("title", "").lower() for node in rag_db}

    new_nodes = []
    processed_count = 0
    scanned_count = 0

    # 2. Recorrer directorios de alta prioridad
    for item in DIRECTORIES_TO_PROCESS:
        dir_path = item["path"]
        category = item["category"]
        tags = item["default_tags"]

        if not os.path.exists(dir_path):
            print(f"[-] Directorio no encontrado: {dir_path}")
            continue

        print(f"\n[*] Escaneando categoría: {category} ({dir_path})...")
        files = [os.path.join(dir_path, f) for f in os.listdir(dir_path) if os.path.isfile(os.path.join(dir_path, f))]
        scanned_count += len(files)

        category_added = 0
        for fpath in files:
            if not (fpath.endswith('.md') or fpath.endswith('.txt')):
                continue

            node = process_file(fpath, category, tags)
            if not node:
                continue

            processed_count += 1
            if node["id"] not in existing_ids and node["title"].lower() not in existing_titles:
                new_nodes.append(node)
                existing_ids.add(node["id"])
                existing_titles.add(node["title"].lower())
                category_added += 1

        print(f"  -> Archivos evaluados: {len(files)} | Nuevos nodos cognitivos generados: {category_added}")

    # 3. Inyectar de forma estrictamente aditiva
    if new_nodes:
        # Añadir al principio para máxima frescura
        rag_db = new_nodes + rag_db

        with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(rag_db, f, ensure_ascii=False, indent=2)

        print("\n" + "=" * 70)
        print(f"✅ INGESTA ADITIVA EXITOSA:")
        print(f"   • Nodos previos: {initial_count}")
        print(f"   • Nuevos nodos inyectados: {len(new_nodes)}")
        print(f"   • Total en Bóveda RAG: {len(rag_db)} nodos cognitivos")
        print("=" * 70)
    else:
        print("\n[!] No se encontraron nuevos nodos no redundantes para inyectar.")

if __name__ == '__main__':
    main()
