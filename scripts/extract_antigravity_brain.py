"""
Extrae la memoria persistente de Antigravity (Google Antigravity IDE + CLI agy)
en un índice JSON ligero y legible, listo para absorber por EAR OS:

  - conversations/  (*.pb, 92+)
  - brain/          (96 carpetas de artefactos)
  - annotations/    (38 .pbtxt)
  - mcp_config.json (servidores MCP conectados)
  - settings.json / trustedFolders.json / projects.json
  - builtin/skills + agy-customizations
  - SSOT del proyecto: EAR_OS_MASTER_MANUAL, PHASE_*_SSOT, OMEGA_STATE_JOURNAL

No parsea binarios pesados; solo lista rutas + tamaños y extrae texto de JSON/MD/TXT.
Salida: reports/antigravity_brain_index.json
"""

import os
import sys
import json
import time

if sys.stdout is not None and hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE = r"C:\Users\M2-W10\.gemini\antigravity"
GEMINI = r"C:\Users\M2-W10\.gemini"
PROJECT = r"H:\EAR_OS_V2\EAR_OS_V2"
OUT = os.path.join(PROJECT, "reports", "antigravity_brain_index.json")

TEXT_EXTS = {".md", ".txt", ".json", ".pbtxt", ".mjs", ".cjs", ".js", ".ts", ".tsx", ".py"}


def safe_read(path, limit=4000):
    try:
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            return f.read(limit)
    except OSError:
        return None


def index_dir(root, exts=TEXT_EXTS, name_filter=None):
    out = []
    if not os.path.isdir(root):
        return out
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d not in {"node_modules", ".git", ".next", "Cache", "Code Cache", "GPUCache", "Crashpad", "logs"}]
        for fn in filenames:
            if exts is not None and os.path.splitext(fn)[1].lower() not in exts:
                continue
            if name_filter and name_filter not in fn.lower():
                continue
            p = os.path.join(dirpath, fn)
            try:
                size = os.path.getsize(p)
            except OSError:
                size = -1
            item = {"path": p, "size": size}
            if size > 0 and size < 200_000 and os.path.splitext(fn)[1].lower() in {".json", ".md", ".txt", ".pbtxt"}:
                txt = safe_read(p)
                if txt is not None:
                    item["preview"] = txt[:2000]
            out.append(item)
    return out


def main():
    start = time.time()
    report = {
        "generated_at": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "base": BASE,
    }

    # 1. Conversaciones y artefactos (solo listado, son protobuf binarios)
    for name in ["conversations", "annotations", "brain", "html_artifacts", "scratch", "playground", "code_tracker", "implicit", "daemon"]:
        p = os.path.join(BASE, name)
        if os.path.isdir(p):
            entries = []
            for dp, dns, fns in os.walk(p):
                for fn in fns:
                    fp = os.path.join(dp, fn)
                    try:
                        entries.append({"path": fp, "size": os.path.getsize(fp)})
                    except OSError:
                        entries.append({"path": fp, "size": -1})
            report[name] = {"count": len(entries), "entries": entries[:500]}
            if len(entries) > 500:
                report[name]["note"] = f"truncado a 500 de {len(entries)}"

    # 2. Config en texto legible
    for fn in ["mcp_config.json", "antigravity_state.pbtxt", "user_settings.pb", "agyhub_summaries_proto.pb"]:
        fp = os.path.join(BASE, fn)
        if os.path.exists(fp):
            report[fn] = safe_read(fp, 6000)

    # 3. Config de Gemini
    for fn in ["settings.json", "state.json", "projects.json", "trustedFolders.json"]:
        fp = os.path.join(GEMINI, fn)
        if os.path.exists(fp):
            report[f"gemini_{fn}"] = safe_read(fp, 6000)

    # 4. Skills de Antigravity
    report["builtin_skills"] = index_dir(os.path.join(BASE, "builtin", "skills"))

    # 5. MCP StitchMCP (definiciones de herramientas)
    report["mcp_stitchmcp"] = index_dir(os.path.join(BASE, "mcp", "StitchMCP"))

    # 6. SSOT del proyecto (.antigravity)
    report["project_ssot"] = index_dir(os.path.join(PROJECT, ".antigravity"), name_filter=None)

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"Reporte Antigravity Brain: {OUT}")
    for k in ["conversations", "annotations", "brain", "html_artifacts", "scratch", "playground", "code_tracker", "implicit", "daemon", "builtin_skills", "mcp_stitchmcp", "project_ssot"]:
        v = report.get(k)
        if isinstance(v, dict) and "count" in v:
            print(f"  - {k}: {v['count']} elementos")
        elif isinstance(v, list):
            print(f"  - {k}: {len(v)} elementos")
    print(f"  tiempo: {time.time()-start:.1f}s")


if __name__ == "__main__":
    main()