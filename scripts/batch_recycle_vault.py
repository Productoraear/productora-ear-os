import os
import json
import re

RAG_DB_PATH = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\ear-rag-database.json"
VAULT_DIRS = [
    r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\EAR_OS_RECONSTRUCCION_FINAL\public\data",
    r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\DOCUMENTOS",
    r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\Mi unidad\EAR_OS_CEO_DIRECTIVAS\PROCESADOS",
    r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\Mi unidad\EAR_OS_CEO_DIRECTIVAS\PEPITAS_DE_ORO"
]

def load_rag_db():
    if os.path.exists(RAG_DB_PATH):
        try:
            with open(RAG_DB_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {"version": "3.0", "updated_at": "2026-08-23", "documents": []}
    return {"version": "3.0", "updated_at": "2026-08-23", "documents": []}

def save_rag_db(data):
    os.makedirs(os.path.dirname(RAG_DB_PATH), exist_ok=True)
    with open(RAG_DB_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def extract_ip_metadata(filepath):
    try:
        with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
            text = f.read()
    except Exception:
        return None

    # Check for DNDA / SGAE / Registration markers
    if "REGISTRO" in text.upper() and ("DERECHO DE AUTOR" in text.upper() or "PROPIEDAD INTELECTUAL" in text.upper() or "MINISTERIO DEL INTERIOR" in text.upper()):
        tomo_match = re.search(r"Partida\s*\*?\*?([0-9\-]+)", text, re.IGNORECASE)
        fecha_match = re.search(r"Fecha\s*Registro\s*\*?\*?([0-9a-zA-Z\s\-]+)", text, re.IGNORECASE)
        autor_match = re.search(r"EDWIN\s+ALBERTO\s+AGUDELO\s+RESTREPO", text, re.IGNORECASE)
        obra_match = re.search(r"Título\s*Original.*?([A-ZÁÉÍÓÚÑ\s]{3,40})\s+[0-9]{4}", text, re.IGNORECASE)
        
        titulo = obra_match.group(1).strip() if obra_match else os.path.basename(filepath)
        partida = tomo_match.group(1).strip() if tomo_match else "DESCONOCIDA"
        
        return {
            "id": f"DNDA-{partida.replace('-', '')}",
            "tipo": "CERTIFICADO_PROPIEDAD_INTELECTUAL",
            "categoria": "DERECHOS_DE_AUTOR",
            "titulo": f"Registro de Propiedad Intelectual: {titulo}",
            "obra": titulo,
            "autor": "Edwin Alberto Agudelo Restrepo",
            "titular_id": "71758247",
            "entidad_emisora": "Dirección Nacional de Derecho de Autor (DNDA) / MinInterior",
            "partida_registro": partida,
            "licencias_admisibles": ["Sincronización TV/Cine", "Streaming B2B", "Ejecución Pública Directo (Split 80/10/10)"],
            "archivo_origen": filepath,
            "resumen_juridico": f"Obra musical/literaria '{titulo}' protegida legalmente bajo partida DNDA {partida}. Máster y derechos de composición 100% titularidad de Edwin Agudelo. Habilitada para Split Soberano."
        }
    return None

def run():
    print("Iniciando escaneo y extracción off-context para RAG...")
    raw_data = load_rag_db()
    if isinstance(raw_data, list):
        docs_list = raw_data
        is_list_format = True
    else:
        docs_list = raw_data.get("documents", [])
        is_list_format = False

    existing_ids = {doc.get("id") for doc in docs_list if isinstance(doc, dict)}
    added_count = 0

    for vdir in VAULT_DIRS:
        if not os.path.exists(vdir):
            continue
        for root, _, files in os.walk(vdir):
            for f in files:
                if f.endswith((".md", ".txt")):
                    fp = os.path.join(root, f)
                    meta = extract_ip_metadata(fp)
                    if meta and meta["id"] not in existing_ids:
                        docs_list.append(meta)
                        existing_ids.add(meta["id"])
                        added_count += 1
                        print(f"Ingestado activo de PI: {meta['titulo']} [{meta['id']}]")

    # Ingest core business models for DJ streaming and synchronization
    b2b_streaming_model = {
        "id": "EAR-BIZ-B2B-STREAMING-VENUE-01",
        "tipo": "MODELO_NEGOCIO_ESTRATEGICO",
        "categoria": "MONETIZACION_B2B_STREAMING",
        "titulo": "SaaS Reproductor B2B para Fincas, Restaurantes y Discotecas",
        "tarifa_mensual": "149€ - 349€ / mes por venue",
        "distribucion_split": "70% Fondo Regalías Artistas / 20% Plataforma EAR OS / 10% VIMUME",
        "sociedades_asociadas": ["SGAE", "AIE", "AGEDI"],
        "funcionalidad": "Reproductor web embebido con reporting de temas y fonogramas emitidos para blindaje legal de hostelería.",
        "status": "ACTIVO_PRODUCCION"
    }

    if b2b_streaming_model["id"] not in existing_ids:
        docs_list.append(b2b_streaming_model)
        added_count += 1

    if is_list_format:
        save_rag_db(docs_list)
    else:
        raw_data["documents"] = docs_list
        save_rag_db(raw_data)
        
    print(f"Finalizado. Documentos nuevos ingestados en RAG: {added_count}. Total documentos: {len(docs_list)}")

if __name__ == "__main__":
    run()
