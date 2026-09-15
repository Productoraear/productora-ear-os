"""
QUEUE AUTO-GARDENER (S-CLASS ZTM PROTOCOL)
Monitorea .antigravity/tasks_queue.json y archiva automaticamente las tareas
COMPLETED en .antigravity/tasks_history.json para mantener la cola siempre
en menos de 150 lineas y evitar que Cline desborde la VRAM.
"""
import json
import time
import os

QUEUE_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".antigravity", "tasks_queue.json")
HISTORY_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".antigravity", "tasks_history.json")

def prune_queue():
    if not os.path.exists(QUEUE_PATH):
        return

    try:
        with open(QUEUE_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)

        tasks = data.get("tasks", [])
        completed = [t for t in tasks if t.get("status") in ["COMPLETED", "SUPERSEDED"]]
        pending = [t for t in tasks if t.get("status") not in ["COMPLETED", "SUPERSEDED"]]

        if not completed:
            return

        # Cargar historial existente
        history_tasks = []
        if os.path.exists(HISTORY_PATH):
            try:
                with open(HISTORY_PATH, "r", encoding="utf-8") as hf:
                    hdata = json.load(hf)
                    history_tasks = hdata.get("history", [])
            except Exception:
                history_tasks = []

        # Agregar tareas completadas al historial sin duplicados por ID
        existing_ids = {t.get("id") for t in history_tasks}
        new_history = history_tasks + [t for t in completed if t.get("id") not in existing_ids]

        with open(HISTORY_PATH, "w", encoding="utf-8") as hf:
            json.dump({"history": new_history}, hf, indent=2, ensure_ascii=False)

        # Reescribir la cola con solo pendientes
        data["tasks"] = pending
        with open(QUEUE_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"[{time.strftime('%H:%M:%S')}] Auto-Gardener: {len(completed)} tareas archivadas. Cola activa: {len(pending)} tareas.")

    except Exception as e:
        print(f"[{time.strftime('%H:%M:%S')}] Error en Auto-Gardener: {e}")

if __name__ == "__main__":
    prune_queue()
