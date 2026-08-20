import os

target_path = r"src\app\components\SClassScreens\BespokeTemplate.tsx"

if not os.path.exists(target_path):
for base in [r"H:\EAR_OS_V2\EAR_OS_V2", r"C:\EAR_OS_V2\EAR_OS_V2", "."]:
    p = os.path.join(base, target_path)
    if os.path.exists(p):
        target_path = p
        break

if os.path.exists(target_path):
with open(target_path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Eliminar dobles signos de interrogacion antes del punto
content = content.replace("??.", "?.")

# Reemplazar la definicion de capitalizedLocation con un ternario seguro
lines = content.splitlines()
new_lines = []
for line in lines:
    if "capitalizedLocation" in line:
        new_lines.append("  const capitalizedLocation = location ? (location.charAt(0).toUpperCase() + location.slice(1)) : '';")
    else:
        new_lines.append(line)

with open(target_path, "w", encoding="utf-8") as f:
    f.write("\n".join(new_lines))
print("✅ Sintaxis corregida limpiamente en BespokeTemplate.tsx")
else:
print("⚠️ No se encontró BespokeTemplate.tsx")
