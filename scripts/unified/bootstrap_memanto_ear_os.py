#!/usr/bin/env python3
"""
BOOTSTRAP MEMANTO PARA EAR OS
Inyecta la doctrina inmutable SSOT de AGENTS.md en el agente de memoria activa Memanto.
"""

import subprocess
import sys
import shutil

SSOT_CONSTRAINTS = [
    "SSOT Inmutable: Tarifa Base Solista Edwin Agudelo fijada en 350,00 €.",
    "SSOT Inmutable: Split Soberano obligatorio 80% Artista / 10% EAR OS / 10% VIMUME.",
    "SSOT Inmutable: Logística S-Class de 1,50 €/km desde Méntrida a partir del km 50 (+120 € hotel si fin >= 3:00 AM o >200 km).",
    "SSOT Inmutable: Depósito de Cierre obligatorio de 100,00 € en Stripe con Price-Lock SHA-256.",
    "SSOT Inmutable: Contrato Menor B2G (Art. 118 LCSP) tope preventivo de 14.250,00 € y presión sonora < 75 dB SPL.",
    "SSOT Inmutable: Rider Acústico oficial de 12 W/pax con Bose F1 Model 812 / S1 Pro y microfonía Shure Beta 87A.",
    "SSOT Inmutable: Estética OLED pura (#030305), tipografías Syne e Inter, acento dorado #ecb613.",
    "SSOT Inmutable: Repositorio ultra-ligero (< 50 MB) y particiones públicas Edge CDN < 1 MB."
]

def check_or_install_memanto():
    print("[MEMANTO] Verificando instalación de Memanto...")
    if shutil.which("memanto") is None:
        print("[MEMANTO] Instalando paquete memanto...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "memanto"])
    else:
        print("[MEMANTO] Memanto CLI ya está disponible.")

def seed_memories():
    print("[MEMANTO] Sembrando reglas SSOT inmutables en la memoria persistente...")
    for rule in SSOT_CONSTRAINTS:
        cmd = ["memanto", "remember", rule, "--type", "constraint"]
        try:
            subprocess.run(cmd, check=True)
            print(f"  ✓ Registrado: {rule[:60]}...")
        except Exception as e:
            print(f"  [AVISO] {e}")

    # Activar consolidación
    try:
        subprocess.run(["memanto", "schedule", "enable"], check=False)
        print("[MEMANTO] Consolidación nocturna habilitada.")
    except Exception:
        pass

def main():
    print("=== INICIALIZACIÓN DE MEMANTO AGENTIC MEMORY BRIDGE (EAR OS) ===")
    try:
        check_or_install_memanto()
        seed_memories()
        print("\n[OK] Memanto inicializado exitosamente en EAR OS.")
    except Exception as e:
        print(f"\n[ERROR] No se pudo completar el bootstrap de Memanto: {e}")

if __name__ == '__main__':
    main()
