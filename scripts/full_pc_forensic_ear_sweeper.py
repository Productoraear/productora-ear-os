#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
═══════════════════════════════════════════════════════════════════════
  🕵️ EAR OS V2 — BARRIDO FORENSE ZTM DE TODO EL PC (C:\, D:\, H:\, ...)
  Rol: Forensic Data Miner + Lead Archivist (Purist Archivist Protocol)

  Misión:
    1. Detectar dinámicamente todas las unidades de disco locales.
    2. Recorrer cada unidad respetando la Lista Negra Estricta del sistema.
    3. Filtrar por extensiones permitidas (documentos).
    4. Clasificar semánticamente en 5 categorías EAR/VIMUME/Edwin Agudelo.
    5. Protocolo ZTM: SHA-256 → dedup (.processed_hashes.json) → resumen <300 tokens
       → inyección en src/data/ear-rag-database.json → reubicación física a
       H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\{Categoria}\[YYYY-MM-DD]_{NombreOriginal}
    6. Actualizar .archived_manifest.json, .processed_hashes.json y registry.json.

  Robustez (v2):
    - Presupuesto de tiempo duro: SIEMPRE finaliza e imprime el informe.
    - Silencio del fd 2 durante extracción (evita inundación de PyMuPDF/pypdf).
    - Soporte long-path Windows (\\?\) con fallback para copias/movidos profundos.
    - Poda agresiva: proyecto activo, bóveda y directorios sistema se recortan.

  CLI:  python scripts/full_pc_forensic_ear_sweeper.py
═══════════════════════════════════════════════════════════════════════
"""
import os
import re
import sys
import json
import shutil
import hashlib
import string
import contextlib
import unicodedata
import zipfile
from datetime import datetime

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ─────────────────────────── RUTAS INMUTABLES (SSOT) ────────────────────────
PROJECT_ROOT = r"H:\EAR_OS_V2\EAR_OS_V2"
VAULT_BASE   = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT"
RAG_DB_PATH  = os.path.join(PROJECT_ROOT, "src", "data", "ear-rag-database.json")
MANIFEST     = os.path.join(PROJECT_ROOT, "scripts", ".archived_manifest.json")
HASHES       = os.path.join(PROJECT_ROOT, "scripts", ".processed_hashes.json")
REGISTRY     = os.path.join(PROJECT_ROOT, "scripts", "registry.json")

# ─────────────────────── LISTA NEGRA ESTRICTA (OBLIGATORIA) ────────────────
BLACKLIST_NAMES = {
    "WINDOWS", "PROGRAM FILES", "PROGRAM FILES (X86)", "SYSTEM VOLUME INFORMATION",
    "$RECYCLE.BIN", "APPDATA", "NODE_MODULES", ".GIT", ".NEXT", ".TURBO", ".VSCODE",
    ".CACHE", "EAR_ABSORBED_VAULT", "TEMP", "PROGRAMDATA",
}

# ─────────────────────────── EXTENSIONES PERMITIDAS ────────────────────────
ALLOWED_EXTS = {".pdf", ".docx", ".doc", ".txt", ".md", ".json", ".csv", ".xlsx", ".rtf", ".html", ".htm"}

# ─────────────────────── TAXONOMÍA SEMÁNTICA (PRIORIDAD) ──────────
CATEGORIES = [
    ("MARIACHIS_Y_REPERTORIO", ["mariachi", "charro", "serenata", "vihuela", "guitarron", "edwin agudelo"]),
    ("VIMUME_NEUROCIENCIA",   ["vimume", "alzheimer", "musicoterapia", "estimulacion cognitiva", "geriatrico", "residencia"]),
    ("PRODUCCION_Y_RIDERS",   ["rider", "bose f1", "shure beta", "db technologies", "12 w/pax", "presion sonora", "spl"]),
    ("LEGAL_Y_CONTRATOS",     ["contrato", "dnda", "sgae", "aie", "derechos de autor", "partida 10-", "licitacion", "art 118", "pliego"]),
    ("STORYSELLING_Y_PRECIOS",["storyselling", "biografia", "trayectoria", "tarifa", "presupuesto", "precio", "bodas.net"]),
]

MAX_FILE_BYTES   = 100 * 1024 * 1024   # no leer archivos > 100 MB
READ_CAP         = 300_000             # techo de bytes leídos para clasificación
SUMMARY_CHAR_CAP = 1200                # ~300 tokens (regla ZTM)
MAX_DEPTH        = 14                  # profundidad máxima desde la raíz de cada disco
PROGRESS_EVERY   = 50_000              # imprimir progreso cada N archivos
TIME_BUDGET_SECONDS = 1800             # presupuesto duro: garantiza finalización integral (C/D/H/E/F/G/L) + informe


# ─────────────────────────────── UTILIDADES ────────────────────────────────
def norm(s: str) -> str:
    """minúsculas + sin acentos (para matching semántico robusto)."""
    s = unicodedata.normalize("NFKD", s or "")
    return "".join(c for c in s if not unicodedata.combining(c)).lower()


def is_blacklisted(path: str) -> bool:
    """Fast-path por basename (O(1)) + fallback a tokens de ruta anidada."""
    base = os.path.basename(path).upper()
    if base in BLACKLIST_NAMES:
        return True
    up = path.upper().replace("/", "\\")
    for token in ("\\APPDATA\\", "\\TEMP\\", "\\.CACHE\\", "\\NODE_MODULES\\",
                  "\\PROGRAM FILES\\", "SYSTEM VOLUME INFORMATION", "$RECYCLE.BIN"):
        if token in up:
            return True
    return False


# ──────────────── SOPORTE LONG-PATH WINDOWS (fallback \\?\) ────────────────
def _lp(path: str) -> str:
    """Devuelve la forma long-path (\\?\\...) para rutas absolutas de unidad."""
    p = path.replace("/", "\\")
    if p.startswith("\\\\?\\"):
        return p
    if len(p) >= 3 and p[1] == ":":
        return "\\\\?\\" + p
    return p


def _open_bin(path: str, mode: str = "rb"):
    try:
        return open(path, mode)
    except OSError:
        return open(_lp(path), mode)


def _exists(path: str) -> bool:
    if os.path.exists(path):
        return True
    try:
        return os.path.exists(_lp(path))
    except Exception:
        return False


def _copy2(src: str, dst: str) -> None:
    try:
        shutil.copy2(src, dst)
    except OSError:
        shutil.copy2(_lp(src), _lp(dst))


def _remove(path: str) -> None:
    try:
        os.remove(path)
    except OSError:
        os.remove(_lp(path))


@contextlib.contextmanager
def _silence_stderr():
    """Redirige el fd 2 a devnull para evitar inundaciones de librerías C (PyMuPDF, pypdf)."""
    saved_fd = -1
    devnull = None
    try:
        saved_fd = os.dup(2)
        devnull = open(os.devnull, "w")
        os.dup2(devnull.fileno(), 2)
    except Exception:
        pass
    try:
        yield
    finally:
        if saved_fd != -1:
            try:
                os.dup2(saved_fd, 2)
                os.close(saved_fd)
            except Exception:
                pass
        if devnull is not None:
            try:
                devnull.close()
            except Exception:
                pass


def compute_sha256(filepath: str) -> str:
    h = hashlib.sha256()
    with _open_bin(filepath) as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


def _read_capped(path: str, cap: int = READ_CAP) -> str:
    try:
        with _open_bin(path) as f:
            raw = f.read(cap)
    except Exception:
        return ""
    for enc in ("utf-8", "latin-1"):
        try:
            return raw.decode(enc, errors="ignore")
        except Exception:
            continue
    return raw.decode("utf-8", errors="ignore")


def _extract_pdf(path: str) -> str:
    cap_pages = 40
    try:
        import fitz  # PyMuPDF
        doc = fitz.open(path)
        out = []
        for i, page in enumerate(doc):
            if i >= cap_pages:
                break
            out.append(page.get_text())
        doc.close()
        return "\n".join(out)[:READ_CAP]
    except Exception:
        pass
    try:
        import pypdf
        reader = pypdf.PdfReader(path)
        out = []
        for i, page in enumerate(reader.pages):
            if i >= cap_pages:
                break
            t = page.extract_text() or ""
            out.append(t)
        return "\n".join(out)[:READ_CAP]
    except Exception:
        pass
    try:
        import PyPDF2
        reader = PyPDF2.PdfReader(path)
        out = []
        for i, page in enumerate(reader.pages):
            if i >= cap_pages:
                break
            t = page.extract_text() or ""
            out.append(t)
        return "\n".join(out)[:READ_CAP]
    except Exception:
        return ""


def _extract_docx(path: str) -> str:
    try:
        with zipfile.ZipFile(_lp(path)) as z:
            xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
        text = re.sub(r"</w:p>", "\n", xml)
        text = re.sub(r"<[^>]+>", "", text)
        return text[:READ_CAP]
    except Exception:
        try:
            with zipfile.ZipFile(path) as z:
                xml = z.read("word/document.xml").decode("utf-8", errors="ignore")
            text = re.sub(r"</w:p>", "\n", xml)
            text = re.sub(r"<[^>]+>", "", text)
            return text[:READ_CAP]
        except Exception:
            return ""


def _extract_xlsx(path: str) -> str:
    try:
        with zipfile.ZipFile(_lp(path)) as z:
            names = z.namelist()
            chunks = []
            if "xl/sharedStrings.xml" in names:
                ss = z.read("xl/sharedStrings.xml").decode("utf-8", errors="ignore")
                chunks.extend(re.findall(r"<t[^>]*>(.*?)</t>", ss, flags=re.S))
            for n in names:
                if re.match(r"xl/worksheets/sheet\d+\.xml$", n):
                    sh = z.read(n).decode("utf-8", errors="ignore")
                    chunks.extend(re.findall(r"<t[^>]*>(.*?)</t>", sh, flags=re.S))
        return "\n".join(chunks)[:READ_CAP]
    except Exception:
        try:
            with zipfile.ZipFile(path) as z:
                names = z.namelist()
                chunks = []
                if "xl/sharedStrings.xml" in names:
                    ss = z.read("xl/sharedStrings.xml").decode("utf-8", errors="ignore")
                    chunks.extend(re.findall(r"<t[^>]*>(.*?)</t>", ss, flags=re.S))
                for n in names:
                    if re.match(r"xl/worksheets/sheet\d+\.xml$", n):
                        sh = z.read(n).decode("utf-8", errors="ignore")
                        chunks.extend(re.findall(r"<t[^>]*>(.*?)</t>", sh, flags=re.S))
            return "\n".join(chunks)[:READ_CAP]
        except Exception:
            return ""


def _extract_rtf(path: str) -> str:
    raw = _read_capped(path)
    words = re.findall(r"[\w\u00c0-\u024f]{3,}", raw)
    return " ".join(words)[:READ_CAP]


def extract_text(path: str, ext: str) -> str:
    """Extracción defensiva de texto según extensión (stderr silenciado)."""
    try:
        with _silence_stderr():
            if ext == ".pdf":
                return _extract_pdf(path)
            if ext == ".docx":
                return _extract_docx(path)
            if ext == ".xlsx":
                return _extract_xlsx(path)
            if ext == ".rtf":
                return _extract_rtf(path)
            if ext in (".html", ".htm"):
                raw = _read_capped(path)
                text = re.sub(r"(?is)<(script|style).*?</\1>", " ", raw)
                text = re.sub(r"<[^>]+>", " ", text)
                return re.sub(r"\s+", " ", text)[:READ_CAP]
            # .txt .md .json .csv .doc (fallback binario → secuencias legibles)
            raw = _read_capped(path)
            if ext == ".doc":
                words = re.findall(r"[\w\u00c0-\u024f]{3,}", raw)
                return " ".join(words)[:READ_CAP]
            return raw[:READ_CAP]
    except Exception:
        return ""


def classify(filename: str, text: str):
    """Devuelve (categoria, [keywords_matcheados]) o (None, [])."""
    name_n = norm(os.path.basename(filename))
    text_n = norm(text) if text else ""
    for cat, kws in CATEGORIES:
        hits = []
        for kw in kws:
            kwn = norm(kw)
            if not kwn:
                continue
            if (kwn in name_n) or (text_n and kwn in text_n):
                hits.append(kw)
        if hits:
            return cat, hits
    return None, []


def build_summary(text: str, keywords: list) -> str:
    """Resumen semántico compacto < 300 tokens (ZTM)."""
    text = re.sub(r"\s+", " ", (text or "")).strip()
    if not text:
        return ""
    sentences = [s.strip() for s in re.split(r"(?<=[.!?;:])\s+|\n", text) if len(s.strip()) > 15]
    kwn = {norm(k) for k in keywords}
    relevant = []
    seen = set()
    for s in sentences:
        sn = norm(s)
        if any(k in sn for k in kwn):
            key = sn[:60]
            if key not in seen:
                seen.add(key)
                relevant.append(s)
        if len(relevant) >= 5:
            break
    head = text[:420].strip()
    parts = [head] + [s for s in relevant if norm(s)[:60] not in (norm(head)[:60],)]
    out = " ✓ ".join(p.strip() for p in parts if p.strip())
    return out[:SUMMARY_CHAR_CAP].strip()


# ─────────────────────── CARGA / GUARDADO DE STORES ────────────────────────
def load_json(path, default):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    tmp = path + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    os.replace(tmp, path)


# ─────────────────────────────── MOTOR PRINCIPAL ───────────────────────────
def main():
    t0 = datetime.now()
    today = datetime.now().strftime("%Y-%m-%d")

    print("╔" + "═" * 78 + "╗")
    print("  🕵️ EAR OS V2 — BARRIDO FORENSE ZTM DE TODO EL PC (Forensic Data Miner)")
    print("╚" + "═" * 78 + "╝")

    # Detectar unidades dinámicamente
    drives = [f"{L}:\\" for L in string.ascii_uppercase if os.path.exists(f"{L}:\\")]
    print(f"[DRIVES] Unidades detectadas: {', '.join(drives)} ({len(drives)})")

    # Cargar stores existentes (preservar estado previo)
    manifest = load_json(MANIFEST, [])
    if not isinstance(manifest, list):
        manifest = list(manifest.values()) if isinstance(manifest, dict) else []
    hashes = load_json(HASHES, {})
    if not isinstance(hashes, dict):
        hashes = {h: h for h in hashes} if isinstance(hashes, list) else {}

    rag_raw = load_json(RAG_DB_PATH, None)
    is_list_rag = isinstance(rag_raw, list)
    if is_list_rag:
        rag_docs = rag_raw
    elif isinstance(rag_raw, dict):
        rag_docs = rag_raw.get("documents", [])
        if not isinstance(rag_docs, list):
            rag_docs = []
    else:
        rag_docs = []
    existing_ids = {d.get("id") for d in rag_docs if isinstance(d, dict)}

    processed_set = set(hashes.keys())

    # Estadísticas
    stats = {"candidates": 0, "classified": 0, "relocated": 0, "skipped_hash": 0,
             "move_failed_kept_copy": 0, "by_cat": {c: 0 for c, _ in CATEGORIES}}

    def unique_dest(dest_dir: str, filename: str) -> str:
        base, ext = os.path.splitext(filename)
        safe_base = re.sub(r'[<>:"/\\|?*\n\r\t]', '_', base)[:80].strip(' ._')
        if not safe_base:
            safe_base = "doc"
        candidate = os.path.join(dest_dir, f"[{today}]_{safe_base}{ext}")
        i = 1
        while _exists(candidate):
            candidate = os.path.join(dest_dir, f"[{today}]_{safe_base}_{i}{ext}")
            i += 1
        return candidate

    # ── Presupuesto de tiempo duro: garantiza finalización + informe ──
    deadline = t0.timestamp() + TIME_BUDGET_SECONDS
    time_budget_hit = False

    def _over_budget() -> bool:
        return datetime.now().timestamp() >= deadline

    for drive in drives:
        if _over_budget():
            time_budget_hit = True
            print(f"   [TIME BUDGET] {TIME_BUDGET_SECONDS}s alcanzados — deteniendo escaneo (se finaliza con lo hallado)")
            break

        print(f"\n── Escaneando unidad {drive} ──")
        scanned_here = 0
        try:
            for root, dirs, files in os.walk(drive, topdown=True, onerror=lambda e: None):
                if _over_budget():
                    time_budget_hit = True
                    break

                # poda de lista negra + profundidad (in-place)
                depth = root[len(drive):].count("\\")
                if depth > MAX_DEPTH:
                    dirs[:] = []
                    continue
                dirs[:] = [d for d in dirs if not is_blacklisted(os.path.join(root, d))]

                # no tocar el proyecto activo ni la propia bóveda (poda total)
                root_up = root.upper().replace("/", "\\")
                if ("EAR_OS_V2\\EAR_OS_V2" in root_up) or (VAULT_BASE.upper() in root_up):
                    dirs[:] = []
                    continue

                for name in files:
                    scanned_here += 1
                    ext = os.path.splitext(name)[1].lower()
                    if ext not in ALLOWED_EXTS:
                        continue
                    fp = os.path.join(root, name)
                    try:
                        if not os.path.isfile(fp):
                            continue
                        size = os.path.getsize(fp)
                    except Exception:
                        continue
                    if size == 0 or size > MAX_FILE_BYTES:
                        continue

                    stats["candidates"] += 1

                    # ── Protocolo ZTM: dedup por SHA-256 ──
                    try:
                        sha = compute_sha256(fp)
                    except Exception:
                        continue
                    if sha in processed_set:
                        stats["skipped_hash"] += 1
                        continue

                    # ── Filtro semántico + categorización ──
                    text = extract_text(fp, ext)
                    cat, hits = classify(name, text)
                    if not cat:
                        continue
                    stats["classified"] += 1
                    stats["by_cat"][cat] += 1

                    summary = build_summary(text, hits) or f"Archivo {name} ({size} bytes) clasificado en {cat}."

                    # ── Reubicación física a la Bóveda (long-path safe) ──
                    dest_dir = os.path.join(VAULT_BASE, cat)
                    try:
                        os.makedirs(dest_dir, exist_ok=True)
                        dest = unique_dest(dest_dir, name)
                        _copy2(fp, dest)
                        removed_src = False
                        try:
                            _remove(fp)
                            removed_src = True
                        except Exception:
                            pass  # se conserva la copia en bóveda (seguro)
                    except Exception as e:
                        print(f"   [ERR MOVE] {name}: {e}")
                        continue

                    if not removed_src:
                        stats["move_failed_kept_copy"] += 1

                    # ── Inyección de nodo RAG (ZTM < 300 tokens) ──
                    node_id = f"RAG-FORENSE-{cat}-{sha[:8].upper()}"
                    if node_id not in existing_ids:
                        node = {
                            "id": node_id,
                            "tipo": "INTELIGENCIA_FORENSE_ZTM",
                            "categoria": cat,
                            "titulo": f"[{today}] {os.path.splitext(name)[0]}",
                            "origen_original": fp,
                            "ruta_boveda": dest,
                            "sha256": sha,
                            "size_bytes": size,
                            "keywords_detectados": hits[:12],
                            "resumen_semantico_ztm": summary,
                            "fecha_extraccion": today,
                        }
                        rag_docs.append(node)
                        existing_ids.add(node_id)

                    # ── Manifest + hashes ──
                    manifest.append({
                        "original_path": fp,
                        "vault_path": dest,
                        "category": cat,
                        "sha256": sha,
                        "size_bytes": size,
                        "keywords": hits[:12],
                        "archived_at": datetime.now().isoformat(),
                    })
                    hashes[sha] = dest
                    processed_set.add(sha)
                    stats["relocated"] += 1

                    if scanned_here % PROGRESS_EVERY == 0:
                        print(f"   ... {scanned_here:,} archivos inspeccionados en {drive}")
        except Exception as e:
            print(f"[ERR DRIVE {drive}] {e}")

        print(f"   ✓ Unidad {drive} procesada ({scanned_here:,} archivos recorridos)")

    # ─────────────────────── PERSISTENCIA DE STORES ─────────────────────────
    if is_list_rag:
        save_json(RAG_DB_PATH, rag_docs)
    else:
        container = rag_raw if isinstance(rag_raw, dict) else {}
        container["documents"] = rag_docs
        save_json(RAG_DB_PATH, container)

    save_json(MANIFEST, manifest)
    save_json(HASHES, hashes)

    # ─────────────────────── REGISTRO DE HERRAMIENTA ────────────────────────
    registry = load_json(REGISTRY, {"tools": []})
    if not isinstance(registry, dict):
        registry = {"tools": []}
    tools = registry.get("tools", [])
    if not any(isinstance(t, dict) and t.get("name") == "full_pc_forensic_ear_sweeper.py" for t in tools):
        tools.append({
            "name": "full_pc_forensic_ear_sweeper.py",
            "path": "scripts/full_pc_forensic_ear_sweeper.py",
            "purpose": ("Barrido forense ZTM de TODO el PC (todas las unidades). Detecta activos de "
                        "inteligencia EAR/Edwin Agudelo/VIMUME, inyecta nodos <300 tokens en "
                        "ear-rag-database.json y reubica crudos a EAR_ABSORBED_VAULT por categoría."),
            "inputs": "Sistema de archivos completo (todas las unidades) con lista negra estricta",
            "outputs": ("src/data/ear-rag-database.json + scripts/.archived_manifest.json + "
                        "scripts/.processed_hashes.json + H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\{Categoria}\\"),
            "cli": "python scripts/full_pc_forensic_ear_sweeper.py",
        })
        registry["tools"] = tools
        save_json(REGISTRY, registry)

    # ─────────────────────────── REPORTE FINAL ──────────────────────────────
    elapsed = (datetime.now() - t0).total_seconds()
    print("\n" + "╔" + "═" * 78 + "╗")
    print("  📊 INFORME FINAL DEL BARRIDO FORENSE ZTM")
    print("╚" + "═" * 78 + "╝")
    print(f"  Discos escaneados            : {len(drives)}  ({', '.join(d.rstrip(chr(92)) for d in drives)})")
    if time_budget_hit:
        print(f"  ⚠ Presupuesto de tiempo      : {TIME_BUDGET_SECONDS}s alcanzado — barrido parcial (re-ejecutable para converger)")
    print(f"  Documentos candidatos (ext.) : {stats['candidates']:,}")
    print(f"  Clasificados semánticamente : {stats['classified']}")
    print(f"  Reubicados en la Bóveda     : {stats['relocated']}")
    if stats["move_failed_kept_copy"]:
        print(f"     ⚠ Copiados (origen no eliminable): {stats['move_failed_kept_copy']}")
    print(f"  Saltados por hash previo     : {stats['skipped_hash']:,}")
    print("  " + "─" * 39)
    for cat, _ in CATEGORIES:
        bar = "█" * min(stats["by_cat"][cat], 40)
        print(f"   {cat:<26} : {stats['by_cat'][cat]:>4}  {bar}")
    print("  " + "─" * 39)
    print(f"  Nodos RAG acumulados (total) : {len(rag_docs)}")
    print(f"  Bóveda destino               : {VAULT_BASE}")
    print(f"  Tiempo transcurrido          : {elapsed:.1f} s")
    print("╚" + "═" * 78 + "╝")
    print("  🏁 PROTOCOLO ZTM COMPLETADO — ARCHIVISTA PURISTA EN LÍNEA\n")


if __name__ == "__main__":
    main()