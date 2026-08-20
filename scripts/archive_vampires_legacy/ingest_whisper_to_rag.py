import os
import json
import re

RAG_PATH = r"C:\EAR_OS_V2\src\data\ear-rag-database.json"
WHISPER_DIR = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER"
AMPLIFY_DIR = r"H:\incubadora despegue\AMPLIFY_MEDIA"
INFLUENCE_DIR = r"H:\incubadora despegue\INFLUENCE"

print("=== [*] INGESTA VECTORIAL DE CONOCIMIENTO WHISPER & INCUBADORA AL RAG DE EAR OS ===")

def clean_text(t):
    t = re.sub(r'\s+', ' ', t)
    return t.strip()

nodes_to_add = []

# 1. Ingestar Transcripciones Whisper
if os.path.exists(WHISPER_DIR):
    whisper_files = [f for f in os.listdir(WHISPER_DIR) if f.endswith(('.json', '.txt'))]
    print(f"[*] Analizando {len(whisper_files)} transcripciones Whisper...")
    
    for idx, f in enumerate(whisper_files):
        fpath = os.path.join(WHISPER_DIR, f)
        try:
            content = ""
            if f.endswith('.json'):
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as jf:
                    data = json.load(jf)
                    if isinstance(data, dict):
                        content = data.get('text', '') or str(data.get('segments', ''))
                    elif isinstance(data, list):
                        content = " ".join([str(item.get('text', '')) for item in data if isinstance(item, dict)])
            else:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as tf:
                    content = tf.read()

            content = clean_text(content)
            if len(content) > 120:
                # Truncar o fragmentar en fragmentos de alta densidad (hasta 1500 caracteres)
                summary_chunk = content[:1500]
                node_id = f"ASTRA-WHISPER-{idx+1:04d}"
                title = f"Whisper Intel: {f.replace('.json', '').replace('.txt', '').replace('_', ' ')}"
                
                nodes_to_add.append({
                    "id": node_id,
                    "title": title[:80],
                    "category": "WHISPER_TACTICAL_KNOWLEDGE",
                    "content": summary_chunk,
                    "tags": ["whisper", "incubadora", "copywriting", "hook_marketing", "lanzamientos", "oraculo_astra"]
                })
        except Exception as e:
            continue

print(f"[+] Nodos Whisper procesados: {len(nodes_to_add)}")

# 2. Ingestar frameworks Amplify & Influence
if os.path.exists(INFLUENCE_DIR):
    for f in os.listdir(INFLUENCE_DIR):
        fpath = os.path.join(INFLUENCE_DIR, f)
        if os.path.isfile(fpath) and f.endswith('.txt'):
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as tf:
                    content = clean_text(tf.read())
                    if len(content) > 100:
                        nodes_to_add.append({
                            "id": f"ASTRA-INFLUENCE-{len(nodes_to_add)+1:04d}",
                            "title": f"Influence Framework: {f}",
                            "category": "INFLUENCE_ARCHITECTURE",
                            "content": content[:1800],
                            "tags": ["influence", "persuasion", "posicionamiento", "alto_ticket"]
                        })
            except Exception:
                pass

print(f"[+] Total nuevos nodos listos para el RAG: {len(nodes_to_add)}")

# Cargar RAG existente y fusionar sin duplicados por ID
if os.path.exists(RAG_PATH):
    with open(RAG_PATH, 'r', encoding='utf-8') as rf:
        rag_db = json.load(rf)
else:
    rag_db = []

existing_ids = {n.get('id') for n in rag_db}
added_count = 0

for node in nodes_to_add:
    if node['id'] not in existing_ids:
        rag_db.append(node)
        existing_ids.add(node['id'])
        added_count += 1

with open(RAG_PATH, 'w', encoding='utf-8') as wf:
    json.dump(rag_db, wf, indent=2, ensure_ascii=False)

print(f"[OK] RAG ACTUALIZADO: {added_count} nuevos nodos inyectados exitosamente.")
print(f"[OK] Total nodos actuales en {RAG_PATH}: {len(rag_db)}")
