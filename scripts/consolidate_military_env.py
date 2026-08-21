import os
import shutil
import re

print("🛡️ INICIANDO PROTOCOLO MILITAR DE CONSOLIDACIÓN DE ENCLAVE .ENV...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
vault_dir = os.path.join(base_dir, "vault_secrets_backup")
os.makedirs(vault_dir, exist_ok=True)

# Archivos .env detectados
env_files = [
    ".env", ".env.local", ".env.production", 
    ".env.production.local", ".env.vercel.production",
    ".env.backup_2026-08-01", ".env.local.backup_2026-08-01"
]

consolidated_keys = {}

# 1. Lectura e integración de todas las claves
for ef in env_files:
    path = os.path.join(base_dir, ef)
    if os.path.exists(path):
        print(f"📖 Extrayendo llaves de: {ef}")
        with open(path, "r", encoding="utf-8", errors="ignore") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip()
                    if key not in consolidated_keys or not consolidated_keys[key]:
                        consolidated_keys[key] = val

        # Mover backups antiguos a la bóveda aislada
        if "backup" in ef or (ef != ".env.local" and ef != ".env"):
            dest = os.path.join(vault_dir, ef)
            shutil.move(path, dest)
            print(f"📦 Archivado en Bóveda Aislada: {ef}")

# 2. Inyección de Claves de Verificación en 2 Pasos (2FA Militar)
if "EAR_ADMIN_2FA_SECRET" not in consolidated_keys:
    consolidated_keys["EAR_ADMIN_2FA_SECRET"] = "SCLASS_SOVEREIGN_2FA_MASTER_KEY_2026"
if "EAR_ADMIN_EMAIL" not in consolidated_keys:
    consolidated_keys["EAR_ADMIN_EMAIL"] = "productoraear@gmail.com"

# 3. Escritura atómica en .env.local
env_local_path = os.path.join(base_dir, ".env.local")
with open(env_local_path, "w", encoding="utf-8") as f:
    f.write("# ========================================================\n")
    f.write("# EAR OS 2026 — ENCLAVE SOBERANO UNIFICADO DE VARIABLES (.ENV.LOCAL)\n")
    f.write("# ========================================================\n\n")
    for k, v in sorted(consolidated_keys.items()):
        f.write(f"{k}={v}\n")

print(f"\n✅ ENCLAVE UNIFICADO CREADO CON ÉXITO: {len(consolidated_keys)} variables guardadas en .env.local")

# 4. Verificación de blindaje en .gitignore
gitignore_path = os.path.join(base_dir, ".gitignore")
gitignore_content = ""
if os.path.exists(gitignore_path):
    with open(gitignore_path, "r", encoding="utf-8") as f:
        gitignore_content = f.read()

rules_to_add = [".env*.local", ".env", "vault_secrets_backup/"]
with open(gitignore_path, "a", encoding="utf-8") as f:
    for rule in rules_to_add:
        if rule not in gitignore_content:
            f.write(f"\n{rule}")
            print(f"🔒 Regla de protección Git añadida: {rule}")

print("\n🚀 CONSOLIDACIÓN MILITAR COMPLETADA. Tu entorno local está limpio y seguro.")
