import os
import re

print("[*] INICIANDO AUDITORIA FORENSE DE MODULOS DE AUTENTICACION EN EL PROYECTO...")

src_dir = r"H:\EAR_OS_V2\EAR_OS_V2\src"

auth_keywords = [
    "google", "apple", "facebook", "meta", "oauth", 
    "supabase", "next-auth", "firebase", "2fa", "totp", 
    "passkey", "biometric", "role", "jwt", "login", "auth"
]

found_assets = {}

for root, dirs, files in os.walk(src_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts', '.js', '.jsx', '.json')):
            full_path = os.path.join(root, file)
            rel_path = os.path.relpath(full_path, src_dir)
            
            try:
                with open(full_path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read().lower()
                    matches = [kw for kw in auth_keywords if kw in content]
                    if len(matches) >= 2 or any(k in file.lower() for k in ['auth', 'login', 'user', 'session']):
                        found_assets[rel_path] = matches
            except Exception:
                pass

print("\n" + "="*70)
print(f"[*] COMPONENTES Y MODULOS AUTH DETECTADOS ({len(found_assets)} archivos):")
print("="*70)

for path, tags in sorted(found_assets.items(), key=lambda x: len(x[1]), reverse=True)[:25]:
    print(f"-> src\\{path}")
    print(f"   Matches: {', '.join(tags[:6])}\n")
