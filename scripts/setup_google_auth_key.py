import os

print("🛡️ CONFIGURANDO CLAVE BASE32 PARA GOOGLE AUTHENTICATOR Y EDITORES...")

env_file = r"H:\EAR_OS_V2\EAR_OS_V2\.env.local"
content = ""
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

# Clave Base32 válida para Google Authenticator (RFC 4648)
base32_secret = "EAROS2FASECRETKEY32"
editor_pass = "EditorAutorizadoEAR2026!"

updates = {
    "EAR_ADMIN_2FA_SECRET": base32_secret,
    "EAR_EDITOR_PASSWORD": editor_pass
}

with open(env_file, "a", encoding="utf-8") as f:
    for k, v in updates.items():
        if k not in content:
            f.write(f"\n{k}={v}")
            print(f"🔑 {k} añadida a .env.local")

print(f"\n✅ Clave Base32 para Google Authenticator: {base32_secret}")
print(f"🔑 Contraseña para Editores Autorizados: {editor_pass}")
