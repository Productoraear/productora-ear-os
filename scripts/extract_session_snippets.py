import re

path = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS\SESSION_066359b6-dd26-4c3d-b49b-ca96c39f0c12.md"
with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Find occurrences of deslizador, candado, lock, presupuesto, atmosfera
matches = re.finditer(r'(?:.{0,200})(?:deslizador|deslizadores|candado|bloqueo|presupuesto inverso|atm[oó]sfera)(?:.{0,300})', content, re.IGNORECASE)

print("Found snippets:")
count = 0
for m in matches:
    count += 1
    snippet = m.group(0).replace('\n', ' ')
    print(f"[{count}] {snippet[:150]}...")
    if count >= 15:
        break
