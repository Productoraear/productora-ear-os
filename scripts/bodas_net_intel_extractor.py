#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
BODAS.NET / WEDDINGWIRE — ZTM INTEL EXTRACTOR (STREAMING)

Extrae los patrones de CONVERSIÓN, CUSTOMER JOURNEY y MODELO DE MONETIZACIÓN
de los informes confidenciales de Bodas.net PRO localizados en la bóveda física
`src/data/wedding_intel_vault/` (4.077 archivos, con duplicados).

PROTOCOLO ZTM (Zero-Token Memory):
  - NO vuelca texto masivo a consola (solo un resumen sintético < 300 tokens).
  - NO persiste el texto íntegro de los documentos: solo NUGGETS cortos
    (excerptos <= 300 chars) que alimentan la bóveda de ingesta.
  - Salida primaria: H:\\EAR_VAULT_GOLDEN_NUGGETS.json (merge no destructivo).
  - Copia local de auditoría: reports/bodas_net_intel_nuggets.json
                             reports/bodas_net_intel_brief.md

DEPENDENCIAS: PyMuPDF (`fitz`) para PDF. DOCX vía zipfile + ElementTree
(sin dependencias extra). OCR no disponible: los PDFs escaneados se marcan
como `image_only` y se reportan, no se fuerzan.

USO:
    python scripts/bodas_net_intel_extractor.py
"""

import os
import re
import json
import sys
import hashlib
import unicodedata
import zipfile
from datetime import datetime, timezone
from xml.etree import ElementTree as ET

# ---------------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------------
VAULT_DIR = "src/data/wedding_intel_vault"
OUT_VAULT = r"H:\EAR_VAULT_GOLDEN_NUGGETS.json"
OUT_REPO = "reports/bodas_net_intel_nuggets.json"
OUT_MD = "reports/bodas_net_intel_brief.md"

MAX_HEADINGS_PER_DOC = 14
MAX_SENTENCES_PER_DOC = 10
MAX_NUMBERS_PER_DOC = 18
MAX_SYNTH_PER_CATEGORY = 8
NUGGET_MAX_CHARS = 300

# (keyword_fragment, category) — matching insensible a acentos/mayúsculas.
TARGETS = [
    ("Informe sector nupcial", "sector_report"),
    ("Global Wedding Report", "sector_report"),
    ("Customer Journey", "journey"),
    ("Bridal Journey", "journey"),
    ("Optimiza tu Funnel", "funnel"),
    ("SPAIN SEO Guide", "seo"),
    ("Tu estrategia de precios", "pricing"),
    ("convertir un contacto en contrato", "conversion"),
    ("6 secretos para que mas parejas te contraten", "conversion"),
    ("transmitir tu valor", "value"),
    ("Dream Customer Guide", "value"),
    ("Guia escaparate", "storefront"),
    ("Descripcion detallada de la web bodas.net", "storefront"),
    ("Descripcion detallada pagina web", "storefront"),
    ("crear el sitio de bodas inspirado en bodas.net", "storefront"),
    ("escucha activa", "communication"),
    ("Top Wedding Trends", "trends"),
    ("Ficha cliente", "crm"),
    ("Checklist Onboarding", "onboarding"),
    ("Checklist Offboarding", "offboarding"),
    ("Checklist para empezar bien", "seasonal"),
    ("Planner", "planning"),
    ("Contacto con las parejas", "communication"),
    ("pedir opiniones", "reviews"),
    ("hacer crecer tu negocio", "growth"),
    ("destaque en 2023", "growth"),
    ("ano exitoso", "seasonal"),
    ("Los 6 secretos", "conversion"),
]

# Términos de dominio por categoría (minado de señales).
DOMAIN_TERMS = {
    "conversion": ["convertir", "conversion", "contrato", "contacto en contrato", "cierre", "venta", "lead", "leads", "funnel", "embudo", "reserva"],
    "pricing": ["precio", "tarifa", "presupuesto", "pago", "deposito", "descuento", "paquete", "euros", "eur"],
    "journey": ["journey", "viaje", "fase", "etapa", "consideracion", "decision", "descubrimiento", "antes", "durante", "despues"],
    "monetization": ["suscripcion", "plan", "membresia", "premium", "pro", "cuota", "comision", "anuncio", "destacado", "escaparate"],
    "seo": ["seo", "posicionamiento", "palabras clave", "google", "trafico", "organico"],
    "reviews": ["resena", "opiniones", "valoracion", "testimonio", "reputacion"],
    "trends": ["tendencia", "2023", "2024", "2025", "sostenible", "intima", "microboda"],
}


# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------
def norm(s: str) -> str:
    """Normaliza a comparación insensible a acentos y mayúsculas."""
    s = unicodedata.normalize("NFKD", s)
    s = "".join(c for c in s if not unicodedata.combining(c))
    return s.casefold()


def walk_files(root: str):
    for dirpath, _dirs, files in os.walk(root):
        for f in files:
            yield os.path.join(dirpath, f)


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as fh:
        for chunk in iter(lambda: fh.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def resolve_canonical_files():
    """Devuelve lista [(keyword, category, path)] con la ruta canónica por target.

    Frente a duplicados (version 'Documentos_' vs 'D_OS AZUL_...'), elige el
    nombre más corto, que corresponde al original no expandido.
    """
    all_files = list(walk_files(VAULT_DIR))
    by_kw = {}
    for kw, cat in TARGETS:
        nkw = norm(kw)
        matches = [f for f in all_files if nkw in norm(os.path.basename(f))]
        if matches:
            best = min(matches, key=lambda f: (len(os.path.basename(f)), f))
            by_kw.setdefault(kw, (cat, best))

    # Deduplicar por ruta resuelta (distintos keywords -> mismo archivo).
    seen_paths = set()
    result = []
    for kw, _cat in TARGETS:
        if kw not in by_kw:
            continue
        cat, path = by_kw[kw]
        if path in seen_paths:
            continue
        seen_paths.add(path)
        result.append((kw, cat, path))
    return result


# ---------------------------------------------------------------------------
# EXTRACCIÓN DE TEXTO (STREAMING, sin persistir íntegro)
# ---------------------------------------------------------------------------
def extract_pdf(path: str):
    try:
        import fitz  # PyMuPDF
    except ImportError:
        return None, 0, "pdf_lib_missing"

    try:
        doc = fitz.open(path)
    except Exception:
        return None, 0, "pdf_corrupt"

    chunks = []
    for page in doc:
        chunks.append(page.get_text("text"))
    doc.close()
    text = "\n".join(chunks)
    stripped = re.sub(r"\s+", " ", text).strip()
    if len(stripped) < 50:
        return "", len(chunks), "image_only"
    return text, len(chunks), "ok"


def extract_docx(path: str):
    W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
    try:
        with zipfile.ZipFile(path) as z:
            xml = z.read("word/document.xml")
    except Exception:
        return None, 0, "docx_corrupt"

    root = ET.fromstring(xml)
    paras = []
    for p in root.iter(W + "p"):
        runs = [t.text for t in p.iter(W + "t") if t.text]
        if runs:
            paras.append("".join(runs))
    text = "\n".join(paras)
    if len(text.strip()) < 20:
        return "", len(paras), "image_only"
    return text, len(paras), "ok"


def extract_file(path: str):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf":
        return extract_pdf(path)
    if ext in (".docx", ".doc"):
        if ext == ".doc":
            return None, 0, "legacy_doc_skip"
        return extract_docx(path)
    return None, 0, "unsupported"


# ---------------------------------------------------------------------------
# ANÁLISIS DE NUGGETS
# ---------------------------------------------------------------------------
SENT_RE = re.compile(r"(?<=[.!?…])\s+(?=[A-ZÁÉÍÓÚÑ¿¡0-9])")

TERMINAL_END = (".", "?", "!", "…", ")", ":")


def clean_line(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def reflow_text(text: str) -> str:
    """Une cortes silábicos de fin de línea y colapsa retornos en un único flujo.

    Los PDFs parten palabras con guion ("c-\\nontratar" -> "contratar"); sin este
    reflujo los splits generan fragmentos inválidos tipo "...antes de c".
    """
    t = re.sub(r"-\s*\n\s*", "", text)
    t = re.sub(r"\s+", " ", t)
    return t.strip()


def split_sentences(text: str):
    flat = reflow_text(text)
    parts = [clean_line(p) for p in SENT_RE.split(flat)]
    out = []
    for p in parts:
        # Filtros anti-fragmento:
        #   1) longitud mínima para descartar títulos ("ventas (Fase 3: Decisión).")
        #   2) debe cerrar con puntuación terminal (descarta encabezados y cortes)
        #   3) debe contener minúsculas reales (descarta títulos TODO MAYÚSCULAS)
        if not (35 <= len(p) <= 400):
            continue
        if not p.endswith(TERMINAL_END):
            continue
        if p.isupper():
            continue
        if not re.search(r"[a-záéíóúñ]", p):
            continue
        out.append(p)
    return out


def is_heading(line: str) -> bool:
    if not (3 <= len(line) <= 70):
        return False
    if re.match(r"^\d{1,2}[\.\)\-]", line):
        return True
    if line.startswith(("-", "•", "→")):
        return True
    if line.isupper() or line.endswith(":"):
        return True
    return False


def extract_headings(text: str, limit: int):
    headings = []
    for line in text.splitlines():
        l = clean_line(line)
        if is_heading(l):
            headings.append(l)
        if len(headings) >= limit:
            break
    # dedupe preservando orden
    seen = set()
    out = []
    for h in headings:
        if h not in seen:
            seen.add(h)
            out.append(h)
    return out


def score_sentence(sent: str, terms: list[str], term_density: dict) -> int:
    s = norm(sent)
    score = 0
    for t in terms:
        if t in s:
            score += 3
    # bonus por densidad de términos de dominio globales
    for t, w in term_density.items():
        if t in s:
            score += w
    # bonus por datos duros
    if re.search(r"\d", sent):
        score += 1
    return score


def extract_numbers(text: str, limit: int):
    patterns = [
        r"\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\s?%",
        r"\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?\s?(?:€|EUR|euros?)",
        r"\b20(?:2[0-9])\b",
        r"\d+\s?(?:dias|semanas|meses|horas|km|visitas|contactos|leads|proveedores|parejas)",
    ]
    found = set()
    for pat in patterns:
        for m in re.findall(pat, text, flags=re.IGNORECASE):
            found.add(clean_line(m))
        if len(found) >= limit:
            break
    return sorted(found)[:limit]


def classify_category(text: str):
    n = norm(text)
    scores = {}
    for cat, terms in DOMAIN_TERMS.items():
        scores[cat] = sum(1 for t in terms if t in n)
    if not scores:
        return "general"
    return max(scores, key=scores.get)


def build_term_density():
    dens = {}
    for terms in DOMAIN_TERMS.values():
        for t in terms:
            dens[t] = dens.get(t, 0) + 1
    return dens


# ---------------------------------------------------------------------------
# PIPELINE PRINCIPAL
# ---------------------------------------------------------------------------
def main():
    if not os.path.isdir(VAULT_DIR):
        print(f"FATAL: bóveda no localizada: {VAULT_DIR}")
        sys.exit(1)

    canonical = resolve_canonical_files()
    term_density = build_term_density()

    documents = []
    processed_hashes = set()
    stats = {"total": 0, "ok": 0, "image_only": 0, "skipped": 0}

    for kw, cat_hint, path in canonical:
        stats["total"] += 1
        base = os.path.basename(path)
        digest = sha256_file(path)
        if digest in processed_hashes:
            stats["skipped"] += 1
            continue
        processed_hashes.add(digest)

        text, pages, status = extract_file(path)
        if status != "ok" or not text:
            if status in ("image_only",):
                stats["image_only"] += 1
                documents.append({
                    "file": base,
                    "category": cat_hint,
                    "status": status,
                    "pages": pages,
                    "words": 0,
                    "nuggets": [],
                    "numbers": [],
                    "headings": [],
                })
            else:
                stats["skipped"] += 1
            continue

        stats["ok"] += 1
        words = len(re.findall(r"\S+", text))

        # Categoría final: gana la pista del keyword, salvo refino por señal.
        cat = cat_hint
        if cat_hint in ("storefront", "sector_report"):
            alt = classify_category(text)
            if alt != "general" and alt != cat_hint:
                cat = alt

        terms = DOMAIN_TERMS.get(cat, [])
        sents = split_sentences(text)
        scored = sorted(
            [(score_sentence(s, terms, term_density), s) for s in sents],
            key=lambda x: -x[0],
        )
        nuggets = []
        seen = set()
        for _score, s in scored:
            key = norm(s)
            if key in seen:
                continue
            seen.add(key)
            nuggets.append(s[:NUGGET_MAX_CHARS])
            if len(nuggets) >= MAX_SENTENCES_PER_DOC:
                break

        documents.append({
            "file": base,
            "category": cat,
            "status": "ok",
            "pages": pages,
            "words": words,
            "nuggets": nuggets,
            "numbers": extract_numbers(text, MAX_NUMBERS_PER_DOC),
            "headings": extract_headings(text, MAX_HEADINGS_PER_DOC),
        })

        # Liberar memoria en cada iteración (streaming).
        del text

    # ---- SÍNTESIS GLOBAL POR CATEGORÍA -------------------------------------
    synthesis = {
        "conversion_patterns": [],
        "customer_journey": [],
        "monetization_model": [],
    }
    cat_buckets = {
        "conversion_patterns": ("conversion", "funnel", "growth", "seasonal", "reviews"),
        "customer_journey": ("journey", "communication", "crm", "onboarding", "offboarding", "planning"),
        "monetization_model": ("pricing", "monetization", "storefront", "seo", "value", "trends", "sector_report"),
    }
    for bucket, cats in cat_buckets.items():
        pool = [n for d in documents if d.get("category") in cats for n in d.get("nuggets", [])]
        seen = set()
        for n in pool:
            k = norm(n)
            if k in seen:
                continue
            seen.add(k)
            synthesis[bucket].append(n)
            if len(synthesis[bucket]) >= MAX_SYNTH_PER_CATEGORY:
                break

    report = {
        "meta": {
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "source_dir": VAULT_DIR,
            "scope": "bodas_net_intel",
            "docs_scanned": len(canonical),
            "docs_extracted": stats["ok"],
            "docs_image_only": stats["image_only"],
            "docs_skipped": stats["skipped"],
        },
        "synthesis": synthesis,
        "documents": documents,
    }

    # ---- ESCRITURA ---------------------------------------------------------
    os.makedirs("reports", exist_ok=True)
    with open(OUT_REPO, "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)

    # Merge no destructivo en la bóveda de ingesta global.
    vault_payload = {}
    if os.path.exists(OUT_VAULT):
        try:
            with open(OUT_VAULT, "r", encoding="utf-8") as fh:
                vault_payload = json.load(fh)
        except Exception:
            vault_payload = {}
    vault_payload["bodas_net_intel"] = {
        "generated_at": report["meta"]["generated_at"],
        "docs_extracted": stats["ok"],
        "docs_image_only": stats["image_only"],
        "synthesis": synthesis,
    }
    try:
        with open(OUT_VAULT, "w", encoding="utf-8") as fh:
            json.dump(vault_payload, fh, ensure_ascii=False, indent=2)
    except Exception as exc:
        # H:\ raíz no escribible en algunos entornos: no es fatal, hay copia local.
        print(f"WARN: no se pudo escribir {OUT_VAULT}: {exc}")

    write_brief(report, OUT_MD)

    # ---- RESUMEN SINTÉTICO (< 300 tokens) ----------------------------------
    top = (synthesis["conversion_patterns"] + synthesis["monetization_model"])[:5]
    print("=" * 60)
    print("BODAS.NET ZTM INTEL — EXTRACCIÓN COMPLETADA")
    print("=" * 60)
    print(f"Documentos canónicos: {len(canonical)} | Extraídos: {stats['ok']} | "
          f"Escaneados(imagen): {stats['image_only']} | Omitidos: {stats['skipped']}")
    print(f"Nuggets por categoría -> conversión:{len(synthesis['conversion_patterns'])} "
          f"| journey:{len(synthesis['customer_journey'])} "
          f"| monetización:{len(synthesis['monetization_model'])}")
    print("-" * 60)
    for i, n in enumerate(top, 1):
        print(f"{i}. {n[:160]}")
    print("-" * 60)
    print(f"Bóveda: {OUT_VAULT}")
    print(f"Copia local: {OUT_REPO}")
    print(f"Brief: {OUT_MD}")


def write_brief(report: dict, path: str):
    """Informe ejecutivo en markdown, sintético."""
    m = report["meta"]
    s = report["synthesis"]
    lines = [
        "# Bodas.net / WeddingWire — Nuggets Estratégicos (ZTM)",
        "",
        f"- Documentos extraídos: {m['docs_extracted']}",
        f"- PDFs escaneados (requieren OCR): {m['docs_image_only']}",
        f"- Generado: {m['generated_at']}",
        "",
        "## Patrones de conversión",
        *[f"- {n}" for n in s["conversion_patterns"]],
        "",
        "## Customer journey",
        *[f"- {n}" for n in s["customer_journey"]],
        "",
        "## Modelo de monetización",
        *[f"- {n}" for n in s["monetization_model"]],
    ]
    with open(path, "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    main()