import os
import json
from pathlib import Path

# Configuración de SClass
CHATS_DIR = r"H:\00_PRODUCTORA_EAR\00_AVE_FENIX\03_AI_LOGS_CHATS"
KNOWLEDGE_FILE = r"H:\EAR_OS_MASTER_2026\01_SAAS_RAG_ENGINE\core\src\data\whisper_knowledge.json"

def inject_wisdom():
    print("🧠 INICIANDO INYECCIÓN DE SABIDURÍA (OPERACIÓN WHISPER)...")
    
    knowledge_base = []
    
    if not os.path.exists(CHATS_DIR):
        print(f"Error: No se encuentra la carpeta {CHATS_DIR}")
        return

    files = [f for f in os.listdir(CHATS_DIR) if f.endswith(('.txt', '.md', '.json'))]
    print(f"🔍 Localizados {len(files)} archivos de sabiduría.")

    for filename in files:
        filepath = os.path.join(CHATS_DIR, filename)
        try:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                # Extraemos pepitas de oro (limpieza básica)
                if len(content) > 100:
                    knowledge_base.append({
                        "source": filename,
                        "content": content[:5000] # Limitamos para no saturar el RAG inicial
                    })
        except Exception as e:
            print(f"Error leyendo {filename}: {e}")

    # Guardar la base de conocimiento consolidada
    os.makedirs(os.path.dirname(KNOWLEDGE_FILE), exist_ok=True)
    with open(KNOWLEDGE_FILE, 'w', encoding='utf-8') as jf:
        json.dump(knowledge_base, jf, indent=2, ensure_ascii=False)

    print(f"✅ Sabiduría inyectada: {len(knowledge_base)} nodos asimilados.")
    print(f"📡 Transmisión completada: {KNOWLEDGE_FILE}")
    print("conectado el puente.")

if __name__ == "__main__":
    inject_wisdom()
