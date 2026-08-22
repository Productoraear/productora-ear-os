# -*- coding: utf-8 -*-
import os, json, re
from bs4 import BeautifulSoup

db_path = r"H:\EAR_OS_V2\EAR_OS_V2\src\data\all_providers_database.json"
search_root = r"H:\EAR_OS_V2"

print("==================================================")
print("🔍 DIAGNÓSTICO DE ESTRUCTURA Y CLAVES DE MATCHING")
print("==================================================")

# 1. Inspeccionar JSON
with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

print(f"\n📦 MUESTRA DE 5 REGISTROS EN DATABASE.JSON (Total: {len(providers)}):")
for idx, p in enumerate(providers[:5], 1):
    print(f"  [{idx}] Name: '{p.get('name')}' | Slug/ID: '{p.get('id')}' | URL: '{p.get('url') or p.get('web') or p.get('link')}'")

# 2. Inspeccionar HTMLs
html_files = []
for root, dirs, files in os.walk(search_root):
    dirs[:] = [d for d in dirs if d.lower() not in {"node_modules", ".git", ".next", "dist", "build"}]
    for file in files:
        if file.lower().endswith((".html", ".htm")):
            html_files.append(os.path.join(root, file))

print(f"\n📄 MUESTRA DE 5 ARCHIVOS HTML LOCALES (Total: {len(html_files)}):")
for idx, h_path in enumerate(html_files[:5], 1):
    filename = os.path.basename(h_path)
    try:
        with open(h_path, "r", encoding="utf-8", errors="ignore") as f:
            soup = BeautifulSoup(f.read(), "html.parser")
            title = soup.title.string.strip() if soup.title and soup.title.string else "SIN TITLE"
            h1 = soup.find("h1").get_text(strip=True) if soup.find("h1") else "SIN H1"
            canonical = soup.find("link", rel="canonical")
            c_url = canonical["href"] if canonical and canonical.get("href") else "SIN CANONICAL"
            print(f"  [{idx}] Archivo: {filename}")
            print(f"      ├─ Title: {title}")
            print(f"      ├─ H1: {h1}")
            print(f"      └─ Canonical: {c_url}")
    except Exception as e:
        print(f"  [{idx}] Archivo: {filename} (Error al leer: {e})")

print("==================================================")
