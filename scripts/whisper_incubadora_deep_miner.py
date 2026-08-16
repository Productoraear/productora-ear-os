import os
import sys
import shutil
import json
import re
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor

TARGET_ROOT = Path(r"H:\incubadora despegue")
TARGET_ROOT.mkdir(parents=True, exist_ok=True)

SUBDIRS = [
    "TRANSCRIPCIONES_WHISPER",
    "AMPLIFY_MEDIA",
    "AMPLIFY_NEWS",
    "INFLUENCE",
    "MOMENTUM",
    "LA_BOMBILLA",
    "VELOCITY",
    "ESTRATEGIAS_Y_FRAMEWORKS"
]

for sd in SUBDIRS:
    (TARGET_ROOT / sd).mkdir(parents=True, exist_ok=True)

# Vocabulario Semántico & Expresiones Características
SEMANTIC_PATTERNS = {
    "TRANSCRIPCIONES_WHISPER": [
        r'\[\d{2}:\d{2}', r'WEBVTT', r'--> \d{2}:\d{2}', r'transcripci[oó]n', r'whisper',
        r'audio_transcrip', r'grabaci[oó]n', r'episodio', r'llamada con', r'reuni[oó]n con'
    ],
    "AMPLIFY_MEDIA": [
        r'amplify media', r'amplifymedia', r'amplify_media', r'amplify-media', r'amplify',
        r'correos_amplify', r'framework 10_80_10', r'el gigante con t[eé]cnica', r'filtro del precio'
    ],
    "AMPLIFY_NEWS": [
        r'amplify news', r'amplifynews', r'amplify_news', r'newsletter amplify'
    ],
    "INFLUENCE": [
        r'influence', r'substack influence', r'nueva newsletter influence', r'influencet'
    ],
    "MOMENTUM": [
        r'momentum', r'vector de momentum', r'inercia y momentum', r'palanca de momentum'
    ],
    "LA_BOMBILLA": [
        r'la bombilla', r'labombilla', r'la_bombilla', r'la-bombilla', r'bombilla de ideas'
    ],
    "VELOCITY": [
        r'velocity', r'velocidad de ejecuci[oó]n', r'pipeline velocity', r'velocity engine'
    ],
    "ESTRATEGIAS_Y_FRAMEWORKS": [
        r'incubadora.*despegue', r'oferta irresistible', r'lead magnet', r'dream 100',
        r'carta de ventas', r'vsl', r'embudo de conversi[oó]n', r'high ticket', r'ticket alto',
        r'stack de valor', r'reversi[oó]n de riesgo', r'secuencia de bienvenida',
        r'llamada de triaje', r'estrategia de lanzamiento', r'psicolog[ií]a de conversi[oó]n'
    ]
}

COMPILED_PATTERNS = {
    cat: [re.compile(p, re.IGNORECASE) for p in pats]
    for cat, pats in SEMANTIC_PATTERNS.items()
}

SEARCH_PATHS = [
    Path(r"H:\00_PRODUCTORA_EAR"),
    Path(r"H:\EAR_OS_MASTER_2026"),
    Path(r"H:\EAR_OS_BUNKER_CONSOLIDADO"),
    Path(r"H:\EAR_VAULT_XMIND_INBOX"),
    Path(r"H:\SANTUARIO_EAR"),
    Path(r"H:\SANTUARIO_RESCATE_FINAL"),
    Path(r"H:\00 EAR_OS_LEGACY_STAGING"),
    Path(r"H:\AI_MODELS"),
    Path(r"H:\AI_MODELS_HUB"),
    Path(r"C:\EAR_OS_V2"),
    Path(r"C:\Users\M2-W10\Desktop"),
    Path(r"C:\Users\M2-W10\Documents"),
    Path(r"C:\Users\M2-W10\Downloads"),
    Path(r"D:\00_SILICON_VALLEY_MASTER_ARCHIVE"),
    Path(r"D:\01_VERTICAL_EVENTOS"),
    Path(r"D:\02_VERTICAL_VIMUME"),
    Path(r"D:\EAR_OS_INTEL_BUNKER"),
    Path(r"D:\EAR_VAULT"),
    Path(r"D:\VAMPIRIZADOS"),
    Path(r"D:\OS AZUL"),
    Path(r"D:\USUARIO_DATOS")
]

SKIP_FOLDERS = {
    ".git", "node_modules", ".next", ".cache", "AppData", "$RECYCLE.BIN",
    "System Volume Information", "Epic Games", "Windows", "Program Files",
    "BRUTOS_VIDEO", "BRUTOS_AUDIO", "BRUTOS_FOTOS", "COPIAS_DE_SEGURIDAD",
    "MUSICA_PERSONAL_(Coleccion_FLAC)", "_PAPELERA_REVISION", "HDAVINCI_WORKINGPROXIES",
    "incubadora despegue", "dist", "build", ".venv", "venv"
}

ALLOWED_EXTENSIONS = {
    ".txt", ".md", ".json", ".srt", ".vtt", ".csv", ".tsv",
    ".docx", ".doc", ".pdf", ".xmind", ".html", ".py", ".ts"
}

print("[*] Iniciando Barredura Semántica Profunda de 100 Niveles...")
sys.stdout.flush()

matched_records = []
seen_files = set()

def analyze_file(file_path: Path):
    if str(file_path).lower() in seen_files:
        return None
    seen_files.add(str(file_path).lower())

    if not file_path.exists() or file_path.is_dir():
        return None

    fname = file_path.name
    fname_lower = fname.lower()

    # 1. Match por nombre
    matched_cats = set()
    for cat, regexes in COMPILED_PATTERNS.items():
        for r in regexes:
            if r.search(fname_lower):
                matched_cats.add(cat)
                break

    # 2. Match por contenido (primeros 30KB)
    content_snippet = ""
    try:
        if file_path.suffix.lower() in {".txt", ".md", ".json", ".srt", ".vtt", ".csv", ".tsv", ".html", ".py"}:
            if file_path.stat().st_size < 10 * 1024 * 1024: # max 10MB
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    chunk = f.read(32768) # 32 KB
                    for cat, regexes in COMPILED_PATTERNS.items():
                        score = sum(1 for r in regexes if r.search(chunk))
                        if score >= 1:
                            matched_cats.add(cat)
                    if matched_cats:
                        content_snippet = chunk[:300].replace("\n", " ").strip()
    except Exception:
        pass

    if matched_cats:
        return {
            "path": file_path,
            "categories": list(matched_cats),
            "size_kb": round(file_path.stat().st_size / 1024, 2),
            "snippet": content_snippet
        }
    return None

# Recorrer directorios en paralelo
all_candidate_files = []
for s_dir in SEARCH_PATHS:
    if not s_dir.exists():
        continue
    print(f"[*] Escaneando: {s_dir}...")
    sys.stdout.flush()
    try:
        for root, dirs, files in os.walk(s_dir):
            dirs[:] = [d for d in dirs if d not in SKIP_FOLDERS and not d.startswith(".")]
            for f in files:
                ext = Path(f).suffix.lower()
                if ext in ALLOWED_EXTENSIONS:
                    all_candidate_files.append(Path(root) / f)
    except Exception as e:
        print(f"[!] Error explorando {s_dir}: {e}")

print(f"[*] Total archivos candidatos a inspección semántica: {len(all_candidate_files)}")
sys.stdout.flush()

with ThreadPoolExecutor(max_workers=16) as executor:
    results = executor.map(analyze_file, all_candidate_files)

for res in results:
    if res:
        matched_records.append(res)

print(f"[+] Total archivos identificados con ADN semántico: {len(matched_records)}")
sys.stdout.flush()

# Copiar a H:\incubadora despegue
manifest_entries = []
copied_count = 0
total_bytes = 0

for item in matched_records:
    src_path = item["path"]
    if str(src_path).startswith(str(TARGET_ROOT)):
        continue

    # Destino según categoría prioritaria
    primary_cat = item["categories"][0]
    dest_dir = TARGET_ROOT / primary_cat
    dest_file = dest_dir / src_path.name

    counter = 1
    while dest_file.exists() and dest_file.stat().st_size != src_path.stat().st_size:
        dest_file = dest_dir / f"{src_path.stem}_{counter}{src_path.suffix}"
        counter += 1

    try:
        if not dest_file.exists():
            shutil.copy2(src_path, dest_file)
            copied_count += 1
            total_bytes += src_path.stat().st_size
        
        manifest_entries.append({
            "name": dest_file.name,
            "category": primary_cat,
            "all_categories": item["categories"],
            "original_path": str(src_path),
            "target_path": str(dest_file),
            "size_kb": item["size_kb"],
            "snippet": item["snippet"][:150]
        })
    except Exception as e:
        print(f"Error copiando {src_path}: {e}")

# Markdown Master Index
md_lines = [
    "# 🚀 INCUBADORA DESPEGUE - BARRIDO SEMÁNTICO TOTAL (100 NIVELES)",
    f"**Ruta Raíz en Disco H:** `{TARGET_ROOT}`",
    f"**Total Archivos y Transcripciones Whisper:** {len(manifest_entries)}",
    f"**Volumen Consolidado:** {round(total_bytes / (1024 * 1024), 2)} MB",
    "",
    "---",
    ""
]

by_cat = {}
for entry in manifest_entries:
    by_cat.setdefault(entry["category"], []).append(entry)

for cat_name, items in sorted(by_cat.items()):
    md_lines.append(f"## 📂 {cat_name} ({len(items)} archivos)")
    md_lines.append(f"**Ubicación:** `{TARGET_ROOT / cat_name}`")
    md_lines.append("")
    md_lines.append("| Archivo | Tamaño (KB) | Ruta Origen |")
    md_lines.append("|---|---|---|")
    for it in sorted(items, key=lambda x: x["name"])[:100]:
        md_lines.append(f"| `{it['name']}` | {it['size_kb']} | `{it['original_path']}` |")
    if len(items) > 100:
        md_lines.append(f"| *... y {len(items)-100} archivos adicionales* | | |")
    md_lines.append("")

with open(TARGET_ROOT / "INDICE_MAESTRO_SEMANTICO.md", "w", encoding="utf-8") as f:
    f.write("\n".join(md_lines))

with open(TARGET_ROOT / "manifest_semantico.json", "w", encoding="utf-8") as f:
    json.dump(manifest_entries, f, indent=2, ensure_ascii=False)

print(f"[OK] BARRIDO Y UNIFICACION COMPLETADOS.")
print(f"[OK] Total archivos copiados y clasificados: {len(manifest_entries)}")
print(f"[OK] Destino: {TARGET_ROOT}")
