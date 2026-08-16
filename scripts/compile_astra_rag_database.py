import os
import json
import re

legacy_dir = r"C:\EAR_OS_V2\BASE_DE_CONOCIMIENTO\archive\legacy_brain_dump"
output_rag = r"C:\EAR_OS_V2\src\data\ear-rag-database.json"

def compile_rag():
    rag_entries = []
    
    # 1. Base Genesis Knowledge
    rag_entries.append({
        "id": "ASTRA-CORE-GENOMA",
        "title": "Genoma Operativo EAR OS — S-Class Standard",
        "category": "ARQUITECTURA_GENETICA",
        "content": (
            "EAR OS es el sistema operativo de dominancia cultural e ingeniería acústica de Productora EAR. "
            "Estándar acústico: 12 W/pax para eventos en exterior o gran gala (Line Array Bose F1 Model 812 + Subwoofers). "
            "Microfonía: Shure Axient Digital / Beta 87A y Neumann de estudio para cero fatiga auditiva. "
            "Vertical VIMUME: Protocolo clínico de estimulación neural Gamma a 40Hz (MIT / Massachusetts Institute of Technology) "
            "para limpieza de placa amiloide y reactivación de memoria musical en pacientes de Alzheimer y tercera edad (+24% empatía reactiva). "
            "Modelo de monetización: Split 80/10/10 (80% Artista/Producción, 10% Afiliados/Prescriptores, 10% Mecenazgo VIMUME). "
            "Price-Lock Criptográfico SHA-256: 72 horas de congelación de tarifa con reserva garantizada de 10 €."
        ),
        "tags": ["acustica", "12w_pax", "bose", "shure", "40hz_gamma", "vimume", "split801010", "price_lock"]
    })

    # 2. Iterate legacy prompt files
    if os.path.exists(legacy_dir):
        files = sorted(os.listdir(legacy_dir))
        for filename in files:
            if not filename.endswith('.md'):
                continue
            filepath = os.path.join(legacy_dir, filename)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()

                # Extract meaningful knowledge snippets
                clean_content = re.sub(r'[\r\n]+', ' ', content[:3000]).strip()
                
                rag_entries.append({
                    "id": f"ASTRA-PROMPT-{filename.replace('.md', '')}",
                    "title": filename.replace('.md', '').replace('_', ' '),
                    "category": "PROMPT_MAESTRO_HERITAGE",
                    "content": clean_content,
                    "tags": ["prompt_maestro", "oraculo_astra", "ear_os"]
                })
            except Exception as e:
                print(f"Error reading {filename}: {e}")

    os.makedirs(os.path.dirname(output_rag), exist_ok=True)
    with open(output_rag, 'w', encoding='utf-8') as f_out:
        json.dump(rag_entries, f_out, ensure_ascii=False, indent=2)

    print(f"[OK] RAG Database compilada con {len(rag_entries)} nodos en {output_rag}")

if __name__ == "__main__":
    compile_rag()
