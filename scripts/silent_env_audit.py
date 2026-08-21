import os
import re

print("🔎 INICIANDO AUDITORÍA SILENCIOSA ZERO-KNOWLEDGE DE .ENV.LOCAL...")

env_file = r"H:\EAR_OS_V2\EAR_OS_V2\.env.local"

if not os.path.exists(env_file):
    print("❌ ERROR CRÍTICO: No se encuentra el archivo .env.local en la ruta esperada.")
    exit()

with open(env_file, "r", encoding="utf-8", errors="ignore") as f:
    lines = f.readlines()

parsed_vars = {}
syntax_errors = []

for idx, line in enumerate(lines, 1):
    line_str = line.strip()
    if line_str and not line_str.startswith("#"):
        if "=" in line_str:
            k, v = line_str.split("=", 1)
            parsed_vars[k.strip()] = v.strip()
        else:
            syntax_errors.append(f"Línea {idx}: Sintaxis inválida (falta '='): '{line_str}'")

print("\n" + "="*70)
print("📊 INFORME DE DIAGNÓSTICO DE AMBIENTE LOCAL")
print("="*70)

# Verificación de Variables Críticas
critical_keys = [
    ("EAR_ADMIN_EMAIL", "Correo de Administrador"),
    ("EAR_ADMIN_PASSWORD", "Contraseña Master"),
    ("EAR_ADMIN_2FA_SECRET", "Secreto TOTP/2FA"),
    ("NEXTAUTH_SECRET", "Firma Criptográfica JWT"),
    ("NEXT_PUBLIC_SUPABASE_URL", "URL Supabase"),
    ("NEXT_PUBLIC_SUPABASE_ANON_KEY", "Llave Anónima Supabase")
]

all_pass = True
for key, desc in critical_keys:
    if key in parsed_vars and len(parsed_vars[key]) > 0:
        val_len = len(parsed_vars[key])
        is_default = parsed_vars[key] in ["EscribeAquiTuContraseñaSegura2026!", "123456"]
        
        status_flag = "⚠️ VALOR POR DEFECTO (Cámbialo antes de Producción)" if is_default else "✅ CORRECTO"
        if is_default:
            all_pass = False

        print(f"🔑 {key:<30} | {desc:<25} | Longitud: {val_len} caracteres | {status_flag}")
    else:
        print(f"❌ {key:<30} | {desc:<25} | MISSING / VACÍO")
        all_pass = False

print("\n" + "-"*70)
if syntax_errors:
    print("⚠️ ERRORES DE SINTAXIS DETECTADOS:")
    for err in syntax_errors:
        print(f"  • {err}")
else:
    print("✅ Sintaxis general de .env.local: 100% VÁLIDA (Sin errores de parsing).")

print(f"📊 Total de Variables Consolidadas en .env.local: {len(parsed_vars)}")

if all_pass and not syntax_errors:
    print("\n🚀 DICTAMEN FINAL: .env.local ESTÁ LISTO PARA PRODUCCIÓN Y TOTALMENTE SALUDABLE.")
else:
    print("\n⚠️ DICTAMEN FINAL: Revisa los avisos marcados arriba antes de desplegar a Vercel.")
