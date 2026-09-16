"""
EAR OS // ZERO-TOKEN MEMORY (ZTM) S-CLASS VISUAL DASHBOARD v1.0
Servidor local 100% soberano on-premise (0€ cloud, 0 dependencias externas).
Visualiza la memoria de tareas, reglas SSOT inmutables y estado de procesos.
"""
import os
import json
import webbrowser
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.responses import HTMLResponse

app = FastAPI(title="EAR OS // Zero-Token Memory Bridge")

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
QUEUE_PATH = os.path.join(BASE_DIR, ".antigravity", "tasks_queue.json")
HISTORY_PATH = os.path.join(BASE_DIR, ".antigravity", "tasks_history.json")

SSOT_RULES = [
    {"label": "Tarifa Solista Edwin Agudelo", "val": "350,00 € (Base oficial)"},
    {"label": "Split Soberano", "val": "80% Artista / 10% EAR OS / 10% Prescriptor"},
    {"label": "Logística Méntrida Km 0", "val": "1,50 €/km desde km 50 (+120 € hotel si fin >= 3:00 AM o >200 km)"},
    {"label": "Depósito de Reserva Stripe", "val": "100,00 € con Price-Lock SHA-256"},
    {"label": "Contratación Menor B2G", "val": "< 14.250,00 € (Ajuste preventivo Art. 118 LCSP)"},
    {"label": "Rider Acústico Oficial", "val": "12 W/pax (Bose F1 Model 812 / S1 Pro, < 75 dB SPL)"},
    {"label": "Estética Visual S-Class", "val": "OLED puro (#030305), Syne, Inter, Oro #ecb613"}
]

def load_json_safe(path):
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

@app.get("/ui", response_class=HTMLResponse)
@app.get("/", response_class=HTMLResponse)
def render_dashboard():
    queue_data = load_json_safe(QUEUE_PATH)
    history_data = load_json_safe(HISTORY_PATH)

    tasks = queue_data.get("tasks", [])
    history = history_data.get("history", [])

    pending_count = len([t for t in tasks if t.get("status") != "COMPLETED"])
    completed_count = len(history)

    # Renderizar tareas activas en HTML
    tasks_html = ""
    for idx, t in enumerate(tasks[:20]):
        status_color = "#ecb613" if t.get("status") == "PENDING" else "#27ae60"
        tasks_html += f"""
        <div style="background:#0e0e11; border:1px solid #1f1f26; border-left:4px solid {status_color}; border-radius:10px; padding:12px 16px; margin-bottom:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="font-family:monospace; font-size:11px; color:#888;">{t.get('id', 'task')}</span>
                <span style="font-size:10px; font-weight:bold; background:rgba(236,182,19,0.15); color:{status_color}; padding:2px 8px; border-radius:4px; text-transform:uppercase;">{t.get('status', 'PENDING')}</span>
            </div>
            <div style="color:#fff; font-weight:600; font-size:13px; margin:6px 0 2px 0;">{t.get('title', 'Sin título')}</div>
            <div style="color:#777; font-size:11px; font-weight:300;">{t.get('description', '')[:140]}...</div>
        </div>
        """

    # Renderizar reglas SSOT
    rules_html = ""
    for r in SSOT_RULES:
        rules_html += f"""
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1a1a22; font-size:12px;">
            <span style="color:#bbb;">{r['label']}</span>
            <span style="color:#ecb613; font-family:monospace; font-weight:bold;">{r['val']}</span>
        </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>EAR OS // Zero-Token Memory Bridge</title>
        <style>
            body {{
                background-color: #030305;
                color: #e5e5e5;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                margin: 0;
                padding: 24px;
            }}
            .header {{
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #222;
                padding-bottom: 16px;
                margin-bottom: 24px;
            }}
            .logo {{
                font-size: 18px;
                font-weight: 900;
                letter-spacing: 2px;
                color: #ecb613;
            }}
            .card {{
                background: #09090c;
                border: 1px solid #1a1a22;
                border-radius: 14px;
                padding: 20px;
                margin-bottom: 20px;
            }}
            .metric {{
                font-size: 28px;
                font-weight: 900;
                color: #fff;
                font-family: monospace;
            }}
            .grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                gap: 16px;
                margin-bottom: 24px;
            }}
            .layout {{
                display: grid;
                grid-template-columns: 2fr 1fr;
                gap: 20px;
            }}
            @media (max-width: 900px) {{
                .layout {{ grid-template-columns: 1fr; }}
            }}
            .btn {{
                background: #ecb613;
                color: #000;
                border: none;
                padding: 10px 18px;
                font-weight: 800;
                border-radius: 8px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
                font-size: 12px;
                letter-spacing: 0.5px;
            }}
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo">⚡ EAR OS // ZERO-TOKEN MEMORY (ZTM) BRIDGE</div>
            <div>
                <span style="font-size:12px; color:#27ae60; background:rgba(39,174,96,0.1); border:1px solid #27ae60; padding:4px 10px; border-radius:6px; font-weight:bold;">
                    ● 100% SOBERANO ON-PREMISE (0€ CLOUD)
                </span>
            </div>
        </div>

        <div class="grid">
            <div class="card">
                <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Tareas Activas en Cola</div>
                <div class="metric" style="color:#ecb613;">{pending_count}</div>
            </div>
            <div class="card">
                <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Tareas Archivadas (Historial)</div>
                <div class="metric" style="color:#27ae60;">{completed_count}</div>
            </div>
            <div class="card">
                <div style="font-size:11px; color:#888; text-transform:uppercase; letter-spacing:1px; margin-bottom:6px;">Tokens Consumidos</div>
                <div class="metric" style="color:#00E5FF;">0 <span style="font-size:12px; color:#666;">(Zero-Token Protocol)</span></div>
            </div>
        </div>

        <div class="layout">
            <div>
                <div class="card">
                    <h3 style="margin-top:0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#bbb;">
                        Autopista de Tareas Pendientes (tasks_queue.json)
                    </h3>
                    <div style="max-height:550px; overflow-y:auto;">
                        {tasks_html if tasks_html else '<p style=\"color:#666; font-size:13px;\">No hay tareas pendientes en la cola.</p>'}
                    </div>
                </div>
            </div>

            <div>
                <div class="card">
                    <h3 style="margin-top:0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#ecb613;">
                        Doctrina SSOT Inmutable (AGENTS.md)
                    </h3>
                    {rules_html}
                </div>

                <div class="card">
                    <h3 style="margin-top:0; font-size:14px; text-transform:uppercase; letter-spacing:1px; color:#bbb;">
                        Acciones de Mando
                    </h3>
                    <p style="color:#777; font-size:11px;">El supervisor en segundo plano purga automáticamente las tareas completadas a tasks_history.json cada vez que el obrero finaliza una tarea.</p>
                    <a href="/ui" class="btn" style="width:100%; box-sizing:border-box; text-align:center;">↻ REFRESCAR ESTADO</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    """
    return html

def open_browser():
    webbrowser.open("http://localhost:8000/ui")

if __name__ == "__main__":
    print("======================================================================")
    print("  EAR OS // ZERO-TOKEN MEMORY (ZTM) S-CLASS VISUAL BRIDGE")
    print("======================================================================")
    print(">> Servidor local activo en: http://localhost:8000/ui")
    print(">> Abriendo panel visual en tu navegador...")
    threading.Timer(1.5, open_browser).start()
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="warning")
