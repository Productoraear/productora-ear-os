#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS UNIFIED MASTER PURIST ARCHIVIST (S-CLASS ZTM ENGINE v5.0)
================================================================
- Unificación aditiva total de capacidades de archivo y ordenación:
  * ztm_purist_archivist.py
  * big_data_purist_archivist.js
  * purist_archivist_daemon.py
  * organize_root_pure.py
  * 7179a7d0c0dbabf7c4a090c75a02a329_organizer.py
  * 8b48933ad7b2bfea44ce4a33cb2e648a_move_dups.py
- Limpieza quirúrgica de la raíz de EAR OS (eliminando desorden acumulado)
- Escaneo y purificación de discos C:, D:, H:
- Clasificación semántica multidimensional (DNDA, ASTRA, WHISPER, LEGAL, METRICAS, VAMPIRE)
- Generación de hashes criptográficos SHA-256 y registro en manifiesto
- Desplazamiento real (MOVE, no copy) hacia H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\{Categoria}\
- Telemetría Digital S-Class integrada con barra interactiva [████░░] % y badge de salida
"""
import os
import sys
import json
import hashlib
import shutil
import time
from pathlib import Path

# Importar telemetría nativa
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
                print(f"\n[HUD ACTIVE] {self.title}")
            def update(self, current, status="", item_info=""):
                pct = int((current / self.total) * 100)
                print(f"\r  [{'█'*(pct//5)}{'░'*(20-pct//5)}] {pct}% | {status} {item_info[:30]}", end="", flush=True)
            def finish(self, msg=""):
                print(f"\n[EXIT CODE 0] {msg}\n")

WORKSPACE_ROOT = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
VAULT_BASE = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT")
SCRIPTS_DIR = Path(__file__).resolve().parent.parent
MANIFEST_PATH = SCRIPTS_DIR / ".archived_manifest.json"
PROCESSED_HASHES_PATH = SCRIPTS_DIR / ".processed_hashes.json"

# Elementos legítimos e inmutables de la raíz del repositorio (JAMÁS MOVER)
PROTECTED_ROOT_ITEMS = {
    '.agents', '.antigravity', '.clineignore', '.clinerules', '.clinerules.bak',
    '.env', '.env.local', '.env.vercel.production', '.eslintignore', '.eslintrc.json',
    '.firebase', '.git', '.gitignore', '.models', '.next', '.npmrc', '.obsidian',
    '.vercel', '.vercelignore', 'AGENTS.md', 'CLAUDE.md', 'README.md', 'docs',
    'e2e', 'eslint.config.mjs', 'firestore.rules', 'lib', 'next-env.d.ts',
    'next.config.js', 'next.config.ts', 'node_modules', 'package-lock.json',
    'package.json', 'postcss.config.js', 'prisma', 'public', 'scripts', 'src',
    'supabase', 'tailwind.config.js', 'tools', 'tsconfig.json', 'tsconfig.scripts.json',
    'tsconfig.tsbuildinfo', 'vercel.json'
}

TARGET_SCAN_DIRS = [
    Path(r"H:\00_PRODUCTORA_EAR\BODEGA_CUARENTENA"),
    Path(r"H:\00_PRODUCTORA_EAR\00_AVE_FENIX"),
    Path(r"H:\00 EAR_OS_LEGACY_STAGING"),
    Path(r"H:\EAR_OS_V2\VERTICAL_INCUBADORA_VAMPIRIZADA"),
    Path(r"H:\SANTUARIO_EAR"),
    Path(r"C:\Users\M2-W10\Documents"),
    Path(r"C:\Users\M2-W10\Desktop")
]

IGNORED_PATTERNS = [
    'node_modules', '.git', '.next', 'AppData', '$RECYCLE.BIN',
    'EAR_ABSORBED_VAULT', 'Windows', 'Program Files', 'System Volume Information', '.gemini'
]

TEXT_DOC_EXTS = {'.md', '.txt', '.json', '.pdf', '.docx', '.doc', '.xlsx', '.csv', '.rtf', '.html', '.htm', '.log'}

def calculate_sha256(filepath):
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def detect_category(filename, content_sample=""):
    combined = f"{filename} {content_sample}".lower()
    if any(k in combined for k in ['dnda', 'sgae', 'aie', 'derecho de autor', 'propiedad intelectual', 'patente']):
        return "PROPIEDAD_INTELECTUAL_DNDA"
    elif any(k in combined for k in ['astra', 'neural', 'directiva', 'roadmap', 'academia', 'oraculo']):
        return "ACADEMIA_ASTRA"
    elif any(k in combined for k in ['whisper', 'transcrip', 'audio_log', 'entrevista']):
        return "TRANSCRIPCIONES_AUDIO"
    elif any(k in combined for k in ['contrato', 'precontrato', 'clausula', 'rider', 'pliego']):
        return "CONTRATOS_Y_LEGAL"
    elif any(k in combined for k in ['bodas.net', 'proveedor', 'fander', 'vampiriz', 'finca']):
        return "Providers"
    elif any(k in combined for k in ['factura', 'presupuesto', 'tarifa', 'pricing', 'stripe', 'balance', 'payload']):
        return "METRICAS_Y_VENTAS"
    elif any(k in combined for k in ['auditoria', 'forensic', 'report', 'benchmark']):
        return "AUDITORIA_Y_FORENSICA"
    else:
        return "DOCUMENTOS_HISTORICOS"

def load_manifest(path):
    if path.exists():
        try:
            with open(path, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_manifest(path, data):
    try:
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    except Exception as e:
        print(f"Error guardando {path}: {e}")

def clean_workspace_root(manifest, processed_hashes):
    """
    Sanea exhaustivamente la raíz de H:\\EAR_OS_V2\\EAR_OS_V2.
    Mueve carpetas residuales y archivos sueltos no protegidos al Vault.
    """
    if not WORKSPACE_ROOT.exists():
        return 0, 0

    stray_items = []
    for item in WORKSPACE_ROOT.iterdir():
        if item.name not in PROTECTED_ROOT_ITEMS:
            stray_items.append(item)

    if not stray_items:
        return 0, 0

    hud = DigitalHUD(f"PURIFICACIÓN DE RAÍZ EAR OS ({len(stray_items)} ELEMENTOS)", total=len(stray_items))
    moved_files = 0
    moved_folders = 0

    for idx, item in enumerate(stray_items, 1):
        hud.update(idx, status="Limpiando Raíz", item_info=item.name)
        try:
            if item.is_file():
                sha = calculate_sha256(item)
                cat = detect_category(item.name)
                dest_dir = VAULT_BASE / cat
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest_path = dest_dir / item.name
                if dest_path.exists():
                    dest_path = dest_dir / f"{item.stem}_{sha[:8]}{item.suffix}"

                shutil.move(str(item), str(dest_path))
                manifest[sha] = {
                    "original_path": str(item),
                    "vault_path": str(dest_path),
                    "category": cat,
                    "archived_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                    "source": "WORKSPACE_ROOT_CLEANUP"
                }
                processed_hashes.add(sha)
                moved_files += 1

            elif item.is_dir():
                # Mover carpeta de auditoría o cruft al Vault
                dest_dir = VAULT_BASE / "ROOT_MIGRATED_FOLDERS"
                dest_dir.mkdir(parents=True, exist_ok=True)
                dest_path = dest_dir / item.name
                if dest_path.exists():
                    dest_path = dest_dir / f"{item.name}_{int(time.time())}"

                shutil.move(str(item), str(dest_path))
                moved_folders += 1

        except Exception as err:
            pass

    hud.finish(f"Raíz limpia: {moved_files} archivos y {moved_folders} carpetas trasladados a Bóveda.")
    return moved_files, moved_folders

def run_master_archiving():
    VAULT_BASE.mkdir(parents=True, exist_ok=True)
    manifest = load_manifest(MANIFEST_PATH)
    processed_hashes = set(load_manifest(PROCESSED_HASHES_PATH).keys())

    # Fase 1: Limpieza de la Raíz de EAR OS
    clean_workspace_root(manifest, processed_hashes)
    save_manifest(MANIFEST_PATH, manifest)
    save_manifest(PROCESSED_HASHES_PATH, {k: True for k in processed_hashes})

    # Fase 2: Descubrimiento de archivos candidatos en unidades C:, D:, H:
    print("\n  [INSPECTION] Localizando activos en unidades locales...")
    candidates = []
    for base_dir in TARGET_SCAN_DIRS:
        if not base_dir.exists():
            continue
        try:
            for root, dirs, files in os.walk(base_dir):
                dirs[:] = [d for d in dirs if not any(p.lower() in d.lower() for p in IGNORED_PATTERNS)]
                for f in files:
                    ext = Path(f).suffix.lower()
                    if ext in TEXT_DOC_EXTS:
                        full_path = Path(root) / f
                        try:
                            if full_path.stat().st_size > 0:
                                candidates.append(full_path)
                        except Exception:
                            pass
        except Exception:
            pass

    total_candidates = len(candidates)
    if total_candidates == 0:
        print("  [SUCCESS] No hay archivos adicionales pendientes de purificación.")
        return

    # Inicializar Telemetría Digital S-Class
    hud = DigitalHUD(f"ARCHIVISTA PURISTA MASTER ({total_candidates} ARCHIVOS)", total=total_candidates)

    processed_count = 0
    moved_count = 0

    for idx, filepath in enumerate(candidates, 1):
        filename = filepath.name
        hud.update(idx, status="Archivando", item_info=filename)

        try:
            sha = calculate_sha256(filepath)
            if sha in processed_hashes:
                continue

            category = detect_category(filename)
            dest_dir = VAULT_BASE / category
            dest_dir.mkdir(parents=True, exist_ok=True)
            dest_path = dest_dir / filename

            if dest_path.exists() and dest_path != filepath:
                dest_path = dest_dir / f"{filepath.stem}_{sha[:8]}{filepath.suffix}"

            if filepath.resolve() != dest_path.resolve():
                shutil.move(str(filepath), str(dest_path))
                moved_count += 1

            manifest[sha] = {
                "original_path": str(filepath),
                "vault_path": str(dest_path),
                "category": category,
                "archived_at": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
                "source": "EXTERNAL_SWEEP"
            }
            processed_hashes.add(sha)
            processed_count += 1

            if processed_count % 50 == 0:
                save_manifest(MANIFEST_PATH, manifest)
                save_manifest(PROCESSED_HASHES_PATH, {k: True for k in processed_hashes})

        except Exception:
            pass

    save_manifest(MANIFEST_PATH, manifest)
    save_manifest(PROCESSED_HASHES_PATH, {k: True for k in processed_hashes})

    hud.finish(f"Purificación culminada: {moved_count} archivos reubicados en Vault. Manifiesto actualizado.")

if __name__ == "__main__":
    run_master_archiving()
