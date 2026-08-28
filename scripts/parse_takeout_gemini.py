#!/usr/bin/env python3
"""
═══════════════════════════════════════════════════════════════════════
PARSE_TAKEOUT_GEMINI.PY — INGESTIÓN FORENSE DE GOOGLE TAKEOUT
═══════════════════════════════════════════════════════════════════════
Reglas Aplicadas:
  - ZERO-TOKEN MEMORY (ZTM): Headless parsing, nunca se carga en LLM context.
  - PURIST ARCHIVIST: Delta indexing + SHA-256 + relocation al Vault.
  - HARD TOKEN CEILING: Output comprimido < 300 tokens para reporte final.

Entrada: docs/raw_takeout/ (archivos .json, .html o carpetas Gemini)
Salida:  src/data/ear-rag-database.json (payload comprimido)
Vault:   H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Gemini_Takeout\
═══════════════════════════════════════════════════════════════════════
"""

import os
import sys
import json
import hashlib
import shutil
import re
import glob
import zipfile
from datetime import datetime
from pathlib import Path

# ══════════════════════════════════════════════════════════════════════
# CONFIGURACIÓN
# ══════════════════════════════════════════════════════════════════════
PROJECT_ROOT = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
RAW_TAKEOUT_DIR = PROJECT_ROOT / "docs" / "raw_takeout"
RAG_DATABASE_PATH = PROJECT_ROOT / "src" / "data" / "ear-rag-database.json"
VAULT_BASE = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\Gemini_Takeout")
ARCHIVED_MANIFEST = PROJECT_ROOT / "scripts" / ".archived_manifest.json"
PROCESSED_HASHES = PROJECT_ROOT / "scripts" / ".processed_hashes.json"

# Palabras clave para filtrar contenido relevante (pepitas de oro)
GOLD_KEYWORDS = [
    # Negocio y Arquitectura EAR OS
    "ear os", "productora ear", "pricing", "stripe", "webhook", "split",
    "tarifa", "cotizador", "presupuesto", "factur", "revenue",
    # VIMUME y Social
    "vimume", "viaje musical", "memoria", "musicoterapia", "alzheimer",
    "demencia", "residencia", "mayores", "soledad", "dignif",
    "colibri", "colibrí", "40hz", "gamma", "neuroacústi",
    # Edwin Agudelo y Legado
    "edwin agudelo", "legado", "cantante", "compositor", "tenor",
    "artistas emergentes", "artista", "mariachi",
    # Desarrollo y TypeScript
    "next.js", "typescript", "vercel", "deploy", "build",
    "hungarianAlgorithm", "pricing-engine", "pseo", "municipio",
    # Stakeholders
    "stakeholder", "ayuntamiento", "b2g", "b2b", "b2c",
    "impulsa europa", "subvención", "europa creativa", "horizon",
    "prtr", "nextgeneration", "lcsp", "cpv",
    # Storyselling
    "storyselling", "story", "persuasi", "copywriting", "landing",
]


def sha256_of_file(filepath: str) -> str:
    """Calcula el hash SHA-256 de un archivo."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def sha256_of_string(text: str) -> str:
    """Calcula el hash SHA-256 de un string."""
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def load_json_safe(path: Path) -> dict | list:
    """Carga un JSON con manejo de errores."""
    if path.exists():
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except (json.JSONDecodeError, UnicodeDecodeError):
            return {}
    return {}


def load_processed_hashes() -> dict:
    """Carga el registro de hashes procesados (Delta Indexing)."""
    data = load_json_safe(PROCESSED_HASHES)
    if isinstance(data, dict):
        return data
    return {}


def save_processed_hashes(hashes: dict):
    """Guarda el registro de hashes procesados."""
    PROCESSED_HASHES.parent.mkdir(parents=True, exist_ok=True)
    with open(PROCESSED_HASHES, "w", encoding="utf-8") as f:
        json.dump(hashes, f, indent=2, ensure_ascii=False)


def load_archived_manifest() -> list:
    """Carga el manifiesto de archivos archivados."""
    data = load_json_safe(ARCHIVED_MANIFEST)
    if isinstance(data, list):
        return data
    return []


def save_archived_manifest(manifest: list):
    """Guarda el manifiesto de archivos archivados."""
    ARCHIVED_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    with open(ARCHIVED_MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)


def extract_zip_files():
    """Extrae archivos ZIP encontrados en raw_takeout."""
    zip_files = list(RAW_TAKEOUT_DIR.glob("*.zip"))
    for zf in zip_files:
        print(f"  📦 Extrayendo ZIP: {zf.name}")
        extract_dir = RAW_TAKEOUT_DIR / zf.stem
        extract_dir.mkdir(parents=True, exist_ok=True)
        try:
            with zipfile.ZipFile(str(zf), "r") as z:
                z.extractall(str(extract_dir))
            print(f"     ✅ Extraído en: {extract_dir}")
        except zipfile.BadZipFile:
            print(f"     ⚠️ ZIP corrupto o inválido: {zf.name}")


def is_gold_content(text: str) -> bool:
    """Verifica si un bloque de texto contiene palabras clave de valor."""
    text_lower = text.lower()
    matches = sum(1 for kw in GOLD_KEYWORDS if kw.lower() in text_lower)
    return matches >= 2  # Al menos 2 keywords para considerar "pepita de oro"


def extract_gold_from_json(filepath: Path) -> list:
    """Extrae mensajes relevantes de un archivo JSON de Gemini."""
    nuggets = []
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, UnicodeDecodeError) as e:
        print(f"     ⚠️ Error parseando {filepath.name}: {e}")
        return nuggets

    # Manejar distintos formatos de Takeout de Gemini
    conversations = []
    if isinstance(data, list):
        conversations = data
    elif isinstance(data, dict):
        # Posible formato con clave "conversations" o similar
        for key in ["conversations", "chats", "messages", "data"]:
            if key in data and isinstance(data[key], list):
                conversations = data[key]
                break
        if not conversations:
            conversations = [data]

    for conv in conversations:
        if isinstance(conv, dict):
            # Extraer mensajes del usuario y del modelo
            messages = conv.get("messages", conv.get("turns", []))
            if not isinstance(messages, list):
                # Intentar extraer texto directo del dict
                text = json.dumps(conv, ensure_ascii=False)
                if is_gold_content(text):
                    nuggets.append({
                        "source": filepath.name,
                        "type": "conversation_fragment",
                        "content": text[:2000],  # Limitar tamaño
                        "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in text.lower()],
                    })
                continue

            conv_text_parts = []
            for msg in messages:
                if isinstance(msg, dict):
                    # Formatos posibles: "text", "content", "parts"
                    text = ""
                    if "text" in msg:
                        text = msg["text"]
                    elif "content" in msg:
                        text = msg["content"] if isinstance(msg["content"], str) else json.dumps(msg["content"], ensure_ascii=False)
                    elif "parts" in msg and isinstance(msg["parts"], list):
                        text = " ".join(
                            p.get("text", "") if isinstance(p, dict) else str(p)
                            for p in msg["parts"]
                        )
                    conv_text_parts.append(text)

            full_conv_text = "\n".join(conv_text_parts)
            if is_gold_content(full_conv_text):
                # Condensar: solo los primeros 3000 chars
                nuggets.append({
                    "source": filepath.name,
                    "type": "gemini_conversation",
                    "title": conv.get("title", conv.get("name", filepath.stem)),
                    "content": full_conv_text[:3000],
                    "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in full_conv_text.lower()],
                    "timestamp": conv.get("createTime", conv.get("create_time", "")),
                })
        elif isinstance(conv, str):
            if is_gold_content(conv):
                nuggets.append({
                    "source": filepath.name,
                    "type": "text_fragment",
                    "content": conv[:2000],
                    "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in conv.lower()],
                })

    return nuggets


def extract_gold_from_txt(filepath: Path) -> list:
    """Extrae texto relevante de archivos TXT de conversaciones Gemini."""
    nuggets = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            raw_text = f.read()
    except Exception as e:
        print(f"     Warning: Error leyendo {filepath.name}: {e}")
        return nuggets

    # Dividir en bloques por turnos de conversacion
    # Gemini Workspace suele tener formato: "User: ...\nModel: ..."
    blocks = re.split(r"\n{2,}", raw_text)
    
    # Procesar bloques individuales y agrupados
    current_chunk = []
    chunk_size = 0
    
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        current_chunk.append(block)
        chunk_size += len(block)
        
        # Cada ~3000 chars, evaluar el chunk acumulado
        if chunk_size >= 3000:
            combined = "\n".join(current_chunk)
            if is_gold_content(combined):
                nuggets.append({
                    "source": filepath.name,
                    "type": "gemini_workspace_conversation",
                    "title": filepath.stem,
                    "content": combined[:3000],
                    "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in combined.lower()],
                })
            current_chunk = []
            chunk_size = 0
    
    # Procesar el ultimo chunk restante
    if current_chunk:
        combined = "\n".join(current_chunk)
        if is_gold_content(combined):
            nuggets.append({
                "source": filepath.name,
                "type": "gemini_workspace_conversation",
                "title": filepath.stem,
                "content": combined[:3000],
                "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in combined.lower()],
            })
    
    # Tambien evaluar el texto completo como una sola pieza
    if not nuggets and is_gold_content(raw_text):
        nuggets.append({
            "source": filepath.name,
            "type": "gemini_workspace_full",
            "title": filepath.stem,
            "content": raw_text[:3000],
            "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in raw_text.lower()],
        })

    return nuggets


def extract_gold_from_html(filepath: Path) -> list:
    """Extrae texto relevante de archivos HTML de Gemini."""
    nuggets = []
    try:
        with open(filepath, "r", encoding="utf-8", errors="replace") as f:
            raw_html = f.read()
    except Exception as e:
        print(f"     ⚠️ Error leyendo {filepath.name}: {e}")
        return nuggets

    # Limpiar HTML: quitar tags, dejar texto plano
    clean_text = re.sub(r"<[^>]+>", " ", raw_html)
    clean_text = re.sub(r"\s+", " ", clean_text).strip()

    if is_gold_content(clean_text):
        nuggets.append({
            "source": filepath.name,
            "type": "html_conversation",
            "content": clean_text[:3000],
            "keywords_matched": [kw for kw in GOLD_KEYWORDS if kw.lower() in clean_text.lower()],
        })

    return nuggets


def inject_into_rag(nuggets: list):
    """Inyecta las pepitas de oro en el RAG database."""
    RAG_DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)

    existing_rag = load_json_safe(RAG_DATABASE_PATH)
    if not isinstance(existing_rag, dict):
        existing_rag = {}

    # Crear o actualizar la sección de Takeout
    if "takeout_gemini" not in existing_rag:
        existing_rag["takeout_gemini"] = {
            "description": "Pepitas de oro extraídas del historial de Gemini (Google Takeout)",
            "extraction_date": datetime.now().isoformat(),
            "total_nuggets": 0,
            "nuggets": [],
        }

    # Deduplicar por hash de contenido
    existing_hashes = set()
    for n in existing_rag["takeout_gemini"].get("nuggets", []):
        if "content_hash" in n:
            existing_hashes.add(n["content_hash"])

    new_count = 0
    for nugget in nuggets:
        content_hash = sha256_of_string(nugget.get("content", ""))
        if content_hash not in existing_hashes:
            nugget["content_hash"] = content_hash
            nugget["ingested_at"] = datetime.now().isoformat()
            existing_rag["takeout_gemini"]["nuggets"].append(nugget)
            existing_hashes.add(content_hash)
            new_count += 1

    existing_rag["takeout_gemini"]["total_nuggets"] = len(existing_rag["takeout_gemini"]["nuggets"])
    existing_rag["takeout_gemini"]["last_updated"] = datetime.now().isoformat()

    with open(RAG_DATABASE_PATH, "w", encoding="utf-8") as f:
        json.dump(existing_rag, f, indent=2, ensure_ascii=False)

    return new_count


def relocate_to_vault(processed_files: list):
    """Mueve archivos crudos procesados al EAR_ABSORBED_VAULT."""
    today = datetime.now().strftime("%Y-%m-%d")
    vault_dir = VAULT_BASE / f"{today}_gemini_history"
    vault_dir.mkdir(parents=True, exist_ok=True)

    manifest = load_archived_manifest()

    for fpath in processed_files:
        src = Path(fpath)
        if not src.exists():
            continue
        dest = vault_dir / src.name
        try:
            shutil.move(str(src), str(dest))
            file_hash = sha256_of_file(str(dest))
            manifest.append({
                "original_path": str(src),
                "vault_path": str(dest),
                "sha256": file_hash,
                "archived_at": datetime.now().isoformat(),
            })
            print(f"  📦 Archivado: {src.name} → {dest}")
        except Exception as e:
            print(f"  ⚠️ Error moviendo {src.name}: {e}")

    save_archived_manifest(manifest)
    return len(processed_files)


def main():
    print("═" * 70)
    print("  PARSE_TAKEOUT_GEMINI.PY — INGESTIÓN FORENSE ZTM")
    print("═" * 70)
    print()

    # 1. Verificar que existe el directorio de entrada
    if not RAW_TAKEOUT_DIR.exists():
        print("❌ ERROR: No existe el directorio docs/raw_takeout/")
        print("   Descarga tu Google Takeout y colócalo ahí primero.")
        sys.exit(1)

    # 2. Extraer ZIPs si los hay
    print("📋 FASE 1: Extracción de archivos ZIP...")
    extract_zip_files()

    # 3. Escanear archivos relevantes
    print("\n📋 FASE 2: Escaneo de archivos JSON, HTML, TXT y MD...")
    all_files = []
    for ext in ["*.json", "*.html", "*.txt", "*.md"]:
        all_files.extend(RAW_TAKEOUT_DIR.rglob(ext))

    if not all_files:
        print("No se encontraron archivos en docs/raw_takeout/")
        print("   Descarga tu Google Takeout y deposita los archivos aqui:")
        print(f"   {RAW_TAKEOUT_DIR}")
        sys.exit(0)

    print(f"   Encontrados {len(all_files)} archivos para procesar.")

    # 4. Delta Indexing: filtrar ya procesados
    processed_hashes = load_processed_hashes()
    files_to_process = []
    for f in all_files:
        fhash = sha256_of_file(str(f))
        if fhash not in processed_hashes:
            files_to_process.append((f, fhash))
        else:
            print(f"   ⏭️ Ya procesado (delta skip): {f.name}")

    if not files_to_process:
        print("\n✅ Todos los archivos ya fueron procesados anteriormente (Delta OK).")
        sys.exit(0)

    print(f"   {len(files_to_process)} archivos nuevos para procesar.")

    # 5. Extraer pepitas de oro
    print("\n📋 FASE 3: Extracción de pepitas de oro...")
    all_nuggets = []
    processed_file_paths = []

    for filepath, fhash in files_to_process:
        print(f"   🔍 Procesando: {filepath.name} ({filepath.stat().st_size:,} bytes)")

        ext = filepath.suffix.lower()
        if ext == ".json":
            nuggets = extract_gold_from_json(filepath)
        elif ext == ".html":
            nuggets = extract_gold_from_html(filepath)
        elif ext in [".txt", ".md"]:
            nuggets = extract_gold_from_txt(filepath)
        else:
            continue

        all_nuggets.extend(nuggets)
        processed_hashes[fhash] = {
            "file": filepath.name,
            "processed_at": datetime.now().isoformat(),
            "nuggets_found": len(nuggets),
        }
        processed_file_paths.append(str(filepath))
        print(f"     → {len(nuggets)} pepitas de oro encontradas")

    save_processed_hashes(processed_hashes)

    # 6. Inyectar en RAG
    print(f"\n📋 FASE 4: Inyección en RAG ({RAG_DATABASE_PATH.name})...")
    new_count = inject_into_rag(all_nuggets)
    print(f"   ✅ {new_count} pepitas nuevas inyectadas en el RAG.")

    # 7. Relocar crudos al Vault
    print("\n📋 FASE 5: Reubicación de crudos al EAR_ABSORBED_VAULT...")
    relocated = relocate_to_vault(processed_file_paths)
    print(f"   ✅ {relocated} archivos movidos al Vault.")

    # 8. Reporte final comprimido (< 300 tokens)
    print("\n" + "═" * 70)
    print("  📊 REPORTE FINAL DE INGESTIÓN FORENSE (ZTM)")
    print("═" * 70)
    print(f"  Archivos escaneados:     {len(all_files)}")
    print(f"  Archivos procesados:     {len(files_to_process)}")
    print(f"  Pepitas de oro totales:  {len(all_nuggets)}")
    print(f"  Nuevas inyectadas en RAG:{new_count}")
    print(f"  Archivos al Vault:       {relocated}")
    print(f"  RAG path:                {RAG_DATABASE_PATH}")
    print(f"  Vault path:              {VAULT_BASE}")
    print("═" * 70)
    print("  ✅ INGESTIÓN COMPLETADA — ZTM & PURIST ARCHIVIST RESPETADOS")
    print("═" * 70)


if __name__ == "__main__":
    main()
