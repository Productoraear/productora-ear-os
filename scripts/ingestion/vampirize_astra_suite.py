#!/usr/bin/env python3
"""
🚀 VAMPIRIZADOR S-CLASS: SUITE ESTRATÉGICA ASTRA & HERRAMIENTAS INTELIGENTES
Integra de forma 100% aditiva los 8 motores de decisión, boveda de conocimiento, 
frameworks cognitivos y componentes de Astra en EAR OS v2.1.
"""

import os
import shutil
import json
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ASTRA_SOURCE = os.path.join(BASE_DIR, 'scratch', 'astra_extracted')
ASTRA_TARGET = os.path.join(BASE_DIR, 'src', 'features', 'astra')
RAG_DB_PATH = os.path.join(BASE_DIR, 'src', 'data', 'ear-rag-database.json')

os.makedirs(ASTRA_TARGET, exist_ok=True)

def vampirize_astra():
    print("=" * 70)
    print("[*] VAMPIRIZANDO SUITE ASTRA ESTRATEGICA // ADITIVO S-CLASS...")
    print("=" * 70)

    # 1. Copiar y transformar arbol de archivos
    for root, dirs, files in os.walk(ASTRA_SOURCE):
        rel_path = os.path.relpath(root, ASTRA_SOURCE)
        target_dir = os.path.join(ASTRA_TARGET, rel_path) if rel_path != '.' else ASTRA_TARGET
        os.makedirs(target_dir, exist_ok=True)

        for file in files:
            if file in ['package.json', 'vite.config.ts', 'tsconfig.json', 'index.html', 'index.tsx', '.gitignore', '.env.local', '.env.example', 'README.md', 'metadata.json']:
                continue # Omitir configuraciones standalone de Vite

            src_file = os.path.join(root, file)
            dest_file = os.path.join(target_dir, file)

            with open(src_file, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()

            # Asegurar directiva 'use client' en componentes TSX/JSX
            if file.endswith('.tsx') or file.endswith('.jsx'):
                if not content.startswith('"use client"') and not content.startswith("'use client'"):
                    content = '"use client";\n\n' + content

            # Ajustar imports si es necesario
            with open(dest_file, 'w', encoding='utf-8') as f:
                f.write(content)

            print(f"[+] Archivo integrado: {os.path.relpath(dest_file, BASE_DIR)}")

    # 2. Ingestar nuggets de knowledgeBase.ts en ear-rag-database.json
    print("\n[*] Inyectando Base de Conocimiento Astra en Boveda RAG...")
    
    ASTRA_KNOWLEDGE_NUGGETS = [
        {
            "id": "ASTRA-KB-FIRST-PRINCIPLES",
            "title": "First Principles Thinking in High-Stakes Decisions (Astra Framework)",
            "category": "DECISION_FRAMEWORKS",
            "content": "Deconstruct complex dilemmas into foundational truths and build solutions upward from those axioms rather than reasoning by superficial analogy.",
            "tags": ["Astra", "Mental Models", "Strategy", "Decision Making", "First Principles"]
        },
        {
            "id": "ASTRA-KB-VALUE-LADDER",
            "title": "Value Ladder Architecture for Creative Enterprises (Astra Framework)",
            "category": "MONETIZACION_ESTRATEGICA",
            "content": "Structure offerings across free hook, entry-level tripwire, core flagship product, and high-ticket mastermind tiers to capture full customer lifetime value.",
            "tags": ["Astra", "Monetization", "Pricing", "Value Ladder", "Business Models"]
        },
        {
            "id": "ASTRA-KB-ASYMMETRIC-NARRATIVE",
            "title": "Asymmetrical Narrative Resonance (Astra Framework)",
            "category": "POSICIONAMIENTO_ASIMETRICO",
            "content": "People do not buy products; they buy better versions of themselves. Anchor campaigns around transformative tension and audience identity shifts.",
            "tags": ["Astra", "Positioning", "Copywriting", "Brand Narrative", "Asymmetry"]
        },
        {
            "id": "ASTRA-KB-MASTER-RIGHTS-DEFENSE",
            "title": "Master Rights & Recoupment Defense (Astra Framework)",
            "category": "LEGAL_IP_DEFENSE",
            "content": "Always delineate mechanical royalties from performance rights, and safeguard ownership reversion clauses when negotiating upstream publishing deals. Limit recoupment strictly to master recording receipts.",
            "tags": ["Astra", "IP Law", "Contracts", "Royalties", "Rights", "Split 80/10/10"]
        },
        {
            "id": "ASTRA-KB-ANTIFRAGILE-RISK",
            "title": "Antifragile Risk Positioning (Astra Framework)",
            "category": "GESTION_DE_RIESGOS",
            "content": "Design strategic bets such that downside volatility is strictly capped with negligible ruin probability, while upside yields non-linear compounding returns.",
            "tags": ["Astra", "Risk Management", "Antifragility", "Venture Strategy"]
        },
        {
            "id": "ASTRA-KB-MAKER-VS-MANAGER",
            "title": "Maker vs. Manager Execution Cadence (Astra Framework)",
            "category": "PRODUCTIVIDAD_EJECUTIVA",
            "content": "Protect deep work uninterrupted blocks for creative generation, segregating operational administration and multi-stakeholder syncing into batch windows.",
            "tags": ["Astra", "Productivity", "Focus", "Cognitive Bandwidth"]
        },
        {
            "id": "ASTRA-KB-CAC-LTV-EQUILIBRIUM",
            "title": "CAC, LTV, and Churn Equilibrium (Astra Framework)",
            "category": "UNIT_ECONOMICS",
            "content": "A sustainable enterprise maintains LTV:CAC >= 3:1 while keeping monthly cohort churn below acceptable industry thresholds (under 3-5% for SaaS/membership models).",
            "tags": ["Astra", "Unit Economics", "Metrics", "Glossary"]
        },
        {
            "id": "ASTRA-KB-SECOND-ORDER-FORECASTING",
            "title": "Second-Order Consequence Forecasting (Astra Framework)",
            "category": "PROSPECTIVA_ESTRATEGICA",
            "content": "Ask: 'And then what?' When evaluating strategic maneuvers, anticipate the counter-actions of competitors, partners, and audience dynamics.",
            "tags": ["Astra", "Game Theory", "Strategic Foresight"]
        }
    ]

    if os.path.exists(RAG_DB_PATH):
        try:
            with open(RAG_DB_PATH, 'r', encoding='utf-8') as f:
                rag_db = json.load(f)

            existing_ids = {n.get("id") for n in rag_db}
            added_count = 0

            for nugget in ASTRA_KNOWLEDGE_NUGGETS:
                if nugget["id"] not in existing_ids:
                    rag_db.insert(0, nugget)
                    added_count += 1
                else:
                    idx = next(i for i, n in enumerate(rag_db) if n.get("id") == nugget["id"])
                    rag_db[idx] = nugget

            with open(RAG_DB_PATH, 'w', encoding='utf-8') as f:
                json.dump(rag_db, f, ensure_ascii=False, indent=2)

            print(f"[+] Inyectados {added_count} nuevos nodos Astra en RAG Database (Total: {len(rag_db)} nodos).")
        except Exception as e:
            print(f"[-] Error inyectando en RAG: {e}")

    print("\n" + "=" * 70)
    print("[+] VAMPIRIZACION Y COHESION DE ASTRA COMPLETADA.")
    print("=" * 70)

if __name__ == '__main__':
    vampirize_astra()
