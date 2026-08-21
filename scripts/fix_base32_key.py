import os

print("🛡️ APLICANDO ALINEACIÓN BASE32 RFC 4648 PARA GOOGLE AUTHENTICATOR...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
new_secret = "EAROSSOVEREIGN26"

# 1. ACTUALIZAR .ENV.LOCAL
env_local = os.path.join(base_dir, ".env.local")
if os.path.exists(env_local):
    with open(env_local, "r", encoding="utf-8", errors="ignore") as f:
        lines = f.readlines()
    
    new_lines = []
    found = False
    for line in lines:
        if line.startswith("EAR_ADMIN_2FA_SECRET="):
            new_lines.append(f"EAR_ADMIN_2FA_SECRET={new_secret}\n")
            found = True
        else:
            new_lines.append(line)
    
    if not found:
        new_lines.append(f"\nEAR_ADMIN_2FA_SECRET={new_secret}\n")
        
    with open(env_local, "w", encoding="utf-8") as f:
        f.writelines(new_lines)
    print("✅ .env.local actualizado con clave Base32 alineada.")

# 2. ACTUALIZAR API DE VERIFICACIÓN
verify_file = os.path.join(base_dir, "src", "app", "api", "auth", "admin-verify", "route.ts")
if os.path.exists(verify_file):
    with open(verify_file, "r", encoding="utf-8") as f:
        code = f.read()
    
    updated_code = code.replace("EAROS2FASECRETKEY32", new_secret)
    with open(verify_file, "w", encoding="utf-8") as f:
        f.write(updated_code)
    print("✅ API /api/auth/admin-verify actualizada con la nueva clave Base32.")

print("\n" + "="*70)
print(f"🔑 NUEVA CLAVE VÁLIDA PARA GOOGLE AUTHENTICATOR: {new_secret}")
print("="*70)
