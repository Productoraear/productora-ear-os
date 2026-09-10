#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
EAR OS DIGITAL TELEMETRY & CONSOLE HUD (PYTHON ENGINE)
Barra digital animada, telemetría de rendimiento y estados S-Class.
"""
import sys
import time

class DigitalHUD:
    def __init__(self, title="PROCESO EAR OS", total=100, bar_width=30):
        self.title = title
        self.total = max(1, total)
        self.bar_width = bar_width
        self.current = 0
        self.start_time = time.time()
        self._render_header()

    def _render_header(self):
        sys.stdout.write(f"\n  \033[96m╔══════════════════════════════════════════════════════════════════════╗\033[0m\n")
        sys.stdout.write(f"  \033[96m║  🔱 {self.title:<60}║\033[0m\n")
        sys.stdout.write(f"  \033[90m║  TELEMETRÍA DIGITAL S-CLASS // MONITOREO ACTIVO                     ║\033[0m\n")
        sys.stdout.write(f"  \033[96m╚══════════════════════════════════════════════════════════════════════╝\033[0m\n\n")
        sys.stdout.flush()

    def update(self, current, status="Procesando", item_info=""):
        self.current = current
        percent = min(100.0, max(0.0, (self.current / self.total) * 100))
        filled = int((percent / 100) * self.bar_width)
        empty = self.bar_width - filled
        bar = "█" * filled + "░" * empty

        elapsed = time.time() - self.start_time
        speed = self.current / elapsed if elapsed > 0 else 0
        
        info_cut = (item_info[:35] + '..') if len(item_info) > 37 else item_info
        
        tag = "\033[92m[DONE]\033[0m" if self.current >= self.total else "\033[93m[BUSY]\033[0m"
        line = f"\r  {tag} \033[1m[{bar}]\033[0m \033[96m{percent:5.1f}%\033[0m ({self.current}/{self.total}) | \033[90m{status}\033[0m: \033[97m{info_cut:<38}\033[0m"
        sys.stdout.write(line)
        sys.stdout.flush()

    def finish(self, message="Tarea finalizada con éxito"):
        self.update(self.total, status="Completado", item_info=message)
        sys.stdout.write(f"\n\n  \033[92m[EXIT CODE 0] {message} // Tiempo total: {time.time() - self.start_time:.2f}s\033[0m\n\n")
        sys.stdout.flush()

if __name__ == "__main__":
    # Test de demostración
    hud = DigitalHUD("TEST DE TELEMETRÍA DIGITAL", total=50)
    for i in range(1, 51):
        hud.update(i, status="Indexando", item_info=f"item_prov_{i:03d}.json")
        time.sleep(0.03)
    hud.finish("Todos los procesos sincronizados")
