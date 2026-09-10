#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS HISTORIC CHAT COGNITIVE DISTILLER (S-CLASS NOTEBOOKLM PIPELINE)
======================================================================
- Destilación y refinado de 146 MB de conversaciones históricas con IA.
- Filtra el ruido técnico, volcados de terminal, diffs repetitivos y código boilerplate.
- Preserva el 100% de la visión, directivas y propuestas de Edwin Agudelo.
- Extrae las decisiones estratégicas, soluciones y marcos conceptuales de las IA.
- Desvía bloques masivos de código hacia el Vault (H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT\\EXTRACTED_CODE\\).
- Genera un archivo consolidado de alta densidad semántica perfectamente digerible por NotebookLM.
- Telemetría Digital S-Class integrada con barra en tiempo real.
"""
import os
import sys
import re
import time
from pathlib import Path

# Importar telemetría
try:
    from terminal_telemetry import DigitalHUD
except ImportError:
    sys.path.append(str(Path(__file__).resolve().parent.parent))
    try:
        from terminal_telemetry import DigitalHUD
    except ImportError:
        class DigitalHUD:
            def __init__(self, title="PROCESO", total=100):
                self.title = title
                self.total = max(1, total)
            def update(self, current, status="", item_info=""):
                pct = int((current / self.total) * 100)
                print(f"\r  [{'█'*(pct//5)}{'░'*(20-pct//5)}] {pct}% | {status} {item_info[:30]}", end="", flush=True)
            def finish(self, msg=""):
                print(f"\n[EXIT CODE 0] {msg}\n")

CHATS_VAULT = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS")
CODE_VAULT = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\EXTRACTED_CODE")
OUTPUT_NOTEBOOKLM_TEST = CHATS_VAULT / "NOTEBOOKLM_DESTILADO_TEST_2_SESIONES.md"
MASTER_CHRONICLE_WORKSPACE = Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs\EAR_OS_MASTER_CHRONICLE_AND_STATE.md")
MASTER_CHRONICLE_VAULT = CHATS_VAULT / "00_EAR_OS_MASTER_CHRONICLE_AND_STATE.md"

# Archivos de prueba seleccionados por el usuario (8.51 MB combinados)
TEST_FILES = [
    "SESSION_421f5f33-a56b-40ca-973f-df9cff493b3b.md",
    "SESSION_39f09488-62e5-4276-87d0-a8690220e2b7.md"
]

NOISE_LINE_PATTERNS = [
    r"^The user changed setting `Model Selection`",
    r"^The current local time is:",
    r"^Completed\s*$",
    r"^Cline wants to execute this command:",
    r"^\s*:\Program Files\\PowerShell\\7\\pwsh\.exe",
    r"^Conditional rules applied:workspace:",
    r"^30\.[0-9]k[0-9]+\.[0-9]k",
    r"^1/3\s*$", r"^2/3\s*$", r"^3/3\s*$", r"^4/7\s*$",
    r"^\s*npm\s+install",
    r"^\s*npx\s+tsc\s+--noEmit\s*$"
]

def is_noise_line(line):
    for pat in NOISE_LINE_PATTERNS:
        if re.search(pat, line):
            return True
    return False

def distill_chat_file(filepath: Path, code_dir: Path):
    """
    Destila un archivo de chat individual preservando ideas y desviando código masivo.
    """
    filename = filepath.name
    session_id = filepath.stem
    code_dir.mkdir(parents=True, exist_ok=True)

    distilled_sections = []
    current_role = "UNKNOWN"
    current_buffer = []
    
    in_code_block = False
    current_code_block = []
    current_code_lang = ""
    code_counter = 0

    total_lines = 0
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            total_lines += 1

    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        for line in f:
            stripped = line.strip()

            # Detección de roles
            if stripped.startswith("### User") or stripped.startswith("**User:**") or "<USER_REQUEST>" in stripped or stripped.startswith("USER:"):
                if current_buffer:
                    distilled_sections.append((current_role, "".join(current_buffer)))
                    current_buffer = []
                current_role = "EDWIN AGUDELO (CEO & VISIÓN)"
                continue
            elif stripped.startswith("### Assistant") or stripped.startswith("**Assistant:**") or stripped.startswith("ASSISTANT:") or stripped.startswith("MODEL:"):
                if current_buffer:
                    distilled_sections.append((current_role, "".join(current_buffer)))
                    current_buffer = []
                current_role = "SOLUCIÓN ARQUITECTÓNICA IA"
                continue

            # Manejo de bloques de código
            if stripped.startswith("```"):
                if not in_code_block:
                    in_code_block = True
                    current_code_lang = stripped[3:].strip()
                    current_code_block = [line]
                else:
                    in_code_block = False
                    current_code_block.append(line)
                    code_lines_count = len(current_code_block)
                    
                    # Si el bloque de código es grande (> 10 líneas), desviarlo a bóveda
                    if code_lines_count > 10:
                        code_counter += 1
                        ext = current_code_lang if current_code_lang else "txt"
                        code_filename = f"{session_id}_snippet_{code_counter:02d}.{ext}"
                        code_filepath = code_dir / code_filename
                        try:
                            with open(code_filepath, 'w', encoding='utf-8') as cf:
                                cf.writelines(current_code_block)
                            current_buffer.append(f"\n> 📦 **[CÓDIGO TÉCNICO ARCHIVADO EN BÓVEDA: `{code_filename}` ({code_lines_count} líneas)]**\n")
                        except Exception:
                            current_buffer.append(f"\n> 📦 **[CÓDIGO TÉCNICO OMITIDO PARA NOTEBOOKLM ({code_lines_count} líneas)]**\n")
                    else:
                        # Bloques pequeños de 2-9 líneas se conservan como contexto
                        current_buffer.extend(current_code_block)
                    current_code_block = []
                continue

            if in_code_block:
                current_code_block.append(line)
                continue

            # Filtro de líneas de ruido
            if is_noise_line(stripped):
                continue

            current_buffer.append(line)

    if current_buffer:
        distilled_sections.append((current_role, "".join(current_buffer)))

    return distilled_sections

def run_distillation_pipeline(process_all=False, target_filenames=None):
    CHATS_VAULT.mkdir(parents=True, exist_ok=True)
    CODE_VAULT.mkdir(parents=True, exist_ok=True)
    
    obsidian_distilled_folder = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\01_CHATS_DESTILADOS_SCLASS")
    obsidian_distilled_folder.mkdir(parents=True, exist_ok=True)

    resolved_paths = []
    
    if process_all:
        # Barrer todos los archivos markdown de chats historicos
        candidates = list(CHATS_VAULT.glob("*.md")) + list(Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs").glob("SESSION_*.md"))
        seen_names = set()
        for p in candidates:
            if p.name not in seen_names and "NOTEBOOKLM" not in p.name and "MASTER_CHRONICLE" not in p.name:
                seen_names.add(p.name)
                resolved_paths.append(p)
    elif target_filenames:
        for fn in target_filenames:
            p = CHATS_VAULT / fn
            if p.exists():
                resolved_paths.append(p)
            else:
                alt = Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs") / fn
                if alt.exists():
                    resolved_paths.append(alt)
    else:
        # Si no se especifica, detectar todos los chats disponibles en el Vault
        all_chats = list(CHATS_VAULT.glob("SESSION_*.md")) + list(CHATS_VAULT.glob("GEMINI_*.md"))
        if all_chats:
            resolved_paths = all_chats
        else:
            for fn in TEST_FILES:
                p = CHATS_VAULT / fn
                if p.exists():
                    resolved_paths.append(p)
                else:
                    alt = Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs") / fn
                    if alt.exists():
                        resolved_paths.append(alt)

    if not resolved_paths:
        print(f"  [!] No se localizaron archivos de chat en {CHATS_VAULT}")
        return

    output_master_file = CHATS_VAULT / "NOTEBOOKLM_DESTILADO_TOTAL_SCLASS.md"
    hud = DigitalHUD(f"DESTILADOR COGNITIVO SOTA // MODO OMEGA ({len(resolved_paths)} SESIONES)", total=len(resolved_paths))

    total_orig_bytes = sum(p.stat().st_size for p in resolved_paths)
    combined_output = []
    combined_output.append("# 🧠 DESTILADO COGNITIVO S-CLASS // NOTEBOOKLM MASTER KNOWLEDGE BASE\n")
    combined_output.append(f"> **Fecha de Generación:** {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    combined_output.append(f"> **SSOT:** Productora EAR / EAR OS v2.0\n")
    combined_output.append(f"> **Total Archivos Procesados:** {len(resolved_paths)}\n")
    combined_output.append(f"> **Volumen Crudo Analizado:** {total_orig_bytes / (1024*1024):.2f} MB\n")
    combined_output.append(f"> **Filtrado:** Ruido técnico, volcados de terminal y diffs masivos purgados. Código archivado en `EXTRACTED_CODE/`.\n\n---\n\n")

    for idx, p in enumerate(resolved_paths, start=1):
        hud.update(idx, "Destilando", p.name)
        sections = distill_chat_file(p, CODE_VAULT)
        
        session_header = f"\n## 🏛️ SESIÓN HISTÓRICA: `{p.name}`\n"
        session_header += f"*Tamaño original: {p.stat().st_size / 1024:.1f} KB | Interacciones de alto valor: {len(sections)}*\n\n"
        
        session_individual_content = [session_header]
        combined_output.append(session_header)

        for role, text in sections:
            block = f"### [{role}]\n{text.strip()}\n\n"
            combined_output.append(block)
            session_individual_content.append(block)
        
        combined_output.append("\n---\n")

        # Guardar copia individual destilada para Obsidian
        indiv_obsidian_file = obsidian_distilled_folder / f"DESTILADO_{p.stem}.md"
        with open(indiv_obsidian_file, 'w', encoding='utf-8') as iof:
            iof.writelines(session_individual_content)

    # Escribir archivo consolidado de NotebookLM
    with open(output_master_file, 'w', encoding='utf-8') as out_f:
        out_f.writelines(combined_output)
    
    # Tambien sincronizar el test_2_sesiones para retrocompatibilidad
    with open(OUTPUT_NOTEBOOKLM_TEST, 'w', encoding='utf-8') as test_f:
        test_f.writelines(combined_output[:5000])

    dest_bytes = output_master_file.stat().st_size
    reduction_pct = max(0, (1 - (dest_bytes / total_orig_bytes)) * 100)

    hud.finish(
        f"Destilación S-Class completada con éxito.\n"
        f"  > Archivos procesados           : {len(resolved_paths)}\n"
        f"  > Tamaño original total         : {total_orig_bytes / (1024*1024):.2f} MB\n"
        f"  > Destilado puro NotebookLM     : {dest_bytes / 1024:.2f} KB\n"
        f"  > Reducción de Ruido Técnico    : {reduction_pct:.1f}%\n"
        f"  > Archivo Master NotebookLM     : {output_master_file}\n"
        f"  > Carpeta Bóveda Obsidian       : {obsidian_distilled_folder}"
    )

    # Sincronizar Master Chronicle si existe
    sync_master_chronicle()

def sync_master_chronicle():
    """
    Sincroniza la Crónica Maestra desde workspace hacia el Vault.
    """
    try:
        if MASTER_CHRONICLE_WORKSPACE.exists():
            CHATS_VAULT.mkdir(parents=True, exist_ok=True)
            import shutil
            shutil.copy2(str(MASTER_CHRONICLE_WORKSPACE), str(MASTER_CHRONICLE_VAULT))
            print(f"  [SYNC] Crónica Maestra sincronizada en Vault: {MASTER_CHRONICLE_VAULT}")
    except Exception as e:
        print(f"  [SYNC ERROR] No se pudo copiar crónica a Vault: {e}")

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="EAR OS Historic Chat Cognitive Distiller")
    parser.add_argument("--all", action="store_true", help="Destilar TODOS los chats históricos de la carpeta")
    parser.add_argument("--files", nargs="*", help="Lista de archivos específicos a destilar")
    args = parser.parse_args()

    run_distillation_pipeline(process_all=args.all, target_filenames=args.files)
