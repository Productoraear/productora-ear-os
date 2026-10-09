"""
Localiza todos los rastros de Antigravity en el PC de forma quirúrgica y rápida:
  - .antigravity / .antigravity-ide (config y extensión del IDE)
  - tasks_queue.json, omega.js, omega-engine
  - agent files AGENTS.md / .clinerules / .cursorrules con doctrina Omega
  - vampiros / histórico de chats minados

Evita Windows, Program Files, data lakes y node_modules. Salida en
reports/antigravity_traces.json (ligero, solo rutas + tamaño + tipo).
"""

import os
import sys
import json
import time
from collections import defaultdict

if sys.stdout is not None and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Ubicaciones de alta probabilidad primero (rápida victoria)
FAST_ROOTS = [
    r"C:\Users\M2-W10\.antigravity",
    r"C:\Users\M2-W10\.antigravity-ide",
    r"C:\Users\M2-W10\AppData\Roaming",
    r"C:\Users\M2-W10\AppData\Local",
    r"C:\Users\M2-W10\AppData\Local\Programs",
    r"H:\EAR_OS_V2\EAR_OS_V2\.antigravity",
    r"H:\EAR_OS_V2\EAR_OS_V2",
]

# Raíces amplias adicionales (si se pide --wide)
WIDE_ROOTS = [
    r"C:\EAR_OS_V2",
    r"H:\EAR_OS_V2",
    r"C:\Users\M2-W10",
]

EXCLUDED_DIR_NAMES = {
    "windows", "program files", "program files (x86)", "programdata",
    "perflogs", "recovery", "$recycle.bin", "system volume information",
    "node_modules", ".git", ".next", ".turbo", ".vercel", ".netlify",
    ".cache", "__pycache__", "venv", ".venv", "site-packages",
    "dist", "build", "out", "coverage", ".idea", ".vscode",
    "temp", "tmp", "cache", "boot", "vault", "ear_absorbed_vault",
}

NAME_MATCH = (
    "antigravity", "omega", "tasks_queue", "omega-intent",
    "prompt-maestro", "clinerules", "cursorrules", "agents.md",
)

CRITICAL_NAMES = {
    "tasks_queue.json": "cola_de_tareas_omega",
    "omega.js": "motor_omega",
    "omega-intent-compiler.ts": "compilador_intenciones",
    "prompt-maestro-forge.ts": "forja_prompts",
    ".clinerules": "doctrina_cline",
    ".cursorrules": "doctrina_cursor",
    "AGENTS.md": "doctrina_agentes",
}

OUT = os.path.join(os.getcwd(), "reports", "antigravity_traces.json")


def scan(roots, depth_limit=None):
    results = defaultdict(list)
    seen_dirs = 0
    seen_files = 0

    for root in roots:
        if not os.path.isdir(root):
            continue
        base_depth = root.rstrip("\\/").count(os.sep)
        for dirpath, dirnames, filenames in os.walk(root):
            # poda de ruido
            dirnames[:] = [
                d for d in dirnames
                if d.lower() not in EXCLUDED_DIR_NAMES
                and ".antigravity" not in d.lower()
                or d.lower() == ".antigravity"
            ]
            depth = dirpath.rstrip("\\/").count(os.sep) - base_depth
            if depth_limit is not None and depth > depth_limit:
                dirnames[:] = []
                continue

            seen_dirs += 1

            # directorios antigravity + omegea
            for d in dirnames:
                dl = d.lower()
                if "antigravity" in dl or dl.startswith(".omega") or "omega" in dl:
                    p = os.path.join(dirpath, d)
                    kind = CRITICAL_NAMES.get(d, "directorio_antigravity")
                    results[kind].append(p)

            for fn in filenames:
                seen_files += 1
                fnl = fn.lower()
                if any(m in fnl for m in NAME_MATCH):
                    p = os.path.join(dirpath, fn)
                    kind = CRITICAL_NAMES.get(fn, "archivo_sospechoso")
                    try:
                        size = os.path.getsize(p)
                    except OSError:
                        size = -1
                    results[kind].append({"path": p, "size": size})

    return results, seen_dirs, seen_files


def main():
    wide = "--wide" in sys.argv
    roots = FAST_ROOTS + (WIDE_ROOTS if wide else [])
    start = time.time()
    results, dirs, files = scan(roots)
    elapsed = time.time() - start

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    # dedup preservando orden
    clean = {}
    for kind, entries in results.items():
        if entries and isinstance(entries[0], dict):
            uniq = {json.dumps(e, ensure_ascii=False): e for e in entries}
            clean[kind] = list(uniq.values())
        else:
            clean[kind] = list(dict.fromkeys(entries))

    total_paths = sum(len(v) for v in clean.values())

    with open(OUT, "w", encoding="utf-8") as f:
        json.dump({
            "elapsed_seconds": round(elapsed, 1),
            "dirs_visited": dirs,
            "files_seen": files,
            "total_traces": total_paths,
            "traces": clean,
        }, f, indent=2, ensure_ascii=False)

    print(f"Rastros Antigravity: {total_paths} | dirs={dirs:,} files={files:,} t={elapsed:.1f}s")
    for kind in sorted(clean, key=lambda k: -len(clean[k])):
        print(f"  - {kind}: {len(clean[kind])}")
        for e in clean[kind][:5]:
            print(f"      {e if isinstance(e, str) else e['path']}")
    print(f"\nReporte: {OUT}")


if __name__ == "__main__":
    main()