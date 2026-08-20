import os
import shutil

ROOT_DIR = r"C:\EAR_OS_V2"

# Destinos canónicos
DEST_DOCS = os.path.join(ROOT_DIR, "docs", "knowledge")
DEST_SCRIPTS = os.path.join(ROOT_DIR, "scripts", "tools")
DEST_INBOX = os.path.join(ROOT_DIR, "00_INBOX_COGNITIVO")

# Clasificación estricta
FILES_TO_DOCS = [
    "00_MOC_MAESTRO.md", "AGENTS.md", "ANTIGRAVITY_CONTINUITY.md", "AuraWallet.md",
    "CLAUDE.md", "CLINE_RULES_V2.md", "CLINE_RULES_V3.md", "DEPLOYCERTIFICATE.md",
    "EAR_OS_OMEGA_PROMPTS.md", "INVENTARIO_TOTAL.md", "Manual EarOS.md",
    "Manual_EarOS.md", "SEO_DOMINANCE_PLAN.md", "SOVEREIGN_GENOMA.md"
]

FILES_TO_SCRIPTS = [
    "Dominancia_EAR.ps1", "Dominancia_EAR_SClass - copia.ps1", "Dominancia_EAR_v2_LEGACY.ps1",
    "Dominancia_EAR_v3.ps1", "Dominancia_EAR_v3_DOMINANCIA_OK.ps1",
    "Dominancia_EAR_v3_PRE_COMPATIBILIDAD.ps1", "INICIAR_DOMINANCIA.bat",
    "INICIAR_EAR_OS.ps1", "INICIAR_EAR_OS_CON_ERROR.ps1", "INICIAR_VAMPIRE_AGENT.ps1",
    "recuperar_adn.ps1", "audit_crawler.ts"
]

FILES_TO_INBOX = [
    ".A hoja de ruta despues de la busqueda de datos .txt",
    "Cómo_jubilar_al_Cumpleaños y las mañanitas podcast.m4a",
    ".docx",
    "EAR OS — P0 Admin Demand Map — Planificación"
]

def clean_root():
    print("🧹 INICIANDO ORGANIZACIÓN PURISTA DE LA RAÍZ EN C:\\EAR_OS_V2...")
    
    os.makedirs(DEST_DOCS, exist_ok=True)
    os.makedirs(DEST_SCRIPTS, exist_ok=True)
    os.makedirs(DEST_INBOX, exist_ok=True)

    moved_count = 0

    # 1. Mover Documentación
    for fname in FILES_TO_DOCS:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            shutil.move(src, os.path.join(DEST_DOCS, fname))
            print(f"📄 Documentación -> docs/knowledge/{fname}")
            moved_count += 1

    # 2. Mover Scripts
    for fname in FILES_TO_SCRIPTS:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            shutil.move(src, os.path.join(DEST_SCRIPTS, fname))
            print(f"⚙️ Script de Consola -> scripts/tools/{fname}")
            moved_count += 1

    # 3. Mover Archivos de Inbox / Media
    for fname in FILES_TO_INBOX:
        src = os.path.join(ROOT_DIR, fname)
        if os.path.exists(src):
            shutil.move(src, os.path.join(DEST_INBOX, fname))
            print(f"📥 Inbox Cognitivo -> 00_INBOX_COGNITIVO/{fname}")
            moved_count += 1

    print("\n==================================================")
    print(f"✅ DEPURACIÓN COMPLETADA: {moved_count} archivos reubicados.")
    print("🔒 La raíz queda totalmente despejada y con cero riesgo para el build.")
    print("==================================================\n")

if __name__ == "__main__":
    clean_root()
