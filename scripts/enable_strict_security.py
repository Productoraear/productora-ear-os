import os

print("🔒 ACTIVANDO MODO DE SEGURIDAD MILITAR ESTRICTO (ZERO-TRUST)...")

env_file = r"H:\EAR_OS_V2\EAR_OS_V2\.env.local"
env_content = ""
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8", errors="ignore") as f:
        env_content = f.read()

strict_vars = {
    "EAR_STRICT_SECURITY": "true",
    "EAR_ADMIN_EMAIL": "productoraear@gmail.com",
    "EAR_ADMIN_PASSWORD": "TuNuevaContraseñaMilitar2026!",
    "RESEND_API_KEY": "re_123456789_tu_api_key_aqui", # Opcional para envio de mail en la nube
    "SMTP_HOST": "smtp.gmail.com",
    "SMTP_PORT": "587",
    "SMTP_USER": "productoraear@gmail.com",
    "SMTP_PASS": "tu_contraseña_de_aplicacion_gmail"
}

with open(env_file, "a", encoding="utf-8") as f:
    for k, v in strict_vars.items():
        if k not in env_content:
            f.write(f"\n{k}={v}")
            print(f"🔑 Variable de Seguridad Estricta añadida: {k}")

print("✅ .env.local actualizado a MODO ZERO-TRUST ESTRICTO.")
