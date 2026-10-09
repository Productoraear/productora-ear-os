"""
════════════════════════════════════════════════════════════════════════════════
EAR OS — DEEP FORENSIC SWEEP S-CLASS (BARRIDO FORENSE PROFUNDO)
════════════════════════════════════════════════════════════════════════════════
Barre el PC en profundidad evitando Windows/software de terceros/data lakes, para:

  1) Encontrar "pepitas de oro": motores algorítmicos, lógica SSOT y ADN de EAR OS
     dispersos por el disco (tras incidentes de borrado/recuperación).
  2) Detectar duplicados: candidatos por (tamaño + SHA-256 de prefijo) y
     duplicados exactos por SHA-256 completo SOLO dentro de grupos colisionantes.
  3) Señalar riesgo de fachada (setTimeout, mocks, Math.random, placeholders).
  4) Opcionalmente (--review N): clasificar las top-N pepitas con Ollama local.

Estrategia de velocidad S-CLASS:
  - Lectura de solo 200 KB por archivo para el scoring semántico.
  - Deduplicación en dos fases: prefijo (barato) → hash completo (solo colisiones).
  - Checkpoint JSONL incremental + heap top-K acotado en RAM.

Cero dependencias externas (solo stdlib). Salida en reports/forensic_adn_*.

Uso:
  py scripts/ear_os_deep_forensic_sweep.py
  py scripts/ear_os_deep_forensic_sweep.py --roots C:\\EAR_OS_V2 D:\\ H:\\
  py scripts/ear_os_deep_forensic_sweep.py --review 25 --ollama-model qwen-sclass
"""

import os
import sys
import re
import json
import hashlib
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
import heapq

if sys.stdout is not None and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# ─────────────────────────────────────────────────────────────────────────────
# RAÍCES DE ESCANEO (solo las que existan)
# ─────────────────────────────────────────────────────────────────────────────
_HOME = os.path.expanduser("~")

DEFAULT_ROOTS = [
    r"C:\EAR_OS_V2",
    _HOME,
    "D:\\",
    "H:\\",
]

# ─────────────────────────────────────────────────────────────────────────────
# EXCLUSIONES DE RUIDO (Windows, terceros, build, data lakes)
# ─────────────────────────────────────────────────────────────────────────────
EXCLUDED_DIR_NAMES = {
    "windows", "program files", "program files (x86)", "programdata",
    "perflogs", "recovery", "$recycle.bin", "system volume information",
    "appdata", "application data", "localappdata", "roaming",
    "node_modules", ".git", ".next", ".turbo", ".vercel", ".netlify",
    ".cache", "__pycache__", "venv", ".venv", "site-packages",
    "dist", "build", "out", "coverage", ".idea", ".vscode", ".vs",
    "temp", "tmp", "cache", "recycler", "recovery", "boot",
    "ear_absorbed_vault", "vault",
}

EXCLUDED_PATH_SUBSTR = [
    "public\\data", "public/data",
    "\\vault\\", "/vault/",
    "ear_absorbed_vault",
    "node_modules", "\\.git\\", "\\.next\\", "__pycache__",
    "system volume information", "$recycle.bin",
    "00_ave_fenix",
]

# ─────────────────────────────────────────────────────────────────────────────
# FILTROS DE ARCHIVOS CANDIDATOS (código, texto, config; NUNCA binarios pesados)
# ─────────────────────────────────────────────────────────────────────────────
EXT_WHITELIST = {
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".md", ".txt", ".json", ".jsonl", ".ps1", ".psm1",
    ".yml", ".yaml", ".toml", ".html", ".css", ".scss",
    ".sql", ".prisma", ".env", ".help", ".csv", ".tsv", ".r", ".m",
    ".go", ".rs", ".java", ".kt", ".cs", ".php", ".rb", ".swift",
}

MAX_FILE_SIZE = 1_500_000      # 1,5 MB — evita data lakes
PREFIX_READ = 32_000           # bytes leídos: suficientes para ADN + dedup de prefijo
DEFAULT_MAX_FILES = 2_000_000

# Pre-filtro léxico barato (substring en texto minúscula). Solo si aparece una
# semilla de negocio o la ruta es de EAR se ejecuta el regex completo.
SEED_TOKENS = (
    "edwin", "agudelo", "vimume", "80/10/10", "80 / 10 / 10", "80-10-10",
    "price-lock", "price_lock", "pricelock", "depósito", "deposito",
    "stripe", "split", "méntrida", "mentrida", "alzheimer", "licitaci",
    "placsp", "lcsp", "b2g", "b2b", "webhook", "ollama", "qwen", "n8n",
    "coolify", "postgres", "dba", "sroi", "soberano", "mariachi",
    "neuroac", "40 hz", "gamma", "tesorer", "residencia", "centro de",
    "whatsapp", "call-center", "call_center", "callcenter", "finca",
    "boda", "wedding", "centralita",
)

EAR_PATH_MARKERS = (
    "ear_os", "ear-os", "ear_os_v2", "productoraear", "productora_ear",
    "\\ear\\", "/ear/", "vimume", "antigravity", "00_productora_ear",
    "productora", "ear_vault",
)

# ─────────────────────────────────────────────────────────────────────────────
# ONTOLOGÍA SEMÁNTICA SSOT (pepitas de oro del negocio)
# ─────────────────────────────────────────────────────────────────────────────
SEMANTIC_ONTOLOGY = {
    "negocio_ssot": [
        r"80\s*/\s*10\s*/\s*10", r"split\s*soberano", r"dep[oó]sito\s*100",
        r"price[\s_-]?lock", r"sha[\s_-]?256", r"edwin\s*agudelo",
        r"solista.{0,10}350", r"m[eé]ntrida", r"km\s*50", r"hub\s*m[eé]ntrida",
        r"artista\s*ejecutante", r"obra\s*social",
    ],
    "vimume": [
        r"vimume", r"alzheimer", r"40\s*hz", r"gamma", r"neuroac[uú]stic",
        r"sroi", r"musicoterapia", r"residencias", r"centros?\s*de\s*d[ií]a",
        r"ods\s*2030", r"memoria",
    ],
    "licitaciones": [
        r"licitaci[oó]n", r"placsp", r"lcsp", r"art\.?\s*118", r"b2g",
        r"contrataci[oó]n\s*p[uú]blica", r"pliegos?", r"\bboe\b", r"\bbop\b",
        r"\bface\b", r"ayuntamientos?",
    ],
    "ventas_finanzas": [
        r"stripe", r"checkout", r"payment", r"pricer", r"ledger",
        r"tesorer[ií]a", r"cotizaci[oó]n", r"presupuesto", r"liquidaci[oó]n",
    ],
    "call_center": [
        r"call[\s_-]?center", r"whatsapp", r"centralita", r"693\s*693\s*048",
        r"leads?", r"omnichannel", r"intake", r"omnicanal",
    ],
    "fincas_proveedores": [
        r"fincas?", r"bodas", r"wedding", r"proveedores?", r"cat[aá]logo",
        r"venues?", r"celebraci[oó]n",
    ],
    "infraestructura": [
        r"ollama", r"qwen", r"n8n", r"coolify", r"postgres", r"webhook",
        r"b2b-quote", r"stripe-price-lock", r"finca-partnership",
        r"vimume-clinical-report", r"call-center-intake", r"\bgpu\b",
        r"autonomous-escalation", r"executive-kpi-radar",
    ],
    "acustica": [
        r"watts?\s*/\s*pax", r"12\s*w/pax", r"presi[oó]n\s*sonora",
        r"rider", r"\bdba\b", r"d[bB]\s*spl", r"ac[uú]stica", r"limitador",
    ],
}

# Aplicados SIEMPRE sobre texto ya en minúsculas -> sin coste IGNORECASE.
STRUCTURAL_PATTERNS = {
    "clase": r"\bclass\s+\w+",
    "funcion": r"\b(export\s+(async\s+)?function|def)\s+\w+",
    "server_action": r"['\"]use server['\"]",
    "client_reactivo": r"['\"]use client['\"]",
    "api_route": r"\bexport\s+(async\s+)?function\s+(get|post|put|patch|delete)\b",
    "fetch_recurso": r"\bfetch\b",
    "prisma_query": r"\bprisma\.\w+\.+",
    "sql_query": r"\b(select|insert|update|delete)\s",
    "motor": r"\b(engine|motor|service|repository|pipeline|ledger)\b",
    "contrato": r"\b(interface|type)\s+\w+",
}

FACADE_MARKERS = [
    r"settimeout", r"math\.random", r"\bmock\b", r"\bfake\b", r"\bdummy\b",
    r"placeholder", r"hardcod", r"simulad", r"simulaci",
    r"fakedata", r"datos\s*falsos", r"\btodo\s*[:\-]",
]

COMPILED_ONTOLOGY = {
    cat: [re.compile(p) for p in pats]
    for cat, pats in SEMANTIC_ONTOLOGY.items()
}
COMPILED_STRUCTURAL = [re.compile(p) for p in STRUCTURAL_PATTERNS.values()]
COMPILED_FACADE = [re.compile(p) for p in FACADE_MARKERS]

OUT_DIR = os.path.join(os.getcwd(), "reports")
KEEP_TOP = 8000   # pepitas top retenidas en RAM (el resto vive en JSONL)


def iter_candidate_paths(roots, max_files):
    """Generador perezoso de rutas candidatas, podando ruido en tiempo real."""
    count = 0
    stack = list(roots)
    while stack:
        current = stack.pop()
        try:
            with os.scandir(current) as it:
                for entry in it:
                    try:
                        if entry.is_dir(follow_symlinks=False):
                            name_l = entry.name.lower()
                            if name_l in EXCLUDED_DIR_NAMES:
                                continue
                            if any(sub in entry.path.lower() for sub in EXCLUDED_PATH_SUBSTR):
                                continue
                            stack.append(entry.path)
                        elif entry.is_file(follow_symlinks=False):
                            if os.path.splitext(entry.name)[1].lower() in EXT_WHITELIST:
                                count += 1
                                yield entry.path
                                if count >= max_files:
                                    return
                    except OSError:
                        continue
        except (OSError, PermissionError):
            continue


def analyze(text_lower):
    semantic_hits = 0
    categories = set()
    terms = set()

    for cat, patterns in COMPILED_ONTOLOGY.items():
        for pat in patterns:
            found = pat.findall(text_lower)
            if found:
                semantic_hits += len(found)
                categories.add(cat)
                terms.add(found[0][:40])

    structural = sum(1 for pat in COMPILED_STRUCTURAL if pat.search(text_lower))
    facade = sum(len(pat.findall(text_lower)) for pat in COMPILED_FACADE)

    score = semantic_hits * 1.5 + structural * 2.0 - facade * 1.0

    if semantic_hits == 0 and structural == 0 and facade == 0:
        return None

    return {
        "score": round(max(score, 0.0), 2),
        "semantic_hits": semantic_hits,
        "structural_signals": structural,
        "facade_risk": facade,
        "categories": sorted(categories),
        "key_terms": sorted(terms)[:14],
    }


def process_file(path):
    """Lee solo el prefijo y devuelve scoring (si hay ADN) + fingerprint de dedup."""
    try:
        st = os.stat(path)
        size = st.st_size
        if size <= 0 or size > MAX_FILE_SIZE:
            return None
        with open(path, "rb") as f:
            prefix = f.read(PREFIX_READ)
        prefix_digest = hashlib.sha256(prefix).digest()
    except (OSError, PermissionError):
        return None

    text = prefix.decode("utf-8", errors="ignore")
    text_lower = text.lower()
    pl = path.lower()

    # Solo archivos con ADN de negocio o rutas EAR pasan por el regex completo.
    is_ear_path = any(m in pl for m in EAR_PATH_MARKERS)
    has_seed = any(s in text_lower for s in SEED_TOKENS)

    if not is_ear_path and not has_seed:
        return {
            "path": path,
            "size": size,
            "prefix_hash": prefix_digest,
            "interesting": False,
        }

    meta = analyze(text_lower)
    if meta is None:
        return {
            "path": path,
            "size": size,
            "prefix_hash": prefix_digest,
            "interesting": False,
        }

    meta.update({
        "path": path,
        "name": os.path.basename(path),
        "size_kb": round(size / 1024, 2),
        "size": size,
        "prefix_hash": prefix_digest,
        "interesting": True,
    })
    return meta


def full_sha256(path):
    try:
        h = hashlib.sha256()
        with open(path, "rb") as f:
            for chunk in iter(lambda: f.read(1024 * 1024), b""):
                h.update(chunk)
        return h.hexdigest()
    except OSError:
        return None


def review_with_ollama(items, model, limit):
    import urllib.request

    out_path = os.path.join(OUT_DIR, "forensic_adn_ollama_review.jsonl")
    reviewed = 0
    try:
        with open(out_path, "w", encoding="utf-8") as out:
            for it in items[:limit]:
                try:
                    with open(it["path"], "r", encoding="utf-8", errors="ignore") as f:
                        snippet = f.read(4000)
                    prompt = (
                        "Clasifica este archivo como uno de: MOTOR_REAL, LOGICA_NEGOCIO, "
                        "CONFIG, DATOS, FACHADA, OTRO. Una linea breve y el porqué.\n\n"
                        f"Archivo: {it['path']}\n\n{snippet[:3500]}"
                    )
                    req = urllib.request.Request(
                        "http://localhost:11434/api/generate",
                        data=json.dumps({
                            "model": model,
                            "prompt": prompt,
                            "stream": False,
                            "options": {"num_predict": 120, "temperature": 0.1},
                        }).encode("utf-8"),
                        headers={"Content-Type": "application/json"},
                    )
                    with urllib.request.urlopen(req, timeout=180) as resp:
                        body = json.loads(resp.read().decode("utf-8"))
                    out.write(json.dumps({
                        "path": it["path"],
                        "classification": body.get("response", "").strip(),
                    }, ensure_ascii=False) + "\n")
                    out.flush()
                    reviewed += 1
                    print(f"  🧠 [{reviewed}/{limit}] revisado: {it['path']}")
                except Exception as exc:
                    out.write(json.dumps({
                        "path": it["path"], "error": str(exc),
                    }, ensure_ascii=False) + "\n")
    except Exception as exc:
        print(f"  ⚠️ Revisión Ollama falló (¿modelo pre-cargado?): {exc}")
    return reviewed


def run(roots, max_files, review, model):
    existing_roots = [r for r in roots if os.path.isdir(r)]
    if not existing_roots:
        print("❌ Ninguna raíz de escaneo existe. Abortando.")
        return

    print("⚡ EAR OS — DEEP FORENSIC SWEEP S-CLASS")
    print(f"Raíces: {existing_roots}")
    print(f"Tope de candidatos: {max_files:,} | Tamaño máx: {MAX_FILE_SIZE/1e6:.2f} MB\n")

    os.makedirs(OUT_DIR, exist_ok=True)
    workers = min(12, (os.cpu_count() or 4))
    batch = 8000
    pool = ThreadPoolExecutor(max_workers=workers)

    # (size, prefix_digest) -> [count, first_path, second_path|None]
    quick_buckets = {}
    nuggets_heap = []
    cat_counts = defaultdict(int)
    nuggets_total = 0
    nuggets_seq = 0
    scanned = 0
    total = 0

    nuggets_ckpt = os.path.join(OUT_DIR, "forensic_adn_nuggets.jsonl")
    progress_path = os.path.join(OUT_DIR, "forensic_adn_progress.json")
    cp_file = open(nuggets_ckpt, "w", encoding="utf-8")

    start = time.time()

    def write_progress():
        with open(progress_path, "w", encoding="utf-8") as pf:
            json.dump({
                "scanned": scanned,
                "nuggets_total": nuggets_total,
                "prefix_dup_groups": len(quick_buckets),
                "elapsed_seconds": round(time.time() - start, 1),
            }, pf)

    def flush_batch(batch_paths):
        nonlocal total, nuggets_total, nuggets_seq
        for res in pool.map(process_file, batch_paths):
            total += 1
            if res is None:
                continue

            key = (res["size"], res["prefix_hash"])
            e = quick_buckets.get(key)
            if e is None:
                quick_buckets[key] = [1, res["path"], None]
            else:
                e[0] += 1
                if e[2] is None:
                    e[2] = res["path"]

            if res.get("interesting"):
                nuggets_total += 1
                for c in res["categories"]:
                    cat_counts[c] += 1
                score = res["score"]
                if len(nuggets_heap) < KEEP_TOP:
                    heapq.heappush(nuggets_heap, (score, nuggets_seq, res))
                elif score > nuggets_heap[0][0]:
                    heapq.heapreplace(nuggets_heap, (score, nuggets_seq, res))
                nuggets_seq += 1
                res.pop("prefix_hash", None)
                cp_file.write(json.dumps(res, ensure_ascii=False) + "\n")
        cp_file.flush()
        return len(batch_paths)

    current_batch = []
    try:
        for p in iter_candidate_paths(existing_roots, max_files):
            current_batch.append(p)
            if len(current_batch) >= batch:
                scanned += flush_batch(current_batch)
                current_batch = []
                if scanned % 50000 < batch:
                    elapsed = time.time() - start
                    print(f"  [{scanned:,} candidatos | {elapsed:.0f}s | pepitas={nuggets_total:,}]")
                write_progress()
        if current_batch:
            scanned += flush_batch(current_batch)
            write_progress()
    finally:
        cp_file.close()
        pool.shutdown(wait=True)

    elapsed = time.time() - start

    # ── Fase 2 de dedup: hash completo solo en grupos colisionantes por prefijo ──
    exact_duplicates = {}
    prefix_dup_candidates = {}
    for (_, ph), e in quick_buckets.items():
        if e[0] < 2:
            continue
        p1, p2 = e[1], e[2]
        if e[0] == 2 and p1 and p2:
            h1 = full_sha256(p1)
            h2 = full_sha256(p2)
            if h1 and h2 and h1 == h2:
                exact_duplicates.setdefault(h1, []).extend([p1, p2])
            else:
                prefix_dup_candidates[ph.hex()] = [p1, p2]
        else:
            # grupo grande: reportar como candidatos por (tamaño + hash de prefijo)
            prefix_dup_candidates[ph.hex()] = ([p1] if p1 else []) + ([p2] if p2 else []) + [f"... {e[0]} archivos"]

    nuggets_top = [obj for _, _, obj in sorted(nuggets_heap, key=lambda t: (-t[0], t[1]))]

    with open(os.path.join(OUT_DIR, "forensic_adn_nuggets.json"), "w", encoding="utf-8") as f:
        json.dump(nuggets_top, f, indent=2, ensure_ascii=False)
    with open(os.path.join(OUT_DIR, "forensic_adn_duplicates.json"), "w", encoding="utf-8") as f:
        json.dump({
            "exact_sha256_duplicate_groups": exact_duplicates,
            "prefix_duplicate_candidates": prefix_dup_candidates,
        }, f, indent=2, ensure_ascii=False)

    summary = {
        "roots": existing_roots,
        "scanned_candidates": scanned,
        "nuggets_found": nuggets_total,
        "nuggets_top_retained": len(nuggets_top),
        "exact_duplicate_groups": len(exact_duplicates),
        "prefix_duplicate_candidate_groups": len(prefix_dup_candidates),
        "elapsed_seconds": round(elapsed, 1),
        "nuggets_by_category": dict(sorted(cat_counts.items(), key=lambda kv: -kv[1])),
        "top_nuggets": [
            {"path": n["path"], "score": n["score"], "cats": n["categories"],
             "facade_risk": n["facade_risk"]} for n in nuggets_top[:60]
        ],
    }
    with open(os.path.join(OUT_DIR, "forensic_adn_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)

    print("\n══════════════════════ RESUMEN FORENSE ══════════════════════")
    print(f"Candidatos escaneados : {scanned:,}")
    print(f"Pepitas de oro (score>0): {nuggets_total:,}")
    print(f"Duplicados exactos (SHA-256): {len(exact_duplicates):,} grupos")
    print(f"Candidatos duplicados (prefijo): {len(prefix_dup_candidates):,} grupos")
    print(f"Tiempo: {elapsed:.0f}s")
    print("Categorías:")
    for cat, cnt in sorted(cat_counts.items(), key=lambda kv: -kv[1])[:10]:
        print(f"  - {cat}: {cnt}")
    print("\nTop 25 pepitas:")
    for n in nuggets_top[:25]:
        print(f"  [{n['score']:>6}] {n['path']}  | facade_risk={n['facade_risk']}")

    if review and nuggets_top:
        print(f"\n🧠 Revisión Ollama de top-{review} pepitas (modelo: {model})...")
        review_with_ollama(nuggets_top, model, review)

    print("\n✅ Reportes en:")
    for fname in ["forensic_adn_nuggets.json", "forensic_adn_duplicates.json", "forensic_adn_summary.json"]:
        print(f"   - {os.path.join(OUT_DIR, fname)}")
    print(f"   - {nuggets_ckpt} (checkpoint incremental completo)")
    print(f"   - {progress_path} (progreso)")


def parse_args(argv):
    roots = list(DEFAULT_ROOTS)
    max_files = DEFAULT_MAX_FILES
    review = 0
    model = "qwen-sclass"
    i = 0
    while i < len(argv):
        a = argv[i]
        if a in ("--roots", "-r") and i + 1 < len(argv):
            i += 1
            roots = []
            while i < len(argv) and not argv[i].startswith("--"):
                roots.append(argv[i].rstrip(";"))
                i += 1
            i -= 1
        elif a == "--max-files" and i + 1 < len(argv):
            i += 1
            max_files = int(argv[i])
        elif a in ("--review", "-rr") and i + 1 < len(argv):
            i += 1
            review = int(argv[i])
        elif a == "--ollama-model" and i + 1 < len(argv):
            i += 1
            model = argv[i]
        i += 1
    return roots, max_files, review, model


if __name__ == "__main__":
    r, mf, rv, mdl = parse_args(sys.argv[1:])
    try:
        run(r, mf, rv, mdl)
    except KeyboardInterrupt:
        print("\n⚠️ Interrumpido por el usuario. Reporte parcial conservado en JSONL de checkpoint.")