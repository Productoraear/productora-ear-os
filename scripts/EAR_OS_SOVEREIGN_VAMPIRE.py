import os
import json
import time
import random
import re
import requests
from bs4 import BeautifulSoup
from datetime import datetime

print("🧛 CONSTRUYENDO MOTOR ÚNICO: EAR_OS_SOVEREIGN_VAMPIRE v1.0...")

base_dir = r"H:\EAR_OS_V2\EAR_OS_V2"
db_path = os.path.join(base_dir, "src", "data", "all_providers_database.json")
state_path = os.path.join(base_dir, "vampire_state.json")
log_path = os.path.join(base_dir, "vampire_sovereign.log")

if not os.path.exists(db_path):
    print("❌ Base de datos maestra no encontrada.")
    exit()

with open(db_path, "r", encoding="utf-8") as f:
    providers = json.load(f)

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0"
]

def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    entry = f"[{ts}] {msg}"
    print(entry)
    with open(log_path, "a", encoding="utf-8") as lf:
        lf.write(entry + "\n")

def clean_watermark(url):
    if not url: return ""
    clean = re.sub(r'/thumb_\d+x\d+/', '/1280/', url)
    clean = re.sub(r'/watermark_[^/]+/', '/', clean)
    clean = re.sub(r'/st-logo[^/]+/', '/', clean)
    return clean.split('?')[0]

log("🚀 Motor Vampiro Único e Infalible Inicializado.")
log(f"📊 {len(providers)} proveedores listos para procesamiento continuo.")
