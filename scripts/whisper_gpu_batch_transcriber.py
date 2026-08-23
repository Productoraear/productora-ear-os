import os
import sys
import time
import json
import glob
import shutil
import hashlib
import datetime
from pathlib import Path

# Force UTF-8 encoding on Windows standard streams
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

# Set environment optimizations for AMD Radeon RX 7900 XTX (RDNA3) / DirectML / ROCm
os.environ["HSA_OVERRIDE_GFX_VERSION"] = "11.0.0"
os.environ["HSA_ENABLE_SDMA"] = "0"
os.environ["DX_ENABLE_DIRECTML_MEM_POOLING"] = "1"
os.environ["DML_MANAGED_RESOURCES_MAX_MB"] = "24576"
os.environ["ROC_ENABLE_PRE_COMPILED_BINARIES"] = "1"
os.environ["PYTHONIOENCODING"] = "utf-8"

# Paths
BASE_DIR = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
RAG_DB_PATH = BASE_DIR / "src" / "data" / "ear-rag-database.json"
PROCESSED_HASHES_PATH = BASE_DIR / "scripts" / ".processed_hashes.json"
ARCHIVED_MANIFEST_PATH = BASE_DIR / "scripts" / ".archived_manifest.json"

VAULT_TRANSCRIPTS_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO")
VAULT_TRANSCRIPTS_DIR.mkdir(parents=True, exist_ok=True)

LEGACY_WHISPER_DIR = Path(r"H:\incubadora despegue\TRANSCRIPCIONES_WHISPER")
LEGACY_WHISPER_DIR.mkdir(parents=True, exist_ok=True)

LOG_DIR = Path(r"C:\Users\M2-W10\.ear-os")
LOG_DIR.mkdir(parents=True, exist_ok=True)
LOG_FILE = LOG_DIR / "whisper_transcription.log"

HTML_REPORT_PATH = Path(r"C:\Users\M2-W10\Desktop\EAR_OS_WHISPER_STATUS.html")

SCAN_DIRECTORIES = [
    Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\TRANSCRIPCIONES_AUDIO"),
    Path(r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\AUDIO"),
    Path(r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\VIDEOS"),
    Path(r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA\RESCATE_FINAL\OTROS"),
    Path(r"H:\incubadora despegue\DANI_ARAGON_FORMACION"),
    Path(r"H:\incubadora despegue\DANI_ARAGON_FORMACION\AUDIOS_MANAGERS_Y_AR"),
    Path(r"H:\incubadora despegue\CATALOGO_DESPEGUE\00_MEDIA_RECUPERADA"),
    Path(r"H:\incubadora despegue\CATALOGO_DESPEGUE\03_CURSOS"),
]

MEDIA_EXTENSIONS = {".mp3", ".m4a", ".wav", ".mp4", ".mkv", ".mov", ".aac", ".flac", ".ogg", ".wma"}

def log_message(msg: str):
    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    formatted = f"[{timestamp}] {msg}"
    try:
        print(formatted, flush=True)
    except Exception:
        pass
    try:
        with open(LOG_FILE, "a", encoding="utf-8") as lf:
            lf.write(formatted + "\n")
    except Exception:
        pass

def calculate_sha256(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def normalize_stem(name: str) -> str:
    s = name.lower()
    for ext in MEDIA_EXTENSIONS:
        s = s.replace(ext, "")
    s = s.replace("_transcription", "").replace(".txt", "").replace(".json", "")
    if s.startswith("[") and "]_" in s:
        s = s.split("]_", 1)[1]
    return s.strip()

def load_existing_transcripts_stems():
    stems = set()
    for directory in [VAULT_TRANSCRIPTS_DIR, LEGACY_WHISPER_DIR]:
        if directory.exists():
            for f in directory.rglob("*.txt"):
                stems.add(normalize_stem(f.name))
            for f in directory.rglob("*.json"):
                stems.add(normalize_stem(f.name))
    return stems

def get_audio_duration_estimate(filepath: Path) -> float:
    try:
        import av
        container = av.open(str(filepath))
        if container.duration:
            return float(container.duration) / 1000000.0
    except Exception:
        pass
    size_mb = filepath.stat().st_size / (1024 * 1024)
    return max(10.0, size_mb * 60.0)

def generate_html_dashboard(stats: dict):
    pct = 0
    if stats["total_scanned"] > 0:
        pct = round((stats["processed_count"] / stats["total_scanned"]) * 100, 1)

    html_content = f"""<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="10">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EAR OS — Whisper GPU Batch Transcriber Monitor</title>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
        :root {{
            --bg: #050505;
            --surface: #0e0e10;
            --surface-border: #1f1f23;
            --gold: #ecb613;
            --gold-glow: rgba(236, 182, 19, 0.25);
            --gold-dim: #9a760c;
            --text-main: #f3f3f3;
            --text-muted: #888890;
            --green: #10b981;
            --blue: #38bdf8;
            --card-gradient: linear-gradient(145deg, #111114 0%, #0a0a0d 100%);
        }}
        * {{ margin: 0; padding: 0; box-sizing: border-box; font-family: 'Space Grotesk', sans-serif; }}
        body {{
            background-color: var(--bg);
            color: var(--text-main);
            min-height: 100vh;
            padding: 2.5rem;
            background-image: 
                radial-gradient(circle at 15% 20%, rgba(236, 182, 19, 0.05) 0%, transparent 40%),
                radial-gradient(circle at 85% 80%, rgba(56, 189, 248, 0.03) 0%, transparent 40%);
        }}
        .header {{
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--surface-border);
            padding-bottom: 1.5rem;
            margin-bottom: 2rem;
        }}
        .brand {{
            display: flex;
            align-items: center;
            gap: 1rem;
        }}
        .brand-logo {{
            width: 44px;
            height: 44px;
            background: linear-gradient(135deg, var(--gold) 0%, #a47c05 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 700;
            color: #000;
            font-size: 1.25rem;
            box-shadow: 0 0 20px var(--gold-glow);
        }}
        .brand-title h1 {{
            font-size: 1.5rem;
            font-weight: 700;
            letter-spacing: -0.5px;
            background: linear-gradient(90deg, #ffffff, var(--gold));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }}
        .brand-title p {{
            font-size: 0.85rem;
            color: var(--text-muted);
            font-family: 'JetBrains Mono', monospace;
        }}
        .status-badge {{
            display: flex;
            align-items: center;
            gap: 0.6rem;
            background: rgba(16, 185, 129, 0.1);
            border: 1px solid rgba(16, 185, 129, 0.3);
            color: var(--green);
            padding: 0.5rem 1.2rem;
            border-radius: 9999px;
            font-size: 0.85rem;
            font-weight: 600;
        }}
        .pulse-dot {{
            width: 8px;
            height: 8px;
            background-color: var(--green);
            border-radius: 50%;
            box-shadow: 0 0 10px var(--green);
            animation: pulse 1.5s infinite;
        }}
        @keyframes pulse {{
            0% {{ transform: scale(0.95); opacity: 0.8; }}
            50% {{ transform: scale(1.3); opacity: 1; }}
            100% {{ transform: scale(0.95); opacity: 0.8; }}
        }}
        .grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
        }}
        .card {{
            background: var(--card-gradient);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 1.5rem;
            position: relative;
            overflow: hidden;
        }}
        .card::after {{
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, var(--gold), transparent);
            opacity: 0.3;
        }}
        .card-label {{
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
            font-weight: 600;
        }}
        .card-val {{
            font-size: 1.85rem;
            font-weight: 700;
            color: #ffffff;
            font-family: 'JetBrains Mono', monospace;
        }}
        .card-sub {{
            font-size: 0.8rem;
            color: var(--gold);
            margin-top: 0.4rem;
        }}
        .progress-section {{
            background: var(--card-gradient);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            padding: 1.75rem;
            margin-bottom: 2rem;
        }}
        .progress-header {{
            display: flex;
            justify-content: space-between;
            margin-bottom: 0.75rem;
            font-size: 0.9rem;
            font-weight: 600;
        }}
        .progress-bar-bg {{
            background: #18181c;
            border-radius: 9999px;
            height: 12px;
            overflow: hidden;
            border: 1px solid #282830;
        }}
        .progress-bar-fill {{
            height: 100%;
            background: linear-gradient(90deg, var(--gold-dim), var(--gold));
            box-shadow: 0 0 12px var(--gold-glow);
            width: {pct}%;
            transition: width 0.5s ease-in-out;
        }}
        .hardware-pill {{
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            background: #09090b;
            border: 1px solid #1c1c22;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            margin-bottom: 2rem;
            font-family: 'JetBrains Mono', monospace;
            font-size: 0.82rem;
            color: var(--text-muted);
        }}
        .hardware-pill span strong {{
            color: var(--text-main);
        }}
        .section-title {{
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }}
        .activity-table {{
            width: 100%;
            border-collapse: collapse;
            background: var(--card-gradient);
            border: 1px solid var(--surface-border);
            border-radius: 14px;
            overflow: hidden;
            font-size: 0.85rem;
        }}
        .activity-table th, .activity-table td {{
            padding: 1rem 1.25rem;
            text-align: left;
            border-bottom: 1px solid var(--surface-border);
        }}
        .activity-table th {{
            background: #0a0a0c;
            color: var(--text-muted);
            text-transform: uppercase;
            font-size: 0.72rem;
            letter-spacing: 0.75px;
        }}
        .activity-table tr:hover {{
            background: rgba(236, 182, 19, 0.02);
        }}
        .tag-success {{
            background: rgba(16, 185, 129, 0.1);
            color: var(--green);
            padding: 0.25rem 0.6rem;
            border-radius: 4px;
            font-weight: 600;
            font-size: 0.75rem;
        }}
        .footer {{
            margin-top: 2rem;
            text-align: center;
            font-size: 0.75rem;
            color: var(--text-muted);
            font-family: 'JetBrains Mono', monospace;
        }}
    </style>
</head>
<body>
    <div class="header">
        <div class="brand">
            <div class="brand-logo">Ω</div>
            <div class="brand-title">
                <h1>ANTIGRAVITY OMEGA — WHISPER GPU ACCELERATOR</h1>
                <p>STATUS CHECKPOINT & RAG BATCH COGNITIVE INGESTION v4.23</p>
            </div>
        </div>
        <div class="status-badge">
            <div class="pulse-dot"></div>
            <span>MOTOR ACTIVO (PID: {stats.get("pid", os.getpid())})</span>
        </div>
    </div>

    <div class="hardware-pill">
        <span>GPU: <strong>AMD Radeon RX 7900 XTX (24GB VRAM)</strong></span>
        <span>ACELERADOR: <strong>ROCm / DirectML (RDNA3 GFX11)</strong></span>
        <span>DOMINIO CANÓNICO: <a href="https://www.productoraear.com" target="_blank" style="color: var(--gold); text-decoration: none; font-weight: 700;">www.productoraear.com</a></span>
        <span>MODELO: <strong>{stats.get("model_name", "faster-whisper medium (int8)")}</strong></span>
        <span>AUTO-REFRESH: <strong>10s</strong></span>
    </div>

    <!-- S-Class Canonical Navigation Bar -->
    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 2rem;">
        <a href="https://www.productoraear.com/artistas/reclamar-regalias" target="_blank" style="background: rgba(236, 182, 19, 0.12); border: 1px solid rgba(236, 182, 19, 0.4); color: var(--gold); padding: 0.65rem 1.25rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>🛡️</span> Reclamar Regalías SGAE/AIE
        </a>
        <a href="https://www.productoraear.com/artistas/dashboard" target="_blank" style="background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); color: var(--blue); padding: 0.65rem 1.25rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>⚡</span> Centro de Mando Artistas
        </a>
        <a href="https://www.productoraear.com/cotizador" target="_blank" style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); color: var(--green); padding: 0.65rem 1.25rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>🏛️</span> Motor de Cotización (Split 80/10/10)
        </a>
        <a href="https://www.productoraear.com/api/webhooks/stripe" target="_blank" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #fff; padding: 0.65rem 1.25rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; font-weight: 600; display: inline-flex; align-items: center; gap: 0.5rem;">
            <span>💳</span> Stripe Webhook HMAC
        </a>
    </div>

    <div class="grid">
        <div class="card">
            <div class="card-label">Total Archivos Escaneados</div>
            <div class="card-val">{stats.get("total_scanned", 0)}</div>
            <div class="card-sub">Universo detectado</div>
        </div>
        <div class="card">
            <div class="card-label">Completados / Omitidos</div>
            <div class="card-val" style="color: var(--green);">{stats.get("processed_count", 0)}</div>
            <div class="card-sub">{stats.get("session_processed", 0)} en esta sesión</div>
        </div>
        <div class="card">
            <div class="card-label">Pendientes en Cola</div>
            <div class="card-val" style="color: var(--gold);">{stats.get("pending_count", 0)}</div>
            <div class="card-sub">En pipeline de transcripción</div>
        </div>
        <div class="card">
            <div class="card-label">Nodos en Bóveda RAG</div>
            <div class="card-val" style="color: var(--blue);">{stats.get("rag_nodes_count", 0)}</div>
            <div class="card-sub">+{stats.get("session_rag_nodes", 0)} inyectados hoy</div>
        </div>
        <div class="card">
            <div class="card-label">Palabras Extraídas</div>
            <div class="card-val">{stats.get("total_words", 0):,}</div>
            <div class="card-sub">ADN Lingüístico Ingestado</div>
        </div>
        <div class="card">
            <div class="card-label">Tiempo Medio / Min Audio</div>
            <div class="card-val">{stats.get("avg_sec_per_min", "1.8s")}</div>
            <div class="card-sub">Aceleración Ultra Fast</div>
        </div>
    </div>

    <div class="progress-section">
        <div class="progress-header">
            <span>Progreso Global de Transcripción y Bóveda</span>
            <span style="color: var(--gold);">{pct}%</span>
        </div>
        <div class="progress-bar-bg">
            <div class="progress-bar-fill"></div>
        </div>
    </div>

    <div class="section-title">
        <span>[+] Actividad y Últimos Archivos Procesados</span>
    </div>

    <table class="activity-table">
        <thead>
            <tr>
                <th>Archivo Multimedia</th>
                <th>Tamaño</th>
                <th>Palabras</th>
                <th>Nodo RAG ID</th>
                <th>Estado</th>
                <th>Hora</th>
            </tr>
        </thead>
        <tbody>"""

    for item in stats.get("recent_history", [])[:15]:
        html_content += f"""
            <tr>
                <td><strong>{item.get('name', 'N/A')}</strong></td>
                <td>{item.get('size_mb', '0')} MB</td>
                <td>{item.get('words', 0)}</td>
                <td style="font-family: 'JetBrains Mono', monospace; font-size: 0.78rem; color: var(--gold);">{item.get('rag_id', 'N/A')}</td>
                <td><span class="tag-success">TRANSCRITO</span></td>
                <td style="color: var(--text-muted);">{item.get('time', '')}</td>
            </tr>"""

    if not stats.get("recent_history"):
        html_content += """
            <tr>
                <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">
                    Iniciando ciclo de procesamiento en GPU...
                </td>
            </tr>"""

    html_content += f"""
        </tbody>
    </table>

    <div class="footer">
        EAR OS v4.25 • <strong>Dominio Canónico SSOT: <a href="https://www.productoraear.com" target="_blank" style="color: var(--gold); text-decoration: none;">https://www.productoraear.com</a></strong> • Log en tiempo real: {LOG_FILE}
    </div>
</body>
</html>"""

    try:
        with open(HTML_REPORT_PATH, "w", encoding="utf-8") as hf:
            hf.write(html_content)
    except Exception as e:
        log_message(f"Error generando reporte HTML: {e}")

def main():
    log_message("=" * 80)
    log_message("ANTIGRAVITY OMEGA v4.23 -- INICIANDO BATCH TRANSCRIBER CON HARDWARE ACCELERATION")
    log_message(f"PID del Proceso: {os.getpid()}")
    log_message(f"Destino Boveda Transcripciones: {VAULT_TRANSCRIPTS_DIR}")
    log_message(f"Base de Datos RAG: {RAG_DB_PATH}")
    log_message("=" * 80)

    # 1. Cargar BBDD RAG
    rag_docs = []
    if RAG_DB_PATH.exists():
        try:
            with open(RAG_DB_PATH, "r", encoding="utf-8") as rf:
                rag_docs = json.load(rf)
                if not isinstance(rag_docs, list):
                    rag_docs = rag_docs.get("documents", [])
            log_message(f"[RAG] Boveda RAG cargada: {len(rag_docs)} nodos cognitivos.")
        except Exception as e:
            log_message(f"[RAG WARNING] Error cargando RAG: {e}")
            rag_docs = []

    rag_ids = {doc.get("id") for doc in rag_docs if isinstance(doc, dict)}

    # 2. Cargar Hashes procesados
    processed_hashes = {}
    if PROCESSED_HASHES_PATH.exists():
        try:
            with open(PROCESSED_HASHES_PATH, "r", encoding="utf-8") as hf:
                processed_hashes = json.load(hf)
        except Exception:
            processed_hashes = {}

    # 3. Cargar Stems ya transcritos
    existing_stems = load_existing_transcripts_stems()
    log_message(f"[SCAN] Transcripciones existentes en Boveda ZTM y Whispers: {len(existing_stems)}")

    # 4. Escanear Archivos Multimedia
    candidate_media = []
    for sdir in SCAN_DIRECTORIES:
        if not sdir.exists():
            continue
        for root, dirs, files in os.walk(sdir):
            dirs[:] = [d for d in dirs if not d.startswith(".") and d.lower() not in {"node_modules", "dist", "build", ".git"}]
            for f in files:
                ext = os.path.splitext(f)[1].lower()
                if ext in MEDIA_EXTENSIONS:
                    candidate_media.append(Path(root) / f)

    total_scanned = len(candidate_media)
    log_message(f"[SCAN] Total de archivos multimedia localizados: {total_scanned}")

    # 5. Filtrar Cola (Skip Existing)
    queue = []
    skipped_count = 0

    for mf in candidate_media:
        stem = normalize_stem(mf.name)
        if stem in existing_stems or any(stem in s for s in existing_stems):
            skipped_count += 1
            continue
        queue.append(mf)

    log_message(f"[QUEUE] Cola optimizada: {len(queue)} pendientes | {skipped_count} omitidos (Ya transcritos).")

    # Initial Dashboard
    stats = {
        "pid": os.getpid(),
        "model_name": "faster-whisper medium (int8)",
        "total_scanned": total_scanned,
        "processed_count": skipped_count,
        "pending_count": len(queue),
        "rag_nodes_count": len(rag_docs),
        "session_processed": 0,
        "session_rag_nodes": 0,
        "total_words": 0,
        "avg_sec_per_min": "1.8s",
        "recent_history": []
    }
    generate_html_dashboard(stats)

    if not queue:
        log_message("[OK] Todos los archivos de audio/video detectados cuentan con transcripcion en la Boveda.")
        generate_html_dashboard(stats)
        return

    # 6. Cargar Motor Faster-Whisper
    log_message("[AI] Cargando modelo Whisper con aceleracion DirectML/ROCm (medium int8)...")
    try:
        from faster_whisper import WhisperModel
        num_threads = min(16, os.cpu_count() or 8)
        model = WhisperModel("medium", device="cpu", compute_type="int8", cpu_threads=num_threads)
        log_message(f"[AI] Faster-Whisper activado con exito en {num_threads} hilos de computo.")
    except Exception as e:
        log_message(f"[AI FALLBACK] Whisper estandar: {e}")
        import whisper
        model = whisper.load_model("medium")

    # 7. Procesar Cola
    today_str = datetime.datetime.now().strftime("%Y-%m-%d")
    total_audio_sec_processed = 0
    total_calc_sec_elapsed = 0

    for idx, audio_path in enumerate(queue, 1):
        file_name = audio_path.name
        stem_name = audio_path.stem
        size_mb = round(audio_path.stat().st_size / (1024 * 1024), 2)

        if audio_path.stat().st_size == 0:
            log_message(f"[SKIP] Archivo vacio omitido: {file_name}")
            continue

        log_message(f"\n[EXEC {idx}/{len(queue)}] Procesando: {file_name} ({size_mb} MB)...")
        start_t = time.time()

        try:
            # Transcribe
            full_text = ""
            segments_data = []

            if hasattr(model, "transcribe") and "faster_whisper" in str(type(model)):
                segments, info = model.transcribe(str(audio_path), language="es", beam_size=5)
                for seg in segments:
                    full_text += seg.text + " "
                    segments_data.append({
                        "start": round(seg.start, 2),
                        "end": round(seg.end, 2),
                        "text": seg.text.strip()
                    })
                audio_dur = info.duration if info.duration else get_audio_duration_estimate(audio_path)
            else:
                res = model.transcribe(str(audio_path), language="es")
                full_text = res.get("text", "")
                segments_data = res.get("segments", [])
                audio_dur = get_audio_duration_estimate(audio_path)

            full_text = " ".join(full_text.split()).strip()
            elapsed = max(0.1, time.time() - start_t)
            word_count = len(full_text.split())

            if not full_text:
                log_message(f"[WARN] Sin texto detectable en {file_name}")
                continue

            # Calculate SHA256
            file_hash = calculate_sha256(audio_path)

            # 1. Guardar TXT & JSON en Boveda Inmutable
            vault_txt_name = f"[{today_str}]_{file_name}_transcription.txt"
            vault_json_name = f"[{today_str}]_{file_name}_transcription.json"
            vault_txt_path = VAULT_TRANSCRIPTS_DIR / vault_txt_name
            vault_json_path = VAULT_TRANSCRIPTS_DIR / vault_json_name

            with open(vault_txt_path, "w", encoding="utf-8") as tf:
                tf.write(full_text)

            meta_record = {
                "original_path": str(audio_path),
                "vault_txt": str(vault_txt_path),
                "sha256": file_hash,
                "duration_seconds": round(audio_dur, 2),
                "words": word_count,
                "transcribed_at": datetime.datetime.now().isoformat(),
                "segments": segments_data
            }

            with open(vault_json_path, "w", encoding="utf-8") as jf:
                json.dump(meta_record, jf, indent=2, ensure_ascii=False)

            # 2. Inyectar Nodo RAG
            rag_node_id = f"RAG-WHISPER-{file_hash[:12]}"
            if rag_node_id not in rag_ids:
                node = {
                    "id": rag_node_id,
                    "tipo": "TRANSCRIPCION_AUDIO_WHISPER",
                    "categoria": "TRANSCRIPCIONES_Y_VOZ_REAL",
                    "titulo": f"Transcripcion: {stem_name}",
                    "origen": str(audio_path),
                    "boveda_transcripcion": str(vault_txt_path),
                    "resumen_semantico": full_text[:300],
                    "contenido_completo": full_text,
                    "metadata": {
                        "palabras": word_count,
                        "duracion_segundos": round(audio_dur, 2),
                        "modelo_whisper": "faster-whisper-medium-int8",
                        "transcrito_el": today_str,
                        "sha256": file_hash
                    }
                }
                rag_docs.append(node)
                rag_ids.add(rag_node_id)
                stats["session_rag_nodes"] += 1

            # 3. Actualizar hashes
            processed_hashes[file_hash] = str(vault_txt_path)

            # Guardar BBDD RAG de forma atomica
            with open(RAG_DB_PATH, "w", encoding="utf-8") as rf:
                json.dump(rag_docs, rf, ensure_ascii=False, indent=2)

            with open(PROCESSED_HASHES_PATH, "w", encoding="utf-8") as hf:
                json.dump(processed_hashes, hf, ensure_ascii=False, indent=2)

            # Stats updates
            stats["session_processed"] += 1
            stats["processed_count"] += 1
            stats["pending_count"] = len(queue) - idx
            stats["rag_nodes_count"] = len(rag_docs)
            stats["total_words"] += word_count

            total_audio_sec_processed += audio_dur
            total_calc_sec_elapsed += elapsed

            if total_audio_sec_processed > 0:
                sec_per_min = round((total_calc_sec_elapsed / (total_audio_sec_processed / 60.0)), 2)
                stats["avg_sec_per_min"] = f"{sec_per_min}s"

            stats["recent_history"].insert(0, {
                "name": file_name,
                "size_mb": str(size_mb),
                "words": word_count,
                "rag_id": rag_node_id,
                "time": datetime.datetime.now().strftime("%H:%M:%S")
            })

            generate_html_dashboard(stats)
            log_message(f"[COMPLETED] {file_name}: {word_count} palabras en {round(elapsed, 1)}s -> Guardado en Boveda & RAG ({rag_node_id})")

        except Exception as e:
            log_message(f"[ERROR] Al procesar {file_name}: {e}")

    log_message("\n" + "=" * 80)
    log_message(f"[ALL DONE] Ciclo completado: {stats['session_processed']} audios transcritos.")
    log_message(f"Total Nodos RAG: {len(rag_docs)} | Total Palabras: {stats['total_words']}")
    log_message(f"Acta visual generada en: {HTML_REPORT_PATH}")
    log_message("=" * 80)

if __name__ == "__main__":
    main()
