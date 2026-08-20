import os

def patch_bespoke():
    target_files = []
    for base_dir in [r"H:\EAR_OS_V2", r"C:\EAR_OS_V2", "."]:
        if os.path.exists(base_dir):
            for root, dirs, files in os.walk(base_dir):
                if "BespokeTemplate.tsx" in files:
                    target_files.append(os.path.join(root, "BespokeTemplate.tsx"))

    if not target_files:
        print("⚠️ No se encontró el archivo BespokeTemplate.tsx.")
        return

    for target in set(target_files):
        print(f"🎯 Corrigiendo llamadas .slice() en: {target}")
        with open(target, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # Reemplazar .slice por ?.slice defensivo
        updated = content.replace(".slice(", "?.slice(")

        with open(target, "w", encoding="utf-8") as f:
            f.write(updated)
        print(f"✅ Parche de resiliencia aplicado con éxito en {target}")

if __name__ == "__main__":
    patch_bespoke()
