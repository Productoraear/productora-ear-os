import os

print("🛡️ INYECTANDO VARIABLE EAR_ADMIN_PASSWORD EN .ENV.LOCAL...")

env_local_path = r"H:\EAR_OS_V2\EAR_OS_V2\.env.local"

# Contraseña y 2FA configurados
password_to_inject = "TuNuevaContraseñaMilitar2026!"
secret_2fa_to_inject = "SCLASS_SOVEREIGN_2FA_MASTER_KEY_2026"

lines = []
if os.path.exists(env_local_path):
    with open(env_local_path, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()

updated = False
has_pass = False
has_2fa = False

new_lines = []
for line in lines:
    if line.startswith("EAR_ADMIN_PASSWORD="):
        new_lines.append(f"EAR_ADMIN_PASSWORD={password_to_inject}\n")
        has_pass = True
        updated = True
    elif line.startswith("EAR_ADMIN_2FA_SECRET="):
        new_lines.append(f"EAR_ADMIN_2FA_SECRET={secret_2fa_to_inject}\n")
        has_2fa = True
        updated = True
    else:
        new_lines.append(line)

if not has_pass:
    new_lines.append(f"\nEAR_ADMIN_PASSWORD={password_to_inject}\n")
    updated = True

if not has_2fa:
    new_lines.append(f"EAR_ADMIN_2FA_SECRET={secret_2fa_to_inject}\n")
    updated = True

with open(env_local_path, "w", encoding="utf-8") as f:
    f.writelines(new_lines)

print(f"✅ Clave EAR_ADMIN_PASSWORD inyectada correctamente en: {env_local_path}")
print(f"🔑 Valor asignado: {password_to_inject}")
