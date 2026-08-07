# 🎯 EAR OS — DATA TRUTH LAYERS

> **Capas de Verdad de Datos:** Separación lógica y representación gráfica en la interfaz entre datos en vivo, datos estimados, confirmados, históricos y bloqueados por seguridad.

---

## 1. Clasificación de Capas de Verdad

```
🟢 CAPA 1: DATO EN VIVO (Live Telemetry)
   └── Coordenadas GPS con timestamp < 30s. Línea continua en mapa.

🟡 CAPA 2: DATO ESTIMADO (Inferred Dead Reckoning)
   └── Proyección matemática de posición en carretera. Línea punteada en amarillo.

🔵 CAPA 3: DATO CONFIRMADO (Database Ledger / Waybill)
   └── Eventos validados en base de datos (ej. "Check-in en Finca Prados Moros realizado").

📜 CAPA 4: DATO HISTÓRICO (Immutable Audit Logs)
   └── Registros pasados de giras finalizadas. No modificable por usuarios.

🔒 CAPA 5: DATO BLOQUEADO POR SEGURIDAD (RBAC Restricted)
   └── Coordenadas sensibles de clientes VIP o embajadas. Ocultas según rol.
```

## 2. Código de Colores UI (Stitch System)
- **Verde Esmeralda (`#10b981`):** Vivo / Confirmado.
- **Amarillo Ámbar (`#ecb613`):** Estimado / Advertencia.
- **Rojo Carmesí (`#ef4444`):** Degradado / Incidencia P0.
- **Gris Muted (`#6b7280`):** Histórico / Archivo.
