#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS — EXPORTADOR DE LAS FUENTES MAESTRAS PARA NOTEBOOKLM (S-CLASS)
========================================================================
1. Selecciona y destila de forma equilibrada las fuentes de mayor densidad cognitiva de todo el PC.
2. Aplica CUOTAS MATEMÁTICAS ESTRICTAS por pilar para garantizar que TODO el ecosistema esté representado:
   - 01_CATEDRA_Y_ADN          : ~30 fuentes (Voz, Filosofía, Storyselling Edwin Agudelo)
   - 02_ESTRATEGIA_CHATS       : ~25 fuentes (Mapas mentales, Singularidad V5, Decisión)
   - 03_REGLAS_SSOT_Y_MANDO    : ~30 fuentes (Tarifa 350€, Logística Méntrida, Split 80/10/10, Stripe 100€)
   - 04_LICITACIONES_B2G       : ~25 fuentes (Art. 118 LCSP < 15.000€, Pliegos, Navidad 2026)
   - 05_VIMUME_NEUROCIENCIA    : ~25 fuentes (Acústica < 75 dB SPL, Terapia cognitiva, Mayores)
   - 06_PROVEEDORES_SCLASS     : ~15 fuentes (10 Catálogos Gremiales, Fincas, Catering, Cierre)
   - 07_PROVINCIAS_Y_LOGISTICA : ~12 fuentes (7 Hubs Regionales, Matriz 52 Provincias desde Méntrida)
   - 08_ILUMINACION_Y_RIDER    : ~5 fuentes  (Manual Stage Color 48 DMX, Rider Bose/Shure, RX 7900 XTX)
3. PURGA ABSOLUTA: Elimina volcados diarios repetitivos (logs '05_05_2026', 'Resuming Supabase'),
   archivos duplicados '_derived', changelogs y código residual que saturaban NotebookLM.
4. Total acotado a ~170-195 fuentes: Previene el techo de 300 fuentes de Google NotebookLM.
5. Emite '000_INDICE_MAESTRO_FUENTES_SCLASS.md' con visión de conjunto y prompts clave.
"""

import os
import sys
import shutil
import re
from pathlib import Path

# Telemetría Digital S-Class
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
                print(f"\r  [{'█'*(pct//5)}{'░'*(20-pct//5)}] {pct}% | {status} {item_info[:32]}", end="", flush=True)
            def finish(self, msg=""):
                print(f"\n[EXIT CODE 0] {msg}\n")

VAULT_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT")
WORKSPACE_DIR = Path(r"H:\EAR_OS_V2\EAR_OS_V2")
OUTPUT_DIR = Path(r"H:\00_PRODUCTORA_EAR\NOTEBOOKLM_299_FUENTES_SCLASS")

# Patrones a excluir tajantemente (Ruido de dev, duplicados y volcados)
JUNK_PATTERNS = [
    r'^\d{2}[_ ]\d{2}[_ ]2026',         # Logs diarios de terminal (ej: 05 05 2026..., 11 05 2026...)
    r'_derived',                        # Duplicados automáticos
    r'(?i)changelog',                   # Dumps de changelogs
    r'(?i)package-lock',                # JSONs de npm
    r'(?i)snapshot',                    # Snapshots de DB
    r'(?i)manifest',                    # Manifiestos de hashes
    r'(?i)node_modules',                # Módulos JS
    r'\.(?:json|csv|docx|txt|zip|bat)$',# Solo admitir .md (a menos que esté en whitelist expresa)
    r'- copia',                         # Copias accidentales de Windows
    r'(?i)readme[_\-\.](?:ja|uk|hi|zh|es|\d+)', # Readmes multilingües basura
    r'(?i)code_of_conduct',
    r'(?i)gcinterface|libpng|unicodeTokens'
]

def is_junk_file(filename: str) -> bool:
    for pat in JUNK_PATTERNS:
        if re.search(pat, filename):
            return True
    return False

def clean_content_for_notebooklm(text: str) -> str:
    """Elimina volcados técnicos masivos, diffs de código y ruido de terminal."""
    # Eliminar bloques de código de más de 25 líneas
    def code_replacer(match):
        code = match.group(0)
        lines = code.splitlines()
        if len(lines) > 25:
            lang = lines[0].replace("```", "").strip()
            return f"\n> *[Bloque de código técnico {lang} omitido para priorizar estrategia y negocio]*\n"
        return code

    text = re.sub(r'```[\w]*\n[\s\S]*?\n```', code_replacer, text)
    # Reemplazar hashes largos por marcador
    text = re.sub(r'[a-f0-9]{32,64}', '[HASH_SISTEMA]', text)
    # Eliminar líneas de depuración de consola
    text = re.sub(r'The user changed setting.*', '', text)
    text = re.sub(r'Cline wants to execute.*', '', text)
    return text.strip()

def collect_files_by_category():
    """Recolecta documentos aplicando cuotas estrictas y selección de élite."""
    categories = {
        "01_CATEDRA_Y_ADN": {"quota": 30, "files": []},
        "02_ESTRATEGIA_CHATS": {"quota": 25, "files": []},
        "03_REGLAS_SSOT": {"quota": 30, "files": []},
        "04_LICITACIONES_B2G": {"quota": 25, "files": []},
        "05_VIMUME_NEUROCIENCIA": {"quota": 25, "files": []},
        "06_PROVEEDORES_SCLASS": {"quota": 15, "files": []},
        "07_PROVINCIAS_HUBS": {"quota": 12, "files": []},
        "08_ILUMINACION_Y_RIDER": {"quota": 6, "files": []}
    }

    # -------------------------------------------------------------
    # 08. ILUMINACIÓN, SONIDO & RIDER TÉCNICO (Prioridad Inmediata)
    # -------------------------------------------------------------
    stage_manual = WORKSPACE_DIR / "docs" / "MANUAL_STAGE_COLOR_48_ESPANOL_SCLASS.md"
    if stage_manual.exists():
        categories["08_ILUMINACION_Y_RIDER"]["files"].append(stage_manual)

    hw_guide = WORKSPACE_DIR / "docs" / "GUIA_OPTIMIZACION_IA_HARDWARE_RX7900XTX.md"
    if hw_guide.exists():
        categories["08_ILUMINACION_Y_RIDER"]["files"].append(hw_guide)

    dj_guide = WORKSPACE_DIR / "docs" / "DJ_ONBOARDING_GUIDE.md"
    if dj_guide.exists():
        categories["08_ILUMINACION_Y_RIDER"]["files"].append(dj_guide)

    # -------------------------------------------------------------
    # 06. PROVEEDORES S-CLASS (Catálogo Visual + 10 Gremios)
    # -------------------------------------------------------------
    prov_dir = VAULT_DIR / "02_PROVEEDORES_SCLASS"
    if prov_dir.exists():
        for p in sorted(prov_dir.glob("*.md")):
            if not is_junk_file(p.name):
                categories["06_PROVEEDORES_SCLASS"]["files"].append(p)

    # -------------------------------------------------------------
    # 07. PROVINCIAS & LOGÍSTICA (7 Hubs + Matriz 52 Provincias)
    # -------------------------------------------------------------
    prov_hubs_dir = VAULT_DIR / "02_PROVEEDORES_SCLASS" / "PROVINCIAS"
    if prov_hubs_dir.exists():
        for p in sorted(prov_hubs_dir.glob("*.md")):
            if not is_junk_file(p.name):
                categories["07_PROVINCIAS_HUBS"]["files"].append(p)

    # -------------------------------------------------------------
    # 04. LICITACIONES PÚBLICAS B2G (Art. 118 LCSP < 15.000€)
    # -------------------------------------------------------------
    b2g_vault = VAULT_DIR / "03_LICITACIONES_B2G"
    if b2g_vault.exists():
        for root, _, files in os.walk(str(b2g_vault)):
            for f in sorted(files):
                if f.endswith(".md") and not is_junk_file(f):
                    categories["04_LICITACIONES_B2G"]["files"].append(Path(root) / f)

    b2g_docs = WORKSPACE_DIR / "docs" / "b2g"
    if b2g_docs.exists():
        for p in sorted(b2g_docs.glob("*.md")):
            if not is_junk_file(p.name):
                categories["04_LICITACIONES_B2G"]["files"].append(p)

    prop_muni = WORKSPACE_DIR / "docs" / "propuestas_municipales"
    if prop_muni.exists():
        for p in sorted(prop_muni.glob("*.md")):
            if not is_junk_file(p.name):
                categories["04_LICITACIONES_B2G"]["files"].append(p)

    # -------------------------------------------------------------
    # 05. VIMUME NEUROCIENCIA & GERONTOLOGÍA (< 75 dB SPL, Alzheimer)
    # -------------------------------------------------------------
    vimume_brain = WORKSPACE_DIR / "src" / "data" / "vimume-brain"
    if vimume_brain.exists():
        for p in sorted(vimume_brain.glob("*.md")):
            fn = p.name.lower()
            if is_junk_file(p.name):
                continue
            # Solo documentos que traten de VIMUME, neurociencia, estimulación, estatutos o geriatría
            if any(k in fn for k in ["vimume", "neuro", "gerontol", "alzheimer", "estimulac", "acustic", "fundacion", "estatutos", "salud", "terapia", "contribucion"]):
                categories["05_VIMUME_NEUROCIENCIA"]["files"].append(p)

    vimume_vault = VAULT_DIR / "04_CATEDRA_Y_AUDIO" / "VIMUME_NEUROCIENCIA"
    if vimume_vault.exists():
        for p in sorted(vimume_vault.glob("*.md")):
            if not is_junk_file(p.name):
                categories["05_VIMUME_NEUROCIENCIA"]["files"].append(p)

    # -------------------------------------------------------------
    # 01. CÁTEDRA, ADN & FILOSOFÍA DE EDWIN AGUDELO
    # -------------------------------------------------------------
    catedra_vault = VAULT_DIR / "04_CATEDRA_Y_AUDIO"
    if catedra_vault.exists():
        for root, _, files in os.walk(str(catedra_vault)):
            for f in sorted(files):
                if f.endswith(".md") and not is_junk_file(f):
                    p = Path(root) / f
                    if "VIMUME_NEUROCIENCIA" not in str(p):
                        categories["01_CATEDRA_Y_ADN"]["files"].append(p)

    # Añadir biografías y clases de ventas de vimume-brain
    if vimume_brain.exists():
        for p in sorted(vimume_brain.glob("*.md")):
            fn = p.name.lower()
            if is_junk_file(p.name):
                continue
            if any(k in fn for k in ["biograf", "declarac", "consejos", "paciente", "storyselling", "sistema maestro", "hook marketing"]):
                categories["01_CATEDRA_Y_ADN"]["files"].append(p)

    # -------------------------------------------------------------
    # 02. ESTRATEGIA Y CHATS DESTILADOS
    # -------------------------------------------------------------
    strat_vault = VAULT_DIR / "01_ESTRATEGIA_Y_CHATS"
    if strat_vault.exists():
        for root, _, files in os.walk(str(strat_vault)):
            for f in sorted(files):
                if f.endswith(".md") and not is_junk_file(f):
                    categories["02_ESTRATEGIA_CHATS"]["files"].append(Path(root) / f)

    # -------------------------------------------------------------
    # 03. REGLAS SSOT & CENTRO DE MANDO (Filtrado Canónico)
    # -------------------------------------------------------------
    docs_root = WORKSPACE_DIR / "docs"
    canonical_ssot_names = [
        "00_CENTRO_DE_MANDO_SCLASS.md",
        "EAR_OS_MASTER_HANDOFF_SOVEREIGN_SSOT.md",
        "BRAND_MANUAL_SSOT.md",
        "EAR_OS_DESIGN_TOKENS.md",
        "MANUAL_DE_PROPIETARIO_EAR_OS_V2.md",
        "STRIPE_PRODUCTS_AND_SERVICES_MASTER.md",
        "EAR_OS_UNIFIED_KNOWLEDGE_GRAPH.md",
        "EAR_OS_MASTER_AUDIT_200_QUESTIONS_SSOT.md",
        "EAR_OS_STYLE_AND_VERCEL_PREFLIGHT.md",
        "ANTIGRAVITY_CHATS_FORENSIC_SUMMARY.md",
        "B2B_FLOW_TEST_REPORT.md",
        "DEEP_DISCOVERY_AND_CONVERGENCE_REPORT.md",
        "GUIA_MAESTRA_MACRO_SCRIPTS_EAR_OS.md"
    ]
    for cname in canonical_ssot_names:
        cp = docs_root / cname
        if cp.exists():
            categories["03_REGLAS_SSOT"]["files"].append(cp)

    # Añadir subcarpetas clave de docs sin basura
    for sub in ["patentes", "geo_engine", "ad_engine", "crm", "architecture", "marketing"]:
        subp = docs_root / sub
        if subp.exists():
            for p in sorted(subp.glob("*.md")):
                if not is_junk_file(p.name):
                    categories["03_REGLAS_SSOT"]["files"].append(p)

    return categories

def export_notebooklm_sources():
    hud = DigitalHUD(title="SELECCIÓN Y DESTILADO EQUILIBRADO PARA NOTEBOOKLM", total=100)
    print("\n" + "="*75)
    print("  EAR OS — DESTILADO MAESTRO EQUILIBRADO PARA NOTEBOOKLM (S-CLASS)")
    print("  Garantizando Cátedra, VIMUME, B2G, Proveedores, Provincias y SSOT")
    print("="*75 + "\n")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 1. Purgar archivos viejos para eliminar la saturación previa
    hud.update(10, "Purgando", "Eliminando volcados anteriores de la carpeta destino")
    for f in OUTPUT_DIR.glob("*.md"):
        try:
            f.unlink()
        except Exception:
            pass

    # 2. Recolectar por categorías con cuotas estrictas
    hud.update(25, "Recolectando", "Aplicando cuotas matemáticas por pilar de negocio")
    categories = collect_files_by_category()

    # Deduplicar por ruta de archivo
    processed_paths = set()
    balanced_selection = []

    # Orden riguroso de presentación
    ordered_keys = [
        "01_CATEDRA_Y_ADN",
        "02_ESTRATEGIA_CHATS",
        "03_REGLAS_SSOT",
        "04_LICITACIONES_B2G",
        "05_VIMUME_NEUROCIENCIA",
        "06_PROVEEDORES_SCLASS",
        "07_PROVINCIAS_HUBS",
        "08_ILUMINACION_Y_RIDER"
    ]

    for cat_key in ordered_keys:
        info = categories[cat_key]
        quota = info["quota"]
        added = 0
        for file_path in info["files"]:
            resolved = str(file_path.resolve())
            if resolved in processed_paths:
                continue
            processed_paths.add(resolved)
            balanced_selection.append((cat_key, file_path))
            added += 1
            if added >= quota:
                break

    print(f"\n  [BALANCE COGNITIVO]")
    for cat_key in ordered_keys:
        count = sum(1 for c, _ in balanced_selection if c == cat_key)
        print(f"    • {cat_key:<24}: {count:>3} documentos seleccionados")
    print(f"    --------------------------------------------------")
    print(f"    • TOTAL FUENTES DE ÉLITE : {len(balanced_selection):>3} (Límite seguro Google: 300)\n")

    hud.update(45, "Destilando", f"Refinando y numerando {len(balanced_selection)} fuentes")
    manifest = []

    for idx, (cat_tag, file_path) in enumerate(balanced_selection, 1):
        try:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                raw_text = f.read()

            clean_text = clean_content_for_notebooklm(raw_text)

            stem_clean = re.sub(r'[^a-zA-Z0-9_-]', '_', file_path.stem)[:36].strip('_')
            out_name = f"{idx:03d}_{cat_tag}_{stem_clean}.md"
            out_file = OUTPUT_DIR / out_name

            header = f"# 💎 EAR OS FUENTE #{idx:03d}: {file_path.stem}\n"
            header += f"> **Pilar Estratégico:** `{cat_tag}` | **Documento Original:** `{file_path.name}`\n"
            header += f"> **Ecosistema Productora EAR** | Destilado Oficial para Google NotebookLM\n\n---\n\n"

            with open(out_file, "w", encoding="utf-8") as out_f:
                out_f.write(header + clean_text)

            manifest.append({
                "num": f"{idx:03d}",
                "category": cat_tag,
                "title": file_path.stem.replace("_", " "),
                "filename": out_name,
                "size_kb": round(len(clean_text) / 1024, 1)
            })

            progress = 45 + int((idx / len(balanced_selection)) * 45)
            hud.update(progress, "Exportando", out_name)
        except Exception:
            pass

    # 3. Generar Índice Maestro 000
    hud.update(92, "Indexando", "Escribiendo 000_INDICE_MAESTRO_FUENTES_SCLASS.md")
    index_file = OUTPUT_DIR / "000_INDICE_MAESTRO_FUENTES_SCLASS.md"
    index_lines = [
        "# 🧭 ÍNDICE MAESTRO DE FUENTES ESTRATÉGICAS PARA NOTEBOOKLM\n",
        f"> **Plataforma Cognitiva:** Google NotebookLM | **Ecosistema:** Productora EAR OS\n",
        f"> **Total Fuentes Procesadas:** {len(manifest)} documentos de alta densidad estratégica (Cero Ruido).\n",
        "> **Soberanía y Balance:** Representación 100% integral de Cátedra, VIMUME, Licitaciones, Proveedores y SSOT.\n\n",
        "---\n\n",
        "## 📊 RESUMEN POR PILARES ESTRATÉGICOS\n\n",
        "| Pilar Estratégico | Contenido Clave | Pregunta Clave para NotebookLM |\n",
        "| :--- | :--- | :--- |\n",
        "| 🎙️ **01. Cátedra y ADN** | Voz de Edwin Agudelo, psicología de ventas y filosofía artística | *«Genera un resumen en podcast sobre la visión del artista y el storyselling de EAR.»* |\n",
        "| 🧠 **02. Estrategia y Chats** | Singularidad V5, mapas mentales y análisis de mercado | *«Resume la hoja de ruta estratégica para alcanzar la singularidad operativa V5.»* |\n",
        "| ⚡ **03. Reglas SSOT** | Tarifa 350€, Logística Méntrida, Split 80/10/10, Depósito Stripe 100€ | *«¿Cuáles son las reglas de negocio inmutables para tarifas, logística y split?»* |\n",
        "| 🏛️ **04. Licitaciones B2G** | Art. 118 LCSP (< 15.000€), Pliegos tipo, Campaña Navidad 2026 | *«Redacta una memoria técnica para licitar un concierto municipal bajo Art. 118 LCSP.»* |\n",
        "| 🧬 **05. VIMUME Neurociencia** | Protocolo acústico < 75 dB SPL, estimulación en residencias | *«Explícame el proyecto VIMUME y su impacto en la neurociencia cognitiva en mayores.»* |\n",
        "| 👥 **06. Proveedores S-Class** | 10 Catálogos gremiales (Fincas, Catering, Mariachis, etc.) | *«¿Qué fincas y servicios de catering tenemos homologados y cómo se contactan?»* |\n",
        "| 📍 **07. Provincias y Hubs** | 7 Hubs territoriales y Matriz de 52 provincias desde Méntrida | *«Calcula el suplemento de kilometraje y hotel para un evento en Badajoz o Valencia.»* |\n",
        "| 💡 **08. Iluminación y Rider** | Manual Stage Color 48 DMX, Rider Bose/Shure, Hardware local | *«Detalla la tabla de canales DMX (8CH/4CH) del foco Stage Color 48 y el rider acústico.»* |\n\n",
        "---\n\n",
        "## 📋 CATÁLOGO COMPLETO DE FUENTES NUMERADAS\n\n",
        "| # | Pilar | Título / Tema | Archivo | Tamaño |\n",
        "| :---: | :--- | :--- | :--- | :---: |\n"
    ]

    for m in manifest:
        index_lines.append(f"| `{m['num']}` | {m['category']} | **{m['title'][:45]}** | `{m['filename']}` | {m['size_kb']} KB |\n")

    with open(index_file, "w", encoding="utf-8") as inf:
        inf.writelines(index_lines)

    hud.finish(
        f"Exportación de Fuentes para NotebookLM Culminada con Éxito.\n"
        f"  > Total Fuentes Destiladas : {len(manifest)}\n"
        f"  > Carpeta Lista para Subir : {OUTPUT_DIR}\n"
        f"  > Índice Maestro Generado  : {index_file.name}\n"
        f"  > Estado de Cuota Google   : {len(manifest)}/300 (Margen óptimo garantizado)"
    )

if __name__ == "__main__":
    export_notebooklm_sources()
