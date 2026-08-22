import os
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

print("======================================================================")
print("AUDITORIA FORENSE COMPLETA: PROGRAMA DE AFILIADOS Y COMISIONES EAR OS")
print("======================================================================")

# 1. RAG Database Inspection
rag_path = 'src/data/ear-rag-database.json'
if os.path.exists(rag_path):
    with open(rag_path, 'r', encoding='utf-8') as f:
        rag = json.load(f)
    aff_nodes = [
        n for n in rag 
        if any(term in (n.get('title', '') + ' ' + n.get('content', '')).lower() 
               for term in ['afiliad', 'affiliate', 'programa de afiliados', 'embajador', 'commissionledger', 'split soberano'])
    ]
    print(f"\n[1] NODOS EN BOVEDA RAG RELACIONADOS: {len(aff_nodes)}")
    for n in aff_nodes[:20]:
        print(f"  * [{n.get('category', 'GENERAL')}] {n.get('title')}")

# 2. Files and UI Components in Codebase
print("\n[2] ARCHIVOS DE CODIGO Y COMPONENTES DEL PROGRAMA DE AFILIADOS:")
for root, dirs, files in os.walk('src'):
    for f in files:
        if any(term in f.lower() for term in ['affiliat', 'afiliad', 'referral', 'payout', 'commission']):
            full = os.path.join(root, f)
            print(f"  * {full} ({os.path.getsize(full)} bytes)")

# 3. Routes, Hooks and Security Gates
print("\n[3] RUTAS, HOOKS Y RBAC EN EL CODIGO:")
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.ts', '.tsx', '.js', '.jsx')):
            full = os.path.join(root, f)
            try:
                with open(full, 'r', encoding='utf-8', errors='ignore') as code_file:
                    text = code_file.read()
                    if 'ROLE_AFFILIATE' in text or 'isAffiliate' in text or '/panel/afiliado' in text or 'ear_referrals' in text:
                        print(f"  * {full}")
            except:
                pass

# 4. Strategy Documents
print("\n[4] DOCUMENTOS DE ESTRATEGIA Y ARQUITECTURA:")
for root, dirs, files in os.walk('src'):
    for f in files:
        if f.endswith(('.md', '.txt')):
            full = os.path.join(root, f)
            try:
                with open(full, 'r', encoding='utf-8', errors='ignore') as doc_file:
                    text = doc_file.read()
                    if 'affiliate' in text.lower() or 'afiliado' in text.lower() or 'red de afiliados' in text.lower():
                        print(f"  * {full}")
            except:
                pass
