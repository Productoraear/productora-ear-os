import os
import secrets

print("🛡️ GENERANDO E INYECTANDO NEXTAUTH_SECRET DE GRADO MILITAR...")

env_file = r"H:\EAR_OS_V2\EAR_OS_V2\.env.local"

# Generar clave secreta aleatoria de 64 caracteres hex (256 bits de entropía)
new_jwt_secret = secrets.token_hex(32)

content = ""
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()

# Verificar si la clave existe vacía o no existe
if "NEXTAUTH_SECRET=" in content:
    lines = content.splitlines()
    new_lines = []
    for line in lines:
        if line.startswith("NEXTAUTH_SECRET="):
            new_lines.append(f"NEXTAUTH_SECRET={new_jwt_secret}")
        else:
            new_lines.append(line)
    updated_content = "\n".join(new_lines) + "\n"
else:
    updated_content = content.rstrip() + f"\n\n# Firma Criptográfica JWT\nNEXTAUTH_SECRET={new_jwt_secret}\n"

with open(env_file, "w", encoding="utf-8") as f:
    f.write(updated_content)

print("=================================================");
print(f"✅ NEXTAUTH_SECRET inyectado con éxito: {new_jwt_secret[:12]}... (64 caracteres)")
print("=================================================");
