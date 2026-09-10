import re

path = r"H:\00_PRODUCTORA_EAR\EAR_ABSORBED_VAULT\HISTORIC_AI_CHATS\SESSION_066359b6-dd26-4c3d-b49b-ca96c39f0c12.md"
with open(path, "r", encoding="utf-8", errors="ignore") as f:
    content = f.read()

# Look for file paths around MATCHMAKING & ATMOSFERA
for m in re.finditer(r'(?:File Path|target_file|file:)[^\n]+', content, re.IGNORECASE):
    s = m.group(0).encode('ascii', 'ignore').decode('ascii')
    if any(k in s.lower() for k in ['tsx', 'ts', 'match', 'atmosfera', 'presupuesto', 'cotiz', 'sonoriz', 'tinder', 'pricer', 'tool']):
        print(s)

seen = set()
for m in re.finditer(r'(?:src[\\/][a-zA-Z0-9_\-\\/]+\.(?:tsx|ts|jsx|js))', content):
    p = m.group(0).encode('ascii', 'ignore').decode('ascii')
    if p not in seen and any(k in p.lower() for k in ['match', 'atmosfera', 'presupuesto', 'cotiz', 'sonoriz', 'tinder', 'pricer', 'tool']):
        seen.add(p)
        print("Relevant file:", p)
