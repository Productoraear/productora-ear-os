import os
import sys
import json
import hashlib
from datetime import datetime

# Rutas del Hub Externo
HUB_ORACLE_BASE = r"H:\EAR_INGESTION_HUB\06_ORACULO_ESTRATEGICO"
PROJECT_ROOT = r"H:\EAR_OS_V2\EAR_OS_V2"
OUTPUT_SSOT_PATH = os.path.join(PROJECT_ROOT, "src", "data", "oraculo-rag-ssot.json")

# Poda de Alta Densidad (≥ 85% reducción)
# Extrae solo texto de alto valor para mantener JSON < 15MB
def extract_high_density_signal(filepath, max_chars=8000):
    ext = os.path.splitext(filepath)[1].lower()
    text = ""
    try:
        if ext in ['.txt', '.md', '.json', '.vtt', '.srt']:
            with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read(max_chars)
        elif ext == '.docx':
            import docx
            doc = docx.Document(filepath)
            paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
            text = "\n".join(paragraphs[:40])
    except Exception as e:
        print(f"[!] Error leyendo {filepath}: {e}")
        return None

    # Filtrar líneas vacías o de bajo contenido (timestamps VTT, etc)
    lines = text.split('\n')
    filtered_lines = []
    for l in lines:
        l = l.strip()
        # Eliminar timestamps (00:00:01.000 -->) y líneas menores de 4 palabras
        if '-->' in l or len(l.split()) < 4:
            continue
        filtered_lines.append(l)

    condensed_text = " ".join(filtered_lines)[:1000] # Limite estricto de 1000 chars por chunk
    return condensed_text if len(condensed_text) > 50 else None

def run_vampire_miner():
    print("=" * 80)
    print("VAMPIRE ORACLE MINER: BARRIDO DE ALTA DENSIDAD")
    print("=" * 80)

    if not os.path.exists(HUB_ORACLE_BASE):
        print(f"[!] Carpeta {HUB_ORACLE_BASE} no encontrada. Creándola para ingesta futura...")
        os.makedirs(HUB_ORACLE_BASE, exist_ok=True)
        # Modo fallback para dry run / vacío
    
    rag_chunks = []
    processed_count = 0
    total_bytes_extracted = 0

    for root, _, files in os.walk(HUB_ORACLE_BASE):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in ['.txt', '.json', '.docx', '.md', '.vtt', '.srt']:
                filepath = os.path.join(root, f)
                
                # Extraer señal pura
                signal = extract_high_density_signal(filepath)
                if signal:
                    file_hash = hashlib.sha256(f.encode()).hexdigest()[:12]
                    
                    # Inferencia básica de taxonomía para el selector del IDE
                    category = "hibrido"
                    if any(k in f.lower() for k in ['daniel', 'aragon', 'marketing', 'embudo']):
                        category = "corporativo"
                    elif any(k in f.lower() for k in ['artista', 'musico', 'conservatorio', 'actuacion']):
                        category = "artistico"

                    chunk = {
                        "id": f"ORACLE-{len(rag_chunks):04d}-{file_hash}",
                        "source": f,
                        "category": category,
                        "density_signal": signal,
                        "timestamp": datetime.now().isoformat()
                    }
                    rag_chunks.append(chunk)
                    total_bytes_extracted += len(signal)
                    processed_count += 1

    # Compilar el SSOT
    os.makedirs(os.path.dirname(OUTPUT_SSOT_PATH), exist_ok=True)
    
    payload = {
        "metadata": {
            "system": "EAR OS Oráculo // ZTM Neural Engine",
            "compiled_at": datetime.now().isoformat(),
            "total_mined_assets": processed_count,
            "latency_target": "< 80ms"
        },
        "neural_chunks": rag_chunks
    }

    with open(OUTPUT_SSOT_PATH, 'w', encoding='utf-8') as out_f:
        json.dump(payload, out_f, ensure_ascii=False)

    final_size_mb = os.path.getsize(OUTPUT_SSOT_PATH) / (1024 * 1024)

    print(f"\n[OK] Barrido finalizado. {processed_count} activos procesados.")
    print(f"[OK] Archivo SSOT: {OUTPUT_SSOT_PATH}")
    print(f"[OK] Tamaño final: {final_size_mb:.2f} MB (Límite 15 MB)")
    if final_size_mb > 15:
        print("[WARNING] El tamaño excede 15MB. Riesgo de latencia ZTM.")

if __name__ == "__main__":
    run_vampire_miner()
