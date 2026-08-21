import os
import re
import json
import string
import whisper
import subprocess
from datetime import datetime

print("🧠 INICIANDO MOTOR VANGUARDISTA DE TRANSCRIPCIÓN Y GRAFOS RAG...")

base_output_dir = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER"
rag_db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"

os.makedirs(os.path.join(base_output_dir, "01_INCUBADORA_DESPEGUE"), exist_ok=True)
os.makedirs(os.path.join(base_output_dir, "02_DANI_ARAGON"), exist_ok=True)
os.makedirs(os.path.join(base_output_dir, "03_ROMUALD_FONS_SEO"), exist_ok=True)

# 1. Cargar la BBDD RAG existente
rag_nodes = []
if os.path.exists(rag_db_path):
    try:
        with open(rag_db_path, "r", encoding="utf-8") as rf:
            rag_nodes = json.load(rf)
        print(f"📊 Bóveda RAG cargada: {len(rag_nodes)} nodos existentes.")
    except Exception:
        rag_nodes = []

# 2. Detector de integridad ultrarrápido con FFmpeg
def is_media_valid(file_path):
    try:
        cmd = ["ffmpeg", "-v", "error", "-i", file_path, "-f", "null", "-"]
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=2)
        return res.returncode == 0
    except Exception:
        return True

# 3. Clasificación de archivos por patrones de ruta/nombre
def classify_file(file_path):
    lower_p = file_path.lower()
    if any(k in lower_p for k in ["incubadora", "despegue", "ear_os", "vampire", "amplify"]):
        return "01_INCUBADORA_DESPEGUE", "Incubadora Despegue"
    elif any(k in lower_p for k in ["dani aragon", "dani_aragon", "aragon", "musical", "marketing_musical"]):
        return "02_DANI_ARAGON", "Dani Aragon"
    elif any(k in lower_p for k in ["romuald", "fons", "seo_romuald", "armados"]):
        return "03_ROMUALD_FONS_SEO", "Romuald Fons SEO"
    return None, None

# 4. Escaneo enfocado en FASE 1 (Incubadora + Dani Aragón)
media_exts = {".mp4", ".m4a", ".mp3", ".wav", ".mkv", ".mov"}
skip_dirs = {"windows", "$recycle.bin", "program files", "node_modules", ".git", "appdata"}
drives = [f"{d}:\\" for d in string.ascii_uppercase if os.path.exists(f"{d}:\\")]

target_queue = []

print("🔎 Rastreando archivos multimedia de Incubadora y Dani Aragón en todo el PC...")
for drive in drives:
    for root, dirs, files in os.walk(drive):
        dirs[:] = [d for d in dirs if d.lower() not in skip_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in media_exts:
                full_p = os.path.join(root, file)
                category, source_label = classify_file(full_p)
                
                # FASE 1: Filtrar solo Incubadora y Dani Aragón
                if category in ["01_INCUBADORA_DESPEGUE", "02_DANI_ARAGON"]:
                    target_queue.append((full_p, category, source_label))

print(f"🎯 Cola focalizada FASE 1: {len(target_queue)} archivos detectados.")

if target_queue:
    print("🚀 Cargando modelo Whisper (Small)...")
    model = whisper.load_model("small")
    
    new_rag_count = 0
    for idx, (media_p, category, source_label) in enumerate(target_queue, 1):
        file_name = os.path.basename(media_p)
        stem_name = os.path.splitext(file_name)[0]
        out_txt_p = os.path.join(base_output_dir, category, f"{stem_name}.txt")
        
        if os.path.exists(out_txt_p):
            continue
            
        print(f"\n⚡ [{idx}/{len(target_queue)}] Validando integridad: {file_name}...")
        if not is_media_valid(media_p):
            print(f"🚫 Archivo corrupto o sin moov atom ignorado en <1s: {file_name}")
            continue
            
        print(f"🎙️ Transcribiendo [{source_label}]: {file_name}...")
        try:
            res = model.transcribe(media_p, language="es")
            text_content = res.get("text", "").strip()
            
            if text_content:
                # Guardar .txt limpio
                with open(out_txt_p, "w", encoding="utf-8") as tf:
                    tf.write(text_content)
                
                # Crear Nodo de Grafo para el RAG S-Class
                graph_node = {
                    "id": f"node_{source_label.lower().replace(' ', '_')}_{int(datetime.now().timestamp())}",
                    "source": source_label,
                    "category": category,
                    "title": stem_name,
                    "file_path": out_txt_p,
                    "content": text_content,
                    "metadata": {
                        "words": len(text_content.split()),
                        "ingested_at": datetime.now().isoformat(),
                        "graph_edges": [source_label, "Consultoria_CEO", "Estrategia_Artistica"]
                    }
                }
                
                rag_nodes.append(graph_node)
                new_rag_count += 1
                
                # Guardar BBDD RAG atómicamente cada 3 transcripciones
                if new_rag_count % 3 == 0:
                    with open(rag_db_path, "w", encoding="utf-8") as rf:
                        json.dump(rag_nodes, rf, ensure_ascii=False, indent=2)
                    print(f"💾 [RAG GRAPH UPDATED] Bóveda escalada a {len(rag_nodes)} nodos cognitivos.")
                    
        except Exception as e:
            print(f"⚠️ Error al transcribir {file_name}: {e}")

    # Guardado final de la BBDD RAG
    with open(rag_db_path, "w", encoding="utf-8") as rf:
        json.dump(rag_nodes, rf, ensure_ascii=False, indent=2)

    print(f"\n✅ FASE 1 COMPLETADA. {new_rag_count} nuevos nodos cognitivos añadidos al Grafo RAG.")
