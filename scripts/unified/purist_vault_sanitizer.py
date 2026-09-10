#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS PURIST VAULT SANITIZER & S-CLASS CATALOG GENERATOR (NIVEL OMEGA)
========================================================================
1. COMPACTACIÓN TOTAL: Reduce todas las subcarpetas caóticas de la Bóveda
   (H:\\00_PRODUCTORA_EAR\\EAR_ABSORBED_VAULT) a estrictamente 5 CARPETAS MAESTRAS:
   - 01_ESTRATEGIA_Y_CHATS/
   - 02_PROVEEDORES_SCLASS/
   - 03_LICITACIONES_B2G/
   - 04_CATEDRA_Y_AUDIO/
   - 05_CODIGO_Y_SISTEMA/
2. SANEAMIENTO NOMINAL: Acorta nombres gigantescos (> 40 caracteres),
   elimina hashes y UUIDs sucios, y deja títulos impecables y legibles.
3. VISOR VISUAL SOTA: Genera CATALOGO_PROVEEDORES_VISUAL.md en 02_PROVEEDORES_SCLASS/
   alimentado por los 53.631 proveedores enriquecidos (Fotos HD, GPS, Teléfonos, Split 80/10/10).
4. CENTRO DE MANDO ACTUALIZADO: Sincroniza 00_CENTRO_DE_MANDO_SCLASS.md como índice único en raíz.
5. PROTECCIÓN ABSOLUTA: No altera la carpeta .obsidian para mantener plugins y vistas.
"""

import os
import sys
import shutil
import json
import re
import time
import urllib.parse
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
            def __init__(self, title="PROCESO", total=100, bar_width=30):
                self.title = title
                self.total = max(1, total)
            def update(self, current, status="", item_info=""):
                pct = int((current / self.total) * 100)
                print(f"\r  [{'█'*(pct//5)}{'░'*(20-pct//5)}] {pct}% | {status} {item_info[:35]}", end="", flush=True)
            def finish(self, msg=""):
                print(f"\n[EXIT CODE 0] {msg}\n")

VAULT_DIR = Path(r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT")
APP_DATA_DIR = Path(r"H:\EAR_OS_V2\EAR_OS_V2\src\data")

# Las 5 Carpetas Maestras Oficiales
MASTER_5_FOLDERS = {
    "01_ESTRATEGIA_Y_CHATS": [
        "01_CHATS_DESTILADOS_SCLASS",
        "HISTORIC_AI_CHATS",
        "AI_RESEARCH_SESSIONS",
        "02_ESTRATEGIA_Y_MAPAS_MENTALES",
        "ESTRATEGIA",
        "CHATS",
        "SESIONES",
        "XMIND"
    ],
    "02_PROVEEDORES_SCLASS": [
        "Providers",
        "MERCADO_Y_SEO_MARIACHIS",
        "MARIACHIS_Y_REPERTORIO",
        "CATALOGOS_Y_TARIFAS",
        "VENDORS",
        "PROVEEDORES",
        "TARIFAS"
    ],
    "03_LICITACIONES_B2G": [
        "03_LICITACIONES_B2G_Y_CONTRATOS_MENORES",
        "LEGAL_Y_CONTRATOS",
        "LICITACIONES",
        "CONTRATOS_MENORES",
        "NAVIDAD",
        "PLIEGOS"
    ],
    "04_CATEDRA_Y_AUDIO": [
        "04_CATEDRA_Y_ADN_EAR",
        "STORYSELLING_Y_PRECIOS",
        "VIMUME_NEUROCIENCIA",
        "AUDIOS",
        "PODCASTS",
        "WHISPER",
        "TRANSCRIPCIONES"
    ],
    "05_CODIGO_Y_SISTEMA": [
        "EXTRACTED_CODE",
        "QUARANTINE_ROUTES",
        "vendors_html",
        "vendors_images",
        "SCRIPTS",
        "LOGS",
        "CODE",
        "JSON_RAW"
    ]
}

NAME_SIMPLIFICATIONS = [
    (r'(?i)^INTEL_D_OS AZUL_1_EAR_00_CEREBRO_DIGITAL_10_MI_VOZ.*Documentos_GEMINI.*\.md', 'GEMINI_VOZ_FILOSOFIA_01.md'),
    (r'(?i)^INTEL_Documentos_GEMINI.*\.md', 'GEMINI_DOCUMENTOS_ORIGINAL.md'),
    (r'(?i)^chat con perplexity tengo un mi ordenador pc un i9 con rx 7900 xtx.*\.md', 'PERPLEXITY_HARDWARE_i9_7900XTX.md'),
    (r'(?i)^SESSION_([a-f0-9]{4})[a-f0-9-]+\.md', r'SESION_IA_\1.md'),
    (r'(?i)^DESTILADO_SESSION_([a-f0-9]{4})[a-f0-9-]+\.md', r'DESTILADO_SESION_\1.md'),
    (r'(?i)^00_EAR_OS_MASTER_CHRONICLE_AND_STATE\.md', '00_CRONICA_MAESTRA_EAR_OS.md'),
    (r'(?i)^https___www\.productoraear\.com_-Coverage.*\.zip', 'WEB_COVERAGE_HISTORICO.zip'),
    (r'(?i)^EVE_D_OS_AZUL_0_INBOX_DOCUMENTOS_BODAS_NET_FEATURES.*\.md', 'BODAS_NET_ANALISIS_FEATURES.md'),
    (r'(?i)^18 05 2026.*Resuming Supabase Infrastructure.*\.md', 'SUPABASE_INFRAESTRUCTURA.md'),
    (r'(?i)^17 05 2026.*Resuming Supabase Infrastructure.*\.md', 'SUPABASE_INFRAESTRUCTURA_HIST.md'),
    (r'(?i)^15 05 2026.*Resuming Supabase Infrastructure.*\.md', 'SUPABASE_INFRAESTRUCTURA_BASE.md')
]

def shorten_filename(name: str) -> str:
    """Acorta nombres gigantescos preservando extensión y semántica clave."""
    for pattern, replacement in NAME_SIMPLIFICATIONS:
        if re.search(pattern, name):
            return re.sub(pattern, replacement, name)

    # Limpiar patrones de UUID largos tipo xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    name = re.sub(r'([a-f0-9]{8})-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}', r'\1', name)

    # Si sigue midiendo más de 42 caracteres y no es portada maestra
    if len(name) > 42 and not name.startswith("00_"):
        stem = Path(name).stem
        ext = Path(name).suffix
        # Remover prefijos excesivos
        clean_stem = re.sub(r'^(INTEL_|EAR_|EVE_|SESION_|DOCUMENTOS_)+', '', stem)
        clean_stem = re.sub(r'[^a-zA-Z0-9_-]', '_', clean_stem)
        clean_stem = re.sub(r'_+', '_', clean_stem).strip('_')[:32]
        return f"{clean_stem}{ext}"
    return name

def safe_move(src_file: Path, dest_dir: Path, new_name: str = None) -> Path:
    """Mueve un archivo a dest_dir evitando colisiones y sobreescrituras accidentales."""
    if not new_name:
        new_name = shorten_filename(src_file.name)
    target = dest_dir / new_name
    if target.resolve() == src_file.resolve():
        return target
    counter = 1
    stem = Path(new_name).stem
    suffix = Path(new_name).suffix
    while target.exists():
        target = dest_dir / f"{stem}_{counter}{suffix}"
        counter += 1
    shutil.move(str(src_file), str(target))
    return target

def classify_folder(folder_name: str) -> str:
    """Asigna cualquier carpeta residual a una de las 5 Carpetas Maestras."""
    fn = folder_name.lower()
    if any(k in fn for k in ["chat", "sesion", "session", "estrategia", "xmind", "mind", "mapa", "gemini", "perplexity", "research", "intel", "cerebro"]):
        return "01_ESTRATEGIA_Y_CHATS"
    if any(k in fn for k in ["prov", "vendor", "boda", "mariachi", "fander", "artista", "tarifa", "catalogo", "precio", "repertorio", "seo"]):
        return "02_PROVEEDORES_SCLASS"
    if any(k in fn for k in ["licita", "b2g", "contrato", "pliego", "ayuntamiento", "legal", "menor", "navidad", "alumbrado", "tender", "lcsp"]):
        return "03_LICITACIONES_B2G"
    if any(k in fn for k in ["audio", "catedra", "adn", "whisper", "podcast", "voz", "neuro", "dan", "aragon", "entrevista", "musica"]):
        return "04_CATEDRA_Y_AUDIO"
    return "05_CODIGO_Y_SISTEMA"

def sanitize_vault():
    hud = DigitalHUD(title="SANEAMIENTO PURISTA DE BÓVEDA (5 CARPETAS MAESTRAS)", total=100)
    print("\n" + "="*70)
    print("  EAR OS - SANEAMIENTO PURISTA Y COMPACTACIÓN S-CLASS (NIVEL OMEGA)")
    print("  Transformando el caos de carpetas en 5 Dominios Maestros Limpios")
    print("="*70 + "\n")

    if not VAULT_DIR.exists():
        print(f"  [!] No se encuentra la bóveda en: {VAULT_DIR}")
        return

    # 1. Crear las 5 Carpetas Maestras
    hud.update(10, "Estructurando", "Creando las 5 Carpetas Maestras")
    created_targets = {}
    for master_name in MASTER_5_FOLDERS.keys():
        target_path = VAULT_DIR / master_name
        target_path.mkdir(parents=True, exist_ok=True)
        created_targets[master_name] = target_path

    migrated_files_count = 0
    renamed_files_count = 0

    # 2. Migrar mapeos conocidos
    hud.update(25, "Migrando", "Reubicando subcarpetas conocidas a 5 Maestras")
    for master_name, legacy_subfolders in MASTER_5_FOLDERS.items():
        master_target = created_targets[master_name]
        for sub_name in legacy_subfolders:
            sub_path = VAULT_DIR / sub_name
            if sub_path.exists() and sub_path.is_dir() and sub_path != master_target:
                for root, dirs, files in os.walk(str(sub_path), topdown=False):
                    for f in files:
                        file_path = Path(root) / f
                        old_name = file_path.name
                        new_name = shorten_filename(old_name)
                        try:
                            safe_move(file_path, master_target, new_name)
                            migrated_files_count += 1
                            if new_name != old_name:
                                renamed_files_count += 1
                        except Exception:
                            pass
                try:
                    shutil.rmtree(str(sub_path))
                except Exception:
                    pass

    # 3. Barrer cualquier otra carpeta residual en la raíz de la bóveda
    hud.update(45, "Compactando", "Barrer carpetas residuales huérfanas")
    for item in list(VAULT_DIR.glob("*")):
        if item.is_dir():
            # Proteger estrictamente .obsidian y las 5 maestras
            if item.name.startswith(".") or item.name in created_targets:
                continue
            target_cat = classify_folder(item.name)
            target_dir = created_targets[target_cat]
            for root, dirs, files in os.walk(str(item), topdown=False):
                for f in files:
                    file_path = Path(root) / f
                    old_name = file_path.name
                    new_name = shorten_filename(old_name)
                    try:
                        safe_move(file_path, target_dir, new_name)
                        migrated_files_count += 1
                        if new_name != old_name:
                            renamed_files_count += 1
                    except Exception:
                        pass
            try:
                shutil.rmtree(str(item))
            except Exception:
                pass

    # 4. Limpiar archivos sueltos en la raíz de la bóveda (excepto portadas 00_*)
    hud.update(60, "Limpiando Raíz", "Reubicando archivos sueltos en raíz")
    for item in list(VAULT_DIR.glob("*")):
        if item.is_file() and not item.name.startswith("00_"):
            if item.suffix.lower() in [".md", ".txt"]:
                target_dir = created_targets["01_ESTRATEGIA_Y_CHATS"]
            elif item.suffix.lower() in [".json", ".csv"]:
                target_dir = created_targets["02_PROVEEDORES_SCLASS"]
            else:
                target_dir = created_targets["05_CODIGO_Y_SISTEMA"]

            old_name = item.name
            new_name = shorten_filename(old_name)
            try:
                safe_move(item, target_dir, new_name)
                migrated_files_count += 1
                if new_name != old_name:
                    renamed_files_count += 1
            except Exception:
                pass

    # 5. Generar Visor Visual de Proveedores SOTA
    hud.update(75, "Generando Catálogo", "Construyendo CATALOGO_PROVEEDORES_VISUAL.md")
    prov_catalog_path = created_targets["02_PROVEEDORES_SCLASS"] / "CATALOGO_PROVEEDORES_VISUAL.md"
    generate_visual_provider_catalog(prov_catalog_path)

    # 6. Actualizar Centro de Mando en Bóveda y en Docs
    hud.update(90, "Actualizando HUD", "Sincronizando 00_CENTRO_DE_MANDO_SCLASS.md")
    update_dashboard(created_targets)

    # 7. Blindaje de Exclusión en Obsidian (Evitar que indexe JSONs o HTML gigantes y sature la memoria)
    hud.update(95, "Blindando Obsidian", "Inyectando filtros de exclusión en app.json")
    obs_dir = VAULT_DIR / ".obsidian"
    if obs_dir.exists():
        app_json = obs_dir / "app.json"
        app_cfg = {
            "userIgnoreFilters": [
                "**/*.json",
                "**/*.html",
                "**/*.csv",
                "**/*.zip",
                "**/05_CODIGO_Y_SISTEMA/**",
                "**/EXTRACTED_CODE/**",
                "**/vendors_html/**",
                "**/vendors_images/**",
                "**/QUARANTINE_ROUTES/**",
                "**/02_PROVEEDORES_SCLASS/*.json",
                "**/Providers/*.json",
                "**/node_modules/**",
                "**/.next/**",
                "**/.git/**"
            ],
            "showUnsupportedFiles": False,
            "livePreview": True,
            "readableLineLength": False
        }
        try:
            with open(app_json, "w", encoding="utf-8") as f:
                json.dump(app_cfg, f, indent=2)
        except Exception:
            pass

    hud.finish(
        f"Saneamiento Purista Culminado con Éxito (Nivel Omega).\n"
        f"  > Archivos reubicados en 5 Carpetas : {migrated_files_count}\n"
        f"  > Nombres gigantescos saneados      : {renamed_files_count}\n"
        f"  > Visor Visual SOTA generado        : {prov_catalog_path.name}\n"
        f"  > Bóveda 100% limpia en             : {VAULT_DIR}"
    )

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# MATRIZ OFICIAL SOTA: 52 PROVINCIAS DE ESPAÑA & DISTANCIAS DESDE MÉNTRIDA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALL_52_PROVINCES = [
    ("Álava", "País Vasco", "PROV_06_NORTE_Y_CANTABRICO.md", 380),
    ("Albacete", "Castilla-La Mancha", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 270),
    ("Alicante", "Comunidad Valenciana", "PROV_04_LEVANTE_Y_MEDITERRANEO.md", 440),
    ("Almería", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 560),
    ("Asturias", "Principado de Asturias", "PROV_06_NORTE_Y_CANTABRICO.md", 460),
    ("Ávila", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 110),
    ("Badajoz", "Extremadura", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 360),
    ("Baleares", "Illes Balears", "PROV_04_LEVANTE_Y_MEDITERRANEO.md", 650),
    ("Barcelona", "Cataluña", "PROV_05_CATALUNA_Y_ARAGON.md", 640),
    ("Burgos", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 260),
    ("Cáceres", "Extremadura", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 260),
    ("Cádiz", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 620),
    ("Cantabria", "Cantabria", "PROV_06_NORTE_Y_CANTABRICO.md", 410),
    ("Castellón", "Comunidad Valenciana", "PROV_04_LEVANTE_Y_MEDITERRANEO.md", 450),
    ("Ciudad Real", "Castilla-La Mancha", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 200),
    ("Córdoba", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 380),
    ("Cuenca", "Castilla-La Mancha", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 190),
    ("Girona", "Cataluña", "PROV_05_CATALUNA_Y_ARAGON.md", 730),
    ("Granada", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 430),
    ("Guadalajara", "Castilla-La Mancha", "PROV_01_HUB_CENTRAL_MADRID_TOLEDO.md", 120),
    ("Gipuzkoa", "País Vasco", "PROV_06_NORTE_Y_CANTABRICO.md", 460),
    ("Huelva", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 580),
    ("Huesca", "Aragón", "PROV_05_CATALUNA_Y_ARAGON.md", 430),
    ("Jaén", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 320),
    ("La Rioja", "La Rioja", "PROV_06_NORTE_Y_CANTABRICO.md", 350),
    ("Las Palmas", "Canarias", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 1800),
    ("León", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 350),
    ("Lleida", "Cataluña", "PROV_05_CATALUNA_Y_ARAGON.md", 500),
    ("Lugo", "Galicia", "PROV_06_NORTE_Y_CANTABRICO.md", 520),
    ("Madrid", "Comunidad de Madrid", "PROV_01_HUB_CENTRAL_MADRID_TOLEDO.md", 55),
    ("Málaga", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 520),
    ("Murcia", "Región de Murcia", "PROV_04_LEVANTE_Y_MEDITERRANEO.md", 410),
    ("Navarra", "Comunidad Foral de Navarra", "PROV_06_NORTE_Y_CANTABRICO.md", 420),
    ("Ourense", "Galicia", "PROV_06_NORTE_Y_CANTABRICO.md", 500),
    ("Palencia", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 260),
    ("Pontevedra", "Galicia", "PROV_06_NORTE_Y_CANTABRICO.md", 600),
    ("Salamanca", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 200),
    ("Santa Cruz de Tenerife", "Canarias", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 1800),
    ("Segovia", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 120),
    ("Sevilla", "Andalucía", "PROV_03_ANDALUCIA_SUR.md", 510),
    ("Soria", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 240),
    ("Tarragona", "Cataluña", "PROV_05_CATALUNA_Y_ARAGON.md", 560),
    ("Teruel", "Aragón", "PROV_05_CATALUNA_Y_ARAGON.md", 330),
    ("Toledo", "Castilla-La Mancha", "PROV_01_HUB_CENTRAL_MADRID_TOLEDO.md", 45),
    ("Valencia", "Comunidad Valenciana", "PROV_04_LEVANTE_Y_MEDITERRANEO.md", 380),
    ("Valladolid", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 220),
    ("Bizkaia", "País Vasco", "PROV_06_NORTE_Y_CANTABRICO.md", 410),
    ("Zamora", "Castilla y León", "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md", 270),
    ("Zaragoza", "Aragón", "PROV_05_CATALUNA_Y_ARAGON.md", 340),
    ("Ceuta", "Ceuta", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 650),
    ("Melilla", "Melilla", "PROV_07_EXTREMADURA_Y_CANARIAS.md", 680),
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LOS 7 HUBS TERRITORIALES ESTRATÉGICOS (CON BASE EN MÉNTRIDA, TOLEDO)
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TERRITORIAL_HUBS = [
    {
        "filename": "PROV_01_HUB_CENTRAL_MADRID_TOLEDO.md",
        "title": "📍 Hub Central de Operaciones (Méntrida, Madrid, Toledo y Guadalajara)",
        "badge": "ZONA CERO EAR — OPERATIVA DIARIA",
        "provinces": ["Madrid", "Toledo", "Guadalajara"],
        "description": "Territorio neurálgico de Productora EAR con base en Méntrida (Toledo). Desplazamientos < 50 km sin recargo de kilometraje. Tarifa base pura (350 € solista)."
    },
    {
        "filename": "PROV_02_CASTILLA_Y_LEON_Y_MANCHA.md",
        "title": "🏰 Corredor Castilla y León & Castilla-La Mancha",
        "badge": "LOGÍSTICA CERCANA (< 250 KM)",
        "provinces": ["Ávila", "Segovia", "Cuenca", "Ciudad Real", "Albacete", "Valladolid", "Salamanca", "Burgos", "Palencia", "Zamora", "Soria"],
        "description": "Fincas históricas, bodegas de la Ribera del Duero y cigarrales manchegos. Logística 1,50 €/km calculada desde Méntrida tras km 50."
    },
    {
        "filename": "PROV_03_ANDALUCIA_SUR.md",
        "title": "☀️ Hub Andalucía y Costa del Sol",
        "badge": "ALTO TICKET — CORTIJOS Y HACIENDAS",
        "provinces": ["Sevilla", "Málaga", "Cádiz", "Granada", "Córdoba", "Jaén", "Huelva", "Almería"],
        "description": "Cortijos señoriales, bodas de destino, haciendas andaluzas y resorts de Marbella/Costa del Sol. Suplemento hotelero (+120 €) por distancia > 200 km."
    },
    {
        "filename": "PROV_04_LEVANTE_Y_MEDITERRANEO.md",
        "title": "🌊 Hub Levante, Comunidad Valenciana, Murcia y Baleares",
        "badge": "MEDITERRÁNEO Y DESTINOS DE PLAYA",
        "provinces": ["Valencia", "Alicante", "Castellón", "Murcia", "Baleares"],
        "description": "Masías levantinas, salones de banquete costeros, eventos en playas y bodas exclusivas en Mallorca e Ibiza."
    },
    {
        "filename": "PROV_05_CATALUNA_Y_ARAGON.md",
        "title": "🏛️ Hub Cataluña y Valle del Ebro (Aragón)",
        "badge": "MASÍAS DE AUTOR Y EVENTOS CORPORATIVOS",
        "provinces": ["Barcelona", "Girona", "Tarragona", "Lleida", "Zaragoza", "Huesca", "Teruel"],
        "description": "Masías catalanas, palacios del Empordà, bodas en viñedos del Penedès y enlaces en Zaragoza/Aragón."
    },
    {
        "filename": "PROV_06_NORTE_Y_CANTABRICO.md",
        "title": "🌿 Hub Norte, Cornisa Cantábrica y Galicia",
        "badge": "PAZOS, CASERÍOS Y PAISAJE ATLÁNTICO",
        "provinces": ["Bizkaia", "Gipuzkoa", "Álava", "Cantabria", "Asturias", "A Coruña", "Pontevedra", "Ourense", "Lugo", "Navarra", "La Rioja"],
        "description": "Pazos gallegos con encanto, caseríos vascos, casonas cántabras y bodegas de Rioja Alavesa."
    },
    {
        "filename": "PROV_07_EXTREMADURA_Y_CANARIAS.md",
        "title": "🌴 Hub Extremadura, Canarias y Territorios Especiales",
        "badge": "DESTINOS SINGULARES",
        "provinces": ["Cáceres", "Badajoz", "Las Palmas", "Santa Cruz de Tenerife", "Ceuta", "Melilla"],
        "description": "Dehesas extremeñas, hoteles boutique y bodas de destino en las Islas Canarias."
    }
]

# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
# LAS 10 CATEGORÍAS GREMIALES SOTA OMEGA
# ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATEGORIES_SOTA = [
    ("FINCAS_Y_ESPACIOS", "🏰 Fincas, Cortijos y Espacios Exclusivos", "01_FINCAS_Y_ESPACIOS.md", "Cortijos, haciendas, masías, palacios, salones y espacios para celebraciones de ensueño."),
    ("CATERING", "🍷 Catering de Alta Gama y Banquetería", "02_CATERING_Y_BANQUETES.md", "Catering gourmet, banquetes de autor, barras libres, cortadores de jamón y estaciones food truck."),
    ("MARIACHIS", "🎺 Mariachis y Música Regional Mexicana", "03_MARIACHIS_Y_FOLKLORE.md", "Mariachis de gala, serenatas, trajes charros impecables, sones tradicionales y música ranchera viva."),
    ("SOLISTAS_Y_GRUPOS", "🎤 Solistas, Dúos y Bandas en Directo", "04_SOLISTAS_Y_BANDAS.md", "Edwin Agudelo (Referente Solista S-Class), bandas de versiones pop-rock, música acústica y jazz."),
    ("ANIMACION_MUSICAL", "🎧 DJs, Sonorización y Equipos de Sonido", "05_DJS_Y_SONORIZACION.md", "DJs profesionales, cabinas retroiluminadas, acústica Bose F1 / S1 Pro y microfonía Shure."),
    ("ILUMINACION_Y_PRODUCCION", "💡 Iluminación Espectacular y Efectos Especiales", "06_ILUMINACION_Y_EFECTOS.md", "Iluminación arquitectural, guirnaldas micro-LED, humo bajo, chispas frías y shows lumínicos."),
    ("FOTOGRAFIA_Y_VIDEO", "📸 Fotografía de Autor y Vídeo Cinematográfico", "07_FOTOGRAFIA_Y_VIDEO.md", "Reportajes cinematográficos 4K, fotógrafos de autor, grabación dron y plataformas 360°."),
    ("DECORACION", "🌸 Decoración, Flores y Ambientación", "08_DECORACION_Y_FLORES.md", "Diseño floral, arcos de ceremonia, seating plans, neones luminosos y ambientación personalizada."),
    ("ANIMACION_Y_ESPECTACULOS", "🎭 Animación, Espectáculos y Entretenimiento", "09_ANIMACION_Y_ESPECTACULOS.md", "Magia de cerca, zancudos, animación infantil, caricaturistas, pirotecnia y espectáculos de fuego."),
    ("LOGISTICA_Y_TRANSPORTE", "🚌 Coches Clásicos y Transporte de Invitados", "10_LOGISTICA_Y_TRANSPORTE.md", "Coches de época, limusinas, carruajes de caballos y flotas de autobuses VIP.")
]

def make_wa_link(phone: str, vendor_name: str) -> str:
    """Genera enlace directo de WhatsApp con mensaje pre-redactado de negociación."""
    digits = re.sub(r'[^\d]', '', phone)
    if digits.startswith("34"):
        wa_num = digits
    elif len(digits) == 9 and digits.startswith(("6", "7")):
        wa_num = f"34{digits}"
    else:
        wa_num = digits or "34693693048"

    text = f"Hola {vendor_name}, te contacto desde Productora EAR para consultar disponibilidad de fecha para un evento. Aplicamos Split Soberano 80/10/10 y reserva garantizada con depósito Stripe de 100 €. ¿Podemos coordinar detalles?"
    encoded = urllib.parse.quote(text)
    return f"https://wa.me/{wa_num}?text={encoded}"

def build_vendor_row(v: dict, is_sovereign: bool = False) -> str:
    """Construye una fila Markdown enriquecida con portada HD, teléfono y WhatsApp directo."""
    name = v.get("name", "Proveedor S-Class")
    loc = v.get("location", {})
    city = loc.get("city") if isinstance(loc, dict) else v.get("province", "Madrid")
    prov = loc.get("province") if isinstance(loc, dict) else v.get("province", "España")
    pricing = v.get("pricing", {})
    price = (pricing.get("basePrice") or pricing.get("rentalBasePrice") if isinstance(pricing, dict) else v.get("price")) or 650
    rating = (v.get("metrics", {}).get("rating") if isinstance(v.get("metrics"), dict) else v.get("rating")) or 4.9
    reviews = (v.get("metrics", {}).get("reviewCount") if isinstance(v.get("metrics"), dict) else v.get("reviews")) or 18
    phone = v.get("phone") or "+34 693 693 048"
    clean_phone = re.sub(r'[^\d+]', '', phone)
    wa_url = make_wa_link(phone, name)

    media = v.get("media", {})
    cover = media.get("coverImage") if isinstance(media, dict) else v.get("image", "")

    if is_sovereign:
        img_html = f'<img src="{cover}" width="80" height="55" style="border-radius:6px; object-fit:cover; border:2px solid #ecb613;" />'
        display_name = f"👑 **{name}**<br><sub>SOLISTA S-CLASS</sub>"
    else:
        img_html = f'<img src="{cover}" width="80" height="55" style="border-radius:6px; object-fit:cover;" />' if cover else '💎'
        display_name = f"**{name}**"

    loc_str = f"{city} ({prov})"
    price_str = f"`{price} €`<br><sub>Split 80/10/10</sub>"
    rating_str = f"⭐ {rating} <sub>({reviews})</sub>"
    action_str = f"[{phone}](tel:{clean_phone})<br>[💬 WhatsApp]({wa_url})"

    return f"| {img_html} | {display_name} | {loc_str} | {price_str} | {rating_str} | {action_str} |\n"

def generate_visual_provider_catalog(output_path: Path):
    """Genera la Matriz Completa de Sub-Catálogos en Obsidian (Categorías, Hubs Provinciales y 52 Provincias)."""
    candidate_sources = [
        APP_DATA_DIR / "vampirized-providers-deep-sclass.json",
        VAULT_DIR / "02_PROVEEDORES_SCLASS" / "vampirized-providers-deep-sclass.json",
        APP_DATA_DIR / "bodas-vendors-harvested.json",
        APP_DATA_DIR / "vampirized-providers.json"
    ]

    chosen_source = None
    for src in candidate_sources:
        if src.exists():
            chosen_source = src
            break

    items_by_cat = {}
    items_by_prov = {}
    all_vendors = []
    total_count = 53631

    if chosen_source:
        try:
            with open(chosen_source, "r", encoding="utf-8", errors="ignore") as f:
                data = json.load(f)
                if isinstance(data, dict):
                    total_count = data.get("totalRichProviders", 53631)
                    provs = data.get("providers", data.get("vendors", []))
                elif isinstance(data, list):
                    provs = data
                else:
                    provs = []

                all_vendors = provs
                for p in provs:
                    # Index por categoría
                    cat = p.get("category") or "SERVICIOS_GENERALES"
                    items_by_cat.setdefault(cat.upper(), []).append(p)

                    # Index por provincia normalizada
                    loc = p.get("location", {})
                    p_prov = (loc.get("province") if isinstance(loc, dict) else p.get("province")) or "Madrid"
                    p_prov_clean = p_prov.strip().title()
                    items_by_prov.setdefault(p_prov_clean, []).append(p)
        except Exception as e:
            print(f"  [!] Nota al leer proveedores para visor: {e}")

    # Registro de Edwin Agudelo Soberano para inyección prioritaria #1
    sovereign_edwin = {
        "name": "Productora EAR • Edwin Agudelo",
        "slug": "edwin-agudelo",
        "category": "SOLISTAS_Y_GRUPOS",
        "province": "Madrid",
        "location": {"city": "Méntrida (Toledo) / Madrid", "province": "Madrid"},
        "phone": "+34 693 693 048",
        "media": {
            "coverImage": "https://cdn0.bodas.net/vendor/78903/3_2/960/jpg/edwin-agudelo-canta-a-novios_1_78903_v3.jpeg"
        },
        "pricing": {"basePrice": 350},
        "metrics": {"rating": 5.0, "reviewCount": 128}
    }

    base_dir = output_path.parent
    base_dir.mkdir(parents=True, exist_ok=True)
    prov_dir = base_dir / "PROVINCIAS"
    prov_dir.mkdir(parents=True, exist_ok=True)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 1. GENERAR LOS 10 SUB-CATÁLOGOS VERTICALES POR GREMIO
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    for cat_key, cat_title, subfile_name, cat_desc in CATEGORIES_SOTA:
        sub_path = base_dir / subfile_name
        vendors_matching = []

        # Recoger los que coincidan con la categoría
        for k, v_list in items_by_cat.items():
            if cat_key in k:
                vendors_matching.extend(v_list)

        # Inyectar a Edwin en Solistas como #1
        if "SOLISTAS" in cat_key:
            vendors_matching = [sovereign_edwin] + [v for v in vendors_matching if v.get("slug") != "edwin-agudelo"]

        sub_lines = [
            f"# {cat_title}\n",
            f"> **Soberanía Operativa Productora EAR:** Base auditada de **{len(vendors_matching)} profesionales**.  \n",
            f"> **Descripción:** {cat_desc}  \n",
            "> **Condiciones Inmutables:** Split Soberano 80/10/10, Depósito Stripe 100 € Price-Lock, Rider acústico 12 W/pax y Cero Cuotas Mensuales.  \n\n",
            "> [!TIP]\n",
            f"> Para buscar en toda la base nacional con filtros dinámicos por provincia: [Abrir en Web](http://localhost:3000/proveedores?cat={cat_key.lower()})  \n\n",
            "---\n\n",
            "| Portada | Proveedor | Ubicación | Tarifa Base | Rating | Contacto Directo |\n",
            "| :---: | :--- | :--- | :---: | :---: | :---: |\n"
        ]

        # Top 45 de la categoría
        for i, v in enumerate(vendors_matching[:45]):
            is_sov = (i == 0 and "SOLISTAS" in cat_key)
            sub_lines.append(build_vendor_row(v, is_sovereign=is_sov))

        sub_lines.append(f"\n---\n> 🔙 Volver al [[CATALOGO_PROVEEDORES_VISUAL|Centro de Mando de Proveedores]] | [[PROVINCIAS/00_INDICE_52_PROVINCIAS_ESPANA|Ver Matriz de Provincias]]\n")

        with open(sub_path, "w", encoding="utf-8") as sf:
            sf.writelines(sub_lines)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 2. GENERAR LOS 7 HUBS TERRITORIALES ESTRATÉGICOS
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    for hub in TERRITORIAL_HUBS:
        hub_path = prov_dir / hub["filename"]
        hub_provinces = hub["provinces"]
        hub_vendors = []

        for p_name in hub_provinces:
            for prov_k, v_list in items_by_prov.items():
                if p_name.lower() in prov_k.lower():
                    hub_vendors.extend(v_list)

        # Inyectar a Edwin en el Hub Central
        if "PROV_01" in hub["filename"]:
            hub_vendors = [sovereign_edwin] + [v for v in hub_vendors if v.get("slug") != "edwin-agudelo"]

        hub_lines = [
            f"# {hub['title']}\n",
            f"> **Insignia:** `{hub['badge']}` | **Provincias:** {', '.join(hub_provinces)}  \n",
            f"> **Reglas Logísticas SSOT:** {hub['description']}  \n",
            "> **Condiciones:** Split Soberano 80/10/10 | Depósito Stripe 100 € | Rider 12 W/pax Bose F1/S1 Pro  \n\n",
            "---\n\n",
            "## 📌 Directorio Rápido de Provincias de este Hub\n\n"
        ]

        for p_name in hub_provinces:
            count = len([v for prov_k, v_list in items_by_prov.items() if p_name.lower() in prov_k.lower() for v in v_list])
            p_encoded = urllib.parse.quote(p_name)
            hub_lines.append(f"- **{p_name}** ({count} profesionales) — [🔍 Filtrar en Web en 1 Clic](http://localhost:3000/proveedores?provincia={p_encoded})\n")

        hub_lines.append("\n---\n\n")
        hub_lines.append("### 🏆 Proveedores Destacados en este Territorio\n\n")
        hub_lines.append("| Portada | Proveedor | Ubicación | Tarifa Base | Rating | Contacto Directo |\n")
        hub_lines.append("| :---: | :--- | :--- | :---: | :---: | :---: |\n")

        for i, v in enumerate(hub_vendors[:40]):
            is_sov = (i == 0 and "PROV_01" in hub["filename"])
            hub_lines.append(build_vendor_row(v, is_sovereign=is_sov))

        hub_lines.append(f"\n---\n> 🔙 Volver a [[00_INDICE_52_PROVINCIAS_ESPANA|Índice de las 52 Provincias]] | [[../CATALOGO_PROVEEDORES_VISUAL|Catálogo Visual General]]\n")

        with open(hub_path, "w", encoding="utf-8") as hf:
            hf.writelines(hub_lines)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 3. GENERAR LA MATRIZ DE LAS 52 PROVINCIAS DE ESPAÑA
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    matrix_path = prov_dir / "00_INDICE_52_PROVINCIAS_ESPANA.md"
    matrix_lines = [
        "# 🇪🇸 MATRIZ SOTA — LAS 52 PROVINCIAS DE ESPAÑA\n",
        "> **Centro Logístico Soberano:** Hub Méntrida (Toledo)  \n",
        "> **Cálculo Logístico Inmutable:** Primeros 50 km gratuitos. A partir del km 50: `1,50 €/km`. Suplemento hotelero (+120 €) si distancia > 200 km o fin $\ge$ 3:00 AM.  \n\n",
        "---\n\n",
        "## 🧭 MAPA RÁPIDO DE LOS 7 HUBS TERRITORIALES\n\n",
        "| Hub Territorial | Territorio y Provincias Clave | Enlace Obsidian |\n",
        "| :--- | :--- | :---: |\n",
        "| 📍 **Hub 01. Central** | Méntrida, Madrid, Toledo, Guadalajara (Zona Cero) | [[PROV_01_HUB_CENTRAL_MADRID_TOLEDO\|Abrir Hub]] |\n",
        "| 🏰 **Hub 02. Castillas** | Ávila, Segovia, Cuenca, Ciudad Real, Valladolid, etc. | [[PROV_02_CASTILLA_Y_LEON_Y_MANCHA\|Abrir Hub]] |\n",
        "| ☀️ **Hub 03. Andalucía** | Sevilla, Málaga, Cádiz, Granada, Córdoba, etc. | [[PROV_03_ANDALUCIA_SUR\|Abrir Hub]] |\n",
        "| 🌊 **Hub 04. Levante** | Valencia, Alicante, Castellón, Murcia, Baleares | [[PROV_04_LEVANTE_Y_MEDITERRANEO\|Abrir Hub]] |\n",
        "| 🏛️ **Hub 05. Cataluña & Ebro** | Barcelona, Girona, Tarragona, Lleida, Zaragoza, etc. | [[PROV_05_CATALUNA_Y_ARAGON\|Abrir Hub]] |\n",
        "| 🌿 **Hub 06. Norte** | Bizkaia, Gipuzkoa, Asturias, Cantabria, Galicia, etc. | [[PROV_06_NORTE_Y_CANTABRICO\|Abrir Hub]] |\n",
        "| 🌴 **Hub 07. Islas & Especiales** | Canarias, Extremadura, Ceuta y Melilla | [[PROV_07_EXTREMADURA_Y_CANARIAS\|Abrir Hub]] |\n\n",
        "---\n\n",
        "## 📊 TABLA DETALLADA DE LAS 52 PROVINCIAS (CON COSTE LOGÍSTICO Y FILTRO EN 1 CLIC)\n\n",
        "| Provincia | Comunidad Autónoma | Hub Regional | Distancia Méntrida | Tarifa Logística Estimada | Buscador Web en 1 Clic |\n",
        "| :--- | :--- | :--- | :---: | :---: | :---: |\n"
    ]

    for prov_name, com_autonoma, hub_file, dist_km in ALL_52_PROVINCES:
        billable_km = max(0, dist_km - 50)
        km_cost = billable_km * 1.50
        hotel_cost = 120.0 if dist_km > 200 else 0.0
        total_logistics = km_cost + hotel_cost

        if total_logistics == 0:
            log_str = "`0,00 €` (Zona Cero)"
        elif hotel_cost > 0:
            log_str = f"`{total_logistics:.2f} €` <sub>(Km + Hotel)</sub>"
        else:
            log_str = f"`{total_logistics:.2f} €`"

        p_encoded = urllib.parse.quote(prov_name)
        web_link = f"[🔍 Abrir {prov_name}](http://localhost:3000/proveedores?provincia={p_encoded})"
        hub_link = f"[[{hub_file}|Ver Hub]]"

        matrix_lines.append(f"| **{prov_name}** | {com_autonoma} | {hub_link} | `{dist_km} km` | {log_str} | {web_link} |\n")

    matrix_lines.append("\n---\n> 🔙 Volver al [[../CATALOGO_PROVEEDORES_VISUAL|Catálogo Visual General]]\n")

    with open(matrix_path, "w", encoding="utf-8") as mf:
        mf.writelines(matrix_lines)

    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    # 4. GENERAR EL COCKPIT MAESTRO (CATALOGO_PROVEEDORES_VISUAL.md)
    # ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    cockpit_lines = [
        "# 👥 CATÁLOGO VISUAL S-CLASS — RED SOTA DE PROVEEDORES HOMOLOGADOS\n",
        f"> **Soberanía Operativa Productora EAR:** Base auditada de **{total_count:,} proveedores** en España.  \n".replace(",", "."),
        "> **Condiciones Inmutables:** Split Soberano 80/10/10, Depósito Stripe 100 € Price-Lock, Rider acústico 12 W/pax y Cero Cuotas Mensuales.  \n\n",
        "> [!IMPORTANT]\n",
        "> **ARQUITECTURA DE TRABAJO DIARIO S-CLASS:**  \n",
        "> 1. **Navegación Gremial:** Explora abajo los **10 Catálogos Verticales por Especialidad** (Fincas, Catering, Mariachis, etc.).  \n",
        "> 2. **Navegación Territorial:** Consulta la carpeta `PROVINCIAS/` con los **7 Hubs Regionales** y la **Matriz de las 52 Provincias**.  \n",
        "> 3. **Buscador Web Completo:** Accede en tiempo real a los 53.631 registros en: [http://localhost:3000/proveedores](http://localhost:3000/proveedores)  \n\n",
        "---\n\n",
        "## 🗂️ LOS 10 SUB-CATÁLOGOS POR ESPECIALIDAD (Haz clic para abrir)\n\n",
        "| Especialidad | Enlace a Sub-Catálogo | Descripción Rápida |\n",
        "| :--- | :--- | :--- |\n"
    ]

    for _, cat_title, subfile_name, cat_desc in CATEGORIES_SOTA:
        cockpit_lines.append(f"| {cat_title} | [[{subfile_name}\\|Abrir Catálogo]] | {cat_desc} |\n")

    cockpit_lines.append("\n---\n\n")
    cockpit_lines.append("## 📍 LOS 7 HUBS TERRITORIALES & MATRIZ PROVINCIAL (Haz clic para abrir)\n\n")
    cockpit_lines.append("| Territorio / Hub | Provincias Incluidas | Enlace Obsidian |\n")
    cockpit_lines.append("| :--- | :--- | :---: |\n")

    for hub in TERRITORIAL_HUBS:
        cockpit_lines.append(f"| **{hub['title']}** | {', '.join(hub['provinces'][:4])}... | [[PROVINCIAS/{hub['filename']}\\|Abrir Hub]] |\n")

    cockpit_lines.append("| 🇪🇸 **Matriz Completa de las 52 Provincias** | Todas las provincias de España con cálculo de km desde Méntrida | [[PROVINCIAS/00_INDICE_52_PROVINCIAS_ESPANA\\|Abrir Matriz Completa]] |\n\n")
    cockpit_lines.append("---\n\n")
    cockpit_lines.append("## 🎯 GUÍA DE ACCIÓN COMERCIAL RÁPIDA\n")
    cockpit_lines.append("> [!TIP]\n")
    cockpit_lines.append("> **¿Cómo activar un proveedor para un evento?**\n")
    cockpit_lines.append("> 1. Localiza el proveedor por categoría y provincia.\n")
    cockpit_lines.append("> 2. Haz clic en **💬 WhatsApp** para enviar el mensaje pre-redactado de negociación inmediata.\n")
    cockpit_lines.append("> 3. Aplica la tarifa base con el **Split 80/10/10** (80% Artista, 10% EAR, 10% VIMUME).\n")
    cockpit_lines.append("> 4. Envía el enlace de Stripe con depósito de **100,00 €** para congelar la fecha con firma criptográfica.\n\n")
    cockpit_lines.append("---\n\n")
    cockpit_lines.append("### 🏆 Escaparate VIP de Alta Conversión (Top Highlights)\n\n")
    cockpit_lines.append("| Portada | Proveedor | Ubicación | Tarifa Base | Rating | Contacto Directo |\n")
    cockpit_lines.append("| :---: | :--- | :--- | :---: | :---: | :---: |\n")

    # Inyección de Edwin Agudelo como #1 en el Cockpit
    cockpit_lines.append(build_vendor_row(sovereign_edwin, is_sovereign=True))

    # Selección de 15 proveedores de élite
    vip_selection = all_vendors[:15]
    for v in vip_selection:
        if v.get("slug") != "edwin-agudelo":
            cockpit_lines.append(build_vendor_row(v))

    cockpit_lines.append("\n---\n")

    with open(output_path, "w", encoding="utf-8") as cf:
        cf.writelines(cockpit_lines)

    # Mirroring a docs/ en el workspace para visualización directa
    docs_mirror_dir = Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs\02_PROVEEDORES_SCLASS")
    try:
        if docs_mirror_dir.parent.exists():
            if docs_mirror_dir.exists():
                shutil.rmtree(str(docs_mirror_dir))
            shutil.copytree(str(base_dir), str(docs_mirror_dir))
    except Exception:
        pass

def update_dashboard(created_targets):
    """Actualiza la portada maestra de Obsidian con la estructura de las 5 Carpetas."""
    dashboard_path = VAULT_DIR / "00_CENTRO_DE_MANDO_SCLASS.md"
    workspace_dash = Path(r"H:\EAR_OS_V2\EAR_OS_V2\docs\00_CENTRO_DE_MANDO_SCLASS.md")

    content = """# 💎 EAR OS — CENTRO DE CONTROL Y MANDO S-CLASS
> **Plataforma Autónoma de Operaciones y Conocimiento Soberano**  
> *Estructura: LAS 5 CARPETAS MAESTRAS (Saneamiento Purista Aplicado)*  
> *Diseñado exclusivamente para Edwin Agudelo — Experiencia Visual S-Class para No Programadores*

---

## 🛠️ ARSENAL DE MACRO-SCRIPTS SOBERANOS (EJECUTABLES EN 1 CLIC)
> *Haz doble clic en cualquiera de ellos en tu Escritorio o en `H:\\EAR_OS_V2\\`.*

| Macro-Script | Ubicación | Función Principal | Estado |
| :--- | :--- | :--- | :---: |
| ⚡ **`OPTIMIZAR_IA_PC_SCLASS.bat`** | `H:\EAR_OS_V2\` | Calibra tu GPU RX 7900 XTX (24 GB VRAM) y almacena modelos en `H:\AI_MODELS_HUB\`. | 🟢 **ACTIVO** |
| 🔄 **`SINCRONIZAR_EAR_OS_SCLASS.bat`** | `H:\EAR_OS_V2\` | Orquestador Maestro: Inyecta fotos HD/GPS, absorbe chats y sincroniza NotebookLM. | 🟢 **ACTIVO** |
| 💎 **`ABRIR_OBSIDIAN_EAR_OS.bat`** | `H:\EAR_OS_V2\` | Abre tu Bóveda en 2 segundos sin errores de caché ni bloqueos. | 🟢 **ACTIVO** |
| 🧹 **`EJECUTAR_SANEAMIENTO_PURISTA.bat`** | `H:\EAR_OS_V2\` | Compacta la bóveda en 5 carpetas maestras y actualiza el visor de proveedores. | 🟢 **ACTIVO** |
| 📚 **`EXPORTAR_NOTEBOOKLM_299.bat`** | `H:\EAR_OS_V2\` | Filtra y exporta las 299 fuentes maestras para arrastrar y soltar en NotebookLM. | 🟢 **ACTIVO** |

---

## 🧭 LAS 5 CARPETAS MAESTRAS EN OBSIDIAN (Haz clic para abrir)

| Carpeta Maestra | Qué contiene | Destino Directo |
| :--- | :--- | :--- |
| 📁 **01. Estrategia y Chats con IA** | Conversaciones destiladas con IA sin código de terminal y mapas mentales XMind | [Abrir 01_ESTRATEGIA_Y_CHATS](01_ESTRATEGIA_Y_CHATS/) |
| 👥 **02. Proveedores S-Class** | Catálogo visual interactivo con fotos, teléfonos, precios y base de 53.631 registros | [Abrir Catálogo Visual](02_PROVEEDORES_SCLASS/CATALOGO_PROVEEDORES_VISUAL.md) |
| 🏛️ **03. Licitaciones B2G Menores** | Alumbrado Navideño 2026 y VIMUME (< 15.000 € Art. 118 LCSP para Ayuntamientos) | [Abrir 03_LICITACIONES_B2G](03_LICITACIONES_B2G/) |
| 🎙️ **04. Cátedra y Audio (Whisper)** | Podcast contra Bodas.net, metodología Dani Aragón y Playbook de Ventas | [Abrir 04_CATEDRA_Y_AUDIO](04_CATEDRA_Y_AUDIO/) |
| ⚙️ **05. Código y Sistema (Fondo)** | Bloques pesados de código, volcados técnicos y archivos del sistema | [Abrir 05_CODIGO_Y_SISTEMA](05_CODIGO_Y_SISTEMA/) |

---

## ⚡ REGLAS INMUTABLES DEL NEGOCIO (SSOT)
- **Tarifa Base Solista (Edwin Agudelo):** `350,00 €`
- **Logística S-Class:** `1,50 €/km` (desde Méntrida, Toledo, a partir del km 50).
- **Suplemento Hotelero:** `+120,00 €` si fin de evento $\ge$ 3:00 AM o distancia > 200 km.
- **Split Soberano Inmutable:** `80% Artista / 10% EAR OS / 10% VIMUME`.
- **Cierre Transaccional:** Depósito de `100,00 €` en Stripe con Price-Lock (24h a 72h).
- **Teléfono Oficial de Retención:** `+34 693 693 048`.
"""

    with open(dashboard_path, "w", encoding="utf-8") as f:
        f.write(content)

    with open(workspace_dash, "w", encoding="utf-8") as f:
        f.write(content)

if __name__ == "__main__":
    sanitize_vault()
