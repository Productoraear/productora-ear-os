import os
import time
import json
from datetime import datetime
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

print("👁️ INICIANDO DEMONIO CENTINELA RAG: ABSORCIÓN DINÁMICA EN TIEMPO REAL...")

whisper_dir = r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER"
rag_db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"

os.makedirs(whisper_dir, exist_ok=True)

# 1. Carga segura de la base de datos RAG actual
def load_rag_db():
    if os.path.exists(rag_db_path):
        try:
            with open(rag_db_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_rag_db(data):
    with open(rag_db_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

# 2. Lógica de inyección atómica de nodo RAG
def inject_transcript_to_rag(file_path):
    if not file_path.endswith(".txt"):
        return
    
    file_name = os.path.basename(file_path)
    stem_name = os.path.splitext(file_name)[0]
    
    # Determinar categoría según subcarpeta o nombre
    parent_dir = os.path.basename(os.path.dirname(file_path))
    source_label = "Incubadora Despegue"
    if "DANI_ARAGON" in parent_dir or "aragon" in stem_name.lower():
        source_label = "Dani Aragon"
    elif "ROMUALD" in parent_dir or "seo" in stem_name.lower():
        source_label = "Romuald Fons SEO"

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as tf:
            content = tf.read().strip()

        if not content:
            return

        rag_db = load_rag_db()
        
        # Comprobar si el nodo ya existe por título/archivo
        existing_node = next((n for n in rag_db if n.get("title") == stem_name or n.get("file_path") == file_path), None)

        if not existing_node:
            new_node = {
                "id": f"node_auto_{int(time.time())}_{hash(stem_name) % 10000}",
                "source": source_label,
                "category": parent_dir,
                "title": stem_name,
                "file_path": file_path,
                "content": content,
                "metadata": {
                    "words": len(content.split()),
                    "ingested_at": datetime.now().isoformat(),
                    "dynamic_ingest": True,
                    "graph_edges": [source_label, "Consultoria_CEO", "Estrategia_Artistica"]
                }
            }
            rag_db.append(new_node)
            save_rag_db(rag_db)
            print(f"⚡ [NODO RAG INYECTADO EN TIEMPO REAL] '{stem_name}' | Fuente: {source_label} | Total Bóveda: {len(rag_db)}")
        else:
            print(f"ℹ️ [NODO EXISTENTE] '{stem_name}' ya está sincronizado en el Grafo RAG.")
    except Exception as e:
        print(f"⚠️ Error absorbiendo {file_name}: {e}")

# 3. Manejador de eventos del sistema de archivos (Watchdog)
class TranscriptHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory and event.src_path.endswith(".txt"):
            time.sleep(0.5) # Pausa atómica para asegurar escritura completa
            inject_transcript_to_rag(event.src_path)

    def on_modified(self, event):
        if not event.is_directory and event.src_path.endswith(".txt"):
            inject_transcript_to_rag(event.src_path)

# 4. Escaneo inicial de sincronización rápida
print("🔍 Fase 1: Verificando y absorbiendo transcripciones presentes...")
for root, dirs, files in os.walk(whisper_dir):
    for f in files:
        if f.endswith(".txt"):
            inject_transcript_to_rag(os.path.join(root, f))

# 5. Activación de la escucha en tiempo real
print("\n🟢 Fase 2: MODO CENTINELA ACTIVO. Escuchando creaciones de archivos .txt futuras...")
print("💡 Mientras transcribas con Whisper en segundo plano, la BBDD RAG absorberá las respuestas automáticamente.")
print("   (Presiona Ctrl + C para detener la escucha)\n")

event_handler = TranscriptHandler()
observer = Observer()
observer.schedule(event_handler, whisper_dir, recursive=True)
observer.start()

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    observer.stop()
    print("\n🛑 Demonio centinela detenido.")
observer.join()
